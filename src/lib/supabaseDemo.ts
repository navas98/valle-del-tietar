import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseDemoUrl = import.meta.env.VITE_SUPABASE_DEMO_URL;
const supabaseDemoPublishableKey = import.meta.env.VITE_SUPABASE_DEMO_PUBLISHABLE_KEY;

if (!supabaseDemoUrl || !supabaseDemoPublishableKey) {
  throw new Error(
    "Missing VITE_SUPABASE_DEMO_URL or VITE_SUPABASE_DEMO_PUBLISHABLE_KEY environment variables",
  );
}

// Cliente contra la base de datos DEMO: aquí viven los negocios e historias
// falseados que se enseñan a las empresas del valle. El login sigue yendo
// contra la base de datos real (ver ./supabase) para no mezclar usuarios
// reales con este proyecto desechable.
export const supabaseDemo = createClient<Database>(supabaseDemoUrl, supabaseDemoPublishableKey);
