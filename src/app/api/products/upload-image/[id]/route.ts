import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { prisma } from "@/src/lib/prisma"
import { revalidatePath } from "next/cache"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = params.id
    const formData = await req.formData()
    const file = formData.get("image") as File | null

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó una imagen válida" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadsDir = path.join(process.cwd(), "public/uploads")
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

    const fileName = `${Date.now()}-${file.name}`
    const filePath = path.join(uploadsDir, fileName)

    fs.writeFileSync(filePath, buffer)

    const savedImage = await prisma.productImage.create({
      data: {
        url: `/uploads/${fileName}`,
        alt: file.name,
        productId,
      },
    })

    revalidatePath(`/admin/products/${productId}`)

    return NextResponse.json(savedImage)
  } catch (err) {
    console.error("Error al subir la imagen:", err)
    return NextResponse.json({ error: (err as Error).message || "Error interno" }, { status: 500 })
  }
}


