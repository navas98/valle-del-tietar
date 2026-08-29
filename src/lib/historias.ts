import { supabaseDemo } from "./supabaseDemo";
import type { Database } from "./database.types";

export type Historia = Database["public"]["Tables"]["historias"]["Row"];

export async function fetchHistorias(): Promise<Historia[]> {
  const { data, error } = await supabaseDemo.from("historias").select("*");
  if (error) throw error;
  return data;
}
