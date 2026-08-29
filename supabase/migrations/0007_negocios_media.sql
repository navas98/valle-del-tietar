-- Galería de fotos adicionales, vídeo testimonial y audio para cada negocio.
-- "imagen" sigue siendo la foto de portada (la que ya se usa en tarjetas y listados).
alter table public.negocios
  add column if not exists fotos text[] not null default '{}',
  add column if not exists video_url text,
  add column if not exists audio_url text;
