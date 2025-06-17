import { notFound } from "next/navigation"
import { prisma } from "@/src/lib/prisma"
import { CategoryForm } from "../category-form"

interface CategoryPageProps {
  params: {
    id: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Aseguramos que params.id esté disponible antes de usarlo
  const id = params?.id

  if (!id) {
    notFound()
  }

  // Si es "new", estamos creando una nueva categoría
  if (id === "new") {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Nueva Categoría</h1>
        <CategoryForm />
      </div>
    )
  }

  // Si no, estamos editando una categoría existente
  try {
    const category = await prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      notFound()
    }

    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Editar Categoría</h1>
        <CategoryForm category={category} />
      </div>
    )
  } catch (error) {
    console.error("Error al cargar la categoría:", error)
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <h1 className="text-xl font-bold text-red-700">Error</h1>
        <p className="text-red-600">No se pudo cargar la categoría. Por favor, inténtalo de nuevo.</p>
        <p className="text-sm text-red-500 mt-2">{(error as Error).message}</p>
      </div>
    )
  }
}


