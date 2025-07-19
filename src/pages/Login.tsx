import { useState, type FC, type FormEvent, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Flex, Input, Button, Heading, Text, Image, Stack, FormControl, FormLabel } from '@chakra-ui/react'
import { loginFuncionario } from '../services/api.ts'

const Login: FC = () => {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrorMessage('')
        setLoading(true)
        try {
            const data = await loginFuncionario({ email, senha })
            if (!data.success) throw new Error(data.message)
            // Armazena ID do funcionário como token provisório e redireciona
            localStorage.setItem('token', String(data.funcionario.id))
            localStorage.setItem('user', JSON.stringify(data.funcionario))
            navigate('/dashboard')
        } catch (error: any) {
            const msg = error.response?.data?.detail || error.response?.data?.message
            setErrorMessage(msg || 'Email e senha inválidos')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Flex h="100vh" fontFamily="Poppins, sans-serif">
            {/* Painel esquerdo - logo e boas-vindas */}
            <Flex flex={1} align="center" justify="center" bgGradient="linear(to-br, blue.800, blue.500)" color="white" px={10}>
                <Stack spacing={6} maxW="lg" textAlign="left">
                    <Image src="/logo.png" alt="Logotipo do ReMed.io" boxSize="100px" alignSelf="flex-start" />
                    <Stack spacing={2} maxW="lg" textAlign="left">
                        <Heading as="h1" size="2xl" fontWeight="bold" opacity={0.95} fontFamily="Poppins, sans-serif" >
                            ReMed.io
                        </Heading>
                        <Text fontSize="2xl" opacity={0.85} maxW="md" >
                            Bem vindo! Comece sua jornada agora com nosso sistema de gerenciamento!
                        </Text>
                    </Stack>
                </Stack>
            </Flex>
            {/* Painel direito - formulário de login*/}
            <Flex flex={1} align="center" justify="center" bg="gray.50">
                <Box bg="white" p={8} borderRadius="md" boxShadow="xl" w="full" maxW="md">
                    <Heading mb={6} size="lg" textAlign="center">
                        Acesse sua conta
                    </Heading>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={4}>
                            <FormControl id="email" isRequired>
                                <FormLabel>Endereço de e-mail</FormLabel>
                                <Input
                                    type="email"
                                    placeholder="seu@exemplo.com"
                                    value={email}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.currentTarget.value)}
                                    borderColor="gray.300" />
                            </FormControl>
                            <FormControl id="password" isRequired>
                                <FormLabel>Senha</FormLabel>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={senha}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSenha(e.currentTarget.value)}
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
                    {errorMessage && (
                        <Text color="red.500" mb={4} textAlign="center">
                            {errorMessage}
                        </Text>
                    )}
                </Box>
            </Flex>
        </Flex>
    )
}

export default Login
