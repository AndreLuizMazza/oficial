// src/layouts/PageTransitionLayout.jsx
import { Outlet, useLocation, ScrollRestoration } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

/** mude aqui: 'slide' | 'zoom' | 'blur' | 'wipe' */
const EFFECT = 'slide'

const makeVariants = (reduce) => ({
  slide: {
    initial: { opacity: 0, y: reduce ? 0 : 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
    exit:    { opacity: 0, y: reduce ? 0 : -14, transition: { duration: 0.18, ease: 'easeIn' } },
  },
  zoom: {
    initial: { opacity: 0, scale: reduce ? 1 : 0.985 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.22 } },
    exit:    { opacity: 0, scale: reduce ? 1 : 0.985, transition: { duration: 0.18 } },
  },
  blur: {
    initial: { opacity: 0, filter: reduce ? 'blur(0px)' : 'blur(6px)' },
    animate: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.22 } },
    exit:    { opacity: 0, filter: reduce ? 'blur(0px)' : 'blur(6px)', transition: { duration: 0.18 } },
  },
  wipe: {
    initial: { clipPath: 'inset(0 0 100% 0)' },
    animate: { clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
    exit:    { clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } },
  },
})

export default function PageTransitionLayout(){
  const location = useLocation()
  const reduce = useReducedMotion()
  const variants = makeVariants(reduce)[EFFECT]
  const showBackdrop = EFFECT === 'wipe'

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          style={{ willChange: 'transform, opacity, filter, clip-path' }}
        >
          <Outlet/>
        </motion.div>
      </AnimatePresence>

      {showBackdrop && (
        <div aria-hidden className="fixed inset-0 -z-10 bg-[var(--c-bg)] pointer-events-none" />
      )}

      <ScrollRestoration />
    </>
  )
}
