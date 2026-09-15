-- El prefijo identifica al curso; los cuatro dígitos identifican la revisión
-- de su material. Los enlaces siguen usando el slug estable.
alter table public.cursos
  add column codigo_base text,
  add column revision integer not null default 1,
  add column revision_hash text;

update public.cursos c
set codigo_base = codigos.codigo
from (values
  ('algebra', 'NIAP'),
  ('conjuntos', 'TCAS'),
  ('data-engineering', 'INID'),
  ('docker', 'INDO'),
  ('docker-intermedio', 'DOIN'),
  ('farmacologia', 'INFA'),
  ('fortran-avanzado', 'FOAV'),
  ('fortran-calculo-cientifico', 'FOIN'),
  ('fortran-fundamentos', 'INFO'),
  ('fortran-ingenieria-software', 'FISO'),
  ('ia-generativa', 'INIA'),
  ('polars', 'INPO'),
  ('python', 'INPY'),
  ('python-bioingenieria', 'IPBI'),
  ('redis', 'INRE'),
  ('sqlite', 'INSQ'),
  ('transformers-atencionales', 'TRAT'),
  ('vectorial', 'ICVP')
) as codigos(slug, codigo)
where c.slug = codigos.slug;

do $$
begin
  if exists (select 1 from public.cursos where codigo_base is null) then
    raise exception 'Hay cursos sin código de cuatro letras; completar el mapeo antes de publicar';
  end if;
end $$;

alter table public.cursos
  alter column codigo_base set not null,
  add constraint cursos_codigo_base_formato check (codigo_base ~ '^[A-Z]{4}$'),
  add constraint cursos_revision_rango check (revision between 1 and 9999),
  add constraint cursos_codigo_base_unico unique (codigo_base),
  add column codigo text generated always as
    (codigo_base || '-' || lpad(revision::text, 4, '0')) stored;

-- La ficha publicada y el respaldo local declaran el mismo prefijo. Las
-- fichas heredadas de TypeScript no tienen fila de Markdown que modificar.
update public.curso_contenido cc
set contenido = regexp_replace(
  cc.contenido, E'^---\r?\n', E'---\ncodigo: ' || c.codigo_base || E'\n'
)
from public.cursos c
where cc.curso_slug = c.slug
  and cc.archivo = 'curso.md'
  and cc.contenido !~ E'(^|\n)codigo:';

-- La primera revisión toma como base el material que ya existe. Guardar la
-- misma carpeta otra vez no cambia el número; un contenido distinto sí.
update public.cursos c
set revision_hash = md5(jsonb_build_object(
  'titulo', c.titulo,
  'resumen', c.resumen,
  'contenido', (
    select coalesce(jsonb_object_agg(cc.archivo, cc.contenido order by cc.archivo), '{}'::jsonb)
    from public.curso_contenido cc
    where cc.curso_slug = c.slug
  )
)::text);

create function public.registrar_revision_curso(p_slug text)
returns text
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_actual public.cursos%rowtype;
  v_hash text;
begin
  select * into v_actual from public.cursos where slug = p_slug for update;
  if not found then
    raise exception 'El curso % no existe', p_slug;
  end if;

  select md5(jsonb_build_object(
    'titulo', v_actual.titulo,
    'resumen', v_actual.resumen,
    'contenido', coalesce(jsonb_object_agg(archivo, contenido order by archivo), '{}'::jsonb)
  )::text)
    into v_hash
  from public.curso_contenido
  where curso_slug = p_slug;

  if v_actual.revision_hash is null then
    update public.cursos set revision_hash = v_hash where slug = p_slug;
  elsif v_actual.revision_hash <> v_hash then
    update public.cursos
       set revision = revision + 1, revision_hash = v_hash
     where slug = p_slug;
  end if;

  return (select codigo from public.cursos where slug = p_slug);
end;
$$;

revoke all on function public.registrar_revision_curso(text) from public, anon;
grant execute on function public.registrar_revision_curso(text) to authenticated;

-- La API de publicación ya trabajaba dentro de una transacción. Conserva esa
-- propiedad y registra exactamente una revisión al terminar de guardar.
create function public.publicar_curso_por_api(
  p_resumen text, p_slug text, p_titulo text, p_resumen_curso text,
  p_archivos jsonb, p_sesiones jsonb, p_codigo_base text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_quien uuid;
  v_codigo_actual text;
  v_archivo text;
  v_sesion jsonb;
begin
  select c.usuario_id into v_quien
  from public.claves_api c
  where c.resumen = p_resumen and c.revocada_en is null;
  if v_quien is null then
    raise exception 'clave no autorizada';
  end if;

  if jsonb_typeof(p_archivos) <> 'object' or not p_archivos ? 'curso.md'
     or jsonb_typeof(p_sesiones) <> 'array' then
    raise exception 'El material del curso no es válido';
  end if;

  select codigo_base into v_codigo_actual
  from public.cursos where slug = p_slug for update;
  if v_codigo_actual is null and p_codigo_base is null then
    raise exception 'Un curso nuevo debe declarar codigo: ABCD en curso.md';
  end if;
  if p_codigo_base is not null and p_codigo_base !~ '^[A-Z]{4}$' then
    raise exception 'El código debe tener cuatro letras mayúsculas';
  end if;
  if v_codigo_actual is not null and p_codigo_base is not null
     and v_codigo_actual <> p_codigo_base then
    raise exception 'El código de un curso existente no se puede cambiar';
  end if;

  insert into public.cursos
    (slug, titulo, resumen, precio, estado, acceso_libre, orden, codigo_base)
  values
    (p_slug, p_titulo, p_resumen_curso, 20, 'borrador', false, 99,
     coalesce(v_codigo_actual, p_codigo_base))
  on conflict (slug) do update
    set titulo = excluded.titulo, resumen = excluded.resumen;

  insert into public.curso_creadores (curso_slug, usuario_id, rol, orden)
  values (p_slug, v_quien, 'autor', 0)
  on conflict do nothing;

  delete from public.curso_contenido where curso_slug = p_slug;
  delete from public.curso_sesiones where curso_slug = p_slug;

  for v_archivo in select jsonb_object_keys(p_archivos) loop
    insert into public.curso_contenido (curso_slug, archivo, contenido)
    values (p_slug, v_archivo, p_archivos ->> v_archivo);
  end loop;

  for v_sesion in select * from jsonb_array_elements(p_sesiones) loop
    insert into public.curso_sesiones (curso_slug, archivo, numero, titulo, slug)
    values (p_slug, v_sesion ->> 'archivo', (v_sesion ->> 'numero')::int,
            v_sesion ->> 'titulo', v_sesion ->> 'slug')
    on conflict (curso_slug, archivo) do nothing;
  end loop;

  return public.registrar_revision_curso(p_slug);
end;
$$;

-- Clientes antiguos que invocan la firma original conservan la edición de
-- cursos existentes. Para dar de alta uno nuevo ya deben aportar su código.
create or replace function public.publicar_curso_por_api(
  p_resumen text, p_slug text, p_titulo text, p_resumen_curso text,
  p_archivos jsonb, p_sesiones jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.publicar_curso_por_api(
    p_resumen, p_slug, p_titulo, p_resumen_curso,
    p_archivos, p_sesiones, null::text
  );
end;
$$;
