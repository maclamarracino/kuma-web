export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    image_url: string;
    product_count?: number;
  }
  
  export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    sku: string;
    stock: number;
    image_url: string;
    category_id: number;
    featured: boolean;
    category_name?: string;
    category_slug?: string;
  }
  
  export interface CartItem extends Product {
    quantity: number;
  }
  