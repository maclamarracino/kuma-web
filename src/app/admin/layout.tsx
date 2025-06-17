import type { ReactNode } from "react"
import { getSession, logoutAction } from "@/src/app/actions/server/auth-actions"
import { redirect } from "next/navigation"
import { Button } from "@/src/components/ui/button"

interface AdminLayoutProps {
  children: ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Verificar sesión en el servidor
  const session = await getSession()

  // Si no hay sesión, redirigir al login
  if (!session) {
    redirect("/admin-login")
  }

  // Si el usuario no es admin, no permitir acceso
  if (session.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r">
          <div className="p-6">
            <h1 className="text-xl font-serif">Kuma Admin</h1>
          </div>
          <nav className="mt-6">
            <div className="px-6 py-2">
              <a href="/admin/dashboard" className="block text-gray-700 hover:text-primary">
                Dashboard
              </a>
            </div>
            <div className="px-6 py-2">
              <a href="/admin/products" className="block text-gray-700 hover:text-primary">
                Productos
              </a>
            </div>
            <div className="px-6 py-2">
              <a href="/admin/orders" className="block text-gray-700 hover:text-primary">
                Pedidos
              </a>
            </div>
            <div className="px-6 py-2">
              <a href="/admin/users" className="block text-gray-700 hover:text-primary">
                Usuarios
              </a>
            </div>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <header className="bg-white shadow-sm border-b px-6 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Panel de Administración</h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Bienvenido, {session.name || session.email}</span>
                <form action={logoutAction}>
                  <Button type="submit" variant="outline" size="sm">
                    Cerrar sesión
                  </Button>
                </form>
              </div>
            </div>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}




