// El campo "web" de un negocio lo escribe su dueño y luego se pinta como
// href en la ficha pública. Sin validar el esquema, un valor como
// "javascript:..." se ejecutaría al hacer clic otro usuario (XSS almacenado).
// Solo se aceptan http(s); si no trae esquema se asume https.

export function normalizarUrlExterna(entrada: string | null | undefined): string | null {
  const valor = entrada?.trim();
  if (!valor) return null;

  const conEsquema = /^[a-z][a-z0-9+.-]*:/i.test(valor) ? valor : `https://${valor}`;

  let url: URL;
  try {
    url = new URL(conEsquema);
  } catch {
    return null;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  return url.toString();
}
