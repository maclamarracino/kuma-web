"use server"

import { prisma } from "@/src/lib/prisma"
import { MercadoPagoConfig, Preference } from "mercadopago"
import { getReturnUrls } from "@/src/lib/mercadopago"
import { shippingService } from "@/src/lib/shipping-service"

interface OrderItem {
  id: string
  title: string
  quantity: number
  unit_price: number
}

interface OrderCustomer {
  name: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  notes?: string
}

interface ShippingInfo {
  provider: string
  cost: number
  estimatedDelivery?: string // ISO string
  method: string // "oca-standard", "pickup", etc.
}

interface OrderData {
  items: OrderItem[]
  customer: OrderCustomer
  shipping?: ShippingInfo
}

export async function createOrder(data: OrderData) {
  try {
    if (!data.items || data.items.length === 0) {
      return { success: false, error: "No hay productos en el carrito" }
    }

    if (!data.customer.name || !data.customer.email || !data.customer.phone || !data.customer.address) {
      return { success: false, error: "Faltan datos del cliente" }
    }

    const itemsTotal = data.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)
    const shippingCost = data.shipping?.cost || 0
    const total = itemsTotal + shippingCost

    if (!prisma) {
      console.error("Prisma client no está disponible")
      return { success: false, error: "Error de conexión a la base de datos" }
    }

    const order = await prisma.order.create({
      data: {
        customerName: data.customer.name,
        customerEmail: data.customer.email,
        customerPhone: data.customer.phone,
        shippingAddress: data.customer.address,
        shippingCity: data.customer.city,
        shippingPostalCode: data.customer.postalCode,
        notes: data.customer.notes || "",
        total,
        status: "PENDING",
        items: {
          create: data.items.map((item) => ({
            productId: item.id,
            title: item.title,
            quantity: item.quantity,
            unitPrice: item.unit_price,
          })),
        },
      },
    })

    // Crear registro de envío si no es retiro en punto
    if (data.shipping && data.shipping.method !== "pickup") {
      await shippingService.createShipping({
        orderId: order.id,
        provider: data.shipping.provider || "OCA",
        cost: data.shipping.cost,
        estimatedDelivery: data.shipping.estimatedDelivery
          ? new Date(data.shipping.estimatedDelivery)
          : undefined,
      })
    }

    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN
    if (!accessToken) {
      throw new Error("MERCADO_PAGO_ACCESS_TOKEN no está configurado")
    }

    const client = new MercadoPagoConfig({ accessToken })
    const preference = new Preference(client)

    const urls = getReturnUrls()

    const mpItems = data.items.map((item) => ({
      id: item.id,
      title: item.title,
      quantity: item.quantity,
      unit_price: Number (item.unit_price), // <-- Forzamos número
      currency_id: "ARS",
    }))

    if (data.shipping && data.shipping.method !== "pickup" && data.shipping.cost > 0) {
      mpItems.push({
        id: "shipping",
        title: `Envío - ${data.shipping.provider}`,
        quantity: 1,
        unit_price: data.shipping.cost,
        currency_id: "ARS",
      })
    }

    const preferenceData = {
      items: mpItems,
      back_urls: {
        success: urls.success,
        failure: urls.failure,
        pending: urls.pending,
      },
      external_reference: order.id,
      notification_url: urls.notification,
      statement_descriptor: "Kuma Montessori",
      expires: false,
      payer: {
        name: data.customer.name,
        email: data.customer.email,
        phone: {
          area_code: "",
          number: data.customer.phone,
        },
        address: {
          zip_code: data.customer.postalCode,
          street_name: data.customer.address,
        },
      },
    }

    const result = await preference.create({ body: preferenceData })

    if (!result.init_point) {
      console.error("❌ No se recibió init_point de Mercado Pago:", result)
      return {
        success: false,
        error: "No se pudo obtener el enlace de pago de Mercado Pago",
      }
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentPreferenceId: result.id,
      },
    })

    return {
      success: true,
      orderId: order.id,
      preferenceId: result.id,
      initPoint: result.init_point,
    }
  } catch (error) {
    console.error("❌ Error al crear la orden:", error, "\nPayload:", JSON.stringify(data, null, 2))
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido al crear la orden",
    }
  }
}




