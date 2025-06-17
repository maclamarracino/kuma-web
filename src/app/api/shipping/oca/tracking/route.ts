import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const trackingNumber = searchParams.get("trackingNumber")

    if (!trackingNumber) {
      return NextResponse.json({ error: "Número de seguimiento requerido" }, { status: 400 })
    }

    // Simulación de consulta de seguimiento
    // En producción, aquí iría la integración real con OCA

    // Simular diferentes estados según el número de seguimiento
    let status = "PENDING"
    let events = []

    if (trackingNumber.includes("123")) {
      status = "IN_TRANSIT"
      events = [
        {
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          description: "Paquete retirado del origen",
          location: "Centro de distribución CABA",
        },
        {
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          description: "En tránsito hacia destino",
          location: "Centro de distribución Zona Norte",
        },
      ]
    } else if (trackingNumber.includes("456")) {
      status = "DELIVERED"
      events = [
        {
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          description: "Paquete retirado del origen",
          location: "Centro de distribución CABA",
        },
        {
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          description: "En tránsito hacia destino",
          location: "Centro de distribución Zona Norte",
        },
        {
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          description: "Entregado",
          location: "Domicilio del destinatario",
        },
      ]
    } else {
      // Estado por defecto
      events = [
        {
          date: new Date().toISOString(),
          description: "Envío registrado",
          location: "Centro de distribución",
        },
      ]
    }

    return NextResponse.json({
      success: true,
      status: status,
      events: events,
    })
  } catch (error) {
    console.error("Error en la API de seguimiento:", error)
    return NextResponse.json({ error: `Error al procesar la solicitud: ${(error as Error).message}` }, { status: 500 })
  }
}


