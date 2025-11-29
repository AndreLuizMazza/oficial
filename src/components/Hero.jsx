// src/components/Hero.jsx
import poster from '@/assets/img/hero.jpg'
import videoSrc from '@/assets/img/video.mp4'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LineChart, Building2, ShieldCheck, Sparkles } from 'lucide-react'

export default function Hero(){
  const [allowMotion, setAllowMotion] = useState(true)

  // Respeita "reduzir animações" do sistema
  useEffect(()=>{
    const mql = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    const update = () => setAllowMotion(!mql?.matches)
    update()
    mql?.addEventListener?.('change', update)
    return () => mql?.removeEventListener?.('change', update)
  },[])

  return (
    <section className="relative overflow-hidden hero-grid">
      {/* Halo suave no topo */}
      <div className="hero-halo" aria-hidden />

      <div className="mx-auto max-w-7xl px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
        {/* Coluna de texto */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] text-sm">
            <Sparkles className="w-4 h-4 text-[color:var(--c-muted)]" />
            Feito para operações recorrentes
          </div>

          <h1 className="mt-3 text-4xl md:text-5xl font-bold leading-tight">
            Gestão completa  <span className="text-[var(--c-primary)]">para Funerárias</span>
          </h1>

          <p className="mt-4 text-lg muted">
            Reduza inadimplência, acelere vendas e ofereça experiências digitais integradas.
            O ecossistema Progem eleva sua operação ao próximo nível.
          </p>

          {/* CTAs padronizados */}
          <div className="mt-6 flex flex-row flex-wrap gap-3">
            <Link
              to="/demo"
              data-cta="demo"
              className="btn btn-primary btn-demo"
            >
              Agendar Demonstração
            </Link>
            <Link to="/planos" className="btn btn-primary">
              Conhecer Planos
            </Link>
          </div>

          {/* ✅ Prova social (responsiva) */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card p-4 flex items-center gap-3">
              <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                <LineChart className="w-5 h-5 text-[color:var(--c-muted)]" />
              </span>
              <div>
                <div className="font-semibold leading-tight">R$ 5 mi+ processados/mês</div>
                <div className="muted text-[13px]">Pagamentos recorrentes com escala</div>
              </div>
            </div>

            <div className="card p-4 flex items-center gap-3">
              <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                <Building2 className="w-5 h-5 text-[color:var(--c-muted)]" />
              </span>
              <div>
                <div className="font-semibold leading-tight">Foco no setor funerário</div>
                <div className="muted text-[13px]">Desde 2019 atendendo o segmento</div>
              </div>
            </div>

            <div className="card p-4 flex items-center gap-3 sm:col-span-2 lg:col-span-1">
              <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                <ShieldCheck className="w-5 h-5 text-[color:var(--c-muted)]" />
              </span>
              <div>
                <div className="font-semibold leading-tight">SLA médio 99,9%</div>
                <div className="muted text-[13px]">Disponibilidade para operações críticas</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Coluna de mídia */}
        <motion.div
          initial={{opacity:0, y:20}}
          whileInView={{opacity:1, y:0}}
          transition={{duration:.6}}
          viewport={{once:true, amount: 0.3}}
          className="relative rounded-2xl border border-[var(--c-border)] overflow-hidden bg-[var(--c-surface-2)] aspect-video"
        >
          {/* Scrim sutil para legibilidade da borda */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(80% 60% at 50% 10%, transparent 0%, transparent 60%, color-mix(in oklab, var(--c-border) 40%, transparent) 100%)"
            }}
          />
          {/* Vídeo com poster e fallback automático */}
          {allowMotion ? (
            <video
              src={videoSrc}
              poster={poster}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <img src={poster} alt="Painéis e módulos do Progem em uso" className="w-full h-full object-cover" loading="lazy" />
          )}
        </motion.div>
      </div>
    </section>
  )
}
