import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  VStack,
  HStack,
  Image,
  Heading,
  Text,
} from '@chakra-ui/react'
import {
  FiBarChart2,
  FiShoppingCart,
  FiClipboard,
  FiBell,
  FiUsers,
  FiSettings,
  FiHelpCircle,
  FiMoreVertical,
  FiUser,
  FiLogOut,
} from 'react-icons/fi'
import { AiOutlineStock } from 'react-icons/ai'

interface MenuItemConfig {
  label: string
  icon: React.ElementType
  path: string
}

const menuItems: MenuItemConfig[] = [
  { label: 'Dashboard', icon: FiBarChart2, path: '/dashboard' },
  { label: 'Estoque', icon: AiOutlineStock, path: '/estoque' },
  { label: 'Movimentações', icon: FiShoppingCart, path: '/movimentacoes' },
  { label: 'Relatórios', icon: FiClipboard, path: '/relatorios' },
  { label: 'Notificações', icon: FiBell, path: '/notificacoes' },
  { label: 'Gestão de Usuários', icon: FiUsers, path: '/usuarios' },
  { label: 'Configurações', icon: FiSettings, path: '/configuracoes' },
  { label: 'Suporte/Ajuda', icon: FiHelpCircle, path: '/suporte' },
]

const Sidebar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const current = location.pathname

  return (
    <Box w="60" bg="blue.50" p={4} h="100vh">
      <VStack align="start" spacing={6}>
        <HStack>
          <Image src="/logo.png" alt="ReMed.io Logo" boxSize="40px" />
          <Heading size="md" fontFamily="Poppins, sans-serif">ReMed.io</Heading>
        </HStack>
        <VStack align="start" spacing={4} w="full">
          {/* Profile section */}
          <HStack spacing={3} w="full" p={2} bg="blue.100" borderRadius="md" justify="space-between">
            <HStack spacing={3}>
              <Image src="/avatar.png" alt="Avatar" boxSize="24px" borderRadius="full" />
              <Box>
                <Text fontWeight="bold">Usuário</Text>
                <Text fontSize="sm" color="red.500">Cargo</Text>
              </Box>
            </HStack>
            <HStack>
              <FiMoreVertical />
            </HStack>
          </HStack>
          {/* Menu items */}
          <VStack align="start" spacing={2} w="full">
            {menuItems.map(item => {
              const Icon = item.icon
              const isActive = current.startsWith(item.path)
              return (
                <HStack
                  key={item.path}
                  spacing={2}
                  w="full"
                  p={2}
                  borderRadius="md"
                  bg={isActive ? 'blue.100' : 'transparent'}
                  cursor="pointer"
                  _hover={{ bg: 'blue.100' }}
                  onClick={() => navigate(item.path)}
                >
                  <Icon />
                  <Text>{item.label}</Text>
                </HStack>
              )
            })}
          </VStack>
        </VStack>
      </VStack>
    </Box>
  )
}

export default Sidebar
