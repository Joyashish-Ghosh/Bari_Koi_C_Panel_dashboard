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
const today = new Date().toISOString().split("T")[0];

// Default আজকের তারিখ সেট করা
const [startDate, setStartDate] = useState(today);
const [endDate, setEndDate] = useState(today);
 
  const [totalCount, setTotalCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logData, setLogData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(100);
  const [selectedService, setSelectedService] = useState("tracking_services");
  const [filterService, setFilterService] = useState("");
  const [sortKey, setSortKey] = useState("id"); 
  const [sortDir, setSortDir] = useState("desc"); 
  const [expanded, setExpanded] = useState(new Set()); 
  const [copiedId, setCopiedId] = useState(null);

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
  // Derived logs for current filter
  const filteredLogs = logData.filter((item) => {
    if (!filterService) return true;
    return item.service_name === filterService;
  });
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    const val = (key, obj) => {
      if (key === "address") {
        try {
          const parsed = JSON.parse(obj.log || "{}");
          return (parsed.address || "").toString().toLowerCase();
        } catch {
          return "";
        }
      }
      const v = (obj[key] ?? "").toString().toLowerCase();
      return key === "id" ? Number(obj.id) : v;
    };
    const av = val(sortKey, a);
    const bv = val(sortKey, b);
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text || "");
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1200);
    } catch (e) {
      console.error("Copy failed", e);
      alert("Failed to copy");
    }
  };

  const formatDate = (iso) => {
    try {
      return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  // Friendly label for selected service
  const humanizeService = (s) => {
    if (!s || s === "tracking_services") return "All Services";
    return s
      .toString()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Reset filters and UI state to defaults
  const handleReset = () => {
    setStartDate(today);
    setEndDate(today);
    setTotalCount(null);
    setLogData([]);
    setSalesData([]);
    setPage(0);
    setLimit(100);
    setSelectedService("tracking_services");
    setFilterService("");
    setExpanded(new Set());
    setSortKey("id");
    setSortDir("desc");
    setApiData((prev) => prev.map((item) => ({ ...item, usage: 0 })));
  };
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
      let totalForSelected = 0;
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
        if (service === selectedService) {
          totalForSelected = serviceTotal;
        }
        setApiData((prev) =>
          prev.map((item) =>
            item.api === service ? { ...item, usage: serviceTotal } : item
          )
        );
      }
      // If "All Services" is selected (tracking_services), show aggregated sum.
      // Otherwise, show the selected service total so it matches the usage table.
      if (selectedService === "tracking_services") {
        setTotalCount(grandTotal);
      } else {
        setTotalCount(totalForSelected);
      }

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
  handleSearch(); // component mount e auto call
}, [startDate, endDate, selectedService, page, limit]);

  return (
    <div className="flex min-h-screen bg-slate-50">
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
          <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#070742] via-[#0a0a5b] to-[#13137a] bg-clip-text text-transparent">
            Bari Koi API Dashboard
          </h1>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Total Count</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-700">{totalCount ?? 0}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Selected Service</p>
            <p className="mt-1 text-lg font-medium text-slate-800">{humanizeService(selectedService)}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Date Range</p>
<p className="mt-1 text-sm font-medium text-slate-800">
  {(startDate ? new Date(startDate).toLocaleDateString() : '—')} → {(endDate ? new Date(endDate).toLocaleDateString() : '—')}
</p>          </div>
        </div>

        {/* 1️⃣ DATE RANGE SEARCH */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-center justify-center">
          {/* Start Date */}
          <input
            type="date"
            className="border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0a0a5b]"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <span className="text-lg font-semibold">→</span>

          {/* End Date */}
          <input
            type="date"
            className="border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          {/* Get Count + Reset Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-[#070742] to-[#13137a] text-white font-semibold px-6 py-3 rounded-lg shadow hover:opacity-95 transition"
            >
              Get Count
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 shadow-sm"
              title="Reset filters and results"
            >
              Reset
            </button>
          </div>

          {/* Total Count */}
          {loading ? (
            <div className="flex justify-center mt-2">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : totalCount !== null ? (
            <div className="gap-10 bg-gradient-to-r from-slate-50 to-slate-100 shadow-inner rounded-lg px-5 py-3 text-center border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 uppercase tracking-wide">
                Total Count 
              </h3>
              <p className="text-2xl font-bold text-[#0a0a5b] mt-1">
                {totalCount}
              </p>
            </div>
          ) : null}
        </div>

        {/* 2️⃣ API USAGE TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 w-full mb-8">
          <h4 className="text-xl font-bold mb-5 text-gray-800">
            API Usage Table
          </h4>
          <table className="w-full border border-gray-200 rounded-xl">
            <thead className="bg-gradient-to-r from-[#070742] to-[#13137a] text-white">
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
                  className={`transition duration-200 hover:bg-indigo-50 ${
                    idx % 2 === 0 ? "bg-indigo-50/40" : "bg-white"
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

        <ResponsiveContainer width="100%" height={220}>
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
                    fill={entry.month === selectedMonth ? "#0a0a5b" : "#38bdf8"}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {logData.length > 0 && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mt-8">
            <h4 className="text-xl font-bold mb-1 text-slate-800">API Hit Logs</h4>
            <p className="text-sm text-slate-500 mb-4">Detailed request activity. Use the filter to narrow by service.</p>

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
                className="border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0a0a5b]"
              >
                <option value="">All Services</option>
                {services.map((s) => (
                  <option key={s} value={s}>
                    {humanizeService(s)}
                  </option>
                ))}
              </select>
            </div>

            {/* Empty state */}
            {sortedLogs.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="mx-auto h-10 w-10 rounded-full bg-[#0a0a5b]/10 flex items-center justify-center mb-3">
                    <span className="text-[#0a0a5b] text-lg">ℹ️</span>
                  </div>
                  <p className="text-slate-700 font-medium">No logs match the current filter.</p>
                  <p className="text-slate-500 text-sm">Try removing or changing the filter.</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full text-left text-sm">
                  <thead className="sticky top-0 z-10 bg-gradient-to-r from-[#070742] to-[#13137a] text-white">
                    <tr>
                      <th onClick={() => toggleSort('id')} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide cursor-pointer select-none">
                        ID {sortKey==='id' && (sortDir==='asc' ? '▲' : '▼')}
                      </th>
                      <th onClick={() => toggleSort('service_name')} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide cursor-pointer select-none">
                        Service {sortKey==='service_name' && (sortDir==='asc' ? '▲' : '▼')}
                      </th>
                      <th onClick={() => toggleSort('address')} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide cursor-pointer select-none">
                        Address {sortKey==='address' && (sortDir==='asc' ? '▲' : '▼')}
                      </th>
                      <th onClick={() => toggleSort('created_by_name')} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide cursor-pointer select-none">
                        Created By {sortKey==='created_by_name' && (sortDir==='asc' ? '▲' : '▼')}
                      </th>
                      <th onClick={() => toggleSort('created_at')} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide cursor-pointer select-none">
                        Date {sortKey==='created_at' && (sortDir==='asc' ? '▲' : '▼')}
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sortedLogs.map((item) => {
                      let parsedLog = {};
                      try { parsedLog = JSON.parse(item.log || "{}"); } catch {}
                      const address = parsedLog.address || "N/A";
                      const isExpanded = expanded.has(item.id);
                      return (
                        <React.Fragment key={item.id}>
                          <tr className="even:bg-slate-50 transition hover:bg-indigo-50">
                            <td className="px-4 py-3 align-top">
                              <span className="font-mono text-xs bg-slate-100 rounded px-2 py-1 border border-slate-200 text-slate-700">
                                {item.id}
                              </span>
                            </td>
                            <td className="px-4 py-3 align-top">
                              <span className="inline-flex items-center rounded-full bg-[#0a0a5b]/10 text-[#0a0a5b] px-2.5 py-0.5 text-xs font-medium border border-[#0a0a5b]/20">
                                {item.service_name}
                              </span>
                            </td>
                            <td className="px-4 py-3 align-top">
                              <div className="max-w-[320px] truncate" title={address}>
                                {address}
                              </div>
                            </td>
                            <td className="px-4 py-3 align-top text-slate-700">{item.created_by_name}</td>
                            <td className="px-4 py-3 align-top text-slate-700">{formatDate(item.created_at)}</td>
                            <td className="px-4 py-3 align-top">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => copyToClipboard(address, item.id)}
                                  className="px-2 py-1 text-xs rounded border border-slate-200 text-slate-700 hover:bg-slate-50"
                                  title="Copy address"
                                >
                                  {copiedId === item.id ? 'Copied' : 'Copy'}
                                </button>
                                <button
                                  onClick={() => toggleExpand(item.id)}
                                  className="px-2 py-1 text-xs rounded border border-slate-200 text-slate-700 hover:bg-slate-50"
                                  title="View JSON"
                                >
                                  {isExpanded ? 'Hide JSON' : 'View JSON'}
                                </button>
                              </div>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr className="bg-white/70">
                              <td colSpan={6} className="px-4 pb-4">
                                <pre className="mt-2 text-xs bg-slate-50 border border-slate-200 rounded p-3 overflow-x-auto">
{JSON.stringify(parsedLog, null, 2)}
                                </pre>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {totalCount > 0 && (
          <div className="flex flex-wrap justify-between items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">Rows per page:</label>
              <select
                value={limit}
                onChange={(e) => { setLimit(Number(e.target.value)); setPage(0); }}
                className="border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a0a5b]"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="px-5 py-1 bg-[#0a0a5b] text-white rounded hover:bg-[#13137a] disabled:opacity-50 cursor-pointer"
              >
                Prev
              </button>
              <span className="text-[#0a0a5b] font-semibold">
                Page {page + 1} of {Math.ceil(totalCount / limit)}
              </span>
              <button
                disabled={(page + 1) * limit >= totalCount}
                onClick={() => setPage(page + 1)}
                className="px-5 py-1 bg-[#13137a] text-white rounded hover:bg-[#0a0a5b] disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
</main>
</div>
);
};

export default DashboardPage;
