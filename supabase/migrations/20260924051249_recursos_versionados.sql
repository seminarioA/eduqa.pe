-- Recursos internos editables y su historial. El contenido base de redacción/API
-- sigue en el repositorio; sus ítems adicionales se administran aquí.
create table public.recurso_documentos (
  slug text primary key check (slug ~ '^[a-z0-9-]+$'),
  titulo text not null,
  resumen text not null,
  destinatarios text not null,
  version integer not null default 1 check (version > 0),
  actualizado_en timestamptz not null default now()
);

create table public.recurso_items (
  id uuid primary key default gen_random_uuid(),
  recurso_slug text not null references public.recurso_documentos(slug) on delete cascade,
  titulo text not null check (length(trim(titulo)) between 3 and 160),
  contenido text not null check (length(trim(contenido)) between 3 and 20000),
  posicion integer not null default 0,
  version integer not null default 1,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create table public.recurso_item_revisiones (
  id bigint generated always as identity primary key,
  item_id uuid not null,
  recurso_slug text not null references public.recurso_documentos(slug),
  version integer not null,
  titulo text not null,
  contenido text not null,
  posicion integer not null,
  accion text not null check (accion in ('crear', 'editar', 'eliminar')),
  autor_id uuid references auth.users(id) on delete set null,
  registrada_en timestamptz not null default now()
);

insert into public.recurso_documentos(slug, titulo, resumen, destinatarios) values
  ('redaccion', 'Cómo se escribe un curso', 'Formato, redacción y verificación previa a publicar.', 'Profesores, gestores y agentes'),
  ('api', 'API para publicar cursos', 'Envío, archivos, autenticación y respuestas de error.', 'Desarrolladores y agentes de IA'),
  ('tipos-de-preguntas', 'Tipos de preguntas', 'Formatos de evaluación y ejemplos para cursos de programación.', 'Profesores, gestores y agentes');

insert into public.recurso_items(recurso_slug, titulo, contenido, posicion) values
  ('tipos-de-preguntas', 'Verdadero o falso', 'El estudiante decide si una afirmación es correcta. Úsalo para verificar conceptos concretos y evita enunciados ambiguos.', 10),
  ('tipos-de-preguntas', 'Selección única', 'El estudiante elige una respuesta correcta entre varias opciones. Cada distractor debe representar un error plausible.', 20),
  ('tipos-de-preguntas', 'Selección múltiple', 'El estudiante marca todas las respuestas correctas. Indica expresamente que puede haber más de una.', 30),
  ('tipos-de-preguntas', 'Ordenar', 'El estudiante coloca pasos, líneas o eventos en la secuencia correcta. Ejemplo: ordenar las etapas de una petición HTTP.', 40),
  ('tipos-de-preguntas', 'Completar espacios', 'El estudiante escribe la palabra o expresión faltante en una frase o fragmento de código. Ejemplo: `for i in ____ (5):`.', 50),
  ('tipos-de-preguntas', 'Relacionar columnas', 'El estudiante vincula conceptos con definiciones, funciones con resultados o términos con ejemplos.', 60),
  ('tipos-de-preguntas', 'Respuesta corta', 'El estudiante escribe una palabra, frase o salida breve. Define equivalencias y reglas de mayúsculas antes de calificar automáticamente.', 70),
  ('tipos-de-preguntas', 'Escribir o depurar código', 'El estudiante implementa una función o corrige un error. La evaluación puede usar casos de prueba y revisión docente.', 80),
  ('tipos-de-preguntas', 'Respuesta abierta', 'El estudiante explica una decisión técnica o justifica su solución. Requiere una rúbrica y revisión docente.', 90);

create function public.registrar_revision_recurso_item() returns trigger
language plpgsql set search_path = '' as $$
declare
  anterior public.recurso_items;
  siguiente public.recurso_items;
begin
  if tg_op = 'UPDATE' then
    if new.recurso_slug <> old.recurso_slug then
      raise exception 'No se puede trasladar un ítem entre recursos';
    end if;
    new.version := old.version + 1;
    new.actualizado_en := now();
  end if;
  return new;
end;
$$;

create trigger recurso_item_antes_editar before update on public.recurso_items
for each row execute function public.registrar_revision_recurso_item();

create schema if not exists private;
create function private.guardar_revision_recurso_item() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  item public.recurso_items;
begin
  if tg_op = 'DELETE' then item := old; else item := new; end if;
  insert into public.recurso_item_revisiones
    (item_id, recurso_slug, version, titulo, contenido, posicion, accion, autor_id)
  values
    (item.id, item.recurso_slug, item.version, item.titulo, item.contenido,
     item.posicion, case tg_op when 'INSERT' then 'crear' when 'UPDATE' then 'editar' else 'eliminar' end,
     (select auth.uid()));
  update public.recurso_documentos set version = version + 1, actualizado_en = now()
    where slug = item.recurso_slug;
  return null;
end;
$$;

create trigger recurso_item_despues_cambiar after insert or update or delete on public.recurso_items
for each row execute function private.guardar_revision_recurso_item();

alter table public.recurso_documentos enable row level security;
alter table public.recurso_items enable row level security;
alter table public.recurso_item_revisiones enable row level security;

grant select on public.recurso_documentos, public.recurso_items, public.recurso_item_revisiones to authenticated;
grant insert, update, delete on public.recurso_items to authenticated;

create policy "equipo lee recursos" on public.recurso_documentos for select to authenticated
using (exists (select 1 from public.perfiles p where p.id = (select auth.uid())
  and (p.es_admin or p.rol in ('profesor', 'gestor', 'desarrollador', 'agente', 'admin'))));
create policy "equipo lee items" on public.recurso_items for select to authenticated
using (exists (select 1 from public.perfiles p where p.id = (select auth.uid())
  and (p.es_admin or p.rol in ('profesor', 'gestor', 'desarrollador', 'agente', 'admin'))));
create policy "equipo lee revisiones" on public.recurso_item_revisiones for select to authenticated
using (exists (select 1 from public.perfiles p where p.id = (select auth.uid())
  and (p.es_admin or p.rol in ('profesor', 'gestor', 'desarrollador', 'agente', 'admin'))));
create policy "administrador crea items" on public.recurso_items for insert to authenticated
with check (exists (select 1 from public.perfiles p where p.id = (select auth.uid()) and (p.es_admin or p.rol = 'admin')));
create policy "administrador edita items" on public.recurso_items for update to authenticated
using (exists (select 1 from public.perfiles p where p.id = (select auth.uid()) and (p.es_admin or p.rol = 'admin')))
with check (exists (select 1 from public.perfiles p where p.id = (select auth.uid()) and (p.es_admin or p.rol = 'admin')));
create policy "administrador elimina items" on public.recurso_items for delete to authenticated
using (exists (select 1 from public.perfiles p where p.id = (select auth.uid()) and (p.es_admin or p.rol = 'admin')));
