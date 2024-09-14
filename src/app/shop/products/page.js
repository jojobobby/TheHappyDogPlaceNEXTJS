// app/products/page.js

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
  })
  return products
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-yellow-50">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold">Pawsome Pals</Link>
          <nav>
            <Link href="/" className="hover:underline mr-4">Home</Link>
            <Link href="/cart" className="hover:underline">Cart</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-blue-800 mb-8 text-center">
          Our Products
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div 
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img 
                src={product.images[0]?.url || '/api/placeholder/300/200'} 
                alt={product.name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-blue-700 mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
                {product.sale && (
                  <p className="text-red-500 mb-2">
                    Sale: ${(product.price * (1 - product.sale.discount)).toFixed(2)}
                  </p>
                )}
                <p className="text-gray-500 mb-4">In stock: {product.quantity}</p>
                <Link 
                  href={`/products/${product.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-full inline-block hover:bg-blue-700 transition duration-300"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-4 mt-12">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Pawsome Pals. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}