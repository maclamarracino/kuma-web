"use client"

import { useState } from "react"
import { X } from "lucide-react"

export function Announcement() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm relative">
      <p>Envío gratis en pedidos superiores a $5000. Todos los precios en ARS.</p>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary-foreground hover:opacity-80"
        aria-label="Cerrar anuncio"
      >
        <X size={16} />
      </button>
    </div>
  )
}
