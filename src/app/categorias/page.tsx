import { prisma } from "@/src/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/src/components/ui/button"

interface CategoryPageProps {
  params: {
    id: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await prisma.category.findUnique({
    where: { id: params.id },
  })

  if (!category) return notFound()

  const products = await prisma.product.findMany({
    where: { categoryId: category.id },
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
      <h1 className="text-3xl font-bold mb-6 text-center">{category.name}</h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">{category.description}</p>

      {products.length === 0 ? (
        <div className="text-center text-gray-500">No hay productos en esta categoría.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              {product.images?.[0]?.url ? (
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].alt || product.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 rounded">
                  Sin imagen
                </div>
              )}
              <h2 className="text-lg font-semibold mt-4">{product.name}</h2>
              <p className="text-sm text-gray-600 mb-2">${product.price.toFixed(2)}</p>
              <Link href={`/productos/${product.id}`}>
                <Button variant="outline" className="w-full">Ver Detalles</Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


