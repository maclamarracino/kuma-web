import Image from "next/image"
import { Button } from "@/components/ui/button"

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  code: string
}

interface FeaturedProductProps {
  product: Product
}

export function FeaturedProduct({ product }: FeaturedProductProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow transition-all hover:shadow-lg">
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="mb-1 font-semibold text-[#8a7e55]">{product.name}</h3>
        <p className="mb-1 text-xs text-gray-500">Código: {product.code}</p>
        <p className="mb-2 text-sm text-gray-600">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">€{product.price.toFixed(2)}</span>
          <Button size="sm" className="bg-[#8a7e55] hover:bg-[#736a47]">
            Añadir
          </Button>
        </div>
      </div>
    </div>
  )
}

