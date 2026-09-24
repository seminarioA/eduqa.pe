update public.cursos
set precio = case slug
  when 'fortran-fundamentos' then 0.00
  when 'fortran-calculo-cientifico' then 29.90
  when 'fortran-avanzado' then 39.90
  when 'fortran-ingenieria-software' then 49.90
  else precio
end,
actualizado_en = now()
where slug in (
  'fortran-fundamentos',
  'fortran-calculo-cientifico',
  'fortran-avanzado',
  'fortran-ingenieria-software'
);
