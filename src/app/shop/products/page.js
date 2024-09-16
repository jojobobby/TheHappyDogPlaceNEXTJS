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
  const products = await getProducts()

  return (
    <div className="bg-cream-100 dark:bg-gray-900 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-8 text-center">
          Our Products
        </h1>
        <ProductList initialProducts={products} />
      </div>
    </div>
  )
}