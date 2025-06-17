import { NextResponse } from "next/server"
import { prisma } from "@/src/lib/prisma"
import { comparePasswords } from "@/src/lib/auth"
import { serialize } from "cookie"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    const passwordMatch = await comparePasswords(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "No tienes permisos para acceder al panel de administración" }, { status: 403 })
    }

    const cookie = serialize("session_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
    })

    const response = NextResponse.json(
      { success: true, redirectTo: "/admin/dashboard" },
      { status: 200 }
    )

    response.headers.set("Set-Cookie", cookie)
    return response
  } catch (error) {
    console.error("Error en login API:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

