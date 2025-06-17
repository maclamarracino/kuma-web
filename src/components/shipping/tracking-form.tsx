"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Loader2, Package, CheckCircle, AlertCircle, Clock } from "lucide-react"

interface TrackingEvent {
  date: string
  description: string
  location: string
}

interface TrackingResult {
  status: string
  events: TrackingEvent[]
}

export function TrackingForm() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!trackingNumber) {
      setError("Por favor ingresa un número de seguimiento")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/shipping/oca/tracking?trackingNumber=${trackingNumber}`)
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Error al consultar el seguimiento")
      }

      setTrackingResult({
        status: data.status,
        events: data.events || [],
      })
    } catch (error) {
      console.error("Error al consultar seguimiento:", error)
      setError(`Error al consultar el seguimiento: ${(error as Error).message}`)
      setTrackingResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Función para obtener el icono según el estado del envío
  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase()

    if (statusLower.includes("entregado") || statusLower.includes("delivered")) {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    } else if (
      statusLower.includes("transito") ||
      statusLower.includes("tránsito") ||
      statusLower.includes("in_transit")
    ) {
      return <Package className="h-5 w-5 text-blue-500" />
    } else if (statusLower.includes("problema") || statusLower.includes("devuelto") || statusLower.includes("error")) {
      return <AlertCircle className="h-5 w-5 text-red-500" />
    } else {
      return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  // Formatear fecha
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch (e) {
      return dateString
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-serif mb-6">Seguimiento de envío</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="tracking-number">Número de seguimiento</Label>
          <div className="flex mt-1">
            <Input
              id="tracking-number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Ingresa tu número de seguimiento"
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading} className="ml-2">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Consultar
            </Button>
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {trackingResult && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              {getStatusIcon(trackingResult.status)}
              <div>
                <h3 className="font-medium">Estado del envío</h3>
                <p className="text-gray-700">{trackingResult.status}</p>
              </div>
            </div>

            {trackingResult.events.length > 0 && (
              <div>
                <h3 className="font-medium mb-4">Historial de seguimiento</h3>
                <div className="space-y-4">
                  {trackingResult.events.map((event, index) => (
                    <div key={index} className="relative pl-8 pb-4">
                      {index < trackingResult.events.length - 1 && (
                        <div className="absolute left-3 top-3 h-full w-0.5 bg-gray-200"></div>
                      )}
                      <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{formatDate(event.date)}</p>
                        <p className="font-medium">{event.description}</p>
                        <p className="text-sm">{event.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  )
}
