import { NextResponse } from "next/server"
import { prisma } from "@/src/lib/prisma"

// POST - Crear producto
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { name, slug, description, price, stock, imageUrl, categoryId } = body

    // Validar datos requeridos (permitir 0 para price y stock)
    if (
      !name ||
      !slug ||
      !description ||
      price === undefined ||
      price === null ||
      stock === undefined ||
      stock === null ||
      !categoryId
    ) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Validar que price y stock sean números válidos
    const numPrice = Number.parseFloat(price)
    const numStock = Number.parseInt(stock)

    if (isNaN(numPrice) || numPrice < 0) {
      return NextResponse.json({ error: "El precio debe ser un número válido mayor o igual a 0" }, { status: 400 })
    }

    if (isNaN(numStock) || numStock < 0) {
      return NextResponse.json({ error: "El stock debe ser un número válido mayor o igual a 0" }, { status: 400 })
    }

    // Verificar que la categoría existe
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 400 })
    }

    // Verificar que el slug no esté en uso
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    })

    if (existingProduct) {
      return NextResponse.json({ error: "Ya existe un producto con ese nombre" }, { status: 400 })
    }

    // Crear el producto
    const product = await prisma.product.create({
      data: {
        name,
        slug,
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

// GET - Listar productos
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error al obtener productos:", error)
    return NextResponse.json(
      {
        error: `Error interno del servidor: ${error instanceof Error ? error.message : "Error desconocido"}`,
      },
      { status: 500 },
    )
  }
}

