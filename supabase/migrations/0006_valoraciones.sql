-- Valoraciones de los cursos.
--
-- Solo puede valorar quien está matriculado, y eso lo exigen las políticas,
-- no la pantalla: una valoración que cualquiera pueda dejar no informa de
-- nada y además se puede fabricar desde fuera de la aplicación.
--
-- Una persona, una valoración por curso. La clave primaria lo garantiza, así
-- que votar otra vez corrige la nota anterior en lugar de sumar una nueva.

create table if not exists public.valoraciones (
  curso_slug  text not null references public.cursos(slug) on update cascade on delete cascade,
  usuario_id  uuid not null references auth.users(id) on delete cascade,
  estrellas   int  not null check (estrellas between 1 and 5),
  comentario  text check (char_length(comentario) <= 500),
  creada_en   timestamptz not null default now(),
  primary key (curso_slug, usuario_id)
);

create index if not exists valoraciones_curso_idx on public.valoraciones (curso_slug);

alter table public.valoraciones enable row level security;

-- Cada quien ve y gobierna la suya. El promedio del catálogo no sale de aquí,
-- sale de la vista de abajo: así nadie puede listar quién valoró qué.
drop policy if exists "veo mi valoracion" on public.valoraciones;
create policy "veo mi valoracion" on public.valoraciones
  for select to authenticated
  using (usuario_id = (select auth.uid()));

drop policy if exists "valoro lo que curso" on public.valoraciones;
create policy "valoro lo que curso" on public.valoraciones
  for insert to authenticated
  with check (
    usuario_id = (select auth.uid())
    and exists (
      select 1 from public.matriculas m
      where m.curso_slug = valoraciones.curso_slug
        and m.usuario_id = (select auth.uid())
    )
  );

drop policy if exists "corrijo mi valoracion" on public.valoraciones;
create policy "corrijo mi valoracion" on public.valoraciones
  for update to authenticated
  using      (usuario_id = (select auth.uid()))
  with check (usuario_id = (select auth.uid()));

drop policy if exists "retiro mi valoracion" on public.valoraciones;
create policy "retiro mi valoracion" on public.valoraciones
  for delete to authenticated
  using (usuario_id = (select auth.uid()));

-- Lo público es el agregado, nunca las filas. `security_invoker = off` es
-- deliberado: la vista necesita leer todas las valoraciones para promediarlas,
-- pero solo deja salir el promedio y el recuento, jamás quién votó.
create or replace view public.v_valoraciones
with (security_invoker = off) as
select
  curso_slug,
  round(avg(estrellas)::numeric, 2) as promedio,
  count(*)::int                     as total
from public.valoraciones
group by curso_slug;

revoke all on public.v_valoraciones from anon, authenticated;
grant select on public.v_valoraciones to anon, authenticated;
