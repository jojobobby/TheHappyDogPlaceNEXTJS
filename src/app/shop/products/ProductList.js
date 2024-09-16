'use client';

import { useState } from 'react';
import { StarIcon, FilterIcon, TagIcon } from 'lucide-react';
import Link from 'next/link';

export default function ProductList({ initialProducts }) {
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');

  const handlePriceFilter = (range) => {
    setPriceFilter(range);
    filterProducts(range, sortOrder);
  };

  const handleSort = (order) => {
    setSortOrder(order);
    filterProducts(priceFilter, order);
  };

  const filterProducts = (priceRange, sort) => {
    let filtered = [...initialProducts];

    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(p => p.price >= min && p.price <= max);
    }

    if (sort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between mb-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <FilterIcon className="h-5 w-5 text-blue-500" />
          <select 
            onChange={(e) => handlePriceFilter(e.target.value)}
            className="border-gray-300 rounded-md text-gray-700 dark:text-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
          >
            <option value="all">All Prices</option>
            <option value="0-25">$0 - $25</option>
            <option value="25-50">$25 - $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100-1000">$100+</option>
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 dark:text-gray-300 text-sm">Sort by:</span>
          <select 
            onChange={(e) => handleSort(e.target.value)}
            className="border-gray-300 rounded-md text-gray-700 dark:text-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
          >
            <option value="default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {filteredProducts.map((product) => (
          <Link key={product.id} href={`/shop/products/${product.id}`} className="group">
            <div className="relative w-full aspect-w-1 aspect-h-1 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <img
                src={product.images[0]?.url || '/api/placeholder/400/400'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.sale && (
                <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-bl-lg">
                  <TagIcon className="h-4 w-4 inline-block mr-1" />
                  {(product.sale.discount * 100).toFixed(0)}% OFF
                </div>
              )}
            </div>
            <div className="mt-4 px-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{product.name}</h3>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
                ))}
                <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">(5.0)</span>
              </div>
              <div className="mt-1 flex items-center">
                <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  ${product.sale 
                    ? (product.price * (1 - product.sale.discount)).toFixed(2)
                    : product.price.toFixed(2)
                  }
                </span>
                {product.sale && (
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}