// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { Box, Flex, Heading, Button, Table, Thead, Tbody, Tr, Th, Td, IconButton, HStack, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from '../components/Header'
import api from '../services/api'

const ListaUsuarios = () => {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [search, setSearch] = useState('')

    const fetchUsers = async () => {
        try {
            const res = await api.get('/funcionario')
            setUsers(res.data)
        } catch (err) {
            console.error('Erro ao buscar usuários:', err)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])
    // Filtra usuários pelo nome
    const filteredUsers = users.filter(u => u.nome.toLowerCase().includes(search.toLowerCase()))

    const handleDelete = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
            try {
                await api.delete(`/funcionario/${id}`)
                fetchUsers()
            } catch (err) {
                console.error('Erro ao excluir usuário:', err)
            }
        }
    }

    return (
        <Flex h="100vh" fontFamily="Poppins, sans-serif" bg="gray.100">
            <Sidebar />
            <Flex direction="column" flex={1} bg="gray.100">
                <Header />
                <Box flex="1" p={6}>
                    <Flex mb={4} align="center" justify="space-between">
                        <Heading size="lg">Usuários ({users.length})</Heading>
                        <Button colorScheme="blue" leftIcon={<FiPlus />} onClick={() => navigate('/usuarios/novo')}>
                            Adicionar Usuário
                        </Button>
                    </Flex>
                    {/* Busca de usuários */}
                    <Flex mb={4} align="center" w="full">
                        <InputGroup maxW="300px">
                            <Input
                                placeholder="Buscar Usuário"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <InputRightElement pointerEvents="none">
                                <FiSearch color="gray.500" />
                            </InputRightElement>
                        </InputGroup>
                    </Flex>
                    <Box overflowX="auto" bg="white" borderRadius="md">
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Nome</Th>
                                    <Th>Cargo</Th>
                                    <Th>Ações</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {filteredUsers.map(u => (
                                    <Tr key={u.id}>
                                        <Td>{u.nome}</Td>
                                        <Td>{u.cargo}</Td>
                                        <Td>
                                            <HStack spacing={2}>
                                                <IconButton
                                                    aria-label="Editar Usuário"
                                                    icon={<FiEdit />}
                                                    onClick={() => navigate(`/usuarios/editar/${u.id}`)}
                                                />
                                                <IconButton
                                                    aria-label="Excluir Usuário"
                                                    icon={<FiTrash2 />}
                                                    onClick={() => handleDelete(u.id)}
                                                />
                                            </HStack>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                </Box>
            </Flex>
        </Flex>
    )
}

export default ListaUsuarios
