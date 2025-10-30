import React from "react";
import Frame from "../../assets/Frame.png";

const Header: React.FC<{ setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setIsSidebarOpen }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#005C5C] text-white border-b border-gray-700">
      <div className="flex items-center justify-between px-4 py-2">
        
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden text-white"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <img src={Frame} alt="ASSETS Logo" className="h-8 w-auto" />
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
