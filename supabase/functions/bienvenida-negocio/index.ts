// Envía un email cuando pasa algo relevante con un negocio:
//   - INSERT: "hemos recibido tu negocio, pendiente de revisión".
//   - UPDATE con aprobado false -> true: "¡tu negocio ya está publicado!".
// Se dispara desde un Database Webhook de Supabase sobre la tabla negocios
// con los eventos Insert y Update marcados, igual que bienvenida-usuario.
//
// El email del negocio (negocio.email) es un dato de contacto público
// opcional y puede no existir todavía, así que el aviso se manda al email
// de la CUENTA del dueño (profiles.email), consultado con la service role
// key porque RLS no dejaría leer el perfil de otro usuario con la
// publishable key.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-webhook-secret",
};

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]!,
  );
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

type NegocioRecord = {
  id: string;
  nombre: string;
  owner_id: string | null;
  categoria: string;
  municipio: string;
  aprobado: boolean;
};

// Compara el secreto en tiempo constante: se contrastan los hashes SHA-256,
// de longitud fija, para no filtrar el valor esperado por el tiempo de
// respuesta ni por dónde falla el primer carácter distinto.
async function secretoValido(recibido: string | null, esperado: string): Promise<boolean> {
  if (!recibido) return false;
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(recibido)),
    crypto.subtle.digest("SHA-256", enc.encode(esperado)),
  ]);
  const va = new Uint8Array(a);
  const vb = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < va.length; i++) diff |= va[i]! ^ vb[i]!;
  return diff === 0;
}

type WebhookPayload = {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: NegocioRecord | null;
  old_record: NegocioRecord | null;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Método no permitido" }, 405);
  }

  const webhookSecret = Deno.env.get("WEBHOOK_SECRET");
  if (!webhookSecret || !(await secretoValido(req.headers.get("x-webhook-secret"), webhookSecret))) {
    return jsonResponse({ error: "No autorizado" }, 401);
  }

  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!resendApiKey || !supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "Faltan variables de entorno en la función" }, 500);
  }

  let payload: WebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: "Cuerpo de la petición inválido" }, 400);
  }

  const negocio = payload.record;
  if (!negocio?.owner_id) {
    return jsonResponse({ ok: true, enviado: false });
  }

  let asunto: string;
  let html: string;
  const nombreNegocio = escapeHtml(negocio.nombre);
  const categoria = escapeHtml(negocio.categoria);
  const municipio = escapeHtml(negocio.municipio);

  if (payload.type === "INSERT") {
    asunto = `Hemos recibido tu negocio "${negocio.nombre}"`;
    html = `<p>Hemos recibido la ficha de <strong>${nombreNegocio}</strong>
      (${categoria} · ${municipio}).</p>
      <p>Está pendiente de revisión — en cuanto la aprobemos, aparecerá en el
      listado de negocios y en el mapa del Valle. Te avisaremos.</p>`;
  } else if (payload.type === "UPDATE" && !payload.old_record?.aprobado && negocio.aprobado) {
    asunto = `¡Tu negocio "${negocio.nombre}" ya está publicado!`;
    html = `<p>Buenas noticias: <strong>${nombreNegocio}</strong> ya es visible
      en el listado de negocios y en el mapa del Valle.</p>`;
  } else {
    // Cualquier otro cambio (editar descripción, retirar, etc.) no manda email.
    return jsonResponse({ ok: true, enviado: false });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);
  const { data: perfil } = await adminClient
    .from("profiles")
    .select("nombre, email")
    .eq("id", negocio.owner_id)
    .single();

  if (!perfil?.email) {
    return jsonResponse({ ok: true, enviado: false });
  }

  const respuesta = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Salvar el valle <onboarding@resend.dev>",
      to: [perfil.email],
      subject: asunto,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h1 style="font-size: 20px;">¡Hola${perfil.nombre ? `, ${escapeHtml(perfil.nombre)}` : ""}!</h1>
          ${html}
        </div>
      `,
    }),
  });

  if (!respuesta.ok) {
    const detalle = await respuesta.text();
    return jsonResponse({ error: "Resend rechazó el envío", detalle }, 502);
  }

  return jsonResponse({ ok: true, enviado: true });
});
