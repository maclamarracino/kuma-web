"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { useCart } from "@/src/context/cart-context"
import { formatPrice } from "@/src/lib/utils"

interface Product {
  id: number  // cambia string por number
  name: string
  price: number
  stock: number
  images?: { url: string; alt?: string | null }[]
}

interface AddToCartButtonProps {
  product: Product
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (isNaN(value) || value < 1) {
      setQuantity(1)
    } else if (value > product.stock) {
      setQuantity(product.stock)
    } else {
      setQuantity(value)
    }
  }

  const addToCart = async () => {
    setIsAdding(true)

    try {
      // Obtener la primera imagen si existe
      const image = product.images && product.images.length > 0 ? product.images[0].url : undefined

      // Añadir al carrito
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image,
      })

      // Mostrar notificación
      alert(`${quantity} x ${product.name} añadido al carrito`)
    } catch (error) {
      console.error("Error al añadir al carrito:", error)
      alert("No se pudo añadir el producto al carrito")
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="w-24">
          <Input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={handleQuantityChange}
            className="text-center"
          />
        </div>
        <Button onClick={addToCart} className="flex-1" disabled={isAdding}>
          {isAdding ? "Añadiendo..." : "Añadir al carrito"}
        </Button>
      </div>

      <div className="text-sm text-gray-500 text-right">Total: {formatPrice(product.price * quantity)}</div>
    </div>
  )
}



