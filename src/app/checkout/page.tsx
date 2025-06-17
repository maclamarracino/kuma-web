"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/src/context/cart-context"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { ShippingCalculator } from "@/src/components/shipping/shipping-calculator"
import { formatPrice } from "@/src/lib/utils"
import { createOrder } from "@/src/app/actions/payment-actions"

declare global {
  interface Window {
    MercadoPago?: any
  }
}

interface ShippingOption {
  id: string
  name: string
  price: number
  deliveryTime?: string
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [orderCreated, setOrderCreated] = useState(false)
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  })

  useEffect(() => {
    if (items.length === 0 && !orderCreated) {
      router.push("/carrito")
    }
  }, [items, router, orderCreated])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleShippingSelect = (option: ShippingOption | null) => {
    setSelectedShipping(option)
  }

  const totalWithShipping = total + (selectedShipping?.price || 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    try {
      if (
        !formData.name ||
        !formData.email ||
        !formData.phone ||
        !formData.address ||
        !formData.city ||
        !formData.postalCode
      ) {
        setErrorMessage("Por favor completa todos los campos obligatorios")
        setIsLoading(false)
        return
      }

      if (!selectedShipping) {
        setErrorMessage("Por favor selecciona un método de envío")
        setIsLoading(false)
        return
      }

      const orderData: any = {
        items: items.map((item) => ({
          id: item.id.toString(),
          title: item.name,
          quantity: item.quantity,
          unit_price: item.price,
        })),
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          notes: formData.notes,
        },
      }

      if (selectedShipping.id !== "pickup") {
        orderData.shipping = {
          provider: selectedShipping.id.startsWith("oca") ? "OCA" : "PICKUP",
          cost: selectedShipping.price,
          method: selectedShipping.id,
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // ✅ ISO string
        }
      }

      console.log("Enviando datos de orden:", orderData)
      const response = await createOrder(orderData)
      console.log("Respuesta recibida:", response)

      if (!response) {
        throw new Error("No se recibió respuesta del servidor")
      }

      if (!response.success) {
        const errorMsg = response.error || "Error desconocido al procesar el pago"
        throw new Error(errorMsg)
      }

      if (!response.orderId) {
        throw new Error("No se pudo crear la orden")
      }

      localStorage.setItem("currentOrderId", response.orderId)
      setOrderCreated(true)

      if (response.initPoint) {
        console.log("Redirigiendo a:", response.initPoint)
        setPaymentUrl(response.initPoint)
      } else {
        throw new Error("No se pudo obtener el enlace de pago")
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error)
      setErrorMessage(error instanceof Error ? error.message : "Error desconocido al procesar el pago")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (paymentUrl) {
      const timer = setTimeout(() => {
        window.location.href = paymentUrl
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [paymentUrl])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Finalizar Compra</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Información de Envío</h2>

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{errorMessage}</div>
            )}

            {orderCreated && paymentUrl ? (
              <div className="text-center py-8">
                <div className="animate-pulse mb-4">
                  <div className="h-12 w-12 bg-green-500 rounded-full mx-auto"></div>
                </div>
                <h3 className="text-xl font-bold mb-2">¡Orden creada con éxito!</h3>
                <p className="text-gray-600 mb-4">Estamos redirigiendo a la página de pago de Mercado Pago...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo *</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección *</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad *</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Código Postal *</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notas adicionales</Label>
                  <Textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} rows={3} />
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <ShippingCalculator cartTotal={total} onShippingSelect={handleShippingSelect} />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading || !selectedShipping}>
                  {isLoading ? "Procesando..." : `Finalizar Compra - ${formatPrice(totalWithShipping)}`}
                </Button>
              </form>
            )}
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold mb-4">Resumen del Pedido</h2>

            <div className="space-y-4 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.name} <span className="text-gray-500">x{item.quantity}</span>
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Envío</span>
                <span>{selectedShipping ? formatPrice(selectedShipping.price) : "Calcular"}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>{formatPrice(totalWithShipping)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


