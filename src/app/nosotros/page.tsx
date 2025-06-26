export default function NosotrosPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Sobre Kuma Montessori</h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Nuestra Misión</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              En Kuma Montessori, creemos profundamente en el potencial innato de cada niño para aprender y crecer.
              Nuestra misión es proporcionar materiales educativos Montessori auténticos y de alta calidad que respeten
              el desarrollo natural del niño y fomenten su independencia, creatividad y amor por el aprendizaje.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Cada producto en nuestra tienda ha sido cuidadosamente seleccionado siguiendo los principios pedagógicos
              de María Montessori, garantizando que cumplan con los estándares más altos de calidad educativa y
              seguridad.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">¿Por Qué Elegir Montessori?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-medium mb-3">Desarrollo Integral</h3>
                <p className="text-gray-700">
                  Los materiales Montessori están diseñados para desarrollar no solo habilidades académicas, sino
                  también la independencia, la concentración, la coordinación y la confianza en sí mismo.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-3">Aprendizaje Natural</h3>
                <p className="text-gray-700">
                  Respetamos los períodos sensibles de desarrollo, permitiendo que cada niño aprenda de manera natural y
                  a su propio ritmo, sin presiones externas.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-3">Calidad Garantizada</h3>
                <p className="text-gray-700">
                  Todos nuestros materiales están fabricados con materiales naturales y seguros, diseñados para durar y
                  resistir el uso intensivo de los niños.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-3">Apoyo Continuo</h3>
                <p className="text-gray-700">
                  Ofrecemos asesoramiento y recursos para padres y educadores, ayudándoles a implementar efectivamente
                  la metodología Montessori en casa o en el aula.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Nuestro Compromiso</h2>
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                Estamos comprometidos con la excelencia en cada aspecto de nuestro servicio. Desde la selección
                cuidadosa de nuestros productos hasta el envío seguro y el soporte post-venta, trabajamos
                incansablemente para superar las expectativas de nuestros clientes y contribuir al desarrollo óptimo de
                cada niño.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Contacto</h2>
            <p className="text-gray-700 mb-4">
              ¿Tienes preguntas sobre nuestros productos o la metodología Montessori? Estamos aquí para ayudarte.
            </p>
            <div className="space-y-2">
              <p>
                <strong>Email:</strong> info@kumamontessori.com
              </p>
              <p>
                <strong>Teléfono:</strong> +54 11 1234-5678
              </p>
              <p>
                <strong>Horarios:</strong> Lunes a Viernes, 9:00 - 18:00
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
