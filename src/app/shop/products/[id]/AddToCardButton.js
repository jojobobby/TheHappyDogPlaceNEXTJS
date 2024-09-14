// app/products/[id]/AddToCartButton.js
'use client'

import { useState } from 'react'

export default function AddToCartButton({ product }) {
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    // Here you would typically dispatch an action to add the item to the cart
    console.log(`Added ${product.name} to cart`)
    setIsAdded(true)
  }

  return (
    <button onClick={handleAddToCart} disabled={isAdded}>
      {isAdded ? 'Added to Cart' : 'Add to Cart'}
    </button>
  )
}