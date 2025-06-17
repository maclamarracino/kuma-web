import { NextResponse } from "next/server"

// Simulación de la API de OCA para desarrollo
// En producción, aquí iría la integración real con OCA
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validar los datos de entrada
    if (!body.postalCodeOrigin || !body.postalCodeDestination || !body.weight || !body.declaredValue) {
      return NextResponse.json({ error: "Faltan datos requeridos para la cotización" }, { status: 400 })
    }

    // Simular cálculo de envío basado en código postal
    const origin = body.postalCodeOrigin
    const destination = body.postalCodeDestination

    // Lógica simplificada para calcular precio de envío
    let basePrice = 1500 // Precio base

    // Ajustar precio según distancia (simulado)
    if (destination.startsWith("1")) {
      // CABA
      basePrice = 1200
    } else if (destination.startsWith("2")) {
      // Buenos Aires
      basePrice = 1800
    } else {
      // Resto del país
      basePrice = 2500
    }

    // Ajustar por peso
    const weightMultiplier = Math.max(1, body.weight)
    const finalPrice = Math.round(basePrice * weightMultiplier)

    // Simular tiempo de entrega
    let deliveryTime = "3-5 días hábiles"
    if (destination.startsWith("1")) {
      deliveryTime = "1-2 días hábiles"
    } else if (destination.startsWith("2")) {
      deliveryTime = "2-3 días hábiles"
    }

    return NextResponse.json({
      success: true,
      price: finalPrice,
      deliveryTime: deliveryTime,
    })
  } catch (error) {
    console.error("Error en la API de cotización de OCA:", error)
    return NextResponse.json({ error: `Error al procesar la solicitud: ${(error as Error).message}` }, { status: 500 })
  }
}

