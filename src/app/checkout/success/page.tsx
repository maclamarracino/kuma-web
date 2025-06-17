"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { useCart } from "@/src/context/cart-context"
import { getOrderStatus } from "@/src/app/actions/payment-actions"

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart()
  const searchParams = useSearchParams()
  const [orderInfo, setOrderInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Limpiar el carrito después de un pago exitoso
    clearCart()

    // Intentar obtener el ID de la orden de los parámetros de búsqueda primero
    let orderId = searchParams.get("external_reference") || searchParams.get("order_id")

    // Si no está en los parámetros, intentar obtenerlo del localStorage
    if (!orderId) {
      orderId = localStorage.getItem("currentOrderId")
    }

    if (orderId) {
      getOrderStatus(orderId)
        .then((result) => {
          if (result.success && result.order) {
            setOrderInfo(result.order)
            // Limpiar el ID de la orden actual
            localStorage.removeItem("currentOrderId")
          } else {
            setError(result.error || "No se pudo obtener la información de la orden")
          }
        })
        .catch((error) => {
          console.error("Error al obtener información de la orden:", error)
          setError("Error al obtener información de la orden")
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setError("No se encontró el ID de la orden")
      setIsLoading(false)
    }
  }, [clearCart, searchParams])

  // Función para mostrar el estado de la orden en español
  const getStatusText = (status: string) => {
    switch (status) {
      case "PAID":
        return "Pagado"
      case "PENDING":
        return "Pendiente"
      case "FAILED":
        return "Fallido"
      case "REFUNDED":
        return "Reembolsado"
      case "SHIPPED":
        return "Enviado"
      case "DELIVERED":
        return "Entregado"
      default:
        return status
    }
  }

  // Función para obtener la clase de color según el estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "text-green-600"
      case "PENDING":
        return "text-yellow-600"
      case "FAILED":
        return "text-red-600"
      case "REFUNDED":
        return "text-purple-600"
      case "SHIPPED":
        return "text-blue-600"
      case "DELIVERED":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold mb-2 text-center">¡Compra Exitosa!</h1>
        <p className="text-gray-600 mb-6 text-center">
          Gracias por tu compra. Tu pedido ha sido procesado correctamente.
        </p>

        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-yellow-50 p-4 rounded-md mb-6">
            <p className="text-yellow-700">{error}</p>
            <p className="text-sm text-yellow-600 mt-2">
              No te preocupes, tu compra ha sido registrada. Puedes contactarnos si necesitas más información.
            </p>
          </div>
        ) : orderInfo ? (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="font-semibold text-lg mb-3">Detalles del Pedido</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Número de orden:</span>
                  <span className="font-medium">{orderInfo.id.substring(0, 8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className={`font-medium ${getStatusColor(orderInfo.status)}`}>
                    {getStatusText(orderInfo.status)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-medium">
                    {new Date(orderInfo.createdAt).toLocaleDateString("es-AR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-medium">{formatPrice(orderInfo.total)}</span>
                </div>
              </div>
            </div>

            {orderInfo.paymentMethod && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h2 className="font-semibold text-lg mb-3 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Información de Pago
                </h2>
                <div className="space-y-2">
                  {orderInfo.paymentId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID de Pago:</span>
                      <span className="font-medium">{orderInfo.paymentId}</span>
                    </div>
                  )}
                  {orderInfo.paymentMethod && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Método de Pago:</span>
                      <span className="font-medium capitalize">{orderInfo.paymentMethod}</span>
                    </div>
                  )}
                  {orderInfo.paymentStatus && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado del Pago:</span>
                      <span className="font-medium capitalize">{orderInfo.paymentStatus}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 mb-6 text-center">No se pudo cargar la información del pedido.</p>
        )}

        <div className="mt-6 space-y-4">
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

