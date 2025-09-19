// src/components/Header.jsx
import { useRef, useState, useEffect } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import MegaMenu, { cols as megaCols } from "@/components/MegaMenu"
import ThemeSwitch from "@/components/ThemeSwitch"
import useFocusTrap from "@/hooks/useFocusTrap"
import logo from "@/assets/img/logo.png"

function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = original }
  }, [locked])
}

const nav = [
  { label: "Soluções", type: "mega" },
  { label: "Planos", to: "/planos" },
  { label: "Clientes", to: "/clientes" },
  { label: "Quem somos", to: "/quem-somos" }, // ✅ adicionado ao header
  { label: "Blog", to: "/blog" },
  { label: "Contato", to: "/contato" },
]

export default function Header() {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileSectionsOpen, setMobileSectionsOpen] = useState(() => ({}))
  const [isMobile, setIsMobile] = useState(false)

  const megaBtnRef = useRef(null)
  const mobileToggleRef = useRef(null)
  const mobileDrawerRef = useRef(null)

  const reduce = useReducedMotion()

  // detecta mobile
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const apply = () => setIsMobile(mq.matches)
    apply()
    mq.addEventListener("change", apply)
    return () => mq.removeEventListener("change", apply)
  }, [])

  // fecha ao navegar
  useEffect(() => { setMegaOpen(false); setMobileOpen(false) }, [pathname])

  // trava body no drawer e no mega mobile
  useLockBodyScroll(mobileOpen || (megaOpen && isMobile))

  // focus trap no drawer
  useFocusTrap(mobileDrawerRef, {
    initialFocus: (container) =>
      container.querySelector('a,button,[tabindex]:not([tabindex="-1"])'),
    returnFocusEl: mobileToggleRef.current || null,
    enabled: mobileOpen,
  })

  const linkCls = (isActive) =>
    [
      "px-3 py-2 rounded-lg text-sm transition",
      "hover:bg-[var(--c-surface-2)] focus:bg-[var(--c-surface-2)] focus:outline-none",
      isActive ? "bg-[var(--c-surface-2)] ring-1 ring-[color:var(--c-primary)]" : ""
    ].join(" ")

  // Mega ativo quando usuário navega por produtos/recursos/integr.
  const megaActive =
    pathname.startsWith("/site-premium") ||
    pathname.startsWith("/funcionalidades") ||
    pathname.startsWith("/solucoes") ||
    pathname.startsWith("/migracao") ||
    pathname.startsWith("/app-associado") ||
    pathname.startsWith("/app-vendedor") ||
    pathname.startsWith("/app-cobrador") ||
    pathname.includes("planos-pet")

  const toggleMobileSection = (title) =>
    setMobileSectionsOpen((s) => ({ ...s, [title]: !s[title] }))

  // animações
  const drawerVariants = {
    hidden: { opacity: 0, y: reduce ? 0 : -10 },
    visible:{ opacity: 1, y: 0 },
    exit:   { opacity: 0, y: reduce ? 0 : -10 }
  }
  const overlayVariants = { hidden:{opacity:0}, visible:{opacity:1}, exit:{opacity:0} }
  const triggerVariants = {
    initial: { opacity: 1, scale: 1 },
    open:    { opacity: 1, scale: reduce ? 1 : 0.98 },
    closed:  { opacity: 1, scale: 1 },
  }
  const chevronVariants = { closed:{rotate:0}, open:{rotate:180} }
  const triggerT = { type: "spring", stiffness: 520, damping: 34, mass: 0.6 }
  const t = { type: 'spring', stiffness: 420, damping: 34, mass: 0.6 }

  // micro-anim para itens do drawer
  const drawerItemAnim = (active) => ({
    initial: false,
    animate: { scale: active && !reduce ? 0.98 : 1 },
    whileTap: reduce ? {} : { scale: 0.98 },
    transition: { type: 'spring', stiffness: 520, damping: 32, mass: 0.55 }
  })

  return (
    <header className="sticky top-0 z-[70] border-b border-[var(--c-border)] bg-[var(--c-surface)]/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 h-[64px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="Progem" className="h-6 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {nav.map((item) => {
            if (item.type === "mega") {
              return (
                <motion.button
                  key={item.label}
                  ref={megaBtnRef}
                  className={[
                    linkCls(megaActive),
                    megaOpen ? "ring-1 ring-[color:var(--c-primary)] bg-[var(--c-surface-2)]" : ""
                  ].join(" ")}
                  aria-haspopup="menu"
                  aria-expanded={megaOpen}
                  aria-controls="mega-menu"
                  onClick={() => setMegaOpen((v) => !v)}
                  variants={triggerVariants}
                  initial="initial"
                  animate={megaOpen ? "open" : "closed"}
                  transition={triggerT}
                >
                  <span className="inline-flex items-center gap-1">
                    {item.label}
                    <motion.span
                      className="inline-flex"
                      variants={chevronVariants}
                      animate={megaOpen ? "open" : "closed"}
                      transition={{ type: "tween", duration: 0.18 }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.span>
                  </span>
                </motion.button>
              )
            }
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) => linkCls(isActive)}
                aria-current={({ isActive }) => (isActive ? "page" : undefined)}
              >
                {item.label}
              </NavLink>
            )
          })}

          <div className="ml-2 hidden lg:block">
            <ThemeSwitch />
          </div>
          {/* Login (desktop) */}
          <a href="https://app.progem.com.br/progem/Login.xhtml" className="ml-2 btn btn-ghost">Login</a>
        </nav>

        {/* Mobile toggles */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeSwitch compact />
          <button
            ref={mobileToggleRef}
            className="p-2 rounded-lg hover:bg-[var(--c-surface-2)]"
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer + overlay animados */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="drawer-overlay"
              className="md:hidden fixed inset-0 z-[65]"
              initial="hidden" animate="visible" exit="exit"
              variants={overlayVariants} transition={{ duration: 0.12 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              key="drawer-panel"
              ref={mobileDrawerRef}
              className="md:hidden border-t border-[var(--c-border)] bg-[var(--c-surface)] shadow-xl z-[66] relative"
              role="dialog" aria-modal="true" aria-label="Menu"
              initial="hidden" animate="visible" exit="exit"
              variants={drawerVariants} transition={t}
            >
              <nav className="px-4 py-3">
                {/* Soluções (acordeão) */}
                <motion.button
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[var(--c-surface-2)]"
                  onClick={() => toggleMobileSection("Soluções")}
                  aria-expanded={!!mobileSectionsOpen["Soluções"]}
                  whileTap={reduce ? {} : { scale: 0.98 }}
                  transition={triggerT}
                >
                  <span className="text-sm font-medium">Soluções</span>
                  <ChevronRight className={`w-4 h-4 transition ${mobileSectionsOpen["Soluções"] ? "rotate-90" : ""}`} />
                </motion.button>

                {mobileSectionsOpen["Soluções"] && (
                  <div className="pl-2 py-1">
                    {megaCols.map((col) => (
                      <div key={col.title} className="mb-2">
                        <div className="text-[11px] uppercase tracking-wide text-[color:var(--c-muted)] px-3 mt-2">{col.title}</div>
                        <ul className="mt-1">
                          {col.items.map((it) => {
                            const Icon = it.icon
                            const base = "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--c-surface-2)]"
                            const Content = ({ children }) => (
                              <motion.div
                                {...drawerItemAnim(false)}
                                className={base}
                              >
                                {children}
                              </motion.div>
                            )
                            return (
                              <li key={it.label}>
                                {it.href ? (
                                  <a href={it.href} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)}>
                                    <Content>
                                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[var(--c-border)]">
                                        <Icon className="w-4 h-4 text-[color:var(--c-muted)]" />
                                      </span>
                                      <span className="text-sm">{it.label}</span>
                                    </Content>
                                  </a>
                                ) : (
                                  <Link to={it.to} onClick={() => setMobileOpen(false)}>
                                    <Content>
                                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[var(--c-border)]">
                                        <Icon className="w-4 h-4 text-[color:var(--c-muted)]" />
                                      </span>
                                      <span className="text-sm">{it.label}</span>
                                    </Content>
                                  </Link>
                                )}
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* Demais páginas (com animação e estado ativo) */}
                <div className="mt-2 space-y-1">
                  {[
                    { label: "Planos", to: "/planos" },
                    { label: "Clientes", to: "/clientes" },
                    { label: "Quem somos", to: "/quem-somos" }, // ✅ também no mobile
                    { label: "Blog", to: "/blog" },
                    { label: "Contato", to: "/contato" },
                  ].map((item) => (
                    <NavLink
                      key={item.label}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      children={({ isActive }) => (
                        <motion.div
                          {...drawerItemAnim(isActive)}
                          className={[
                            "block px-3 py-2 rounded-lg text-sm hover:bg-[var(--c-surface-2)]",
                            isActive ? "bg-[var(--c-surface-2)] ring-1 ring-[color:var(--c-primary)]" : ""
                          ].join(" ")}
                        >
                          {item.label}
                        </motion.div>
                      )}
                    />
                  ))}
                </div>

                {/* Ações */}
                <div className="pt-3 flex gap-2">
                  <a href="https://app.progem.com.br/progem/Login.xhtml" onClick={() => setMobileOpen(false)} className="flex-1">
                    <motion.div
                      {...drawerItemAnim(false)}
                      className="btn btn-ghost w-full text-center"
                    >
                      Login
                    </motion.div>
                  </a>
                </div>

                {/* Tema */}
                <div className="pt-3">
                  <ThemeSwitch />
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MegaMenu (desktop) */}
      {megaOpen && (
        <MegaMenu
          anchorRef={megaBtnRef}
          onClose={() => setMegaOpen(false)}
        />
      )}
    </header>
  )
}
