-- EDUQA.PE — lista de interés de la landing de marca.
-- Llena la columna N° INTERESADOS del Excel, que hoy está vacía.

create table if not exists public.interesados (
  id              uuid primary key default gen_random_uuid(),
  creado_en       timestamptz not null default now(),

  nombre          text not null,
  email           text not null,
  whatsapp        text not null,

  -- IDs de curso del catálogo (IA01, DK02, …). Lo que la persona quiere aprender.
  cursos          text[] not null default '{}',
  -- Nivel que declara. Alimenta CPR.
  nivel_declarado text,
  -- Canal de llegada. Alimenta LADA y CPL.
  origen          text,

  avisado_en      timestamptz,
  notas           text
);

create unique index if not exists interesados_email_uidx
  on public.interesados (lower(email));

create index if not exists interesados_creado_idx on public.interesados (creado_en desc);
create index if not exists interesados_cursos_idx on public.interesados using gin (cursos);

alter table public.interesados enable row level security;
revoke all on public.interesados from anon, authenticated;

-- Demanda por curso: esto es lo que copias al Excel.
create or replace view public.v_demanda_por_curso as
select
  curso_id,
  count(*) as interesados
from public.interesados, unnest(cursos) as curso_id
group by curso_id
order by interesados desc;

-- De dónde vienen. Para saber si LinkedIn está funcionando o no.
create or replace view public.v_demanda_por_origen as
select
  coalesce(origen, 'sin dato') as origen,
  count(*)                     as personas
from public.interesados
group by 1
order by personas desc;
