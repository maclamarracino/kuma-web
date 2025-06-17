"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

// Fix the type declaration to avoid conflicts
declare global {
  interface Window {
    // Use a more flexible type that won't conflict with existing declarations
    MercadoPago: any
  }
}

// Create a type for the MercadoPago instance for better type safety in our component
type MercadoPagoInstance = {
  cardForm: (options: any) => any
}

export default function PaymentForm() {
  const [mercadopago, setMercadopago] = useState<MercadoPagoInstance | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const cardFormRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    email: "",
    docNumber: "",
  })

  useEffect(() => {
    const loadMercadoPago = async () => {
      try {
        // Check if MercadoPago is already loaded
        if (window.MercadoPago) {
          // Use type assertion to tell TypeScript about the constructor
          const MP = window.MercadoPago as unknown as { new (publicKey: string): MercadoPagoInstance }
          const mp = new MP(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY || "")
          setMercadopago(mp)
          setLoading(false)
          return
        }

        // If not loaded, create and load the script
        const script = document.createElement("script")
        script.src = "https://sdk.mercadopago.com/js/v2"
        script.async = true

        script.onload = () => {
          // Use type assertion here as well
          const MP = window.MercadoPago as unknown as { new (publicKey: string): MercadoPagoInstance }
          const mp = new MP(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY || "")
          setMercadopago(mp)
          setLoading(false)
        }

        script.onerror = () => {
          setError("Failed to load MercadoPago SDK")
          setLoading(false)
        }

        document.body.appendChild(script)

        return () => {
          document.body.removeChild(script)
        }
      } catch (err) {
        setError("An error occurred while initializing MercadoPago")
        setLoading(false)
      }
    }

    loadMercadoPago()
  }, [])

  useEffect(() => {
    if (mercadopago && cardFormRef.current) {
      try {
        // Clear previous content
        cardFormRef.current.innerHTML = ""

        const cardForm = mercadopago.cardForm({
          amount: "100.00",
          autoMount: true,
          form: {
            id: "form-checkout",
            cardholderName: {
              id: "form-checkout__cardholderName",
              placeholder: "Cardholder name",
            },
            cardholderEmail: {
              id: "form-checkout__cardholderEmail",
              placeholder: "Email",
            },
            cardNumber: {
              id: "form-checkout__cardNumber",
              placeholder: "Card number",
            },
            expirationDate: {
              id: "form-checkout__expirationDate",
              placeholder: "MM/YY",
            },
            securityCode: {
              id: "form-checkout__securityCode",
              placeholder: "CVV",
            },
            installments: {
              id: "form-checkout__installments",
              placeholder: "Installments",
            },
            identificationType: {
              id: "form-checkout__identificationType",
            },
            identificationNumber: {
              id: "form-checkout__identificationNumber",
              placeholder: "Identification number",
            },
            issuer: {
              id: "form-checkout__issuer",
              placeholder: "Issuer",
            },
          },
          callbacks: {
            onFormMounted: (error: any) => {
              if (error) {
                console.error("Form Mounted error: ", error)
                setError("Error mounting payment form")
              }
            },
            onSubmit: (event: any) => {
              event.preventDefault()

              // Handle form submission here
              // You would typically send the form data to your server
              // to create a payment through MercadoPago's API

              // Example of getting form data
              const formData = cardForm.getCardFormData()
              console.log("Form submitted", formData)
              console.log("Card form data", formData)
            },
            onFetching: (resource: any) => {
              console.log("Fetching resource: ", resource)
            },
          },
        })
      } catch (err) {
        console.error("Error initializing card form:", err)
        setError("Failed to initialize payment form")
      }
    }
  }, [mercadopago])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6 flex justify-center items-center h-60">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading payment form...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center text-red-500">
            <p>{error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>Enter your payment information to complete your purchase</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-checkout">
          <div className="space-y-4">
            <div>
              <Label htmlFor="form-checkout__cardholderEmail">Email</Label>
              <Input
                id="form-checkout__cardholderEmail"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                type="email"
                required
              />
            </div>

            <div>
              <Label htmlFor="form-checkout__cardholderName">Cardholder Name</Label>
              <div id="form-checkout__cardholderName" className="border rounded-md p-2 h-10"></div>
            </div>

            <div>
              <Label htmlFor="form-checkout__cardNumber">Card Number</Label>
              <div id="form-checkout__cardNumber" className="border rounded-md p-2 h-10"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="form-checkout__expirationDate">Expiration Date</Label>
                <div id="form-checkout__expirationDate" className="border rounded-md p-2 h-10"></div>
              </div>
              <div>
                <Label htmlFor="form-checkout__securityCode">Security Code</Label>
                <div id="form-checkout__securityCode" className="border rounded-md p-2 h-10"></div>
              </div>
            </div>

            <div>
              <Label htmlFor="form-checkout__installments">Installments</Label>
              <div id="form-checkout__installments" className="border rounded-md p-2 h-10"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="form-checkout__identificationType">Document Type</Label>
                <div id="form-checkout__identificationType" className="border rounded-md p-2 h-10"></div>
              </div>
              <div>
                <Label htmlFor="form-checkout__identificationNumber">Document Number</Label>
                <div id="form-checkout__identificationNumber" className="border rounded-md p-2 h-10"></div>
              </div>
            </div>

            <div>
              <Label htmlFor="form-checkout__issuer">Issuer</Label>
              <div id="form-checkout__issuer" className="border rounded-md p-2 h-10"></div>
            </div>
          </div>

          <div ref={cardFormRef}></div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="form-checkout" className="w-full">
          Pay Now
        </Button>
      </CardFooter>
    </Card>
  )
}


