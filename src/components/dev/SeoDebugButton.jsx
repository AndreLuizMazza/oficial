// src/components/dev/SeoDebugButton.jsx
import { useEffect, useMemo, useState } from "react"
import clsx from "clsx"

function getMeta(name) {
  return document.querySelector(`meta[name="${name}"]`)
}
function getMetaProp(prop) {
  return document.querySelector(`meta[property="${prop}"]`)
}
function getLink(rel) {
  return document.querySelector(`link[rel="${rel}"]`)
}

function ensureLen(str = "", min = 10, max = 160) {
  const len = str.trim().length
  return len >= min && len <= max
}

function runChecks() {
  const report = []

  // TITLE
  const title = document.title || ""
  report.push({
    key: "title",
    label: "Title",
    value: title || "(vazio)",
    ok: title.trim().length >= 10,
    hint: "Use pelo menos ~10 caracteres e inclua a marca."
  })

  // DESCRIPTION
  const metaDesc = getMeta("description")
  const desc = metaDesc?.getAttribute("content") || ""
  report.push({
    key: "description",
    label: "Meta Description",
    value: desc || "(ausente)",
    ok: ensureLen(desc, 40, 160),
    hint: "Ideal entre 40–160 caracteres."
  })

  // ROBOTS
  const metaRobots = getMeta("robots")
  const robots = metaRobots?.getAttribute("content") || ""
  const hasNoindex = /noindex/i.test(robots)
  const hasIndex = /index/i.test(robots)
  report.push({
    key: "robots",
    label: "Meta Robots",
    value: robots || "(ausente)",
    ok: Boolean(robots) && (hasNoindex || hasIndex),
    hint: 'Use "index, follow" para páginas públicas e "noindex, nofollow" para privadas.'
  })

  // CANONICAL
  const canonicalEl = getLink("canonical")
  const canonical = canonicalEl?.getAttribute("href") || ""
  report.push({
    key: "canonical",
    label: "Link Canonical",
    value: canonical || "(ausente)",
    ok: Boolean(canonical),
    hint: "Defina canônico nas páginas estratégicas para evitar conteúdo duplicado."
  })

  // OPEN GRAPH
  const ogTitle = getMetaProp("og:title")?.getAttribute("content") || ""
  const ogDesc = getMetaProp("og:description")?.getAttribute("content") || ""
  const ogType = getMetaProp("og:type")?.getAttribute("content") || ""
  const ogUrl = getMetaProp("og:url")?.getAttribute("content") || ""
  const ogImage = getMetaProp("og:image")?.getAttribute("content") || ""

  report.push({
    key: "og:title",
    label: "OG Title",
    value: ogTitle || "(ausente)",
    ok: ensureLen(ogTitle, 10, 70),
    hint: "Replique o Title (≤70 caracteres) com ênfase de marca."
  })
  report.push({
    key: "og:description",
    label: "OG Description",
    value: ogDesc || "(ausente)",
    ok: ensureLen(ogDesc, 40, 200),
    hint: "Resumo entre 40–200 caracteres para redes sociais."
  })
  report.push({
    key: "og:type",
    label: "OG Type",
    value: ogType || "(ausente)",
    ok: !!ogType,
    hint: 'Use "website" para páginas gerais; "article" para posts.'
  })
  report.push({
    key: "og:url",
    label: "OG URL",
    value: ogUrl || "(ausente)",
    ok: !!ogUrl,
    hint: "Defina a URL canônica completa (https://...)."
  })
  report.push({
    key: "og:image",
    label: "OG Image",
    value: ogImage || "(ausente)",
    ok: !!ogImage,
    hint: "Imagem absoluta (>=1200x630) e pesada o suficiente para preview."
  })

  // TWITTER
  const twCard = getMeta("twitter:card")?.getAttribute("content") || ""
  const twTitle = getMeta("twitter:title")?.getAttribute("content") || ""
  const twDesc = getMeta("twitter:description")?.getAttribute("content") || ""
  const twImg = getMeta("twitter:image")?.getAttribute("content") || ""

  report.push({
    key: "twitter:card",
    label: "Twitter Card",
    value: twCard || "(ausente)",
    ok: ["summary", "summary_large_image"].includes(twCard),
    hint: 'Prefira "summary_large_image" para melhor CTR.'
  })
  report.push({
    key: "twitter:title",
    label: "Twitter Title",
    value: twTitle || "(ausente)",
    ok: ensureLen(twTitle, 10, 70),
    hint: "Similar ao OG Title; evite truncar."
  })
  report.push({
    key: "twitter:description",
    label: "Twitter Description",
    value: twDesc || "(ausente)",
    ok: ensureLen(twDesc, 40, 200),
    hint: "Similar ao OG Description; evite truncar."
  })
  report.push({
    key: "twitter:image",
    label: "Twitter Image",
    value: twImg || "(ausente)",
    ok: !!twImg,
    hint: "Use a mesma imagem de OG (absoluta)."
  })

  // URL corrente
  const url = window.location.href
  report.push({ key: "url", label: "URL", value: url, ok: true })

  // eslint-disable-next-line no-console
  console.table(report.map(r => ({ Item: r.label, Valor: r.value, OK: r.ok })))
  return report
}

