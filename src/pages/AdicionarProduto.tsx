// @ts-nocheck
import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Box,
    Flex,
    Heading,
    SimpleGrid,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Checkbox,
    Select,
    Button,
    Divider,
    InputGroup,
    InputLeftAddon,
    VStack,
    Text,
    Stack,
    IconButton,
    HStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Tag,
    TagLabel
} from '@chakra-ui/react'
import api from '../services/api'
import Sidebar from './Sidebar'
import Header from '../components/Header'
import { createMedicamento, createSuplementoAlimentar, createCuidadoPessoal, createItemEstoque, createItemArmazenado, createArmazem, createFornecedor, createRestricaoAlimentar, createSubcategoriaCuidadoPessoal } from '../services/api'
import { FiPlus, FiArrowLeft, FiTrash2 } from 'react-icons/fi'

const AdicionarProduto: React.FC = () => {
    const navigate = useNavigate()
    const [tipo, setTipo] = useState<'medicamento' | 'suplemento_alimentar' | 'cuidado_pessoal'>('medicamento')
    const [form, setForm] = useState<Record<string, any>>({})
    const [armazens, setArmazens] = useState<any[]>([])
    const [fornecedores, setFornecedores] = useState<any[]>([])
    const [restricoes, setRestricoes] = useState<any[]>([])
    const [subcategorias, setSubcategorias] = useState<any[]>([])
    const { isOpen: isFornecedorOpen, onOpen: onFornecedorOpen, onClose: onFornecedorClose } = useDisclosure()
    const { isOpen: isRestricaoOpen, onOpen: onRestricaoOpen, onClose: onRestricaoClose } = useDisclosure()
    const { isOpen: isSubcategoriaOpen, onOpen: onSubcategoriaOpen, onClose: onSubcategoriaClose } = useDisclosure()
    const { isOpen: isArmazemOpen, onOpen: onArmazemOpen, onClose: onArmazemClose } = useDisclosure()
    // success modal
    const { isOpen: isSuccessOpen, onOpen: onSuccessOpen, onClose: onSuccessClose } = useDisclosure()
    const [successMessage, setSuccessMessage] = useState<string>('')

    const tipos = [
        { value: 'medicamento', label: 'Medicamento', subtitle: 'Adicionar medicamento' },
        { value: 'suplemento_alimentar', label: 'Suplemento', subtitle: 'Adicionar suplemento alimentar' },
        { value: 'cuidado_pessoal', label: 'Cuidado Pessoal', subtitle: 'Adicionar produto de cuidado pessoal' },
    ]

    const handleChange = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            let created: any
            if (tipo === 'medicamento') {
                created = await createMedicamento({
                    nome: form.nome,
                    dosagem: form.dosagem,
                    principio_ativo: form.principio_ativo,
                    tarja: form.tarja,
                    forma_farmaceutica: form.forma_farmaceutica,
                    fabricante: form.fabricante,
                    necessita_receita: form.necessita_receita,
                    registro_anvisa: form.registro_anvisa,
                })
            } else if (tipo === 'suplemento_alimentar') {
                created = await createSuplementoAlimentar({
                    nome: form.nome,
                    principio_ativo: form.principio_ativo,
                    sabor: form.sabor,
                    peso_volume: form.peso_volume,
                    fabricante: form.fabricante,
                    registro_anvisa: form.registro_anvisa,
                })
            } else {
                created = await createCuidadoPessoal({
                    nome: form.nome,
                    subcategoria_id: form.subcategoria_id,
                    volume: form.volume,
                    quantidade: form.quantidade,
                    fabricante: form.fabricante,
                    uso_recomendado: form.uso_recomendado,
                    publico_alvo: form.publico_alvo,
                })
            }
            const itemEstoqueCreated = await createItemEstoque({
                codigo_barras: form.codigo_barras,
                preco: Number(form.preco),
                data_validade: form.data_validade,
                fornecedor_id: Number(form.fornecedor_id),
                lote: form.lote,
                produto_medicamento_id: tipo === 'medicamento' ? created.id : null,
                produto_suplemento_alimentar_id: tipo === 'suplemento_alimentar' ? created.id : null,
                produto_cuidado_pessoal_id: tipo === 'cuidado_pessoal' ? created.id : null,
            })

            const quantidadeEntrada = Number(form.quantidade_atual) || 0
            await createItemArmazenado({
                item_estoque_id: itemEstoqueCreated.id,
                quantidade: quantidadeEntrada,
                armazem_id: form.armazem_local,
            })
          // show success message and delay navigation
          let msg = ''
          if (tipo === 'medicamento') msg = 'Medicamento salvo com sucesso!'
          else if (tipo === 'cuidado_pessoal') msg = 'Produto de cuidado pessoal salvo com sucesso!'
          else msg = 'Suplemento alimentar cadastrado com sucesso!'
          setSuccessMessage(msg)
          onSuccessOpen()
        } catch (error) {
            console.error('Erro ao salvar:', error)
        }
    }

    useEffect(() => {
      ;(async () => {
        const [resArm, resForn, resRest, resSub] = await Promise.all([
          api.get('/armazem'),
          api.get('/fornecedor'),
          api.get('/restricao-alimentar'),
          api.get('/subcategoria-cuidado-pessoal'),
        ])
        setArmazens(resArm.data)
        setFornecedores(resForn.data)
        setRestricoes(resRest.data)
        setSubcategorias(resSub.data)
      })()
    }, [])

    return (
        <Flex h="100vh" fontFamily="Poppins, sans-serif" bg="gray.100">
            <Sidebar />
            <Flex direction="column" flex={1} bg="gray.100" fontFamily="Poppins, sans-serif">
                <Header />
                <Box flex="1" p={6}>
                    {/* Botão para retornar à lista de produtos */}
                    <Button leftIcon={<FiArrowLeft />} variant="outline" mb={4} onClick={() => navigate('/estoque/produtos')}>Voltar à Lista de Produtos</Button>
                    <form onSubmit={handleSubmit}>
                        <Heading size="lg" mb={6} fontFamily="Poppins, sans-serif">
                            Estoque &gt; Lista de Produtos &gt; Adicionar Produtos
                        </Heading>
                        {/* Checkpoints de tipo de produto */}
                        <Stack direction={{ base: 'column', md: 'row' }} spacing={6} mb={4} justify="center">
                            {tipos.map(({ value, label, subtitle }) => (
                                <Checkbox
                                    key={value}
                                    isChecked={tipo === value}
                                    onChange={() => setTipo(value)}
                                    colorScheme="blue"
                                >
                                    <VStack align="start" spacing={0} ml={2}>
                                        <Text fontSize="md" fontWeight="semibold">{label}</Text>
                                        <Text fontSize="sm" color="gray.500">{subtitle}</Text>
                                    </VStack>
                                </Checkbox>
                            ))}
                        </Stack>
                        <Box bg="white" p={3} rounded="md" shadow="md" mb={4}>
                            <Heading size="md" mb={2} fontFamily="Poppins, sans-serif">Informações do Produto</Heading>
                            <Divider mb={2} />
                            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={4} mb={4}>
                                <FormControl>
                                    <FormLabel>Nome</FormLabel>
                                    <Input variant="filled" bg="gray.50" placeholder="Digite o nome do produto" onChange={e => handleChange('nome', e.target.value)} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Fabricante</FormLabel>
                                    <Input variant="filled" bg="gray.50" placeholder="Digite o fabricante" onChange={e => handleChange('fabricante', e.target.value)} />
                                </FormControl>
                                {tipo === 'medicamento' && (
                                    <>
                                        <FormControl>
                                            <FormLabel>Princípio Ativo</FormLabel>
                                            <Input variant="filled" bg="gray.50" placeholder="Digite o princípio ativo" onChange={e => handleChange('principio_ativo', e.target.value)} />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Dosagem</FormLabel>
                                            <Input variant="filled" bg="gray.50" placeholder="Digite a dosagem" onChange={e => handleChange('dosagem', e.target.value)} />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Tarja</FormLabel>
                                            <Select variant="filled" bg="gray.50" placeholder="Selecione a tarja" onChange={e => handleChange('tarja', e.target.value)}>
                                                <option value="sem_tarja">Sem Tarja</option>
                                                <option value="preta">Preta</option>
                                                <option value="vermelha">Vermelha</option>
                                                <option value="branca">Branca</option>
                                            </Select>
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Forma Farmacêutica</FormLabel>
                                            <Input variant="filled" bg="gray.50" placeholder="Digite a forma farmacêutica" onChange={e => handleChange('forma_farmaceutica', e.target.value)} />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Registro ANVISA</FormLabel>
                                            <Input variant="filled" bg="gray.50" placeholder="Digite o registro ANVISA" onChange={e => handleChange('registro_anvisa', e.target.value)} />
                                        </FormControl>
                                        <FormControl display="flex" alignItems="center" justifyContent="center">
                                            <Checkbox onChange={e => handleChange('necessita_receita', e.target.checked)}>
                                                Necessita Receita
                                            </Checkbox>
                                        </FormControl>

                                    </>
                                )}
                                {tipo === 'suplemento_alimentar' && (
                                    <>
                                        <FormControl>
                                            <FormLabel>Princípio Ativo</FormLabel>
                                            <Input variant="filled" bg="gray.50" placeholder="Digite o princípio ativo" onChange={e => handleChange('principio_ativo', e.target.value)} />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Sabor</FormLabel>
                                            <Input variant="filled" bg="gray.50" placeholder="Digite o sabor" onChange={e => handleChange('sabor', e.target.value)} />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Peso/Volume</FormLabel>
                                            <Input variant="filled" bg="gray.50" placeholder="Digite o peso ou volume" onChange={e => handleChange('peso_volume', e.target.value)} />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Registro ANVISA</FormLabel>
                                            <Input variant="filled" bg="gray.50" placeholder="Digite o registro ANVISA" onChange={e => handleChange('registro_anvisa', e.target.value)} />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Restrições</FormLabel>
                                            {/* Tags de restrições selecionadas */}
                                            <Stack direction="row" wrap="wrap" spacing={2} mb={2}>
                                                {(form.restricoes || []).map(id => {
                                                     const item = restricoes.find(r => r.id === id)
                                                     return item ? (
                                                         <Tag key={item.id} size="md" borderRadius="full" variant="solid" colorScheme="blue">
                                                             <TagLabel>{item.nome}</TagLabel>
                                                             <IconButton
                                                                 size="xs"
                                                                 ml={1}
                                                                 variant="ghost"
                                                                 aria-label="Remover restrição"
                                                                 icon={<FiTrash2 />}
                                                                 onClick={() => handleChange('restricoes', (form.restricoes || []).filter(rid => rid !== item.id))}
                                                             />
                                                         </Tag>
                                                     ) : null
                                                })}
                                            </Stack>
                                            {/* Select para adicionar nova restrição */}
                                            <HStack w="full">
                                                <Select
                                                    flex={1}
                                                    variant="filled"
                                                    bg="gray.50"
                                                    placeholder="Adicionar restrição"
                                                    value=""
                                                    onChange={e => {
                                                        const val = Number(e.target.value)
                                                        handleChange('restricoes', [...(form.restricoes || []), val])
                                                    }}
                                                >
                                                    {restricoes.filter(r => !(form.restricoes || []).includes(r.id)).map(r => (
                                                        <option key={r.id} value={r.id}>{r.nome}</option>
                                                    ))}
                                                </Select>
                                                <IconButton
                                                    size="sm"
                                                    variant="ghost"
                                                    borderRadius="full"
                                                    aria-label="Abrir modal restrição"
                                                    icon={<FiPlus />}
                                                    onClick={onRestricaoOpen}
                                                />
                                            </HStack>
                                         </FormControl>
                                    </>
                                )}
                                {tipo === 'cuidado_pessoal' && (
                                    <>
                                        <FormControl>
                                            <FormLabel>Subcategoria</FormLabel>
                                            <HStack>
                                                <Select
                                                    variant="filled"
                                                    bg="gray.50"
                                                    placeholder="Selecione a subcategoria"
                                                    onChange={e => handleChange('subcategoria_id', e.target.value)}
                                                >
                                                    {subcategorias.map(s => (
                                                      <option key={s.id} value={s.id}>{s.nome}</option>
                                                    ))}
                                                </Select>
                                                <IconButton
                                                    size="sm"
                                                    variant="ghost"
                                                    borderRadius="full"
                                                    aria-label="Adicionar subcategoria"
                                                    icon={<FiPlus />}
                                                    onClick={onSubcategoriaOpen}
                                                />
                                            </HStack>
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Volume</FormLabel>
                                            <Input variant="filled" bg="gray.50" placeholder="Digite o volume" onChange={e => handleChange('volume', e.target.value)} />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Quantidade</FormLabel>
                                            <Input variant="filled" bg="gray.50" type="number" placeholder="Digite a quantidade" onChange={e => handleChange('quantidade', e.target.value)} />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Uso Recomendado</FormLabel>
                                            <Input variant="filled" bg="gray.50" placeholder="Digite o uso recomendado" onChange={e => handleChange('uso_recomendado', e.target.value)} />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Público Alvo</FormLabel>
                                            <Input variant="filled" bg="gray.50" placeholder="Digite o público alvo" onChange={e => handleChange('publico_alvo', e.target.value)} />
                                        </FormControl>
                                    </>
                                )}
                            </SimpleGrid>
                        </Box>
                        <Box bg="white" p={4} rounded="md" shadow="md">
                            <Heading size="md" mb={2} fontFamily="Poppins, sans-serif">Controle de Estoque</Heading>
                            <Divider mb={2} />
                            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                                <FormControl>
                                    <FormLabel>Código de Barras</FormLabel>
                                    <Input variant="filled" bg="gray.50" placeholder="0000000000000" onChange={e => handleChange('codigo_barras', e.target.value)} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Preço</FormLabel>
                                    <InputGroup>
                                        <InputLeftAddon children="R$" />
                                        <Input variant="filled" bg="gray.50" type="number" step="0.01" placeholder="0,00" onChange={e => handleChange('preco', e.target.value)} />
                                    </InputGroup>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Armazém Local</FormLabel>
                                    <HStack>
                                        <Select
                                            variant="filled"
                                            bg="gray.50"
                                            placeholder="Selecione armazém"
                                            onChange={e => {
                                                const selectedId = Number(e.target.value)
                                                handleChange('armazem_local', selectedId)
                                                const found = armazens.find(a => a.id === selectedId)
                                                handleChange('quantidade_minima', found ? found.quantidade_minima : '')
                                            }}
                                        >
                                            {armazens.map(a => (
                                              <option key={a.id} value={a.id}>{a.local_armazem}</option>
                                            ))}
                                        </Select>
                                        <IconButton
                                            size="sm"
                                            variant="ghost"
                                            borderRadius="full"
                                            aria-label="Adicionar armazém"
                                            icon={<FiPlus />}
                                            onClick={onArmazemOpen}
                                        />
                                    </HStack>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Qtd. Mínima</FormLabel>
                                    <Input variant="filled" bg="gray.50" type="number" value={form.quantidade_minima || ''} isReadOnly placeholder="Qtd. mínima" />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Quantidade</FormLabel>
                                    <Input variant="filled" bg="gray.50" type="number" placeholder="Digite a quantidade" onChange={e => handleChange('quantidade_atual', e.target.value)} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Lote</FormLabel>
                                    <Input variant="filled" bg="gray.50" placeholder="Digite o lote" onChange={e => handleChange('lote', e.target.value)} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Data de Validade</FormLabel>
                                    <Input variant="filled" bg="gray.50" type="date" onChange={e => handleChange('data_validade', e.target.value)} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Fornecedor</FormLabel>
                                    <HStack>
                                        <Select
                                            variant="filled"
                                            bg="gray.50"
                                            placeholder="Selecione fornecedor"
                                            onChange={e => handleChange('fornecedor_id', e.target.value)}
                                        >
                                            {fornecedores.map(f => (
                                              <option key={f.id} value={f.id}>{f.nome}</option>
                                            ))}
                                        </Select>
                                        <IconButton
                                            size="sm"
                                            variant="ghost"
                                            borderRadius="full"
                                            aria-label="Adicionar fornecedor"
                                            icon={<FiPlus />}
                                            onClick={onFornecedorOpen}
                                        />
                                    </HStack>
                                </FormControl>
                            </SimpleGrid>
                            <Flex mt={4} justify="flex-end">
                                <Button colorScheme="green" type="submit">Salvar Produto</Button>
                            </Flex>
                        </Box>
                        </form>

                    {/* Modal para criar Fornecedor */}
                    <Modal isOpen={isFornecedorOpen} onClose={onFornecedorClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Novo Fornecedor</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <FormControl mb={4}>
                                    <FormLabel>Nome</FormLabel>
                                    <Input
                                        variant="filled"
                                        bg="gray.50"
                                        placeholder="Digite o nome do fornecedor"
                                        onChange={e => handleChange('novo_fornecedor_nome', e.target.value)}
                                    />
                                </FormControl>
                                <FormControl mb={4}>
                                    <FormLabel>CNPJ</FormLabel>
                                    <Input
                                        variant="filled"
                                        bg="gray.50"
                                        placeholder="Digite o CNPJ"
                                        onChange={e => handleChange('novo_fornecedor_cnpj', e.target.value)}
                                    />
                                </FormControl>
                                <FormControl mb={4}>
                                    <FormLabel>Contato</FormLabel>
                                    <Input
                                        variant="filled"
                                        bg="gray.50"
                                        placeholder="Digite o contato"
                                        onChange={e => handleChange('novo_fornecedor_contato', e.target.value)}
                                    />
                                </FormControl>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="ghost" mr={3} onClick={onFornecedorClose}>Cancelar</Button>
                                <Button colorScheme="blue" onClick={async () => {
                                    try {
                                        const novo = await createFornecedor({
                                            nome: form.novo_fornecedor_nome,
                                            cnpj: form.novo_fornecedor_cnpj,
                                            contato: form.novo_fornecedor_contato
                                        })
                                        setFornecedores(prev => [...prev, novo])
                                        handleChange('fornecedor_id', novo.id)
                                        onFornecedorClose()
                                    } catch (error) {
                                        console.error('Erro ao criar fornecedor:', error)
                                    }
                                }}>Salvar</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                    {/* Modal para criar Restrição */}
                    <Modal isOpen={isRestricaoOpen} onClose={onRestricaoClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Nova Restrição Alimentar</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <FormControl mb={4}>
                                    <FormLabel>Nome</FormLabel>
                                    <Input
                                        variant="filled"
                                        bg="gray.50"
                                        placeholder="Digite o nome da restrição"
                                        onChange={e => handleChange('nova_restricao_nome', e.target.value)}
                                    />
                                </FormControl>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="ghost" mr={3} onClick={onRestricaoClose}>Cancelar</Button>
                                <Button colorScheme="blue" onClick={async () => {
                                    try {
                                        const novo = await createRestricaoAlimentar({ nome: form.nova_restricao_nome })
                                        setRestricoes(prev => [...prev, novo])
                                        handleChange('restricoes', [...(form.restricoes||[]), novo.id])
                                        onRestricaoClose()
                                    } catch (error) {
                                        console.error('Erro ao criar restrição:', error)
                                    }
                                }}>Salvar</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                    {/* Modal para criar Subcategoria */}
                    <Modal isOpen={isSubcategoriaOpen} onClose={onSubcategoriaClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Nova Subcategoria de Cuidado Pessoal</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <FormControl mb={4}>
                                    <FormLabel>Nome</FormLabel>
                                    <Input
                                        variant="filled"
                                        bg="gray.50"
                                        placeholder="Digite o nome da subcategoria"
                                        onChange={e => handleChange('nova_subcategoria_nome', e.target.value)}
                                    />
                                </FormControl>
                                <FormControl mb={4}>
                                    <FormLabel>Descrição</FormLabel>
                                    <Input
                                        variant="filled"
                                        bg="gray.50"
                                        placeholder="Digite a descrição"
                                        onChange={e => handleChange('nova_subcategoria_descricao', e.target.value)}
                                    />
                                </FormControl>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="ghost" mr={3} onClick={onSubcategoriaClose}>Cancelar</Button>
                                <Button colorScheme="blue" onClick={async () => {
                                    try {
                                        const novo = await createSubcategoriaCuidadoPessoal({
                                            nome: form.nova_subcategoria_nome,
                                            descricao: form.nova_subcategoria_descricao
                                        })
                                        setSubcategorias(prev => [...prev, novo])
                                        handleChange('subcategoria_id', novo.id)
                                        onSubcategoriaClose()
                                    } catch (error) {
                                        console.error('Erro ao criar subcategoria:', error)
                                    }
                                }}>Salvar</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                    {/* Modal para criar Armazém */}
                    <Modal isOpen={isArmazemOpen} onClose={onArmazemClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Novo Armazém</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <FormControl mb={4}>
                                    <FormLabel>Local Armazém</FormLabel>
                                    <Input
                                        variant="filled"
                                        bg="gray.50"
                                        placeholder="Digite o local do armazém"
                                        onChange={e => handleChange('novo_armazem_local_armazem', e.target.value)}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Quantidade Mínima</FormLabel>
                                    <Input
                                        variant="filled"
                                        bg="gray.50"
                                        type="number"
                                        placeholder="Digite a quantidade mínima"
                                        onChange={e => handleChange('novo_armazem_quantidade_minima', e.target.value)}
                                    />
                                </FormControl>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="ghost" mr={3} onClick={onArmazemClose}>Cancelar</Button>
                                <Button colorScheme="blue" onClick={async () => {
                                    try {
                                        const novo = await createArmazem({
                                            local_armazem: form.novo_armazem_local_armazem,
                                            quantidade_minima: Number(form.novo_armazem_quantidade_minima)
                                        })
                                        setArmazens(prev => [...prev, novo])
                                        handleChange('armazem_local', novo.id)
                                        onArmazemClose()
                                    } catch (error) {
                                        console.error('Erro ao criar armazém:', error)
                                    }
                                }}>Salvar</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
        {/* Modal de sucesso após cadastro */}
        <Modal isOpen={isSuccessOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Sucesso</ModalHeader>
                <ModalBody>
                    <Text fontSize="md" textAlign="center" mb={4}>
                        {successMessage}
                    </Text>
                </ModalBody>
                <ModalFooter justifyContent="center">
                    <Button
                        colorScheme="blue"
                        w="100px"
                        onClick={() => {
                            onSuccessClose()
                            navigate('/estoque/produtos')
                        }}
                    >
                        OK
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
                </Box>
            </Flex>
        </Flex>
    )
}

export default AdicionarProduto
