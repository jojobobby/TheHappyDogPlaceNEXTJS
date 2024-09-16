import Link from 'next/link'
import { PrismaClient } from '@prisma/client'

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
    take: 6 // Limit to 6 featured products
  })
  return products
}

export default async function ShopPage() {
  const products = await getProducts()

  return (
    <div className="bg-cream-100 dark:bg-gray-900 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-8 text-center">
          Welcome to Pawsome Pals
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-12 text-center max-w-3xl mx-auto">
          Discover our handpicked selection of premium pet products, designed to bring joy to your furry friends.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:scale-105">
              <img 
                src={product.images[0]?.url || '/api/placeholder/400/300'} 
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-2">{product.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{product.description.substring(0, 100)}...</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ${product.sale 
                      ? (product.price * (1 - product.sale.discount)).toFixed(2)
                      : product.price.toFixed(2)
                    }
                  </span>
                  <Link 
                    href={`/shop/products/${product.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link 
            href="/shop/products"
            className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            View All Products
          </Link>
        </div>
      </div>
    </div>
  )
}