export default function SeoDebugButton() {
  const show = useMemo(() => {
    const force = import.meta.env?.VITE_SHOW_SEO_DEBUG === "1"
    const isProd = import.meta.env?.MODE === "production"
    return force || !isProd
  }, [])

  const [open, setOpen] = useState(false)
  const [report, setReport] = useState([])

  useEffect(() => {
    if (!show) return
    setReport(runChecks())
    const observer = new MutationObserver(() => setReport(runChecks()))
    observer.observe(document.head, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [show])

  if (!show) return null

  return (
    <div className="fixed z-[1000] bottom-4 right-4">
      <div
        className={clsx(
          "mb-2 w-[340px] rounded-xl border bg-[var(--c-surface)] shadow-xl transition-all",
          open ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-2",
          "border-[var(--c-border)]"
        )}
        role="dialog"
        aria-hidden={!open}
        aria-label="Relatório de SEO da página"
      >
        <div className="p-3 border-b border-[var(--c-border)] font-medium">Relatório de SEO</div>
        <div className="p-3 max-h-[55vh] overflow-auto text-sm">
          <ul className="space-y-2">
            {report.map((r) => (
              <li key={r.key} className="rounded-lg border border-[var(--c-border)] p-2 bg-[var(--c-surface-2)]">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{r.label}</span>
                  <span
                    className={clsx(
                      "px-2 py-0.5 text-[11px] rounded-md",
                      r.ok
                        ? "bg-emerald-100/70 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                        : "bg-amber-100/70 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                    )}
                  >
                    {r.ok ? "OK" : "Ajustar"}
                  </span>
                </div>
                <div className="mt-1 break-words text-[13px] text-[color:var(--c-muted)]">
                  {r.value || <em>(vazio)</em>}
                </div>
                {r.hint && !r.ok && (
                  <div className="mt-1 text-[12px] text-[color:var(--c-muted)]">
                    <em>Dica:</em> {r.hint}
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setReport(runChecks())}
              className="btn btn-ghost btn-sm"
              aria-label="Reexecutar verificação de SEO"
            >
              Reexecutar
            </button>
            <button
              type="button"
              onClick={async () => {
                const text = report.map(r => `${r.label}: ${r.value}`).join("\n")
                try {
                  await navigator.clipboard.writeText(text)
                  alert("Relatório copiado para a área de transferência.")
                } catch {
                  alert("Falha ao copiar. Veja o console para a tabela detalhada.")
                }
              }}
              className="btn btn-ghost btn-sm"
            >
              Copiar
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="btn btn-primary shadow-xl"
        aria-expanded={open}
        aria-controls="seo-debug-panel"
        title="Verificar SEO desta página"
      >
        Verificar SEO
      </button>
    </div>
  )
}
