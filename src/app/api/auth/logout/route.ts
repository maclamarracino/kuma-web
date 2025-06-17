import { type NextRequest, NextResponse } from "next/server"
import { logout } from "@/src/app/actions/server/auth-actions"

export async function POST(request: NextRequest) {
  try {
    const result = await logout()

    if (result.success) {
      return NextResponse.redirect(new URL(result.redirectTo, request.url))
    }

    return NextResponse.json({ error: "Error al cerrar sesión" }, { status: 500 })
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
