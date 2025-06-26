"use client"

import { useState } from "react"
import { deleteProduct } from "@/src/app/actions/server/product-actions"
import { Button } from "@/src/components/ui/button"

interface DeleteProductButtonProps {
  productId: string
}

export function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.")) {
      return
    }

    setIsDeleting(true)

    try {
      const result = await deleteProduct(productId)
      if (result?.error) {
        alert(result.error)
      } else {
        // Recargar la página para mostrar los cambios
        window.location.reload()
      }
    } catch (error) {
      console.error("Error al eliminar:", error)
      alert("Error al eliminar el producto")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
      {isDeleting ? "Eliminando..." : "Eliminar"}
    </Button>
  )
}



