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
import Taxas from './pages/Taxas'
import QuemSomos from './pages/QuemSomos'
import GestaoWeb from './pages/GestaoWeb'
import AppDoCobradorPage from './pages/AppDoCobradorPage'
import AppDoVendedorPage from './pages/AppDoVendedorPage'
import ClubeBeneficios from './pages/ParceriasBeneficios'

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
  { path: '/taxas', element: <Taxas/> },
  { path: '/gestao-web', element: <GestaoWeb/> },
  { path: '/quem-somos', element: <QuemSomos/> },
   { path: "/site-premium", element: <SitePremium/> },
  { path: "/app-cobrador", element: <AppDoCobradorPage/> },
  { path: "/app-vendedor", element: <AppDoVendedorPage/> },
  { path: "/clube", element: <ClubeBeneficios/> },
  { path: "/app-associado", element: <AppAssociado/> }
])
