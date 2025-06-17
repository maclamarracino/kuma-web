// Cambiar la importación de db a prisma
import { prisma } from "@/src/lib/prisma"
import { ProductForm } from "../product-form"

interface ProductPageProps {
  params: {
    id: string
  }
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const product = await prisma.product.findUnique({
    where: {
      id: params.id,
    },
    include: {
      category: true,
      images: true,
    },
  })

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm product={product} categories={categories} />
      </div>
    </div>
  )
}

export default ProductPage
