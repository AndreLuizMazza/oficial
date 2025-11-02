// src/components/PrivateGate.jsx
import { useEffect, useMemo, useState } from "react"

const STORAGE_KEY = "progem.salespass.v2"     // mude a versão (v2, v3...) para invalidar sessões antigas
const DFLT_TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30 dias

function readSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data?.exp || Date.now() > data.exp) return null
    if (data.host && data.host !== window.location.host) return null
    return data
  } catch { return null }
}

function saveSession({ remember, ttl = DFLT_TTL_MS }) {
  const payload = {
    v: 2,
    host: window.location.host,
    exp: Date.now() + ttl
  }
  const s = JSON.stringify(payload)
  if (remember) localStorage.setItem(STORAGE_KEY, s)
  else sessionStorage.setItem(STORAGE_KEY, s)
}

export function clearPrivateSession(){
  try {
    localStorage.removeItem(STORAGE_KEY)
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {}
}

export default function PrivateGate({ children }) {
  const [ok, setOk] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [remember, setRemember] = useState(true)
  const [input, setInput] = useState("")

  const pass = useMemo(() => (import.meta.env?.VITE_PRICING_PASSPHRASE || "").trim(), [])

  useEffect(() => {
    const s = readSession()
    setOk(Boolean(s))
    setLoading(false)
  }, [])

  useEffect(() => {
    // também aceita ?key= na URL (útil para acesso rápido interno)
    const url = new URL(window.location.href)
    const key = url.searchParams.get("key")
    if (!key) return
    if (pass && key === pass) {
      saveSession({ remember: true })
      setOk(true)
      setError("")
      url.searchParams.delete("key")
      window.history.replaceState({}, "", url.toString())
    }
  }, [pass])

  if (!pass) {
    // Sem passphrase definida em env -> não bloqueia
    return children
  }

  if (loading) return null

  if (ok) return children

  return (
    <div className="min-h-[50vh] w-full flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-5 shadow-sm">
        <h1 className="text-lg font-semibold">Área de Vendas</h1>
        <p className="muted text-sm mt-1">
          Esta área é restrita ao time. Informe a senha para continuar.
        </p>

        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault()
            if (!pass) return
            if ((input || "").trim() === pass) {
              saveSession({ remember })
              setOk(true)
              setError("")
            } else {
              setError("Senha inválida. Tente novamente.")
            }
          }}
        >
          <div>
            <label className="text-sm font-medium">Senha</label>
            <input
              type="password"
              value={input}
              onChange={(e)=>setInput(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)] px-3 py-2"
              placeholder="••••••••"
              autoFocus
            />
          </div>

          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e)=>setRemember(e.target.checked)}
              className="rounded-md border border-[var(--c-border)]"
            />
            Manter acesso por 30 dias neste navegador
          </label>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="pt-2 flex gap-2">
            <button type="submit" className="btn btn-primary w-full">Entrar</button>
          </div>

          <div className="mt-2 text-[11px] text-[color:var(--c-muted)]">
            Dica: você também pode usar <code>?key=SUASENHA</code> na URL para liberar rapidamente.
          </div>
        </form>
      </div>
    </div>
  )
}
