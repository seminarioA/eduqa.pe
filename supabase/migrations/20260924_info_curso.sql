-- Ficha informativa y trazabilidad editorial de cursos.
--
-- Las fechas históricas que la plataforma nunca registró se dejan en NULL:
-- mostrar una fecha inventada sería peor que indicar que no existe el dato.
alter table public.cursos
  add column if not exists creado_en timestamptz,
  add column if not exists creado_por uuid,
  add column if not exists creado_por_nombre text,
  add column if not exists aprobado_en timestamptz,
  add column if not exists aprobado_por uuid,
  add column if not exists aprobado_por_nombre text,
  add column if not exists publicado_en timestamptz;

alter table public.cursos
  alter column creado_en set default now();

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'cursos_creado_por_fkey'
  ) then
    alter table public.cursos
      add constraint cursos_creado_por_fkey
      foreign key (creado_por) references auth.users(id) on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'cursos_aprobado_por_fkey'
  ) then
    alter table public.cursos
      add constraint cursos_aprobado_por_fkey
      foreign key (aprobado_por) references auth.users(id) on delete set null;
  end if;
end
$$;

create index if not exists cursos_creado_por_idx on public.cursos(creado_por)
where creado_por is not null;

create index if not exists cursos_aprobado_por_idx on public.cursos(aprobado_por)
where aprobado_por is not null;

-- Los nombres son instantáneas editoriales. No se amplía el SELECT de perfiles
-- a otros alumnos solo para poder pintar créditos.
update public.cursos c
set creado_por = autores.usuario_id,
    creado_por_nombre = autores.nombre
from (
  select distinct on (cc.curso_id)
    cc.curso_id,
    cc.usuario_id,
    p.nombre
  from public.curso_creadores cc
  left join public.perfiles p on p.id = cc.usuario_id
  where cc.rol = 'autor'
  order by cc.curso_id, cc.orden, cc.usuario_id
) autores
where c.id = autores.curso_id
  and c.creado_por is null;

create or replace function public.registrar_hitos_editoriales_curso()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_nombre text;
  v_publicacion_nueva boolean := false;
begin
  if v_uid is not null then
    select p.nombre into v_nombre
    from public.perfiles p
    where p.id = v_uid;
  end if;

  if tg_op = 'INSERT' then
    new.creado_en := coalesce(new.creado_en, now());
    new.creado_por := coalesce(new.creado_por, v_uid);
    new.creado_por_nombre := coalesce(nullif(new.creado_por_nombre, ''), v_nombre);
    v_publicacion_nueva := new.estado = 'publico';
  else
    new.creado_en := coalesce(new.creado_en, old.creado_en);
    new.creado_por := coalesce(new.creado_por, old.creado_por);
    new.creado_por_nombre := coalesce(new.creado_por_nombre, old.creado_por_nombre);
    v_publicacion_nueva := new.estado = 'publico'
      and old.estado is distinct from 'publico';
  end if;

  new.actualizado_en := now();

  if v_publicacion_nueva then
    new.aprobado_en := coalesce(new.aprobado_en, now());
    new.publicado_en := coalesce(new.publicado_en, now());
    new.aprobado_por := coalesce(new.aprobado_por, v_uid);
    new.aprobado_por_nombre := coalesce(
      nullif(new.aprobado_por_nombre, ''),
      v_nombre
    );
  end if;

  return new;
end;
$$;

revoke all on function public.registrar_hitos_editoriales_curso()
from public, anon, authenticated;

drop trigger if exists trg_hitos_editoriales_curso on public.cursos;
create trigger trg_hitos_editoriales_curso
before insert or update on public.cursos
for each row execute function public.registrar_hitos_editoriales_curso();

-- Cubre también la creación por API: allí auth.uid() es nulo, pero la API
-- registra después al autor real en curso_creadores.
create or replace function public.sincronizar_autoria_editorial_curso()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_nombre text;
begin
  if new.rol = 'autor' then
    select p.nombre into v_nombre
    from public.perfiles p
    where p.id = new.usuario_id;

    update public.cursos
    set creado_por = coalesce(creado_por, new.usuario_id),
        creado_por_nombre = coalesce(creado_por_nombre, v_nombre),
        creado_en = coalesce(creado_en, now())
    where id = new.curso_id;
  end if;

  return new;
end;
$$;

revoke all on function public.sincronizar_autoria_editorial_curso()
from public, anon, authenticated;

drop trigger if exists trg_sincronizar_autoria_editorial_curso
on public.curso_creadores;

create trigger trg_sincronizar_autoria_editorial_curso
after insert or update of rol, usuario_id on public.curso_creadores
for each row execute function public.sincronizar_autoria_editorial_curso();
