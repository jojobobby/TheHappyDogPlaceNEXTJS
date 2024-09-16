'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InventoryForm from './InventoryForm';
import InventoryList from './InventoryList';

export default function AdminInventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchInventory();
    }
  }, [status]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/inventory');
      if (res.ok) {
        const data = await res.json();
        setInventory(data);
      } else {
        const errorData = await res.json();
        toast.error(`Failed to fetch inventory: ${errorData.error}`);
      }
    } catch (error) {
      toast.error(`Error fetching inventory: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (newItem) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        body: newItem,
      });
      if (res.ok) {
        toast.success('Item added successfully');
        fetchInventory();
      } else {
        const errorData = await res.json();
        toast.error(`Failed to add item: ${errorData.error}`);
      }
    } catch (error) {
      toast.error(`Error adding item: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateItem = async (id, updatedItem) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/inventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem),
      });
      if (res.ok) {
        toast.success('Item updated successfully');
        fetchInventory();
      } else {
        const errorData = await res.json();
        toast.error(`Failed to update item: ${errorData.error}`);
      }
    } catch (error) {
      toast.error(`Error updating item: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/inventory/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Item deleted successfully');
        fetchInventory();
      } else {
        const errorData = await res.json();
        toast.error(`Failed to delete item: ${errorData.error}`);
      }
    } catch (error) {
      toast.error(`Error deleting item: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!session) return <div className="flex justify-center items-center h-screen">Access denied</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <ToastContainer />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Inventory Management</h1>
        <InventoryForm onSubmit={handleAddItem} loading={loading} />
        <InventoryList
          inventory={inventory}
          loading={loading}
          onUpdate={handleUpdateItem}
          onDelete={handleDeleteItem}
        />
      </div>
    </div>
  );
}