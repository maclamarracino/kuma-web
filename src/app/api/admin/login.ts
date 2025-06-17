import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/src/lib/prisma"
import { comparePasswords } from "@/src/lib/auth"
import { serialize } from "cookie"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end()
  }

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña son requeridos" })
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    return res.status(401).json({ error: "Credenciales inválidas" })
  }

  const passwordMatch = await comparePasswords(password, user.password)

  if (!passwordMatch) {
    return res.status(401).json({ error: "Credenciales inválidas" })
  }

  if (user.role !== "ADMIN") {
    return res.status(403).json({ error: "No tienes permisos para acceder al panel de administración" })
  }

  // Setear cookie de sesión HTTPOnly
  res.setHeader("Set-Cookie", serialize("session_id", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 semana
    path: "/",
    sameSite: "lax",
  }))

  return res.status(200).json({ success: true, redirectTo: "/admin/dashboard" })
}
