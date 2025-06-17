import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/src/lib/types';
import { Card, CardContent } from '@/components/ui/card';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categorias/${category.slug}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="aspect-[4/3] relative overflow-hidden">
          <Image
            src={category.image_url || '/placeholder.svg?height=300&width=400'}
            alt={category.name}
            fill
            className="object-cover transition-transform hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium text-lg">{category.name}</h3>
          {category.product_count !== undefined && (
            <p className="text-sm text-muted-foreground mt-1">
              {category.product_count} productos
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
