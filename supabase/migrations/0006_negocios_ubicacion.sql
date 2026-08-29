-- Sustituye las coordenadas x/y de la imagen ilustrada por ubicación real
-- (dirección + latitud/longitud), para poder pintar los negocios en un mapa de verdad.
alter table public.negocios
  drop column if exists mapa_x,
  drop column if exists mapa_y,
  add column if not exists direccion text,
  add column if not exists lat numeric,
  add column if not exists lng numeric;
