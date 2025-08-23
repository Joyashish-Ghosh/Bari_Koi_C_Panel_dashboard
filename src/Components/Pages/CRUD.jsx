// import React, { useState } from "react";
// import { Bars3Icon } from "@heroicons/react/24/outline";
// import Sidebar from "./Side";

// const CRUD = () => {
//   const [open, setOpen] = useState(false);
//   const [active, setActive] = useState("Users");

//   return (
//     <div className="flex flex-1 bg-gray-50 relative min-h-[calc(100vh-128px)]">
//       {/* Sidebar */}
//       <Sidebar open={open} setOpen={setOpen} active={active} setActive={setActive} />

//       {/* Mobile overlay */}
//       {open && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-40 md:hidden z-40"
//           onClick={() => setOpen(false)}
//         />
//       )}

//       {/* Main Content */}
//       <main className="flex-1 p-6 overflow-y-auto md:ml-64">
//         <div className="md:hidden mb-4">
//           <button onClick={() => setOpen(true)}>
//             <Bars3Icon className="w-6 h-6 text-gray-700" />
//           </button>
//         </div>

//         <h1 className="text-2xl font-semibold mb-6">{active}</h1>
//         {/* Add your CRUD content below */}
//         <p>This is the {active} section.</p>
//       </main>
//     </div>
//   );
// };

// export default CRUD;
// CRUD.jsx - Enhanced With Vibrant Color Highlights
// import React from 'react';

// const CRUD = () => {
//   return (
//     <div className="p-6 w-full bg-[#f0f2f5] min-h-screen">
//       {/* Top Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
//         {[
//           { label: 'Total Users', value: '1,204', bg: 'bg-blue-600/90', icon: '👥' },
//           { label: 'Total Revenue', value: '$32,500', bg: 'bg-green-600/90', icon: '💰' },
//           { label: 'Sales', value: '8,451', bg: 'bg-yellow-500/90', icon: '🛒' },
//           { label: 'Revenue', value: '$18,920', bg: 'bg-rose-500/90', icon: '📈' },
//         ].map((item, idx) => (
//           <div
//             key={idx}
//             className={`p-5 rounded-xl shadow-lg text-white ${item.bg} hover:brightness-105 transition`}
//           >
//             <div className="flex justify-between items-center">
//               <div>
//                 <p className="text-sm opacity-90">{item.label}</p>
//                 <h2 className="text-3xl font-semibold mt-1">{item.value}</h2>
//               </div>
//               <div className="text-4xl opacity-80">{item.icon}</div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Sales Chart & Activity */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
//         {/* Sales Report */}
//         <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg">
//           <h3 className="text-lg font-semibold mb-4 text-indigo-700">Sales Report</h3>
//           <div className="h-48 flex items-center justify-center bg-indigo-100 text-indigo-700 font-medium rounded-md">
//             📊 Chart Placeholder
//           </div>
//         </div>

//         {/* Recent Activity */}
//         <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg">
//           <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Activity</h3>
//           <ul className="space-y-3 text-sm text-gray-800">
//             <li className="flex items-start gap-2">
//               <span className="text-green-500">✔</span>
//               <span>John Doe completed task <span className="text-xs text-gray-500">(2h ago)</span></span>
//             </li>
//             <li className="flex items-start gap-2">
//               <span className="text-blue-500">🟢</span>
//               <span>New user registered <span className="text-xs text-gray-500">(5h ago)</span></span>
//             </li>
//             <li className="flex items-start gap-2">
//               <span className="text-purple-500">✏️</span>
//               <span>John Doe updated record <span className="text-xs text-gray-500">(1d ago)</span></span>
//             </li>
//             <li className="flex items-start gap-2">
//               <span className="text-yellow-500">✔</span>
//               <span>You completed a task <span className="text-xs text-gray-500">(2d ago)</span></span>
//             </li>
//             <li className="flex items-start gap-2">
//               <span className="text-red-500">❌</span>
//               <span>Deleted an account <span className="text-xs text-gray-500">(2d ago)</span></span>
//             </li>
//           </ul>
//         </div>
//       </div>

