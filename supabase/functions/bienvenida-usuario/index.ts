// Envía un email de bienvenida cuando se crea un perfil nuevo (justo
// después del registro con Google). Se dispara desde un Database Webhook
// de Supabase (tabla profiles, evento INSERT) — ver README de esta función
// para cómo configurarlo.
//
// Usa la API de Resend (https://resend.com) con la API key guardada como
// secreto de Supabase (RESEND_API_KEY) — nunca en el código ni en el
// frontend.
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

type WebhookPayload = {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: { id: string; nombre: string; email: string | null } | null;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Método no permitido" }, 405);
  }

  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (!resendApiKey) {
    return jsonResponse({ error: "Falta RESEND_API_KEY en los secretos de la función" }, 500);
  }

  let payload: WebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: "Cuerpo de la petición inválido" }, 400);
  }

  const perfil = payload.record;
  if (!perfil?.email) {
    // Nada que enviar: no hay email guardado en el perfil.
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
      subject: "¡Bienvenido/a a Salvar el valle!",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h1 style="font-size: 20px;">¡Hola${perfil.nombre ? `, ${perfil.nombre}` : ""}!</h1>
          <p>Tu cuenta en <strong>Salvar el valle</strong> ya está creada.
          Ya puedes descubrir negocios, pueblos y experiencias del Valle del Tiétar.</p>
          <p>Gracias por unirte.</p>
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
