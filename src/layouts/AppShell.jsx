// src/layouts/AppShell.jsx
import { Outlet } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SeoDebugButton from '@/components/dev/SeoDebugButton'
import useSalesShortcut from '@/hooks/useSalesShortcut'

export default function AppShell(){
  useSalesShortcut() // ⟵ habilita Ctrl+Shift+S em todo o site
  return (
    <div className="min-h-screen flex flex-col">
      <Header/>
      <main className="flex-1">
        <Outlet/>
      </main>
      <Footer/>
      <SeoDebugButton/> {/* só aparece em não-prod, ou com VITE_SHOW_SEO_DEBUG=1 */}
    </div>
  )
}
