import { PrismaClient } from '@prisma/client'
import AddToCartButton from './AddToCardButton'
import { StarIcon } from 'lucide-react'

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
    return <div className="text-center py-8 text-gray-700 dark:text-gray-300">Product not found</div>
  }

  const discountedPrice = product.sale 
    ? product.price * (1 - product.sale.discount) 
    : product.price;

  return (
    <div className="bg-cream-100 dark:bg-gray-900 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img 
                className="h-96 w-full object-cover md:w-96" 
                src={product.images[0]?.url || '/api/placeholder/500/500'} 
                alt={product.name} 
              />
            </div>
            <div className="p-8">
              <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{product.name}</h1>
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                ))}
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">(5.0)</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{product.description}</p>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400 mr-2">
                  ${discountedPrice.toFixed(2)}
                </span>
                {product.sale && (
                  <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
              {product.sale && (
                <p className="text-red-500 dark:text-red-400 mb-4">
                  Sale: {(product.sale.discount * 100).toFixed(0)}% off
                  from {new Date(product.sale.startDate).toLocaleDateString()} 
                  to {new Date(product.sale.endDate).toLocaleDateString()}
                </p>
              )}
              <p className="text-gray-600 dark:text-gray-300 mb-6">In stock: {product.quantity}</p>
              <div className="mb-8">
                <AddToCartButton product={product} />
              </div>
              {product.images.length > 1 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">More Images</h2>
                  <div className="flex space-x-4">
                    {product.images.slice(1).map((image) => (
                      <img 
                        key={image.id}
                        src={image.url} 
                        alt={`${product.name} - view ${image.order}`}
                        className="w-24 h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}