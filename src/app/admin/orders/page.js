'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status]);

  const fetchOrders = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?page=${page}&limit=${limit}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
        setPagination(data.pagination);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Total</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6">{order.id}</td>
                <td className="py-3 px-6">{order.status}</td>
                <td className="py-3 px-6">${order.total.toFixed(2)}</td>
                <td className="py-3 px-6">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-6">
                  <button className="text-blue-600 hover:text-blue-900">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Add pagination controls here */}
    </div>
  );
}
