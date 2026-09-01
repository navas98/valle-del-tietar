-- El bucket "negocios" es publico y cualquier propietario puede subir a su
-- carpeta. Se limita a imagenes, video y audio y a 50 MiB por archivo para
-- que no se pueda usar como almacenamiento arbitrario ni servir HTML/SVG
-- con scripts desde un dominio propio del proyecto.

update storage.buckets
set
  file_size_limit = 52428800,
  allowed_mime_types = array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'audio/mpeg',
    'audio/mp4',
    'audio/ogg',
    'audio/webm',
    'audio/wav'
  ]
where id = 'negocios';
