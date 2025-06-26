import { prisma } from "@/src/lib/prisma";
import { ProductForm } from "../product-form";

interface ProductPageProps {
  params: {
    id: string;
  };
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { id } = params;

  const productRaw = id === "new" ? null : await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: true,
    },
  });

  // Convertir Decimal a string (o number si preferís)
  const product = productRaw
    ? {
        ...productRaw,
        price: productRaw.price.toString(),
        // si hay otros Decimals que pases, convertirlos también aquí
      }
    : undefined;

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm product={product} categories={categories} />
      </div>
    </div>
  );
};

export default ProductPage;
