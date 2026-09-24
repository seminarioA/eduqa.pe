-- Las sesiones abiertas deben recibir cambios editoriales sin que el alumno
-- tenga que recargar la pestaña. RLS sigue decidiendo qué filas puede recibir
-- cada suscriptor; añadir las tablas a la publicación no omite esas políticas.

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'cursos'
  ) then
    alter publication supabase_realtime add table public.cursos;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'curso_contenido'
  ) then
    alter publication supabase_realtime add table public.curso_contenido;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'curso_sesiones'
  ) then
    alter publication supabase_realtime add table public.curso_sesiones;
  end if;
end
$$;
