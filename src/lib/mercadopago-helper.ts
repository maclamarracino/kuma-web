// Función para verificar si la URL del sitio está correctamente formateada
export function validateSiteUrl(url: string | undefined): string {
    if (!url) {
      throw new Error("URL del sitio no configurada")
    }
  
    // Asegurarse de que la URL comience con http:// o https://
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`
    }
  
    // Eliminar la barra final si existe
    if (url.endsWith("/")) {
      url = url.slice(0, -1)
    }
  
    return url
  }
  
  // Función para construir las URLs de retorno
  export function buildReturnUrls(baseUrl: string) {
    return {
      success: `${baseUrl}/checkout/success`,
      failure: `${baseUrl}/checkout/failure`,
      pending: `${baseUrl}/checkout/pending`,
    }
  }
  