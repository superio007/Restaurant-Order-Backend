import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

function Menu({ menuItems, newMenuItem, setNewMenuItem, handleAddMenuItem, handleDeleteMenuItem }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Add New Menu Item Form */}
      <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Add New Item</h3>
        <form onSubmit={handleAddMenuItem} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={newMenuItem.name}
              onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF4500] focus:ring focus:ring-[#FF4500] focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              step="0.01"
              value={newMenuItem.price}
              onChange={(e) => setNewMenuItem({...newMenuItem, price: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF4500] focus:ring focus:ring-[#FF4500] focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={newMenuItem.category}
              onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF4500] focus:ring focus:ring-[#FF4500] focus:ring-opacity-50"
            >
              <option>Main Course</option>
              <option>Sides</option>
              <option>Beverages</option>
              <option>Desserts</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={newMenuItem.available}
              onChange={(e) => setNewMenuItem({...newMenuItem, available: e.target.checked})}
              className="rounded border-gray-300 text-[#FF4500] focus:ring-[#FF4500]"
            />
            <label className="ml-2 text-sm text-gray-700">Available</label>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-[#FF4500] text-white rounded-lg hover:bg-[#CC3700]"
          >
            <Plus size={16} />
            Add Item
          </button>
        </form>
      </div>

      {/* Menu Items List */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Menu Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Name</th>
                  <th className="text-left py-3">Category</th>
                  <th className="text-left py-3">Price</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map(item => (
                  <tr key={item.id} className="border-b">
                    <td className="py-3">{item.name}</td>
                    <td className="py-3">{item.category}</td>
                    <td className="py-3">${item.price.toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        item.available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => handleDeleteMenuItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;