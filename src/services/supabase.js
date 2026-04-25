import { createClient } from '@supabase/supabase-js'

// No Vite usamos import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testarConexao() {
  const { data, error } = await supabase.from('usuarios').select('*');

  if (error) {
    console.log('Conexão ativa, mas erro esperado:', error.message);
  } else {
    console.log('Conexão OK! Data:', data);
  }
}


testarConexao();
