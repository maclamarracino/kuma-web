"use client"

import { useState, useTransition } from "react"
import { deleteCategory } from "@/src/app/actions/category-actions"
import { Button } from "@/src/components/ui/button"

interface DeleteCategoryButtonProps {
  categoryId: string
  productCount: number
}

export function DeleteCategoryButton({ categoryId, productCount }: DeleteCategoryButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (productCount > 0) {
      alert(`No se puede eliminar esta categoría porque tiene ${productCount} productos asociados.`)
      return
    }

    if (!confirm("¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.")) {
      return
    }

    setIsDeleting(true)

    try {
      const result = await deleteCategory(categoryId)
      if (result?.error) {
        alert(result.error)
      }
      // La página se recargará automáticamente debido a revalidatePath en la acción
    } catch (error) {
      console.error("Error al eliminar:", error)
      alert("Error al eliminar la categoría")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting || productCount > 0}
      title={productCount > 0 ? "No se puede eliminar porque tiene productos asociados" : ""}
    >
      {isDeleting ? "Eliminando..." : "Eliminar"}
    </Button>
  )
}

