import { authService } from '../services/authService'
import { useState } from 'react'

export function Logout() {
    const [loading, setLoading] = useState(false)

        const handleLogout = async () => {
        setLoading(true)
        try {
            await authService.signOut()
        } catch (error) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return <button className='buttonHeader' onClick={handleLogout}>Sair do Sistema</button>
}