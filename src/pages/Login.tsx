import React, { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Flex, Input, Button, Heading, Text, Image, Stack, FormControl, FormLabel } from '@chakra-ui/react'
import { loginFuncionario } from '../services/api'

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('')
    const [senha, setSenha] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    // const toast = useToast()
    const navigate = useNavigate()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { token } = await loginFuncionario({ email, senha })
            localStorage.setItem('token', token)
            alert('Login bem-sucedido')
            navigate('/')
        } catch (error: any) {
            alert(error.response?.data?.detail || 'Erro no login. Verifique suas credenciais')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Flex h="100vh" fontFamily="Poppins, sans-serif">
            {/* Left panel - welcome */}
            <Flex flex={1} align="center" justify="center"
                bgGradient="linear(to-br, blue.800, blue.500)" color="white" px={10}>
                <Stack spacing={7} maxW="lg">
                    <Image src="/logo.png" alt="Logotipo do ReMed.io" boxSize="80px" alignSelf="left" />
                    <Stack spacing={2} maxW="lg">
                        <Heading size="xl">ReMed.io</Heading>
                        <Text fontSize="lg" lineHeight="tall">
                            Bem-vindo. Comece sua jornada agora com nosso sistema de gerenciamento!
                        </Text>
                    </Stack>
                </Stack>
            </Flex>
            {/* Right panel - login form */}
            <Flex flex={1} align="center" justify="center" bg="gray.50">
                <Box bg="white" p={8} borderRadius="md" boxShadow="xl" w="full" maxW="md">
                    <Heading mb={6} size="lg" textAlign="center">
                        Acesse sua conta
                    </Heading>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={4}>
                            <FormControl id="email" isRequired>
                                <FormLabel>Endereço de e-mail</FormLabel>
                                <Input type="email" placeholder="seu@exemplo.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    borderColor="gray.300" />
                            </FormControl>
                            <FormControl id="password" isRequired>
                                <FormLabel>Senha</FormLabel>
                                <Input type="password" placeholder="••••••••"
                                    value={senha}
                                    onChange={e => setSenha(e.target.value)}
                                    borderColor="gray.300" />
                                <Flex justify="flex-end">
                                    <Text fontSize="sm" color="blue.500" cursor="pointer" mt={1}>
                                        Esqueceu a senha?
                                    </Text>
                                </Flex>
                            </FormControl>
                            <Button type="submit" colorScheme="blue" size="md" isLoading={loading}>
                                Entrar
                            </Button>
                        </Stack>
                    </form>
                    <Text mt={4} textAlign="center" fontSize="sm">
                        Não tem uma conta? <Text as="span" color="blue.500" cursor="pointer" onClick={() => navigate('/signup')}>Cadastre-se</Text>
                    </Text>
                </Box>
            </Flex>
        </Flex>
    )
}

export default Login
