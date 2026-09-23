-- Backlog votable de cursos futuros.
-- Un usuario autenticado dispone de un solo voto por día (America/Lima) y
-- nunca puede votar dos veces por la misma propuesta. El voto es irreversible.

create or replace function public.es_usuario_interno()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.perfiles p
    where p.id = (select auth.uid())
      and (
        p.es_admin
        or p.rol in ('profesor','gestor','desarrollador','agente','admin')
      )
  );
$$;

revoke all on function public.es_usuario_interno() from public, anon;
grant execute on function public.es_usuario_interno() to authenticated;

create table if not exists public.propuestas_curso (
  id uuid primary key default gen_random_uuid(),
  titulo text not null check (char_length(titulo) between 3 and 140),
  subtitulo text not null default '' check (char_length(subtitulo) <= 240),
  precio numeric(10,2) not null default 20 check (precio >= 0),
  icono text not null default 'libro' check (char_length(icono) between 1 and 40),
  nivel text not null default 'INTRODUCCIÓN'
    check (nivel in ('INTRODUCCIÓN','INTERMEDIO','AVANZADO')),
  area text not null check (char_length(area) between 2 and 80),
  estado text not null default 'borrador'
    check (estado in (
      'borrador',
      'en_votacion',
      'priorizado',
      'en_desarrollo',
      'publicado',
      'descartado'
    )),
  prioridad_interna int not null default 0
    check (prioridad_interna between 0 and 100),
  creado_por uuid not null references auth.users(id) on delete restrict,
  curso_slug text references public.cursos(slug) on update cascade on delete set null,
  creada_en timestamptz not null default now(),
  actualizada_en timestamptz not null default now()
);

create index if not exists propuestas_curso_estado_idx
  on public.propuestas_curso (estado);

create table if not exists public.votos_propuesta_curso (
  propuesta_id uuid not null
    references public.propuestas_curso(id) on delete restrict,
  usuario_id uuid not null
    references auth.users(id) on delete cascade,
  dia_lima date not null
    default ((now() at time zone 'America/Lima')::date),
  creado_en timestamptz not null default now(),
  primary key (propuesta_id, usuario_id),
  unique (usuario_id, dia_lima)
);

create index if not exists votos_propuesta_curso_propuesta_idx
  on public.votos_propuesta_curso (propuesta_id);

create or replace function public.marcar_actualizada_propuesta_curso()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.actualizada_en := now();
  return new;
end;
$$;

drop trigger if exists propuestas_curso_actualizada_en on public.propuestas_curso;
create trigger propuestas_curso_actualizada_en
before update on public.propuestas_curso
for each row execute function public.marcar_actualizada_propuesta_curso();

alter table public.propuestas_curso enable row level security;
alter table public.votos_propuesta_curso enable row level security;

drop policy if exists "leo propuestas visibles o internas" on public.propuestas_curso;
create policy "leo propuestas visibles o internas"
on public.propuestas_curso
for select to authenticated
using (
  estado in ('en_votacion','priorizado','en_desarrollo','publicado')
  or public.es_usuario_interno()
);

drop policy if exists "internos crean propuestas" on public.propuestas_curso;
create policy "internos crean propuestas"
on public.propuestas_curso
for insert to authenticated
with check (
  public.es_usuario_interno()
  and creado_por = (select auth.uid())
);

drop policy if exists "internos editan propuestas" on public.propuestas_curso;
create policy "internos editan propuestas"
on public.propuestas_curso
for update to authenticated
using (public.es_usuario_interno())
with check (public.es_usuario_interno());

drop policy if exists "veo mis votos o soy interno" on public.votos_propuesta_curso;
create policy "veo mis votos o soy interno"
on public.votos_propuesta_curso
for select to authenticated
using (
  usuario_id = (select auth.uid())
  or public.es_usuario_interno()
);

revoke all on public.propuestas_curso from anon, authenticated;
revoke all on public.votos_propuesta_curso from anon;
-- El id puede leerse para que PostgREST pueda filtrar UPDATE por clave.
-- prioridad_interna y creado_por no tienen SELECT directo: solo salen por la
-- vista interna, que comprueba el rol antes de devolver filas.
grant select (id) on public.propuestas_curso to authenticated;
grant insert, update on public.propuestas_curso to authenticated;
grant select on public.votos_propuesta_curso to authenticated;
revoke insert, update, delete on public.votos_propuesta_curso from authenticated;

