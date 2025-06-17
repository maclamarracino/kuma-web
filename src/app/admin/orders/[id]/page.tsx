import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/src/lib/prisma"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { OrderStatusBadge } from "@/src/components/order-status-badge"
import { formatPrice } from "@/src/lib/utils"
import { UpdateOrderStatusForm } from "../update-status-form"

interface OrderPageProps {
  params: {
    id: string
  }
}

export default async function OrderPage({ params }: OrderPageProps) {
  if (!params?.id) {
    notFound()
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  take: 1,
                },
              },
            },
          },
        },
      },
    })

    if (!order) {
      notFound()
    }

    return (
      <div>
        <div className="mb-6">
          <Link href="/admin/orders">
            <Button variant="outline">← Volver a órdenes</Button>
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              Orden #{order.id.substring(0, 8)}
              <span className="ml-3">
                <OrderStatusBadge status={order.status} />
              </span>
            </h1>
            <p className="text-gray-500">
              Creada el{" "}
              {new Date(order.createdAt).toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Productos</CardTitle>
                <CardDescription>Productos incluidos en esta orden</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 py-2 border-b last:border-0">
                      <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                        {item.product?.images && item.product.images.length > 0 ? (
                          <img
                            src={item.product.images[0].url || "/placeholder.svg"}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-gray-500">
                          {formatPrice(item.unitPrice)} x {item.quantity}
                        </p>
                      </div>
                      <div className="font-medium">{formatPrice(item.unitPrice * item.quantity)}</div>
                    </div>
                  ))}

                  <div className="flex justify-between pt-4 font-bold">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información de Pago</CardTitle>
                <CardDescription>Detalles del pago y estado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">ID de Preferencia</p>
                    <p>{order.paymentPreferenceId || "No disponible"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">ID de Pago</p>
                    <p>{order.paymentId || "No disponible"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Método de Pago</p>
                    <p className="capitalize">{order.paymentMethod || "No disponible"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Estado del Pago</p>
                    <p className="capitalize">{order.paymentStatus || "No disponible"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actualizar Estado</CardTitle>
                <CardDescription>Cambiar el estado actual de la orden</CardDescription>
              </CardHeader>
              <CardContent>
                <UpdateOrderStatusForm orderId={order.id} currentStatus={order.status} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cliente</CardTitle>
                <CardDescription>Información del cliente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nombre</p>
                    <p>{order.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p>{order.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Teléfono</p>
                    <p>{order.customerPhone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dirección de Envío</CardTitle>
                <CardDescription>Información de entrega</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Dirección</p>
                    <p>{order.shippingAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Ciudad</p>
                    <p>{order.shippingCity}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Código Postal</p>
                    <p>{order.shippingPostalCode}</p>
                  </div>
                  {order.notes && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Notas</p>
                      <p>{order.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error al cargar la orden:", error)
    return (
      <div>
        <div className="mb-6">
          <Link href="/admin/orders">
            <Button variant="outline">← Volver a órdenes</Button>
          </Link>
        </div>
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <h1 className="text-2xl font-bold text-red-700 mb-2">Error</h1>
          <p className="text-red-600 mb-4">Ocurrió un error al cargar la orden.</p>
          <p className="text-sm text-red-500">{(error as Error).message}</p>
        </div>
      </div>
    )
  }
}
