import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/src/lib/utils"
import { AddToCartButton } from "@/src/components/add-to-cart-button"

// Datos estáticos para productos
const products = [
  {
    id: 1,
    name: "Torre Rosa",
    slug: "torre-rosa",
    description: "Clásica torre rosa Montessori para desarrollo sensorial",
    price: 4500,
    image_url: "/placeholder.svg?height=300&width=300",
    category_id: 2,
    stock: 10,
    featured: true,
  },
  {
    id: 2,
    name: "Tablero de Cilindros",
    slug: "tablero-cilindros",
    description: "Tablero con cilindros de diferentes tamaños",
    price: 3200,
    image_url: "/placeholder.svg?height=300&width=300",
    category_id: 2,
    stock: 15,
    featured: false,
  },
  {
    id: 3,
    name: "Letras de Lija",
    slug: "letras-lija",
    description: "Letras con textura de lija para aprendizaje sensorial",
    price: 2800,
    image_url: "/placeholder.svg?height=300&width=300",
    category_id: 4,
    stock: 20,
    featured: true,
  },
  {
    id: 4,
    name: "Cuentas Doradas",
    slug: "cuentas-doradas",
    description: "Material para aprendizaje del sistema decimal",
    price: 5200,
    image_url: "/placeholder.svg?height=300&width=300",
    category_id: 5,
    stock: 8,
    featured: true,
  },
  {
    id: 5,
    name: "Bandeja de Trasvase",
    slug: "bandeja-trasvase",
    description: "Bandeja para actividades de trasvase de líquidos o sólidos",
    price: 1800,
    image_url: "/placeholder.svg?height=300&width=300",
    category_id: 3,
    stock: 12,
    featured: false,
  },
  {
    id: 6,
    name: "Caja de Permanencia",
    slug: "caja-permanencia",
    description: "Juguete para desarrollar la noción de permanencia del objeto",
    price: 2500,
    image_url: "/placeholder.svg?height=300&width=300",
    category_id: 1,
    stock: 10,
    featured: false,
  },
  {
    id: 7,
    name: "Tablillas de Colores",
    slug: "tablillas-colores",
    description: "Conjunto de tablillas para discriminación de colores",
    price: 1950,
    image_url: "/placeholder.svg?height=300&width=300",
    category_id: 2,
    stock: 15,
    featured: false,
  },
  {
    id: 8,
    name: "Escalera Marrón",
    slug: "escalera-marron",
    description: "Escalera para desarrollo visual y motor",
    price: 4800,
    image_url: "/placeholder.svg?height=300&width=300",
    category_id: 2,
    stock: 7,
    featured: true,
  },
]

export async function ProductList() {
  // En un entorno real, aquí se conectaría con la base de datos

  if (!products.length) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-medium mb-2">No hay productos disponibles</h2>
        <p className="text-gray-500">Vuelve a intentarlo más tarde</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="group">
          <Link href={`/producto/${product.slug}`} className="block">
            <div className="aspect-square relative overflow-hidden rounded-md mb-3 bg-gray-100">
              {product.image_url ? (
                <Image
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
              )}
              {product.featured && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  Destacado
                </div>
              )}
            </div>
            <h3 className="font-medium mb-1 group-hover:underline">{product.name}</h3>
          </Link>
          <div className="flex justify-between items-center">
            <p className="font-bold">{formatPrice(product.price)}</p>
            <AddToCartButton product={product} />
          </div>
        </div>
      ))}
    </div>
  )
}
