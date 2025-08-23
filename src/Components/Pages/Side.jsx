import React from "react";

const Sidebar = ({ open, setOpen, active, setActive }) => {
  const menuItems = [
    "Home",
    "Orders",
    "Customers",
    "Users",
    "Prices",
    "Transactions",
    "Analytics",
  ];

  return (
    <aside className="hidden md:block w-4 bg-white border-r border-gray-200">
      <div className="p-4">
        <div className="text-blue-600 text-xl font-bold mb-6">Admin</div>

        <nav className="flex flex-col gap-1 text-gray-600">
          {menuItems.map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`text-left px-3 py-2 rounded-md transition-colors ${
                active === item
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "hover:bg-gray-100"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
