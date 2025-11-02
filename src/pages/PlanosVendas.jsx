// src/pages/PlanosVendas.jsx
import { useEffect } from "react"
import PrivateGate from "@/components/PrivateGate"
import PlanosView from "./PlanosView"
import { setPageSEO } from "@/lib/seo"

export default function PlanosVendas(){
  // SEO interno (noindex + canonical apontando para /planos)
  useEffect(() => {
    setPageSEO({
      title: "Progem • Planos (Simulador interno)",
      description: "Simulador interno para equipe de vendas.",
      noindex: true,
      canonical: "https://progem.com.br/planos"
    })
  }, [])

  return (
    <PrivateGate>
      <PlanosView showSimulator={true} pageTitle="Progem • Planos (Simulador interno)" />
    </PrivateGate>
  )
}
