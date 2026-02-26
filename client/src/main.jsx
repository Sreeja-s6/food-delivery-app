import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import StoreContextProvider from './context/StoreContext.jsx'
import ThemeContextProvider from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <StoreContextProvider>
        <ThemeContextProvider>
          <App />
        </ThemeContextProvider>
      </StoreContextProvider>
    </BrowserRouter>
  </StrictMode>,
)