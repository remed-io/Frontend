import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.tsx'
import Dashboard from './pages/Dashboard.tsx'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    </Routes>
  )
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuth = Boolean(localStorage.getItem('token'))
  return isAuth ? children : <Navigate to="/login" replace />
}

export default App
