// src/components/MegaMenu.jsx
import { Link } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { useLayoutEffect, useEffect, useRef, useState } from 'react'
import {
  ShieldCheck, CreditCard, Users, Globe, Handshake,
  BadgeDollarSign, Wand2, BarChart3, Newspaper, Database,
  Building2, MessageCircle, PawPrint
} from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import useFocusTrap from '@/hooks/useFocusTrap'

/**
 * Reorganização orientada à usabilidade:
 * 1) Produtos (uso diário)
 * 2) Integrações & Automação (expansões)
 * 3) Operação & Dados (gestão)
 */
export const cols = [
  {
    title: 'Produtos',
    items: [
      { icon: ShieldCheck,      label: 'Software de Gestão',        desc: 'Contratos, assinaturas, carnês/boletos e cobranças.', to: '/gestao-web' },
      { icon: Users,            label: 'App do Associado',          desc: '2ª via, pagamentos, extratos e Carteirinha Digital.',  to: '/app-associado' },
      { icon: Users,            label: 'App do Vendedor',           desc: 'Leads, propostas e fechamento de contratos.',          to: '/app-vendedor' },
      { icon: BadgeDollarSign,  label: 'App do Cobrador',           desc: 'Rota, baixa de pagamentos e recibos digitais.',        to: '/app-cobrador' },
      { icon: PawPrint,         label: 'Planos Pet',                desc: 'Planos híbridos (família + pet) e exclusivos, com benefícios.', to: '/funcionalidades#planos-pet' },
      { icon: Globe,            label: 'Site Premium (Whitelabel)', desc: 'SEO, domínio próprio e identidade visual da sua marca.', to: '/site-premium' },
    ],
  },
  {
    title: 'Integrações & Automação',
    items: [
      { icon: MessageCircle,  label: 'WhatsApp (Automação)', desc: 'Ilimitado por R$ 150/mês. Campanhas e fluxos via API/SDK.', to: '/funcionalidades#whatsapp' },
      
       { icon: CreditCard, label: 'Pagamentos - Taxas & Cobrança',  desc: 'Pix, boletos e cartões — valores claros e atualizados.', to: '/taxas' },
      { icon: Globe,          label: 'Docs & APIs',          desc: 'API Oficial Progem + NaLápide + Clubes de Descontos.',      href: 'https://sandbox-api.progem.com.br/docs/index.html' },
      { icon: Handshake,      label: 'Clubes de Benefícios', desc: 'Monte sua rede local de parceiros e descontos.',            to: '/clube' },
      { icon: Newspaper,      label: 'Obituário Digital',    desc: 'Memorial com homenagens e captação de leads.',              href: 'https://nalapide.com/' },
    ],
  },
  {
    title: 'Operação & Dados',
    items: [
      { icon: BarChart3,  label: 'Analytics',         desc: 'KPIs, inadimplência e relatórios executivos.', to: '/funcionalidades#analytics' },
     
      { icon: Database,   label: 'Migração de Dados', desc: 'Importação de clientes, contratos, carnês/boletos e histórico.', to: '/migracao' },
      { icon: Building2,  label: 'Quem somos',        desc: 'Nossa história, missão e valores.', to: '/quem-somos' },
    ],
  },
]

