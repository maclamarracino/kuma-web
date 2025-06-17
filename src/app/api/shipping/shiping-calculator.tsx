"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group"
import { formatPrice } from "@/src/lib/utils"
import { Loader2 } from "lucide-react"

interface ShippingOption {
  id: string
  name: string
  price: number
  deliveryTime?: string
}

interface ShippingCalculatorProps {
  cartTotal: number
  onShippingSelect: (option: ShippingOption | null) => void
}

export function ShippingCalculator({ cartTotal, onShippingSelect }: ShippingCalculatorProps) {
  const [postalCode, setPostalCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  // Origen fijo para la tienda (código postal de la tienda)
  const STORE_POSTAL_CODE = "1425" // Ejemplo: CABA

  // Peso estimado del carrito (en kg)
  const estimatedWeight = 1 // Valor por defecto, idealmente calculado según los productos

  const calculateShipping = async () => {
    if (!postalCode || postalCode.length < 4) {
      setError("Por favor ingresa un código postal válido")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Llamar a la API de cotización de OCA
      const response = await fetch("/api/shipping/oca/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postalCodeOrigin: STORE_POSTAL_CODE,
          postalCodeDestination: postalCode,
          weight: estimatedWeight,
          declaredValue: cartTotal,
          packages: 1,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Error al calcular el envío")
      }

      // Crear opciones de envío
      const options: ShippingOption[] = [
        {
          id: "oca-standard",
          name: "OCA Estándar",
          price: data.price,
          deliveryTime: data.deliveryTime || "3-5 días hábiles",
        },
      ]

      // Agregar opción de retiro en tienda
      options.push({
        id: "pickup",
        name: "Retiro en tienda",
        price: 0,
        deliveryTime: "Inmediato",
      })

      setShippingOptions(options)

      // Seleccionar la primera opción por defecto
      if (options.length > 0) {
        setSelectedOption(options[0].id)
        onShippingSelect(options[0])
      }
    } catch (error) {
      console.error("Error al calcular envío:", error)
      setError(`Error al calcular el envío: ${(error as Error).message}`)
      setShippingOptions([])
      setSelectedOption(null)
      onShippingSelect(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Manejar cambio de opción de envío
  const handleOptionChange = (value: string) => {
    setSelectedOption(value)
    const option = shippingOptions.find((opt) => opt.id === value)
    if (option) {
      onShippingSelect(option)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Opciones de envío</h3>

      <div className="flex space-x-2">
        <div className="flex-1">
          <Label htmlFor="postal-code">Código Postal</Label>
          <Input
            id="postal-code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="Ingresa tu código postal"
            className="mt-1"
          />
        </div>
        <div className="flex items-end">
          <Button onClick={calculateShipping} disabled={isLoading || !postalCode} className="mb-0">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Calcular
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {shippingOptions.length > 0 && (
        <RadioGroup value={selectedOption || ""} onValueChange={handleOptionChange} className="mt-4">
          {shippingOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2 border p-3 rounded-md">
              <RadioGroupItem value={option.id} id={option.id} />
              <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                <div className="flex justify-between">
                  <div>
                    <span className="font-medium">{option.name}</span>
                    <p className="text-sm text-gray-500">{option.deliveryTime}</p>
                  </div>
                  <span className="font-medium">{formatPrice(option.price)}</span>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}
    </div>
  )
}
