"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-serif mb-6">Dashboard</h1>

      {/* Stats del sistema */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Productos</CardTitle>
            <CardDescription>Total de productos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">24</p>
            <Link href="/admin/products" className="text-sm text-blue-600 hover:underline">
              Ver productos
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Categorías</CardTitle>
            <CardDescription>Total de categorías</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">5</p>
            <Link href="/admin/categories" className="text-sm text-blue-600 hover:underline">
              Ver categorías
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pedidos</CardTitle>
            <CardDescription>Total de pedidos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">12</p>
            <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline">
              Ver pedidos
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Ventas</CardTitle>
            <CardDescription>Total de ventas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">$45,230</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

