'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';
import ProductCard from './products/ProductCard';

export default function ShopPage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const featuredResponse = await fetch('/api/products/top-rated');
        const featuredData = await featuredResponse.json();
        setFeaturedProducts(Array.isArray(featuredData) ? featuredData : []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`Added ${product.name} to cart`);
  };

  return (
    <div>
      {/* Hero Section with Scrollable Images */}
      <section className="relative py-20 bg-gray-100 flex justify-center items-center overflow-hidden">
        <div className="scroll-container">
          <div className="scroll-content">
            {/* First set of images */}
            <div className="flex-shrink-0 w-1/3">
              <img
                src="/assets/eating_0.jpg"
                alt="Product Image 1"
                className="w-full h-[480px] object-cover"
              />
            </div>
            <div className="flex-shrink-0 w-1/3">
              <img
                src="/assets/eating_1.jpg"
                alt="Product Image 2"
                className="w-full h-[480px] object-cover"
              />
            </div>
            <div className="flex-shrink-0 w-1/3">
              <img
                src="/assets/playing_0.jpeg"
                alt="Product Image 3"
                className="w-full h-[480px] object-cover"
              />
            </div>
            <div className="flex-shrink-0 w-1/3">
              <img
                src="/assets/playing_1.jpg"
                alt="Product Image 4"
                className="w-full h-[480px] object-cover"
              />
            </div>

            {/* Duplicated set of images */}
            <div className="flex-shrink-0 w-1/3">
              <img
                src="/assets/eating_0.jpg"
                alt="Product Image 1"
                className="w-full h-[480px] object-cover"
              />
            </div>
            <div className="flex-shrink-0 w-1/3">
              <img
                src="/assets/eating_1.jpg"
                alt="Product Image 2"
                className="w-full h-[480px] object-cover"
              />
            </div>
            <div className="flex-shrink-0 w-1/3">
              <img
                src="/assets/playing_0.jpeg"
                alt="Product Image 3"
                className="w-full h-[480px] object-cover"
              />
            </div>
            <div className="flex-shrink-0 w-1/3">
              <img
                src="/assets/playing_1.jpg"
                alt="Product Image 4"
                className="w-full h-[480px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        {/* Products Section */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-red-600 text-center">{error}</div>
        ) : (
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Featured Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} addToCart={handleAddToCart} />
              ))}
            </div>

            {/* "View All Products" button placed below the products */}
            <div className="text-center mt-12">
              <Link
                href="/shop/products"
                className="bg-blue-500 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-600 transition duration-300"
              >
                View All Products
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
