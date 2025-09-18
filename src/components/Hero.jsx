// src/components/Hero.jsx
import poster from '@/assets/img/hero.jpg'
import videoSrc from '@/assets/img/video.mp4'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Building2, ShieldCheck } from 'lucide-react'

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
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Gestão completa para Funerárias
          </h1>
          <p className="mt-4 text-lg muted">
            Reduza inadimplência, acelere vendas e ofereça experiências digitais integradas.
            O ecossistema Progem eleva sua operação ao próximo nível.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a href="/demo" className="btn btn-primary">Solicitar Demonstração</a>
            <a href="/planos" className="btn btn-ghost">Ver Planos</a>
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

            <div className="card p-4 flex items-center gap-3 lg:col-span-1 sm:col-span-2 lg:col-span-1">
              <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                <ShieldCheck className="w-5 h-5 text-[color:var(--c-muted)]" />
              </span>
              <div>
                <div className="font-semibold leading-tight">SLA médio 99,9%</div>
                <div className="muted text-[13px]">Disponibilidade para operações críticas</div>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{opacity:0, y:20}}
          whileInView={{opacity:1, y:0}}
          transition={{duration:.6}}
          viewport={{once:true}}
          className="rounded-xl2 border border-[var(--c-border)] overflow-hidden bg-[var(--c-surface-2)]"
        >
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
            <img src={poster} alt="Painéis Progem" className="w-full h-full object-cover"/>
          )}
        </motion.div>
      </div>
    </section>
  )
}
