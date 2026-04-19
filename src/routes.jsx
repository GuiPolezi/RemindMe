import { Routes, Route } from "react-router-dom"
import { Login } from "./components/Login"
import { Register } from "./components/Register"
import { PublicRoute } from "./components/PublicRoute"
import { PrivateRoute } from "./components/PrivateRoute"
import { AddLembrete } from "./components/Lembrete"
import { Home } from './pages/index'
import  MonitorPanel from './components/MonitorPanel'

export default function AppRoutes({ session }) {
  return (
    <Routes>

      <Route
        path="/"
        element={
          <PrivateRoute session={session}>
            <Home />
          </PrivateRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute session={session}>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute session={session}>
            <Register />
          </PublicRoute>
        }
      />

      <Route
        path="/criarlembrete"
        element={
          <PrivateRoute session={session}>
            <AddLembrete />
          </PrivateRoute>
        }
      />

      <Route
        path="/monitor"
        element={
          <PrivateRoute session={session}>
            <MonitorPanel />
          </PrivateRoute>
        }
      />

      {/* 🔹 ROTA 404: DEVE SER ESTRITAMENTE A ÚLTIMA ROTA 
      <Route 
        path="*" 
        element={
          <NotFound />
        } 
      />*/}

    </Routes>
  )
}