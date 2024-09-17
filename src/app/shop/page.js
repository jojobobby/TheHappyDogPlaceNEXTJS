'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ShopPage() {
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const topRatedResponse = await fetch('/api/products/top-rated');
        const topRatedData = await topRatedResponse.json();
        setTopRatedProducts(Array.isArray(topRatedData) ? topRatedData : []);

        const bestSellingResponse = await fetch('/api/products/best-selling');
        const bestSellingData = await bestSellingResponse.json();
        setBestSellingProducts(Array.isArray(bestSellingData) ? bestSellingData : []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const ProductRow = ({ title, products }) => {
    if (!Array.isArray(products) || products.length === 0) {
      return (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">{title}</h2>
          <p className="text-gray-600">No products available at the moment.</p>
        </div>
      );
    }

    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src={product.images?.[0]?.url || '/api/placeholder/400/300'} 
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-blue-600">
                    ${product.sale 
                      ? (product.price * (1 - product.sale.discount)).toFixed(2)
                      : product.price.toFixed(2)
                    }
                  </span>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span>{product.ratingCount > 0 ? product.rating.toFixed(1) : 'N/A'}</span>
                  </div>
                </div>
                {title === "Best Selling Products" && (
                  <p className="text-sm text-gray-600 mt-2">
                    {product.purchaseCount} {product.purchaseCount === 1 ? 'purchase' : 'purchases'}
                  </p>
                )}
                <Link 
                  href={`/shop/products/${product.id}`}
                  className="mt-4 block bg-blue-600 text-white text-center px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen">

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-8">Welcome to Pawsome Pals Shop</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-red-600 text-center">{error}</div>
        ) : (
          <>
            <ProductRow title="Top Rated Products" products={topRatedProducts} />
            <ProductRow title="Best Selling Products" products={bestSellingProducts} />
          </>
        )}

        <div className="mt-12 text-center">
          <Link 
            href="/shop/products"
            className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            View All Products
          </Link>
        </div>
      </main>
    </div>
  );
}
