"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/src/lib/prisma"
import { requireAdmin } from "@/src/lib/auth"
import { redirect } from "next/navigation"

// Función para crear un slug a partir de un nombre
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")
}

// Crear una nueva categoría
export async function createCategory(formData: FormData) {
  try {
    // Verificar que el usuario es admin
    await requireAdmin()

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    let slug = (formData.get("slug") as string) || ""

    if (!name) {
      return { error: "El nombre de la categoría es obligatorio" }
    }

    // Si no se proporciona un slug, crearlo a partir del nombre
    if (!slug) {
      slug = createSlug(name)
    }

    // Verificar si ya existe una categoría con ese slug
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    })

    if (existingCategory) {
      return { error: "Ya existe una categoría con ese slug" }
    }

    // Crear la categoría
    await prisma.category.create({
      data: {
        name,
        description,
        slug,
      },
    })

    revalidatePath("/admin/categories")
    return { success: true }
  } catch (error) {
    console.error("Error al crear la categoría:", error)
    return { error: (error as Error).message }
  }
}

// Actualizar una categoría existente
export async function updateCategory(id: string, formData: FormData) {
  try {
    // Verificar que el usuario es admin
    await requireAdmin()

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    let slug = (formData.get("slug") as string) || ""

    if (!name) {
      return { error: "El nombre de la categoría es obligatorio" }
    }

    // Si no se proporciona un slug, crearlo a partir del nombre
    if (!slug) {
      slug = createSlug(name)
    }

    // Verificar si ya existe otra categoría con ese slug
    const existingCategory = await prisma.category.findFirst({
      where: {
        slug,
        id: { not: id },
      },
    })

    if (existingCategory) {
      return { error: "Ya existe otra categoría con ese slug" }
    }

    // Actualizar la categoría
    await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
        slug,
      },
    })

    revalidatePath("/admin/categories")
    return { success: true }
  } catch (error) {
    console.error("Error al actualizar la categoría:", error)
    return { error: (error as Error).message }
  }
}

// Eliminar una categoría
export async function deleteCategory(id: string) {
  try {
    // Verificar que el usuario es admin
    await requireAdmin()

    // Verificar si la categoría tiene productos asociados
    const productsCount = await prisma.product.count({
      where: {
        categories: {
          some: {
            id,
          },
        },
      },
    })

    if (productsCount > 0) {
      return {
        error: `No se puede eliminar la categoría porque tiene ${productsCount} productos asociados.`,
      }
    }

    // Eliminar la categoría
    await prisma.category.delete({
      where: { id },
    })

    revalidatePath("/admin/categories")
    return { success: true }
  } catch (error) {
    console.error("Error al eliminar la categoría:", error)
    return { error: (error as Error).message }
  }
}
