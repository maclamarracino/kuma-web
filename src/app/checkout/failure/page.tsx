"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { Button } from "@/src/components/ui/button"

export default function CheckoutFailurePage() {
  const searchParams = useSearchParams()

  useEffect(() => {
    // Registrar los parámetros para depuración
    console.log("Parámetros de URL en página de fallo:", Object.fromEntries(searchParams.entries()))
  }, [searchParams])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-16 w-16 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Pago Fallido</h1>
        <p className="text-gray-600 mb-6">
          Lo sentimos, hubo un problema al procesar tu pago. Por favor, intenta nuevamente.
        </p>

        <div className="space-y-4">
          <Link href="/checkout">
            <Button className="w-full">Intentar Nuevamente</Button>
          </Link>

          <Link href="/carrito">
            <Button variant="outline" className="w-full">
              Volver al Carrito
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}



