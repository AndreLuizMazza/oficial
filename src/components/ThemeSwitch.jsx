import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

const BTN =
  "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm border border-[var(--c-border)] hover:bg-[var(--c-surface-2)]"

function applyTheme(mode) {
  const root = document.documentElement
  root.classList.toggle("dark", mode === "dark")
  localStorage.setItem("theme", mode)
}

export default function ThemeSwitch({ compact = false }) {
  const [mode, setMode] = useState(() => localStorage.getItem("theme") || "light")

  useEffect(() => {
    applyTheme(mode)
  }, [mode])

  if (compact) {
    // alterna apenas entre claro <-> escuro
    const toggle = () => setMode((m) => (m === "light" ? "dark" : "light"))
    const Icon = mode === "light" ? Sun : Moon
    return (
      <button
        className="p-2 rounded-lg border border-[var(--c-border)] hover:bg-[var(--c-surface-2)]"
        onClick={toggle}
        title={`Tema: ${mode}`}
        aria-label={`Alternar tema (atual: ${mode})`}
      >
        <Icon className="w-4 h-4" />
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <button className={BTN} onClick={() => setMode("light")} aria-pressed={mode==="light"}>
        <Sun className="w-4 h-4" /> Claro
      </button>
      <button className={BTN} onClick={() => setMode("dark")} aria-pressed={mode==="dark"}>
        <Moon className="w-4 h-4" /> Escuro
      </button>
    </div>
  )
}
