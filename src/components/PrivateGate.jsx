// src/components/PrivateGate.jsx
import { useEffect, useState } from "react"
import { setPageSEO } from "@/lib/seo"

const PASS_ENV = import.meta.env.VITE_PRICING_PASSPHRASE || ""

export default function PrivateGate({ children }) {
  const [ok, setOk] = useState(false)
  const [input, setInput] = useState("")

  useEffect(() => {
    setPageSEO({ noindex: true }) // reforço de noindex
    const cached = localStorage.getItem("progem.pricing_gate_ok") === "1"
    if (cached) setOk(true)
  }, [])

  if (ok) return children

  const submit = (e) => {
    e.preventDefault()
    if (!PASS_ENV) { 
      console.warn("VITE_PRICING_PASSPHRASE não configurado; liberando acesso de desenvolvimento.")
      setOk(true)
      return
    }
    if (input === PASS_ENV) {
      localStorage.setItem("progem.pricing_gate_ok", "1")
      setOk(true)
    } else {
      alert("Senha incorreta.")
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <form onSubmit={submit} className="card p-6 w-full max-w-sm">
        <h2 className="text-xl font-semibold">Acesso restrito</h2>
        <p className="muted text-sm mt-1">Digite a senha de vendas para abrir o simulador.</p>
        <input
          type="password"
          className="mt-4 w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)] px-3 py-2"
          placeholder="Senha"
          value={input}
          onChange={(e)=>setInput(e.target.value)}
        />
        <button className="btn btn-primary mt-3 w-full" type="submit">Entrar</button>
        <p className="muted text-xs mt-2">Defina <code>VITE_PRICING_PASSPHRASE</code> no ambiente.</p>
      </form>
    </div>
  )
}
