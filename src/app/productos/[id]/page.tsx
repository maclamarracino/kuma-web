import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/src/lib/prisma"
import { formatPrice } from "@/src/lib/utils"
import { AddToCartButton } from "@/src/components/add-to-cart-button"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const resolvedParams = await params
  const id = resolvedParams?.id

  if (!id) {
    return {
      title: "Producto no encontrado",
      description: "El producto que buscas no existe",
    }
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return {
        title: "Producto no encontrado",
        description: "El producto que buscas no existe",
      }
    }

    return {
      title: `${product.name} | Tu Tienda`,
      description: product.description,
    }
  } catch (error) {
    console.error("Error al generar metadata:", error)
    return {
      title: "Error",
      description: "Ocurrió un error al cargar el producto",
    }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params
  const id = resolvedParams?.id

  if (!id) {
    notFound()
  }

  try {
    console.log("Buscando producto con ID:", id)

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
      },
    })

    if (!product) {
      console.log("Producto no encontrado")
      notFound()
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link href="/productos" className="text-blue-600 hover:underline">
            ← Volver a productos
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {product.images.length > 0 ? (
              <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.images[0].url || "/placeholder.svg"}
                  alt={product.images[0].alt || product.name}
                  className="object-contain w-full h-full"
                />
              </div>
            ) : (
              <div className="aspect-square flex items-center justify-center bg-gray-200 text-gray-400 rounded-lg">
                Sin imagen
              </div>
            )}

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image) => (
                  <div key={image.id} className="aspect-square bg-gray-100 rounded overflow-hidden">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.alt || product.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              {product.category && (
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                    {product.category.name}
                  </span>
                </div>
              )}
            </div>

            <div className="text-3xl font-bold text-blue-600">{formatPrice(product.price)}</div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Descripción</h2>
              <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="text-sm font-medium">
                Disponibilidad:{" "}
                <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                  {product.stock > 0 ? `${product.stock} en stock` : "Agotado"}
                </span>
              </div>
            </div>

            {product.stock > 0 ? (
              <div className="pt-4">
                <AddToCartButton product={product} />
              </div>
            ) : (
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <p className="text-gray-600">Este producto está agotado actualmente.</p>
                <p className="text-sm text-gray-500">Vuelve pronto para verificar disponibilidad.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error al cargar el producto:", error)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link href="/productos" className="text-blue-600 hover:underline">
            ← Volver a productos
          </Link>
        </div>
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <h1 className="text-2xl font-bold text-red-700 mb-2">Error</h1>
          <p className="text-red-600 mb-4">Ocurrió un error al cargar el producto.</p>
          <p className="text-sm text-red-500">{(error as Error).message}</p>
        </div>
      </div>
    )
  }
}

