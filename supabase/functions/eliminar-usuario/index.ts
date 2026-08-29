// Borra por completo la cuenta de un usuario (auth.users), lo que arrastra
// en cascada su perfil, su negocio y sus favoritos. Solo puede invocarla un
// administrador (profiles.es_admin = true), y nunca contra sí mismo.
//
// Usa la service role key, así que solo puede vivir en el servidor: nunca
// se expone al navegador.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Método no permitido" }, 405);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return jsonResponse({ error: "No autorizado" }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Cliente con el JWT de quien llama: solo para saber quién es y comprobar
  // que es administrador, respetando las políticas RLS normales.
  const callerClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user: caller },
  } = await callerClient.auth.getUser();

  if (!caller) {
    return jsonResponse({ error: "No autorizado" }, 401);
  }

  const { data: perfil } = await callerClient
    .from("profiles")
    .select("es_admin")
    .eq("id", caller.id)
    .single();

  if (!perfil?.es_admin) {
    return jsonResponse({ error: "Solo el administrador puede borrar usuarios" }, 403);
  }

  let userId: string | undefined;
  try {
    ({ userId } = await req.json());
  } catch {
    return jsonResponse({ error: "Cuerpo de la petición inválido" }, 400);
  }

  if (!userId || typeof userId !== "string") {
    return jsonResponse({ error: "Falta userId" }, 400);
  }

  if (userId === caller.id) {
    return jsonResponse({ error: "No puedes borrar tu propia cuenta de administrador" }, 400);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);
  const { error } = await adminClient.auth.admin.deleteUser(userId);

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse({ ok: true });
});
