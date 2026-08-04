
import { prisma } from './db';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  color: string;
  images: string[];
  description?: string | null;
  isNew?: boolean;
}

// Convert from Prisma Product format to Frontend Product format
function formatProduct(dbProduct: any): Product {
  let parsedImages: string[] = [];
  try {
    parsedImages = JSON.parse(dbProduct.images);
  } catch (e) {
    parsedImages = [];
  }
  
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    price: dbProduct.price,
    category: dbProduct.category,
    color: dbProduct.color,
    description: dbProduct.description || undefined,
    isNew: dbProduct.isNew,
    images: parsedImages,
  };
}

export async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return products.map(formatProduct);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const product = await prisma.product.findUnique({
    where: { id }
  });
  if (!product) return undefined;
  return formatProduct(product);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: {
      category: {
        equals: category,
      }
    }
  });
  return products.map(formatProduct);
}
