"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { logout } from "@/src/app/actions/server/auth-actions"
import { Loader2 } from "lucide-react"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    async function handleLogout() {
      try {
        const result = await logout()
        if (result?.success && result.redirectTo) {
          router.push(result.redirectTo)
        } else {
          router.push("/admin-login")
        }
      } catch (error) {
        console.error("Error al cerrar sesión:", error)
        router.push("/admin-login")
      }
    }

    handleLogout()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Cerrando sesión...</p>
      </div>
    </div>
  )
}
