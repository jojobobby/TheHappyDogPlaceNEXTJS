import { useState } from 'react';

export default function InventoryForm({ onSubmit, loading, initialData }) {
    const [item, setItem] = useState(initialData || {
        name: '',
        description: '',
        price: '',
        quantity: '',
        images: [],
        sale: { startDate: '', endDate: '', discount: '' },
    });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('sale.')) {
      setItem(prev => ({
        ...prev,
        sale: { ...prev.sale, [name.split('.')[1]]: value }
      }));
    } else {
      setItem(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setItem(prev => ({ ...prev, images: files }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(item).forEach(key => {
      if (key === 'images') {
        item.images.forEach((file, index) => {
          formData.append(`image${index}`, file);
        });
      } else if (key === 'sale') {
        if (item.sale.startDate || item.sale.endDate || item.sale.discount) {
          Object.keys(item.sale).forEach(saleKey => {
            formData.append(`sale.${saleKey}`, item.sale[saleKey]);
          });
        }
      } else {
        formData.append(key, item[key]);
      }
    });
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          name="name"
          value={item.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="description"
          value={item.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="price"
          value={item.price}
          onChange={handleChange}
          placeholder="Price"
          step="0.01"
          min="0"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="number"
          name="quantity"
          value={item.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          min="0"
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
            name="sale.startDate"
            value={item.sale.startDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            name="sale.endDate"
            value={item.sale.endDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="sale.discount"
            value={item.sale.discount}
            onChange={handleChange}
            placeholder="Discount %"
            min="0"
            max="100"
            step="0.01"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <button 
        type="submit" 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Item'}
      </button>
    </form>
  );
}
