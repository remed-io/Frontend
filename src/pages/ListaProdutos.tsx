// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Box,
    Flex,
    Heading,
    Text,
    Input,
    InputGroup,
    InputRightElement,
    Button,
    Select,
    HStack,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    IconButton,
    Spacer,
} from '@chakra-ui/react'
import { FiSearch, FiPlus, FiArrowRightCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
// import header icons inside Header component
import Sidebar from './Sidebar'
import Header from '../components/Header'
import { getEstoqueDetalhado } from '../services/api'

const ListaProdutos = () => {
    const navigate = useNavigate()
    const [detalhado, setDetalhado] = useState(null)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('')

    useEffect(() => {
        getEstoqueDetalhado()
            .then(data => setDetalhado(data))
            .catch(err => console.error('Erro ao buscar detalhes de estoque:', err))
    }, [])

    const items = detalhado?.itens || []
    // Filtrar itens pela descrição e tipo
    const filteredItems = items.filter(item =>
        item.produto_nome.toLowerCase().includes(search.toLowerCase()) &&
        (category ? item.tipo_produto === category : true)
    )
    // Paginação
    const itemsPerPage = 8
    const [currentPage, setCurrentPage] = useState(1)
    const totalItems = filteredItems.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
    const currentItems = filteredItems.slice(startIndex, endIndex)
    // Extrair categorias (tipos de produto)
    const categories = Array.from(new Set(items.map(item => item.tipo_produto)))
    // Rótulos legíveis para categorias
    const categoryLabels: Record<string, string> = {
        medicamento: 'Medicamentos',
        cuidado_pessoal: 'Cuidados Pessoais',
        suplemento_alimentar: 'Suplementos',
    }

    return (
        <Flex h="100vh" fontFamily="Poppins, sans-serif" bg="gray.100">
            <Sidebar />
            <Flex direction="column" flex={1} bg="gray.100">
                <Header />
                <Box flex="1" p={6}>
                    <Flex mb={4} align="center" justify="space-between" w="full">
                        <Heading size="lg" fontFamily="Poppins, sans-serif" >Estoque &gt; Lista de Produtos ({items.length})</Heading>
                        <Spacer />
                        <Button colorScheme="blue" leftIcon={<FiPlus />} onClick={() => navigate('/estoque/produtos/novo')}>
                            Adicionar Produto
                        </Button>
                    </Flex>
                    <Flex mb={4} align="center" justify="space-between" w="full">
                        <InputGroup maxW="300px">
                            <Input
                                placeholder="Buscar no Estoque"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <InputRightElement pointerEvents="none">
                                <FiSearch color="gray.500" />
                            </InputRightElement>
                        </InputGroup>
                        <Select
                            placeholder="- Selecionar Categoria -"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            maxW="250px"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {categoryLabels[cat] || cat}
                                </option>
                            ))}
                        </Select>
                    </Flex>
                    <Box overflowX="auto" bg="white" borderRadius="md">
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Nome do Produto</Th>
                                    <Th>Código de Barras</Th>
                                    <Th>Categoria</Th>
                                    <Th>Qtd. Disp.</Th>
                                    <Th>Ações</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                        {currentItems.map(item => (
                                    <Tr key={item.item_estoque_id}>
                                        <Td>{item.produto_nome}</Td>
                                        <Td>{item.codigo_barras}</Td>
                                        <Td>{item.tipo_produto}</Td>
                                        <Td>{item.quantidade_atual}</Td>
                                        <Td>
                                            <HStack spacing={4}>
                                                <Button variant="link" onClick={() => navigate(`/estoque/produtos/${item.item_estoque_id}`)}>
                                                    Ver Detalhes &raquo;
                                                </Button>
                                                <IconButton
                                                    aria-label="Registrar Saída"
                                                    icon={<FiArrowRightCircle size={18} color="white" />}
                                                    onClick={() => navigate(`/movimentacoes/saida/${item.item_estoque_id}`)}
                                                    bg="blue"
                                                    _hover={{ bg: 'darkblue' }}
                                                    borderRadius="4px"
                                                    w="30px"
                                                    h="30px"
                                                    minW="30px"
                                                    minH="30px"
                                                    variant="solid"
                                                />
                                            </HStack>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                    {/* Paginação */}
                    <Flex mt={4} align="center" justify="space-between">
                        <Text>{startIndex + 1} - {endIndex} de {totalItems}</Text>
                        <HStack spacing={2}>
                            <IconButton
                                aria-label="Página anterior"
                                icon={<FiChevronLeft />}
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                isDisabled={currentPage === 1}
                            />
                            <Select
                                w="auto"
                                minW="140px"
                                value={currentPage}
                                onChange={e => setCurrentPage(Number(e.target.value))}
                            >
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <option key={page} value={page}>Página {page}</option>
                                ))}
                            </Select>
                            <IconButton
                                aria-label="Próxima página"
                                icon={<FiChevronRight />}
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                isDisabled={currentPage === totalPages}
                            />
                        </HStack>
                    </Flex>
                </Box>
            </Flex>
        </Flex>
    )
}

export default ListaProdutos
