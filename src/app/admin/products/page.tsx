import Link from "next/link";
import { prisma } from "@/src/lib/prisma";
import { Button } from "@/src/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { DeleteProductButton } from "./delete-button";
import { StarIcon } from "lucide-react";

export default async function ProductsPage() {
  try {
    const products = (
      await prisma.product.findMany({
        include: {
          category: true,
          images: {
            take: 1,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    ).map((product) => ({
      ...product,
      price: product.price.toNumber(),
    }));

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Productos</h1>
          <Link href="/admin/products/new">
            <Button>Nuevo Producto</Button>
          </Link>
        </div>

        <div className="bg-white rounded-md shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imagen</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Destacado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.images?.length > 0 ? (
                      <img
                        src={product.images[0].url || "/placeholder.svg"}
                        alt={product.images[0].alt || product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                        No img
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.category?.name || "Sin categoría"}</TableCell>
                  <TableCell>
                    {product.featured ? (
                    <div className="inline-flex items-center text-sm font-medium text-yellow-600">
                      <StarIcon className="w-4 h-4 text-yellow-500" />
                      Destacado
                        </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/admin/products/${product.id}`}>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </Link>
                      <DeleteProductButton productId={product.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No hay productos. Crea tu primer producto.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error al cargar productos:", error);
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Productos</h1>
          <Link href="/admin/products/new">
            <Button>Nuevo Producto</Button>
          </Link>
        </div>

        <div className="bg-white rounded-md shadow p-6 text-center">
          <p className="text-red-500 mb-4">
            Error al cargar los productos. Por favor, verifica la conexión a la base de datos.
          </p>
          <p className="text-sm text-gray-500">{(error as Error).message}</p>
        </div>
      </div>
    );
  }
}





