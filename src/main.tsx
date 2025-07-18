import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import theme from './theme'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>,
)

// Hook global para capturar todos os logs do console.log e enviar para o backend
const originalLog = console.log;
console.log = function (...args) {
  originalLog.apply(console, args);
  try {
    fetch('http://localhost:8000/frontend-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') })
    });
  } catch (e) { }
};
