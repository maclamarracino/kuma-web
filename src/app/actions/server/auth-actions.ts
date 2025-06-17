"use server"

import { cookies } from "next/headers"
import { prisma } from "@/src/lib/prisma"
import { comparePasswords, hashPassword } from "@/src/lib/auth"
import { redirect } from "next/navigation"

export async function login(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      return { error: "Email y contraseña son requeridos" }
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { error: "Credenciales inválidas" }
    }

    const passwordMatch = await comparePasswords(password, user.password)

    if (!passwordMatch) {
      return { error: "Credenciales inválidas" }
    }

    // Si el usuario no es admin, no permitir acceso
    if (user.role !== "ADMIN") {
      return { error: "No tienes permisos para acceder al panel de administración" }
    }

    // Guardar el ID del usuario en la cookie
    const cookieStore = await cookies()
    cookieStore.set({
      name: "session_id",
      value: user.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: "/",
      sameSite: "lax",
    })

    return {
      success: true,
      redirectTo: "/admin/dashboard",
    }
  } catch (error) {
    console.error("Error de login:", error)
    return { error: "Error al iniciar sesión: " + (error as Error).message }
  }
}

export async function logout() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("session_id")
    return { success: true, redirectTo: "/admin-login" }
  } catch (error) {
    console.error("Error al cerrar sesión:", error)
    return { error: "Error al cerrar sesión" }
  }
}

export async function createAdminUser(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const name = formData.get("name") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (!email || !password || !confirmPassword) {
      return { error: "Todos los campos son requeridos" }
    }

    if (password !== confirmPassword) {
      return { error: "Las contraseñas no coinciden" }
    }

    // Verificar si ya existe un usuario admin
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN" },
    })

    if (adminCount > 0) {
      return { error: "Ya existe un usuario administrador" }
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        name: name || undefined,
        password: hashedPassword,
        role: "ADMIN",
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Error al crear usuario admin:", error)
    return { error: "Error al crear usuario administrador: " + (error as Error).message }
  }
}

// Función para verificar si el usuario está autenticado
export async function getSession() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("session_id")?.value

    if (!userId) {
      return null
    }

    // Buscar el usuario directamente por ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    return user
  } catch (error) {
    console.error("Error al verificar sesión:", error)
    return null
  }
}

// Server Action para manejar logout con redirección
export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("session_id")
  redirect("/admin-login")
}




