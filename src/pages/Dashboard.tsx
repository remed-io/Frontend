import React from 'react'
import { Box, Heading, Button, Flex, Spacer, Text, useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const toast = useToast()

  const handleLogout = () => {
    localStorage.removeItem('token')
    toast({ title: 'Logout realizado', status: 'info', duration: 3000, isClosable: true })
    navigate('/login')
  }

  return (
    <Box p={6}>
      <Flex mb={6} alignItems="center">
        <Heading size="lg">Dashboard</Heading>
        <Spacer />
        <Button colorScheme="brand" onClick={handleLogout}>
          Sair
        </Button>
      </Flex>
      <Text fontSize="md">Bem-vindo ao sistema de estoque!</Text>
      {/* Em breve, aqui serão exibidos relatórios e dados do estoque */}
    </Box>
  )
}

export default Dashboard
