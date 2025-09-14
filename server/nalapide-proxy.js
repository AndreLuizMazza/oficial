import express from 'express'
const router = express.Router()
const BASE = (process.env.NALAPIDE_API_BASE||'').replace(/\/+$/,'')
const KEY  = process.env.NALAPIDE_API_KEY || ''
function q(req){ return req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '' }
router.get('/memorial', async (req,res)=>{
  try{
    const url = `${BASE}/memorial${q(req)}`
    const r = await fetch(url, { headers: { 'Authorization': KEY } })
    const data = await r.json(); res.status(r.status).json(data)
  }catch(e){ res.status(502).json({ error:String(e) }) }
})
export default router
