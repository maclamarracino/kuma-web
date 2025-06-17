"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/src/lib/prisma"
import { requireAdmin } from "@/src/lib/auth"

// Actualizar el estado de una orden
export async function updateOrderStatus(orderId: string, status: string) {
  try {
    // Verificar que el usuario es admin
    await requireAdmin()

    // Validar el estado
    const validStatuses = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED", "FAILED"]
    if (!validStatuses.includes(status)) {
      return { success: false, error: "Estado no válido" }
    }

    // Actualizar el estado de la orden
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    })

    revalidatePath(`/admin/orders/${orderId}`)
    revalidatePath("/admin/orders")
    return { success: true }
  } catch (error) {
    console.error("Error al actualizar el estado de la orden:", error)
    return { success: false, error: (error as Error).message }
  }
}

// Obtener estadísticas de órdenes para el dashboard
export async function getOrderStats() {
  try {
    // Verificar que el usuario es admin
    await requireAdmin()

    // Obtener el total de órdenes
    const totalOrders = await prisma.order.count()

    // Obtener el total de ventas
    const salesResult = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: "PAID",
      },
    })
    const totalSales = salesResult._sum.total || 0

    // Obtener órdenes por estado
    const ordersByStatus = await prisma.order.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    })

    // Obtener órdenes recientes
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            items: true,
          },
        },
      },
    })

    return {
      success: true,
      stats: {
        totalOrders,
        totalSales,
        ordersByStatus: ordersByStatus.reduce(
          (acc, curr) => {
            acc[curr.status] = curr._count.id
            return acc
          },
          {} as Record<string, number>,
        ),
        recentOrders,
      },
    }
  } catch (error) {
    console.error("Error al obtener estadísticas de órdenes:", error)
    return { success: false, error: (error as Error).message }
  }
}
