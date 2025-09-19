import { useEffect, useState } from 'react'
import { BFF } from '@/lib/bff'
import { setPageSEO } from '@/lib/seo'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import Solutions from '@/components/Solutions'
import LogosBar from '@/components/LogosBar'
import FeatureGrid from '@/components/FeatureGrid'



export default function Home(){
  const [planos, setPlanos] = useState([])
  useEffect(()=>{
    setPageSEO({ title:'Progem — Plataforma líder para funerárias e clubes', description:'Gestão de contratos, assinaturas e pagamentos recorrentes; whitelabel para site e apps.' })
    ;(async()=>{ try{ const p = await BFF.planos(); setPlanos(p||[]) }catch(e){ console.warn('BFF error', e) } })()
  },[])

  return (
    <div>

      <Hero/>
      <Solutions/>
      <LogosBar/>
      <FeatureGrid/>
      <Footer/>
    </div>
  )
}
