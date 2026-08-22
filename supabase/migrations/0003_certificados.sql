-- EDUQA.PE — certificados verificables.
-- El certificado es la fila, no el PDF. El PDF es una exportación de esta fila.

create table if not exists public.cohortes (
  id           uuid primary key default gen_random_uuid(),
  creado_en    timestamptz not null default now(),

  curso_id     text        not null,
  curso_nombre text        not null,
  horas        numeric(4,1) not null,
  dictada_en   date        not null,
  docente      text        not null default 'Alejandro Seminario',
  cerrada_en   timestamptz
);

create index if not exists cohortes_curso_idx on public.cohortes (curso_id, dictada_en desc);

-- Código público del certificado: EDUQA-<CURSO>-<AÑO>-<6 alfanum>.
-- Sin I, O, 0 ni 1 para que nadie se equivoque al dictarlo por teléfono.
create or replace function public.generar_codigo(p_curso text, p_fecha date)
returns text
language plpgsql
volatile
as $$
declare
  alfabeto constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  sufijo   text := '';
  i        int;
begin
  for i in 1..6 loop
    sufijo := sufijo || substr(alfabeto, 1 + floor(random() * length(alfabeto))::int, 1);
  end loop;
  return 'EDUQA-' || upper(p_curso) || '-' || to_char(p_fecha, 'YYYY') || '-' || sufijo;
end;
$$;

create table if not exists public.certificados (
  id             uuid primary key default gen_random_uuid(),
  emitido_en     timestamptz not null default now(),

  cohorte_id     uuid        not null references public.cohortes(id) on delete restrict,
  -- Se guarda el nombre tal cual va impreso: si el alumno se cambia el nombre
  -- después, el certificado ya emitido no debe mutar.
  alumno         text        not null,
  email          text,

  codigo         text        not null unique,
  anulado_en     timestamptz,
  motivo_anulado text
);

create index if not exists certificados_cohorte_idx on public.certificados (cohorte_id);
create unique index if not exists certificados_alumno_uidx
  on public.certificados (cohorte_id, lower(alumno));

-- Asigna el código solo, reintentando si colisiona.
create or replace function public.set_codigo()
returns trigger
language plpgsql
as $$
declare
  c        record;
  intento  text;
  n        int := 0;
begin
  if new.codigo is not null and new.codigo <> '' then
    return new;
  end if;

  select curso_id, dictada_en into c from public.cohortes where id = new.cohorte_id;

  loop
    intento := public.generar_codigo(c.curso_id, c.dictada_en);
    exit when not exists (select 1 from public.certificados where codigo = intento);
    n := n + 1;
    if n > 20 then
      raise exception 'No se pudo generar un código único para %', new.alumno;
    end if;
  end loop;

  new.codigo := intento;
  return new;
end;
$$;

drop trigger if exists trg_set_codigo on public.certificados;
create trigger trg_set_codigo
  before insert on public.certificados
  for each row execute function public.set_codigo();

-- Lo que lee la página pública /verificar/[codigo].
-- Devuelve solo lo necesario para confirmar: nada de correos ni datos internos.
create or replace view public.v_verificacion as
select
  ce.codigo,
  ce.alumno,
  co.curso_nombre,
  co.horas,
  co.dictada_en,
  co.docente,
  ce.emitido_en,
  (ce.anulado_en is null) as vigente
from public.certificados ce
join public.cohortes co on co.id = ce.cohorte_id;

alter table public.cohortes     enable row level security;
alter table public.certificados enable row level security;
revoke all on public.cohortes, public.certificados from anon, authenticated;

-- La verificación es pública a propósito: sirve para que un empleador confirme.
grant select on public.v_verificacion to anon;
