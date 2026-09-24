insert into public.recurso_documentos
  (slug, titulo, resumen, destinatarios, version, actualizado_en)
values
  (
    'animaciones-ui',
    'Animaciones UI',
    'Catálogo visual de patrones de animación e interacción para componentes de EDUQA.PE.',
    'Diseño, desarrollo y agentes de IA',
    1,
    now()
  )
on conflict (slug) do update
set
  titulo = excluded.titulo,
  resumen = excluded.resumen,
  destinatarios = excluded.destinatarios,
  actualizado_en = now();
