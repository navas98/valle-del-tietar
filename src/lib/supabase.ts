import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY environment variables",
  );
}

// Cliente contra la base de datos REAL: solo se usa para autenticación
// (login/registro) y para lo que cuelga directamente del usuario autenticado
// (perfiles, borrado de cuenta). Los negocios e historias de esta demo NO
// viven aquí, ver `supabaseDemo` en ./supabaseDemo.
export const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey);
