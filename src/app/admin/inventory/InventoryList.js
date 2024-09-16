export default function InventoryList({ inventory, loading, onUpdate, onDelete }) {
    return (
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
                        onClick={() => onUpdate(item.id, { ...item, quantity: item.quantity + 1 })}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                        disabled={loading}
                    >
                        +
                    </button>
                    <button 
                        onClick={() => onUpdate(item.id, { ...item, quantity: Math.max(0, item.quantity - 1) })}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded"
                        disabled={loading}
                    >
                        -
                    </button>
                    <button 
                        onClick={() => onDelete(item.id)}
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
    );
}
