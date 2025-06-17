"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Clock } from "lucide-react"
import { Button } from "@/src/components/ui/button"

export default function CheckoutPendingPage() {
  const searchParams = useSearchParams()

  useEffect(() => {
    // Registrar los parámetros para depuración
    console.log("Parámetros de URL en página pendiente:", Object.fromEntries(searchParams.entries()))

    // Guardar el ID de la orden si está presente
    const orderId = searchParams.get("external_reference")
    if (orderId) {
      localStorage.setItem("currentOrderId", orderId)
    }
  }, [searchParams])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <Clock className="h-16 w-16 text-yellow-500" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Pago Pendiente</h1>
        <p className="text-gray-600 mb-6">Tu pago está siendo procesado. Te notificaremos cuando se complete.</p>
        <p className="text-sm text-gray-500 mb-6">
          Algunos métodos de pago pueden tardar hasta 24 horas en confirmarse.
        </p>

        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full">Volver a la Tienda</Button>
          </Link>

          <Link href="/productos">
            <Button variant="outline" className="w-full">
              Seguir Comprando
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

