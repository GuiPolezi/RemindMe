import { useEffect, useState, useCallback } from 'react'
import { dbService } from '../services/dbService'
import { useNavigate, Link } from "react-router-dom";
import { supabase } from '../services/supabase'
import  FullCalendar  from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

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
                        autoComplete="off"
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
                        <option value="Trabalho">Trabalho</option>
                        <option value="Estudos">Estudos</option>
                        <option value="Casa">Casa</option>
                        <option value="Compras">Compras</option>
                        <option value="Saude">Saude</option>
                        <option value="Financas">Finanças</option>
                        <option value="Lazer">Lazer</option>
                        <option value="Outros">Outros</option>
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


// Obter Lembrete

export function GetLembrete({idLembrete}) {
    const [lembrete, setLembrete] = useState(null) // UseState para esperar pelo objeto
    const [loading, setLoading] = useState(true)

    const [usuarioLogado, setUsuarioLogado] = useState(null)
    const navigate = useNavigate();

    // Estados para edição de Lembrete


    useEffect(() => {
        if (!idLembrete) {
            setLoading(false)
            return
        }
        async function carregarDados() {
            try {
                const {data: {user}} = await supabase.auth.getUser();
                setUsuarioLogado(user);

                const dados = await dbService.getLembrete(idLembrete)
                setLembrete(dados)
            } catch (error) {
                alert("Erro ao buscar Lembrete: " + error.message)
            } finally {
                setLoading(false) // Tira o aviso de carregando
            }
        }
        if (idLembrete) {
            carregarDados();
        }
    }, [idLembrete]) // Colocamos o ID para o React atualizar se o ID Mudar

    // O que aparece na tela enquanto os dados carregam
    if (loading) {
        return <p>Carregando Lembretes...</p>
    }

    if (!lembrete) {
        return <p>Lembrete não encontrado</p>
    }

    // Depois dos dados carregarem
    return (
        <>
            <h2>{lembrete.titulo}</h2>
            <p>{lembrete.descricao}</p>
            <p>{lembrete.categoria}</p>
            <p>{lembrete.data_hora_prazo}</p>
        </>
    )
}

// Obtendo todos os Lembretes do usuário com o calendario integrado @fullcalendar
export function GetCalendarLembretes() {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregarLembretes() {
            try {
                // busca dados supabase
                const dadosLembretes = await dbService.getAllLembretes();

                const eventosFormatados = dadosLembretes.map((lembrete) => {
                    const data = new Date(lembrete.data_hora_prazo);
                    const dataFim = new Date(data);

                    const coresPorCategoria = {
                        "Trabalho":   "#3b82f6", // azul
                        "Pessoal":    "#22c55e", // verde
                        "Saúde":      "#ef4444", // vermelho
                        "Estudo":     "#a855f7", // roxo
                        "Financeiro": "#f59e0b", // amarelo
                    };

    
                    // Calcula um fim seguro de 10 minutos para o evento ser válido
                    dataFim.setMinutes(data.getMinutes() + 1);
                    
                    return {

                    
                        id: lembrete.id_lembrete,
                        title: lembrete.titulo,
                        backgroundColor: coresPorCategoria[lembrete.categoria] || "#ffff",
                        start: lembrete.data_hora_prazo,
                        // força o fim ser igual ao inicio para a duração ser zero
                        end: dataFim,
                        // Garante que o calendário não o trate como o dia inteiro
                        allDay: false,
                        //date: lembrete.data_hora_prazo, // O FullCalendar lê ISO Strings
                        extendedProps: { // Guardando dados extras
                            categoria: lembrete.categoria,
                            descricao: lembrete.descricao,
                            horaFormatada: data.toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })
                        }
                    }
                });
                
                setEventos(eventosFormatados);
            } catch (error) {
                    alert("Erro ao carregar calendário " + error.message)
            } finally {
                setLoading(false);
            }
        }

        carregarLembretes();
    }, []);

    // Função: Quando o usuario clica no lembrete
    const handleCliqueEvento = (info) => {
        alert(`Você clicou no lembrete: ${info.event.title} ${info.event.extendedProps.categoria}`);
        // Daria para redirecionar para página de edição aqui
        // Navigate
    }

    // Função ver Card do evento 
    const handleVerEvento = useCallback((view) => {
    return (
        <div style={{
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'normal',  // ← adicione isso
            width: '100%',         // ← e isso
            backgroundColor: view.event.backgroundColor,
            borderRadius: '10px',
            color: 'black',
            padding: '2px',
        }}>
            <p className='font-bold'>{view.event.extendedProps.categoria}</p>
        </div>
    );
    
    }, []); // [] significa que a função nunca muda 

    if (loading) {
        return <p>Carregando calendário</p>;
    }

    return (
        <>
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView='dayGridMonth'
            events={eventos}
            eventClick={handleCliqueEvento}
            eventContent={handleVerEvento}
            locale="pt-br"
            buttonText={{
                today: 'Hoje'
            }}
        />
        </>
    )
}

export function GetListaLembretes() {
    return (
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit, quibusdam?</p>
    )
}