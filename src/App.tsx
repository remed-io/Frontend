import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { ChakraProvider } from '@chakra-ui/react'
import theme from './theme'

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      </Routes>
    </ChakraProvider>
  )
}

function PrivateRoute({ children }: { children: JSX.Element }) {
  const isAuth = Boolean(localStorage.getItem('token'))
  return isAuth ? children : <Navigate to="/login" replace />
}

export default App
