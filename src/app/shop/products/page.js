import { PrismaClient } from '@prisma/client'
import ProductList from './ProductList'

const prisma = new PrismaClient()

async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      images: {
        orderBy: {
          order: 'asc'
        }
      },
      sale: true,
    },
  })
  return products
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen py-12"> {/* Change background here */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-8 text-center"> {/* Neutral text */}
          Our Products
        </h1>
        <ProductList initialProducts={products} />
      </div>
    </div>
  );
}
