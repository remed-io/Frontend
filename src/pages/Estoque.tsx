import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Flex,
  Box,
  VStack,
  HStack,
  SimpleGrid,
  Heading,
  Text,
  Button,
  Image,
  Avatar,
  InputGroup,
  Input,
  InputRightElement,
  Select,
  Divider,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import {
  FiSearch,
  FiSun,
  FiMoon,
  FiMoreVertical,
  FiUser,
  FiLogOut,
} from 'react-icons/fi'
import { AiOutlineStock } from 'react-icons/ai'
import { MdTranslate, MdWarningAmber } from 'react-icons/md'
import { getResumoEstoque } from '../services/api'
import type { ResumoEstoque } from '../services/api'

const Estoque: React.FC = () => {
  const navigate = useNavigate()
  const [resumo, setResumo] = useState<ResumoEstoque | null>(null)

  // Busca resumo de estoque
  useEffect(() => {
    getResumoEstoque()
      .then(data => setResumo(data))
      .catch(err => console.error('Erro ao buscar resumo de estoque:', err))
  }, [])

  // Data e hora para header
  const agora = new Date()
  const horas = agora.getHours()
  const isDayTime = horas >= 6 && horas < 18
  const greeting = isDayTime ? 'Bom dia!' : 'Boa noite!'
  const greetingDate = agora.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
  const greetingTime = agora.toLocaleTimeString('pt-BR')

  return (
    <Flex h="100vh" fontFamily="Poppins, sans-serif" bg="gray.100">
      {/* Sidebar */}
      <Box w="60" bg="blue.50" p={4}>
        <VStack align="start" spacing={6}>
          <HStack>
            <Image src="/logo.png" alt="ReMed.io Logo" boxSize="40px" />
            <Heading size="md" fontFamily="Poppins, sans-serif">ReMed.io</Heading>
          </HStack>
          <VStack align="start" spacing={4} w="full">
            <HStack spacing={3} w="full" p={2} _hover={{ bg: 'blue.100', cursor: 'pointer' }} borderRadius="md" onClick={() => navigate('/dashboard')}>
              <FiSearch />
              <Text>Dashboard</Text>
            </HStack>
            <HStack spacing={3} w="full" p={2} _hover={{ bg: 'blue.100', cursor: 'pointer' }} borderRadius="md" onClick={() => navigate('/estoque')}>
              <AiOutlineStock />
              <Text>Estoque</Text>
            </HStack>
          </VStack>
        </VStack>
      </Box>

      {/* Main Content */}
      <Flex direction="column" flex={1} bg="gray.100">
        {/* Header */}
        <HStack justify="space-between" p="4" bg="white" boxShadow="sm">
          <InputGroup flex={1} maxW="600px">
            <Input placeholder="Buscar no sistema" bg="gray.50" borderRadius="md" />
            <InputRightElement pointerEvents="none">
              <FiSearch color="gray.500" />
            </InputRightElement>
          </InputGroup>
          <HStack spacing={5} align="center">
            <HStack spacing={1} align="center">
              <MdTranslate size={20} />
              <Select size="sm" variant="unstyled" w="auto" value="pt-BR">
                <option value="pt-BR">Português (BR)</option>
              </Select>
            </HStack>
            <VStack spacing={0} align="flex-end" textAlign="right">
              <HStack spacing={1} align="center">
                {isDayTime ? <FiSun size={20} color="#F1C40F" /> : <FiMoon size={20} color="#2C3E50" />}
                <Text fontSize="3sm" fontWeight="bold">{greeting}</Text>
              </HStack>
              <Text fontSize="sm">{greetingDate} · {greetingTime}</Text>
            </VStack>
          </HStack>
        </HStack>

        {/* Estoque Overview */}
        <Box p={6}>
          <Heading size="lg">Estoque</Heading>
          <Text color="gray.600">Lista de produtos disponíveis para venda.</Text>
          <SimpleGrid columns={[1, 2, 4]} spacing={4} mt={6}>
            <Box bg="white" p={4} borderLeft="4px solid" borderColor="blue.300" borderRadius="md">
              <HStack justify="space-between">
                <Box>
                  <Text fontSize="sm" color="gray.500">Medicamentos Disponíveis</Text>
                  <Heading size="md">{resumo?.total_itens ?? '...'}</Heading>
                </Box>
                <AiOutlineStock size={28} color="#3182CE" />
              </HStack>
              <Button variant="link" mt={2} colorScheme="blue">Ver Medicamentos »</Button>
            </Box>

            <Box bg="white" p={4} borderLeft="4px solid" borderColor="green.300" borderRadius="md">
              <HStack justify="space-between">
                <Box>
                  <Text fontSize="sm" color="gray.500">Produtos Disponíveis</Text>
                  <Heading size="md">{resumo?.total_produtos_diferentes ?? '...'}</Heading>
                </Box>
                <AiOutlineStock size={28} color="#38A169" />
              </HStack>
              <Button variant="link" mt={2} colorScheme="green">Ver Produtos »</Button>
            </Box>

            <Box bg="white" p={4} borderLeft="4px solid" borderColor="red.400" borderRadius="md">
              <HStack justify="space-between">
                <Box>
                  <Text fontSize="sm" color="gray.500">Medicamentos em Falta</Text>
                  <Heading size="md">{resumo?.produtos_estoque_critico ?? '...'}</Heading>
                </Box>
                <MdWarningAmber size={28} color="#E74C3C" />
              </HStack>
              <Button variant="link" mt={2} colorScheme="red">Resolver Agora »</Button>
            </Box>

            <Box bg="white" p={4} borderLeft="4px solid" borderColor="red.400" borderRadius="md">
              <HStack justify="space-between">
                <Box>
                  <Text fontSize="sm" color="gray.500">Produtos Vencidos</Text>
                  <Heading size="md">{resumo?.produtos_vencidos ?? '...'}</Heading>
                </Box>
                <MdWarningAmber size={28} color="#E74C3C" />
              </HStack>
              <Button variant="link" mt={2} colorScheme="red">Resolver Agora »</Button>
            </Box>
          </SimpleGrid>
        </Box>
      </Flex>
    </Flex>
  )
}

export default Estoque
