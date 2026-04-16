import { supabase } from './supabase'

export const dbService = {
    // 1. Criar Lembrete
    async CriarLembrete(titulo, descricao, categoria, prazo) {
        const {data: {user} } = await supabase.auth.getUser()

        const {data, error } = await supabase
            .from('lembretes')
            .insert([{
                titulo,
                descricao,
                categoria,
                prazo,
                criado_por_id: user.id,
            }])
            .select()

        if (error) throw error
        return data[0] // Retorna o lembrete recém criado (Com o ID dele)
    },

    // 1.1 Obter Lembrete Criado
    async getLembrete(idLembrete) {
        const {data, error } = await supabase
        .from('lembretes')
        .select('*') // Pega todas as colunas
        .eq('id_lembrete', idLembrete) // Onde coluna id lembrete igual ao id passado
        .maybeSingle() // Garante que retorne apenas 1 objeto


        if (error) throw error
        return data
    },

}