'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchDashboardStats();
    }
  }, [status]);

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        toast.error('Failed to fetch dashboard stats');
      }
    } catch (error) {
      toast.error(`Error fetching dashboard stats: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!session) return <div className="flex justify-center items-center h-screen">Access denied</div>;

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <ToastContainer />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">Dashboard Overview</h1>
        {loading ? (
          <div className="text-center py-4">Loading dashboard stats...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Total Products</h2>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalProducts}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Total Orders</h2>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.totalOrders}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Total Revenue</h2>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        )}
        <div className="mt-12 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/admin/inventory')}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Manage Inventory
            </button>
            <button
              onClick={() => router.push('/admin/orders')}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              View Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}