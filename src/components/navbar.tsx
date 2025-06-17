"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CartDrawer } from "./cart-drawer"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Facebook, Instagram, Twitter, Youtube, Phone, User, Search, Menu, X } from "lucide-react"

// Datos de categorías simulados para evitar errores si la API no está disponible
const fallbackCategories = [
  {
    id: 1,
    name: "Juguetes Montessori",
    slug: "juguetes-montessori",
  },
  {
    id: 2,
    name: "Materiales Sensoriales",
    slug: "materiales-sensoriales",
  },
  {
    id: 3,
    name: "Vida Práctica",
    slug: "vida-practica",
  },
  {
    id: 4,
    name: "Lenguaje",
    slug: "lenguaje",
  },
  {
    id: 5,
    name: "Matemáticas",
    slug: "matematicas",
  },
]

interface Category {
  id: number
  name: string
  slug: string
}

export function Navbar() {
  const [categories, setCategories] = useState<Category[]>(fallbackCategories)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Cerrar el menú móvil cuando cambia la ruta
    setIsMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    // Cargar categorías desde la API
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data)
        }
      })
      .catch((error) => {
        console.error("Error al cargar categorías:", error)
        // Mantener las categorías de respaldo en caso de error
      })
  }, [])

  return (
    <header className="border-b border-gray-200">
      {/* Top bar */}
      <div className="container py-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <a href="tel:+5491112345678" className="text-sm flex items-center hover:text-primary">
            <Phone size={16} className="mr-2" />
            <span className="hidden md:inline">+54 9 11 1234-5678</span>
          </a>
          <div className="flex items-center space-x-3">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook size={18} className="hover:text-primary" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={18} className="hover:text-primary" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter size={18} className="hover:text-primary" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <Youtube size={18} className="hover:text-primary" />
            </a>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-sm flex items-center hover:text-primary">
            <User size={16} className="mr-1" />
            <span>Iniciar sesión</span>
          </Link>
          <CartDrawer />
        </div>
      </div>

      {/* Main navigation */}
      <div className="container py-4 flex justify-between items-center">
        <div className="flex items-center">
          <button
            className="mr-4 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-serif">Kuma Montessori</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium hover:text-primary">
            Inicio
          </Link>
          <Link href="/productos" className="text-sm font-medium hover:text-primary">
            Productos
          </Link>
          <div className="relative group">
            <Link href="/categorias" className="text-sm font-medium hover:text-primary flex items-center">
              Categorías
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1 h-3 w-3"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </Link>
            <div className="absolute left-0 top-full z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categoria/${category.slug}`}
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/nosotros" className="text-sm font-medium hover:text-primary">
            Nosotros
          </Link>
          <Link href="/contacto" className="text-sm font-medium hover:text-primary">
            Contacto
          </Link>
        </nav>

        <div className="flex items-center">
          {isSearchOpen ? (
            <div className="flex items-center">
              <Input type="search" placeholder="Buscar productos..." className="w-full md:w-64 h-9" autoFocus />
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)} className="ml-1">
                <X size={18} />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search size={18} />
            </Button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[137px] z-50 bg-white md:hidden overflow-y-auto">
          <nav className="container py-6 space-y-6">
            <Link href="/" className="block text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
              Inicio
            </Link>
            <Link href="/productos" className="block text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
              Productos
            </Link>
            <div>
              <h3 className="text-lg font-medium mb-2">Categorías</h3>
              <div className="ml-4 space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categoria/${category.slug}`}
                    className="block text-gray-600 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/nosotros" className="block text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
              Nosotros
            </Link>
            <Link href="/contacto" className="block text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
              Contacto
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

