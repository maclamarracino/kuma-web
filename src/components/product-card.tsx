// components/product-card.tsx

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/src/lib/types';
import { Card, CardContent } from '@/components/ui/card';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/productos/${product.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="aspect-[4/3] relative overflow-hidden">
          <Image
            src={product.image_url || '/placeholder.svg?height=300&width=400'}
            alt={product.name}
            fill
            className="object-cover transition-transform hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium text-lg">{product.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">${product.price}</p>
        </CardContent>
      </Card>
    </Link>
  );
}


