import { cn } from "@/src/lib/utils"

interface OrderStatusBadgeProps {
  status: string
  className?: string
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  // Función para obtener el texto del estado en español
  const getStatusText = (status: string) => {
    switch (status) {
      case "PAID":
        return "Pagado"
      case "PENDING":
        return "Pendiente"
      case "PROCESSING":
        return "En proceso"
      case "SHIPPED":
        return "Enviado"
      case "DELIVERED":
        return "Entregado"
      case "CANCELLED":
        return "Cancelado"
      case "REFUNDED":
        return "Reembolsado"
      case "FAILED":
        return "Fallido"
      default:
        return status
    }
  }

  // Función para obtener las clases de color según el estado
  const getStatusClasses = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "PROCESSING":
        return "bg-blue-100 text-blue-800"
      case "SHIPPED":
        return "bg-indigo-100 text-indigo-800"
      case "DELIVERED":
        return "bg-green-100 text-green-800"
      case "CANCELLED":
        return "bg-gray-100 text-gray-800"
      case "REFUNDED":
        return "bg-purple-100 text-purple-800"
      case "FAILED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        getStatusClasses(status),
        className,
      )}
    >
      {getStatusText(status)}
    </span>
  )
}

