// src/hooks/useSalesShortcut.js
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function useSalesShortcut() {
  const navigate = useNavigate()

  useEffect(() => {
    function onKey(e) {
      // Ctrl + Shift + S → atalho global para o simulador
      if (e.ctrlKey && e.shiftKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault()
        navigate('/planos/simulador')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])
}
