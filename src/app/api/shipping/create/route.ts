import { NextResponse } from "next/server"
import { shippingService } from "@/src/lib/shipping-service"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validar los datos de entrada
    if (!body.orderId || !body.cost) {
      return NextResponse.json({ error: "Faltan datos requeridos para crear el envío" }, { status: 400 })
    }

    // Crear el envío usando nuestro servicio
    const result = await shippingService.createShipping({
      orderId: body.orderId,
      provider: body.provider || "OCA",
      trackingNumber: body.trackingNumber,
      cost: body.cost,
      estimatedDelivery: body.estimatedDelivery ? new Date(body.estimatedDelivery) : undefined,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Error al crear el envío" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      shipping: result.shipping,
    })
  } catch (error) {
    console.error("Error en la API de creación de envío:", error)
    return NextResponse.json({ error: `Error al procesar la solicitud: ${(error as Error).message}` }, { status: 500 })
  }
}
