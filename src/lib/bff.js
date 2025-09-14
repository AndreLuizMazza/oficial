export async function api(path, opts={}){
  const res = await fetch(path, { ...opts, headers: { 'Content-Type':'application/json', ...(opts.headers||{}) } })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}
export const BFF = {
  planos: () => api('/bff/progem/planos'),
  memoriais: (q) => api('/bff/nalapide/memorial?'+new URLSearchParams(q||{}))
}
