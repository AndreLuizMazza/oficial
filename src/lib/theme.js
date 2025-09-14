const STORAGE_KEY = 'progem.theme'
export function getSystemPrefersDark(){ return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches }
export function getInitialTheme(){ const s = localStorage.getItem(STORAGE_KEY); return (s==='light'||s==='dark'||s==='system')?s:'system' }
export function resolveIsDark(mode){ return mode==='dark' ? true : mode==='light' ? false : getSystemPrefersDark() }
export function applyHtmlDarkClass(isDark){ const r=document.documentElement; isDark?r.classList.add('dark'):r.classList.remove('dark') }
export function applyMetaThemeColor(isDark){
  const color = isDark ? '#0b1220' : '#ffffff'
  let m=document.querySelector('meta[name="theme-color"]'); if(!m){m=document.createElement('meta');m.setAttribute('name','theme-color');document.head.appendChild(m)}; m.setAttribute('content',color)
}
export function persistThemeMode(m){ localStorage.setItem(STORAGE_KEY,m) }
export function listenSystemSchemeChange(cb){ const m=window.matchMedia('(prefers-color-scheme: dark)'); const h=()=>cb(m.matches); m.addEventListener?m.addEventListener('change',h):m.addListener(h); return ()=>{m.removeEventListener?m.removeEventListener('change',h):m.removeListener(h)} }
