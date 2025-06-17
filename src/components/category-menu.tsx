// src/components/category-menu.tsx
"use client"

import useSWR from "swr"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function CategoryMenu() {
  const { data: categories, error } = useSWR("/api/categories", fetcher)

  if (error) return <p>Error al cargar categorías</p>
  if (!categories) return <p>Cargando...</p>

  return (
    <div className="flex space-x-4 overflow-x-auto md:overflow-visible md:flex-wrap">
      {categories.map((cat: any) => (
        <Link
          key={cat.id}
          href={`/categorias/${cat.slug}`}
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          {cat.name}
        </Link>
      ))}
    </div>
  )
}

