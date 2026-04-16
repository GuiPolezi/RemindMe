import { useEffect, useState } from 'react'
import { supabase } from './services/supabase'
import AppRoutes from './routes'

import './App.css'



function App() {
  const [ session, setSession ] = useState(null)

  useEffect(() => {
    // Verifica a sessão atual ao carregar a página
    supabase.auth.getSession().then(({data: {session}}) => {
      setSession(session)
    })

    // Escuta mudanças na autenticação (login/logout)
    const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AppRoutes session={session} />
  )
}

export default App