create table if not exists public.historias (
  id uuid primary key default gen_random_uuid(),
  persona text not null,
  negocio text not null,
  municipio text not null,
  titulo text not null,
  imagen text,
  audio_url text,
  created_at timestamptz not null default now()
);

alter table public.historias enable row level security;

create policy "Las historias son visibles para todos"
  on public.historias for select
  using (true);

insert into public.historias (persona, negocio, municipio, titulo, imagen) values
  ('Marta Jiménez', 'Mesón La Adrada', 'Sotillo de la Adrada', 'Volvimos a abrir con la mitad de la plantilla.', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=900&q=80'),
  ('Ángel Rubio', 'Miel del Tiétar', 'Piedralaves', 'El monte se recupera, y nosotros con él.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&q=80'),
  ('Lucía y Dani', 'Casa Rural El Pinar', 'Piedralaves', 'Cada reserva es una razón para seguir.', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=900&q=80'),
  ('Carmen Díaz', 'Horno de la Plaza', 'La Adrada', 'El pueblo entero volvió a oler a pan recién hecho.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&q=80'),
  ('Rubén Sáez', 'Asador El Roble', 'La Adrada', 'Perdimos la terraza en el incendio. La reconstruimos con ayuda del pueblo.', 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=900&q=80'),
  ('Isabel Moreno', 'Hostal Sotillo', 'Sotillo de la Adrada', 'Cada turista que vuelve es una prueba de que esto merece la pena.', 'https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=900&q=80');


