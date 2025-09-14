import express from 'express'
import qs from 'node:querystring'
const router = express.Router()
const BASE = (process.env.PROGEM_BASE||'').replace(/\/+$/,'')
const TENANT_ID = process.env.PROGEM_TENANT_ID || ''
const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID || ''
const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET || ''
const OAUTH_SCOPE = process.env.OAUTH_SCOPE || 'read:planos'
async function getToken(){
  const res = await fetch(`${BASE}/oauth2/token`,{ method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body: qs.stringify({ grant_type:'client_credentials', client_id:OAUTH_CLIENT_ID, client_secret:OAUTH_CLIENT_SECRET, scope:OAUTH_SCOPE }) })
  if (!res.ok) throw new Error('oauth2 '+res.status); return res.json()
}
async function proxyJson(path){
  const { access_token } = await getToken()
  const res = await fetch(`${BASE}${path}`,{ headers: { 'Authorization':`Bearer ${access_token}`, 'X-Progem-ID': TENANT_ID } })
  if (!res.ok) throw new Error('progem '+res.status); return res.json()
}
router.get('/planos', async (_req,res)=>{ try{ res.json(await proxyJson('/api/v1/planos')) } catch(e){ res.status(502).json({ error:String(e) }) } })
export default router
