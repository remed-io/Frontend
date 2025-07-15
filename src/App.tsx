import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Signup from './pages/Signup'

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    </Routes>
  )
}

function PrivateRoute({ children }: { children: JSX.Element }) {
  const isAuth = Boolean(localStorage.getItem('token'))
  return isAuth ? children : <Navigate to="/login" replace />
}

export default App
