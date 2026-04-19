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


/* FUNÇÕES DO DASHBOARD DOS PRAZOS */

export function GetListaLembretes() {
    const [lembretes, setLembretes] = useState([]);
    const [loading, setLoading] = useState(true);
    const coresPorCategoria = {
        "Trabalho":  "#3b82f6",
        "Casa":      "#22c55e",
        "Saude":     "#ef4444",
        "Estudos":   "#a855f7",
        "Financas":  "#f59e0b",
        "Lazer":     "#606c38",
        "Compras":   "#0ea5e9",
        "Outros":    "#6b7280",
    };

    const styles = {
        wrapper: {
            padding: '24px',
            background: '#0a0a0a',       // ← fundo escuro
            minHeight: '100vh',
            fontFamily: "'DM Mono', monospace",
            color: '#f0f0f0',            // ← texto claro
        },
        loadingWrapper: {
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '40px', justifyContent: 'center',
        },
        loadingDot: {
            width: '8px', height: '8px',
            borderRadius: '50%', background: '#f0f0f0', // ← claro
        },
        loadingText: { fontSize: '12px', color: '#555', letterSpacing: '0.1em' },
        empty: {
            textAlign: 'center', padding: '60px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
        },
        emptyIcon: { fontSize: '32px', color: '#333' },
        emptyText: { fontSize: '13px', color: '#555' },

        // Stats
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '12px',
            marginBottom: '20px',
        },
        statCard: {
            border: '1.5px solid #222',  // ← borda escura
            borderRadius: '12px',
            padding: '20px 16px',
            display: 'flex', flexDirection: 'column', gap: '4px',
            background: '#111',          // ← card escuro
            transition: 'border-color 0.2s',
        },
        statLabel: { fontSize: '10px', letterSpacing: '0.15em', color: '#555', textTransform: 'uppercase' },
        statNumber: { fontSize: '36px', fontWeight: '800', lineHeight: 1, color: '#f0f0f0' }, // ← claro
        statSub: { fontSize: '11px', color: '#444' },

        // Destaques
        destaqueGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            marginBottom: '24px',
        },
        destaque: {
            border: '1.5px solid #222',  // ← borda escura
            borderRadius: '12px',
            padding: '18px',
            display: 'flex', flexDirection: 'column', gap: '8px',
            background: '#111',          // ← card escuro
        },
        destaqueLabel: { fontSize: '10px', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase' },
        destaqueTitulo: { fontSize: '15px', fontWeight: '700', color: '#f0f0f0', margin: 0 }, // ← claro
        destaqueRow: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
        destaqueSub: { fontSize: '11px', color: '#555' },

        // Lista
        listaWrapper: {
            border: '1.5px solid #222',  // ← borda escura
            borderRadius: '12px',
            overflow: 'hidden',
        },
        listaHeader: {
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 20px',
            borderBottom: '1px solid #1a1a1a',
            background: '#111',          // ← header escuro
        },
        listaTitulo: { fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#555' },
        listaCount: {
            fontSize: '10px', background: '#f0f0f0', color: '#000', // ← invertido
            borderRadius: '20px', padding: '2px 10px',
        },
        lembreteRow: {
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '16px 20px',
            borderBottom: '1px solid #1a1a1a',
            background: '#111',          // ← row escuro
            transition: 'background 0.15s',
            cursor: 'default',
            animation: 'fadeUp 0.4s ease both',
            gap: '12px',
        },
        lembreteLeft: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0 },
        lembreteTitulo: { fontSize: '14px', fontWeight: '600', color: '#f0f0f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }, // ← claro
        lembreteDesc: { fontSize: '12px', color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
        lembreteMeta: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
        lembreteData: { fontSize: '11px', color: '#444' },
        lembreteRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 },

        // Badges
        categoriaBadge: {
            fontSize: '10px', fontWeight: '700',
            color: '#fff', borderRadius: '20px',
            padding: '2px 8px', letterSpacing: '0.05em',
            textTransform: 'uppercase', whiteSpace: 'nowrap',
        },
        statusBadge: {
            fontSize: '10px', fontWeight: '700',
            border: '1px solid',
            borderRadius: '20px',
            padding: '2px 8px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
        },
        prazoRelativo: {
            fontSize: '11px', fontWeight: '600',
        },
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
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
                .dash-card { animation: fadeUp 0.4s ease both; }
                .dash-card:nth-child(1) { animation-delay: 0.05s; }
                .dash-card:nth-child(2) { animation-delay: 0.1s; }
                .dash-card:nth-child(3) { animation-delay: 0.15s; }
                .dash-card:nth-child(4) { animation-delay: 0.2s; }
                .lembrete-row:hover { background: #1a1a1a !important; }
                .pulse { animation: pulse 1.5s ease infinite; }
            `}</style>
 
            {/* STATS GRID */}
            <div style={styles.statsGrid}>
 
                {/* Total */}
                <div className="dash-card" style={styles.statCard}>
                    <span style={styles.statLabel}>Total</span>
                    <span style={styles.statNumber}>{lembretes.length}</span>
                    <span style={styles.statSub}>lembretes</span>
                </div>
 
                {/* Vencidos */}
                <div className="dash-card" style={{ ...styles.statCard, borderColor: vencidos.length > 0 ? "#ef4444" : "#e5e5e5" }}>
                    <span style={styles.statLabel}>Vencidos</span>
                    <span style={{ ...styles.statNumber, color: vencidos.length > 0 ? "#ef4444" : "#000" }}>
                        {vencidos.length}
                    </span>
                    <span style={styles.statSub}>em atraso</span>
                </div>
 
                {/* Urgentes */}
                <div className="dash-card" style={{ ...styles.statCard, borderColor: urgentes.length > 0 ? "#f59e0b" : "#e5e5e5" }}>
                    <span style={styles.statLabel}>Urgentes</span>
                    <span style={{ ...styles.statNumber, color: urgentes.length > 0 ? "#f59e0b" : "#000" }}>
                        {urgentes.length}
                    </span>
                    <span style={styles.statSub}>próximas 24h</span>
                </div>
 
                {/* Em dia */}
                <div className="dash-card" style={styles.statCard}>
                    <span style={styles.statLabel}>Em dia</span>
                    <span style={{ ...styles.statNumber, color: "#22c55e" }}>{emDia.length}</span>
                    <span style={styles.statSub}>no prazo</span>
                </div>
 
            </div>
 
            {/* DESTAQUES */}
            <div style={styles.destaqueGrid}>
 
                {/* Mais recente */}
                {maisRecente && (
                    <div className="dash-card" style={styles.destaque}>
                        <span style={styles.destaqueLabel}>◎ Mais recente</span>
                        <p style={styles.destaqueTitulo}>{maisRecente.titulo}</p>
                        <div style={styles.destaqueRow}>
                            <span style={{
                                ...styles.categoriaBadge,
                                backgroundColor: coresPorCategoria[maisRecente.categoria] || "#6b7280"
                            }}>
                                {maisRecente.categoria}
                            </span>
                            <span style={styles.destaqueSub}>
                                {new Date(maisRecente.data_hora_prazo).toLocaleDateString('pt-BR')}
                            </span>
                        </div>
                    </div>
                )}
 
                {/* Mais próximo do prazo */}
                {maiorPrazo && (
                    <div className="dash-card" style={{ ...styles.destaque, borderColor: "#f59e0b" }}>
                        <span style={styles.destaqueLabel}>⚡ Próximo do prazo</span>
                        <p style={styles.destaqueTitulo}>{maiorPrazo.titulo}</p>
                        <div style={styles.destaqueRow}>
                            <span style={{
                                ...styles.categoriaBadge,
                                backgroundColor: coresPorCategoria[maiorPrazo.categoria] || "#6b7280"
                            }}>
                                {maiorPrazo.categoria}
                            </span>
                            <span style={{ ...styles.destaqueSub, color: "#f59e0b", fontWeight: 700 }}>
                                {formatarPrazo(maiorPrazo.data_hora_prazo)}
                            </span>
                        </div>
                    </div>
                )}
 
                {/* Categoria mais usada */}
                <div className="dash-card" style={styles.destaque}>
                    <span style={styles.destaqueLabel}>◈ Categoria top</span>
                    <p style={styles.destaqueTitulo}>{categoriaMaisUsada}</p>
                    <div style={styles.destaqueRow}>
                        <span style={{
                            ...styles.categoriaBadge,
                            backgroundColor: coresPorCategoria[categoriaMaisUsada] || "#6b7280"
                        }}>
                            {lembretes.filter(l => l.categoria === categoriaMaisUsada).length} lembretes
                        </span>
                    </div>
                </div>
 
            </div>
 
            {/* LISTA COMPLETA */}
            <div style={styles.listaWrapper}>
                <div style={styles.listaHeader}>
                    <span style={styles.listaTitulo}>Todos os lembretes</span>
                    <span style={styles.listaCount}>{lembretes.length}</span>
                </div>
 
                {listaPrioridade.map((l, i) => {
                    const status = calcularStatus(l.data_hora_prazo);
                    const prazo = new Date(l.data_hora_prazo);
                    return (
                        <div
                            key={l.id_lembrete}
                            className="lembrete-row"
                            style={{
                                ...styles.lembreteRow,
                                animationDelay: `${0.25 + i * 0.04}s`,
                                borderLeft: `3px solid ${coresPorCategoria[l.categoria] || "#6b7280"}`,
                            }}
                        >
                            {/* Lado esquerdo */}
                            <div style={styles.lembreteLeft}>
                                <span style={styles.lembreteTitulo}>{l.titulo}</span>
                                {l.descricao && (
                                    <span style={styles.lembreteDesc}>{l.descricao}</span>
                                )}
                                <div style={styles.lembreteMeta}>
                                    <span style={{
                                        ...styles.categoriaBadge,
                                        backgroundColor: coresPorCategoria[l.categoria] || "#6b7280",
                                        fontSize: '9px',
                                    }}>
                                        {l.categoria}
                                    </span>
                                    <span style={styles.lembreteData}>
                                        {prazo.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        {' · '}
                                        {prazo.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
 
                            {/* Lado direito */}
                            <div style={styles.lembreteRight}>
                                <span style={{
                                    ...styles.statusBadge,
                                    color: status.cor,
                                    borderColor: status.cor,
                                }}>
                                    {status.label}
                                </span>
                                <span style={{ ...styles.prazoRelativo, color: status.cor }}>
                                    {formatarPrazo(l.data_hora_prazo)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
 
