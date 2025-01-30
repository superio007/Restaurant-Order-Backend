import React from 'react';
import { DollarSign, Clock, CheckCircle, Download } from 'lucide-react';
import { Pie } from 'react-chartjs-2';
import StatCard from '../components/StatCard';

function Dashboard({ orders }) {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {console.log(orders)}
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
  );
}

export default Dashboard;