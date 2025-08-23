import React, { useState } from "react";
import axios from "axios";

import { Bars3Icon } from "@heroicons/react/24/outline";
import {
  BarChart,
  Bar,
  XAxis,
  Cell,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DashboardPage = () => {
  const [open, setOpen] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalCount, setTotalCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logData, setLogData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(100);
  const [selectedService, setSelectedService] = useState("tracking_services");
  const [filterService, setFilterService] = useState("");

  const [apiData, setApiData] = useState([
    { sl: 1, api: "from_visit", usage: 0 },
    { sl: 2, api: "from_attendance", usage: 0 },
    { sl: 3, api: "from_tracking", usage: 0 },
    { sl: 4, api: "from_web", usage: 0 },
    { sl: 5, api: "tracking_services", usage: 0 },
  ]);

  const services = [
    "from_visit",
    "from_attendance",
    "from_tracking",
    "from_web",
    "tracking_services",
  ];
  const handleSearch = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end date");
      return;
    }

    setLoading(true);
    setTotalCount(null);
    setLogData([]);
    setSalesData([]);
    setApiData((prev) => prev.map((item) => ({ ...item, usage: 0 })));

    try {
      // 1️⃣ Master total + logs
      const res = await axios.get(
        "https://api.digigo.sbusiness.xyz/tracking-api/geo-location/v1/logs/data",
        {
          params: {
            business_id: "",
            business_member_id: "",
            skip: page * limit,
            limit: limit,
            service_name: selectedService,
            from_date: startDate,
            to_date: endDate,
          },
        }
      );

      if (res.data?.issuccess && res.data.data?.data) {
        const logs = res.data.data.data;
        const total = res.data.data.total;

        setTotalCount(total);
        setLogData(logs);

        // Monthly aggregation
        const monthMap = {};
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        monthNames.forEach((m) => (monthMap[m] = 0));
        logs.forEach((log) => {
          const monthIndex = new Date(log.created_at).getMonth();
          monthMap[monthNames[monthIndex]] += 1;
        });
        const monthlySales = monthNames.map((m) => ({
          month: m,
          sales: monthMap[m],
          total,
        }));
        setSalesData(monthlySales);
      } else {
        setTotalCount(0);
        setLogData([]);
        setSalesData([]);
      }

      // 2️⃣ Service-wise totals (for table)
        let grandTotal = 0;
      for (const service of services) {
        const resService = await axios.get(
          "https://api.digigo.sbusiness.xyz/tracking-api/geo-location/v1/logs/data",
          {
            params: {
              business_id: "",
              business_member_id: "",
              skip: page * limit,
              limit: limit,
              service_name: service,
              from_date: startDate,
              to_date: endDate,
            },
          }
        );

        const serviceTotal = resService.data?.data?.total ?? 0;
grandTotal += serviceTotal;
        setApiData((prev) =>
          prev.map((item) =>
            item.api === service ? { ...item, usage: serviceTotal } : item
          )
        );
      }
          setTotalCount(grandTotal);

    } catch (error) {
      console.error("Error fetching API data:", error);
      setTotalCount(0);
      setLogData([]);
      setSalesData([]);
      setApiData((prev) => prev.map((item) => ({ ...item, usage: 0 })));
    } finally {
      setLoading(false);
    }
  };
  // Add useEffect for page change
  React.useEffect(() => {
    if (startDate && endDate) {
      handleSearch();
    }
  }, [page, selectedService]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 md:hidden z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto p-6 md:ml-4">
        {/* Mobile Menu Button */}
        <div className="md:hidden mb-4">
          <button onClick={() => setOpen(true)}>
            <Bars3Icon className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* PAGE TITLE */}
        <div className="w-full flex justify-center">
          <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            BARI KOI Api Dashboard
          </h1>
        </div>

        {/* 1️⃣ DATE RANGE SEARCH */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-wrap gap-4 items-center justify-center">
          {/* Start Date */}
          <input
            type="date"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <span className="text-lg font-semibold">→</span>

          {/* End Date */}
          <input
            type="date"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          {/* Get Count Button */}
          <button
            onClick={handleSearch}
            className="bg-gradient-to-r from-green-400 to-green-500 text-white font-bold px-6 py-3 rounded shadow hover:opacity-90 transition"
          >
            Get Count
          </button>

          {/* Total Count */}
          {loading ? (
            <div className="flex justify-center mt-2">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : totalCount !== null ? (
            <div className=" gap-10 bg-gradient-to-r from-green-100 to-green-200 shadow-inner rounded-lg px-5 py-3 text-center border border-green-300">
              <h3 className="text-xl font-bold text-green-800 uppercase tracking-wide">
                Total Count 
              </h3>
              <p className="text-2xl font-bold text-green-700 mt-1">
                {totalCount}
              </p>
            </div>
          ) : null}
        </div>

        {/* 2️⃣ API USAGE TABLE */}
        <div className="bg-white rounded-2xl shadow-xl p-6 w-full mb-8">
          <h4 className="text-xl font-bold mb-5 text-gray-800">
            API Usage Table
          </h4>
          <table className="w-full border border-gray-200 rounded-xl">
            <thead className="bg-gradient-to-r from-green-400 to-green-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  SL
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  API
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Usage
                </th>
              </tr>
            </thead>
            <tbody>
              {apiData.map((row, idx) => (
                <tr
                  key={row.sl}
                  className={`transition duration-200 hover:bg-green-100 ${
                    idx % 2 === 0 ? "bg-green-50/50" : "bg-white"
                  }`}
                >
                  <td className="px-6 py-3 text-gray-800 font-medium">
                    {row.sl}
                  </td>
                  <td className="px-6 py-3 text-gray-800">{row.api}</td>
                  <td className="px-6 py-3 text-gray-800 font-semibold">
                    {row.usage} calls
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4️⃣ CHARTS & ACTIVITY */}

        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={salesData.map((entry) => {
              const selectedMonth = startDate
                ? new Date(startDate).toLocaleString("default", {
                    month: "short",
                  })
                : null;

              // Replace sales with totalCount for selected month
              return {
                ...entry,
                sales:
                  entry.month === selectedMonth ? totalCount || 0 : entry.sales,
              };
            })}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value, name, props) => {
                const selectedMonth = startDate
                  ? new Date(startDate).toLocaleString("default", {
                      month: "short",
                    })
                  : null;

                if (props.payload.month === selectedMonth) {
                  return [totalCount, "Total Count"]; // Show totalCount in tooltip
                }
                return [value, name]; // default
              }}
            />
            <Bar dataKey="sales" name="Total Count">
              {salesData.map((entry, index) => {
                const selectedMonth = startDate
                  ? new Date(startDate).toLocaleString("default", {
                      month: "short",
                    })
                  : null;

                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.month === selectedMonth ? "#22c55e" : "#3b82f6"}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {logData.length > 0 && (
          <div className="bg-white p-4 rounded-xl shadow mt-60">
            <h4 className="text-lg font-semibold mb-2">API Hit Logs</h4>

            {/* 🔹 Dropdown Filter */}
            <div className="mb-4 flex items-center gap-4">
              <label className="font-medium">Filter by Service:</label>
              <select
                value={filterService}
                onChange={(e) => {
                  const value = e.target.value;
                  setFilterService(value); // frontend dropdown state
                  setSelectedService(value || "tracking_services"); // backend filter

                  setPage(0); // reset page on filter change
                }}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="">Tracking Service</option>
                {services.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <table className="w-full text-left text-sm border border-gray-200">
              <thead>
                <tr className="bg-green-50">
                  <th className="py-2 px-3">ID</th>
                  <th className="py-2 px-3">Service Name</th>
                  <th className="py-2 px-3">Address</th>
                  <th className="py-2 px-3">Created By</th>
                  <th className="py-2 px-3">Date</th>
                </tr>
              </thead>

              <tbody>
                {logData
                  .filter((item) => {
                    if (!filterService) return true; // "All" selected
                    return item.service_name === filterService; // exact match
                  })
                  .map((item) => {
                    const parsedLog = JSON.parse(item.log || "{}");
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="py-2 px-3">{item.id}</td>
                        <td className="py-2 px-3">{item.service_name}</td>
                        <td className="py-2 px-3">
                          {parsedLog.address || "N/A"}
                        </td>
                        <td className="py-2 px-3">{item.created_by_name}</td>
                        <td className="py-2 px-3">
                          {new Date(item.created_at).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {totalCount > 0 && (
          <div className="flex justify-end items-center gap-4 mt-4">
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="px-5 py-1 bg-blue-700 text-white rounded hover:bg-blue-400 disabled:opacity-100 cursor-pointer"
            >
              Prev
            </button>

            <span className="text-blue-700 font-semibold">
              Page {page + 1} of {Math.ceil(totalCount / limit)}
            </span>

            <button
              disabled={(page + 1) * limit >= totalCount}
              onClick={() => setPage(page + 1)}
              className="px-5 py-1 bg-blue-800 text-white rounded hover:bg-blue-500 disabled:opacity-100"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
