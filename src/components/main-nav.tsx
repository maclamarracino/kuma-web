"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MenuIcon, XIcon } from "@/components/icons"

const navItems = [
  { label: "Nuestra historia", href: "/nuestra-historia" },
  {
    label: "Juguetes",
    href: "/juguetes",
    submenu: [
      { label: "0-12 meses", href: "/juguetes/0-12-meses" },
      { label: "1-2 años", href: "/juguetes/1-2-anos" },
      { label: "2-3 años", href: "/juguetes/2-3-anos" },
      { label: "3-5 años", href: "/juguetes/3-5-anos" },
    ],
  },
  { label: "Rebajas", href: "/rebajas" },
  { label: "Material Montessori", href: "/material-montessori" },
  {
    label: "Canastillas",
    href: "/canastillas",
    submenu: [
      { label: "Recién nacido", href: "/canastillas/recien-nacido" },
      { label: "Personalizadas", href: "/canastillas/personalizadas" },
      { label: "Regalo", href: "/canastillas/regalo" },
    ],
  },
  {
    label: "Ropa",
    href: "/ropa",
    submenu: [
      { label: "Bebé", href: "/ropa/bebe" },
      { label: "Niño", href: "/ropa/nino" },
      { label: "Niña", href: "/ropa/nina" },
    ],
  },
  {
    label: "Gadgets",
    href: "/gadgets",
    submenu: [
      { label: "Accesorios", href: "/gadgets/accesorios" },
      { label: "Tecnología", href: "/gadgets/tecnologia" },
    ],
  },
  { label: "Novedades", href: "/novedades" },
  { label: "Tarjeta Regalo", href: "/tarjeta-regalo" },
  {
    label: "Marcas",
    href: "/marcas",
    submenu: [
      { label: "Kuma", href: "/marcas/kuma" },
      { label: "Otras marcas", href: "/marcas/otras" },
    ],
  },
  { label: "Contacto", href: "/contacto" },
  { label: "Blog", href: "/blog" },
]

export function MainNav() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [activeSubmenu, setActiveSubmenu] = React.useState<string | null>(null)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
    if (isOpen) {
      setActiveSubmenu(null)
    }
  }

  const toggleSubmenu = (label: string) => {
    setActiveSubmenu(activeSubmenu === label ? null : label)
  }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="container mx-auto">
        {/* Desktop Navigation */}
        <div className="hidden items-center justify-center lg:flex">
          <ul className="flex flex-wrap items-center space-x-1">
            {navItems.map((item) => (
              <li key={item.label} className="relative group">
                <Link
                  href={item.href}
                  className="block px-3 py-4 text-sm font-medium text-gray-700 transition-colors hover:text-[#8a7e55]"
                >
                  {item.label}
                  {item.submenu && <span className="ml-1">▼</span>}
                </Link>

                {item.submenu && (
                  <div className="absolute left-0 z-10 mt-0 hidden min-w-[200px] rounded-b-md bg-white py-2 shadow-lg group-hover:block">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#8a7e55]"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center justify-between py-4 lg:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </Button>
          <span className="text-lg font-semibold">Menú</span>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden">
            <ul className="space-y-2 pb-4">
              {navItems.map((item) => (
                <li key={item.label} className="px-4">
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => toggleSubmenu(item.label)}
                        className="flex w-full items-center justify-between py-2 text-left text-sm font-medium text-gray-700"
                      >
                        {item.label}
                        <span>{activeSubmenu === item.label ? "▲" : "▼"}</span>
                      </button>

                      {activeSubmenu === item.label && (
                        <ul className="ml-4 mt-2 space-y-2 border-l border-gray-200 pl-4">
                          {item.submenu.map((subItem) => (
                            <li key={subItem.label}>
                              <Link
                                href={subItem.href}
                                className="block py-1 text-sm text-gray-600 hover:text-[#8a7e55]"
                              >
                                {subItem.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="block py-2 text-sm font-medium text-gray-700 hover:text-[#8a7e55]"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  )
}


