import Image from "next/image"

export function OrderSummary() {
  // En una implementación real, estos datos vendrían de un estado global o contexto
  const cartItems = [
    {
      id: 1,
      name: "Spinning Drum",
      price: 28.5,
      quantity: 1,
      image: "/images/spinning-drum.jpg",
    },
    {
      id: 2,
      name: "Koala Wooden Hand Rattle",
      price: 25.65,
      quantity: 1,
      image: "/images/koala-rattle.jpg",
    },
    {
      id: 3,
      name: "Object Permanence Box",
      price: 24.5,
      quantity: 1,
      image: "/images/permanence-box.jpg",
    },
  ]

  // Calcular totales
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 4.99
  const tax = subtotal * 0.21 // IVA 21%
  const total = subtotal + shipping + tax

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>

      <div className="space-y-4 mb-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between pb-4 border-b">
            <div className="flex items-center">
              <div className="relative w-16 h-16 mr-4">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover rounded" />
              </div>
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
              </div>
            </div>
            <span className="font-semibold">€{item.price.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>€{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Envío</span>
          <span>€{shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>IVA (21%)</span>
          <span>€{tax.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
        <span>Total</span>
        <span>€{total.toFixed(2)}</span>
      </div>
    </div>
  )
}
