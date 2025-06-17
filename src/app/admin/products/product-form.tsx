"use client";

import { useState } from "react";
import { createProduct, updateProduct, deleteProductImage } from "@/src/app/actions/server/product-actions";
import { uploadProductImage } from "@/src/app/actions/client/product";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Card, CardContent } from "@/src/components/ui/card";
import { Checkbox } from "@/src/components/ui/checkbox";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
}

interface Image {
  id: string;
  url: string;
  alt?: string | null;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string | null;
  categories: Category[];
  images: Image[];
}

interface ProductFormProps {
  product?: Product;
  categories: Category[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    product?.categories?.map((c) => c.id) || []
  );

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);

    selectedCategories.forEach((categoryId) => {
      formData.append("categories", categoryId);
    });

    try {
      if (product) {
        const result = await updateProduct(product.id, formData);
        if (result?.error) {
          setError(result.error);
        } else {
          router.push("/admin/products");
          router.refresh();
        }
      } else {
        const result = await createProduct(formData);
        if (result?.error) {
          setError(result.error);
        } else {
          router.push("/admin/products");
          router.refresh();
        }
      }
    } catch (err) {
      setError(`Ocurrió un error al guardar el producto: ${(err as Error).message}`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleImageUpload(formData: FormData) {
    if (!product) return;

    setIsUploading(true);

    try {
      const result = await uploadProductImage(product.id, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    } catch (err) {
      setError(`Error al subir la imagen: ${(err as Error).message}`);
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleImageDelete(imageId: string) {
    try {
      await deleteProductImage(imageId);
      router.refresh();
    } catch (err) {
      setError(`Error al eliminar la imagen: ${(err as Error).message}`);
      console.error(err);
    }
  }

  function handleCategoryChange(categoryId: string, checked: boolean) {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <form action={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 p-4 rounded-md text-red-500 text-sm">{error}</div>}

            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Producto</Label>
              <Input id="name" name="name" defaultValue={product?.name} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" name="description" rows={5} defaultValue={product?.description} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={product?.price}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" name="stock" type="number" min="0" defaultValue={product?.stock} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" name="sku" defaultValue={product?.sku || ""} />
            </div>

            <div className="space-y-2">
              <Label>Categorías</Label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                    />
                    <Label htmlFor={`category-${category.id}`} className="cursor-pointer">
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Producto"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {product && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Imágenes del Producto</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {product.images.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={image.alt || product.name}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageDelete(image.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            <form action={handleImageUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image">Subir Nueva Imagen</Label>
                <Input id="image" name="image" type="file" accept="image/*" required />
              </div>

              <Button type="submit" variant="outline" className="w-full" disabled={isUploading}>
                {isUploading ? "Subiendo..." : "Subir Imagen"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}







