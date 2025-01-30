import React from 'react';

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

export default SidebarItem;