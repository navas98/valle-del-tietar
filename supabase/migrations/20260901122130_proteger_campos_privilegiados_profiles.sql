-- Impide que un usuario autenticado se conceda privilegios administrativos
-- o distintivos mediante la politica de actualizacion de su propio perfil.

create or replace function private.proteger_perfil()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if private.is_admin() then
    return new;
  end if;

  new.es_admin := old.es_admin;
  new.distintivo := old.distintivo;
  return new;
end;
$$;

revoke all on function private.proteger_perfil() from public, anon, authenticated;

create trigger profiles_proteger_campos
  before update on public.profiles
  for each row execute function private.proteger_perfil();
