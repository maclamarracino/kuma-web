import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Instagram, Facebook, Clock } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"

export function SiteFooter() {
  return (
    <footer className="bg-blue-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo y Descripción */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/logo.png"
                alt="Kuma Montessori"
                width={150}
                height={40}
                className="h-auto w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Productos Montessori diseñados para el desarrollo y aprendizaje de los niños. Calidad, creatividad y
              educación en cada producto.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://instagram.com"
                target="_blank"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://facebook.com"
                target="_blank"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/productos" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/categorias" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Categorías
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/carrito" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Carrito
                </Link>
              </li>
            </ul>
          </div>

          {/* Información de Contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">info@kumamontessori.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">+54 11 1234-5678</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                <span className="text-gray-300 text-sm">Buenos Aires, Argentina</span>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                <span className="text-gray-300 text-sm">Lun-Vie: 9:00 - 18:00</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Newsletter</h3>
            <p className="text-gray-300 text-sm">Suscríbete para recibir novedades y ofertas especiales.</p>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Tu email"
                className="bg-blue-900/50 border-blue-800 text-white placeholder-gray-400"
              />
              <Button className="w-full">Suscribirse</Button>
            </div>
          </div>
        </div>

        {/* Métodos de Pago */}
        <div className="border-t border-blue-900 mt-8 pt-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-4">Métodos de pago aceptados</p>
            <div className="flex flex-wrap justify-center items-center gap-3">
              <div className="bg-white rounded px-3 py-1.5">
                <span className="text-blue-600 font-bold text-xs">MERCADO PAGO</span>
              </div>
              <div className="bg-white rounded px-3 py-1.5">
                <span className="text-blue-800 font-bold text-xs">VISA</span>
              </div>
              <div className="bg-white rounded px-3 py-1.5">
                <span className="text-red-600 font-bold text-xs">MASTERCARD</span>
              </div>
              <div className="bg-white rounded px-3 py-1.5">
                <span className="text-orange-600 font-bold text-xs">AMERICAN EXPRESS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Información Legal */}
        <div className="border-t border-blue-900 mt-6 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Kuma Montessori. Todos los derechos reservados.
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link href="/politica-privacidad" className="text-gray-400 hover:text-white text-sm transition-colors">
                Política de Privacidad
              </Link>
              <Link href="/terminos-condiciones" className="text-gray-400 hover:text-white text-sm transition-colors">
                Términos y Condiciones
              </Link>
              <Link href="/politica-envios" className="text-gray-400 hover:text-white text-sm transition-colors">
                Política de Envíos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
