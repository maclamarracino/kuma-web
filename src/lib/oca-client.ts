/**
 * Cliente para la API de OCA e-Pak
 * Documentación: https://developers.oca.com.ar/epak.html
 */

const OCA_API_URL = process.env.OCA_API_URL || "https://webservice.oca.com.ar/epak_tracking/Oep_TrackEPak.asmx"
const OCA_USERNAME = process.env.OCA_USERNAME
const OCA_PASSWORD = process.env.OCA_PASSWORD
const OCA_CUIT = process.env.OCA_CUIT
const OCA_ACCOUNT = process.env.OCA_ACCOUNT

interface OcaCredentials {
  username: string
  password: string
  cuit: string
  account: string
}

interface OcaQuoteParams {
  postalCodeOrigin: string
  postalCodeDestination: string
  weight: number
  volume?: number
  packages?: number
  declaredValue: number
  operativeType?: string // "Puerta a Puerta", "Puerta a Sucursal", etc.
}

interface OcaQuoteResponse {
  success: boolean
  price?: number
  deliveryTime?: string
  error?: string
}

interface OcaGenerateLabelParams {
  orderId: string
  recipientName: string
  recipientAddress: string
  recipientPostalCode: string
  recipientCity: string
  recipientProvince: string
  recipientPhone: string
  recipientEmail: string
  packages: number
  weight: number
  declaredValue: number
  observations?: string
}

interface OcaGenerateLabelResponse {
  success: boolean
  trackingNumber?: string
  labelUrl?: string
  error?: string
}

interface OcaTrackingParams {
  trackingNumber: string
}

interface OcaTrackingResponse {
  success: boolean
  status?: string
  events?: Array<{
    date: string
    description: string
    location: string
  }>
  error?: string
}

export class OcaClient {
  private credentials: OcaCredentials

  constructor(credentials?: Partial<OcaCredentials>) {
    this.credentials = {
      username: credentials?.username || OCA_USERNAME || "",
      password: credentials?.password || OCA_PASSWORD || "",
      cuit: credentials?.cuit || OCA_CUIT || "",
      account: credentials?.account || OCA_ACCOUNT || "",
    }

    if (!this.credentials.username || !this.credentials.password) {
      console.warn("OCA API credentials not provided. Some features may not work.")
    }
  }

  /**
   * Cotiza un envío según los parámetros proporcionados
   */
  async quoteShipping(params: OcaQuoteParams): Promise<OcaQuoteResponse> {
    try {
      // Validar parámetros
      if (!params.postalCodeOrigin || !params.postalCodeDestination) {
        return { success: false, error: "Códigos postales de origen y destino son requeridos" }
      }

      // Construir el XML para la solicitud SOAP
      const xmlBody = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:oep="http://www.oca.com.ar/OEP">
          <soapenv:Header/>
          <soapenv:Body>
            <oep:Tarifar_Envio_Corporativo>
              <oep:Usuario>${this.credentials.username}</oep:Usuario>
              <oep:Clave>${this.credentials.password}</oep:Clave>
              <oep:CUIT>${this.credentials.cuit}</oep:CUIT>
              <oep:Operativa>${params.operativeType || "Puerta a Puerta"}</oep:Operativa>
              <oep:CPOrigen>${params.postalCodeOrigin}</oep:CPOrigen>
              <oep:CPDestino>${params.postalCodeDestination}</oep:CPDestino>
              <oep:Peso>${params.weight}</oep:Peso>
              <oep:Volumen>${params.volume || 0}</oep:Volumen>
              <oep:ValorDeclarado>${params.declaredValue}</oep:ValorDeclarado>
              <oep:CantidadPaquetes>${params.packages || 1}</oep:CantidadPaquetes>
            </oep:Tarifar_Envio_Corporativo>
          </soapenv:Body>
        </soapenv:Envelope>
      `

      // Realizar la solicitud a la API de OCA
      const response = await fetch(OCA_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/xml;charset=UTF-8",
          SOAPAction: "http://www.oca.com.ar/OEP/Tarifar_Envio_Corporativo",
        },
        body: xmlBody,
      })

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`)
      }

      const responseText = await response.text()

      // Parsear la respuesta XML
      // Nota: En una implementación real, deberías usar un parser XML adecuado
      // Esta es una implementación simplificada para fines de demostración
      if (responseText.includes("<Tarifar_Envio_CorporativoResult>")) {
        // Extraer el precio y tiempo de entrega de la respuesta
        const priceMatch = responseText.match(/<Total>([^<]+)<\/Total>/)
        const deliveryTimeMatch = responseText.match(/<PlazoEntrega>([^<]+)<\/PlazoEntrega>/)

        if (priceMatch && priceMatch[1]) {
          return {
            success: true,
            price: Number.parseFloat(priceMatch[1]),
            deliveryTime: deliveryTimeMatch ? deliveryTimeMatch[1] : undefined,
          }
        }
      }

