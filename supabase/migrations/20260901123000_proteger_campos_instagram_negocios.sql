-- Amplia el trigger que protege campos privilegiados de negocios para que un
-- propietario no pueda colar su negocio en la cola de publicacion de Instagram
-- (listo_para_instagram / publicado_instagram_at) editando su propia ficha.
-- Solo un administrador puede tocar esos campos, igual que ya ocurria con
-- aprobado.

create or replace function private.proteger_aprobado_negocio()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if private.is_admin() then
    return new;
  end if;

  if tg_op = 'INSERT' then
    new.aprobado := false;
    new.listo_para_instagram := false;
    new.publicado_instagram_at := null;
  else
    new.aprobado := old.aprobado;
    new.listo_para_instagram := old.listo_para_instagram;
    new.publicado_instagram_at := old.publicado_instagram_at;
  end if;

  return new;
end;
$$;

revoke all on function private.proteger_aprobado_negocio() from public, anon, authenticated;
