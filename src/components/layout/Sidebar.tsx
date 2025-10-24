import { useState } from "react";
import { FaChevronDown, FaChevronRight, FaHome, FaFolder, FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <aside className="w-64 bg-[#0F766E] text-white h-screen flex flex-col fixed">
      {/* Logo */}
      <div className="p-4 text-center font-bold text-lg border-b border-emerald-800">
        <span className="text-emerald-300">ASSETS</span> MANAGEMENT SYSTEM
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto p-2">
        {/* Dashboard */}
        <Link
          to="/"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-emerald-800"
        >
          <FaHome />
          <span>Dashboard</span>
        </Link>

        {/* Portfolio */}
        <div>
          <button
            onClick={() => toggleMenu("portfolio")}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-emerald-800"
          >
            <span className="flex items-center gap-3">
              <FaFolder />
              Portfolio
            </span>
            {openMenu === "portfolio" ? <FaChevronDown /> : <FaChevronRight />}
          </button>
          {openMenu === "portfolio" && (
            <div className="ml-8 flex flex-col gap-2 mt-1">
              <Link to="/portfolio/explore" className="hover:text-emerald-300">
                Explore
              </Link>
              <Link to="/portfolio/survey" className="hover:text-emerald-300">
                Survey
              </Link>
            </div>
          )}
        </div>

        {/* Administration */}
        <div>
          <button
            onClick={() => toggleMenu("admin")}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-emerald-800"
          >
            <span className="flex items-center gap-3">
              <FaCog />
              Administration
            </span>
            {openMenu === "admin" ? <FaChevronDown /> : <FaChevronRight />}
          </button>
          {openMenu === "admin" && (
            <div className="ml-8 flex flex-col gap-2 mt-1">
              <Link to="/admin/settings/branches" className="hover:text-emerald-300">
                Branches
              </Link>
              <Link to="/admin/users" className="hover:text-emerald-300">
                Users
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-emerald-800 text-sm text-center">
        © 2025 Assets System
      </div>
    </aside>
  );
};

export default Sidebar;
