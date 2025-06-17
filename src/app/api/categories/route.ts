import { NextResponse } from "next/server"
import { prisma } from "@/src/lib/prisma"

// Datos de categorías simulados como fallback
const fallbackCategories = [
  {
    id: "cat-1",
    name: "Juguetes Montessori",
    slug: "juguetes-montessori",
    description:
      "Juguetes educativos basados en la metodología Montessori para fomentar el aprendizaje autónomo y el desarrollo de habilidades.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "cat-2",
    name: "Materiales Sensoriales",
    slug: "materiales-sensoriales",
    description:
      "Materiales diseñados para el desarrollo de los sentidos, ayudando a los niños a refinar su percepción del mundo.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "cat-3",
    name: "Vida Práctica",
    slug: "vida-practica",
    description:
      "Herramientas y materiales que ayudan a los niños a desarrollar habilidades para la vida diaria y la independencia.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "cat-4",
    name: "Lenguaje",
    slug: "lenguaje",
    description:
      "Materiales para el desarrollo del lenguaje, la lectura y la escritura siguiendo el método Montessori.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "cat-5",
    name: "Matemáticas",
    slug: "matematicas",
    description: "Materiales para el aprendizaje de conceptos matemáticos de manera concreta y progresiva.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// GET - Obtener todas las categorías
export async function GET() {
  try {
    // Intentar obtener categorías de la base de datos
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    })

    // Si hay categorías en la base de datos, devolverlas
    if (categories.length > 0) {
      return NextResponse.json(categories)
    }

    // Si no hay categorías en la base de datos, devolver las de fallback
    console.log("No hay categorías en la base de datos, usando datos de fallback")
    return NextResponse.json(fallbackCategories)
  } catch (error) {
    console.error("Error al obtener categorías de la base de datos:", error)

    // En caso de error con la base de datos, usar datos de fallback
    console.log("Error con la base de datos, usando datos de fallback")
    return NextResponse.json(fallbackCategories)
  }
}

// POST - Crear nueva categoría
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, slug, description } = body

    // Validar datos requeridos
    if (!name || !slug) {
      return NextResponse.json({ error: "Nombre y slug son requeridos" }, { status: 400 })
    }

    // Verificar que el slug no esté en uso
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    })

    if (existingCategory) {
      return NextResponse.json({ error: "Ya existe una categoría con ese slug" }, { status: 400 })
    }

    // Crear la categoría
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
      },
    })

    return NextResponse.json({ success: true, category })
  } catch (error) {
    console.error("Error al crear categoría:", error)
    return NextResponse.json(
      {
        error: `Error interno del servidor: ${error instanceof Error ? error.message : "Error desconocido"}`,
      },
      { status: 500 },
    )
  }
}

