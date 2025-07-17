import React, { useState, useEffect } from 'react'
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
    FiShoppingCart,
    FiBarChart2,
    FiClipboard,
    FiTrendingUp,
    FiAlertTriangle,
    FiBell,
    FiUsers,
    FiSettings,
    FiHelpCircle,
    FiMoreVertical,
    FiLogOut,
    FiUser,
    FiChevronDown,
} from 'react-icons/fi'
import { AiOutlineStock } from 'react-icons/ai'
import {
    MdHealthAndSafety,
    MdPayments,
    MdMedicalServices,
    MdWarningAmber,
    MdTranslate,
} from 'react-icons/md';
import { getEstatisticasMovimentacoes, getEstatisticasMovimentacoesMesAtual, getResumoEstoque, getResumoAlertas, getEstatisticasMovimentacoesPeriodo, getItemMaisVendidoPeriodo } from '../services/api'
import type { EstatisticasMovimentacao, ResumoEstoque, ResumoAlertas } from '../services/api'
import { useNavigate } from 'react-router-dom'
// FiChevronDown already imported above

const Dashboard: React.FC = () => {
    const navigate = useNavigate()
    const [isDark, setIsDark] = useState(false)
    // toggleColorMode removed as unused
    const [stats, setStats] = useState<EstatisticasMovimentacao | null>(null)
    const [statsMesAtual, setStatsMesAtual] = useState<EstatisticasMovimentacao | null>(null)
    const [resumo, setResumo] = useState<ResumoEstoque | null>(null)
    const [user, setUser] = useState<{ id: number; nome: string; cargo: string } | null>(null)
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [statsPeriodo, setStatsPeriodo] = useState<EstatisticasMovimentacao | null>(null);
    const [itemMaisVendido, setItemMaisVendido] = useState<string | null>(null);

    // Busca estatísticas ao montar componente
    useEffect(() => {
        console.log('Buscando estatísticas de movimentações...')
        getEstatisticasMovimentacoes()
            .then(res => {
                console.log('Estatísticas recebidas:', res.data)
                setStats(res.data)
            })
            .catch(err => console.error('Erro ao buscar estatísticas:', err))
    }, [])

    // Busca estatísticas do mês atual para receita
    useEffect(() => {
        console.log('Buscando estatísticas do mês atual...')
        getEstatisticasMovimentacoesMesAtual()
            .then(res => {
                console.log('Estatísticas do mês atual recebidas:', res.data)
                setStatsMesAtual(res.data)
            })
            .catch(err => console.error('Erro ao buscar estatísticas do mês atual:', err))
    }, [])

    // Busca resumo de estoque ao montar componente
    useEffect(() => {
        console.log('Buscando resumo de estoque...')
        getResumoEstoque()
            .then(data => {
                console.log('Resumo de estoque recebido:', data)
                setResumo(data)
            })
            .catch(err => console.error('Erro ao buscar resumo de estoque:', err))
    }, [])

    useEffect(() => {
        const stored = localStorage.getItem('user')
        if (stored) setUser(JSON.parse(stored))
    }, [])

    const handleLogout = () => {
        localStorage.clear()
        navigate('/login')
    }

    // Greeting logic
    const agora = new Date()
    const horas = agora.getHours()
    const isDayTime = horas >= 6 && horas < 18
    const greeting = isDayTime ? 'Bom dia!' : 'Boa noite!'
    const greetingDate = agora.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    const greetingTime = agora.toLocaleTimeString('pt-BR')

    // Determinar status do estoque baseado em resumo de estoque
    const statusInfo = resumo ? (() => {
        if (resumo.produtos_vencidos > 0) {
            return { label: 'Vencido', borderColor: 'red.400', buttonScheme: 'red', icon: <MdWarningAmber size={28} color="#ff2a12ff" /> };
        }
        if (resumo.produtos_proximo_vencimento > 0) {
            return { label: 'Próximo vencimento', borderColor: 'yellow.400', buttonScheme: 'yellow', icon: <MdHealthAndSafety size={28} color="#F1C40F" /> };
        }
        if (resumo.produtos_estoque_critico > 0) {
            return { label: 'Estoque crítico', borderColor: 'orange.400', buttonScheme: 'orange', icon: <MdHealthAndSafety size={28} color="#D35400" /> };
        }
        if (resumo.produtos_estoque_baixo > 0) {
            return { label: 'Estoque baixo', borderColor: 'yellow.300', buttonScheme: 'yellow', icon: <MdHealthAndSafety size={28} color="#f8e539ff" /> };
        }
        return { label: 'Normal', borderColor: 'green.400', buttonScheme: 'green', icon: <MdHealthAndSafety size={28} color="#01A768" /> };
    })() : { label: '...', borderColor: 'gray.400', buttonScheme: 'gray', icon: <MdHealthAndSafety size={28} color="#01A768" /> };

    const periodOptions = React.useMemo((): { mes: number; ano: number }[] => {
        const opts = [] as { mes: number; ano: number }[];
        for (let i = 0; i < 12; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            opts.push({ mes: d.getMonth() + 1, ano: d.getFullYear() });
        }
        return opts;
    }, []);

    React.useEffect(() => {
        getEstatisticasMovimentacoesPeriodo(selectedMonth, selectedYear)
            .then(res => setStatsPeriodo(res.data))
            .catch(err => console.error('Erro ao buscar estatísticas do período:', err));
        getItemMaisVendidoPeriodo(selectedMonth, selectedYear)
            .then(data => setItemMaisVendido(data.item))
            .catch(err => console.error('Erro ao buscar item mais vendido:', err));
    }, [selectedMonth, selectedYear]);

    const monthNames = [
        'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
        'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
    ];

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
                            <HStack spacing={2} w="full" p={2} _hover={{ bg: 'blue.100', cursor: 'pointer' }} borderRadius="md">
                                <FiBarChart2 />
                                <Text>Dashboard</Text>
                            </HStack>
                            <HStack spacing={2} w="full" p={2} _hover={{ bg: 'blue.100', cursor: 'pointer' }} borderRadius="md" onClick={() => navigate('/estoque')}>
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

                {/* Dashboard Overview */}
                <Box p={6}>
                    <Heading size="lg">Dashboard</Heading>
                    <Text color="gray.600">Uma visão geral da saúde do seu estoque e movimentações recentes da farmácia.</Text>
                    <SimpleGrid columns={[1, 2, 4]} spacing={4} mt={6}>
                        <Box bg="white" p={4} borderLeft="4px solid" borderColor={statusInfo.borderColor} borderRadius="md">
                            <HStack justify="space-between">
                                <Box>
                                    <Text fontSize="sm" color="gray.500">Status do estoque</Text>
                                    <Heading size="md">{statusInfo.label}</Heading>
                                </Box>
                                {statusInfo.icon}
                            </HStack>
                            <Button variant="link" mt={2} colorScheme={statusInfo.buttonScheme}>
                                Ver Relatório Detalhado &raquo;
                            </Button>
                        </Box>

                        <Box bg="white" p={4} borderLeft="4px solid" borderColor="yellow.400" borderRadius="md">
                            <HStack justify="space-between">
                                <Box>
                                    <Text fontSize="sm" color="gray.500">Receita do Mês Atual</Text>
                                    <Heading size="md">
                                        {statsMesAtual?.valor_total_saida 
                                            ? `R$ ${statsMesAtual.valor_total_saida.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
                                            : '...'
                                        }
                                    </Heading>
                                </Box>
                                <MdPayments size={28} color="#F1C40F" />
                            </HStack>
                            <Button variant="link" mt={2} colorScheme="yellow">
                                Ver Relatório Detalhado &raquo;
                            </Button>
                        </Box>

                        <Box bg="white" p={4} borderLeft="4px solid" borderColor="blue.300" borderRadius="md">
                            <HStack justify="space-between">
                                <Box>
                                    <Text fontSize="sm" color="gray.500">Total de movimentações</Text>
                                    <Heading size="md">{stats?.total_movimentacoes ?? '...'}</Heading>
                                </Box>
                                <MdMedicalServices size={28} color="#BFDDFF" />
                            </HStack>
                            <Button variant="link" mt={2} colorScheme="blue">
                                Ir para Estoque &raquo;
                            </Button>
                        </Box>

                        <Box bg="white" p={4} borderLeft="4px solid" borderColor="red.400" borderRadius="md">
                            <HStack justify="space-between">
                                <Box>
                                    <Text fontSize="sm" color="gray.500">Produtos em estoque crítico</Text>
                                    <Heading size="md">{resumo?.produtos_estoque_critico ?? '...'}</Heading>
                                </Box>
                                <MdWarningAmber size={28} color="#E74C3C" />
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
                                    Ir para Estoque »
                                </Button>
                            </HStack>
                            <Divider my={3} />
                            <HStack justify="space-around">
                                <Box textAlign="center">
                                    <Heading size="md">{resumo?.total_itens ?? '...'}</Heading>
                                    <Text>Total de Medicamentos</Text>
                                </Box>
                                <Box textAlign="center">
                                    <Heading size="md">{resumo?.total_produtos_diferentes ?? '...'}</Heading>
                                    <Text>Medicine Groups</Text>
                                </Box>
                            </HStack>
                        </Box>

                        <Box bg="white" p={4} borderRadius="md">
                            <HStack justify="space-between">
                                <Text fontWeight="bold">Resumo do Mês</Text>
                                <Menu>
                                    <MenuButton as={Button} variant="outline" size="sm" rightIcon={<FiChevronDown />}>
                                        {monthNames[selectedMonth - 1]} {selectedYear}
                                    </MenuButton>
                                    <MenuList>
                                        {periodOptions.map(opt => (
                                            <MenuItem key={`${opt.ano}-${opt.mes}`} onClick={() => { setSelectedMonth(opt.mes); setSelectedYear(opt.ano); }}>
                                                {monthNames[opt.mes - 1]} {opt.ano}
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </Menu>
                            </HStack>
                            <Divider my={3} />
                            <HStack justify="space-around">
                                <Box textAlign="center">
                                    <Heading size="md">{statsPeriodo?.total_saidas?.toLocaleString() ?? '...'}</Heading>
                                    <Text>Total de Saídas Registradas</Text>
                                </Box>
                                <Box textAlign="center">
                                    <Heading size="md">{itemMaisVendido ?? '...'}</Heading>
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
                                Ir para Notificações »
                            </Button>
                        </HStack>
                        <Divider my={3} />
                        <HStack justify="space-around">
                            <Box textAlign="center">
                                <Heading size="md">{resumo?.produtos_vencidos ?? '...'}</Heading>
                                <Text>Produtos Vencidos</Text>
                            </Box>
                            <Box textAlign="center">
                                <Heading size="md">{resumo?.produtos_estoque_critico ?? '...'}</Heading>
                                <Text>Produtos com Estoque Crítico</Text>
                            </Box>
                        </HStack>
                    </Box>
                </Box>
            </Flex>
        </Flex>
    )
}

export default Dashboard
