-- Vincula cada negocio a la cuenta (comercio) que lo dio de alta.
alter table public.negocios
  add column if not exists owner_id uuid references auth.users (id) on delete cascade;

create policy "Un negocio puede crear su propia ficha"
  on public.negocios for insert
  with check (auth.uid() = owner_id);

create policy "Un negocio edita su propia ficha"
  on public.negocios for update
  using (auth.uid() = owner_id);

create policy "Un negocio borra su propia ficha"
  on public.negocios for delete
  using (auth.uid() = owner_id);

-- Bucket público para las fotos de los negocios.
insert into storage.buckets (id, name, public)
values ('negocios', 'negocios', true)
on conflict (id) do nothing;

create policy "Cualquiera puede ver las fotos de negocios"
  on storage.objects for select
  using (bucket_id = 'negocios');

create policy "Un negocio sube fotos a su propia carpeta"
  on storage.objects for insert
  with check (bucket_id = 'negocios' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Un negocio actualiza sus propias fotos"
  on storage.objects for update
  using (bucket_id = 'negocios' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Un negocio borra sus propias fotos"
  on storage.objects for delete
  using (bucket_id = 'negocios' and (storage.foldername(name))[1] = auth.uid()::text);
