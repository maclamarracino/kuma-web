import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"

export function Footer() {
  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-lg font-medium mb-4">Kuma Montessori</h3>
            <p className="text-gray-600 mb-4">
              Materiales educativos de calidad para el desarrollo de tus hijos siguiendo la filosofía Montessori.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-shadow"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-shadow"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-shadow"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-shadow"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/productos" className="text-gray-600 hover:text-primary">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="text-gray-600 hover:text-primary">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-600 hover:text-primary">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/preguntas-frecuentes" className="text-gray-600 hover:text-primary">
                  Preguntas frecuentes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 text-primary" />
                <span className="text-gray-600">Av. Corrientes 1234, CABA, Argentina</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-primary" />
                <a href="tel:+5491112345678" className="text-gray-600 hover:text-primary">
                  +54 9 11 1234-5678
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-primary" />
                <a href="mailto:info@kumamontessori.com" className="text-gray-600 hover:text-primary">
                  info@kumamontessori.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Suscríbete</h3>
            <p className="text-gray-600 mb-4">Recibe nuestras novedades y ofertas especiales.</p>
            <div className="flex space-x-2">
              <Input type="email" placeholder="Tu email" className="bg-white" />
              <Button>Enviar</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Kuma Montessori. Todos los derechos reservados.
          </p>
          <div className="flex space-x-4">
            <Link href="/terminos-y-condiciones" className="text-sm text-gray-500 hover:text-primary">
              Términos y condiciones
            </Link>
            <Link href="/politica-de-privacidad" className="text-sm text-gray-500 hover:text-primary">
              Política de privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
