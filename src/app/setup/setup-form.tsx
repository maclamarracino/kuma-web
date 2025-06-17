"use client"

import { useState } from "react"
import { createAdminUser } from "@/src/app/actions/server/auth-actions"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Alert, AlertDescription } from "@/src/components/ui/alert"
import Link from "next/link"

export default function SetupForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    try {
      const result = await createAdminUser(formData)

      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        setSuccess(true)
      }
    } catch (error) {
      setError("Error al crear usuario: " + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Configuración Completada</CardTitle>
            <CardDescription>El usuario administrador ha sido creado correctamente</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                Ya puedes iniciar sesión en el panel de administración con las credenciales que has proporcionado.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Link href="/admin-login" className="w-full">
              <Button className="w-full">Ir a Iniciar Sesión</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Configuración Inicial</CardTitle>
          <CardDescription>Crea el primer usuario administrador</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creando usuario..." : "Crear Usuario Administrador"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
