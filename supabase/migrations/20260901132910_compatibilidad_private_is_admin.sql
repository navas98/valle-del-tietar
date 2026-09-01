-- Produccion conserva public.is_admin(), mientras que la baseline actual y
-- los triggers defensivos usan la version interna del esquema private.

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select p.es_admin from public.profiles as p where p.id = (select auth.uid())),
    false
  );
$$;

revoke all on function private.is_admin() from public, anon, authenticated;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;
