"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { formatPrice } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/src/components/ui/sheet"
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react"

export function CartDrawer() {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      setCartItems(JSON.parse(storedCart))
    }

    // Escuchar cambios en el carrito
    const handleStorageChange = () => {
      const updatedCart = localStorage.getItem("cart")
      if (updatedCart) {
        setCartItems(JSON.parse(updatedCart))
      }
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("cart-updated", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("cart-updated", handleStorageChange)
    }
  }, [])

  const updateCart = (newCart: any[]) => {
    setCartItems(newCart)
    localStorage.setItem("cart", JSON.stringify(newCart))
    // Disparar evento personalizado para notificar cambios en el carrito
    window.dispatchEvent(new Event("cart-updated"))
  }

  const removeFromCart = (productId: number) => {
    const newCart = cartItems.filter((item) => item.id !== productId)
    updateCart(newCart)
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return

    const newCart = cartItems.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item))

    updateCart(newCart)
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (!isClient) return null

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingBag size={20} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Tu Carrito</SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[70vh]">
            <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-500">Tu carrito está vacío</p>
            <p className="text-sm text-gray-400 mb-6">Añade algunos productos para comenzar</p>
            <Button className="rounded-none">
              <Link href="/productos">Ver Productos</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto py-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center py-4 border-b">
                  <div className="relative h-16 w-16 rounded overflow-hidden mr-4">
                    {item.image_url ? (
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                        <span className="text-xs text-gray-500">Sin imagen</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <p className="text-sm text-gray-500">{formatPrice(item.price)}</p>

                    <div className="flex items-center mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-none"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="mx-2 text-sm w-6 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-none"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 mt-2 text-gray-500 hover:text-red-500"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-sm text-gray-500">Envío</span>
                <span className="text-sm">Calculado en el checkout</span>
              </div>

              <Button className="w-full rounded-none">
                <Link href="/checkout">Finalizar Compra</Link>
              </Button>

              <Button variant="outline" className="w-full mt-2 rounded-none">
                <Link href="/productos">Seguir Comprando</Link>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

