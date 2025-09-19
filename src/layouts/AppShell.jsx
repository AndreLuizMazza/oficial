// src/layouts/AppShell.jsx
import { Outlet } from 'react-router-dom'
import Header from '@/components/Header'

export default function AppShell() {
  return (
    <>
      {/* Header fixo (fora das animações de página) */}
      <Header />
      {/* O conteúdo das rotas entra aqui; quem anima é o PageTransitionLayout lá no router */}
      <Outlet />
    </>
  )
}
