// @ts-nocheck
import React, { useState, useEffect } from 'react'
import {
    HStack,
    InputGroup,
    Input,
    InputRightElement,
    Select,
    VStack,
    Text,
} from '@chakra-ui/react'
import { FiSearch, FiSun, FiMoon } from 'react-icons/fi'
import { MdTranslate } from 'react-icons/md'

const Header = () => {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 60000)
        return () => clearInterval(interval)
    }, [])

    const hours = time.getHours()
    const isDayTime = hours >= 6 && hours < 18
    const greeting = isDayTime ? 'Bom dia!' : 'Boa noite!'
    const greetingDate = time.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    const greetingTime = time.toLocaleTimeString('pt-BR')

    return (
        <HStack justify="space-between" p="4" bg="white" boxShadow="sm">
            <InputGroup flex={1} maxW="600px">
                <Input placeholder="Buscar no sistema" bg="gray.50" borderRadius="md" />
                <InputRightElement pointerEvents="none">
                    <FiSearch color="gray.500" />
                </InputRightElement>
            </InputGroup>
            <HStack spacing={5} align="center">
                <HStack spacing={1} align="center">
                    <MdTranslate size={20} />
                    <Select size="sm" variant="unstyled" w="auto" defaultValue="pt-BR">
                        <option value="pt-BR">Português (BR)</option>
                    </Select>
                </HStack>
                <VStack spacing={0} align="flex-end" textAlign="right">
                    <HStack spacing={1} align="center">
                        {isDayTime ? <FiSun size={20} color="#F1C40F" /> : <FiMoon size={20} color="#2C3E50" />}
                        <Text fontSize="3sm" fontWeight="bold">{greeting}</Text>
                    </HStack>
                    <Text fontSize="sm">{greetingDate} · {greetingTime}</Text>
                </VStack>
            </HStack>
        </HStack>
    )
}

export default Header
