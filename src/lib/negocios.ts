import { supabase } from "./supabase";
import type { Database } from "./database.types";

export type Negocio = Database["public"]["Tables"]["negocios"]["Row"];
export type NegocioInput = Database["public"]["Tables"]["negocios"]["Insert"];
export type Favorito = Database["public"]["Tables"]["favoritos"]["Row"];

export const CATEGORIAS_NEGOCIO = [
  "Comer",
  "Dormir",
  "Qué hacer",
  "Comercio local",
  "Naturaleza",
  "Pueblos",
] as const;

// Municipios incluidos en la primera fase de lanzamiento.
export const MUNICIPIOS_DISPONIBLES = ["Sotillo de la Adrada", "La Adrada", "Piedralaves"] as const;

// Escaparate público (Explora, categorías, pueblos y mapa): solo negocios
// aprobados. RLS deja ver además los pendientes al dueño y al admin, así que
// aquí se filtra de forma explícita para que no se cuelen en los listados
// públicos cuando quien navega está logueado. La ficha de "Mi negocio" y el
// panel de administración usan fetchMiNegocio / fetchNegociosAdmin.
export async function fetchNegocios(): Promise<Negocio[]> {
  const { data, error } = await supabase.from("negocios").select("*").eq("aprobado", true);
  if (error) throw error;
  return data;
}

export async function fetchNegocioPorId(id: string): Promise<Negocio | null> {
  const { data, error } = await supabase.from("negocios").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchMiNegocio(ownerId: string): Promise<Negocio | null> {
  const { data, error } = await supabase
    .from("negocios")
    .select("*")
    .eq("owner_id", ownerId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function guardarMiNegocio(input: NegocioInput): Promise<Negocio> {
  const { data, error } = await supabase
    .from("negocios")
    .upsert(input, { onConflict: "id" })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

// Extensiones aceptadas por tipo MIME cuando el nombre del archivo no la trae
// (p. ej. capturas de pantalla al pegar). El bucket restringe estos mismos
// tipos, así que un archivo fuera de la lista lo rechaza el servidor.
const EXTENSION_POR_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
  "audio/ogg": "ogg",
  "audio/webm": "weba",
  "audio/wav": "wav",
};

export async function subirArchivoNegocio(ownerId: string, file: File): Promise<string> {
  const nombrePartes = file.name.split(".");
  const extNombre = nombrePartes.length > 1 ? nombrePartes.pop()!.toLowerCase() : "";
  const ext = extNombre || EXTENSION_POR_MIME[file.type] || "bin";
  const path = `${ownerId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("negocios")
    .upload(path, file, file.type ? { upsert: true, contentType: file.type } : { upsert: true });
  if (error) throw error;
  return supabase.storage.from("negocios").getPublicUrl(path).data.publicUrl;
}

const MARCA_PUBLICA_NEGOCIOS = "/storage/v1/object/public/negocios/";

// Borra del bucket los archivos cuyas URL públicas se pasan. Se usa al guardar
// la ficha para no dejar huérfanos los archivos que el usuario ha quitado.
// Ignora las URL que no apunten al bucket (p. ej. avatares de Google).
export async function borrarArchivosNegocio(urls: string[]): Promise<void> {
  const paths = urls
    .map((url) => {
      const i = url.indexOf(MARCA_PUBLICA_NEGOCIOS);
      return i === -1 ? null : decodeURIComponent(url.slice(i + MARCA_PUBLICA_NEGOCIOS.length));
    })
    .filter((p): p is string => Boolean(p));
  if (paths.length === 0) return;
  await supabase.storage.from("negocios").remove(paths);
}

export async function fetchMisFavoritos(
  userId: string,
): Promise<(Favorito & { negocio: Negocio })[]> {
  const { data, error } = await supabase
    .from("favoritos")
    .select("*, negocio:negocios(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as unknown as (Favorito & { negocio: Negocio })[];
}

export async function esFavorito(userId: string, negocioId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("favoritos")
    .select("id")
    .eq("user_id", userId)
    .eq("negocio_id", negocioId)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

export async function marcarFavorito(userId: string, negocioId: string): Promise<void> {
  const { error } = await supabase
    .from("favoritos")
    .insert({ user_id: userId, negocio_id: negocioId });
  if (error) throw error;
}

export async function quitarFavorito(userId: string, negocioId: string): Promise<void> {
  const { error } = await supabase
    .from("favoritos")
    .delete()
    .eq("user_id", userId)
    .eq("negocio_id", negocioId);
  if (error) throw error;
}

export async function contarFavoritosDeNegocio(negocioId: string): Promise<number> {
  const { data, error } = await supabase.rpc("contar_favoritos_negocio", {
    p_negocio_id: negocioId,
  });
  if (error) throw error;
  return data ?? 0;
}

// Gracias a RLS, esta consulta debe devolver al público solo los negocios
// aprobados y reservar los pendientes para su propietario y el administrador.
export async function fetchNegociosAdmin(): Promise<Negocio[]> {
  const { data, error } = await supabase
    .from("negocios")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function aprobarNegocio(id: string): Promise<void> {
  const { error } = await supabase.from("negocios").update({ aprobado: true }).eq("id", id);
  if (error) throw error;
}

export async function retirarNegocio(id: string): Promise<void> {
  const { error } = await supabase.from("negocios").update({ aprobado: false }).eq("id", id);
  if (error) throw error;
}

export async function eliminarNegocio(id: string): Promise<void> {
  const { error } = await supabase.from("negocios").delete().eq("id", id);
  if (error) throw error;
}
