'use client';

import { useState } from 'react';
import Link from 'next/link';

const ProductCard = ({ product, addToCart }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
      <Link href={`/shop/products/${product.id}`}>
        {imageError ? (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Image not available</span>
          </div>
        ) : (
          <img
            // Modify this line to properly display the image based on how your data is structured
            src={product.images?.[0]?.url || product.image || '/api/placeholder/400/300'}
            alt={product.name}
            className="w-full h-48 object-cover"
            onError={handleImageError}
          />
        )}
      </Link>
      <div className="p-4">
        <Link
          href={`/shop/products/${product.id}`}
          className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-500"
        >
          {product.name}
        </Link>
        <p className="text-gray-600">${product.price.toFixed(2)}</p>
        <button
          onClick={() => addToCart(product)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
