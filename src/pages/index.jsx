import { Logout } from '../components/Logout'
import { AddLembrete, GetLembrete, GetCalendarLembretes } from '../components/Lembrete'
import { useState, useRef, useEffect } from "react"; // ← adicione isso

export function Home() {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    
    useEffect(() => {
        function handleCliqueFora(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleCliqueFora);  // ← nome corrigido
        return () => document.removeEventListener("mousedown", handleCliqueFora); // ← nome corrigido
    }, []);

    return (
        <>
            <section className='header p-5'>
                <div className="grid grid-cols-2">
                    <div className="col-span-2 sm:col-span-1 bg-gray-500">
                        <h1 className='text-7xl font-bold'>RemindME</h1>
                    </div>
                    <div className="col-span-2 sm:col-span-1 bg-blue-500 self-end flex justify-center sm:justify-end">
                        <div ref={menuRef} className='menu'>
                            <button className='text-3xl font-bold btn-menu' onClick={() => setOpen(prev => !prev)}>MENU</button>
                            {open && (
                                <div className='opn-menu'>
                                    <p>lorem</p>
                                </div>
                              
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <Logout />
            <AddLembrete />
            <GetCalendarLembretes />
        </>
    );
}