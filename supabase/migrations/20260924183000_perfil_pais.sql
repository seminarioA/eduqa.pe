-- País de residencia del usuario, guardado como código ISO 3166-1 alpha-2.

alter table public.perfiles
  add column if not exists pais text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'perfiles_pais_iso2_check'
      and conrelid = 'public.perfiles'::regclass
  ) then
    alter table public.perfiles
      add constraint perfiles_pais_iso2_check
      check (pais is null or pais ~ '^[A-Z]{2}$');
  end if;
end
$$;

comment on column public.perfiles.pais is
  'Código ISO 3166-1 alpha-2 del país seleccionado por el usuario.';