export default function MegaMenu({ anchorRef, onClose }) {
  const [style, setStyle] = useState({ top: 72 })
  const [isMobile, setIsMobile] = useState(false)
  const panelRef = useRef(null)
  const closeTimer = useRef(null)
  const reduce = useReducedMotion()

  // Trap de foco + retorno ao gatilho
  useFocusTrap(panelRef, {
    initialFocus: (container) => container.querySelector('a,button,[tabindex]:not([tabindex="-1"])'),
    returnFocusEl: anchorRef?.current || null,
    enabled: true,
  })

  // Responsividade
  useLayoutEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const apply = () => setIsMobile(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  // Posiciona abaixo do botão (desktop)
  useLayoutEffect(() => {
    if (isMobile) return
    const el = anchorRef?.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setStyle({ top: Math.round(r.bottom + 12) })
  }, [anchorRef, isMobile])

  // ESC fecha
  useEffect(() => {
    const onEsc = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [onClose])

  const startClose = () => { closeTimer.current = setTimeout(() => onClose?.(), 120) }
  const cancelClose = () => { if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null } }

  // estilos base
  const itemBase = "flex items-start gap-3 rounded-xl p-3 md:p-2.5 focus:outline-none"
  const iconWrap = "mt-0.5 inline-flex items-center justify-center w-9 h-9 md:w-8 md:h-8 rounded-lg border border-[var(--c-border)]"
  const titleCls = "text-sm font-medium leading-5"
  const descCls  = "text-[13px] leading-5 text-[color:var(--c-muted)] line-clamp-2"

  // animações
  const overlayVariants = { hidden:{opacity:0}, visible:{opacity:1}, exit:{opacity:0} }
  const panelVariantsDesktop = {
    hidden:{ opacity:0, y: reduce ? 0 : -8, scale: reduce ? 1 : 0.98 },
    visible:{ opacity:1, y:0, scale:1 },
    exit:{ opacity:0, y: reduce ? 0 : -8, scale: reduce ? 1 : 0.98 }
  }
  const panelVariantsMobile = {
    hidden:{ opacity:0, y: reduce ? 0 : -10 },
    visible:{ opacity:1, y:0 },
    exit:{ opacity:0, y: reduce ? 0 : -10 }
  }
  const t = { type:'spring', stiffness:420, damping:32, mass:0.6 }

  // highlight sutil por item (hover/focus)
  const itemMotionProps = {
    whileHover: reduce ? {} : { y: -2, scale: 1.01 },
    whileFocus: reduce ? {} : { y: -2, scale: 1.01 },
    transition: { type: 'spring', stiffness: 520, damping: 34, mass: 0.55 }
  }

  // estilo do scroller mobile (momentum scroll iOS)
  const mobileScrollerStyle = isMobile ? { WebkitOverflowScrolling: 'touch' } : undefined

  const content = (
    <div className="fixed inset-0 z-[60]" onClick={onClose}>
      {/* overlay */}
      <AnimatePresence>
        <motion.div
          key="mm-overlay"
          className="fixed inset-0"
          initial="hidden" animate="visible" exit="exit"
          variants={overlayVariants} transition={{ duration: 0.12 }}
        />
      </AnimatePresence>

      {/* painel */}
      <div
        className={[
          "fixed left-1/2 -translate-x-1/2",
          isMobile
            ? "inset-x-0 left-0 translate-x-0 top-[64px] bottom-0 h-[calc(100vh-64px)] [height:calc(100dvh-64px)] overflow-y-auto"
            : ""
        ].join(' ')}
        style={isMobile ? mobileScrollerStyle : style}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={cancelClose}
        onMouseLeave={startClose}
        role="menu"
        aria-label="Navegação expandida"
      >
        <AnimatePresence>
          <motion.div
            key="mm-panel"
            ref={panelRef}
            id="mega-menu"
            className={[
              "rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] shadow-2xl",
              "w-[min(1000px,95vw)] p-5 grid gap-6 md:grid-cols-3",
              // Em mobile, deixamos o wrapper rolar; aqui só layout/padding.
              isMobile ? "w-screen max-w-none rounded-none border-t p-4 pb-6" : ""
            ].join(' ')}
            initial="hidden" animate="visible" exit="exit"
            variants={isMobile ? panelVariantsMobile : panelVariantsDesktop}
            transition={t}
          >
            {cols.map((c) => (
              <div key={c.title}>
                <div className="text-xs uppercase tracking-wide text-[color:var(--c-muted)] mb-2">{c.title}</div>
                <ul className="space-y-2">
                  {c.items.map((it) => {
                    const Icon = it.icon

                    const Card = ({ children }) => (
                      <motion.div
                        {...itemMotionProps}
                        className={`${itemBase} hover:bg-[var(--c-surface-2)] focus:bg-[var(--c-surface-2)]`}
                      >
                        {children}
                      </motion.div>
                    )

                    return (
                      <li key={it.label}>
                        {it.href ? (
                          <a href={it.href} target="_blank" rel="noopener noreferrer" onClick={onClose} role="menuitem">
                            <Card>
                              <span className={iconWrap}>
                                <Icon className="w-4 h-4 text-[color:var(--c-muted)]" />
                              </span>
                              <span className="min-w-0">
                                <div className={titleCls}>{it.label}</div>
                                <div className={descCls}>{it.desc}</div>
                              </span>
                            </Card>
                          </a>
                        ) : (
                          <Link to={it.to} onClick={onClose} role="menuitem">
                            <Card>
                              <span className={iconWrap}>
                                <Icon className="w-4 h-4 text-[color:var(--c-muted)]" />
                              </span>
                              <span className="min-w-0">
                                <div className={titleCls}>{it.label}</div>
                                <div className={descCls}>{it.desc}</div>
                              </span>
                            </Card>
                          </Link>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}
