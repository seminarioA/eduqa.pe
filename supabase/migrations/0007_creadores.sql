-- Creadores de cada curso, para saber quién responde por él.
-- (Aplicada como migración `creadores_de_cursos`; se deja aquí el equivalente.)
create table if not exists public.curso_creadores (
  curso_slug text not null references public.cursos(slug) on update cascade on delete cascade,
  usuario_id uuid not null references auth.users(id) on delete cascade,
  rol        text not null default 'autor' check (rol in ('autor', 'revisor', 'docente')),
  orden      int  not null default 0,
  primary key (curso_slug, usuario_id)
);
