import poster from '@/assets/img/hero.jpg'
import videoSrc from '@/assets/img/video.mp4'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

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
            Gestão completa para negócios recorrentes.
          </h1>
          <p className="mt-4 text-lg muted">
        Reduza inadimplência, acelere vendas e ofereça experiências digitais integradas. O ecossistema Progem eleva sua operação ao próximo nível
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a href="/demo" className="btn btn-primary">Solicitar Demonstração</a>
            <a href="#funcionalidades" className="btn btn-ghost">Ver funcionalidades</a>
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
