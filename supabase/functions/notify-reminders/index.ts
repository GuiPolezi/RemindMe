import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;

Deno.serve(async () => {
  const now = new Date();

  // Busca lembretes que vencem em até 7 dias OU já venceram
  const setediasFrente = new Date(now);
  setediasFrente.setDate(now.getDate() + 7);

  const { data: lembretes } = await supabase
    .from("lembretes")
    .select("id_lembrete, titulo, data_hora_prazo, criado_por_id, ultimo_email_enviado")
    .lte("data_hora_prazo", setediasFrente.toISOString()); // vence em até 7 dias

  if (!lembretes?.length) {
    return new Response("Nenhum lembrete para notificar.", { status: 200 });
  }

  for (const lembrete of lembretes) {
    const prazo = new Date(lembrete.data_hora_prazo);
    const ultimo = lembrete.ultimo_email_enviado ? new Date(lembrete.ultimo_email_enviado) : null;
    const jaVenceu = prazo <= now;

    // Define o intervalo mínimo entre notificações
    const intervaloMinutos = jaVenceu ? 60 : 24 * 60; // 1h ou 24h

    // Verifica se já passou o intervalo desde o último e-mail
    if (ultimo) {
      const minutosDesdeUltimo = (now.getTime() - ultimo.getTime()) / 1000 / 60;
      if (minutosDesdeUltimo < intervaloMinutos) continue; // ainda não é hora
    }

    const { data: user } = await supabase.auth.admin.getUserById(lembrete.criado_por_id);
    const email = user?.user?.email;
    if (!email) continue;

    const prazoFormatado = prazo.toLocaleString("pt-BR");
    const diasRestantes = Math.ceil((prazo.getTime() - now.getTime()) / 1000 / 60 / 60 / 24);

    const assunto = jaVenceu
      ? `⚠️ Lembrete vencido: ${lembrete.titulo}`
      : `🔔 Lembrete vence em ${diasRestantes} dia(s): ${lembrete.titulo}`;

    const mensagem = jaVenceu
      ? `O lembrete <strong>${lembrete.titulo}</strong> venceu em ${prazoFormatado} e ainda está pendente.`
      : `O lembrete <strong>${lembrete.titulo}</strong> vence em ${prazoFormatado}. Faltam ${diasRestantes} dia(s).`;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Calendário <onboarding@resend.dev>",
        to: email,
        subject: assunto,
        html: `<p>Olá! ${mensagem}</p>`,
      }),
    });

    await supabase
      .from("lembretes")
      .update({ ultimo_email_enviado: now.toISOString() })
      .eq("id_lembrete", lembrete.id_lembrete);
  }

  return new Response("Notificações processadas!", { status: 200 });
});