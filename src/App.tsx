// React import not required with new JSX transform
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Estoque from './pages/Estoque.tsx'
import ListaProdutos from './pages/ListaProdutos.tsx'
import DetalheProduto from './pages/DetalheProduto.tsx'
import AdicionarProduto from './pages/AdicionarProduto.tsx'
import Movimentacoes from './pages/Movimentacoes.tsx'
import ListaUsuarios from './pages/ListaUsuarios.tsx'

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
      {/* Lista de Produtos protegido */}
      <Route path="/estoque/produtos" element={<PrivateRoute><ListaProdutos /></PrivateRoute>} />
      {/* Adicionar Produto protegido */}
      <Route path="/estoque/produtos/novo" element={<PrivateRoute><AdicionarProduto /></PrivateRoute>} />
      {/* Detalhe de Produto protegido */}
      <Route path="/estoque/produtos/:itemId" element={<PrivateRoute><DetalheProduto /></PrivateRoute>} />
      {/* Movimentações protegido */}
      <Route path="/movimentacoes" element={<PrivateRoute><Movimentacoes /></PrivateRoute>} />
      {/* Lista de Usuários protegido */}
      <Route path="/usuarios" element={<PrivateRoute><ListaUsuarios /></PrivateRoute>} />
      {/* Qualquer outra rota volta para login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function PrivateRoute({ children }: any) {
  const isAuth = Boolean(localStorage.getItem('token'))
  return isAuth ? children : <Navigate to="/login" replace />
}

export default App
