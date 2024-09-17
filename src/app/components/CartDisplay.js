'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const CartDisplay = () => {
  const { cart } = useCart();

  return (
    <Link href="/shop/cart" className="relative group">
      <ShoppingCart size={24} className="text-white cursor-pointer group-hover:text-orange-400 transition-all duration-300 ease-in-out transform group-hover:scale-110" />
      {cart.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold group-hover:bg-orange-500 transition-colors duration-300 ease-in-out">
          {cart.reduce((sum, item) => sum + item.quantity, 0)}
        </span>
      )}
    </Link>
  );
};

export default CartDisplay;