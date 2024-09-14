import Link from 'next/link'
import ThemeToggle from '../components/ThemeToggle'

export default function ShopLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-cream-100 dark:bg-gray-900">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/shop" className="text-2xl font-bold">Pawsome Pals</Link>
          <nav className="flex items-center space-x-4">
            <Link href="/shop/products" className="hover:underline">Products</Link>
            <Link href="/shop/cart" className="hover:underline">Cart</Link>
            <Link href="/admin" className="hover:underline">Admin</Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-blue-600 text-white py-4">
        <div className="container mx-auto text-center">
          © 2024 Pawsome Pals. All rights reserved.
        </div>
      </footer>
    </div>
  )
}