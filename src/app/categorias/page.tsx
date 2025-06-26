import { prisma } from "@/src/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/src/components/ui/button"

// 👉 SEO metadata para /categorias
export async function generateMetadata() {
  return {
    title: "Categorías | Kuma Montessori",
    description: "Descubrí nuestras categorías de productos Montessori para bebés y niños.",
    alternates: {
      canonical: "https://kumamontessori.com/categorias",
    },
    openGraph: {
      title: "Categorías | Kuma Montessori",
      description: "Explorá nuestras categorías Montessori y encontrá juguetes, materiales y accesorios ideales.",
      url: "https://kumamontessori.com/categorias",
      type: "website",
      images: [
        {
          url: "https://kumamontessori.com/og-image.jpg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Categorías | Kuma Montessori",
      description: "Explorá nuestras categorías Montessori y encontrá juguetes, materiales y accesorios ideales.",
      images: ["https://kumamontessori.com/og-image.jpg"],
    },
  }
}

export default async function CategoryListPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 font-serif text-[#365A5D]">
      <h1 className="text-4xl font-bold mb-8 text-center">Categorías</h1>

      {categories.length === 0 ? (
        <div className="text-center text-gray-500">No se encontraron categorías.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categorias/${category.slug}`}
              className="group bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[4/3] bg-[#F3F3F3] relative">
                {category.imageUrl ? (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Sin imagen
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold group-hover:text-[#D9B84A] transition-colors">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="text-sm text-[#666] line-clamp-2">{category.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}