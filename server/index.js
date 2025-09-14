import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import progemProxy from './progem-proxy.js'
import nalapideProxy from './nalapide-proxy.js'

dotenv.config()
const app = express()
app.use(express.json())
if (String(process.env.TRUST_PROXY||'1') === '1') app.set('trust proxy', 1)
app.use(helmet({ crossOriginResourcePolicy:false }))
app.use(compression())
const origins = (process.env.CORS_ORIGINS||'http://localhost:5173').split(',').map(s=>s.trim())
app.use(cors({ origin: origins, credentials: true }))
app.use(rateLimit({ windowMs: 60_000, max: 120 }))
app.get('/bff/health', (_req, res)=> res.json({ ok:true, ts:Date.now() }))
app.use('/bff/progem', progemProxy)
app.use('/bff/nalapide', nalapideProxy)
const PORT = process.env.PORT || 8787
if (process.env.NODE_ENV !== 'production'){ app.listen(PORT, ()=> console.log(`BFF on http://localhost:${PORT}`)) }
export default app
