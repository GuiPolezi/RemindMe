import { useEffect, useState } from 'react'
import { dbService } from '../services/dbService'
import { useNavigate, Link } from "react-router-dom";


// Criar Lembrete
export function AddLembrete() {
    const [titulo, setTitulo] = useState('')
    const [descricao, setDescricao] = useState('')
    const [categoria, setCategoria] = useState('')
    const [prazo, setPrazo] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleCriar = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const novoLembrete = await dbService.CriarLembrete(titulo, descricao, categoria, prazo)
            alert(`Lembrete "${novoLembrete.titulo}" criado com sucesso! ID: "${novoLembrete.id_lembrete}"`)
            setTitulo('')
            setDescricao('')
            setCategoria('')
            setPrazo('')

            navigate('/') // Redireciona para página inicial após criação
        } catch (error) {
            alert("Erro ao Criar Lembrete " + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <form onSubmit={handleCriar}>
                {/* Titulo */}
                <div>
                    <label>Título do Lembrete</label>
                    <input 
                        type="text"
                        placeholder='Ex: Marcar Consulta' 
                        value={titulo}
                        onChange={e => setTitulo(e.target.value)}
                        required
                    />
                </div>

                {/* Descrição */}
                <div>
                    <label>Descrição</label>
                    <textarea
                        placeholder='Descreva sobre o lembrete'
                        value={descricao}
                        onChange={e => setDescricao(e.target.value)}
                        rows="3"
                    />
                </div>

                {/* Categoria */}
                <div>
                    <label>Categoria</label>
                    <select
                        value={categoria}
                        onChange={e => setCategoria(e.target.value)}
                        required
                    >
                        <option value="" disabled>Selecione uma Categoria</option>
                        <option value="trabalho">Trabalho</option>
                        <option value="estudos">Estudos</option>
                        <option value="casa">Casa</option>
                        <option value="compras">Compras</option>
                        <option value="saude">Saude</option>
                        <option value="financas">Finanças</option>
                        <option value="lazer">Lazer</option>
                        <option value="outros">Outros</option>
                    </select>
                </div>

                {/* Prazo */}
                <div>
                    <label>Data e Hora</label>
                    <input
                        type="datetime-local" 
                        value={prazo}
                        onChange={e => setPrazo(e.target.value)}
                        required
                    />
                </div>

                {/* Botão Cancelar */}
                <Link to="/">Cancelar</Link>


                {/* Botão Salvar com Loader */}
                <button
                    type='submit'
                    disabled={loading}
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Criando...
                        </span>
                    ) : (
                        'Criar Lembrete'
                    )}
                </button>
            </form>
        </>
    )
}