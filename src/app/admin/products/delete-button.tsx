"use client"

import { useState } from "react"
import { deleteProduct } from "@/src/app/actions/server/product-actions"
import { Button } from "@/src/components/ui/button"

interface DeleteProductButtonProps {
  productId: string
}

export function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  async function handleDelete() {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.")) {
      return
    }

    setIsDeleting(true)

    try {
      await deleteProduct(productId)
      // La página se recargará automáticamente debido a revalidatePath en la acción
    } catch (error) {
      console.error("Error al eliminar:", error)
      alert("Error al eliminar el producto")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button size="sm" onClick={handleDelete} disabled={isDeleting}>
      {isDeleting ? "Eliminando..." : "Eliminar"}
    </Button>
  )
}


