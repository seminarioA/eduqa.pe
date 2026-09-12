-- Una persona cuenta una vez por curso, aunque haya comprado y se haya
-- matriculado. Los pagos pendientes no representan compras realizadas.
-- Se conserva el nombre de la columna para las tarjetas ya publicadas.
create or replace view public.v_popularidad as
select curso_slug, count(*)::integer as matriculas
from (
  select curso_slug, usuario_id
  from public.matriculas
  where estado in ('activa', 'completada')

  union

  select curso_slug, usuario_id
  from public.pagos
  where estado = 'pagado' and curso_slug is not null
) as personas
group by curso_slug;
