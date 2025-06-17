"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { updateOrderStatus } from "@/src/app/actions/server/order-actions"
import { OrderStatusBadge } from "@/src/components/order-status-badge"

interface UpdateOrderStatusFormProps {
  orderId: string
  currentStatus: string
}

export function UpdateOrderStatusForm({ orderId, currentStatus }: UpdateOrderStatusFormProps) {
  const [status, setStatus] = useState(currentStatus)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async () => {
    if (status === currentStatus) {
      setMessage({ type: "error", text: "El estado seleccionado es el mismo que el actual" })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await updateOrderStatus(orderId, status)
      if (result.success) {
        setMessage({ type: "success", text: "Estado actualizado correctamente" })
      } else {
        setMessage({ type: "error", text: result.error || "Error al actualizar el estado" })
      }
    } catch (error) {
      setMessage({ type: "error", text: (error as Error).message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex-grow">
          <p className="text-sm font-medium mb-2">Estado actual</p>
          <OrderStatusBadge status={currentStatus} />
        </div>
        <div className="flex-grow">
          <p className="text-sm font-medium mb-2">Nuevo estado</p>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pendiente</SelectItem>
              <SelectItem value="PAID">Pagado</SelectItem>
              <SelectItem value="PROCESSING">En proceso</SelectItem>
              <SelectItem value="SHIPPED">Enviado</SelectItem>
              <SelectItem value="DELIVERED">Entregado</SelectItem>
              <SelectItem value="CANCELLED">Cancelado</SelectItem>
              <SelectItem value="REFUNDED">Reembolsado</SelectItem>
              <SelectItem value="FAILED">Fallido</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {message && (
        <div
          className={`p-3 rounded-md ${
            message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <Button onClick={handleSubmit} disabled={isSubmitting || status === currentStatus}>
        {isSubmitting ? "Actualizando..." : "Actualizar Estado"}
      </Button>
    </div>
  )
}
