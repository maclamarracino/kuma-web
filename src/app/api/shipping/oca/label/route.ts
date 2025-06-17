import { NextResponse } from "next/server"
import { ocaClient } from "@/src/lib/oca-client"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validar los datos de entrada
    if (!body.orderId || !body.recipientName || !body.recipientAddress || !body.recipientPostalCode) {
      return NextResponse.json({ error: "Faltan datos requeridos para generar la etiqueta" }, { status: 400 })
    }

    // Generar la etiqueta
    const labelResult = await ocaClient.generateLabel({
      orderId: body.orderId,
      recipientName: body.recipientName,
      recipientAddress: body.recipientAddress,
      recipientPostalCode: body.recipientPostalCode,
      recipientCity: body.recipientCity,
      recipientProvince: body.recipientProvince,
      recipientPhone: body.recipientPhone || "",
      recipientEmail: body.recipientEmail || "",
      packages: body.packages || 1,
      weight: body.weight,
      declaredValue: body.declaredValue,
      observations: body.observations,
    })

    if (!labelResult.success) {
      return NextResponse.json({ error: labelResult.error || "Error al generar la etiqueta" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      trackingNumber: labelResult.trackingNumber,
      labelUrl: labelResult.labelUrl,
    })
  } catch (error) {
    console.error("Error en la API de generación de etiquetas de OCA:", error)
    return NextResponse.json({ error: `Error al procesar la solicitud: ${(error as Error).message}` }, { status: 500 })
  }
}
