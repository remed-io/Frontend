import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Estoque from './pages/Estoque.tsx'

function App() {
  return (
    <Routes>
      {/* Página inicial direciona para login */}
      <Route path="/" element={<Login />} />
      {/* Alias /login */}
      <Route path="/login" element={<Navigate to="/" replace />} />
      {/* Dashboard protegido */}
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      {/* Estoque protegido */}
      <Route path="/estoque" element={<PrivateRoute><Estoque /></PrivateRoute>} />
      {/* Qualquer outra rota volta para login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuth = Boolean(localStorage.getItem('token'))
  return isAuth ? children : <Navigate to="/login" replace />
}

export default App
