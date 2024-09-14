// app/products/[id]/page.js

import Link from 'next/link'
import { PrismaClient } from '@prisma/client'
import AddToCartButton from './AddToCartButton'

const prisma = new PrismaClient()

async function getProduct(id) {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: {
      images: {
        orderBy: {
          order: 'asc'
        }
      },
      sale: true,
    },
  })
  return product
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id)

  if (!product) {
    return <div className="text-center py-8">Product not found</div>
  }

  const discountedPrice = product.sale 
    ? product.price * (1 - product.sale.discount) 
    : product.price;

  return (
    <div className="min-h-screen bg-yellow-50">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold">Pawsome Pals</Link>
          <nav>
            <Link href="/" className="hover:underline mr-4">Home</Link>
            <Link href="/products" className="hover:underline mr-4">Products</Link>
            <Link href="/cart" className="hover:underline">Cart</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img 
                className="h-64 w-full object-cover md:w-64" 
                src={product.images[0]?.url || '/api/placeholder/500/300'} 
                alt={product.name} 
              />
            </div>
            <div className="p-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="flex items-baseline mb-4">
                <span className="text-2xl font-bold text-gray-900 mr-2">
                  ${discountedPrice.toFixed(2)}
                </span>
                {product.sale && (
                  <span className="text-lg text-gray-500 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
              {product.sale && (
                <p className="text-red-500 mb-4">
                  Sale: {(product.sale.discount * 100).toFixed(0)}% off
                  from {new Date(product.sale.startDate).toLocaleDateString()} 
                  to {new Date(product.sale.endDate).toLocaleDateString()}
                </p>
              )}
              <p className="text-gray-600 mb-4">In stock: {product.quantity}</p>
              <div className="mb-6">
                <AddToCartButton product={product} />
              </div>
              {product.images.length > 1 && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">More Images</h2>
                  <div className="flex space-x-2">
                    {product.images.slice(1).map((image) => (
                      <img 
                        key={image.id}
                        src={image.url} 
                        alt={`${product.name} - view ${image.order}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
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