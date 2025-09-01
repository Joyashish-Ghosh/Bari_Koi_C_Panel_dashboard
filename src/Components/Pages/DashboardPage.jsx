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
  const [dailyData, setDailyData] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(100);
  const [selectedService, setSelectedService] = useState("tracking_services");
  const [filterService, setFilterService] = useState("");
  const [sortKey, setSortKey] = useState("id"); // id | service_name | address | created_by_name | created_at
  const [sortDir, setSortDir] = useState("desc"); // asc | desc
  const [expanded, setExpanded] = useState(new Set()); // ids expanded for JSON viewer
  const [copiedId, setCopiedId] = useState(null);

  const [apiData, setApiData] = useState([
    { sl: 1, api: "from_visit", usage: 0 },
    { sl: 2, api: "from_attendance", usage: 0 },
    { sl: 3, api: "from_tracking", usage: 0 },
    { sl: 4, api: "from_web", usage: 0 },
    { sl: 5, api: "tracking_services", usage: 0 },
  ]);
  const [serviceUsageData, setServiceUsageData] = useState([...apiData]);

  // Service keys: keep a base list for real services, and a UI list including the 'all' label
  const baseServices = [
    "from_visit",
    "from_attendance",
    "from_tracking",
    "from_web",
  ];
  const services = [...baseServices, "tracking_services"];
  // Derived logs for current filter
  const filteredLogs = logData.filter((item) => {
    if (!filterService) return true;
    return item.service_name === filterService;
  });
  
  // Get the usage count for the currently filtered service
  const getFilteredServiceCount = () => {
    if (!filterService) return totalCount;
    const service = serviceUsageData.find(s => s.api === filterService);
    return service ? service.usage : 0;
  };
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
    // reset to first page when sorting changes
    setPage(0);
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
    setStartDate("");
    setEndDate("");
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
    const resetData = apiData.map(item => ({ ...item, usage: 0 }));
    setApiData(resetData);
    setServiceUsageData(resetData);
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
    setPage(0);

    try {
      // We'll compute service-wise totals first to know accurate totals

          // 2️⃣ Service-wise totals (for table)
      let grandTotal = 0;
      let totalForSelected = 0;
      const updatedServiceData = [];
      
      for (const service of baseServices) {
        const resService = await axios.get(
          "https://api.digigo.sbusiness.xyz/tracking-api/geo-location/v1/logs/data",
          {
            params: {
              business_id: "",
              business_member_id: "",
              skip: 0,  // Always get total count from first page
              limit: 1, // We only need the total count
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
        
        updatedServiceData.push({
          sl: service === "from_visit" ? 1 : 
              service === "from_attendance" ? 2 :
              service === "from_tracking" ? 3 :
              service === "from_web" ? 4 : 0,
          api: service,
          usage: serviceTotal
        });
      }
      // add aggregated row for tracking_services (All Services)
      updatedServiceData.push({ sl: 5, api: "tracking_services", usage: grandTotal });
      
      // Update both apiData and serviceUsageData
      setApiData(updatedServiceData);
      setServiceUsageData(updatedServiceData);

      // Now fetch ALL logs for the currently selected service (or all)
      const fetchService = selectedService;
      const targetTotal = fetchService === "tracking_services" ? grandTotal : totalForSelected;
      const pageSize = 100; // backend supports up to 100 per call
      let allLogs = [];
      if (targetTotal > 0) {
        if (fetchService === "tracking_services") {
          // Fetch all services logs by iterating each service and paginating
          for (const svc of baseServices) {
            let skipCursor = 0;
            let collectedForSvc = 0;
            while (collectedForSvc < (updatedServiceData.find(x => x.api === svc)?.usage || 0)) {
              const resLogs = await axios.get(
                "https://api.digigo.sbusiness.xyz/tracking-api/geo-location/v1/logs/data",
                {
                  params: {
                    business_id: "",
                    business_member_id: "",
                    skip: skipCursor,
                    limit: pageSize,
                    service_name: svc,
                    from_date: startDate,
                    to_date: endDate,
                  },
                }
              );
              const chunk = resLogs.data?.data?.data ?? [];
              allLogs = allLogs.concat(chunk);
              if (chunk.length === 0) break;
              collectedForSvc += chunk.length;
              skipCursor += chunk.length;
            }
          }
        } else {
          // Fetch only the selected service across all pages
          let skipCursor = 0;
          let collected = 0;
          while (collected < targetTotal) {
            const resLogs = await axios.get(
              "https://api.digigo.sbusiness.xyz/tracking-api/geo-location/v1/logs/data",
              {
                params: {
                  business_id: "",
                  business_member_id: "",
                  skip: skipCursor,
                  limit: pageSize,
                  service_name: fetchService,
                  from_date: startDate,
                  to_date: endDate,
                },
              }
            );
            const chunk = resLogs.data?.data?.data ?? [];
            allLogs = allLogs.concat(chunk);
            if (chunk.length === 0) break;
            collected += chunk.length;
            skipCursor += chunk.length;
          }
        }
      }

      // Update table logs
      setLogData(allLogs);

      // Build monthly aggregation for existing chart
      const monthMap = {};
      const monthNames = [
        "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
      ];
      monthNames.forEach((m) => (monthMap[m] = 0));
      allLogs.forEach((log) => {
        const monthIndex = new Date(log.created_at).getMonth();
        monthMap[monthNames[monthIndex]] += 1;
      });
      const monthlySales = monthNames.map((m) => ({ month: m, sales: monthMap[m] }));
      setSalesData(monthlySales);

      // Build day-wise aggregation for new chart (local date, service-aware)
      const dayMap = {};
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0,0,0,0);
      end.setHours(23,59,59,999);
      const toKey = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      };
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dayMap[toKey(d)] = 0;
      }
      const includeLog = (log) => {
        if (fetchService === 'tracking_services') return true;
        return log.service_name === fetchService;
      };
      allLogs.forEach((log) => {
        if (!includeLog(log)) return;
        const dt = new Date(log.created_at);
        if (dt < start || dt > end) return; // safety
        const key = toKey(dt);
        if (dayMap[key] !== undefined) dayMap[key] += 1;
      });
      const daily = Object.keys(dayMap).map((day) => ({ day, count: dayMap[day] }));
      setDailyData(daily);

      // Reconcile totals with actually fetched logs to avoid mismatch
      if (fetchService === "tracking_services") {
        const byService = {};
        for (const svc of baseServices) byService[svc] = 0;
        allLogs.forEach((l) => { if (byService[l.service_name] !== undefined) byService[l.service_name] += 1; });
        const reconciled = baseServices.map((svc) => ({
          sl: svc === "from_visit" ? 1 : svc === "from_attendance" ? 2 : svc === "from_tracking" ? 3 : 4,
          api: svc,
          usage: byService[svc],
        }));
        const sum = reconciled.reduce((a, b) => a + b.usage, 0);
        const finalData = [...reconciled, { sl: 5, api: "tracking_services", usage: sum }];
        setApiData(finalData);
        setServiceUsageData(finalData);
        setTotalCount(sum);
      } else {
        // Specific service selected
        const actual = allLogs.length;
        if (actual !== totalForSelected) {
          const fixed = serviceUsageData.map((r) => r.api === fetchService ? { ...r, usage: actual } : r);
          setApiData(fixed);
          setServiceUsageData(fixed);
          setTotalCount(actual);
        } else {
          setTotalCount(totalForSelected);
        }
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
  // Refetch only when service changes (page/limit are client-side only)
  React.useEffect(() => {
    if (startDate && endDate) {
      handleSearch();
    }
  }, [selectedService]);

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
            <p className="mt-1 text-sm font-medium text-slate-800">{startDate || '—'} → {endDate || '—'}</p>
          </div>
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
              {apiData.filter(r => r.api !== 'tracking_services').map((row, idx) => (
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

        <h4 className="text-lg font-semibold text-slate-800 mb-2">Monthly API Hits</h4>
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

        {/* Daily hits chart for the filtered date range */}
        {dailyData.length > 0 && (
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-slate-800 mb-2">Daily API Hits (Filtered Range)</h4>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} angle={-30} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip formatter={(value) => [value, 'Hits']} labelFormatter={(label) => `Date: ${label}`} />
                <Bar dataKey="count" name="Hits per day" fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {totalCount !== null && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mt-8">
            <h4 className="text-xl font-bold mb-1 text-slate-800">API Hit Logs</h4>
            <p className="text-sm text-slate-500 mb-4">Detailed request activity. Use the filter to narrow by service.</p>

            {/* Diagnostics: counts to verify correctness */}
            <div className="mb-3 text-xs text-slate-600 flex flex-wrap gap-3">
              <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200">Loaded: {logData.length}</span>
              <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200">Filtered: {sortedLogs.length}</span>
              <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200">Usage (table): {(() => {
                const key = filterService || (selectedService === 'tracking_services' ? 'tracking_services' : selectedService);
                const row = serviceUsageData.find(r => r.api === key);
                return row ? row.usage : 0;
              })()}</span>
            </div>

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
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">SL</th>
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
                    {sortedLogs
                      .slice(page * limit, (page + 1) * limit)
                      .map((item, idx) => {
                      let parsedLog = {};
                      try { parsedLog = JSON.parse(item.log || "{}"); } catch {}
                      const address = parsedLog.address || "N/A";
                      const isExpanded = expanded.has(item.id);
                      return (
                        <React.Fragment key={item.id}>
                          <tr className="even:bg-slate-50 transition hover:bg-indigo-50">
                            <td className="px-4 py-3 align-top">
                              <span className="font-mono text-xs bg-slate-100 rounded px-2 py-1 border border-slate-200 text-slate-700">
                                {page * limit + idx + 1}
                              </span>
                            </td>
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

        {/* Pagination Controls (client-side over filtered logs) */}
        {sortedLogs.length > 0 && (
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
                Page {page + 1} of {Math.ceil(sortedLogs.length / limit) || 1}
              </span>
              <button
                disabled={(page + 1) * limit >= sortedLogs.length}
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
