import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
  // Conexão com o Supabase (usa variáveis de ambiente automáticas)
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const agora = new Date();
  const umaHoraDepois = new Date(agora.getTime() + 60 * 60 * 1000);

  // 1. Busca lembretes que vencem em até 1h e ainda não foram notificados
  const { data: lembretes, error } = await supabase
    .from("lembretes")
    .select("*, auth.users!inner(email)") // puxa o email do dono
    .lte("data_hora_prazo", umaHoraDepois.toISOString())
    .gte("data_hora_prazo", agora.toISOString())
    .eq("email_enviado", false);

  if (error) {
    return new Response(JSON.stringify({ erro: error.message }), { status: 500 });
  }

  // 2. Para cada lembrete, envia o e-mail e marca como enviado
  for (const l of lembretes ?? []) {
    const emailUsuario = l.users?.email;
    if (!emailUsuario) continue;

    // Envia via Resend
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "gui.polezi@hotmail.com",
        to: emailUsuario,
        subject: `⏰ Lembrete vencendo: ${l.titulo}`,
        html: `
          <h2>Seu lembrete está prestes a vencer!</h2>
          <p><strong>${l.titulo}</strong></p>
          <p>${l.descricao ?? ""}</p>
          <p>Prazo: ${new Date(l.data_hora_prazo).toLocaleString("pt-BR")}</p>
        `,
      }),
    });

    // Marca como enviado para não reenviar
    await supabase
      .from("lembretes")
      .update({ email_enviado: true })
      .eq("id_lembrete", l.id_lembrete);
  }

  return new Response(
    JSON.stringify({ ok: true, enviados: lembretes?.length ?? 0 }),
    { status: 200 }
  );
});