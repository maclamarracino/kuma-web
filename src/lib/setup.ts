import { prisma } from "./prisma"

// Verificar si ya existe un usuario administrador
export async function hasAdminUser() {
  try {
    const adminCount = await prisma.user.count({
      where: {
        role: "ADMIN",
      },
    })
    return adminCount > 0
  } catch (error) {
    console.error("Error al verificar usuarios admin:", error)
    // Si hay error de conexión, asumimos que no hay usuarios
    return false
  }
}

// Verificar si la base de datos está configurada
export async function isDatabaseSetup() {
  try {
    // Intentar hacer una consulta simple
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error("Error de conexión a la base de datos:", error)
    return false
  }
}
