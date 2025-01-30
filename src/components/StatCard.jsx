import React from 'react';

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

export default StatCard;