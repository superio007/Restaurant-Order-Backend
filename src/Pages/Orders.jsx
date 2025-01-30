import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

function Orders({ orders, toggleOrderStatus }) {
  return (
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
  );
}

export default Orders;