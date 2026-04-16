import { use, useState } from 'react'
import { authService } from '../services/authService'
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


export function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [ nome, setNome] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate(); // 🔹 hook para redirecionar


    const handleRegister = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await authService.signUp(nome, email, password)

            alert("Registro realizado com sucesso!")

             navigate("/login"); // ou "/login" se sua rota for essa
        } catch (error) {
            alert("Erro ao Registrar: " + error.message)
        } finally {
            setLoading(false)
        }
    }

  return (
  // O wrapper externo centraliza o formulário no meio da tela com um fundo cinza suave
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    
    {/* Card Principal */}
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      
      {/* Cabeçalho */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Crie sua conta</h2>
        <p className="text-gray-500 mt-2 text-sm">Preencha os dados abaixo para acessar o sistema</p>
      </div>

      <form onSubmit={handleRegister} className="flex flex-col gap-5">
        
        {/* Campo: Nome */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input 
            type="text" 
            placeholder="Ex: João da Silva" 
            value={nome} 
            onChange={(e) => setNome(e.target.value)} 
            required 
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
            style={{ focusRingColor: '#283618' }} // Usando sua cor padrão no hover/focus
          />
        </div>

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
              Cadastrando...
            </span>
          ) : (
            'Cadastrar-se'
          )}
        </button>
      </form>

      {/* Link de Login */}
      <p className="mt-8 text-center text-sm text-gray-600">
        Já possui uma conta?{' '}
        <Link 
          to="/login" 
          className="font-bold hover:underline transition-all"
          style={{ color: '#283618' }}
        >
          Fazer login
        </Link>
      </p>

    </div>
  </div>
)
}