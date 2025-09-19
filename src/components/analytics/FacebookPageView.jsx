// src/components/analytics/FacebookPageView.jsx
import { useEffect } from "react"
import { useLocation } from "react-router-dom"

/**
 * Dispara 'PageView' do Meta Pixel a cada mudança de rota.
 * Requer que o Pixel já esteja inicializado no App.
 */
export default function FacebookPageView() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "PageView")
    }
  }, [pathname, search])

  return null
}
