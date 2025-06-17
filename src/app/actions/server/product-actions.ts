"use server"

import { prisma } from "@/src/lib/prisma"

// 🛠️ Función para generar slugs desde nombres
function generateSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remover acentos
    .replace(/[^a-z0-9\s-]/g, "") // Remover caracteres especiales
    .replace(/\s+/g, "-") // Reemplazar espacios con guiones
    .replace(/-+/g, "-") // Reemplazar múltiples guiones con uno solo
    .trim()
}

// ✅ Crear producto
export async function createProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const stock = Number.parseInt(formData.get("stock") as string)
    const sku = formData.get("sku") as string
    const categoryId = formData.get("categoryId") as string

    const slug = generateSlug(name)

    if (!name || !description || isNaN(price) || isNaN(stock) || !categoryId) {
      return { error: "Todos los campos son requeridos" }
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        stock: isNaN(stock) ? 0 : stock,
        sku: sku || null,
        categoryId,
      },
      include: {
        category: true,
      },
    })

    return { success: true, product }
  } catch (error) {
    console.error("Error al crear producto:", error)
    return { error: `Error al crear producto: ${(error as Error).message}` }
  }
}

// ✅ Actualizar producto
export async function updateProduct(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const stock = Number.parseInt(formData.get("stock") as string)
    const sku = formData.get("sku") as string
    const categoryId = formData.get("categoryId") as string

    const slug = generateSlug(name)

    if (!name || !description || isNaN(price) || isNaN(stock) || !categoryId) {
      return { error: "Todos los campos son requeridos" }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        price,
        stock: isNaN(stock) ? 0 : stock,
        sku: sku || null,
        categoryId,
      },
      include: {
        category: true,
      },
    })

    return { success: true, product }
  } catch (error) {
    console.error("Error al actualizar producto:", error)
    return { error: `Error al actualizar producto: ${(error as Error).message}` }
  }
}

// ✅ Eliminar imagen de producto
export async function deleteProductImage(imageId: string) {
  try {
    await prisma.productImage.delete({
      where: { id: imageId },
    })
    return { success: true }
  } catch (error) {
    console.error("Error al eliminar imagen:", error)
    return { error: `Error al eliminar imagen: ${(error as Error).message}` }
  }
}




