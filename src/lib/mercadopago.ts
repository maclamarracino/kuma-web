import { MercadoPagoConfig } from "mercadopago"

// Función para obtener el cliente de Mercado Pago configurado
export function getMercadoPagoClient() {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN
  if (!accessToken) {
    throw new Error("MERCADO_PAGO_ACCESS_TOKEN no está configurado")
  }

  return new MercadoPagoConfig({
    accessToken,
  })
}

// Función para validar y formatear la URL del sitio
export function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

  if (!siteUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL no está configurado")
  }

  let formattedUrl = siteUrl
  if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
    formattedUrl = `https://${formattedUrl}`
  }

  if (formattedUrl.endsWith("/")) {
    formattedUrl = formattedUrl.slice(0, -1)
  }

  return formattedUrl
}

// Función para construir las URLs de retorno
export function getReturnUrls() {
  const siteUrl = getSiteUrl()

  const urls = {
    success: `${siteUrl}/checkout/success`,
    failure: `${siteUrl}/checkout/failure`,
    pending: `${siteUrl}/checkout/pending`,
    notification: `${siteUrl}/api/webhooks/mercadopago`,
  }

  // Log para ver en consola qué URLs se están generando
  console.log("🔁 Return URLs generadas:", urls)

  return urls
}

