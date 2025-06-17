import Link from "next/link"
import Image from "next/image"
import { Button } from "@/src/components/ui/button"

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="w-full py-16 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6 grid gap-10 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Bienvenidos a Kuma Montessori
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-xl">
              Productos inspirados en el método Montessori para acompañar el crecimiento y desarrollo de los niños.
            </p>
            <div className="flex gap-4">
              <Link href="/productos">
                <Button className="px-6">Ver Productos</Button>
              </Link>
              <Link href="/nosotros">
                <Button variant="outline" className="px-6">Conocenos</Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <Image
              src="/images/logo.png"
              alt="Kuma Montessori"
              width={400}
              height={300}
              className="rounded-xl object-contain"
            />
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6 text-center space-y-10">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Productos Destacados</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nuestra selección curada para que empieces a explorar el mundo Montessori.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white shadow-md rounded-xl p-4 text-center">
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm mb-4">
                  Imagen del producto
                </div>
                <h3 className="font-semibold text-lg">Producto Destacado {i}</h3>
                <p className="text-sm text-muted-foreground">Descripción breve del producto</p>
                <p className="font-medium mt-1">$1.999</p>
              </div>
            ))}
          </div>

          <Link href="/productos">
            <Button variant="outline" className="px-8">Ver Todos los Productos</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}








