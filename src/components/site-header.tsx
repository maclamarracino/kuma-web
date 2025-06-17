"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { useCart } from "@/src/context/cart-context" // ← esta línea es clave
import { CategoryMenu } from "@/src/components/category-menu"

export function SiteHeader() {
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex flex-col px-4 py-2 space-y-2">
        {/* Logo + carrito/login */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/images/logo.png" alt="Kuma Montessori" width={180} height={50} />
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/carrito">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
            <Button variant="outline" className="hidden md:flex">
              Iniciar Sesión
            </Button>
          </div>
        </div>

        {/* Categorías visibles en el header */}
        <CategoryMenu />
      </div>
    </header>
  )
}

