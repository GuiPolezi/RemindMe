import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // Conecta ao banco do Supabase usando variáveis de ambiente da Edge Function
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseKey)

  // 1. Busca todos os sites
  const { data: sites, error: fetchError } = await supabase.from('sites').select('*')
  if (fetchError) return new Response(JSON.stringify({ error: fetchError }), { status: 500 })

  const logsToInsert = [];

  // 2. Faz o ping em cada site
  for (const site of sites) {
    const startTime = Date.now();
    try {
      // Timeout de 5 segundos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const res = await fetch(site.url, { signal: controller.signal });
      clearTimeout(timeoutId);

      logsToInsert.push({
        site_id: site.id,
        status: res.ok ? 'UP' : 'DOWN',
        status_code: res.status,
        response_time: Date.now() - startTime,
      });
    } catch (error) {
      logsToInsert.push({
        site_id: site.id,
        status: 'DOWN',
        status_code: 0, // 0 indica erro de rede ou timeout
        response_time: null,
      });
    }
  }

  // 3. Salva os resultados no banco
  const { error: insertError } = await supabase.from('ping_logs').insert(logsToInsert)
  
  if (insertError) return new Response(JSON.stringify({ error: insertError }), { status: 500 })

  return new Response(JSON.stringify({ message: 'Monitoramento executado com sucesso', logs: logsToInsert }), {
    headers: { "Content-Type": "application/json" },
  })
})