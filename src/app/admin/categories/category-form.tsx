"use client"

import { useState } from "react"
import { createCategory, updateCategory } from "@/src/app/actions/category-actions"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { Card, CardContent } from "@/src/components/ui/card"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/src/components/ui/alert"
import { Loader2 } from "lucide-react"

interface Category {
  id: string
  name: string
  description?: string | null
  slug?: string | null
}

interface CategoryFormProps {
  category?: Category
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setError(null)

    try {
      if (category) {
        const result = await updateCategory(category.id, formData)
        if (result?.error) {
          setError(result.error)
        } else {
          router.push("/admin/categories")
          router.refresh()
        }
      } else {
        const result = await createCategory(formData)
        if (result?.error) {
          setError(result.error)
        } else {
          router.push("/admin/categories")
          router.refresh()
        }
      }
    } catch (err) {
      setError(`Ocurrió un error al guardar la categoría: ${(err as Error).message}`)
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 p-4 rounded-md text-red-500 text-sm">{error}</div>}

          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Categoría</Label>
            <Input id="name" name="name" defaultValue={category?.name} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" name="description" rows={3} defaultValue={category?.description || ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input id="slug" name="slug" defaultValue={category?.slug || ""} />
            <p className="text-xs text-gray-500">
              Déjalo en blanco para generarlo automáticamente a partir del nombre.
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Categoría"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
