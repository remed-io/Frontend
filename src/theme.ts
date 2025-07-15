import { extendTheme } from '@chakra-ui/react'

// Configuração de tema personalizado para Chakra UI
// Inicialmente forçamos modo claro e desabilitamos o sistema
const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const colors = {
  brand: {
    50: '#e3f2f9',
    100: '#c5e4f3',
    200: '#a2d4ec',
    300: '#7ac1e4',
    400: '#47a9da',
    500: '#0088cc',
    600: '#007ab8',
    700: '#006ba1',
    800: '#005885',
    900: '#003f5e',
  },
}

const fonts = {
  heading: 'Inter, sans-serif',
  body: 'Inter, sans-serif',
}

const theme = extendTheme({
  config,
  colors,
  fonts,
})

export default theme
