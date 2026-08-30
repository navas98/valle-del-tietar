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

// De momento solo se pueden dar de alta negocios de estos dos municipios.
export const MUNICIPIOS_DISPONIBLES = ["Sotillo de la Adrada", "La Adrada"] as const;

// El escaparate público y las fichas usan exclusivamente la base real.
export async function fetchNegocios(): Promise<Negocio[]> {
  const { data, error } = await supabase.from("negocios").select("*");
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

export async function subirArchivoNegocio(ownerId: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${ownerId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("negocios").upload(path, file, {
    upsert: true,
  });
  if (error) throw error;
  return supabase.storage.from("negocios").getPublicUrl(path).data.publicUrl;
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
  const { count, error } = await supabase
    .from("favoritos")
    .select("id", { count: "exact", head: true })
    .eq("negocio_id", negocioId);
  if (error) throw error;
  return count ?? 0;
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
