-- Roles del equipo, claves de API y publicación de cursos por API.
-- (Aplicada como `roles_y_claves_api`, `funciones_api_cursos` y
--  `corregir_ambiguedad_publicar_curso`.)
alter table public.perfiles
  add column if not exists rol text not null default 'alumno'
  check (rol in ('alumno','profesor','gestor','desarrollador','agente','admin'));

create table if not exists public.claves_api (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  nombre text not null,
  prefijo text not null,
  resumen text not null unique,   -- SHA-256 de la clave; la clave no se guarda
  creada_en timestamptz not null default now(),
  ultimo_uso timestamptz,
  revocada_en timestamptz
);
