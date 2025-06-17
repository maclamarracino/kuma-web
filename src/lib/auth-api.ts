// src/lib/auth-api.ts
import { cookies } from "next/headers"
import { prisma } from "./prisma"

export async function getSessionFromCookie() {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session_id")?.value

    if (!sessionId) return null

    const user = await prisma.user.findUnique({
      where: { id: sessionId },
    })

    return user
  } catch (error) {
    console.error("Error al obtener la sesión:", error)
    return null
  }
}

