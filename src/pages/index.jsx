import { AddLembrete, GetLembrete, GetCalendarLembretes } from '../components/Lembrete'
import { useState, useRef, useEffect } from "react";
import { authService } from '../services/authService'
import { useNavigate } from 'react-router-dom';
import gsap from "gsap";


const menuItems = [
  { icon: "◈", label: "Início", shortcut: "H", isHome: true },
  { icon: "◎", label: "Lembretes", shortcut: "L" },
  { icon: "◉", label: "Calendário", shortcut: "C" },
  { icon: "◐", label: "Configurações", shortcut: "S" },
  { icon: "◌", label: "Sair", shortcut: "Q", danger: true, isLogout: true},
];


export default function MenuButton() {
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

  function handleItemClick(item) {
    if (item.isLogout) handleLogout(); // ✅ chama o logout
    if (item.isHome) handleIndex();
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
                    <div className="col-span-2 sm:col-span-1 bg-gray-500">
                        <h1 className='text-7xl font-bold' style={{ cursor: "default", display: "inline-flex", alignItems: "baseline" }}
                             onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                            <span>R</span>
                            <span ref={midRef}>emind</span>
                            <span>ME</span>
                        </h1>
                    </div>
                    <div className="col-span-2 sm:col-span-1 self-end flex justify-center sm:justify-end">
                       <MenuButton />
                    </div>
                </div>
            </section>

            <GetCalendarLembretes />
        </>
    );
}