import Link from "next/link";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { prisma } from "@/src/lib/prisma";

export default async function HomePage() {
  const featured = await prisma.product.findMany({
    where: { featured: true },
    include: { images: { take: 1 } },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFDF7] text-[#365A5D] font-serif">
      {/* Hero Section */}
      <section className="w-full py-20 px-4 md:px-8 bg-[#FFFDF7]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-6xl font-bold leading-tight">Nutriendo mentes jóvenes</h1>
            <p className="text-lg max-w-xl">
              Descubre nuestra selección de productos Montessori diseñados para el desarrollo y aprendizaje de los niños.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/productos">
                <Button className="rounded-full bg-[#D9B84A] hover:bg-[#c8a93c] px-6 py-3 text-white text-lg font-medium">
                  Ver Productos
                </Button>
              </Link>
              <Link href="/nosotros">
                <Button variant="outline" className="rounded-full border-[#D9B84A] text-[#365A5D] px-6 py-3 text-lg">
                  Conoce Más
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-[#C9E7E5] rounded-[60%] opacity-80 -z-10"></div>
            <Image
              src="/images/baby-hands.jpg"
              alt="Kuma Montessori"
              width={600}
              height={300}
              className="relative z-10"
            />
          </div>
        </div>
      </section>

      {/* Educational Module */}
      <section className="w-full py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">¿Qué son los Materiales Montessori?</h2>
            <p className="text-lg">
              Materiales científicamente diseñados para fomentar la independencia, concentración y respeto por el ritmo individual.
            </p>
            <ul className="space-y-2 text-lg">
              <li>✨ Desarrollo de la autonomía</li>
              <li>✨ Estimulación sensorial</li>
              <li>✨ Concentración profunda</li>
              <li>✨ Respeto por el ritmo individual</li>
            </ul>
          </div>
          <div className="rounded-xl overflow-hidden shadow-xl">
            <iframe
              src="https://www.youtube.com/embed/VIDEO_ID"
              title="Método Montessori"
              className="w-full aspect-video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="w-full py-20 px-4 md:px-8 bg-[#FFFDF7]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold">Productos Destacados</h2>
            <p className="text-lg">Explora nuestros favoritos seleccionados con cuidado.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((product) => (
              <div key={product.slug} className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={product.images[0]?.url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-xl mb-1">{product.name}</h3>
                <p className="text-md mb-2 line-clamp-2">{product.description}</p>
                <p className="font-medium text-lg mb-4">${product.price.toFixed(2)}</p>
                <Link href={`/productos/${product.slug}`}>
                  <Button variant="outline" className="rounded-full px-4 py-2">
                    Ver Más
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}








