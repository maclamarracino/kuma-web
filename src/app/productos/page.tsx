import Link from "next/link"
import { prisma } from "@/src/lib/prisma"
import { formatPrice } from "@/src/lib/utils"

export const metadata = {
  title: "Productos | Tu Tienda",
  description: "Explora nuestra selección de productos",
}

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: {
        take: 1, // Solo mostramos una imagen
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Nuestros Productos</h1>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No hay productos disponibles en este momento.</p>
          <p className="text-gray-400">Vuelve pronto para ver nuestras novedades.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/productos/${product.id}`}
              className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-square relative bg-gray-100">
                {product.images.length > 0 ? (
                  <img
                    src={product.images[0].url || "/placeholder.svg"}
                    alt={product.images[0].alt || product.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                    Sin imagen
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h2>
                <div className="flex justify-between items-center">
                  <p className="text-xl font-bold text-blue-600">
                    {formatPrice(product.price)}
                  </p>
                  {product.category && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {product.category.name}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}




