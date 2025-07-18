// @ts-nocheck
import { Box, Flex, Heading, Text, Button, SimpleGrid, HStack, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, Select } from '@chakra-ui/react'
import Sidebar from './Sidebar'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'
import { MdLogin, MdLogout } from 'react-icons/md'
import { useState, useEffect } from 'react'
import api from '../services/api'

const Movimentacoes = () => {
    const navigate = useNavigate()
    // Modal de entrada
    const { isOpen: isEntradaModalOpen, onOpen: onOpenEntradaModal, onClose: onCloseEntradaModal } = useDisclosure()
    // Modal de saída
    const { isOpen: isSaidaModalOpen, onOpen: onOpenSaidaModal, onClose: onCloseSaidaModal } = useDisclosure()
    return (
        <Flex h="100vh" fontFamily="Poppins, sans-serif" bg="gray.100">
            <Sidebar />
            <Flex direction="column" flex={1} bg="gray.100">
                <Header />
                <Box flex="1" p={5}>
                    <Heading size="lg" fontFamily="Poppins, sans-serif" mb={2}>
                        Movimentações
                    </Heading>
                    <Text color="gray.600" mb={4}>
                        Gerencie entradas e saídas de produtos no estoque.
                    </Text>
                    <SimpleGrid columns={[1, 2]} spacing={4} mt={6}>
                        {/* Card de Entrada - agora abre modal overlay igual editar produto */}
                        <Box bg="white" p={4} borderRadius="md" shadow="md" position="relative">
                            <HStack justify="space-between">
                                <Box>
                                    <Text fontSize="sm" color="gray.500">Registro de Entrada</Text>
                                    <Heading size="md" fontFamily="Poppins, sans-serif">Entrada no Estoque</Heading>
                                </Box>
                                <MdLogin size={28} color="#38A169" />
                            </HStack>
                            <Text color="gray.600" mt={2} mb={4}>Adicione novos produtos ou aumente o estoque existente.</Text>
                            <Button colorScheme="green" mt={2} onClick={onOpenEntradaModal}>Registrar Entrada »</Button>
                        </Box>
                        {/* Card de Saída - modal igual entrada */}
                        <Box bg="white" p={4} borderRadius="md" shadow="md" position="relative">
                            <HStack justify="space-between">
                                <Box>
                                    <Text fontSize="sm" color="gray.500">Registro de Saída</Text>
                                    <Heading size="md" fontFamily="Poppins, sans-serif">Saída do Estoque</Heading>
                                </Box>
                                <MdLogout size={28} color="#E74C3C" />
                            </HStack>
                            <Text color="gray.600" mt={2} mb={4}>Registre a saída de produtos do estoque.</Text>
                            <Button colorScheme="red" mt={2} onClick={onOpenSaidaModal}>Registrar Saída »</Button>
                        </Box>
                    </SimpleGrid>

                    {/* Modal de Entrada - igual editar produto */}
                    <Modal isOpen={isEntradaModalOpen} onClose={onCloseEntradaModal} size="xl" scrollBehavior="inside">
                        <ModalOverlay />
                        <ModalContent maxW="800px" maxH="60vh">
                            <ModalHeader fontFamily="Poppins, sans-serif" fontWeight="bold">Registrar Entrada no Estoque</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody p={3} overflowY="auto">
                                <EntradaEstoqueForm />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    colorScheme="green"
                                    mr={3}
                                    form="entrada-form"
                                    type="submit"
                                >Salvar</Button>
                                <Button variant="ghost" onClick={onCloseEntradaModal}>Cancelar</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>

                    {/* Modal de Saída - igual editar produto */}
                    <Modal isOpen={isSaidaModalOpen} onClose={onCloseSaidaModal} size="xl" scrollBehavior="inside">
                        <ModalOverlay />
                        <ModalContent maxW="800px" maxH="60vh">
                            <ModalHeader fontFamily="Poppins, sans-serif" fontWeight="bold">Registrar Saída do Estoque</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody p={3} overflowY="auto">
                                {/* Formulário de saída */}
                                <SaidaEstoqueForm />
                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme="red" mr={3} form="saida-form" type="submit">Salvar</Button>
                                <Button variant="ghost" onClick={onCloseSaidaModal}>Cancelar</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Box>
            </Flex>
        </Flex>
    )
}

