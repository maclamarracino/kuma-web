import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/src/lib/prisma"
import { formatPrice } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/button"

interface CategoryPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  if (!params?.id) {
    return {
      title: "Categoría no encontrada",
      description: "La categoría que buscas no existe",
    }
  }

  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
    })

    if (!category) {
      return {
        title: "Categoría no encontrada",
        description: "La categoría que buscas no existe",
      }
    }

    return {
      title: `${category.name} | Kuma Montessori`,
      description: category.description || `Productos de la categoría ${category.name}`,
    }
  } catch (error) {
    console.error("Error al generar metadata:", error)
    return {
      title: "Error",
      description: "Ocurrió un error al cargar la categoría",
    }
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  if (!params?.id) {
    notFound()
  }

  try {
    // Obtenemos la categoría
    const category = await prisma.category.findUnique({
      where: { id: params.id },
    })

    if (!category) {
      notFound()
    }

    // Obtenemos los productos de esta categoría
    const products = await prisma.product.findMany({
      where: {
        categories: {
          some: {
            id: params.id,
          },
        },
      },
      include: {
        images: {
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/categorias" className="text-blue-600 hover:underline">
            ← Volver a categorías
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          {category.description && <p className="text-gray-600">{category.description}</p>}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">No hay productos disponibles en esta categoría.</p>
            <Link href="/productos">
              <Button variant="outline">Ver todos los productos</Button>
            </Link>
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
                    <p className="text-xl font-bold text-blue-600">{formatPrice(product.price)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error("Error al cargar la categoría:", error)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link href="/categorias" className="text-blue-600 hover:underline">
            ← Volver a categorías
          </Link>
        </div>
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <h1 className="text-2xl font-bold text-red-700 mb-2">Error</h1>
          <p className="text-red-600 mb-4">Ocurrió un error al cargar la categoría.</p>
          <p className="text-sm text-red-500">{(error as Error).message}</p>
        </div>
      </div>
    )
  }
}
