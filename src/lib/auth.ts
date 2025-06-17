import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "./prisma"
import * as bcrypt from "bcryptjs"

export async function getSession() {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session_id")?.value

    if (!sessionId) {
      return null
    }

    // Intentar obtener el usuario
    const user = await prisma.user.findUnique({
      where: { id: sessionId },
    })

    return user
  } catch (error) {
    console.error("Error al obtener la sesión:", error)

    // Verificar si es un error de conexión a la base de datos
    if (
      error instanceof Error &&
      (error.message.includes("Can't reach database server") || error.message.includes("P1001"))
    ) {
      throw new Error("Error de conexión a la base de datos: " + error.message)
    }

    return null
  }
}

export async function requireAdmin(pathname: string) {
  try {
    // Permitir acceso libre a /admin/setup solo si no hay ningún admin en la BD
    if (pathname === "/admin/setup") {
      const adminCount = await prisma.user.count({
        where: { role: "ADMIN" },
      });
      if (adminCount === 0) {
        // No hay admins, dejamos pasar para crear el primero
        return null;
      }
    }

    // El flujo normal: verificar sesión y rol
    const user = await getSession();

    if (!user || user.role !== "ADMIN") {
      redirect("/admin-login");
    }

    return user;
  } catch (error) {
    console.error("Error al verificar admin:", error);

    if (
      error instanceof Error &&
      (error.message.includes("Error de conexión a la base de datos") ||
        error.message.includes("Can't reach database server"))
    ) {
      throw error;
    }

    redirect("/admin-login");
  }
}


export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function comparePasswords(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword)
}
