import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/src/lib/prisma"
import { formatPrice } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/button"

interface CategoryPageProps {
  params: {
    slug?: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  if (!params?.slug) {
    return {
      title: "Categoría no encontrada",
      description: "La categoría que buscas no existe",
    }
  }

  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
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
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const slug = params?.slug

  if (!slug) {
    return notFound()
  }

  const category = await prisma.category.findUnique({
    where: { slug },
  })

  if (!category) {
    return notFound()
  }

  const products = await prisma.product.findMany({
    where: {
      categoryId: category.id,
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
    <div className="max-w-7xl mx-auto px-4 py-12 font-serif text-[#365A5D]">
      <div className="mb-6">
        <Link href="/categorias" className="text-[#365A5D] hover:underline">
          ← Volver a categorías
        </Link>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-lg text-[#4A4A4A]">{category.description}</p>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-[#F9F9F9] rounded-lg">
          <p className="text-[#999] mb-4">No hay productos disponibles en esta categoría.</p>
          <Link href="/productos">
            <Button variant="outline" className="text-[#365A5D] border-[#365A5D] hover:bg-[#E8F0EF]">
              Ver todos los productos
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/productos/${product.slug}`}
              className="group bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square bg-[#F3F3F3] relative">
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
                <h2 className="text-xl font-semibold mb-1 group-hover:text-[#D9B84A] transition-colors">
                  {product.name}
                </h2>
                <p className="text-lg font-bold text-[#D9B84A]">
                  {formatPrice(product.price.toNumber())}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