create or replace view public.v_proximos_cursos
with (security_invoker = false) as
select
  p.id,
  p.titulo,
  p.subtitulo,
  p.precio,
  p.icono,
  p.nivel,
  p.area,
  p.estado,
  p.curso_slug,
  p.creada_en,
  count(v.propuesta_id)::int as votos
from public.propuestas_curso p
left join public.votos_propuesta_curso v
  on v.propuesta_id = p.id
where p.estado in ('en_votacion','priorizado','en_desarrollo','publicado')
group by
  p.id, p.titulo, p.subtitulo, p.precio, p.icono, p.nivel, p.area,
  p.estado, p.curso_slug, p.creada_en;

revoke all on public.v_proximos_cursos from anon;
grant select on public.v_proximos_cursos to authenticated;

-- La prioridad editorial y los borradores no salen por la vista pública.
-- Esta vista solo devuelve filas cuando el JWT pertenece a un rol interno.
create or replace view public.v_propuestas_curso_internas
with (security_invoker = false) as
select
  p.id,
  p.titulo,
  p.subtitulo,
  p.precio,
  p.icono,
  p.nivel,
  p.area,
  p.estado,
  p.prioridad_interna,
  p.creado_por,
  p.curso_slug,
  p.creada_en,
  p.actualizada_en,
  count(v.propuesta_id)::int as votos
from public.propuestas_curso p
left join public.votos_propuesta_curso v
  on v.propuesta_id = p.id
where public.es_usuario_interno()
group by
  p.id, p.titulo, p.subtitulo, p.precio, p.icono, p.nivel, p.area,
  p.estado, p.prioridad_interna, p.creado_por, p.curso_slug,
  p.creada_en, p.actualizada_en;

revoke all on public.v_propuestas_curso_internas from anon;
grant select on public.v_propuestas_curso_internas to authenticated;

create or replace function public.votar_propuesta_curso(p_propuesta_id uuid)
returns date
language plpgsql
security definer
set search_path = public
as $$
declare
  v_usuario uuid := (select auth.uid());
  v_hoy date := ((now() at time zone 'America/Lima')::date);
  v_estado text;
begin
  if v_usuario is null then
    raise exception using
      errcode = '42501',
      message = 'Debes iniciar sesión para votar.';
  end if;

  select estado
    into v_estado
  from public.propuestas_curso
  where id = p_propuesta_id;

  if not found or v_estado <> 'en_votacion' then
    raise exception using
      errcode = 'P0001',
      message = 'Esta propuesta no está recibiendo votos.';
  end if;

  if exists (
    select 1
    from public.votos_propuesta_curso
    where propuesta_id = p_propuesta_id
      and usuario_id = v_usuario
  ) then
    raise exception using
      errcode = 'P0001',
      message = 'Ya votaste por este curso.';
  end if;

  if exists (
    select 1
    from public.votos_propuesta_curso
    where usuario_id = v_usuario
      and dia_lima = v_hoy
  ) then
    raise exception using
      errcode = 'P0001',
      message = 'Ya usaste tu voto de hoy.';
  end if;

  insert into public.votos_propuesta_curso
    (propuesta_id, usuario_id, dia_lima)
  values
    (p_propuesta_id, v_usuario, v_hoy);

  return v_hoy;
exception
  when unique_violation then
    if exists (
      select 1
      from public.votos_propuesta_curso
      where propuesta_id = p_propuesta_id
        and usuario_id = v_usuario
    ) then
      raise exception using
        errcode = 'P0001',
        message = 'Ya votaste por este curso.';
    end if;

    raise exception using
      errcode = 'P0001',
      message = 'Ya usaste tu voto de hoy.';
end;
$$;

revoke all on function public.votar_propuesta_curso(uuid) from public, anon;
grant execute on function public.votar_propuesta_curso(uuid) to authenticated;
