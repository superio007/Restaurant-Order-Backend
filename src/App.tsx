import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  UtensilsCrossed, 
  DollarSign,
  Download,
  CheckCircle,
  Clock,
  Menu as MenuIcon,
  Plus,
  Trash2
} from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// Mock data
const initialOrders = [
  { 
    id: 1, 
    tableNumber: 5,
    items: ['Burger', 'Fries'], 
    total: 15.99, 
    status: 'pending', 
    time: '2024-03-15 14:30',
    notes: 'No onions in burger'
  },
  { 
    id: 2, 
    tableNumber: 3,
    items: ['Pizza', 'Coke'], 
    total: 20.99, 
    status: 'completed', 
    time: '2024-03-15 15:00',
    notes: 'Extra cheese'
  },
];

const initialMenuItems = [
  { id: 1, name: 'Burger', price: 9.99, category: 'Main Course', available: true },
  { id: 2, name: 'Pizza', price: 12.99, category: 'Main Course', available: true },
  { id: 3, name: 'Fries', price: 4.99, category: 'Sides', available: true },
  { id: 4, name: 'Coke', price: 2.99, category: 'Beverages', available: true },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [orders, setOrders] = useState(initialOrders);
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    price: '',
    category: 'Main Course',
    available: true
  });

  // Chart data
  const chartData = {
    labels: ['Completed Orders', 'Pending Orders'],
    datasets: [
      {
        data: [
          orders.filter(order => order.status === 'completed').length,
          orders.filter(order => order.status === 'pending').length,
        ],
        backgroundColor: ['#4ade80', '#fbbf24'],
        borderColor: ['#22c55e', '#f59e0b'],
        borderWidth: 1,
      },
    ],
  };

  const downloadCSV = () => {
    const csvContent = "Order ID,Table Number,Items,Total,Status,Time,Notes\n" + 
      orders.map(order => 
        `${order.id},${order.tableNumber},"${order.items.join(', ')}",$${order.total},${order.status},${order.time},"${order.notes}"`
      ).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
  };

  const handleAddMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMenuItem.name && newMenuItem.price) {
      setMenuItems([
        ...menuItems,
        {
          id: menuItems.length + 1,
          name: newMenuItem.name,
          price: parseFloat(newMenuItem.price),
          category: newMenuItem.category,
          available: newMenuItem.available
        }
      ]);
      setNewMenuItem({
        name: '',
        price: '',
        category: 'Main Course',
        available: true
      });
    }
  };

  const handleDeleteMenuItem = (id: number) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  const toggleOrderStatus = (orderId: number) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: order.status === 'pending' ? 'completed' : 'pending'
        };
      }
      return order;
    }));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#1e1b4b] text-white transition-all duration-300`}>
        <div className="p-4 flex items-center justify-between">
          <h1 className={`${sidebarOpen ? 'block' : 'hidden'} font-bold text-xl`}>QuickBite</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
            <MenuIcon size={24} />
          </button>
        </div>
        <nav className="mt-8">
          <SidebarItem icon={<LayoutDashboard />} text="Dashboard" active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} expanded={sidebarOpen} />
          <SidebarItem icon={<ClipboardList />} text="Orders" active={activeTab === 'orders'} 
            onClick={() => setActiveTab('orders')} expanded={sidebarOpen} />
          <SidebarItem icon={<UtensilsCrossed />} text="Menu" active={activeTab === 'menu'} 
            onClick={() => setActiveTab('menu')} expanded={sidebarOpen} />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              {activeTab === 'dashboard' && 'Restaurant Dashboard'}
              {activeTab === 'orders' && 'Order Management'}
              {activeTab === 'menu' && 'Menu Management'}
            </h2>
          </div>
        </header>

        <main className="p-6">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <StatCard 
                title="Today's Sales" 
                value={`$${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}`}
                icon={<DollarSign className="text-[#FF4500]" />} 
              />
              <StatCard 
                title="Pending Orders" 
                value={orders.filter(order => order.status === 'pending').length.toString()}
                icon={<Clock className="text-yellow-500" />} 
              />
              <StatCard 
                title="Completed Orders" 
                value={orders.filter(order => order.status === 'completed').length.toString()}
                icon={<CheckCircle className="text-green-500" />} 
              />

              {/* Sales Chart */}
              <div className="col-span-full md:col-span-2 bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Orders Overview</h3>
                  <button 
                    onClick={downloadCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-[#FF4500] text-white rounded-lg hover:bg-[#CC3700]"
                  >
                    <Download size={16} />
                    Export CSV
                  </button>
                </div>
                <div className="h-64">
                  <Pie data={chartData} options={{ maintainAspectRatio: false }} />
                </div>
              </div>

              {/* Recent Orders Summary */}
              <div className="col-span-full md:col-span-1 bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                <div className="space-y-4">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">Table #{order.tableNumber}</p>
                          <p className="text-sm text-gray-600">{order.items.join(', ')}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          order.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>${order.total.toFixed(2)} • {order.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map(order => (
                <div key={order.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Table #{order.tableNumber}</h3>
                      <p className="text-sm text-gray-500">Order #{order.id}</p>
                    </div>
                    <button
                      onClick={() => toggleOrderStatus(order.id)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        order.status === 'completed' 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      }`}
                    >
                      {order.status === 'completed' ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle size={14} />
                          Completed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          Pending
                        </span>
                      )}
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="font-medium">Items:</p>
                      <ul className="list-disc list-inside text-gray-600">
                        {order.items.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium">Notes:</p>
                      <p className="text-gray-600">{order.notes}</p>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <p className="text-gray-500">{order.time}</p>
                      <p className="font-semibold">${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'menu' && (
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
          )}
        </main>
      </div>
    </div>
  );
}

// Component for sidebar items
function SidebarItem({ icon, text, active, onClick, expanded }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center px-4 py-3 ${
        active ? 'bg-[#FF4500] text-white' : 'text-gray-300 hover:bg-[#2e2a5d]'
      }`}
    >
      <span className="mr-3">{icon}</span>
      {expanded && <span>{text}</span>}
    </button>
  );
}

// Component for stats cards
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default App;