// src/components/BottomDockCTA.jsx
import { useEffect, useState, useMemo } from "react"
import { createPortal } from "react-dom"
import { Link, useLocation } from "react-router-dom"
import { Smartphone, MessageSquare } from "lucide-react"
import { track } from "@/lib/analytics"

// WhatsApp opcional (E.164, sem +)
const WHATSAPP_E164 = "554699011022"

export default function BottomDockCTA({
  label = "Falar com um especialista",
  to = "/contato",
  showWhatsApp = true,
  whatsappHref = `https://wa.me/${WHATSAPP_E164}`,
  hideOnRoutes = ["/contato"], // rotas onde o dock não aparece
}) {
  const { pathname } = useLocation()
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

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

  if (!shouldShow) return null

  return createPortal(
    <div
      className="fixed inset-x-0 bottom-0 z-[120] md:hidden pointer-events-none"
      aria-hidden={false}
    >
      <div className="mx-auto max-w-7xl px-4 pb-[env(safe-area-inset-bottom)] pointer-events-auto">
        <div className="rounded-t-2xl border border-b-0 border-[var(--c-border)] bg-[var(--c-surface)] shadow-2xl p-3 flex gap-2">
          <Link
            to={to}
            data-cta="demo"
            className="btn btn-primary btn-demo flex-1 justify-center"
            onClick={() => track?.("dock_cta_click", { route: pathname })}
            aria-label={label}
          >
            <Smartphone className="w-4 h-4" />
            {label}
          </Link>

          {showWhatsApp && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
              onClick={() => track?.("dock_whatsapp_click", { route: pathname })}
              aria-label="Conversar no WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
