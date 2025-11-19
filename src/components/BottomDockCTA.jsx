// src/components/BottomDockCTA.jsx
import { useEffect, useState, useMemo } from "react"
import { createPortal } from "react-dom"
import { Link, useLocation } from "react-router-dom"
import { Smartphone, LayoutGrid } from "lucide-react"
import { track } from "@/lib/analytics"
import useFacebookPixel from "@/hooks/useFacebookPixel"

export default function BottomDockCTA({
  label = "Falar com especialista",   // ← mais curto
  to = "/demo",
  secondaryLabel = "Ver planos",
  secondaryTo = "/planos",
  hideOnRoutes = ["/contato"],
}) {
  const { pathname } = useLocation()
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { track: fbTrack } = useFacebookPixel()

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const apply = () => setIsMobile(mq.matches)
    apply()
    mq.addEventListener("change", apply)
    return () => mq.removeEventListener("change", apply)
  }, [])

  const hidden = useMemo(() => new Set(hideOnRoutes), [hideOnRoutes])
  const shouldShow = mounted && isMobile && !hidden.has(pathname)

  const handlePrimaryClick = () => {
    track?.("dock_cta_click", { route: pathname })
    fbTrack?.("Lead", {
      content_name: "BottomDockCTA - Demo/Contato",
      content_category: "Contato Comercial",
      origin: "bottom-dock",
      route: pathname,
      value: 0,
      currency: "BRL",
    })
  }

  const handleSecondaryClick = () => {
    track?.("dock_plans_click", { route: pathname })
    fbTrack?.("ViewContent", {
      content_name: "BottomDockCTA - Planos",
      content_category: "Planos",
      origin: "bottom-dock",
      route: pathname,
      value: 0,
      currency: "BRL",
    })
  }

  if (!shouldShow) return null

  return createPortal(
    <div className="fixed inset-x-0 bottom-0 z-[120] md:hidden pointer-events-none" aria-hidden={false}>
      <div className="mx-auto max-w-7xl px-4 pb-[env(safe-area-inset-bottom)] pointer-events-auto">
        <div className="rounded-t-2xl border border-b-0 border-[var(--c-border)] bg-[var(--c-surface)] shadow-2xl p-3 flex gap-2">
          {/* Primário: Falar com especialista (agora primeiro) */}
         {/* Primário: Falar com especialista */}
          <Link
            to={to}
            data-cta="bottom-demo"
            className="btn btn-primary btn-demo flex-1 justify-center whitespace-nowrap text-[0.78rem]"
            onClick={handlePrimaryClick}
            aria-label="Falar com um especialista"
          >
            <Smartphone className="w-4 h-4" />
            {label}
          </Link>

          {/* Secundário: Ver planos */}
          <Link
            to={secondaryTo}
            className="btn btn-ghost flex-1 justify-center whitespace-nowrap text-[0.78rem]"
            data-cta="bottom-plans"
            onClick={handleSecondaryClick}
            aria-label={secondaryLabel}
          >
            <LayoutGrid className="w-4 h-4" />
            {secondaryLabel}
          </Link>

        </div>
      </div>
    </div>,
    document.body
  )
}
