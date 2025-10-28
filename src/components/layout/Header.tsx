import React from 'react';

const Header: React.FC = () => {
  return (
 <header className="bg-[#005C5C] text-white border-b border-gray-700">
  <div className="flex items-center justify-between px-6 py-1.5">
    <div className="flex-1">
      {/* Optional left content like logo or page title */}
    </div>

    <div className="flex items-center space-x-4">
      <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <svg
            className="w-4 h-4 text-gray-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <span className="text-sm font-medium">Admin</span>
      </button>
    </div>
  </div>
</header>


  );
};

export default Header;