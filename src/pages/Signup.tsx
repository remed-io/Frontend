import React, { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Box,
    Flex,
    Input,
    Button,
    Heading,
    Text,
    Stack,
    FormControl,
    FormLabel,
    Divider,
    Image
} from '@chakra-ui/react'
import { FaGoogle } from 'react-icons/fa'

const Signup: React.FC = () => {
    const [nome, setNome] = useState<string>('')
    const [cpf, setCpf] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [senha, setSenha] = useState<string>('')
    const [cargo, setCargo] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate()

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // TODO: implementar lógica de registro
        setTimeout(() => {
            setLoading(false)
            alert('Conta criada com sucesso!')
            navigate('/login')
        }, 1000)
    }

    return (
        <Flex h="100vh" fontFamily="Poppins, sans-serif">
            {/* Left panel */}
            <Flex flex={1} align="center" justify="center" bgGradient="linear(to-br, blue.800, blue.500)" color="white" px={10}>
                <Stack spacing={5} maxW="lg">
                    <Image src="/logo.png" alt="Logotipo do ReMed.io" boxSize="180px" alignSelf="left" />
                    <Heading size="3xl" opacity={0.9}>ReMed.io</Heading>
                    <Heading size="lg" opacity={0.9}>Bem-vindo. Comece sua jornada agora com nosso sistema de gerenciamento!</Heading>
                </Stack>
            </Flex>
            {/* Right panel */}
            <Flex flex={1} align="center" justify="center" bg="gray.50">
                <Box bg="white" p={8} borderRadius="md" boxShadow="xl" w="full" maxW="md">
                    <Heading mb={6} size="lg" textAlign="center" opacity={0.9}>
                        Crie uma conta
                    </Heading>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={4}>
                            <FormControl id="nome" isRequired>
                                <FormLabel>Nome completo</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Seu nome completo"
                                    value={nome}
                                    onChange={e => setNome(e.target.value)}
                                />
                            </FormControl>
                            <FormControl id="cpf" isRequired>
                                <FormLabel>CPF</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="000.000.000-00"
                                    value={cpf}
                                    onChange={e => setCpf(e.target.value)}
                                />
                            </FormControl>
                            <FormControl id="email" isRequired>
                                <FormLabel>Endereço de email</FormLabel>
                                <Input
                                    type="email"
                                    placeholder="seu@exemplo.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </FormControl>
                            <FormControl id="password" isRequired>
                                <FormLabel>Senha</FormLabel>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={senha}
                                    onChange={e => setSenha(e.target.value)}
                                />
                            </FormControl>
                            <Button type="submit" colorScheme="blue" size="md" isLoading={loading}>
                                Criar conta
                            </Button>
                        </Stack>
                    </form>
                    <Flex align="center" my={6}>
                        <Divider />
                        <Text px={4} color="gray.500">ou</Text>
                        <Divider />
                    </Flex>
                    <Text fontSize="sm" textAlign="center">
                        Já possui uma conta? <Text as="span" color="blue.500" cursor="pointer" onClick={() => navigate('/login')}>Entrar</Text>
                    </Text>
                </Box>
            </Flex>
        </Flex>
    )
}

export default Signup
