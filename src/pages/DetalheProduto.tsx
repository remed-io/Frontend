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
    InputLeftAddon,
    SimpleGrid,
    Grid,
    GridItem,
    Badge,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Select,
    Switch,
    Tag,
    TagLabel,
    HStack,
} from '@chakra-ui/react'
import { FiEdit, FiSearch, FiArrowLeft, FiArrowRight, FiTrash2 } from 'react-icons/fi'
import Sidebar from './Sidebar'
import Header from '../components/Header'
import api, {
    getEstoqueDetalhado,
    getEstoquePorItemEstoque,
    getMedicamentoById,
    getCuidadoPessoalById,
    getSuplementoAlimentarById,
    updateMedicamento,
    updateCuidadoPessoal,
    updateSuplementoAlimentar,
    updateItemEstoque,
    deleteItemEstoque,
} from '../services/api'

const DetalheProduto = () => {
    const { itemId } = useParams()
    const navigate = useNavigate()
    const [estoqueItem, setEstoqueItem] = useState<any>(null)
    const [productDetail, setProductDetail] = useState<any>(null)
    // edit modal
    const [editForm, setEditForm] = useState<any>({})
    // Select options for form
    const [armazens, setArmazens] = useState<any[]>([])
    const [fornecedores, setFornecedores] = useState<any[]>([])
    const [restricoes, setRestricoes] = useState<any[]>([])
    const [subcategorias, setSubcategorias] = useState<any[]>([])

    // edit modal disclosure
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()

    // Ao abrir modal de edição, busca dados do backend
    const handleOpenEdit = async () => {
        try {
            // Recarrega opções de armazém e fornecedor ao abrir edição
            const [resArm, resFor, resRest] = await Promise.all([
                api.get('/armazem'),
                api.get('/fornecedor'),
                api.get('/restricao-alimentar'),
            ])
            setArmazens(resArm.data)
            setFornecedores(resFor.data)
            setRestricoes(resRest.data)
            const data = await getEstoquePorItemEstoque(Number(itemId))
            const item = data[0]
            setEstoqueItem(item)
            let detail
            const { tipo_produto, produto_id } = item
            if (tipo_produto === 'medicamento') {
                detail = await getMedicamentoById(produto_id)
            } else if (tipo_produto === 'cuidado_pessoal') {
                detail = await getCuidadoPessoalById(produto_id)
            } else if (tipo_produto === 'suplemento_alimentar') {
                detail = await getSuplementoAlimentarById(produto_id)
            }
            setProductDetail(detail)
            // Popula o formulário de edição com dados do produto e estoque
            let restricoes_suplemento = []
            if (tipo_produto === 'suplemento_alimentar' && detail.restricoes_suplemento) {
                restricoes_suplemento = detail.restricoes_suplemento
            }
            setEditForm({ ...detail, ...item, restricoes_suplemento })
            onEditOpen()
        } catch (error) {
            console.error('Erro ao carregar dados para edição', error)
            alert('Erro ao carregar dados de edição')
        }
    }

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

    // fetch data for selects
    useEffect(() => {
        (async () => {
            try {
                const [resArm, resFor, resRest, resSub] = await Promise.all([
                    api.get('/armazem'),
                    api.get('/fornecedor'),
                    api.get('/restricao-alimentar'),
                    api.get('/subcategoria-cuidado-pessoal'),
                ])
                setArmazens(resArm.data)
                setFornecedores(resFor.data)
                setRestricoes(resRest.data)
                setSubcategorias(resSub.data)
            } catch (error) {
                console.error('Erro ao carregar selects', error)
            }
        })()
    }, [])

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
                            onClick={handleOpenEdit}
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
                        <Box flex={1} bg="white" p={6} borderRadius="md" shadow="sm" fontFamily="Poppins, sans-serif">
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
                            <Box bg="white" p={6} borderRadius="md" shadow="sm" mb={4} fontFamily="Poppins, sans-serif">
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
                            <Box bg="white" p={6} borderRadius="md" shadow="sm" fontFamily="Poppins, sans-serif">
                                <Flex justify="space-between" align="center" mb={4}>
                                    <Heading size="md" fontFamily="Poppins, sans-serif">Informações Importantes</Heading>
                                </Flex>
                                <Divider borderColor="gray.200" mb={4} />
                                <Flex wrap="wrap" gap={4}>
                                    {estoqueItem.tipo_produto === 'medicamento' && (
                                        <>
                                            {tarjaBadge}
                                            {productDetail.necessita_receita && (
                                                <Badge px={2} py={1} colorScheme="green" borderRadius="full">
                                                    Retenção de Receita
                                                </Badge>
                                            )}
                                        </>
                                    )}
                                    {estoqueItem.tipo_produto === 'suplemento_alimentar' && (
                                        <Tag colorScheme="blue" borderRadius="full">
                                            <TagLabel>Registro ANVISA: {productDetail.registro_anvisa || '-'}</TagLabel>
                                        </Tag>
                                    )}
                                    {estoqueItem.tipo_produto === 'cuidado_pessoal' && (
                                        <Tag colorScheme="purple" borderRadius="full">
                                            <TagLabel>Público Alvo: {productDetail.publico_alvo || '-'}</TagLabel>
                                        </Tag>
                                    )}
                                </Flex>
                            </Box>
                        </Box>
                    </Flex>
                    {/* Card de Status do Produto */}
                    <Box bg="white" p={5} borderRadius="md" shadow="sm" mt={5} mb={6} fontFamily="Poppins, sans-serif">
                        <Flex justify="space-between" align="center" mb={4}>
                            <Heading size="md" fontFamily="Poppins, sans-serif">Status do Produto</Heading>
                            <Button variant="link" size="sm" onClick={() => navigate(`/estoque/produtos/${item.item_estoque_id}`)}>Ver Relatórios &raquo;</Button>
                        </Flex>
                        <Divider borderColor="gray.200" mb={5} />
                        <Flex justify="space-between" align="center" >
                            <Box textAlign="left" mr={0}>
                                <Text fontSize="2xl" fontWeight="bold">{statusLabels[estoqueItem.status] || estoqueItem.status}</Text>
                                <Text fontSize="sm" color="gray.600">Status</Text>
                            </Box>
                            <Box textAlign="left" mr={0}>
                                <Text fontSize="2xl" fontWeight="bold">{new Date(estoqueItem.data_validade).toLocaleDateString()}</Text>
                                <Text fontSize="sm" color="gray.600">Data de Validade</Text>
                            </Box>
                            <Box textAlign="left" mr={0}>
                                <Text fontSize="2xl" fontWeight="bold">{estoqueItem.lote}</Text>
                                <Text fontSize="sm" color="gray.600">Lote</Text>
                            </Box>
                            <Box textAlign="left">
                                <Text fontSize="2xl" fontWeight="bold">R$ {Number(estoqueItem.preco).toFixed(2)}</Text>
                                <Text fontSize="sm" color="gray.600">Preço</Text>
                            </Box>
                        </Flex>
                    </Box>
                    {/* Ações: Deletar e Registrar Saída */}
                    <Flex mt={6} justify="space-between">
                        <Button colorScheme="red" onClick={async () => {
                            if (window.confirm('Confirma exclusão deste item de estoque?')) {
                                try {
                                    await deleteItemEstoque(estoqueItem.item_estoque_id)
                                    navigate('/estoque/produtos')
                                } catch (error) {
                                    console.error(error)
                                    alert('Não foi possível excluir o item de estoque. Verifique se existem registros relacionados.')
                                }
                            }
                        }}>
                            Excluir Item
                        </Button>
                        <Button colorScheme="blue" leftIcon={<FiArrowRight />} onClick={() => navigate(`/estoque/produtos/${estoqueItem.item_estoque_id}`)}>
                            Registrar Saída
                        </Button>
                    </Flex>
                    {/* Edit Modal */}
                    <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl" scrollBehavior="inside">
                        <ModalOverlay />
                        <ModalContent maxW="800px" maxH="60vh">
                            <ModalHeader fontFamily="Poppins, sans-serif" fontWeight="bold">
                                {estoqueItem.tipo_produto === 'medicamento' && 'Editar Medicamento'}
                                {estoqueItem.tipo_produto === 'cuidado_pessoal' && 'Editar Produto de Cuidado Pessoal'}
                                {estoqueItem.tipo_produto === 'suplemento_alimentar' && 'Editar Suplemento Alimentar'}
                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody p={3} overflowY="auto">
                                <form onSubmit={e => e.preventDefault()}>
                                    {/* Informações do Produto (mesmo layout de AdicionarProduto) */}
                                    <Box bg="white" p={4} rounded="md" shadow="sm" mb={0}>
                                        {/* Campos específicos por tipo de produto */}
                                        {estoqueItem.tipo_produto === 'medicamento' && (
                                            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={3} mb={0} fontFamily="Poppins, sans-serif">
                                                {/* Nome, Fabricante, Princípio Ativo, Dosagem, Forma Farmacêutica, Registro ANVISA, Tarja, Necessita Receita */}
                                                <FormControl>
                                                    <FormLabel>Nome</FormLabel>
                                                    <Input variant="filled" bg="gray.50" value={editForm.nome || ''} onChange={e => setEditForm({ ...editForm, nome: e.target.value })} />
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Fabricante</FormLabel>
                                                    <Input variant="filled" bg="gray.50" value={editForm.fabricante || ''} onChange={e => setEditForm({ ...editForm, fabricante: e.target.value })} />
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Princípio Ativo</FormLabel>
                                                    <Input variant="filled" bg="gray.50" value={editForm.principio_ativo || ''} onChange={e => setEditForm({ ...editForm, principio_ativo: e.target.value })} />
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Dosagem</FormLabel>
                                                    <Input variant="filled" bg="gray.50" value={editForm.dosagem || ''} onChange={e => setEditForm({ ...editForm, dosagem: e.target.value })} />
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel >Forma Farma.</FormLabel>
                                                    <Input variant="filled" bg="gray.50" value={editForm.forma_farmaceutica || ''} onChange={e => setEditForm({ ...editForm, forma_farmaceutica: e.target.value })} />
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Registro ANVISA</FormLabel>
                                                    <Input variant="filled" bg="gray.50" value={editForm.registro_anvisa || ''} onChange={e => setEditForm({ ...editForm, registro_anvisa: e.target.value })} />
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Tarja</FormLabel>
                                                    <Select value={editForm.tarja || ''} onChange={e => setEditForm({ ...editForm, tarja: e.target.value })}>
                                                        <option value="preta">Tarja Preta</option>
                                                        <option value="vermelha">Tarja Vermelha</option>
                                                        <option value="branca">Tarja Branca</option>
                                                        <option value="">Sem Tarja</option>
                                                    </Select>
                                                </FormControl>
                                                <FormControl display="flex" alignItems="center">
                                                    <FormLabel mb="0">Necessita Receita</FormLabel>
                                                    <Switch isChecked={editForm.necessita_receita} onChange={e => setEditForm({ ...editForm, necessita_receita: e.target.checked })} />
                                                </FormControl>
                                            </SimpleGrid>
                                        )}
                                        {estoqueItem.tipo_produto === 'suplemento_alimentar' && (
                                            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={3} mb={0} fontFamily="Poppins, sans-serif">
                                                {/* Nome, Fabricante, Princípio Ativo, Sabor, Peso/Volume, Registro ANVISA */}
                                                <FormControl>
                                                    <FormLabel>Nome</FormLabel>
                                                    <Input variant="filled" bg="gray.50" value={editForm.nome || ''} onChange={e => setEditForm({ ...editForm, nome: e.target.value })} />
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Fabricante</FormLabel>
                                                    <Input variant="filled" bg="gray.50" value={editForm.fabricante || ''} onChange={e => setEditForm({ ...editForm, fabricante: e.target.value })} />
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Princípio Ativo</FormLabel>
                                                    <Input variant="filled" bg="gray.50" value={editForm.principio_ativo || ''} onChange={e => setEditForm({ ...editForm, principio_ativo: e.target.value })} />
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Sabor</FormLabel>
                                                    <Input variant="filled" bg="gray.50" value={editForm.sabor || ''} onChange={e => setEditForm({ ...editForm, sabor: e.target.value })} />
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Peso/Volume</FormLabel>
                                                    <Input variant="filled" bg="gray.50" value={editForm.peso_volume || ''} onChange={e => setEditForm({ ...editForm, peso_volume: e.target.value })} />
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Registro ANVISA</FormLabel>
                                                    <Input variant="filled" bg="gray.50" value={editForm.registro_anvisa || ''} onChange={e => setEditForm({ ...editForm, registro_anvisa: e.target.value })} />
                                                </FormControl>
                                            </SimpleGrid>
                                        )}
                                        {estoqueItem.tipo_produto === 'cuidado_pessoal' && (
                                            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={3} mb={0} fontFamily="Poppins, sans-serif">
                                                {/* Nome, Fabricante, Subcategoria, Volume, Quantidade, Uso Recomendado, Público Alvo */}
                                                <FormControl>
                                                    <FormLabel>Nome</FormLabel>
                                                    <Input variant="filled" bg="gray.50" value={editForm.nome || ''} onChange={e => setEditForm({ ...editForm, nome: e.target.value })} />
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Fabricante</FormLabel>
                                                    <Input variant="filled" bg="gray.50" value={editForm.fabricante || ''} onChange={e => setEditForm({ ...editForm, fabricante: e.target.value })} />
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Subcategoria</FormLabel>
                                                    <Select value={editForm.subcategoria_id || ''} onChange={e => setEditForm({ ...editForm, subcategoria_id: Number(e.target.value) })}>
                                                        <option value="">Selecione subcategoria</option>
                                                        {subcategorias.map(s => (
                                                            <option key={s.id} value={s.id}>{s.nome}</option>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Volume</FormLabel>
                                                    <Input variant="filled" bg="gray.50" value={editForm.volume || ''} onChange={e => setEditForm({ ...editForm, volume: e.target.value })} />
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Quantidade</FormLabel>
                                                    <Input variant="filled" bg="gray.50" type="text" value={editForm.quantidade || ''} onChange={e => setEditForm({ ...editForm, quantidade: e.target.value })} />
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Uso Recomendado</FormLabel>
                                                    <Input variant="filled" bg="gray.50" value={editForm.uso_recomendado || ''} onChange={e => setEditForm({ ...editForm, uso_recomendado: e.target.value })} />
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Público Alvo</FormLabel>
                                                    <Input variant="filled" bg="gray.50" value={editForm.publico_alvo || ''} onChange={e => setEditForm({ ...editForm, publico_alvo: e.target.value })} />
                                                </FormControl>
                                            </SimpleGrid>
                                        )}
                                    </Box>
                                    {/* Controle de Estoque */}
                                    <Box bg="white" p={4} rounded="md" shadow="sm" fontFamily="Poppins, sans-serif">
                                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={4} mb={4}>
                                            <FormControl>
                                                <FormLabel>Código de Barras</FormLabel>
                                                <Input variant="filled" bg="gray.50" value={editForm.codigo_barras || ''} onChange={e => setEditForm({ ...editForm, codigo_barras: e.target.value })} />
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Armazém</FormLabel>
                                                <Select
                                                    value={editForm.armazem_id?.toString() || ''}
                                                    onChange={e => setEditForm({ ...editForm, armazem_id: Number(e.target.value) })}
                                                >
                                                    <option value="">Selecione um armazém</option>
                                                    {editForm.armazem_id && (
                                                        <option key="current" value={editForm.armazem_id.toString()}>
                                                            {editForm.armazem_local}
                                                        </option>
                                                    )}
                                                    {armazens
                                                        .filter(arm => arm.id !== editForm.armazem_id)
                                                        .map(arm => (
                                                            <option key={arm.id} value={arm.id.toString()}>
                                                                {arm.local_armazem}
                                                            </option>
                                                        ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Fornecedor</FormLabel>
                                                <Select
                                                    value={editForm.fornecedor_id?.toString() || ''}
                                                    onChange={e => setEditForm({ ...editForm, fornecedor_id: Number(e.target.value) })}
                                                >
                                                    <option value="">Selecione um fornecedor</option>
                                                    {editForm.fornecedor_id && (
                                                        <option key="current" value={editForm.fornecedor_id.toString()}>
                                                            {editForm.fornecedor_nome}
                                                        </option>
                                                    )}
                                                    {fornecedores
                                                        .filter(item => item.id !== editForm.fornecedor_id)
                                                        .map(item => (
                                                            <option key={item.id} value={item.id.toString()}>
                                                                {item.nome}
                                                            </option>
                                                        ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Data de Validade</FormLabel>
                                                <Input
                                                    type="date"
                                                    value={editForm.data_validade?.split('T')[0] || ''}
                                                    onChange={e => setEditForm({ ...editForm, data_validade: e.target.value })}
                                                />
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Lote</FormLabel>
                                                <Input
                                                    value={editForm.lote || ''}
                                                    onChange={e => setEditForm({ ...editForm, lote: e.target.value })}
                                                />
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Preço</FormLabel>
                                                <InputGroup>
                                                    <InputLeftAddon children="R$" />
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={editForm.preco || ''}
                                                        onChange={e => setEditForm({ ...editForm, preco: e.target.value })}
                                                    />
                                                </InputGroup>
                                            </FormControl>
                                        </SimpleGrid>
                                    </Box>
                                </form>
                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme="blue" mr={3} onClick={async () => {
                                    try {
                                        // Atualiza produto
                                        if (estoqueItem.tipo_produto === 'medicamento') {
                                            await updateMedicamento(productDetail.id, editForm)
                                        } else if (estoqueItem.tipo_produto === 'cuidado_pessoal') {
                                            await updateCuidadoPessoal(productDetail.id, editForm)
                                        } else if (estoqueItem.tipo_produto === 'suplemento_alimentar') {
                                            await updateSuplementoAlimentar(productDetail.id, editForm)
                                        }

                                        // Atualiza item_estoque
                                        const itemEstoquePayload = {
                                            codigo_barras: editForm.codigo_barras,
                                            preco: Number(editForm.preco),
                                            data_validade: editForm.data_validade,
                                            fornecedor_id: editForm.fornecedor_id,
                                            lote: editForm.lote,
                                            produto_medicamento_id: estoqueItem.tipo_produto === 'medicamento' ? productDetail.id : null,
                                            produto_cuidado_pessoal_id: estoqueItem.tipo_produto === 'cuidado_pessoal' ? productDetail.id : null,
                                            produto_suplemento_alimentar_id: estoqueItem.tipo_produto === 'suplemento_alimentar' ? productDetail.id : null,
                                        }
                                        await updateItemEstoque(estoqueItem.item_estoque_id, itemEstoquePayload)

                                        onEditClose()
                                        // Recarrega os dados após atualização
                                        const data = await getEstoqueDetalhado()
                                        const item = data.itens.find((i: any) => String(i.item_estoque_id) === itemId)
                                        setEstoqueItem(item)
                                        let detail
                                        if (item.tipo_produto === 'medicamento') detail = await getMedicamentoById(item.produto_id)
                                        else if (item.tipo_produto === 'cuidado_pessoal') detail = await getCuidadoPessoalById(item.produto_id)
                                        else if (item.tipo_produto === 'suplemento_alimentar') detail = await getSuplementoAlimentarById(item.produto_id)
                                        setProductDetail(detail)
                                    } catch (error) {
                                        console.error(error)
                                        alert('Erro ao atualizar produto/estoque: ' + (error.message || ''))
                                    }
                                }}>Salvar</Button>
                                <Button variant="ghost" onClick={onEditClose}>Cancelar</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Box>
            </Flex>
        </Flex>
    );
}

export default DetalheProduto;
