export async function uploadProductImage(productId: string, formData: FormData) {
  try {
    const response = await fetch(`/api/products/upload-image/${productId}`, {
      method: "POST",
      body: formData,
    });

    const text = await response.text();

    if (!response.ok) {
      // Intentar parsear el texto como JSON para obtener el error
      try {
        const errorData = JSON.parse(text);
        return { error: errorData.error || "Error desconocido al subir la imagen" };
      } catch {
        return { error: text || "Error desconocido al subir la imagen" };
      }
    }

    // Si la respuesta es ok, parsear JSON normalmente
    return JSON.parse(text);
  } catch (err) {
    console.error("Error al subir la imagen:", err);
    return { error: (err as Error).message };
  }
}