//       {/* Latest Users Table */}
//       <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg">
//         <h3 className="text-lg font-semibold mb-4 text-gray-800">Latest Users</h3>
//         <table className="w-full text-sm text-left">
//           <thead>
//             <tr className="text-gray-600 border-b">
//               <th className="py-2">Name</th>
//               <th className="py-2">Email</th>
//               <th className="py-2">Status</th>
//             </tr>
//           </thead>
//           <tbody className="text-gray-700">
//             <tr className="hover:bg-gray-50">
//               <td className="py-2 font-medium">Alice Smith</td>
//               <td className="py-2">alice.smith@example.com</td>
//               <td className="py-2 text-green-600 font-semibold">Active</td>
//             </tr>
//             <tr className="hover:bg-gray-50">
//               <td className="py-2 font-medium">Bob Johnson</td>
//               <td className="py-2">bob.johnson@example.co</td>
//               <td className="py-2 text-red-500 font-semibold">Inactive</td>
//             </tr>
//             <tr className="hover:bg-gray-50">
//               <td className="py-2 font-medium">Carol Williams</td>
//               <td className="py-2">carol.williams@example.co</td>
//               <td className="py-2 text-red-500 font-semibold">Inactive</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default CRUD;






// Dashboard.jsx;
// import React, { useState } from "react";
// import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
// import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

// const data = [
//   { name: "Dec 1", revenue: 1000 },
//   { name: "Dec 2", revenue: 1200 },
//   { name: "Dec 3", revenue: 800 },
//   { name: "Dec 4", revenue: 1600 },
//   { name: "Dec 5", revenue: 1500 },
//   { name: "Dec 6", revenue: 1400 },
//   { name: "Dec 7", revenue: 1300 },
// ];

// const CRUD = () => {
//   const [open, setOpen] = useState(false);
//   const [active, setActive] = useState("Home");

//   const menuItems = [
//     "Home",
//     "Orders",
//     "Customers",
//     "Users",
//     "Prices",
//     "Transactions",
//     "Analytics",
//   ];

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <aside
//         className={`fixed top-0 left-0 h-full bg-white shadow-md p-4 transform ${
//           open ? "translate-x-0" : "-translate-x-full"
//         } transition-transform duration-300 md:translate-x-0 md:w-64 z-50`}
//       >
//         <div className="flex items-center justify-between mb-6">
//           <div className="text-blue-600 text-xl font-bold">Admin</div>
//           <button className="md:hidden" onClick={() => setOpen(false)}>
//             <XMarkIcon className="w-6 h-6 text-gray-600" />
//           </button>
//         </div>
//         <nav className="flex flex-col gap-1 text-gray-600">
//           {menuItems.map((item) => (
//             <a
//               key={item}
//               href="#"
//               onClick={() => setActive(item)}
//               className={`px-3 py-2 rounded-md transition-colors ${
//                 active === item
//                   ? "bg-blue-100 text-blue-600 font-medium"
//                   : "hover:bg-gray-100"
//               }`}
//             >
//               {item}
//             </a>
//           ))}
//         </nav>
//       </aside>

//       {/* Overlay for mobile */}
//       {open && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-40 md:hidden"
//           onClick={() => setOpen(false)}
//         ></div>
//       )}

//       {/* Main Content */}
//       <main className="flex-1 md:ml-64 p-6 overflow-y-auto">
//         {/* Mobile menu button */}
//         <div className="md:hidden mb-4">
//           <button onClick={() => setOpen(true)}>
//             <Bars3Icon className="w-6 h-6 text-gray-700" />
//           </button>
//         </div>

//         <h1 className="text-2xl font-semibold mb-6">{active}</h1>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           <Card title="Total Revenue (30 days)" value="$14,169.92" />
//           <Card title="Average Revenue / Day" value="$472.33" />
//           <Card title="Total Orders (30 days)" value="347" />
//           <Card title="Average Orders / Day" value="11.57" />
//         </div>

