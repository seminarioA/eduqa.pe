-- Clases en vivo: una edición del curso por temporada, con sus reuniones.
-- (Aplicada como `reuniones_en_vivo` y `cerrar_lectura_abierta_de_cohortes`.)
alter table public.matriculas
  add column if not exists cohorte_id uuid references public.cohortes(id) on delete set null;

create table if not exists public.reuniones (
  id uuid primary key default gen_random_uuid(),
  cohorte_id uuid not null references public.cohortes(id) on delete cascade,
  titulo text not null,
  inicia_en timestamptz not null,
  minutos int not null default 60 check (minutos between 5 and 600),
  enlace text,
  cancelada_en timestamptz,
  creada_en timestamptz not null default now()
);

-- Retirada: dejaba leer el enlace de la videollamada a cualquier cuenta.
drop policy if exists "autenticados leen cohortes" on public.cohortes;
