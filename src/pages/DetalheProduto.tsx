// @ts-nocheck
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    Box,
    Flex,
    Heading,
    Divider,
    Stack,
    Text,
    Button,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    SimpleGrid,
    Badge,
} from '@chakra-ui/react'
import { FiEdit, FiSearch, FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import Sidebar from './Sidebar'
import Header from '../components/Header'
import {
    getEstoqueDetalhado,
    getMedicamentoById,
    getCuidadoPessoalById,
    getSuplementoAlimentarById,
} from '../services/api'

const DetalheProduto = () => {
    const { itemId } = useParams()
    const navigate = useNavigate()
    const [estoqueItem, setEstoqueItem] = useState<any>(null)
    const [productDetail, setProductDetail] = useState<any>(null)
    const statusLabels: Record<string, string> = {
        vencido: 'Vencido',
        proximo_vencimento: 'Validade Próxima',
        estoque_baixo: 'Estoque Baixo',
        estoque_critico: 'Estoque Crítico',
        normal: 'Normal',
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getEstoqueDetalhado()
                const item = data.itens.find((i: any) => String(i.item_estoque_id) === itemId)
                if (!item) {
                    console.error('Item não encontrado')
                    return
                }
                setEstoqueItem(item)
                const { tipo_produto, produto_id } = item
                let detail
                if (tipo_produto === 'medicamento') {
                    detail = await getMedicamentoById(produto_id)
                } else if (tipo_produto === 'cuidado_pessoal') {
                    detail = await getCuidadoPessoalById(produto_id)
                } else if (tipo_produto === 'suplemento_alimentar') {
                    detail = await getSuplementoAlimentarById(produto_id)
                }
                setProductDetail(detail)
            } catch (error) {
                console.error(error)
            }
        }
        fetchData()
    }, [itemId])

    if (!estoqueItem || !productDetail) {
        return <Text p={6}>Carregando...</Text>
    }

    // Badge de tarja baseado no tipo
    const tarjaBadge = (() => {
        const t = productDetail.tarja?.toLowerCase();
        if (!t) {
            return <Badge colorScheme="gray" borderRadius="full">Sem Tarja</Badge>;
        }
        switch (t) {
            case 'preta':
                return <Badge px={2} py={1} colorScheme="blackAlpha" borderRadius="full">Tarja Preta</Badge>;
            case 'vermelha':
                return <Badge px={2} py={1} colorScheme="red" borderRadius="full"> Tarja Vermelha</Badge>;
            case 'branca':
                return <Badge px={2} py={1} colorScheme="gray" borderRadius="full">Tarja Branca</Badge>;
            default:
                return <Badge px={2} py={1} colorScheme="white" borderRadius="full">Sem Tarja</Badge>;
        }
    })();

    return (
        <Flex h="100vh" fontFamily="Poppins, sans-serif" bg="gray.100">
            <Sidebar />
            <Flex direction="column" flex={1} bg="gray.100">
                <Header />
                <Box flex="1" p={5}>
                    {/* Botão para retornar à lista de produtos */}
                    <Button leftIcon={<FiArrowLeft />} variant="outline" mb={0} onClick={() => navigate('/estoque/produtos')}>Voltar à Lista de Produtos</Button>
                    {/* Breadcrumb e título */}
                    <Flex align="center" justify="space-between" mb={2}>
                        <Heading size="lg" fontFamily="Poppins, sans-serif">
                            Estoque &gt; Lista de Produtos &gt; {productDetail.nome} {productDetail.dosagem}
                        </Heading>
                        <IconButton
                            aria-label="Ação grande"
                            icon={<FiEdit size={26} />}
                            variant="ghost"
                            w="64px"
                            h="64px"
                            minW="64px"
                            minH="64px"
                            borderRadius="md"
                            fontSize="2xl"
                        />
                    </Flex>
                    <Text color="gray.600" mb={4}>
                        Informações detalhadas sobre o{' '}
                        {estoqueItem.tipo_produto === 'medicamento'
                            ? 'Medicamento'
                            : estoqueItem.tipo_produto === 'cuidado_pessoal'
                                ? 'Cuidado Pessoal'
                                : 'Suplemento Alimentar'}
                        .
                    </Text>
                    {/* Área de conteúdo */}
                    <Flex gap={6}>
                        {/* Coluna esquerda: Informações do Produto */}
                        <Box flex={1} bg="white" p={6} borderRadius="md" shadow="sm">
                            <Flex justify="space-between" align="center" mb={4}>
                                <Heading size="md" fontFamily="Poppins, sans-serif">Informações do Produto</Heading>
                            </Flex>
                            <Divider borderColor="gray.200" mb={4} />
                            {estoqueItem.tipo_produto === 'medicamento' && (
                                <SimpleGrid columns={2} spacing={4}>
                                    <Box>
                                        <Text fontSize="2xl" fontWeight="bold">{productDetail.nome}</Text>
                                        <Text color="gray.600" fontSize="sm">Nome</Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="2xl" fontWeight="bold">{productDetail.dosagem}</Text>
                                        <Text color="gray.600" fontSize="sm">Dosagem</Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="2xl" fontWeight="bold">{productDetail.principio_ativo}</Text>
                                        <Text color="gray.600" fontSize="sm">Princípio Ativo</Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="2xl" fontWeight="bold">{productDetail.forma_farmaceutica}</Text>
                                        <Text color="gray.600" fontSize="sm">Forma Farmacêutica</Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="2xl" fontWeight="bold">{productDetail.fabricante}</Text>
                                        <Text color="gray.600" fontSize="sm">Fabricante</Text>
                                    </Box>
                                </SimpleGrid>
                            )}
                            {estoqueItem.tipo_produto === 'cuidado_pessoal' && (
                                <SimpleGrid columns={2} spacing={4}>
                                    <Box>
                                        <Text fontSize="2xl" fontWeight="bold">{productDetail.nome}</Text>
                                        <Text color="gray.600" fontSize="sm">Nome</Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="2xl" fontWeight="bold">{productDetail.subcategoria_nome || ''}</Text>
                                        <Text color="gray.600" fontSize="sm">Subcategoria</Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="2xl" fontWeight="bold">{productDetail.volume}</Text>
                                        <Text color="gray.600" fontSize="sm">Volume</Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="2xl" fontWeight="bold">{productDetail.quantidade}</Text>
                                        <Text color="gray.600" fontSize="sm">Quantidade</Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="2xl" fontWeight="bold">{productDetail.fabricante}</Text>
                                        <Text color="gray.600" fontSize="sm">Fabricante</Text>
                                    </Box>
                                </SimpleGrid>
                            )}
                            {estoqueItem.tipo_produto === 'suplemento_alimentar' && (
                                <SimpleGrid columns={2} spacing={4}>
                                    <Box>
                                        <Text fontSize="2xl" fontWeight="bold">{productDetail.nome}</Text>
                                        <Text color="gray.600" fontSize="sm">Nome</Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="2xl" fontWeight="bold">{productDetail.principio_ativo}</Text>
                                        <Text color="gray.600" fontSize="sm">Princípio Ativo</Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="2xl" fontWeight="bold">{productDetail.sabor}</Text>
                                        <Text color="gray.600" fontSize="sm">Sabor</Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="2xl" fontWeight="bold">{productDetail.volume || productDetail.peso_volume}</Text>
                                        <Text color="gray.600" fontSize="sm">Volume</Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="2xl" fontWeight="bold">{productDetail.fabricante}</Text>
                                        <Text color="gray.600" fontSize="sm">Fabricante</Text>
                                    </Box>
                                </SimpleGrid>
                            )}
                        </Box>
                        {/* Coluna direita: Controle e Importantes */}
                        <Box flex={1}>
                            <Box bg="white" p={6} borderRadius="md" shadow="sm" mb={4}>
                                <Flex justify="space-between" align="center">
                                    <Heading size="md" fontFamily="Poppins, sans-serif">Controle de Estoque</Heading>
                                    <Button variant="link" size="sm" onClick={() => navigate(`/estoque/produtos/${item.item_estoque_id}`)}>
                                        Solicitar Requisição &raquo;
                                    </Button>
                                </Flex>
                                <Divider borderColor="gray.200" my={4} />
                                <Flex mt={4} justify="space-between">
                                    <Box textAlign="left">
                                        <Text fontSize="2xl" fontWeight="bold">{estoqueItem.armazem_local}</Text>
                                        <Text fontSize="sm" color="gray.600">Armazém</Text>
                                    </Box>
                                    <Box textAlign="left">
                                        <Text fontSize="2xl" fontWeight="bold">{estoqueItem.quantidade_minima}</Text>
                                        <Text fontSize="sm" color="gray.600">Qtd. Mínima</Text>
                                    </Box>
                                    <Box textAlign="left">
                                        <Text fontSize="2xl" fontWeight="bold">{estoqueItem.quantidade_atual}</Text>
                                        <Text fontSize="sm" color="gray.600">Qtd. em Estoque</Text>
                                    </Box>
                                </Flex>
                            </Box>
                            <Box bg="white" p={6} borderRadius="md" shadow="sm">
                                <Flex justify="space-between" align="center" mb={4}>
                                    <Heading size="md" fontFamily="Poppins, sans-serif">Informações Importantes</Heading>
                                </Flex>
                                <Divider borderColor="gray.200" mb={4} />
                                <Flex wrap="wrap" gap={4}>
                                    {tarjaBadge}
                                    {productDetail.necessita_receita && (
                                        <Badge px={2} py={1} colorScheme="green" borderRadius="full">
                                            Retenção de Receita
                                        </Badge>
                                    )}
                                </Flex>
                            </Box>
                        </Box>
                    </Flex>
                    {/* Card de Status do Produto */}
                    <Box bg="white" p={4} borderRadius="md" shadow="sm" mt={6} mb={6}>
                        <Flex justify="space-between" align="center" mb={4}>
                            <Heading size="md" fontFamily="Poppins, sans-serif">Status do Produto</Heading>
                            <Button variant="link" size="sm" onClick={() => navigate(`/estoque/produtos/${item.item_estoque_id}`)}>Ver Relatórios &raquo;</Button>
                        </Flex>
                        <Divider borderColor="gray.200" mb={4} />
                        <Flex justify="space-between" align="center">
                            <Box textAlign="left">
                                <Text fontSize="2xl" fontWeight="bold">{statusLabels[estoqueItem.status] || estoqueItem.status}</Text>
                                <Text fontSize="sm" color="gray.600">Status</Text>
                            </Box>
                            <Box textAlign="left">
                                <Text fontSize="2xl" fontWeight="bold">{new Date(estoqueItem.data_validade).toLocaleDateString()}</Text>
                                <Text fontSize="sm" color="gray.600">Data de Validade</Text>
                            </Box>
                            <Box textAlign="left">
                                <Text fontSize="2xl" fontWeight="bold">{estoqueItem.lote}</Text>
                                <Text fontSize="sm" color="gray.600">Lote</Text>
                            </Box>
                        </Flex>
                    </Box>
                    {/* Ações: Deletar e Registrar Saída */}
                    <Flex mt={6} justify="space-between">
                        <Button colorScheme="red">Deletar {estoqueItem.tipo_produto === 'medicamento' ? 'Medicamento' : estoqueItem.tipo_produto === 'cuidado_pessoal' ? 'Cuidado Pessoal' : 'Suplemento Alimentar'}</Button>
                        <Button colorScheme="green">Registrar Saída</Button>
                    </Flex>
                </Box>
            </Flex>
        </Flex >
    )
}

export default DetalheProduto
