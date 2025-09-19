// src/hooks/useFacebookPixel.js
import { useCallback, useMemo } from "react"

/**
 * useFacebookPixel
 * - Assume que o fbq já foi inicializado (via initFacebookPixel no App)
 * - Expõe helpers para trackear eventos
 */
export default function useFacebookPixel() {
  const isReady = useMemo(() => typeof window !== "undefined" && typeof window.fbq === "function", [])

  const track = useCallback((eventName, params) => {
    if (!isReady) return
    window.fbq("track", eventName, params)
  }, [isReady])

  const trackCustom = useCallback((eventName, params) => {
    if (!isReady) return
    window.fbq("trackCustom", eventName, params)
  }, [isReady])

  const consent = useCallback((granted) => {
    if (!isReady) return
    window.fbq("consent", granted ? "grant" : "revoke")
  }, [isReady])

  return {
    isReady,
    track,        // ex: track('Lead')
    trackCustom,  // ex: trackCustom('DownloadWhitepaper', { plan: 'Pro' })
    consent,      // ex: consent(true) / consent(false)
  }
}
