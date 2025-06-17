import Link from "next/link"
import Image from "next/image"

interface ProductCollectionProps {
  title: string
  imageSrc: string
  href: string
}

export function ProductCollection({ title, imageSrc, href }: ProductCollectionProps) {
  return (
    <Link href={href} className="group block overflow-hidden rounded-lg">
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-3 text-center">
        <h3 className="text-sm font-medium text-gray-800">{title}</h3>
      </div>
    </Link>
  )
}
