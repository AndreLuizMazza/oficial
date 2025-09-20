import { useEffect, useRef, useState } from "react";
import { Sun, Moon, Clock, Monitor } from "lucide-react";
import { getStoredMode, setThemeMode, computeAutoMode } from "@/lib/theme";

export default function ThemeSwitch({ variant = "iconMenu" }) {
  const [mode, setMode] = useState(() => getStoredMode());           // "light" | "dark" | "auto" | "system"
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => { setThemeMode(mode); }, [mode]);

  // fecha ao clicar fora
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => { if (!wrapRef.current?.contains(e.target)) setOpen(false); };
    const onEsc = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const Icon = mode === "light" ? Sun : mode === "dark" ? Moon : mode === "system" ? Monitor : Clock;
  const autoNow = computeAutoMode(); // "light" | "dark"
  const label =
    mode === "light" ? "Tema claro" :
    mode === "dark"  ? "Tema escuro" :
    mode === "system"? "Tema do sistema" :
                       `Tema automático (${autoNow === "dark" ? "escuro" : "claro"} agora)`;

  if (variant !== "iconMenu") {
    // fallback: botão que CICLA (ainda mais enxuto, sem menu)
    const cycle = () =>
      setMode((m) => (m === "light" ? "auto" : m === "auto" ? "dark" : m === "dark" ? "system" : "light"));
    return (
      <button
        className="p-2 rounded-lg border border-[var(--c-border)] hover:bg-[var(--c-surface-2)]"
        onClick={cycle}
        aria-label={`${label} — toque para alternar`}
        title={`${label} — clique para alternar`}
      >
        <Icon className="w-4 h-4" />
      </button>
    );
  }

  // Variante recomendada: ícone + POPOVER (super compacto e direto)
  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        className="p-2 rounded-lg border border-[var(--c-border)] hover:bg-[var(--c-surface-2)]"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${label} — abrir menu de tema`}
        title={label}
      >
        <Icon className="w-4 h-4" />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Selecionar tema"
          className="absolute right-0 mt-2 w-44 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)] shadow-xl overflow-hidden z-[80]"
        >
          {[
            { id: "light",  label: "Claro",   icon: Sun },
            { id: "auto",   label: `Automático (${autoNow === "dark" ? "escuro" : "claro"})`, icon: Clock },
            { id: "dark",   label: "Escuro",  icon: Moon },
            { id: "system", label: "Sistema", icon: Monitor },
          ].map(({ id, label, icon: I }) => {
            const active = mode === id;
            return (
              <button
                key={id}
                role="menuitemradio"
                aria-checked={active}
                onClick={() => { setMode(id); setOpen(false); }}
                className={[
                  "w-full flex items-center gap-2 px-3 py-2 text-sm text-left",
                  active ? "bg-[var(--c-surface-2)]" : "hover:bg-[var(--c-surface-2)]"
                ].join(" ")}
              >
                <I className="w-4 h-4 text-[color:var(--c-muted)]" />
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
