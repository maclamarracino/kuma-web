"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Script from "next/script"

export function CheckoutForm() {
  const router = useRouter()
  const [isFormValid, setIsFormValid] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "Usuario",
    lastName: "De Prueba",
    email: "test@example.com",
    phone: "1155667788",
    address: "Calle Falsa 123",
    city: "Buenos Aires",
    state: "CABA",
    zip: "1414",
  })
  const [isMercadoPagoReady, setIsMercadoPagoReady] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentError, setPaymentError] = useState("")
  const [debugInfo, setDebugInfo] = useState<any>(null)

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Validar formulario
    const updatedFormData = { ...formData, [name]: value }
    const isValid = Object.values(updatedFormData).every((val) => val.trim() !== "")
    setIsFormValid(isValid)
  }

  // Inicializar Mercado Pago cuando el script esté cargado
  const handleMercadoPagoLoad = async () => {
    if (window.MercadoPago) {
      try {
        // Usar la clave pública de producción
        const publicKey = "APP_USR-71138be4-b7a8-48c3-ab0b-ae1d14f54fb1"
        console.log("Inicializando Mercado Pago con clave pública:", publicKey)

        const mp = new window.MercadoPago(publicKey, {
          locale: "es-ES",
        })

        const bricksBuilder = mp.bricks()

        const renderCardPaymentBrick = async (bricksBuilder: any) => {
          const settings = {
            initialization: {
              amount: 100.16, // Monto total del carrito
            },
            callbacks: {
              onReady: () => {
                console.log("Brick de pago listo")
                setIsMercadoPagoReady(true)
              },
              onSubmit: (cardFormData: any) => {
                setIsSubmitting(true)
                setPaymentError("")
                console.log(
                  "Datos del formulario de tarjeta:",
                  JSON.stringify(
                    {
                      ...cardFormData,
                      token: cardFormData.token ? "***" : undefined, // Ocultar token por seguridad
                    },
                    null,
                    2,
                  ),
                )

                // Enviar datos al backend
                return new Promise((resolve, reject) => {
                  fetch("/api/process-payment", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      cardFormData,
                      customerData: formData,
                    }),
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      console.log("Respuesta del servidor:", data)
                      setDebugInfo(data)
                      resolve(data)

                      if (data.status === "approved" || data.status === "in_process") {
                        // Redirigir a página de éxito
                        router.push(`/checkout/success?order_id=${data.order_id}`)
                      } else {
                        // Mostrar error con mensaje más amigable
                        let errorMessage = "Error en el pago. Por favor, intenta con otra tarjeta."

                        // Mensajes personalizados según el código de error
                        if (data.status_detail === "cc_rejected_high_risk") {
                          errorMessage =
                            "La tarjeta fue rechazada por razones de seguridad. Por favor, intenta con otra tarjeta o contacta a tu banco."
                        } else if (data.status_detail === "cc_rejected_insufficient_amount") {
                          errorMessage = "La tarjeta no tiene fondos suficientes. Por favor, intenta con otra tarjeta."
                        } else if (data.status_detail === "cc_rejected_bad_filled_security_code") {
                          errorMessage =
                            "El código de seguridad es incorrecto. Por favor, verifica e intenta nuevamente."
                        } else if (data.status_detail === "cc_rejected_bad_filled_date") {
                          errorMessage =
                            "La fecha de vencimiento es incorrecta. Por favor, verifica e intenta nuevamente."
                        } else if (data.status_detail === "cc_rejected_call_for_authorize") {
                          errorMessage =
                            "Debes autorizar el pago con tu banco. Por favor, contacta a tu banco e intenta nuevamente."
                        }

                        setPaymentError(errorMessage)
                        setIsSubmitting(false)
                      }
                    })
                    .catch((error) => {
                      console.error("Error en la solicitud:", error)
                      setDebugInfo({ error: error.message })
                      reject(error)
                      setPaymentError(`Error al procesar el pago: ${error.message}`)
                      setIsSubmitting(false)
                    })
                })
              },
              onError: (error: any) => {
                console.error("Error en el brick:", error)
                setDebugInfo({ brickError: error })
                setPaymentError(`Error en el formulario de pago: ${error.message}`)
                setIsSubmitting(false)
              },
            },
            customization: {
              visual: {
                style: {
                  theme: "default",
                },
              },
              paymentMethods: {
                maxInstallments: 6,
              },
            },
          }

          const cardPaymentBrickController = await bricksBuilder.create(
            "cardPayment",
            "cardPaymentBrick_container",
            settings,
          )
        }

        renderCardPaymentBrick(bricksBuilder)
      } catch (error) {
        console.error("Error al inicializar Mercado Pago:", error)
        setPaymentError("Error al inicializar el formulario de pago. Por favor, recarga la página.")
      }
    }
  }

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // El pago se procesa a través del callback onSubmit del Brick
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <Script id="mercadopago-js" src="https://sdk.mercadopago.com/js/v2" onLoad={handleMercadoPagoLoad} />

      <h2 className="text-xl font-semibold mb-4">Información de Contacto</h2>

      <form id="checkout-form" className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Apellido
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <h2 className="text-xl font-semibold mb-4 mt-8">Dirección de Envío</h2>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Dirección
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              Ciudad
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              Provincia
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
              Código Postal
            </label>
            <input
              type="text"
              id="zip"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4 mt-8">Método de Pago</h2>

        <div className="mb-4">
          <div className="flex items-center mb-4">
            <img
              src="https://www.mercadopago.com/org-img/MP3/API/logos/mercadopago.gif"
              alt="Mercado Pago"
              className="h-8 mr-2"
            />
            <span className="font-medium">Pagar con Mercado Pago</span>
          </div>

          {/* Tarjetas de prueba */}
          <div className="mb-6 p-4 bg-blue-50 rounded-md border border-blue-200">
            <h3 className="font-medium text-blue-800 mb-2">Información importante</h3>
            <p className="text-sm text-blue-700 mb-2">Para realizar un pago exitoso, asegúrate de:</p>
            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
              <li>Usar una tarjeta válida y con fondos suficientes</li>
              <li>Verificar que los datos ingresados sean correctos</li>
              <li>Asegurarte de que tu tarjeta esté habilitada para compras en línea</li>
              <li>Si tienes problemas, contacta a tu banco o intenta con otra tarjeta</li>
            </ul>
          </div>

          {/* Mercado Pago Form Container */}
          <div id="cardPaymentBrick_container"></div>

          {/* Error de pago */}
          {paymentError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {paymentError}
            </div>
          )}

          {/* Información de depuración */}
          {debugInfo && (
            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-700 text-xs">
              <details>
                <summary className="cursor-pointer font-medium">Información de depuración</summary>
                <pre className="mt-2 overflow-auto">{JSON.stringify(debugInfo, null, 2)}</pre>
              </details>
            </div>
          )}
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className="w-full bg-[#8a7e55] hover:bg-[#736a47] text-white py-3 px-4 rounded-md font-medium disabled:opacity-50"
            disabled={!isFormValid || !isMercadoPagoReady || isSubmitting}
          >
            {isSubmitting ? "Procesando..." : "Finalizar Compra"}
          </button>
        </div>
      </form>
    </div>
  )
}




