import React, { useState } from "react";
import Frame from "../../assets/Frame.png";

interface SidebarItem {
  id: string;
  label: string;
  icon?: string;
  children?: SidebarItem[];
  isOpen?: boolean;
}

const Sidebar: React.FC = () => {
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([
    {
      id: "dashboard",
      label: "Dashboard",
      children: [
        { id: "portfolio", label: "Portfolio" },
        { id: "explore", label: "Explore" },
        { id: "space-manager", label: "Space Manager" },
        { id: "asset-manager", label: "Asset Manager" },
        { id: "survey", label: "Survey" },
      ],
    },
    {
      id: "task-management",
      label: "Task Management",
      children: [
        { id: "my-tasks", label: "My Tasks" },
        { id: "ticket-manager", label: "Ticket Manager" },
        { id: "job-manager", label: "Job Manager" },
        { id: "job-lists", label: "Job lists" },
        { id: "job-calendar", label: "Job Calendar" },
        { id: "team-diary", label: "Team Diary" },
        { id: "job-nte-light-request", label: "Job NTE Light Request" },
        { id: "payment-request", label: "Payment Request" },
        { id: "planned-jobs", label: "Planned Jobs" },
      ],
    },
    {
      id: "warq-permits",
      label: "WARQ & Permits",
      children: [
        { id: "warq", label: "WARQ" },
        { id: "certification-rev", label: "Certification Rev" },
        { id: "checking-warq", label: "Checking WARQ" },
        { id: "issue-return", label: "Issue/Return" },
      ],
    },
    {
      id: "quote",
      label: "Quote",
      children: [{ id: "quote-manager", label: "Quote Manager" }],
    },
    {
      id: "service-providers",
      label: "Service Providers",
      children: [
        { id: "service-providers-list", label: "Service Providers" },
        { id: "users", label: "Users" },
        { id: "representatives", label: "Representatives" },
      ],
    },
    {
      id: "documents",
      label: "Documents",
      children: [
        { id: "library", label: "Library" },
        { id: "explorer", label: "Explorer" },
        { id: "reports", label: "Reports" },
      ],
    },
    {
      id: "compliance",
      label: "Compliance",
      children: [{ id: "compliance-overview", label: "Compliance overview" }],
    },
    {
      id: "finances",
      label: "Finances",
    },
    {
      id: "administration",
      label: "Administration",
      children: [
        { id: "my-profile", label: "My Profile" },
        { id: "my-notifications", label: "My notifications" },
        { id: "users", label: "Users" },
        { id: "contacts", label: "Contacts" },
      ],
    },
  ]);

  const toggleItem = (id: string) => {
    setSidebarItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  return (
    <div className="w-64 bg-[#0F766E] text-white h-screen overflow-y-auto">

<div className="flex items-center px-6 py-3 bg-[#005C5C] border-b border-gray-700">
  <img src={Frame} alt="ASSETS Logo" className="h-8 w-auto" />
</div>




      <nav className="py-4">
        {sidebarItems.map((item) => (
          <div key={item.id} className="mb-1">
            <button
              onClick={() => item.children && toggleItem(item.id)}
              className={`w-full text-left px-4 py-2 flex items-center justify-between hover:bg-gray-800 transition-colors ${
                item.children ? "font-semibold" : "font-normal"
              }`}
            >
              <span className="text-sm">{item.label}</span>
              {item.children && (
                <svg
                  className={`w-4 h-4 transform transition-transform ${
                    item.isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              )}
            </button>

            
            {item.children && item.isOpen && (
              <div className="ml-4 border-l border-gray-700">
                {item.children.map((child) => (
                  <button
                    key={child.id}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    {child.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
