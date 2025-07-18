// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  VStack,
  HStack,
  Image,
  Heading,
  Text,
  Avatar,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
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


const Sidebar = () => {
  const [user, setUser] = useState<{ id: number; nome: string; cargo: string } | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
  }, [])
  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }
  // current path is location.pathname, if needed

  return (
    <Box w="60" bg="blue.50" p={4}>
      <VStack align="start" spacing={6}>
        <HStack>
          <Image src="/logo.png" alt="ReMed.io Logo" boxSize="40px" />
          <Heading size="md" fontFamily="Poppins, sans-serif" >ReMed.io</Heading>
        </HStack>
        <VStack align="start" spacing={4} w="full">
          <HStack spacing={3} w="full" p={2} bg="blue.100" borderRadius="md" justify="space-between">
            <HStack spacing={3}>
              <Avatar size="sm" src="/avatar.png" />
              <Box>
                <Text fontWeight="bold">{user?.nome ?? 'Usuário'}</Text>
                <Text fontSize="sm" color="red.500">{user?.cargo ?? 'Cargo'}</Text>
              </Box>
            </HStack>
            <Menu>
              <MenuButton as={IconButton} icon={<FiMoreVertical />} variant="ghost" size="sm" aria-label="Opções" />
              <MenuList minW="auto" w="auto">
                <MenuItem icon={<FiUser />} onClick={() => navigate('/profile')}>Editar Perfil</MenuItem>
                <MenuItem icon={<FiLogOut />} onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
          <VStack align="start" spacing={2} w="full">
            <HStack spacing={2} w="full" p={2} _hover={{ bg: 'blue.100', cursor: 'pointer' }} borderRadius="md" onClick={() => navigate('/dashboard')}>
              <FiBarChart2 />
              <Text>Dashboard</Text>
            </HStack>
            <HStack spacing={2} w="full" p={2} _hover={{ bg: 'blue.100', cursor: 'pointer' }} borderRadius="md" onClick={() => navigate('/estoque')}>
              <AiOutlineStock />
              <Text>Estoque</Text>
            </HStack>
            <HStack spacing={2} w="full" p={2} _hover={{ bg: 'blue.100', cursor: 'pointer' }} borderRadius="md" onClick={() => navigate('/movimentacoes')}>
              <FiShoppingCart />
              <Text>Movimentações</Text>
            </HStack>
            <HStack spacing={2} w="full" p={2} _hover={{ bg: 'blue.100', cursor: 'pointer' }} borderRadius="md">
              <FiClipboard />
              <Text>Relatórios</Text>
            </HStack>
            <HStack spacing={2} w="full" p={2} _hover={{ bg: 'blue.100', cursor: 'pointer' }} borderRadius="md">
              <FiBell />
              <Text>Notificações</Text>
              <Badge ml={2} colorScheme="red">01</Badge>
            </HStack>
            <HStack spacing={2} w="full" p={2} _hover={{ bg: 'blue.100', cursor: 'pointer' }} borderRadius="md">
              <FiUsers />
              <Text>Gestão de Usuários</Text>
            </HStack>
            <HStack spacing={2} w="full" p={2} _hover={{ bg: 'blue.100', cursor: 'pointer' }} borderRadius="md">
              <FiSettings />
              <Text>Configurações</Text>
            </HStack>
            <HStack spacing={2} w="full" p={2} _hover={{ bg: 'blue.100', cursor: 'pointer' }} borderRadius="md">
              <FiHelpCircle />
              <Text>Suporte/Ajuda</Text>
            </HStack>
          </VStack>
        </VStack>
      </VStack>
    </Box>
  )
}

export default Sidebar