function EntradaEstoqueForm() {
    // Inicializa dados do usuário logado
    const stored = localStorage.getItem('user') || localStorage.getItem('usuarioLogado') || '{}'
    const parsedUser = JSON.parse(stored)
    const initialId = parsedUser.id || parsedUser.funcionario?.id || ''
    const initialNome = parsedUser.nome || parsedUser.funcionario?.nome || ''
    const [itensEstoque, setItensEstoque] = useState([])
    const [armazens, setArmazens] = useState([])
    // Lista de funcionários para possíveis usos
    const [funcionarios, setFuncionarios] = useState([])
    // Nome do responsável fixo, não editável
    const [nomeResponsavel] = useState(initialNome)
    // Data inicial para o campo datetime-local
    const now = new Date()
    const pad = (n: number) => n.toString().padStart(2, '0')
    const initialDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`
    const [form, setForm] = useState({
        data_movimentacao: initialDate,
        quantidade: '',
        item_estoque_id: '',
        funcionario_id: initialId,
        armazem_id: '',
    })
    const [loading, setLoading] = useState(false)
    const [buscaItem, setBuscaItem] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    const [infoItem, setInfoItem] = useState(null)

    useEffect(() => {
        api.get('/consulta-estoque/detalhado').then(res => setItensEstoque(res.data.itens))
        api.get('/armazem').then(res => setArmazens(res.data))
        api.get('/funcionario').then(res => setFuncionarios(res.data))
    }, [])

    // Filtra itens do estoque pelo nome digitado
    const itensFiltrados = itensEstoque.filter(item =>
        item.produto_nome.toLowerCase().includes(buscaItem.toLowerCase())
    )

    const handleSelectItem = async (itemId, nome) => {
        setForm({ ...form, item_estoque_id: itemId })
        setBuscaItem(nome)
        setShowDropdown(false)
        // Busca informações do item selecionado
        try {
            const res = await api.get(`/consulta-estoque/por-item-estoque/${itemId}`)
            const itemData = res.data[0]
            let armazemNome = ''
            let qtdMinima = ''
            if (itemData && itemData.armazem_id) {
                // Busca armazém pelo id na API
                const armRes = await api.get(`/armazem/${itemData.armazem_id}`)
                const arm = armRes.data
                armazemNome = arm.local_armazem || arm.nome || ''
                qtdMinima = arm.quantidade_minima || ''
            }
            setInfoItem({
                armazem: armazemNome || 'Não informado',
                quantidade_minima: qtdMinima !== '' ? qtdMinima : 'Não informado',
            })
        } catch (err) {
            setInfoItem(null)
        }
    }

    const handleInputChange = (e) => {
        setBuscaItem(e.target.value)
        setShowDropdown(true)
        setForm({ ...form, item_estoque_id: '' })
        setInfoItem(null)
    }

    const handleSubmit = async (e?: any, tipoOverride?: 'entrada' | 'saida') => {
        if (e && e.preventDefault) e.preventDefault()
        const tipo = tipoOverride || 'entrada'
        setLoading(true)
        try {
            await api.post('/movimentacao-estoque/', {
                ...form,
                tipo,
                quantidade: Number(form.quantidade),
                data_movimentacao: form.data_movimentacao,
            })
            alert(`${tipo === 'entrada' ? 'Entrada' : 'Saída'} registrada com sucesso!`)
            setForm({
                data_movimentacao: '',
                quantidade: '',
                item_estoque_id: '',
                funcionario_id: '',
                armazem_id: '',
            })
            setBuscaItem('')
            setInfoItem(null)
            onCloseEntradaModal()
        } catch (err) {
            alert(`Erro ao registrar ${tipo}!`)
        }
        setLoading(false)
    }

    return (
        <Box bg="white" p={2} borderRadius="md" shadow="sm" fontFamily="Poppins, sans-serif" maxW="700px" mx="auto">
            <Text color="gray.600" mb={2}>Preencha os dados para registrar a entrada de produto.</Text>
            <form id="entrada-form" onSubmit={handleSubmit}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                    {/* Responsável e Data */}
                    <FormControl isRequired>
                        <FormLabel>Funcionário Responsável</FormLabel>
                        <Input value={nomeResponsavel} isReadOnly />
                        <input type="hidden" name="funcionario_id" value={form.funcionario_id} />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Data da Movimentação</FormLabel>
                        <Input type="datetime-local" value={form.data_movimentacao} onChange={e => setForm({ ...form, data_movimentacao: e.target.value })} />
                    </FormControl>
                    {/* Item de Estoque e Quantidade */}
                    <FormControl isRequired>
                        <FormLabel>Item de Estoque</FormLabel>
                        <Box position="relative">
                            <Input
                                placeholder="Digite o nome do produto"
                                value={buscaItem}
                                onChange={handleInputChange}
                                onFocus={() => setShowDropdown(true)}
                                autoComplete="off"
                            />
                            {showDropdown && buscaItem && (
                                <Box position="absolute" zIndex={10} bg="white" borderRadius="md" boxShadow="md" mt={1} w="100%" maxH="180px" overflowY="auto">
                                    {itensFiltrados.length > 0 ? (
                                        itensFiltrados.map(item => (
                                            <Box
                                                key={item.item_estoque_id}
                                                px={3} py={2}
                                                cursor="pointer"
                                                _hover={{ bg: 'gray.100' }}
                                                onClick={() => handleSelectItem(item.item_estoque_id, item.produto_nome + ' - Lote ' + item.lote)}
                                            >
                                                {item.produto_nome} - Lote {item.lote}
                                            </Box>
                                        ))
                                    ) : (
                                        <Text px={3} py={2} color="gray.500">Nenhum item encontrado</Text>
                                    )}
                                </Box>
                            )}
                        </Box>
                        {/* Campo hidden para garantir o valor do item_estoque_id no submit */}
                        <input type="hidden" value={form.item_estoque_id} name="item_estoque_id" />
                        {/* Informações do item selecionado */}
                        {infoItem && (
                            <Box mt={2} p={2} bg="gray.50" borderRadius="md" fontSize="sm">
                                <Text color="gray.700"><b>Armazém atual:</b> {infoItem.armazem}</Text>
                                <Text color="gray.700"><b>Qtd. mínima no armazém:</b> {infoItem.quantidade_minima}</Text>
                            </Box>
                        )}
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Quantidade</FormLabel>
                        <Input type="number" min={1} value={form.quantidade} onChange={e => setForm({ ...form, quantidade: e.target.value })} />
                    </FormControl>
                    {/* Armazém de Destino */}
                    <FormControl isRequired>
                        <FormLabel>Armazém de Destino</FormLabel>
                        <Select value={form.armazem_id} onChange={e => setForm({ ...form, armazem_id: e.target.value })}>
                            <option value="">Selecione o armazém</option>
                            {armazens.map(arm => (
                                <option key={arm.id} value={arm.id}>{arm.local_armazem}</option>
                            ))}
                        </Select>
                    </FormControl>
                </SimpleGrid>
                {/* Botão interno removido, use o botão Salvar no ModalFooter para submeter */}
            </form>
        </Box>
    )
}

// Após definição de EntradaEstoqueForm, inserir SaidaEstoqueForm
function SaidaEstoqueForm() {
    // Dados iniciais de usuário e estados similares a EntradaEstoqueForm
    const stored = localStorage.getItem('user') || localStorage.getItem('usuarioLogado') || '{}'
    const parsedUser = JSON.parse(stored)
    const initialId = parsedUser.id || parsedUser.funcionario?.id || ''
    const initialNome = parsedUser.nome || parsedUser.funcionario?.nome || ''
    const [itensEstoque, setItensEstoque] = useState([])
    const [armazens, setArmazens] = useState([])
    const [nomeResponsavel] = useState(initialNome)
    const now = new Date()
    const pad = n => n.toString().padStart(2, '0')
    const initialDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`
    const [formSaida, setFormSaida] = useState({
        data_movimentacao: initialDate,
        quantidade: '',
        item_estoque_id: '',
        funcionario_id: initialId,
        armazem_id: '',
        cpf_comprador: '',
        nome_comprador: '',
        receita_digital: '',
    })
    const [buscaItem, setBuscaItem] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    const [infoItem, setInfoItem] = useState(null)

    useEffect(() => {
        api.get('/consulta-estoque/detalhado').then(res => setItensEstoque(res.data.itens))
        api.get('/armazem').then(res => setArmazens(res.data))
    }, [])

    const itensFiltrados = itensEstoque.filter(item => item.produto_nome.toLowerCase().includes(buscaItem.toLowerCase()))

    const handleSelectSaidaItem = async item => {
        setFormSaida({ ...formSaida, item_estoque_id: item.item_estoque_id })
        setBuscaItem(item.produto_nome + ' - Lote ' + item.lote)
        setShowDropdown(false)
        // Verificar necessidade de receita apenas para medicamentos
        let necessita = false
        if (item.tipo_produto === 'medicamento') {
            try {
                const res = await api.get(`/medicamento/${item.produto_id}`)
                necessita = res.data.necessita_receita === true
            } catch {
                necessita = false
            }
        }
        setInfoItem({ necessita_receita: necessita })
    }

    const handleSubmitSaida = async e => {
        e.preventDefault()
        try {
            await api.post('/movimentacao-estoque/', {
                ...formSaida,
                tipo: 'saida',
                quantidade: Number(formSaida.quantidade),
                data_movimentacao: formSaida.data_movimentacao,
            })
            alert('Saída registrada com sucesso!')
            onCloseSaidaModal()
        } catch (err) {
            alert('Erro ao registrar saída!')
        }
    }

    return (
        <Box bg="white" p={2} borderRadius="md" shadow="sm" fontFamily="Poppins, sans-serif" maxW="700px" mx="auto">
            <Text color="gray.600" mb={2}>Preencha os dados para registrar a saída de produto.</Text>
            <form id="saida-form" onSubmit={handleSubmitSaida}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                    <FormControl isRequired>
                        <FormLabel>Funcionário Responsável</FormLabel>
                        <Input value={nomeResponsavel} isReadOnly />
                        <input type="hidden" name="funcionario_id" value={formSaida.funcionario_id} />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Data da Movimentação</FormLabel>
                        <Input type="datetime-local" value={formSaida.data_movimentacao} onChange={e => setFormSaida({ ...formSaida, data_movimentacao: e.target.value })} />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Item de Estoque</FormLabel>
                        <Box position="relative">
                            <Input
                                placeholder="Digite o nome do produto"
                                value={buscaItem}
                                onChange={e => { setBuscaItem(e.target.value); setShowDropdown(true); }}
                                autoComplete="off"
                            />
                            {showDropdown && (
                                <Box position="absolute" zIndex={10} bg="white" borderRadius="md" boxShadow="md" mt={1} w="100%" maxH="180px" overflowY="auto">
                                    {itensFiltrados.map(item => (
                                        <Box key={item.item_estoque_id} px={3} py={2} cursor="pointer" onClick={() => handleSelectSaidaItem(item)}>
                                            {item.produto_nome} - Lote {item.lote}
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Box>
                        <input type="hidden" name="item_estoque_id" value={formSaida.item_estoque_id} />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Quantidade</FormLabel>
                        <Input type="number" min={1} value={formSaida.quantidade} onChange={e => setFormSaida({ ...formSaida, quantidade: e.target.value })} />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Armazém de Destino</FormLabel>
                        <Select value={formSaida.armazem_id} onChange={e => setFormSaida({ ...formSaida, armazem_id: e.target.value })}>
                            <option value="">Selecione o armazém</option>
                            {armazens.map(arm => (<option key={arm.id} value={arm.id}>{arm.local_armazem}</option>))}
                        </Select>
                    </FormControl>

                    {infoItem?.necessita_receita && (
                        <>
                            <FormControl isRequired>
                                <FormLabel>CPF do Comprador</FormLabel>
                                <Input value={formSaida.cpf_comprador} onChange={e => setFormSaida({ ...formSaida, cpf_comprador: e.target.value })} />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Nome do Comprador</FormLabel>
                                <Input value={formSaida.nome_comprador} onChange={e => setFormSaida({ ...formSaida, nome_comprador: e.target.value })} />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Receita Digital</FormLabel>
                                <Input type="file" onChange={e => setFormSaida({ ...formSaida, receita_digital: e.target.files[0] })} />
                            </FormControl>
                        </>
                    )}
                </SimpleGrid>
            </form>
        </Box>
    )
}

export default Movimentacoes
