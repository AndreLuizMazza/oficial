// src/components/ProductStrip.jsx
import { ArrowRight, Smartphone, MessageCircle, BadgePercent, PawPrint, HeartHandshake, Globe } from "lucide-react"
import { Link } from "react-router-dom"

export default function ProductStrip({
  title = "Conheça também",
  subtitle = "apps, zap, clube e pet — a experiência completa",
}) {
  return (
    <section className="mb-6">
      <div className="card p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-sm uppercase tracking-wide text-[color:var(--c-muted)]">{title}</div>
            <h2 className="text-xl md:text-2xl font-semibold mt-1">{subtitle}</h2>
          </div>
          <Link to="/planos" className="btn btn-ghost">Ver planos</Link>
        </div>

        {/* 3x2 no desktop (6 cards) */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          <PromoCard
            icon={Smartphone}
            title="apps (visão geral)"
            desc="associado, vendedor e cobrador — iOS/Android whitelabel."
            to="/apps"
            pill="whitelabel"
          />
          <PromoCard
            icon={MessageCircle}
            title="whatsapp (automação)"
            desc="ilimitado por R$ 150/mês. campanhas e fluxos automáticos no WhatsApp."
            to="/zap"
            pill="conversas"
          />
          <PromoCard
            icon={BadgePercent}
            title="clube de benefícios"
            desc="monte sua rede local de parceiros e descontos."
            to="/clube"
            pill="fidelização"
          />
          <PromoCard
            icon={PawPrint}
            title="planos pet"
            desc="planos híbridos (família + pet) e exclusivos, com benefícios."
            to="/pet"
            pill="novo"
          />
          <PromoCard
            icon={Globe}
            title="site premium (whitelabel)"
            desc="SEO, domínio próprio e identidade visual da sua marca."
            to="/site-premium"
            pill="whitelabel"
          />
          <PromoCard
            icon={HeartHandshake}
            title="obituário digital"
            desc="memorial com homenagens e captação de leads."
            href="https://nalapide.com/"
            external
            pill="NaLápide"
          />
        </div>
      </div>
    </section>
  )
}

function PromoCard({ icon:Icon, title, desc, to, href, pill, external=false }) {
  const content = (
    <article className="group card p-6 hover:shadow-md transition-shadow h-full flex flex-col justify-between">
      <div className="flex items-start gap-3">
        <span className="inline-flex w-11 h-11 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
          <Icon className="w-5 h-5 text-[color:var(--c-muted)]" />
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="font-semibold">{title}</div>
            {pill && (
              <span className="text-xs px-2 py-0.5 rounded-md bg-[var(--c-surface-2)] border border-[var(--c-border)]">
                {pill}
              </span>
            )}
          </div>
          <p className="muted text-sm mt-1">{desc}</p>
        </div>
      </div>
      <ArrowRight className="w-4 h-4 opacity-60 mt-4 self-end group-hover:translate-x-0.5 transition-transform" />
    </article>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }
  return <Link to={to}>{content}</Link>
}
