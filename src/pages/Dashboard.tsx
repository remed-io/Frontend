import React, { useState } from 'react'
import {
    Flex,
    Box,
    VStack,
    HStack,
    SimpleGrid,
    Heading,
    Text,
    Image,
    Avatar,
    Button,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    Divider,
    Badge,
} from '@chakra-ui/react'
import {
    FiSearch,
    FiSun,
    FiMoon,
    FiShoppingCart,
    FiBarChart2,
    FiClipboard,
    FiTrendingUp,
    FiAlertTriangle,
    FiBell,
    FiUsers,
    FiSettings,
    FiHelpCircle,
} from 'react-icons/fi'
import { AiOutlineStock } from 'react-icons/ai'

const Dashboard: React.FC = () => {
    const [isDark, setIsDark] = useState(false)
    const toggleColorMode = () => setIsDark(!isDark)

    return (
        <Flex h="100vh" fontFamily="Poppins, sans-serif" bg={isDark ? 'gray.900' : 'gray.100'} color={isDark ? 'white' : 'black'}>
            {/* Sidebar */}
            <Box w="60" bg="blue.50" p={4}>
                <VStack align="start" spacing={6}>
                    <HStack>
                        <Image src="/logo.png" alt="ReMed.io Logo" boxSize="40px" />
                        <Heading size="md" fontFamily="Poppins, sans-serif" >ReMed.io</Heading>
                    </HStack>
                    <VStack align="start" spacing={4} w="full">
                        <HStack spacing={3} w="full" p={2} bg="blue.100" borderRadius="md">
                            <Avatar size="sm" src="/avatar.png" />
                            <Box>
                                <Text fontWeight="bold">Luck</Text>
                                <Text fontSize="sm" color="red.500">Super Admin</Text>
                            </Box>
                        </HStack>
                        <VStack align="start" spacing={2} w="full">
                            <HStack spacing={2} w="full" p={2} _hover={{ bg: 'blue.100', cursor: 'pointer' }} borderRadius="md">
                                <FiBarChart2 />
                                <Text>Dashboard</Text>
                            </HStack>
                            <HStack spacing={2} w="full" p={2} _hover={{ bg: 'blue.100', cursor: 'pointer' }} borderRadius="md">
                                <AiOutlineStock />
                                <Text>Estoque</Text>
                            </HStack>
                            <HStack spacing={2} w="full" p={2} _hover={{ bg: 'blue.100', cursor: 'pointer' }} borderRadius="md">
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

            {/* Main Content */}
            <Flex direction="column" flex={1} bg="gray.100">
                {/* Header */}
                <HStack justify="space-between" p={4} bg="white" boxShadow="sm">
                    <InputGroup maxW="xs">
                        <InputLeftElement pointerEvents="none">
                            <FiSearch color="gray.500" />
                        </InputLeftElement>
                        <Input placeholder="Buscar" bg="gray.50" />
                    </InputGroup>
                    <HStack spacing={4}>
                        <IconButton
                            aria-label="Toggle Color Mode"
                            icon={isDark ? <FiSun /> : <FiMoon />}
                            onClick={toggleColorMode}
                        />
                        <Select w="auto" size="sm" value="pt-BR">
                            <option value="pt-BR">Português (BR)</option>
                        </Select>
                        <Text>Bom dia! 14 Janeiro 2025 · 22:45:04</Text>
                    </HStack>
                </HStack>

                {/* Dashboard Overview */}
                <Box p={6}>
                    <Heading size="lg">Dashboard</Heading>
                    <Text color="gray.600">Uma visão geral da saúde do seu estoque e movimentações recentes da farmácia.</Text>
                    <SimpleGrid columns={[1, 2, 4]} spacing={4} mt={6}>
                        <Box bg="white" p={4} borderLeft="4px solid" borderColor="green.400" borderRadius="md">
                            <HStack justify="space-between">
                                <Box>
                                    <Text fontSize="sm" color="gray.500">Status do estoque</Text>
                                    <Heading size="md">Em dia</Heading>
                                </Box>
                                <FiClipboard size={24} color="green" />
                            </HStack>
                            <Button variant="link" mt={2} colorScheme="green">
                                Ver Relatório Detalhado &raquo;
                            </Button>
                        </Box>

                        <Box bg="white" p={4} borderLeft="4px solid" borderColor="yellow.400" borderRadius="md">
                            <HStack justify="space-between">
                                <Box>
                                    <Text fontSize="sm" color="gray.500">Receita: Jan 2025</Text>
                                    <Heading size="md">R$ 80.000,00</Heading>
                                </Box>
                                <FiTrendingUp size={24} color="yellow" />
                            </HStack>
                            <Button variant="link" mt={2} colorScheme="yellow">
                                Ver Relatório Detalhado &raquo;
                            </Button>
                        </Box>

                        <Box bg="white" p={4} borderLeft="4px solid" borderColor="blue.300" borderRadius="md">
                            <HStack justify="space-between">
                                <Box>
                                    <Text fontSize="sm" color="gray.500">Medicamentos Disponíveis</Text>
                                    <Heading size="md">298</Heading>
                                </Box>
                                <FiShoppingCart size={24} color="blue" />
                            </HStack>
                            <Button variant="link" mt={2} colorScheme="blue">
                                Ir para Estoque &raquo;
                            </Button>
                        </Box>

                        <Box bg="white" p={4} borderLeft="4px solid" borderColor="red.400" borderRadius="md">
                            <HStack justify="space-between">
                                <Box>
                                    <Text fontSize="sm" color="gray.500">Medicamento em Falta</Text>
                                    <Heading size="md">01</Heading>
                                </Box>
                                <FiAlertTriangle size={24} color="red" />
                            </HStack>
                            <Button variant="link" mt={2} colorScheme="red">
                                Resolver Agora &raquo;
                            </Button>
                        </Box>
                    </SimpleGrid>

                    {/* Lower Summary Grids */}
                    <SimpleGrid columns={[1, 1, 2]} spacing={4} mt={6}>
                        <Box bg="white" p={4} borderRadius="md">
                            <HStack justify="space-between">
                                <Text fontWeight="bold">Estoque</Text>
                                <Button variant="link" colorScheme="blue" size="sm">
                                    Ir para Estoque &raquo;
                                </Button>
                            </HStack>
                            <Divider my={2} />
                            <HStack justify="space-around">
                                <Box textAlign="center">
                                    <Heading size="md">298</Heading>
                                    <Text>Total de Medicamentos</Text>
                                </Box>
                                <Box textAlign="center">
                                    <Heading size="md">24</Heading>
                                    <Text>Medicine Groups</Text>
                                </Box>
                            </HStack>
                        </Box>

                        <Box bg="white" p={4} borderRadius="md">
                            <HStack justify="space-between">
                                <Text fontWeight="bold">Resumo Rápido do Mês</Text>
                                <Select size="sm" variant="unstyled">
                                    <option>Janeiro 2025</option>
                                </Select>
                            </HStack>
                            <Divider my={2} />
                            <HStack justify="space-around">
                                <Box textAlign="center">
                                    <Heading size="md">70.856</Heading>
                                    <Text>Total de Saídas Registradas</Text>
                                </Box>
                                <Box textAlign="center">
                                    <Heading size="md">Nimesulida</Heading>
                                    <Text>Item Mais Retirado</Text>
                                </Box>
                            </HStack>
                        </Box>
                    </SimpleGrid>

                    {/* Footer Quick Alerts */}
                    <Box mt={6} bg="white" p={4} borderRadius="md">
                        <HStack justify="space-between">
                            <Text fontWeight="bold">Alertas Ativos</Text>
                            <Button variant="link" colorScheme="blue" size="sm">
                                Ir para Notificações &raquo;
                            </Button>
                        </HStack>
                        <Divider my={2} />
                        <HStack justify="space-around">
                            <Box textAlign="center">
                                <Heading size="md">08</Heading>
                                <Text>Produtos Vencidos</Text>
                            </Box>
                            <Box textAlign="center">
                                <Heading size="md">05</Heading>
                                <Text>Produtos em Falta</Text>
                            </Box>
                        </HStack>
                    </Box>
                </Box>
            </Flex>
        </Flex>
    )
}

export default Dashboard
