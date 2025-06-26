import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/src/lib/prisma"
import { formatPrice } from "@/src/lib/utils"
import { AddToCartButton } from "@/src/components/add-to-cart-button"

interface ProductPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: ProductPageProps) {
  const slug = params.slug

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true, images: true },
  })

  if (!product) {
    return {
      title: "Producto no encontrado",
      description: "El producto que buscas no existe",
    }
  }

  const title = `${product.name} | Kuma Montessori`
  const description = product.description ?? "Producto Montessori"
  const image = product.images[0]?.url ?? "/og-image.jpg"
  const url = `https://kumamontessori.com/productos/${product.slug}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "product",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const slug = params.slug

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: true,
    },
  })

  if (!product) return notFound()

  const plainProduct = {
    ...product,
    price: product.price.toNumber(),
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 font-serif text-[#365A5D]">
      <div className="mb-6">
        <Link href="/productos" className="text-[#365A5D] hover:underline">
          ← Volver a productos
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Imagen principal */}
        <div className="space-y-4">
          {product.images.length > 0 ? (
            <div className="aspect-square bg-[#F3F3F3] rounded-xl overflow-hidden shadow">
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

          {/* Galería secundaria */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image) => (
                <div key={image.id} className="aspect-square bg-[#F3F3F3] rounded-lg overflow-hidden">
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

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 leading-tight">{product.name}</h1>
            {product.category && (
              <span className="bg-[#E8F0EF] text-[#365A5D] px-4 py-1 rounded-full text-sm">
                {product.category.name}
              </span>
            )}
          </div>

          <div className="text-3xl font-bold text-[#D9B84A]">{formatPrice(product.price)}</div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Descripción</h2>
            <p className="text-md text-[#4A4A4A] whitespace-pre-line leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="text-sm font-medium">
            Disponibilidad: {" "}
            <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
              {product.stock > 0 ? `${product.stock} en stock` : "Agotado"}
            </span>
          </div>

          {product.stock > 0 ? (
            <div className="pt-4">
              <AddToCartButton product={plainProduct} />
            </div>
          ) : (
            <div className="bg-[#F9F9F9] p-4 rounded-lg text-center">
              <p className="text-[#666]">Este producto está agotado actualmente.</p>
              <p className="text-sm text-[#999]">Vuelve pronto para verificar disponibilidad.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


