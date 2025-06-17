import Link from "next/link"
import { prisma } from "@/src/lib/prisma"
import { Button } from "@/src/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { DeleteCategoryButton } from "./delete-button"

export default async function CategoriesPage() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Categorías</h1>
          <Link href="/admin/categories/new">
            <Button>Nueva Categoría</Button>
          </Link>
        </div>

        <div className="bg-white rounded-md shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>{category._count.products}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/admin/categories/${category.id}`}>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </Link>
                      <DeleteCategoryButton categoryId={category.id} productCount={category._count.products} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    No hay categorías. Crea tu primera categoría.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error al cargar categorías:", error)
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Categorías</h1>
          <Link href="/admin/categories/new">
            <Button>Nueva Categoría</Button>
          </Link>
        </div>

        <div className="bg-white rounded-md shadow p-6 text-center">
          <p className="text-red-500 mb-4">
            Error al cargar las categorías. Por favor, verifica la conexión a la base de datos.
          </p>
          <p className="text-sm text-gray-500">{(error as Error).message}</p>
        </div>
      </div>
    )
  }
}
