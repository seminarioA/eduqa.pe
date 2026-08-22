-- Contenido de los cursos en la base, para poder publicar sin desplegar.
--
-- Hasta ahora un curso era Markdown dentro del repositorio, leído al evaluar
-- el módulo. Añadir uno era un cambio de código: compilar, desplegar y poner
-- en riesgo todo lo demás para publicar texto.
--
-- Va en dos tablas y no en una porque el índice y el contenido no se protegen
-- igual. El catálogo necesita saber cuántas sesiones tiene un curso y cómo se
-- llaman antes de comprarlo; el material solo puede verlo quien tiene derecho.

-- Índice: público, es parte de lo que se decide al comprar.
create table if not exists public.curso_sesiones (
  curso_slug text not null references public.cursos(slug) on update cascade on delete cascade,
  archivo    text not null,
  numero     int  not null,
  titulo     text not null,
  slug       text not null,
  primary key (curso_slug, archivo)
);

-- Material: se lee con las credenciales de quien pregunta, y las políticas de
-- abajo deciden. Antes esta barrera vivía solo en la página; ahora está en la
-- base, así que ya no depende de que ninguna página se acuerde de comprobar.
create table if not exists public.curso_contenido (
  curso_slug     text not null references public.cursos(slug) on update cascade on delete cascade,
  archivo        text not null,
  contenido      text not null,
  actualizado_en timestamptz not null default now(),
  primary key (curso_slug, archivo)
);

alter table public.curso_sesiones  enable row level security;
alter table public.curso_contenido enable row level security;

drop policy if exists "indice visible" on public.curso_sesiones;
create policy "indice visible" on public.curso_sesiones
  for select to anon, authenticated
  using (exists (select 1 from public.cursos c
                 where c.slug = curso_sesiones.curso_slug and c.estado = 'publico'));

drop policy if exists "admin edita indice" on public.curso_sesiones;
create policy "admin edita indice" on public.curso_sesiones
  for all to authenticated
  using      (exists (select 1 from perfiles p where p.id = (select auth.uid()) and p.es_admin))
  with check (exists (select 1 from perfiles p where p.id = (select auth.uid()) and p.es_admin));

-- La ficha (curso.md) lleva título, resumen y área: es el escaparate y se ve
-- siempre. Las sesiones, solo con derecho de acceso.
drop policy if exists "contenido segun acceso" on public.curso_contenido;
create policy "contenido segun acceso" on public.curso_contenido
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.cursos c
      where c.slug = curso_contenido.curso_slug
        and c.estado = 'publico'
        and (curso_contenido.archivo = 'curso.md' or c.acceso_libre)
    )
    or exists (
      select 1 from public.matriculas m
      where m.curso_slug = curso_contenido.curso_slug
        and m.usuario_id = (select auth.uid())
    )
    or exists (select 1 from perfiles p where p.id = (select auth.uid()) and p.es_admin)
  );

drop policy if exists "admin edita contenido" on public.curso_contenido;
create policy "admin edita contenido" on public.curso_contenido
  for all to authenticated
  using      (exists (select 1 from perfiles p where p.id = (select auth.uid()) and p.es_admin))
  with check (exists (select 1 from perfiles p where p.id = (select auth.uid()) and p.es_admin));
