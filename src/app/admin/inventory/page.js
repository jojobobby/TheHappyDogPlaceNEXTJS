'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DraggableImage = ({ id, url, index, moveImage }) => {
  const [, ref] = useDrag({
    type: 'IMAGE',
    item: { id, index },
  });

  const [, drop] = useDrop({
    accept: 'IMAGE',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveImage(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} className="relative w-24 h-24 m-1">
      <img src={url} alt="" className="w-full h-full object-cover rounded-md" />
    </div>
  );
};

export default function AdminInventory() {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    images: [],
    sale: { startDate: '', endDate: '', discount: '' },
  });
  const [imageFiles, setImageFiles] = useState([]);
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
      const res = await fetch('/api/inventory');
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

  const handleAddItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('name', newItem.name);
    formData.append('description', newItem.description);
    formData.append('price', newItem.price);
    formData.append('quantity', newItem.quantity);
    formData.append('saleStartDate', newItem.sale.startDate);
    formData.append('saleEndDate', newItem.sale.endDate);
    formData.append('saleDiscount', newItem.sale.discount);

    imageFiles.forEach((file, index) => {
      formData.append(`image${index}`, file);
    });

    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        toast.success('Item added successfully');
        setNewItem({
          name: '',
          description: '',
          price: '',
          quantity: '',
          images: [],
          sale: { startDate: '', endDate: '', discount: '' },
        });
        setImageFiles([]);
        fetchInventory();
      } else {
        const errorData = await res.json();
        if (errorData.error.includes('ENOENT: no such file or directory')) {
          toast.error('Error uploading images. Please contact the administrator.');
        } else {
          toast.error(`Failed to add item: ${errorData.error}`);
        }
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
      const res = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updatedItem }),
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
      const res = await fetch(`/api/inventory?id=${id}`, { method: 'DELETE' });
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setNewItem({ ...newItem, images: imageUrls });
  };

  const moveImage = (dragIndex, hoverIndex) => {
    const draggedImage = newItem.images[dragIndex];
    const updatedImages = [...newItem.images];
    updatedImages.splice(dragIndex, 1);
    updatedImages.splice(hoverIndex, 0, draggedImage);
    setNewItem({ ...newItem, images: updatedImages });
  };

  if (status === 'loading') return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!session) return <div className="flex justify-center items-center h-screen">Access denied</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-gray-100 min-h-screen">
        <ToastContainer />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Inventory Management</h1>
          <form onSubmit={handleAddItem} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="Name"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Description"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                placeholder="Price"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                placeholder="Quantity"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={newItem.sale.startDate}
                  onChange={(e) => setNewItem({ ...newItem, sale: { ...newItem.sale, startDate: e.target.value } })}
                  placeholder="Sale Start Date"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  value={newItem.sale.endDate}
                  onChange={(e) => setNewItem({ ...newItem, sale: { ...newItem.sale, endDate: e.target.value } })}
                  placeholder="Sale End Date"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={newItem.sale.discount}
                  onChange={(e) => setNewItem({ ...newItem, sale: { ...newItem.sale, discount: e.target.value } })}
                  placeholder="Discount %"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex flex-wrap mb-4">
              {newItem.images.map((image, index) => (
                <DraggableImage
                  key={index}
                  id={index}
                  url={image}
                  index={index}
                  moveImage={moveImage}
                />
              ))}
            </div>
            <button 
              type="submit" 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Item'}
            </button>
          </form>
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Current Inventory</h2>
            {loading ? (
              <div className="text-center py-4">Loading inventory...</div>
            ) : (
              <ul className="space-y-4">
                {inventory.map((item) => (
                  <li key={item.id} className="border p-4 rounded hover:shadow-lg transition-shadow duration-200">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div className="mb-4 md:mb-0">
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <p className="text-md">Price: ${item.price.toFixed(2)} - Quantity: {item.quantity}</p>
                        {item.sale && (
                          <p className="text-sm text-red-500">
                            Sale: {item.sale.discount}% off from {new Date(item.sale.startDate).toLocaleDateString()} to {new Date(item.sale.endDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleUpdateItem(item.id, { ...item, quantity: item.quantity + 1 })}
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                          disabled={loading}
                        >
                          +
                        </button>
                        <button 
                          onClick={() => handleUpdateItem(item.id, { ...item, quantity: Math.max(0, item.quantity - 1) })}
                          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded"
                          disabled={loading}
                        >
                          -
                        </button>
                        <button 
                          onClick={() => handleDeleteItem(item.id)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap mt-2">
                      {item.images.map((image) => (
                        <img key={image.id} src={image.url} alt="" className="w-24 h-24 object-cover m-1 rounded" />
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}