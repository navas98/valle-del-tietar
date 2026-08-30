import { supabase } from "./supabase";
import type { Database } from "./database.types";

export type Historia = Database["public"]["Tables"]["historias"]["Row"];

export async function fetchHistorias(): Promise<Historia[]> {
  const { data, error } = await supabase.from("historias").select("*");
  if (error) throw error;
  return data;
}
