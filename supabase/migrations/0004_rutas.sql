-- Rutas de aprendizaje: qué curso va antes de cuál.
--
-- Hasta ahora el orden de la lista era todo el criterio, así que un alumno
-- podía comprar el curso avanzado sin haber visto el de introducción y la
-- plataforma no tenía forma de saberlo. Esto lo hace explícito.
--
-- La ruta va en su propia tabla y no en una columna de texto libre: con texto
-- suelto, un error al escribir crea una ruta fantasma con un solo curso y
-- nadie se entera hasta que alguien mira el catálogo.

create table if not exists public.rutas (
  slug        text primary key,
  nombre      text not null,
  descripcion text,
  orden       int  not null default 0
);

alter table public.cursos
  add column if not exists ruta       text references public.rutas(slug) on update cascade on delete set null,
  add column if not exists posicion   int,
  -- Slugs de los cursos que conviene haber hecho antes.
  add column if not exists requisitos text[] not null default '{}';

create index if not exists cursos_ruta_idx on public.cursos (ruta, posicion);

-- Un curso no puede ser requisito de sí mismo. No cubre ciclos largos, pero
-- sí el error que de verdad se comete al teclear.
alter table public.cursos drop constraint if exists cursos_no_es_su_propio_requisito;
alter table public.cursos add constraint cursos_no_es_su_propio_requisito
  check (not (slug = any(requisitos)));

-- Y todo requisito tiene que existir. Sin esto, un slug mal escrito deja un
-- prerrequisito que nadie puede cumplir, porque apunta a un curso inexistente.
create or replace function public.valida_requisitos()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  faltante text;
begin
  select r into faltante
  from unnest(new.requisitos) as r
  where not exists (select 1 from public.cursos c where c.slug = r)
  limit 1;

  if faltante is not null then
    raise exception 'El requisito «%» no corresponde a ningún curso.', faltante;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_valida_requisitos on public.cursos;
create trigger trg_valida_requisitos
  before insert or update of requisitos on public.cursos
  for each row execute function public.valida_requisitos();

alter table public.rutas enable row level security;

-- Se lee igual que los cursos: la ruta hay que poder mostrarla antes de
-- iniciar sesión, porque es parte de lo que se decide al comprar.
drop policy if exists "rutas visibles" on public.rutas;
create policy "rutas visibles" on public.rutas
  for select to anon, authenticated using (true);

drop policy if exists "admin edita rutas" on public.rutas;
create policy "admin edita rutas" on public.rutas
  for all to authenticated
  using      (exists (select 1 from perfiles p where p.id = (select auth.uid()) and p.es_admin))
  with check (exists (select 1 from perfiles p where p.id = (select auth.uid()) and p.es_admin));
