import { Link, NavLink } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { useState, useRef } from 'react'
import ThemeToggle from '@/components/ThemeToggle'
import MegaMenu from '@/components/MegaMenu'
import logo from '@/assets/img/logo.png'

export default function Header(){
  const [open, setOpen] = useState(false)
  const [showMega, setShowMega] = useState(false)
  const triggerRef = useRef(null)

  const NavItem = ({to, children}) => (
    <NavLink to={to} className={({isActive})=>
      'px-3 py-2 rounded-lg transition ' + (isActive?'bg-[var(--c-surface-2)]':'hover:bg-[var(--c-surface-2)]')
    }>{children}</NavLink>
  )

  function toggleMega(){
    setShowMega(v => !v)
  }
  function openMega(){
    setShowMega(true)
  }
  function closeMega(){
    setShowMega(false)
  }
  function onTriggerKeyDown(e){
    // Acessível: abre com Enter/Space/ArrowDown
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown'){
      e.preventDefault()
      setShowMega(true)
    }
    // Fecha com Escape
    if (e.key === 'Escape'){
      e.preventDefault()
      setShowMega(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-[color:var(--c-surface)]/95 border-b border-[var(--c-border)] backdrop-blur supports-[backdrop-filter]:backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between relative">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Progem" className="h-7 w-auto object-contain" />
          <span className="sr-only">Progem</span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {/* Trigger MegaMenu */}
          <div className="relative">
            <button
              ref={triggerRef}
              id="nav-solutions-trigger"
              className="px-3 py-2 rounded-lg hover:bg-[var(--c-surface-2)]"
              onMouseEnter={openMega}
              onClick={toggleMega}
              onKeyDown={onTriggerKeyDown}
              aria-expanded={showMega}
              aria-haspopup="menu"
              aria-controls="megamenu-panel"
            >
              Soluções
            </button>
          </div>

          <NavItem to="/planos">Planos</NavItem>
          <NavItem to="/clientes">Clientes</NavItem>
          <NavItem to="/blog">Blog</NavItem>
          <NavItem to="/developers">Desenvolvedores</NavItem>
          <NavItem to="/contato">Contato</NavItem>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle/>
          <Link to="https://app.progem.com.br/progem/Login.xhtml" className="btn btn-ghost hidden sm:inline-flex">Login</Link>
          <button className="md:hidden btn btn-ghost" onClick={()=>setOpen(!open)} aria-label="Abrir menu"><Menu/></button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-[var(--c-border)]">
          <div className="px-4 py-3 flex flex-col gap-1">
            <NavItem to="/solucoes">Soluções</NavItem>
            <NavItem to="/planos">Planos</NavItem>
            <NavItem to="/clientes">Clientes</NavItem>
            <NavItem to="/blog">Blog</NavItem>
            <NavItem to="/developers">Desenvolvedores</NavItem>
            <NavItem to="/contato">Contato</NavItem>
            <NavItem to="/login">Login</NavItem>
          </div>
        </div>
      )}

      {/* MegaMenu via portal */}
      {showMega && (
        <MegaMenu
          anchorRef={triggerRef}
          onClose={closeMega}
          // importante: o painel já fecha ao clicar fora/ESC/mouseleave (implementado no MegaMenu)
          panelId="megamenu-panel"
        />
      )}
    </header>
  )
}
