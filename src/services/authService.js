import { supabase } from './supabase'

export const authService = {
  // Realiza o login com email e senha
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  async signUp(nome, email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
      data: {
        name: nome, // Para salvar no display_name (auth supabase) o nome do usuario 
        nome : nome} // nome do usuário
      }
    })
    if (error) throw error
    return data
  },

  // Encerra a sessão
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Verifica se há um usuário logado no momento
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }
}