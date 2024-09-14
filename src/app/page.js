import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-primary mb-6">Welcome to Pawsome Pals</h1>
      <p className="text-xl text-foreground mb-8">Find the best products for your furry friends!</p>
      <div className="space-x-4">
        <Link 
          href="/shop/products" 
          className="btn-primary"
        >
          View Products
        </Link>
        <Link 
          href="/admin" 
          className="btn-secondary"
        >
          Admin Panel
        </Link>
      </div>
    </div>
  )
}