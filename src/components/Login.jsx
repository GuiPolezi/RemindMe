import { use, useState } from 'react'
import { authService } from '../services/authService'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate(); // 🔹 hook para redirecionar

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await authService.signIn(email, password)
            alert("Login realizado com sucesso!")
            navigate("/"); // ou "/login" se sua rota for essa
        } catch (error) {
            alert("Erro ao entrar: " + error.message)
        } finally {
            setLoading(false)
        }
    }

  return (
  // Wrapper que centraliza tudo na tela com fundo cinza claro
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    
    {/* Card Principal */}
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      
      {/* Cabeçalho */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Bem-vindo de volta</h2>
        <p className="text-gray-500 mt-2 text-sm">Insira suas credenciais para acessar o sistema</p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        
        {/* Campo: E-mail */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
          <input 
            type="email" 
            placeholder="seu@email.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Campo: Senha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Botão de Submit */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full mt-4 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex justify-center items-center"
          style={{ backgroundColor: '#283618' }}
        >
          {loading ? (
            // Spinner de Loading Animado
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Entrando...
            </span>
          ) : (
            'Entrar no Sistema'
          )}
        </button>
      </form>

      {/* Link para Criar Conta */}
      <p className="mt-8 text-center text-sm text-gray-600">
        Ainda não tem uma conta?{' '}
        <Link 
          to="/register" 
          className="font-bold hover:underline transition-all"
          style={{ color: '#283618' }}
        >
          Criar conta
        </Link>
      </p>

    </div>
  </div>
)
}