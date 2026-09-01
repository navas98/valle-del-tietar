-- Esquema inicial limpio de Valle del Tietar.
-- No contiene usuarios, negocios, historias ni credenciales de demostracion.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text not null,
  avatar_url text,
  role text check (role in ('cliente', 'comercio')),
  distintivo boolean not null default false,
  municipio text,
  es_admin boolean not null default false,
  fecha_nacimiento date,
  pueblo_interes text,
  interes_principal text,
  email text,
  created_at timestamptz not null default now()
);

create table public.negocios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  categoria text not null check (
    categoria in ('Comer', 'Dormir', 'Qué hacer', 'Comercio local', 'Naturaleza', 'Pueblos')
  ),
  municipio text not null,
  descripcion text not null default '',
  imagen text,
  abierto boolean,
  badges text[] not null default '{}',
  direccion text,
  lat numeric,
  lng numeric,
  owner_id uuid unique references auth.users (id) on delete cascade,
  fotos text[] not null default '{}',
  video_url text,
  audio_url text,
  telefono text,
  email text,
  web text,
  instagram text,
  facebook text,
  whatsapp text,
  horario text,
  aprobado boolean not null default false,
  listo_para_instagram boolean not null default false,
  publicado_instagram_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.historias (
  id uuid primary key default gen_random_uuid(),
  persona text not null,
  negocio text not null,
  municipio text not null,
  titulo text not null,
  imagen text,
  audio_url text,
  created_at timestamptz not null default now()
);

create table public.favoritos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  negocio_id uuid not null references public.negocios (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint favoritos_usuario_negocio_unique unique (user_id, negocio_id)
);

create index negocios_created_at_idx on public.negocios (created_at desc);
create index negocios_municipio_idx on public.negocios (municipio) where aprobado;
create index negocios_categoria_idx on public.negocios (categoria) where aprobado;
create index favoritos_negocio_id_idx on public.favoritos (negocio_id);
create index idx_negocios_cola_instagram
  on public.negocios (created_at)
  where listo_para_instagram and publicado_instagram_at is null;

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

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, nombre, avatar_url, email)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      new.email,
      'Usuario'
    ),
    new.raw_user_meta_data ->> 'avatar_url',
    new.email
  );
  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

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
  else
    new.aprobado := old.aprobado;
  end if;

  return new;
end;
$$;

revoke all on function private.proteger_aprobado_negocio() from public, anon, authenticated;

create trigger negocios_proteger_aprobado
  before insert or update on public.negocios
  for each row execute function private.proteger_aprobado_negocio();

alter table public.profiles enable row level security;
alter table public.negocios enable row level security;
alter table public.historias enable row level security;
alter table public.favoritos enable row level security;

create policy "Perfil propio visible"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "Administradores ven perfiles"
  on public.profiles for select to authenticated
  using ((select private.is_admin()));

create policy "Perfil propio actualizable"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Negocios aprobados visibles anonimamente"
  on public.negocios for select to anon
  using (aprobado);

create policy "Negocios visibles para usuarios"
  on public.negocios for select to authenticated
  using (
    aprobado
    or owner_id = (select auth.uid())
    or (select private.is_admin())
  );

create policy "Propietario crea su negocio"
  on public.negocios for insert to authenticated
  with check (owner_id = (select auth.uid()));

create policy "Propietario actualiza su negocio"
  on public.negocios for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "Propietario elimina su negocio"
  on public.negocios for delete to authenticated
  using (owner_id = (select auth.uid()));

create policy "Administrador actualiza negocios"
  on public.negocios for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Administrador elimina negocios"
  on public.negocios for delete to authenticated
  using ((select private.is_admin()));

create policy "Historias visibles"
  on public.historias for select to anon, authenticated
  using (true);

create policy "Usuario ve sus favoritos"
  on public.favoritos for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Usuario guarda sus favoritos"
  on public.favoritos for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "Usuario elimina sus favoritos"
  on public.favoritos for delete to authenticated
  using (user_id = (select auth.uid()));

create or replace function public.contar_favoritos_negocio(p_negocio_id uuid)
returns bigint
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)
  from public.favoritos as f
  where f.negocio_id = p_negocio_id
    and exists (
      select 1
      from public.negocios as n
      where n.id = p_negocio_id
        and (
          n.owner_id = (select auth.uid())
          or (select private.is_admin())
        )
    );
$$;

revoke all on function public.contar_favoritos_negocio(uuid) from public, anon;
grant execute on function public.contar_favoritos_negocio(uuid) to authenticated;

grant select on public.negocios, public.historias to anon;
grant select, insert, update, delete on public.profiles, public.negocios, public.favoritos to authenticated;
grant select on public.historias to authenticated;

insert into storage.buckets (id, name, public)
values ('negocios', 'negocios', true)
on conflict (id) do update set public = excluded.public;

create policy "Fotos de negocios visibles"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'negocios');

create policy "Propietario sube fotos"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'negocios'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Propietario actualiza fotos"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'negocios'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'negocios'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Propietario elimina fotos"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'negocios'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
