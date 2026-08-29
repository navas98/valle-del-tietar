import { supabase } from "./supabase";
import type { Database } from "./database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

// Gracias a RLS, esto solo devuelve algo si quien pregunta es administrador.
export async function fetchUsuariosAdmin(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

// Borra la cuenta por completo (auth.users), arrastrando en cascada su
// perfil, su negocio y sus favoritos. Solo funciona si quien llama es
// administrador (lo comprueba la Edge Function con la service role key).
export async function eliminarUsuario(userId: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke<{ error?: string }>("eliminar-usuario", {
    body: { userId },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
}
