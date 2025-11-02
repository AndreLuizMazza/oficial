// src/pages/PlanosPublic.jsx
import { useEffect } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import PlanosView from "./PlanosView"
import { setPageSEO } from "@/lib/seo"

export default function PlanosPublic(){
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { pathname } = useLocation()

  // Acesso rápido: /planos?sim=1 -> redireciona pro simulador
  useEffect(() => {
    const sim = params.get('sim')
    if (sim === '1' || sim === 'true') {
      navigate('/planos/simulador', { replace: true })
    }
  }, [params, navigate])

  // SEO público
  useEffect(() => {
    setPageSEO({
      title: "Progem • Planos",
      description: "Planos do Progem por faixa de contratos. Solicite uma demonstração.",
      noindex: false,
      canonical: "https://progem.com.br" + pathname,
      ogImage: "https://progem.com.br/og/planos.jpg",
      ogType: "website",
    })
  }, [pathname])

  return <PlanosView showSimulator={false} pageTitle="Progem • Planos" />
}
