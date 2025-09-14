import { createBrowserRouter } from 'react-router-dom'
import Home from '@/pages/Home'
import Developers from '@/pages/Developers'
import Clientes from '@/pages/Clientes'
import Planos from './pages/Planos'
import Contato from './pages/Contato'
import Demo from './pages/Demo'
import Blog from "@/pages/Blog"
import BlogPost from "@/pages/BlogPost"
import Migracao from './pages/Migracao'
import AppAssociado from './pages/AppAssociado'
import SitePremium from './pages/SitePremium'

export const router = createBrowserRouter([
  { path: '/', element: <Home/> },
  { path: '/funcionalidades', element: <Home/> },
  { path: '/planos', element: <Planos/> },
  { path: '/clientes', element: <Clientes/> },
  { path: '/blog', element: <Blog/> },
  { path: '/contato', element: <Contato/> },
    { path: "/demo", element: <Demo/> }, 
  { path: "/blog/:id", element: <BlogPost/> },
   { path: "/migracao", element: <Migracao/> },
  { path: '/developers', element: <Developers/> },
   { path: "/site-premium", element: <SitePremium/> },
  { path: "/app-associado", element: <AppAssociado/> }
])
