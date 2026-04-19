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
    const [modalEvento, setModalEvento] = useState(null);

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
                        "Casa":    "#22c55e", // verde
                        "Saude":      "#ef4444", // vermelho
                        "Estudos":     "#a855f7", // roxo
                        "Financas": "#f59e0b", // amarelo
                        "Lazer": "#606c38",
                        "Outros": "#283618",
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
        setModalEvento({
        titulo: info.event.title,
        categoria: info.event.extendedProps.categoria,
        descricao: info.event.extendedProps.descricao,
        hora: info.event.extendedProps.horaFormatada,
        cor: info.event.backgroundColor,
        data: info.event.start.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    });
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
            color: 'white',
            padding: '4px',
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
        {/* Modal */}
        {modalEvento && (
        <div
            onClick={() => setModalEvento(null)}
            style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
            }}
        >
            <div
            onClick={(e) => e.stopPropagation()} // ← impede fechar ao clicar dentro
            style={{
                background: '#fff',
                color: '#000',
                width: '100%',
                maxWidth: '400px',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
            }}
            >
            {/* Barra colorida da categoria */}
            <div style={{ height: '4px', backgroundColor: modalEvento.cor }} />

            <div style={{ padding: '28px' }}>
                {/* Categoria + fechar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: '#999',
                }}>
                    {modalEvento.categoria}
                </span>
                <button
                    onClick={() => setModalEvento(null)}
                    style={{
                    background: 'none', border: 'none',
                    fontSize: '20px', cursor: 'pointer',
                    color: '#999', lineHeight: 1,
                    }}
                >
                    ✕
                </button>
                </div>

                {/* Título */}
                <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px', lineHeight: 1.2 }}>
                {modalEvento.titulo}
                </h2>

                {/* Data e hora */}
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px', textTransform: 'capitalize' }}>
                {modalEvento.data} · {modalEvento.hora}
                </p>

                {/* Divisor */}
                <div style={{ height: '1px', background: '#f0f0f0', marginBottom: '20px' }} />

                {/* Descrição */}
                <p style={{ fontSize: '14px', color: '#444', lineHeight: 1.6 }}>
                {modalEvento.descricao || "Sem descrição."}
                </p>
            </div>

            {/* Footer */}
            <div style={{
                padding: '16px 28px',
                borderTop: '1px solid #f0f0f0',
                display: 'flex', justifyContent: 'flex-end'
            }}>
                <button
                onClick={() => setModalEvento(null)}
                style={{
                    background: '#000', color: '#fff',
                    border: 'none', borderRadius: '8px',
                    padding: '10px 24px',
                    fontSize: '13px', fontWeight: '600',
                    cursor: 'pointer',
                }}
                >
                Fechar
                </button>
            </div>
            </div>
        </div>
        )}
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