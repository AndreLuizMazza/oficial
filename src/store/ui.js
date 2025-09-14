import { create } from 'zustand'
import { getInitialTheme, resolveIsDark, applyHtmlDarkClass, applyMetaThemeColor, persistThemeMode, listenSystemSchemeChange } from '@/lib/theme'
export const useUI = create((set,get)=>{
  const initialMode = getInitialTheme()
  const initialIsDark = resolveIsDark(initialMode)
  applyHtmlDarkClass(initialIsDark); applyMetaThemeColor(initialIsDark)
  let unsub = null
  if(initialMode==='system'){ unsub = listenSystemSchemeChange((d)=>{ applyHtmlDarkClass(d); applyMetaThemeColor(d); set({dark:d}) }) }
  return {
    themeMode: initialMode, dark: initialIsDark, loading:false,
    setThemeMode:(mode)=>{
      if(unsub){unsub();unsub=null}
      persistThemeMode(mode)
      const isDark = resolveIsDark(mode)
      applyHtmlDarkClass(isDark); applyMetaThemeColor(isDark)
      if(mode==='system'){ unsub = listenSystemSchemeChange((d)=>{ applyHtmlDarkClass(d); applyMetaThemeColor(d); set({dark:d}) }) }
      set({ themeMode: mode, dark: isDark })
    },
    setLoading:(v)=>set({loading:!!v})
  }
})
