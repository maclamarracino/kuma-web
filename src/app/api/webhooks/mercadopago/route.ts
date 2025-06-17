import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/src/lib/prisma"
import { Payment } from "mercadopago"
import { getMercadoPagoClient } from "@/src/lib/mercadopago"

export async function POST(request: NextRequest) {
  try {
    // Obtener los datos de la solicitud
    const body = await request.json()
    console.log("Webhook recibido:", JSON.stringify(body, null, 2))

    // Verificar si es una notificación de pago
    if (body.action === "payment.created" || body.action === "payment.updated") {
      const paymentId = body.data.id

      // Obtener el cliente de Mercado Pago
      const client = getMercadoPagoClient()
      const payment = new Payment(client)

      // Obtener los detalles del pago
      const paymentInfo = await payment.get({ id: paymentId })
      console.log("Información del pago:", JSON.stringify(paymentInfo, null, 2))

      // Obtener el ID de la orden desde external_reference
      const orderId = paymentInfo.external_reference

      if (!orderId) {
        console.error("ID de orden no encontrado en la referencia externa")
        return NextResponse.json({ error: "ID de orden no encontrado" }, { status: 400 })
      }

      // Actualizar el estado de la orden según el estado del pago
      let orderStatus = "PENDING"

      switch (paymentInfo.status) {
        case "approved":
          orderStatus = "PAID"
          break
        case "rejected":
          orderStatus = "FAILED"
          break
        case "in_process":
          orderStatus = "PENDING"
          break
        case "refunded":
          orderStatus = "REFUNDED"
          break
        default:
          orderStatus = "PENDING"
      }

      // Actualizar la orden en la base de datos
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: orderStatus,
          paymentId: paymentId.toString(),
          paymentMethod: paymentInfo.payment_method_id || "",
          paymentStatus: paymentInfo.status || "",
          updatedAt: new Date(),
        },
      })

      console.log(`Orden ${orderId} actualizada con estado: ${orderStatus}`)
      return NextResponse.json({ success: true })
    }

    // Para otros tipos de notificaciones
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error en webhook de Mercado Pago:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido en el webhook" },
      { status: 500 },
    )
  }
}

// También manejamos solicitudes GET para validación de webhooks
export async function GET(request: NextRequest) {
  return NextResponse.json({ success: true })
}


