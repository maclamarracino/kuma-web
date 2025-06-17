import { TrackingForm } from "@/src/components/shipping/tracking-form"

export const metadata = {
  title: "Seguimiento de Envío | Kuma Montessori",
  description: "Consulta el estado de tu envío con nuestro sistema de seguimiento",
}

export default function TrackingPage() {
  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-serif mb-4 text-center">Seguimiento de Envío</h1>
        <p className="text-gray-600 mb-8 text-center">
          Ingresa tu número de seguimiento para conocer el estado de tu pedido
        </p>

        <TrackingForm />

        <div className="mt-12 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-medium mb-4">Información sobre envíos</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">¿Cómo funciona el seguimiento?</h3>
              <p className="text-gray-600">
                Una vez que tu pedido es despachado, recibirás un correo electrónico con el número de seguimiento.
                Ingresa ese número en el formulario de arriba para conocer el estado actual de tu envío.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Tiempos de entrega</h3>
              <p className="text-gray-600">
                Los tiempos de entrega varían según tu ubicación. En general, las entregas en CABA se realizan en 24-48
                horas, mientras que para el resto del país pueden tomar entre 3-7 días hábiles.
              </p>
            </div>
            <div>
              <h3 className="font-medium">¿Problemas con tu envío?</h3>
              <p className="text-gray-600">
                Si tienes algún problema con tu envío o necesitas asistencia, no dudes en contactarnos a
                <a href="mailto:info@kumamontessori.com" className="text-primary">
                  {" "}
                  info@kumamontessori.com
                </a>{" "}
                o llamarnos al{" "}
                <a href="tel:+5491112345678" className="text-primary">
                  +54 9 11 1234-5678
                </a>
                .
              </p>
            </div>
            <div>
              <h3 className="font-medium">Números de seguimiento de prueba</h3>
              <p className="text-gray-600 text-sm">
                Para probar el sistema, puedes usar estos números de seguimiento de ejemplo:
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>
                  <code className="bg-gray-200 px-2 py-1 rounded">OCA123456789</code> - Envío en tránsito
                </li>
                <li>
                  <code className="bg-gray-200 px-2 py-1 rounded">OCA456789123</code> - Envío entregado
                </li>
                <li>
                  <code className="bg-gray-200 px-2 py-1 rounded">OCA789123456</code> - Envío pendiente
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

