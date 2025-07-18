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
} from '@chakra-ui/react'
import { FiEdit, FiSearch, FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import Sidebar from './Sidebar'
import Header from '../components/Header'
import {
    getEstoqueDetalhado,
    getMedicamentoById,
    getCuidadoPessoalById,
    getSuplementoAlimentarById,
    updateMedicamento,
    updateCuidadoPessoal,
    updateSuplementoAlimentar,
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

    // populate edit form when loaded
    useEffect(() => {
        if (productDetail && estoqueItem) {
            setEditForm({ ...productDetail, lote: estoqueItem.lote, data_validade: estoqueItem.data_validade })
        }
    }, [productDetail, estoqueItem])

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
                        onClick={onEditOpen}
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
                    <Box bg="white" p={5} borderRadius="md" shadow="sm" mt={6} mb={6}>
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
                    <Modal isOpen={isEditOpen} onClose={onEditClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Editar Produto</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                {estoqueItem.tipo_produto === 'medicamento' && (
                                    <SimpleGrid columns={2} spacing={4} mb={4}>
                                        <FormControl>
                                            <FormLabel>Nome do Medicamento</FormLabel>
                                            <Input
                                                value={editForm.nome || ''}
                                                onChange={e => setEditForm({ ...editForm, nome: e.target.value })}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Dosagem</FormLabel>
                                            <Input
                                                value={editForm.dosagem || ''}
                                                onChange={e => setEditForm({ ...editForm, dosagem: e.target.value })}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Princípio Ativo</FormLabel>
                                            <Input
                                                value={editForm.principio_ativo || ''}
                                                onChange={e => setEditForm({ ...editForm, principio_ativo: e.target.value })}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Tarja</FormLabel>
                                            <Select
                                                value={editForm.tarja || ''}
                                                onChange={e => setEditForm({ ...editForm, tarja: e.target.value })}
                                            >
                                                <option value="preta">Tarja Preta</option>
                                                <option value="vermelha">Tarja Vermelha</option>
                                                <option value="branca">Tarja Branca</option>
                                                <option value="">Sem Tarja</option>
                                            </Select>
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Forma Farmacêutica</FormLabel>
                                            <Input
                                                value={editForm.forma_farmaceutica || ''}
                                                onChange={e => setEditForm({ ...editForm, forma_farmaceutica: e.target.value })}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Fabricante</FormLabel>
                                            <Input
                                                value={editForm.fabricante || ''}
                                                onChange={e => setEditForm({ ...editForm, fabricante: e.target.value })}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Registro ANVISA</FormLabel>
                                            <Input
                                                value={editForm.registro_anvisa || ''}
                                                onChange={e => setEditForm({ ...editForm, registro_anvisa: e.target.value })}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Necessita Receita</FormLabel>
                                            <Select
                                                value={editForm.necessita_receita || 0}
                                                onChange={e => setEditForm({ ...editForm, necessita_receita: Number(e.target.value) })}
                                            >
                                                <option value={0}>Não</option>
                                                <option value={1}>Sim</option>
                                            </Select>
                                        </FormControl>
                                    </SimpleGrid>
                                )}
                                {estoqueItem.tipo_produto === 'cuidado_pessoal' && (
                                    <SimpleGrid columns={2} spacing={4} mb={4}>
                                        <FormControl>
                                            <FormLabel>Nome</FormLabel>
                                            <Input
                                                value={editForm.nome || ''}
                                                onChange={e => setEditForm({ ...editForm, nome: e.target.value })}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Subcategoria</FormLabel>
                                            <Input
                                                value={editForm.subcategoria_nome || ''}
                                                isReadOnly
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Volume</FormLabel>
                                            <Input
                                                value={editForm.volume || ''}
                                                onChange={e => setEditForm({ ...editForm, volume: e.target.value })}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Quantidade</FormLabel>
                                            <Input
                                                type="number"
                                                value={editForm.quantidade || ''}
                                                onChange={e => setEditForm({ ...editForm, quantidade: Number(e.target.value) })}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Fabricante</FormLabel>
                                            <Input
                                                value={editForm.fabricante || ''}
                                                onChange={e => setEditForm({ ...editForm, fabricante: e.target.value })}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Uso Recomendado</FormLabel>
                                            <Input
                                                value={editForm.uso_recomendado || ''}
                                                onChange={e => setEditForm({ ...editForm, uso_recomendado: e.target.value })}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Público Alvo</FormLabel>
                                            <Input
                                                value={editForm.publico_alvo || ''}
                                                onChange={e => setEditForm({ ...editForm, publico_alvo: e.target.value })}
                                            />
                                        </FormControl>
                                    </SimpleGrid>
                                )}
                                {estoqueItem.tipo_produto === 'suplemento_alimentar' && (
                                    <SimpleGrid columns={2} spacing={4} mb={4}>
                                        <FormControl>
                                            <FormLabel>Nome</FormLabel>
                                            <Input
                                                value={editForm.nome || ''}
                                                onChange={e => setEditForm({ ...editForm, nome: e.target.value })}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Princípio Ativo</FormLabel>
                                            <Input
                                                value={editForm.principio_ativo || ''}
                                                onChange={e => setEditForm({ ...editForm, principio_ativo: e.target.value })}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Sabor</FormLabel>
                                            <Input
                                                value={editForm.sabor || ''}
                                                onChange={e => setEditForm({ ...editForm, sabor: e.target.value })}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Volume/Peso</FormLabel>
                                            <Input
                                                value={editForm.volume || editForm.peso_volume || ''}
                                                onChange={e => setEditForm({ ...editForm, volume: e.target.value })}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Fabricante</FormLabel>
                                            <Input
                                                value={editForm.fabricante || ''}
                                                onChange={e => setEditForm({ ...editForm, fabricante: e.target.value })}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Registro ANVISA</FormLabel>
                                            <Input
                                                value={editForm.registro_anvisa || ''}
                                                onChange={e => setEditForm({ ...editForm, registro_anvisa: e.target.value })}
                                            />
                                        </FormControl>
                                    </SimpleGrid>
                                )}
                                {/* Estoque e demais campos */}
                                <SimpleGrid columns={2} spacing={4} mb={4}>
                                    <FormControl>
                                        <FormLabel>Lote</FormLabel>
                                        <Input
                                            value={editForm.lote || ''}
                                            onChange={e => setEditForm({ ...editForm, lote: e.target.value })}
                                        />
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
                                        <FormLabel>Quantidade em Estoque</FormLabel>
                                        <Input
                                            type="number"
                                            value={editForm.quantidade_atual || ''}
                                            onChange={e => setEditForm({ ...editForm, quantidade_atual: Number(e.target.value) })}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Local Armazenamento</FormLabel>
                                        <Input
                                            value={editForm.armazem_local || ''}
                                            onChange={e => setEditForm({ ...editForm, armazem_local: e.target.value })}
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
                                {/* Adicione aqui condicionais para outros tipos de produto com seus campos correspondentes */}
                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme="blue" mr={3} onClick={async () => {
                                    try {
                                        if (estoqueItem.tipo_produto === 'medicamento') {
                                            await updateMedicamento(productDetail.id, editForm)
                                        } else if (estoqueItem.tipo_produto === 'cuidado_pessoal') {
                                            await updateCuidadoPessoal(productDetail.id, editForm)
                                        } else if (estoqueItem.tipo_produto === 'suplemento_alimentar') {
                                            await updateSuplementoAlimentar(productDetail.id, editForm)
                                        }
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
                                        alert('Erro ao atualizar produto: ' + (error.message || ''))
                                    }
                                }}>Salvar</Button>
                                <Button variant="ghost" onClick={onEditClose}>Cancelar</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Box>
            </Flex>
        </Flex >
    )
}

export default DetalheProduto
