import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { SiteHeader } from "@/src/components/site-header"
import { ThemeProvider } from "@/src/components/theme-provider"
import { CartProvider } from "@/src/context/cart-context"
import { SiteFooter } from "@/src/components/site-footer"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Kuma Montessori",
  description: "Tienda de productos Montessori",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[#FFFDF7] text-[#365A5D] font-serif">
        <ThemeProvider attribute="class" defaultTheme="light">
          <CartProvider>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



