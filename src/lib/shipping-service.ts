import { prisma } from "@/src/lib/prisma"
import { Decimal } from "@prisma/client/runtime/library"

interface QuoteShippingParams {
  postalCodeOrigin: string
  postalCodeDestination: string
  weight: number
  volume?: number
  packages?: number
  declaredValue: number
  operativeType?: string
}

interface ShippingQuote {
  success: boolean
  price?: number
  deliveryTime?: string
  error?: string
}

interface CreateShippingParams {
  orderId: string
  provider: string
  trackingNumber?: string
  cost: number
  estimatedDelivery?: Date
}

interface TrackShipmentParams {
  trackingNumber: string
}

interface ShippingTrackingResult {
  success: boolean
  status?: string
  events?: Array<{
    date: string
    description: string
    location: string
  }>
  error?: string
}

export class ShippingService {
  /**
   * Cotiza un envío según los parámetros proporcionados
   */
  async quoteShipping(params: QuoteShippingParams): Promise<ShippingQuote> {
    try {
      // Validar parámetros
      if (!params.postalCodeOrigin || !params.postalCodeDestination) {
        return { success: false, error: "Códigos postales de origen y destino son requeridos" }
      }

      // Lógica simplificada para calcular precio de envío
      let basePrice = 1500 // Precio base

      // Ajustar precio según distancia (simulado)
      if (params.postalCodeDestination.startsWith("1")) {
        // CABA
        basePrice = 1200
      } else if (params.postalCodeDestination.startsWith("2")) {
        // Buenos Aires
        basePrice = 1800
      } else {
        // Resto del país
        basePrice = 2500
      }

      // Ajustar por peso
      const weightMultiplier = Math.max(1, params.weight)
      const finalPrice = Math.round(basePrice * weightMultiplier)

      // Simular tiempo de entrega
      let deliveryTime = "3-5 días hábiles"
      if (params.postalCodeDestination.startsWith("1")) {
        deliveryTime = "1-2 días hábiles"
      } else if (params.postalCodeDestination.startsWith("2")) {
        deliveryTime = "2-3 días hábiles"
      }

      return {
        success: true,
        price: finalPrice,
        deliveryTime: deliveryTime,
      }
    } catch (error) {
      console.error("Error al cotizar envío:", error)
      return { success: false, error: `Error al cotizar envío: ${(error as Error).message}` }
    }
  }

  /**
   * Crea un registro de envío para una orden
   */
  async createShipping(params: CreateShippingParams) {
    try {
      const shipping = await prisma.shipping.create({
        data: {
          orderId: params.orderId,
          provider: params.provider,
          trackingNumber: params.trackingNumber,
          cost: new Decimal(params.cost),
          estimatedDelivery: params.estimatedDelivery,
        },
      })

      // Crear evento inicial
      await prisma.shippingEvent.create({
        data: {
          shippingId: shipping.id,
          status: "PENDING",
          description: "Envío registrado",
        },
      })

      return { success: true, shipping }
    } catch (error) {
      console.error("Error al crear envío:", error)
      return { success: false, error: `Error al crear envío: ${(error as Error).message}` }
    }
  }

  /**
   * Actualiza el estado de un envío
   */
  async updateShippingStatus(shippingId: string, status: string, description?: string, location?: string) {
    try {
      // Actualizar el estado del envío
      const shipping = await prisma.shipping.update({
        where: { id: shippingId },
        data: { status },
      })

      // Crear evento de actualización
      await prisma.shippingEvent.create({
        data: {
          shippingId,
          status,
          description,
          location,
        },
      })

      return { success: true, shipping }
    } catch (error) {
      console.error("Error al actualizar estado de envío:", error)
      return { success: false, error: `Error al actualizar estado de envío: ${(error as Error).message}` }
    }
  }

  /**
   * Consulta el estado de un envío por número de seguimiento
   */
  async trackShipment(params: TrackShipmentParams): Promise<ShippingTrackingResult> {
    try {
      // Validar parámetros
      if (!params.trackingNumber) {
        return { success: false, error: "Número de seguimiento requerido" }
      }

      // Buscar el envío por número de seguimiento
      const shipping = await prisma.shipping.findFirst({
        where: { trackingNumber: params.trackingNumber },
        include: {
          events: {
            orderBy: { timestamp: "desc" },
          },
        },
      })

      if (!shipping) {
        return { success: false, error: "Envío no encontrado" }
      }

      // Formatear eventos
      const events = shipping.events.map((event) => ({
        date: event.timestamp.toISOString(),
        description: event.description || event.status,
        location: event.location || "N/A",
      }))

      return {
        success: true,
        status: shipping.status,
        events,
      }
    } catch (error) {
      console.error("Error al consultar seguimiento:", error)
      return { success: false, error: `Error al consultar seguimiento: ${(error as Error).message}` }
    }
  }
}

// Exportar una instancia por defecto para uso general
export const shippingService = new ShippingService()
