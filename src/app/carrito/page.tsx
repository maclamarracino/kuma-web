"use client"

import Link from "next/link"
import { Trash2 } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { useCart } from "@/src/context/cart-context"
import { formatPrice } from "@/src/lib/utils"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const router = useRouter()

  const handleQuantityChange = (id: string, value: string) => {
    const quantity = Number.parseInt(value)
    if (!isNaN(quantity) && quantity > 0) {
      updateQuantity(id, quantity)
    }
  }

  const handleCheckout = () => {
    router.push("/checkout")
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Tu Carrito</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 mb-4">Tu carrito está vacío</p>
          <Link href="/productos">
            <Button>Ver Productos</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Tu Carrito</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="py-4 px-6 text-left">Producto</th>
                  <th className="py-4 px-6 text-center">Cantidad</th>
                  <th className="py-4 px-6 text-right">Precio</th>
                  <th className="py-4 px-6 text-right">Subtotal</th>
                  <th className="py-4 px-6"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-16 h-16 flex-shrink-0 mr-4 bg-gray-100 rounded">
                          {item.image ? (
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              Sin imagen
                            </div>
                          )}
                        </div>
                        <div>
                          <Link href={`/productos/${item.id}`} className="font-medium hover:text-blue-600">
                            {item.name}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                          className="w-20 text-center"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">{formatPrice(item.price)}</td>
                    <td className="py-4 px-6 text-right font-medium">{formatPrice(item.price * item.quantity)}</td>
                    <td className="py-4 px-6 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between">
            <Link href="/productos">
              <Button variant="outline">Seguir Comprando</Button>
            </Link>
            <Button variant="outline" onClick={clearCart} className="text-red-500 hover:bg-red-50">
              Vaciar Carrito
            </Button>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold mb-4">Resumen del Pedido</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span>A calcular</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Button onClick={handleCheckout} className="w-full">
              Proceder al Pago
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
