import { useUI } from '@/store/ui'
import { Sun, Moon, MonitorCog } from 'lucide-react'
import clsx from 'clsx'
export default function ThemeToggle(){
  const { themeMode, setThemeMode } = useUI()
  const opt = (mode, Icon, label) => (
    <button key={mode} type="button" onClick={()=>setThemeMode(mode)} aria-pressed={themeMode===mode}
      className={clsx('flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border transition',
        themeMode===mode ? 'bg-[var(--c-primary)] text-[var(--c-primary-contrast)] border-transparent'
                         : 'bg-[var(--c-surface)] text-[var(--c-fg)] border-[var(--c-border)] hover:bg-[var(--c-surface-2)]')}>
      <Icon className="w-4 h-4" /> <span className="hidden sm:inline">{label}</span>
    </button>
  )
  return (
    <div className="inline-flex items-center gap-1 rounded-xl p-1 bg-[var(--c-surface)] border border-[var(--c-border)]">
      {opt('system', MonitorCog, 'Sistema')}
      {opt('light', Sun, 'Claro')}
      {opt('dark', Moon, 'Escuro')}
    </div>
  )
}
