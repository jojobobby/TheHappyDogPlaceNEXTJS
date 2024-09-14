import Link from 'next/link'
import ThemeToggle from '../components/ThemeToggle'

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <nav className="mt-5">
          <Link href="/admin/dashboard" className="block py-2 px-4 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">
            Dashboard
          </Link>
          <Link href="/admin/inventory" className="block py-2 px-4 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">
            Inventory
          </Link>
          <Link href="/admin/orders" className="block py-2 px-4 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">
            Orders
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Panel</h1>
          <ThemeToggle />
        </div>
        {children}
      </main>
    </div>
  )
}