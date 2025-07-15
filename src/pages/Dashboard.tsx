import React from 'react'
import { Box, Text } from '@chakra-ui/react'

const Dashboard: React.FC = () => {
    return (
        <Box p={8}>
            <Text fontSize="2xl" fontWeight="bold">
                Bem-vindo ao Dashboard
            </Text>
            <Text mt={4}>Esta é uma página de placeholder enquanto o layout final é desenvolvido.</Text>
        </Box>
    )
}

export default Dashboard
