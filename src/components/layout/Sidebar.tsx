import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { Home, Settings, FolderKanban } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [adminExpanded, setAdminExpanded] = useState(true);
  const [settingsExpanded, setSettingsExpanded] = useState(true);

  const isActive = (href: string) => location.pathname === href;

  return (
    <aside className="w-[390px] h-screen bg-[#0F766E] border-r shadow-sm flex flex-col py-4">
      <div className="px-4 pb-4 text-xl font-[Montserrat] tracking-widest font-bold line text-[#F6EDDE]">ASSETS
        <p className='text-xs'>M A N A G E M E N T   S Y S T E M</p>
      </div>
      <nav className="flex flex-col gap-2 text-sm text-gray-700">
        <Link
          to="/dashboard"
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            isActive('/dashboard') ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
          }`}
        >
          <Home size={18} />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/portfolio"
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            isActive('/portfolio') ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
          }`}
        >
          <FolderKanban size={18} />
          <span>Portfolio</span>
        </Link>

        <Link
          to="/sales"
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            isActive('/sales') ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
          }`}
        >
          <FontAwesomeIcon icon={faUsers} />
          <span>Sales Manager</span>
        </Link>

        <Link
          to="/service"
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            isActive('/service') ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
          }`}
        >
          <FontAwesomeIcon icon={faUsers} />
          <span>Service Manager</span>
        </Link>

        {/* Administration Group */}
        <div>
          <button
            onClick={() => setAdminExpanded((prev) => !prev)}
            className={`w-full flex items-center justify-between px-4 py-2 rounded-md ${
              location.pathname.includes('/branches') ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <Settings size={18} />
              <span>Administration</span>
            </div>
            <span>{adminExpanded ? '▾' : '▸'}</span>
          </button>

          {adminExpanded && (
            <div className="ml-6 mt-1 flex flex-col gap-1">
              {/* Settings Subgroup */}
              <button
                onClick={() => setSettingsExpanded((prev) => !prev)}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-md ${
                  location.pathname.includes('/branches') ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Settings size={18} />
                  <span>Settings</span>
                </div>
                <span>{settingsExpanded ? '▾' : '▸'}</span>
              </button>

              {settingsExpanded && (
                <div className="ml-6 mt-1 flex flex-col gap-1">
                  <Link
                    to="/branches"
                    className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                      isActive('/branches') ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    <FontAwesomeIcon icon={faBuilding} />
                    <span>Branches</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
