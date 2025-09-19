// src/layouts/PageFadeLayout.jsx
import { Outlet, useLocation } from "react-router-dom"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useEffect } from "react"

const variants = {
  initial: { opacity: 0, y: 8, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -8, filter: "blur(4px)", transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } },
}

function ScrollToTopOnRoute(){
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }) }, [pathname])
  return null
}

export default function PageFadeLayout(){
  const location = useLocation()
  const reduce = useReducedMotion()

  if (reduce) {
    // Sem animação para quem prefere menos movimento
    return (
      <>
        <ScrollToTopOnRoute />
        <Outlet />
      </>
    )
  }

  return (
    <>
      <ScrollToTopOnRoute />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          style={{ willChange: "opacity, transform, filter" }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </>
  )
}