      return { success: false, error: "No se pudo obtener la cotización" }
    } catch (error) {
      console.error("Error al cotizar envío con OCA:", error)
      return { success: false, error: `Error al cotizar envío: ${(error as Error).message}` }
    }
  }

  /**
   * Genera una etiqueta de envío
   */
  async generateLabel(params: OcaGenerateLabelParams): Promise<OcaGenerateLabelResponse> {
    try {
      // Validar parámetros
      if (!params.recipientName || !params.recipientAddress || !params.recipientPostalCode) {
        return { success: false, error: "Datos del destinatario incompletos" }
      }

      // Construir el XML para la solicitud SOAP
      const xmlBody = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:oep="http://www.oca.com.ar/OEP">
          <soapenv:Header/>
          <soapenv:Body>
            <oep:IngresoORMultiplesRetiros>
              <oep:Usuario>${this.credentials.username}</oep:Usuario>
              <oep:Clave>${this.credentials.password}</oep:Clave>
              <oep:IdCliente>${this.credentials.account}</oep:IdCliente>
              <oep:Envios>
                <oep:Envio>
                  <oep:NumeroOperacion>${params.orderId}</oep:NumeroOperacion>
                  <oep:NombreApellidoDestinatario>${params.recipientName}</oep:NombreApellidoDestinatario>
                  <oep:CalleDestinatario>${params.recipientAddress}</oep:CalleDestinatario>
                  <oep:CodigoPostalDestinatario>${params.recipientPostalCode}</oep:CodigoPostalDestinatario>
                  <oep:LocalidadDestinatario>${params.recipientCity}</oep:LocalidadDestinatario>
                  <oep:ProvinciaDestinatario>${params.recipientProvince}</oep:ProvinciaDestinatario>
                  <oep:TelefonoDestinatario>${params.recipientPhone}</oep:TelefonoDestinatario>
                  <oep:EmailDestinatario>${params.recipientEmail}</oep:EmailDestinatario>
                  <oep:CantidadPaquetes>${params.packages}</oep:CantidadPaquetes>
                  <oep:Peso>${params.weight}</oep:Peso>
                  <oep:ValorDeclarado>${params.declaredValue}</oep:ValorDeclarado>
                  <oep:Observaciones>${params.observations || ""}</oep:Observaciones>
                </oep:Envio>
              </oep:Envios>
            </oep:IngresoORMultiplesRetiros>
          </soapenv:Body>
        </soapenv:Envelope>
      `

      // Realizar la solicitud a la API de OCA
      const response = await fetch(OCA_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/xml;charset=UTF-8",
          SOAPAction: "http://www.oca.com.ar/OEP/IngresoORMultiplesRetiros",
        },
        body: xmlBody,
      })

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`)
      }

      const responseText = await response.text()

      // Parsear la respuesta XML
      if (responseText.includes("<IngresoORMultiplesRetirosResult>")) {
        // Extraer el número de seguimiento y URL de la etiqueta
        const trackingMatch = responseText.match(/<NumeroEnvio>([^<]+)<\/NumeroEnvio>/)
        const labelUrlMatch = responseText.match(/<Etiqueta>([^<]+)<\/Etiqueta>/)

        if (trackingMatch && trackingMatch[1]) {
          return {
            success: true,
            trackingNumber: trackingMatch[1],
            labelUrl: labelUrlMatch ? labelUrlMatch[1] : undefined,
          }
        }
      }

      return { success: false, error: "No se pudo generar la etiqueta" }
    } catch (error) {
      console.error("Error al generar etiqueta con OCA:", error)
      return { success: false, error: `Error al generar etiqueta: ${(error as Error).message}` }
    }
  }

  /**
   * Consulta el estado de un envío por número de seguimiento
   */
  async trackShipment(params: OcaTrackingParams): Promise<OcaTrackingResponse> {
    try {
      // Validar parámetros
      if (!params.trackingNumber) {
        return { success: false, error: "Número de seguimiento requerido" }
      }

      // Construir el XML para la solicitud SOAP
      const xmlBody = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:oep="http://www.oca.com.ar/OEP">
          <soapenv:Header/>
          <soapenv:Body>
            <oep:Tracking_Pieza>
              <oep:Pieza>${params.trackingNumber}</oep:Pieza>
              <oep:NroDocumentoCliente></oep:NroDocumentoCliente>
            </oep:Tracking_Pieza>
          </soapenv:Body>
        </soapenv:Envelope>
      `

      // Realizar la solicitud a la API de OCA
      const response = await fetch(OCA_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/xml;charset=UTF-8",
          SOAPAction: "http://www.oca.com.ar/OEP/Tracking_Pieza",
        },
        body: xmlBody,
      })

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`)
      }

      const responseText = await response.text()

      // Parsear la respuesta XML
      if (responseText.includes("<Tracking_PiezaResult>")) {
        // Extraer el estado y eventos del envío
        const statusMatch = responseText.match(/<Estado>([^<]+)<\/Estado>/)

        // Extraer eventos (simplificado)
        const events: Array<{ date: string; description: string; location: string }> = []
        const eventsMatches = responseText.matchAll(
          /<Evento>.*?<Fecha>([^<]+)<\/Fecha>.*?<Descripcion>([^<]+)<\/Descripcion>.*?<Sucursal>([^<]+)<\/Sucursal>.*?<\/Evento>/gs,
        )

        for (const match of eventsMatches) {
          if (match[1] && match[2] && match[3]) {
            events.push({
              date: match[1],
              description: match[2],
              location: match[3],
            })
          }
        }

        return {
          success: true,
          status: statusMatch ? statusMatch[1] : "Desconocido",
          events: events.length > 0 ? events : undefined,
        }
      }

      return { success: false, error: "No se pudo obtener información de seguimiento" }
    } catch (error) {
      console.error("Error al consultar seguimiento con OCA:", error)
      return { success: false, error: `Error al consultar seguimiento: ${(error as Error).message}` }
    }
  }
}

// Exportar una instancia por defecto para uso general
export const ocaClient = new OcaClient()
