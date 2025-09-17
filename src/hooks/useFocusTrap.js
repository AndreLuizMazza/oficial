// src/hooks/useFocusTrap.js
import { useEffect } from "react"

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',')

export default function useFocusTrap(containerRef, {
  initialFocus = 'first', // 'first' | 'container' | (el) => HTMLElement
  returnFocusEl = null,   // HTMLElement (ex.: anchorRef.current)
  enabled = true,
} = {}) {
  useEffect(() => {
    if (!enabled) return
    const container = containerRef.current
    if (!container) return

    const focusables = () => Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR))
      .filter(el => el.offsetParent !== null || el.getClientRects().length) // visíveis

    // foco inicial
    let prevActive = document.activeElement
    const setInitialFocus = () => {
      if (typeof initialFocus === 'function') {
        const el = initialFocus(container)
        if (el) el.focus()
        return
      }
      if (initialFocus === 'container') {
        container.tabIndex = -1
        container.focus()
        return
      }
      // default: primeiro foco
      const els = focusables()
      if (els.length) els[0].focus()
      else {
        container.tabIndex = -1
        container.focus()
      }
    }

    const onKeyDown = (e) => {
      if (e.key !== 'Tab') return
      const els = focusables()
      if (!els.length) {
        e.preventDefault()
        return
      }
      const first = els[0]
      const last = els[els.length - 1]
      const current = document.activeElement

      if (e.shiftKey) {
        if (current === first || !container.contains(current)) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (current === last || !container.contains(current)) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    setInitialFocus()
    container.addEventListener('keydown', onKeyDown)

    // cleanup / retorna foco
    return () => {
      container.removeEventListener('keydown', onKeyDown)
      const back = returnFocusEl || prevActive
      if (back && typeof back.focus === 'function') {
        back.focus()
      }
    }
  }, [containerRef, initialFocus, returnFocusEl, enabled])
}
