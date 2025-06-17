import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Usar la clave pública de producción proporcionada
    const publicKey = process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY || "APP_USR-71138be4-b7a8-48c3-ab0b-ae1d14f54fb1"

    return NextResponse.json({ publicKey })
  } catch (error: any) {
    console.error("Error al obtener la clave pública:", error)
    return NextResponse.json({ error: error.message || "Error al obtener la clave pública" }, { status: 500 })
  }
}

