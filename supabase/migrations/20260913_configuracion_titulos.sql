-- Tabla genérica de configuración clave/valor para EDUQA.PE
-- Usada inicialmente para títulos de secciones del catálogo editables en modo admin.

create table if not exists public.configuracion (
  clave text primary key,
  valor text not null,
  actualizado_en timestamptz not null default now()
);

-- Cualquier usuario autenticado puede leer (títulos son públicos dentro de la app)
alter table public.configuracion enable row level security;

create policy "leer_configuracion" on public.configuracion
  for select using (true);

create policy "admin_configuracion" on public.configuracion
  for all using (
    exists (
      select 1 from public.perfiles
      where id = auth.uid() and es_admin = true
    )
  );

-- Valores por defecto para los títulos de sección
insert into public.configuracion (clave, valor) values
  ('catalogo-populares', 'Más elegidos'),
  ('catalogo-rutas', 'Rutas populares'),
  ('catalogo-todos', 'Todos los cursos'),
  ('cursos-titulo-pagina', 'Cursos & Microcursos')
on conflict (clave) do nothing;
