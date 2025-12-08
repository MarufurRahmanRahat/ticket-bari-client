import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import router from './routes/Routes.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <AuthProvider>
    <RouterProvider router={router} />
    <Toaster position="top-right" />
    </AuthProvider>
  </StrictMode>,
)
