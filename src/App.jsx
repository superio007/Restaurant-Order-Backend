import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  UtensilsCrossed, 
  Menu as MenuIcon,
  LogOut
} from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Dashboard from "./Pages/Dashboard";
import Orders from './Pages/Orders';
import Menu from "./Pages/Menu";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import SidebarItem from './components/SidebarItem';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
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

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleSignup = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowSignup(false);
  };

  const handleAddMenuItem = (e) => {
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

  const handleDeleteMenuItem = (id) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  const toggleOrderStatus = (orderId) => {
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

  if (!isAuthenticated) {
    if (showSignup) {
      return <Signup onSignup={handleSignup} onSwitchToLogin={() => setShowSignup(false)} />;
    }
    return <Login onLogin={handleLogin} onSwitchToSignup={() => setShowSignup(true)} />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-[#1e1b4b] text-white transition-all duration-300`}
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex justify-start align-center">
            <img
              className={`${sidebarOpen ? "block" : "hidden"}`}
              style={{ width: "14rem" }}
              src="./src/assets/site-horizontal-v1.svg"
              alt="site-horizontal-v1"
            />
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
            <MenuIcon size={24} />
          </button>
        </div>
        <nav className="mt-8">
          <SidebarItem
            icon={<LayoutDashboard />}
            text="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
            expanded={sidebarOpen}
          />
          <SidebarItem
            icon={<ClipboardList />}
            text="Orders"
            active={activeTab === "orders"}
            onClick={() => setActiveTab("orders")}
            expanded={sidebarOpen}
          />
          <SidebarItem
            icon={<UtensilsCrossed />}
            text="Menu"
            active={activeTab === "menu"}
            onClick={() => setActiveTab("menu")}
            expanded={sidebarOpen}
          />
          <div className="mt-auto pt-4 border-t border-gray-700">
            <SidebarItem
              icon={<LogOut />}
              text="Logout"
              onClick={handleLogout}
              expanded={sidebarOpen}
            />
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              {activeTab === "dashboard" && "Restaurant Dashboard"}
              {activeTab === "orders" && "Order Management"}
              {activeTab === "menu" && "Menu Management"}
            </h2>
          </div>
        </header>

        <main className="p-6">
          {activeTab === "dashboard" && <Dashboard orders={orders} />}
          {activeTab === "orders" && (
            <Orders orders={orders} toggleOrderStatus={toggleOrderStatus} />
          )}
          {activeTab === "menu" && (
            <Menu
              menuItems={menuItems}
              newMenuItem={newMenuItem}
              setNewMenuItem={setNewMenuItem}
              handleAddMenuItem={handleAddMenuItem}
              handleDeleteMenuItem={handleDeleteMenuItem}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;