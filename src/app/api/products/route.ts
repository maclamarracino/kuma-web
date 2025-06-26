import { NextResponse } from "next/server"
import { prisma } from "@/src/lib/prisma"
import slugify from "slugify"

// POST - Crear producto
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { name, description, price, stock, imageUrl, categoryId } = body

    if (!name || !description || price === undefined || stock === undefined || !categoryId) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const numPrice = Number.parseFloat(price)
    const numStock = Number.parseInt(stock)

    if (isNaN(numPrice) || numPrice < 0) {
      return NextResponse.json({ error: "El precio debe ser un número válido" }, { status: 400 })
    }

    if (isNaN(numStock) || numStock < 0) {
      return NextResponse.json({ error: "El stock debe ser un número válido" }, { status: 400 })
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 400 })
    }

    // 👉 Generar slug único automáticamente
    const baseSlug = slugify(name, { lower: true, strict: true })
    let uniqueSlug = baseSlug
    let counter = 1

    while (await prisma.product.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter++}`
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug: uniqueSlug,
        description,
        price: numPrice,
        stock: numStock,
        imageUrl: imageUrl || null,
        categoryId,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error("Error al crear producto:", error)
    return NextResponse.json(
      {
        error: `Error interno del servidor: ${error instanceof Error ? error.message : "Error desconocido"}`,
      },
      { status: 500 },
    )
  }
}