import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { dbService } from '../services/dbService'
import { useNavigate, Link } from "react-router-dom";
import { supabase } from '../services/supabase'
import FullCalendar from '@fullcalendar/react'
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
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 sm:p-6 font-sans">
            <div className="w-full max-w-lg bg-white border border-zinc-200 rounded-2xl shadow-sm p-8">

                <header className="mb-8">
                    <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Novo Lembrete</h1>
                    <p className="text-zinc-500 text-sm mt-1">Preencha os detalhes para organizar sua tarefa.</p>
                </header>

                <form onSubmit={handleCriar} className="space-y-6">

                    {/* Titulo */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 ml-1">Título do Lembrete</label>
                        <input
                            type="text"
                            placeholder='Ex: Marcar Consulta'
                            value={titulo}
                            onChange={e => setTitulo(e.target.value)}
                            required
                            autoComplete="off"
                            className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    {/* Descrição */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 ml-1">Descrição</label>
                        <textarea
                            placeholder='Descreva sobre o lembrete'
                            value={descricao}
                            onChange={e => setDescricao(e.target.value)}
                            rows="3"
                            className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Grid para Categoria e Prazo */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Categoria */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 ml-1">Categoria</label>
                            <select
                                value={categoria}
                                onChange={e => setCategoria(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-zinc-900 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="" disabled>Selecione</option>
                                <option value="Licença Sistema">Licença Sistema</option>
                                <option value="Estudos">Estudos</option>
                                <option value="Certificado">Certificado</option>
                                <option value="Compromisso">Compromisso</option>
                                <option value="Outros">Outros</option>
                            </select>
                        </div>

                        {/* Prazo */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 ml-1">Data e Hora</label>
                            <input
                                type="datetime-local"
                                value={prazo}
                                onChange={e => setPrazo(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-zinc-900 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all cursor-pointer"
                            />
                        </div>
                    </div>

                    <hr className="border-zinc-100 my-2" />

                    {/* Ações */}
                    <div className="flex flex-col-reverse sm:flex-row items-center gap-4 pt-2">
                        <Link
                            to="/"
                            className="w-full sm:w-1/3 text-center text-sm font-medium text-zinc-500 hover:text-zinc-800 transition-colors py-2.5"
                        >
                            Cancelar
                        </Link>

                        <button
                            type='submit'
                            disabled={loading}
                            className="w-full sm:w-2/3 bg-black text-white font-medium py-3 rounded-xl hover:bg-zinc-800 active:scale-[0.98] transition-all disabled:bg-zinc-400 disabled:cursor-not-allowed flex items-center justify-center shadow-md shadow-zinc-200"
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
                    </div>
                </form>
            </div>
        </div>
    )
}


// Obter Lembrete

export function GetLembrete({ idLembrete }) {
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
                const { data: { user } } = await supabase.auth.getUser();
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
    
    // Estados para dias expandidos
    const [ diasExpandidos, setDiasExpandidos] = useState({})
    useEffect(() => {
        async function carregarLembretes() {
            try {
                // busca dados supabase
                const dadosLembretes = await dbService.getAllLembretes();

                const eventosFormatados = dadosLembretes.map((lembrete) => {
                    const data = new Date(lembrete.data_hora_prazo);
                    const dataFim = new Date(data);

                    const coresPorCategoria = {
                        "Licença Sistema": "#3b82f6", // azul
                        "Certificado": "#22c55e", // verde
                        "Compromisso": "#ef4444", // vermelho
                        "Estudos": "#55c9f7", // roxo
                        "Outros": "#f59e0b", // amarelo
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

    // Agrupando eventos por dia (chave: "yyyy-mm-dd")
    const eventosPorDia = useMemo(() => {
        const mapa = {};
        eventos.forEach(ev => {
            const chave = ev.start.slice(0, 10);
            if (!mapa[chave]) mapa[chave] = [];
            mapa[chave].push(ev);
        })
        return mapa;
    }, [eventos])

    const toggleDia = useCallback((chave) => {
        setDiasExpandidos(prev => ({
            ...prev,
            [chave]: !prev[chave]
        }))

    }, []);

    // Eventos filtrados com base nos dias expandidos
    const eventosFiltrados = useMemo(() => {
        const LIMITE = 3;
        return eventos.filter(ev => {
            const chave = ev.start.slice(0, 10);
            const eventosNoDia = eventosPorDia[chave] || [];
            
            // Se o dia não está expandido e tem mais de 3, mostra só os 3 primeiros
            if (!diasExpandidos[chave] && eventosNoDia.length > LIMITE) {
                const index = eventosNoDia.findIndex(e => e.id === ev.id);
                return index < LIMITE; // só passa os 3 primeiros
            }
            return true; // dia expandido ou com <= 3 eventos: mostra tudo
        });
    }, [eventos, eventosPorDia, diasExpandidos]);

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

    // Renderiza o conteúdo de cada célula de dia
    const renderDayCellContent = useCallback((arg) => {
        // Chave do dia no formato "YYYY-MM-DD"
        const chave = arg.date.toISOString().slice(0, 10);
        const eventosNoDia = eventosPorDia[chave] || [];
        const LIMITE = 3;
        const temMais = eventosNoDia.length > LIMITE;
        const expandido = diasExpandidos[chave];
        const quantidadeOculta = eventosNoDia.length - LIMITE;

        return (
            <div style={{ width: '100%' }}>
                {/* Número do dia (o FullCalendar já renderiza, mas podemos personalizar) */}
                <div style={{ textAlign: 'right', fontSize: '12px', marginBottom: '2px' }}>
                    {arg.dayNumberText}
                </div>

                {/* Botão accordion — só aparece se tiver mais de 3 */}
                {temMais && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // impede abrir modal ao clicar no botão
                            toggleDia(chave);
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            background: 'none',
                            border: 'none',
                            fontSize: '10px',
                            color: '#6b7280',
                            cursor: 'pointer',
                            padding: '1px 0',
                            marginTop: '2px',
                            fontWeight: '600',
                        }}
                    >
                        <span
                            style={{
                                display: 'inline-block',
                                transition: 'transform 0.2s',
                                transform: expandido ? 'rotate(180deg)' : 'rotate(0deg)',
                                fontSize: '8px',
                            }}
                        >
                            ▼
                        </span>
                        {expandido ? 'ver menos' : `+${quantidadeOculta} mais`}
                    </button>
                )}
            </div>
        );
    }, [eventosPorDia, diasExpandidos, toggleDia]);


    // Função ver Card do evento 
    const handleVerEvento = useCallback((view) => {
        return (
            <div className='event-const' style={{
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'normal',  // ← adicione isso
                width: '100%',         // ← e isso
                backgroundColor: view.event.backgroundColor,
                borderRadius: '10px',
                boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
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
                events={eventosFiltrados}
                eventClick={handleCliqueEvento}
                eventContent={handleVerEvento}
                dayCellContent={renderDayCellContent} // Renderiza botão accordion
                locale="pt-br"
                buttonText={{
                    today: 'Hoje'
                }}
            />
        </>
    )
}


/* FUNÇÕES DO DASHBOARD DOS PRAZOS */

export function GetListaLembretes() {
    const [lembretes, setLembretes] = useState([]);
    const [loading, setLoading] = useState(true);

    // ─── NOTIFICAÇÕES ───────────────────────────────────────────
    const notificacoesEnviadas = useRef(new Set()); // guarda IDs já notificados

    // Pede permissão ao carregar
    useEffect(() => {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);

    // Verifica prazos a cada minuto
    useEffect(() => {
        if (lembretes.length === 0) return;

        function verificarPrazos() {
            if (Notification.permission !== "granted") return;

            const agora = new Date();

            lembretes.forEach((l) => {
                const prazo = new Date(l.data_hora_prazo);
                const diffMs = prazo - agora;
                const diffMin = diffMs / (1000 * 60);

                // Notifica se faltar entre 0 e 60 minutos e ainda não notificou
                const chave = `${l.id_lembrete}-1h`;
                if (diffMin > 0 && diffMin <= 60 && !notificacoesEnviadas.current.has(chave)) {
                    notificacoesEnviadas.current.add(chave);
                    new Notification("⏰ Lembrete próximo do prazo!", {
                        body: `"${l.titulo}" vence em ${Math.ceil(diffMin)} minutos.`,
                        icon: "/favicon.ico",
                    });
                }

                // Notifica se acabou de vencer (última hora)
                const chaveVencido = `${l.id_lembrete}-vencido`;
                if (diffMs < 0 && diffMs > -1000 * 60 * 60 && !notificacoesEnviadas.current.has(chaveVencido)) {
                    notificacoesEnviadas.current.add(chaveVencido);
                    new Notification("🔴 Lembrete vencido!", {
                        body: `"${l.titulo}" passou do prazo.`,
                        icon: "/favicon.ico",
                    });
                }
            });
        }

        verificarPrazos(); // roda imediatamente ao carregar
        const intervalo = setInterval(verificarPrazos, 60 * 1000); // repete a cada 1 min
        return () => clearInterval(intervalo); // limpa ao desmontar

    }, [lembretes]); // roda sempre que lembretes mudar


    const coresPorCategoria = {
        "Trabalho": "#3b82f6",
        "Casa": "#22c55e",
        "Saude": "#ef4444",
        "Estudos": "#a855f7",
        "Financas": "#f59e0b",
        "Lazer": "#606c38",
        "Compras": "#0ea5e9",
        "Outros": "#6b7280",
    };

    // Componente auxiliar para os cards de estatística
    const StatCard = ({ label, value, sub, color, delay, glow }) => (
        <div className="dash-card" style={{ ...styles.statCard, animationDelay: delay }}>
            <div style={{ ...styles.statDecorator, background: color, boxShadow: glow ? `0 0 15px ${color}` : 'none' }} />
            <span style={styles.statLabel}>{label}</span>
            <span style={{ ...styles.statNumber, color: glow ? color : '#fff' }}>{value}</span>
            <span style={styles.statSub}>{sub}</span>
        </div>
    );

    const styles = {
        wrapper: {
            padding: '24px',
            backgroundColor: '#0a0a0b', // Fundo ultra dark
            color: '#e2e8f0',
            minHeight: '100vh',
            fontFamily: "'Inter', sans-serif",
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
        },
        statCard: {
            background: '#161618',
            padding: '20px',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
        },
        statDecorator: {
            position: 'absolute',
            top: 0, right: 0, bottom: 0,
            width: '4px',
        },
        statLabel: { fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' },
        statNumber: { fontSize: '32px', fontWeight: 800, margin: '8px 0' },
        statSub: { fontSize: '12px', color: '#64748b' },

        mainLayout: {
            display: 'grid',
            gridTemplateColumns: '300px 1fr',
            gap: '24px',
        },
        sectionTitle: {
            fontSize: '18px',
            fontWeight: 700,
            marginBottom: '16px',
            color: '#f8fafc',
        },
        destaque: {
            background: '#161618',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '16px',
        },
        destaqueLabel: { fontSize: '10px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '8px' },
        destaqueTitulo: { fontSize: '16px', fontWeight: 600, margin: '0 0 12px 0', lineHeight: '1.4' },
        timerBadge: {
            background: 'rgba(245, 158, 11, 0.1)',
            color: '#f59e0b',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 700,
        },

        listCol: { display: 'flex', flexDirection: 'column' },
        listaHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' },
        chipCount: { background: '#27272a', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', color: '#a1a1aa' },

        scrollArea: { maxHeight: 'calc(100vh - 250px)', overflowY: 'auto', paddingRight: '8px' },
        lembreteRow: {
            background: '#111113',
            marginBottom: '10px',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            border: '1px solid rgba(255,255,255,0.03)',
            animation: 'slideIn 0.4s ease backwards',
        },
        statusIndicator: { width: '4px', height: '40px', borderRadius: '4px' },
        lembreteContent: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' },
        lembreteTitulo: { fontSize: '15px', fontWeight: 600, color: '#f1f5f9' },
        lembreteDesc: { fontSize: '13px', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '400px' },
        lembreteMeta: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' },
        tag: { fontSize: '10px', background: '#27272a', padding: '2px 8px', borderRadius: '4px', color: '#e2e8f0' },
        dateText: { fontSize: '11px', color: '#64748b' },

        lembreteRight: { textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '6px' },
        statusPill: {
            fontSize: '10px',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '6px',
            border: '1px solid',
            textTransform: 'uppercase'
        },
        prazoTexto: { fontSize: '11px', fontWeight: 600 }
    };

    function calcularStatus(data_hora_prazo) {
        const agora = new Date();
        const prazo = new Date(data_hora_prazo);
        const diffMs = prazo - agora;
        const diffHoras = diffMs / (1000 * 60 * 60);
        const diffDias = diffMs / (1000 * 60 * 60 * 24);

        if (diffMs < 0) return { label: "Vencido", cor: "#ef4444", prioridade: 0 };
        if (diffHoras <= 24) return { label: "Urgente", cor: "#f59e0b", prioridade: 1 };
        if (diffDias <= 7) return { label: "Esta semana", cor: "#3b82f6", prioridade: 2 };
        return { label: "Em dia", cor: "#22c55e", prioridade: 3 };
    }

    function formatarPrazo(data_hora_prazo) {
        const prazo = new Date(data_hora_prazo);
        const agora = new Date();
        const diffMs = prazo - agora;
        const diffDias = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
        const diffHoras = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60));
        const diffMin = Math.floor(Math.abs(diffMs) / (1000 * 60));

        if (diffMs < 0) {
            if (diffDias > 0) return `Venceu há ${diffDias}d`;
            if (diffHoras > 0) return `Venceu há ${diffHoras}h`;
            return `Venceu há ${diffMin}min`;
        }
        if (diffDias > 0) return `Em ${diffDias}d`;
        if (diffHoras > 0) return `Em ${diffHoras}h`;
        return `Em ${diffMin}min`;
    }

    useEffect(() => {
        async function carregar() {
            try {
                const dados = await dbService.getAllLembretes();
                setLembretes(dados);
            } catch (error) {
                alert("Erro ao carregar lembretes: " + error.message);
            } finally {
                setLoading(false);
            }
        }
        carregar();
    }, []);

    if (loading) return (
        <div style={styles.loadingWrapper}>
            <div style={styles.loadingDot} className="pulse" />
            <span style={styles.loadingText}>Carregando</span>
        </div>
    );

    if (lembretes.length === 0) return (
        <div style={styles.empty}>
            <span style={styles.emptyIcon}>◌</span>
            <p style={styles.emptyText}>Nenhum lembrete ainda.</p>
        </div>
    );

    const agora = new Date();

    // Derivados
    const ordenadosPorData = [...lembretes].sort((a, b) =>
        new Date(b.data_hora_prazo) - new Date(a.data_hora_prazo)
    );
    const maisRecente = ordenadosPorData[0];

    const vencidos = lembretes.filter(l => new Date(l.data_hora_prazo) < agora);
    const emDia = lembretes.filter(l => new Date(l.data_hora_prazo) >= agora);

    const maiorPrazo = [...emDia].sort((a, b) =>
        new Date(a.data_hora_prazo) - new Date(b.data_hora_prazo)
    )[0];

    const categorias = [...new Set(lembretes.map(l => l.categoria))];
    const categoriaMaisUsada = categorias.sort((a, b) =>
        lembretes.filter(l => l.categoria === b).length -
        lembretes.filter(l => l.categoria === a).length
    )[0];

    const urgentes = lembretes.filter(l => {
        const diff = new Date(l.data_hora_prazo) - agora;
        return diff > 0 && diff <= 1000 * 60 * 60 * 24;
    });

    // Lista ordenada por status (vencidos primeiro, depois urgentes, etc)
    const listaPrioridade = [...lembretes].sort((a, b) => {
        return calcularStatus(a.data_hora_prazo).prioridade -
            calcularStatus(b.data_hora_prazo).prioridade;
    });

    return (
        <div style={styles.wrapper}>
            <style>{`
            @keyframes slideIn {
                from { opacity: 0; transform: translateY(20px); filter: blur(5px); }
                to { opacity: 1; transform: translateY(0); filter: blur(0); }
            }
            .dash-card { 
                animation: slideIn 0.5s ease backwards;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                border: 1px solid rgba(255, 255, 255, 0.08);
            }
            .dash-card:hover {
                transform: translateY(-4px);
                border-color: rgba(255, 255, 255, 0.2);
                background: rgba(255, 255, 255, 0.05) !important;
                box-shadow: 0 10px 20px rgba(0,0,0,0.4);
            }
            .lembrete-row {
                transition: all 0.2s ease;
                cursor: pointer;
            }
            .lembrete-row:hover {
                background: rgba(255, 255, 255, 0.03) !important;
                padding-left: 12px !important;
            }
            ::-webkit-scrollbar { width: 6px; }
            ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        `}</style>

            {/* HEADER STATUS */}
            <div style={styles.statsGrid}>
                <StatCard label="Total" value={lembretes.length} sub="Lembretes" color="#6366f1" delay="0.1s" />
                <StatCard
                    label="Vencidos"
                    value={vencidos.length}
                    sub="Ação necessária"
                    color="#ef4444"
                    delay="0.15s"
                    glow={vencidos.length > 0}
                />
                <StatCard label="Urgentes" value={urgentes.length} sub="Próximas 24h" color="#f59e0b" delay="0.2s" />
                <StatCard label="Em dia" value={emDia.length} sub="Organizados" color="#22c55e" delay="0.25s" />
            </div>

            <div style={styles.mainLayout}>
                {/* COLUNA ESQUERDA: DESTAQUES */}
                <div style={styles.sideCol}>
                    <h3 style={styles.sectionTitle}>Insights</h3>

                    {maiorPrazo && (
                        <div className="dash-card" style={{ ...styles.destaque, borderLeft: '4px solid #f59e0b' }}>
                            <span style={styles.destaqueLabel}>⚡ PRÓXIMO PRAZO</span>
                            <p style={styles.destaqueTitulo}>{maiorPrazo.titulo}</p>
                            <div style={styles.destaqueFooter}>
                                <span style={styles.timerBadge}>{formatarPrazo(maiorPrazo.data_hora_prazo)}</span>
                            </div>
                        </div>
                    )}

                    <div className="dash-card" style={{ ...styles.destaque, borderLeft: '4px solid #6366f1' }}>
                        <span style={styles.destaqueLabel}>◈ CATEGORIA TOP</span>
                        <p style={styles.destaqueTitulo}>{categoriaMaisUsada}</p>
                        <span style={styles.countBadge}>{lembretes.filter(l => l.categoria === categoriaMaisUsada).length} itens</span>
                    </div>
                </div>

                {/* COLUNA DIREITA: LISTA PRINCIPAL */}
                <div style={styles.listCol}>
                    <div style={styles.listaHeader}>
                        <h3 style={styles.sectionTitle}>Todos os Lembretes</h3>
                        <span style={styles.chipCount}>{lembretes.length}</span>
                    </div>

                    <div style={styles.scrollArea}>
                        {listaPrioridade.map((l, i) => {
                            const status = calcularStatus(l.data_hora_prazo);
                            const data = new Date(l.data_hora_prazo);
                            return (
                                <div key={l.id_lembrete} className="lembrete-row"
                                    style={{ ...styles.lembreteRow, animationDelay: `${0.3 + (i * 0.05)}s` }}>

                                    <div style={{ ...styles.statusIndicator, background: coresPorCategoria[l.categoria] }} />

                                    <div style={styles.lembreteContent}>
                                        <div style={styles.lembreteMain}>
                                            <span style={styles.lembreteTitulo}>{l.titulo}</span>
                                            <span style={styles.lembreteDesc}> {l.descricao}</span>
                                        </div>

                                        <div style={styles.lembreteMeta}>
                                            <span style={styles.tag}>{l.categoria}</span>
                                            <span style={styles.dateText}>
                                                {data.toLocaleDateString('pt-BR')} • {data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={styles.lembreteRight}>
                                        <span style={{ ...styles.statusPill, color: status.cor, borderColor: status.cor }}>
                                            {status.label}
                                        </span>
                                        <span style={{ ...styles.prazoTexto, color: status.cor }}>{formatarPrazo(l.data_hora_prazo)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );

}

