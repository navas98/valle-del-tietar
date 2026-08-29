-- Tabla de negocios: sirve tanto a "Descubre quién mantiene vivo el Valle"
-- como al mapa y a las categorías de "¿Qué quieres descubrir?".
create table if not exists public.negocios (
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
  mapa_x numeric,
  mapa_y numeric,
  created_at timestamptz not null default now()
);

alter table public.negocios enable row level security;

-- Cualquiera puede leer el directorio (es un sitio público).
create policy "Los negocios son visibles para todos"
  on public.negocios for select
  using (true);
