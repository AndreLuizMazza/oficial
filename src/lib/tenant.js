export function applyTenantTheme(unidade){
  if (!unidade) return
  const cor = unidade.corPrimaria || pickColorFromId(unidade.id)
  document.documentElement.style.setProperty('--c-primary', cor)
  document.documentElement.style.setProperty('--c-primary-contrast', '#ffffff')
}

function pickColorFromId(id){
  const palette = ['#0ea5e9','#4f46e5','#16a34a','#f59e0b','#e11d48','#14b8a6','#7c3aed']
  return palette[Number(id||0) % palette.length]
}
