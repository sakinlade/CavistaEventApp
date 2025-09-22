import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import { UserAuthContextProvider } from './context/user/user-context.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <ChakraProvider>
      <UserAuthContextProvider>
        <App />
      </UserAuthContextProvider>
    </ChakraProvider>
    </BrowserRouter>
  </StrictMode>,
)
