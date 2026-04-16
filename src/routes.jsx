import { Routes, Route } from "react-router-dom"
import { Login } from "./components/Login"
import { Register } from "./components/Register"
import { PublicRoute } from "./components/PublicRoute"
import { PrivateRoute } from "./components/PrivateRoute"
import { Home } from './pages/index'


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