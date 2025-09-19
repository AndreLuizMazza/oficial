// src/App.jsx
import { useEffect } from "react"
import { RouterProvider } from "react-router-dom"
import { router } from "@/routes"
import "@/styles/globals.css"
import { initFacebookPixel } from "@/lib/facebookPixel"

export default function App() {
  useEffect(() => {
    // Inicia o Pixel com o ID do Facebook
    initFacebookPixel("1760504431323284")
  }, [])

  return <RouterProvider router={router} />
}
