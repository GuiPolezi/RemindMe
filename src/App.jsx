import { useEffect, useState } from 'react'
import { supabase } from './services/supabase'
import AppRoutes from './routes'



function App() {
  const [ session, setSession ] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verifica a sessão atual ao carregar a página
    supabase.auth.getSession().then(({data: {session}}) => {
      setSession(session)
      setLoading(false)
    })

    // Escuta mudanças na autenticação (login/logout)
    const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

    if (loading) return null // ou um spinner se preferir

  return (
    <AppRoutes session={session} />
  )
}

export default App