//         {/* Chart and Orders */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
//           <div className="bg-white p-4 rounded shadow">
//             <div className="flex justify-between items-center mb-2">
//               <div className="font-semibold">Revenue</div>
//               <button className="text-sm text-blue-600">Export CSV</button>
//             </div>
//             <ResponsiveContainer width="100%" height={200}>
//               <LineChart data={data}>
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line
//                   type="monotone"
//                   dataKey="revenue"
//                   stroke="#3b82f6"
//                   strokeWidth={2}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//           <div className="bg-white p-4 rounded shadow">
//             <div className="flex justify-between items-center mb-2">
//               <div className="font-semibold">Recent Orders</div>
//               <button className="text-sm text-blue-600">Export CSV</button>
//             </div>
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="text-left text-gray-600">
//                   <th>ID</th>
//                   <th>Customer</th>
//                   <th>Created</th>
//                   <th>Price</th>
//                   <th>Location</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr className="border-t">
//                   <td>577</td>
//                   <td>John Doe</td>
//                   <td>Dec 7, 2024</td>
//                   <td className="text-green-600">CA$30.76</td>
//                   <td>
//                     <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
//                       At store
//                     </span>
//                   </td>
//                   <td>
//                     <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
//                       Not paid
//                     </span>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td>575</td>
//                   <td>Jane Smith</td>
//                   <td>Dec 7, 2024</td>
//                   <td className="text-green-600">CA$16.95</td>
//                   <td>
//                     <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
//                       At store
//                     </span>
//                   </td>
//                   <td>
//                     <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
//                       Not paid
//                     </span>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Bottom Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           <SmallCard title="Users" />
//           <SmallCard title="Permissions" />
//           <SmallCard title="Roles" />
//           <SmallCard title="Analytics" />
//         </div>
//       </main>
//     </div>
//   );
// };

// const Card = ({ title, value }) => (
//   <div className="bg-white p-4 rounded shadow">
//     <div className="text-gray-500 text-sm">{title}</div>
//     <div className="text-xl font-bold">{value}</div>
//   </div>
// );

// const SmallCard = ({ title }) => (
//   <div className="bg-white p-4 rounded shadow flex items-center justify-between">
//     <div>
//       <div className="text-sm text-gray-500">{title}</div>
//       <div className="text-blue-600 font-semibold cursor-pointer">
//         {title} →
//       </div>
//     </div>
//     <div className="text-blue-500">
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         fill="none"
//         viewBox="0 0 24 24"
//         strokeWidth={1.5}
//         stroke="currentColor"
//         className="w-5 h-5"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           d="M17.25 6.75L21 10.5m0 0l-3.75 3.75M21 10.5H3"
//         />
//       </svg>
//     </div>
//   </div>
// );

// export default CRUD;




import React, { useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Sidebar from "./Side";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { name: "Jan", uv: 3000 },
  { name: "Feb", uv: 4500 },
  { name: "Mar", uv: 6000 },
  { name: "Apr", uv: 6500 },
  { name: "May", uv: 7000 },
  { name: "Jun", uv: 7500 },
  { name: "Aug", uv: 8500 },
];

const users = [
  { name: "Alice Smith", email: "alice@example.com", status: "Active" },
  { name: "Bob Johnson", email: "bob@example.com", status: "Inactive" },
  { name: "Carol Williams", email: "carol@example.com", status: "Active" },
];

const CRUD = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Dashboard");

  return (
    <div className="flex flex-1 bg-gray-50 relative min-h-[calc(100vh-128px)]">
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} active={active} setActive={setActive} />

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 md:hidden z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto md:ml-64">
        {/* Mobile Menu Button */}
        <div className="md:hidden mb-4">
          <button onClick={() => setOpen(true)}>
            <Bars3Icon className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Page Title */}
        <h1 className="text-2xl font-semibold mb-6">{active}</h1>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { title: "Total Users", value: "1,204" },
            { title: "Total Revenue", value: "$32,500" },
            { title: "Sales", value: "8,451" },
            { title: "Revenue", value: "$18,920" },
          ].map((card, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer">
              <p className="text-gray-500">{card.title}</p>
              <h3 className="text-2xl font-bold">{card.value}</h3>
            </div>
          ))}
        </div>

        {/* Charts & Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <h4 className="text-lg font-semibold mb-2">Sales Report</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="uv" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h4 className="text-lg font-semibold mb-2">Recent Activity</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "✅ John completed task", time: "2h" },
                { label: "🟢 New user registered", time: "5h" },
                { label: "🔵 User updated record", time: "1d" },
              ].map((item, idx) => (
                <li key={idx}>
                  {item.label} —{" "}
                  <span className="text-gray-500">{item.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white p-4 rounded-xl shadow mt-6">
          <h4 className="text-lg font-semibold mb-2">Latest Users</h4>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-600">
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={idx} className="hover:bg-gray-50 cursor-pointer">
                  <td className="py-2">{user.name}</td>
                  <td className="py-2">{user.email}</td>
                  <td className={`py-2 ${user.status === "Active" ? "text-green-600" : "text-gray-500"}`}>
                    {user.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default CRUD;
