import { AddLembrete, GetLembrete, GetCalendarLembretes, GetListaLembretes } from '../components/Lembrete'
import { useState, useRef, useEffect } from "react";
import { authService } from '../services/authService'
import { useNavigate } from 'react-router-dom';
import gsap from "gsap";


const menuItems = [
  { icon: "◈", label: "Início", shortcut: "H", isHome: true },
  { icon: "◎", label: "Lembretes", shortcut: "L" },
  { icon: "◉", label: "Calendário", shortcut: "C", isCalendar: true },
  { icon: "◐", label: "Configurações", shortcut: "S" },
  { icon: "◌", label: "Sair", shortcut: "Q", danger: true, isLogout: true},
];


export function MenuButton() {
  const [open, setOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();
  const menuRef = useRef(null);
 
  useEffect(() => {
    function handleClickFora(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  async function handleLogout() {
    try {
      await authService.signOut();
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleIndex() {
    try {
        navigate('/');
    } catch (e) {
        alert(e.message)
    }
  }

  async function handleCalendar() {
    const section = document.getElementById("calendar");
    if (section) {
        section.scrollIntoView({ behavior: "smooth" }); // ← rola suavemente até a seção
    }
  }

  function handleItemClick(item) {
    if (item.isLogout) handleLogout(); // ✅ chama o logout
    if (item.isHome) handleIndex();
    if (item.isCalendar) handleCalendar();
    setOpen(false);
  }
 
  return (
    <>
 
      <div className="menu-wrapper" ref={menuRef}>
        <button
          className={`menu-btn ${open ? "active" : ""}`}
          onClick={() => setOpen((prev) => !prev)}
        >
          <div className="burger">
            <div className="burger-line" />
            <div className="burger-line" />
            <div className="burger-line" />
          </div>
          <span>MENU</span>
        </button>
 
        {open && (
          <div className="dropdown">
            <div className="dropdown-header">Navegação</div>
            {menuItems.map((item, i) => (
              <div
                key={i}
                className={`dropdown-item ${item.danger ? "danger" : ""}`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => {
                  handleItemClick(item);
                }}
              >
                <div className="accent-bar" />
                <span className="item-icon">{item.icon}</span>
                <span className="item-label">{item.label}</span>
                <span className="item-shortcut">{item.shortcut}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export function Navegacao() {
    const [aba, setAba] = useState("calendario");

    return (
        <div>
            {/* Navegação */}
            <nav className='flex gap-5'>
                <button className='nav'
                    onClick={() => setAba("calendario")}
                    style={{
                      fontWeight: aba === "calendario" ? "bold" : "normal",
                      backgroundColor: aba === "calendario" ? "#111" : "white",
                      padding:  aba === "calendario" ? "10px" : "0px",
                      color: aba === "calendario" ? "white" : "gray",
                      borderTopLeftRadius: aba === "calendario" ? "10px" : "0px",
                      borderTopRightRadius: aba === "calendario" ? "10px" : "0px",
                    }}
                >
                    Calendário
                </button>
                <button className='nav'
                    onClick={() => setAba("lista")}
                    style={{
                      fontWeight: aba === "lista" ? "bold" : "normal",
                      backgroundColor: aba === "lista" ? "#111" : "white",
                      padding:  aba === "lista" ? "10px" : "0px",
                      color: aba === "lista" ? "white" : "gray",
                      borderTopLeftRadius: aba === "lista" ? "10px" : "0px",
                      borderTopRightRadius: aba === "lista" ? "10px" : "0px",
                    }}
                >
                    Lista
                </button>
            </nav>

            {/* Conteúdo */}
            {aba === "calendario" &&
                <div className='nav-calendar'>
                    <GetCalendarLembretes />
                </div>
            }

            {aba === "lista" && 
                <div>
                    <GetListaLembretes />
                </div>
            }
        </div>
    )
}

export function Home() {
    const midRef = useRef(null);

    useEffect(() => {
        gsap.set(midRef.current, {
            width: 0,
            opacity: 0,
            overflow: "hidden",
            display: "inline-block",
            whiteSpace: "nowrap",
        });
    }, []);

    function handleMouseEnter() {
        gsap.to(midRef.current, {
            width: "auto",
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
        });
    }

    function handleMouseLeave() {
        gsap.to(midRef.current, {
            width: 0,
            opacity: 0,
            duration: 0.4,
            ease: "power2.in",
        });
    }
    return (
        <>
            <section className='header p-5'>
                <div className="grid grid-cols-2">
                    <div className="col-span-2 sm:col-span-1">
                        <h1 className='text-7xl font-bold' style={{ cursor: "default", display: "inline-flex", alignItems: "baseline" }}
                             onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                            <span>R.</span>
                            <span ref={midRef}>emind</span>
                            <span>ME</span>
                        </h1>
                    </div>
                    <div className="col-span-2 sm:col-span-1 self-end flex justify-center sm:justify-end">
                       <MenuButton />
                    </div>
                </div>
            </section>

            <section className='calendar p-5 mt-15' id='calendar'>
                <Navegacao />
            </section>

        </>
    );
}