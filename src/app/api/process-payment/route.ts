import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token, amount, description, email } = body

    if (!token || !amount || !description) {
      return NextResponse.json({ message: "Faltan datos requeridos" }, { status: 400 })
    }

    // Simulamos un proceso de pago exitoso
    // En un entorno real, aquí se conectaría con Mercado Pago

    // Simulamos una respuesta exitosa
    const paymentResponse = {
      id: "PAYMENT_" + Math.floor(Math.random() * 1000000),
      status: "approved",
      status_detail: "accredited",
      payment_method_id: "visa",
    }

    // Simulamos guardar el pago en la base de datos
    console.log("Guardando pago en la base de datos:", {
      payment_id: paymentResponse.id,
      status: paymentResponse.status,
      amount,
      payment_method: paymentResponse.payment_method_id,
      description,
      payer_email: email || "test@example.com",
    })

    return NextResponse.json(
      {
        id: paymentResponse.id,
        status: paymentResponse.status,
        detail: paymentResponse.status_detail,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Error en el procesamiento del pago:", error)
    return NextResponse.json({ message: error.message || "Error interno del servidor" }, { status: 500 })
  }
}






