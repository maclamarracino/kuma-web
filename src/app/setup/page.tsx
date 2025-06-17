"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createAdminUser } from "@/src/app/actions/server/auth-actions"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Alert, AlertDescription } from "@/src/components/ui/alert"
import { AlertCircle, CheckCircle } from 'lucide-react'

export default function SetupPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await createAdminUser(formData)

      if (result.error) {
        setError(result.error)
        setIsLoading(false)
        return
      }

      if (result.success) {
        setSuccess(true)
        setIsLoading(false)
      }
    } catch (e) {
      setError("Ocurrió un error inesperado")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-serif">Kuma Montessori</h1>
          <h2 className="mt-6 text-2xl font-bold tracking-tight">Configuración Inicial</h2>
          <p className="mt-2 text-sm text-gray-600">Crea el primer usuario administrador</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mt-4 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-700">
              Usuario administrador creado con éxito. Ahora puedes{" "}
              <a href="/admin-login" className="font-medium underline">
                iniciar sesión
              </a>
              .
            </AlertDescription>
          </Alert>
        )}

        <form action={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" type="text" autoComplete="name" className="mt-1" />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required className="mt-1" />
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creando usuario..." : "Crear usuario administrador"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}


