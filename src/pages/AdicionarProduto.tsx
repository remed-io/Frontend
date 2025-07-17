// @ts-nocheck
import React, { ChangeEvent, FormEvent, useState } from 'react'
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
    HStack
} from '@chakra-ui/react'
import Sidebar from './Sidebar'
import Header from '../components/Header'
import { createMedicamento, createSuplementoAlimentar, createCuidadoPessoal, createItemEstoque } from '../services/api'
import { FiPlus, FiArrowLeft } from 'react-icons/fi'

const AdicionarProduto: React.FC = () => {
    const navigate = useNavigate()
    const [tipo, setTipo] = useState<'medicamento' | 'suplemento_alimentar' | 'cuidado_pessoal'>('medicamento')
    const [form, setForm] = useState<Record<string, any>>({})

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
            await createItemEstoque({
                tipo_produto: tipo,
                produto_medicamento_id: tipo === 'medicamento' ? created.id : null,
                produto_suplemento_alimentar_id: tipo === 'suplemento_alimentar' ? created.id : null,
                produto_cuidado_pessoal_id: tipo === 'cuidado_pessoal' ? created.id : null,
                quantidade_minima: Number(form.quantidade_minima),
                quantidade_atual: Number(form.quantidade_atual),
                armazem_local: form.armazem_local,
                lote: form.lote,
                data_validade: form.data_validade,
            })
            navigate('/estoque/produtos')
        } catch (error) {
            console.error('Erro ao salvar:', error)
        }
    }

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
                        <Box bg="white" p={4} rounded="md" shadow="md" mb={4}>
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
                                            <FormLabel>Dosagem</FormLabel>
                                            <Input variant="filled" bg="gray.50" placeholder="Digite a dosagem" onChange={e => handleChange('dosagem', e.target.value)} />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Tarja</FormLabel>
                                            <Select variant="filled" bg="gray.50" placeholder="Selecione a tarja" onChange={e => handleChange('tarja', e.target.value)}>
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
                                            <HStack w="full" spacing={2} align="center">
                                                <Select
                                                    w="full"
                                                    minW="250px"
                                                    variant="filled"
                                                    bg="gray.50"
                                                    placeholder="Selecione restrições"
                                                    multiple
                                                    onChange={e => handleChange('restricoes', Array.from(e.target.selectedOptions).map(o => o.value))}
                                                >
                                                    {/* TODO: mapear restrições */}
                                                </Select>
                                                <IconButton
                                                    size="sm"
                                                    variant="ghost"
                                                    borderRadius="full"
                                                    aria-label="Adicionar restrição"
                                                    icon={<FiPlus />}
                                                    onClick={() => navigate('/restricoes/novo')}
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
                                                    {/* TODO: mapear opções */}
                                                </Select>
                                                <IconButton
                                                    size="sm"
                                                    variant="ghost"
                                                    borderRadius="full"
                                                    aria-label="Adicionar subcategoria"
                                                    icon={<FiPlus />}
                                                    onClick={() => navigate('/subcategoria/novo')}
                                                />
                                            </HStack>
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Restrições</FormLabel>
                                            <HStack>
                                                <Select
                                                    variant="filled"
                                                    bg="gray.50"
                                                    placeholder="Selecione restrições"
                                                    multiple
                                                    onChange={e => handleChange('restricoes', Array.from(e.target.selectedOptions).map(o => o.value))}
                                                >
                                                    {/* TODO: mapear restrições */}
                                                </Select>
                                                <IconButton
                                                    size="sm"
                                                    variant="ghost"
                                                    borderRadius="full"
                                                    aria-label="Adicionar restrição"
                                                    icon={<FiPlus />}
                                                    onClick={() => navigate('/restricoes/novo')}
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
                                            onChange={e => handleChange('armazem_local', e.target.value)}
                                        >
                                            {/* TODO: mapear armazéns */}
                                        </Select>
                                        <IconButton
                                            size="sm"
                                            variant="ghost"
                                            borderRadius="full"
                                            aria-label="Adicionar armazém"
                                            icon={<FiPlus />}
                                            onClick={() => navigate('/armazem/novo')}
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
                                            {/* TODO: mapear fornecedores */}
                                        </Select>
                                        <IconButton
                                            size="sm"
                                            variant="ghost"
                                            borderRadius="full"
                                            aria-label="Adicionar fornecedor"
                                            icon={<FiPlus />}
                                            onClick={() => navigate('/fornecedor/novo')}
                                        />
                                    </HStack>
                                </FormControl>
                            </SimpleGrid>
                            <Flex mt={4} justify="flex-end">
                                <Button colorScheme="green" type="submit">Salvar Produto</Button>
                            </Flex>
                        </Box>
                    </form>
                </Box>
            </Flex>
        </Flex>
    )
}

export default AdicionarProduto
