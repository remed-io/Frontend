import React, { useState } from 'react'
import { Box, Button, FormControl, FormLabel, Input, Heading, useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { loginFuncionario, LoginCredentials } from '../services/api'

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({ email: '', senha: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await loginFuncionario(credentials)
      localStorage.setItem('token', data.token)
      toast({ title: 'Login bem-sucedido', status: 'success', duration: 3000, isClosable: true })
      navigate('/')
    } catch (error: any) {
      console.error(error)
      toast({ title: 'Erro ao autenticar', description: error.response?.data?.detail || 'Verifique suas credenciais', status: 'error', duration: 5000, isClosable: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box maxW="md" mx="auto" mt="10">
      <Heading mb="6" textAlign="center">Login</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl id="email" mb="4" isRequired>
          <FormLabel>Email</FormLabel>
          <Input type="email" name="email" value={credentials.email} onChange={handleChange} />
        </FormControl>
        <FormControl id="senha" mb="6" isRequired>
          <FormLabel>Senha</FormLabel>
          <Input type="password" name="senha" value={credentials.senha} onChange={handleChange} />
        </FormControl>
        <Button type="submit" colorScheme="brand" width="full" isLoading={loading}>
          Entrar
        </Button>
      </form>
    </Box>
  )
}

export default Login
