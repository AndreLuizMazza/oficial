// src/components/MegaMenu.jsx
import { Link } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { useLayoutEffect, useEffect, useRef, useState } from 'react'
import {
  ShieldCheck,
  CreditCard,
  Users,
  Globe,
  Handshake,
  BadgeDollarSign,
  Wand2,
  BarChart3,
  Newspaper
} from 'lucide-react'

const cols = [
  {
    title: 'Soluções',
    items: [
      {
        icon: ShieldCheck,
        label: 'Gestão Recorrente',
        desc: 'Contratos, assinaturas, carnês/boletos e cobranças.',
        to: '/funcionalidades#contratos',
      },
      {
        icon: CreditCard,
        label: 'Pagamentos',
        desc: 'Cartão, Pix, Boleto, conciliação e baixa automática.',
        to: '/funcionalidades#vendas',
      },
      {
        icon: Users,
        label: 'App do Vendedor',
        desc: 'Leads, propostas e fechamento de contratos.',
        to: '/solucoes#app-vendedor',
      },
      {
        icon: BadgeDollarSign,
        label: 'App do Cobrador',
        desc: 'Rota, baixa de pagamentos e recibos digitais.',
        to: '/solucoes#app-cobrador',
      },
    ],
  },
  {
    title: 'Clube & Integrações',
    items: [
      {
        icon: Handshake,
        label: 'Clubes de Benefícios',
        desc: 'Monte sua rede local de parceiros e descontos ou conecte com plataformas de Clubes de Descontos.',
        to: '/solucoes#clubes',
      },
      {
        icon: Newspaper,
        label: 'Obituário Digital',
        desc: 'Memorial com homenagens e captação de leads.',
        // 🔗 externo em nova aba
        href: 'https://nalapide.com/',
      },
      {
        icon: BarChart3,
        label: 'Analytics',
        desc: 'KPIs, inadimplência e relatórios executivos.',
        to: '/funcionalidades#analytics',
      },
    ],
  },
  {
    title: 'Recursos',
    items: [
      {
        icon: Globe,
        label: 'Site Premium (Whitelabel)',
        desc: 'SEO, domínio próprio e identidade visual da sua marca.',
        to: '/solucoes#site',
      },
      {
        icon: Users,
        label: 'App do Associado (Whitelabel)',
        desc: '2ª via, pagamentos, extratos, notificações e Carteirinha Digital.',
        to: '/solucoes#app-associado',
      },
      {
        icon: Wand2,
        label: 'Personalizações',
        desc: 'Temas, telas e integrações sob medida.',
        to: '/solucoes#custom',
      },
      {
        icon: Globe,
        label: 'Docs & APIs',
        desc: 'API Oficial Progem + NaLápide + Clubes de Descontos.',
        // 🔗 externo em nova aba
        href: 'https://sandbox-api.progem.com.br/docs/index.html',
      },
    ],
  },
]

export default function MegaMenu({ anchorRef, onClose }) {
  const [style, setStyle] = useState({ top: 72 })
  const closeTimer = useRef(null)

  // Posiciona logo abaixo do gatilho
  useLayoutEffect(() => {
    const el = anchorRef?.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const margin = 12
    setStyle({ top: Math.round(r.bottom + margin) })
  }, [anchorRef])

  // Fecha com ESC
  useEffect(() => {
    const onEsc = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [onClose])

  const startClose = () => { closeTimer.current = setTimeout(() => onClose?.(), 120) }
  const cancelClose = () => { if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null } }

  const menu = (
    <div className="fixed inset-0 z-[60]" onClick={onClose}>
      {/* backplate para clique-fora */}
      <div className="fixed inset-0" />
      {/* painel do mega */}
      <div
        className="fixed left-1/2 -translate-x-1/2"
        style={style}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={cancelClose}
        onMouseLeave={startClose}
        role="menu"
        aria-label="Navegação expandida"
      >
        <div className="w-[min(1000px,95vw)] rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] shadow-2xl p-5 grid md:grid-cols-3 gap-6">
          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-xs uppercase tracking-wide text-[color:var(--c-muted)] mb-2">{c.title}</div>
              <ul className="space-y-2">
                {c.items.map((it) => {
                  const Icon = it.icon
                  const common =
                    "flex items-start gap-3 rounded-xl p-2.5 hover:bg-[var(--c-surface-2)]"

                  return (
                    <li key={it.label}>
                      {it.href ? (
                        // Externo em nova aba
                        <a
                          href={it.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={common}
                          onClick={onClose}
                        >
                          <span className="mt-0.5 inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[var(--c-border)]">
                            <Icon className="w-4 h-4 text-[color:var(--c-muted)]" />
                          </span>
                          <span className="min-w-0">
                            <div className="text-sm font-medium leading-5">{it.label}</div>
                            <div className="text-[13px] leading-5 text-[color:var(--c-muted)] line-clamp-2">
                              {it.desc}
                            </div>
                          </span>
                        </a>
                      ) : (
                        // Interno (SPA)
                        <Link
                          to={it.to}
                          className={common}
                          onClick={onClose}
                        >
                          <span className="mt-0.5 inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[var(--c-border)]">
                            <Icon className="w-4 h-4 text-[color:var(--c-muted)]" />
                          </span>
                          <span className="min-w-0">
                            <div className="text-sm font-medium leading-5">{it.label}</div>
                            <div className="text-[13px] leading-5 text-[color:var(--c-muted)] line-clamp-2">
                              {it.desc}
                            </div>
                          </span>
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return createPortal(menu, document.body)
}
