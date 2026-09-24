-- Compatibilidad de perfiles con identidades creadas mediante OAuth social.
-- Google entrega normalmente name/full_name y avatar_url/picture, mientras que
-- el registro clásico de EDUQA guarda nombre en raw_user_meta_data.nombre.

create or replace function public.crear_perfil()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.perfiles (id, nombre, foto)
  values (
    new.id,
    coalesce(
      nullif(btrim(new.raw_user_meta_data->>'nombre'), ''),
      nullif(btrim(new.raw_user_meta_data->>'full_name'), ''),
      nullif(btrim(new.raw_user_meta_data->>'name'), ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'Usuario'
    ),
    coalesce(
      nullif(new.raw_user_meta_data->>'avatar_url', ''),
      nullif(new.raw_user_meta_data->>'picture', '')
    )
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke execute on function public.crear_perfil() from public, anon, authenticated;
