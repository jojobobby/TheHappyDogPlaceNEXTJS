import Link from 'next/link'

export default function ShopPage() {
  // Assuming you have a products array
  const products = [
    { id: 1, name: "Dog Toy", price: 9.99 },
    { id: 2, name: "Cat Food", price: 19.99 },
    // ... more products
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="card">
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-foreground mb-4">${product.price.toFixed(2)}</p>
            <Link href={`/shop/products/${product.id}`} className="btn-secondary">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}