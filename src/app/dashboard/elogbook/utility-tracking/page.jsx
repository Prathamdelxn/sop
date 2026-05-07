"use client";

import { useState, useEffect } from "react";
import { 
  Activity, 
  Clock, 
  Save, 
  CheckCircle, 
  AlertCircle, 
  Thermometer, 
  Zap, 
  Droplets, 
  Package, 
  Layers,
  Settings,
  Flame,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

const UTILITIES = [
  "UGVCL", "Compressor", "Main Panel", "PLC Panel", 
  "GUJRAT GAS", "RAW WATER", "RO WATER", "DM WATER"
];

const OVEN_LINES = [
  "CED Line", "Powder Coating Line", "PVC Line", "Powder (2ND Time)"
];

const CHEMICALS = [
  "N 390", "R 6559", "D 249 TE", "D 249 TA", "D Additive 31", 
  "M 523D", "Sion - CR 681", "Roller", "Or 14", "Gardobond Additive H 7375"
];

const OTHER_ITEMS = [
  "Tape", "Paper - 320 Grade", "Grinder Disc - 180", "Cotton", 
  "Waste Cotton", "Wire", "Waste Rubber", "Waste"
];

export default function UtilityTrackingPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("not-started"); // not-started, started, completed
  const [activeTab, setActiveTab] = useState("start"); // start, end

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    operationTimes: {
      burnerStartTime: "",
      hotWaterRinse: "",
      tempReachedTime: "",
      cedLineLoadingStart: "",
      cedLoadingEnd: "",
      totalTime: "",
      cedUnloadingStart: "",
      cedUnloadingStop: "",
      cedLoadingTime: "",
      cedUnloadingTime: "",
      burnerStopTime: "",
      burnerWorkingHrs: "",
    },
    ovenConveyorTimings: OVEN_LINES.map(line => ({
      lineName: line,
      ovenBurnerStartTime: "",
      tempReachedTime: "",
      conveyorLoadingStart: "",
      conveyorLoadingEnd: "",
      unloadingStart: "",
      unloadingEnd: "",
      burnerStopTime: "",
      totalBurnerWorkingHrs: "",
      totalLoadingTime: "",
      totalUnloadingTime: "",
    })),
    utilityReadings: UTILITIES.map(u => ({
      utilityName: u,
      openingReading: "",
      closingReading: "",
      consumption: "",
    })),
    lineConsumptions: CHEMICALS.map(c => ({
      itemName: c,
      batchNo: "",
      mfgDate: "",
      expDate: "",
      consumption: "",
      remarks: "",
    })),
    otherConsumables: OTHER_ITEMS.map(i => ({
      itemName: i,
      consumption: "",
      remarks: "",
    })),
    operatorDetails: {
      cedOperator: "",
      inspector: "",
    }
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserData(user);
    if (user) {
      fetchTodayData(user);
    }
  }, []);

  const fetchTodayData = async (user) => {
    try {
      const res = await fetch(`/api/elogbook/utility-tracking?companyId=${user.companyId}&plantId=${user.plantId}&date=${formData.date}`);
      const result = await res.json();
      if (result.success && result.data) {
        setFormData(prev => ({
          ...prev,
          ...result.data,
          // Merge arrays carefully to preserve names if they change
          ovenConveyorTimings: result.data.ovenConveyorTimings?.length > 0 ? result.data.ovenConveyorTimings : prev.ovenConveyorTimings,
          utilityReadings: result.data.utilityReadings?.length > 0 ? result.data.utilityReadings : prev.utilityReadings,
          lineConsumptions: result.data.lineConsumptions?.length > 0 ? result.data.lineConsumptions : prev.lineConsumptions,
          otherConsumables: result.data.otherConsumables?.length > 0 ? result.data.otherConsumables : prev.otherConsumables,
        }));
        setStatus(result.data.status);
        if (result.data.status === "completed") {
          setActiveTab("end");
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartDay = async () => {
    if (!userData) return;
    setSaving(true);
    try {
      const res = await fetch("/api/elogbook/utility-tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          companyId: userData.companyId,
          plantId: userData.plantId,
          startUser: { id: userData.id, name: userData.name || userData.username }
        })
      });
      const result = await res.json();
      if (result.success) {
        setStatus("started");
        toast.success("Day started successfully!");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to start day");
    } finally {
      setSaving(false);
    }
  };

  const handleEndDay = async () => {
    if (!userData) return;
    setSaving(true);
    try {
      const res = await fetch("/api/elogbook/utility-tracking", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: userData.companyId,
          plantId: userData.plantId,
          date: formData.date,
          endUser: { id: userData.id, name: userData.name || userData.username },
          lineConsumptions: formData.lineConsumptions,
          otherConsumables: formData.otherConsumables,
          utilityReadings: formData.utilityReadings,
        })
      });
      const result = await res.json();
      if (result.success) {
        setStatus("completed");
        toast.success("Day ended and data stored!");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to end day");
    } finally {
      setSaving(false);
    }
  };

  const updateNested = (category, field, value, index = null) => {
    setFormData(prev => {
      const newForm = { ...prev };
      if (index !== null) {
        newForm[category][index][field] = value;
      } else if (category === "operatorDetails") {
        newForm.operatorDetails[field] = value;
      } else {
        newForm.operationTimes[field] = value;
      }
      return newForm;
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <Toaster position="top-right" />
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-200">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">Utility Tracking</h1>
            <p className="text-gray-500 font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" /> {new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest border ${
            status === "not-started" ? "bg-gray-100 text-gray-500 border-gray-200" :
            status === "started" ? "bg-amber-100 text-amber-600 border-amber-200 animate-pulse" :
            "bg-emerald-100 text-emerald-600 border-emerald-200"
          }`}>
            {status.replace("-", " ")}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100/50 rounded-2xl w-fit border border-gray-200/50 backdrop-blur-sm">
        <button
          onClick={() => setActiveTab("start")}
          className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
            activeTab === "start" 
            ? "bg-white text-indigo-600 shadow-md scale-[1.02]" 
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
          }`}
        >
          <Flame className="w-4 h-4" /> Start Day Form
        </button>
        <button
          onClick={() => setActiveTab("end")}
          className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
            activeTab === "end" 
            ? "bg-white text-indigo-600 shadow-md scale-[1.02]" 
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
          }`}
        >
          <CheckCircle className="w-4 h-4" /> Day End Form
        </button>
      </div>

      {activeTab === "start" ? (
        <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
          {/* Section A: Operation Times */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-purple-600"></div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Clock className="text-indigo-600" /> A) Operation Times
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Burner Start Time", field: "burnerStartTime", type: "time" },
                { label: "Hot Water Rinse (45-60)", field: "hotWaterRinse", type: "text" },
                { label: "Temp Reached Time", field: "tempReachedTime", type: "time" },
                { label: "CED Line Loading Start", field: "cedLineLoadingStart", type: "time" },
                { label: "CED Loading End", field: "cedLoadingEnd", type: "time" },
                { label: "Total Time", field: "totalTime", type: "text" },
                { label: "CED Unloading Start", field: "cedUnloadingStart", type: "time" },
                { label: "CED Unloading Stop", field: "cedUnloadingStop", type: "time" },
                { label: "CED Loading Time", field: "cedLoadingTime", type: "text" },
                { label: "CED Unloading Time", field: "cedUnloadingTime", type: "text" },
                { label: "Burner Stop Time", field: "burnerStopTime", type: "time" },
                { label: "Burner Working Hrs", field: "burnerWorkingHrs", type: "text" },
              ].map((item) => (
                <div key={item.field} className="space-y-2 group">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider group-focus-within:text-indigo-600 transition-colors">
                    {item.label}
                  </label>
                  <input
                    type={item.type}
                    disabled={status === "completed"}
                    value={formData.operationTimes[item.field]}
                    onChange={(e) => updateNested("operationTimes", item.field, e.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section B: Oven & Conveyor */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-orange-500 to-red-600"></div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Thermometer className="text-orange-600" /> B) Oven and Conveyor Timings
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-4 font-bold text-gray-400 uppercase tracking-wider">Line Operations</th>
                    {OVEN_LINES.map(line => (
                      <th key={line} className="py-4 px-4 font-bold text-gray-700 min-w-[150px]">{line}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { label: "Oven Burner Start", field: "ovenBurnerStartTime" },
                    { label: "Temp Reached", field: "tempReachedTime" },
                    { label: "Conveyor Load Start", field: "conveyorLoadingStart" },
                    { label: "Conveyor Load End", field: "conveyorLoadingEnd" },
                    { label: "Unloading Start", field: "unloadingStart" },
                    { label: "Unloading End", field: "unloadingEnd" },
                    { label: "Burner Stop", field: "burnerStopTime" },
                    { label: "Total Burner Hrs", field: "totalBurnerWorkingHrs" },
                  ].map((op) => (
                    <tr key={op.field} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 font-semibold text-gray-600">{op.label}</td>
                      {formData.ovenConveyorTimings.map((lineData, idx) => (
                        <td key={idx} className="py-2 px-2">
                          <input
                            type="text"
                            disabled={status === "completed"}
                            value={lineData[op.field]}
                            onChange={(e) => updateNested("ovenConveyorTimings", op.field, e.target.value, idx)}
                            className="w-full bg-transparent border-b border-gray-200 px-2 py-1 focus:border-indigo-500 outline-none transition-all"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section C: Utility Readings */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-cyan-600"></div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Zap className="text-blue-600" /> C) Utility Start Timing (Opening)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {formData.utilityReadings.map((u, idx) => (
                <div key={u.utilityName} className="p-5 bg-blue-50/30 rounded-2xl border border-blue-100 space-y-4 group hover:bg-blue-50/50 transition-all duration-300">
                  <h3 className="font-black text-blue-800 text-sm">{u.utilityName}</h3>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Opening Reading</label>
                    <input
                      type="text"
                      disabled={status === "completed"}
                      value={u.openingReading}
                      onChange={(e) => updateNested("utilityReadings", "openingReading", e.target.value, idx)}
                      placeholder="Enter value"
                      className="w-full bg-white border border-blue-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none shadow-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-6">
            <button
              onClick={handleStartDay}
              disabled={saving || status === "completed"}
              className="group flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 hover:shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale transition-all duration-300"
            >
              {saving ? "Saving..." : status === "started" ? "Update Progress" : "Start Day & Save"}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
          {/* Final Utility Readings */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-cyan-600"></div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Zap className="text-blue-600" /> Utility Final Readings & Consumption
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {formData.utilityReadings.map((u, idx) => (
                <div key={u.utilityName} className="p-5 bg-cyan-50/30 rounded-2xl border border-cyan-100 space-y-4">
                  <h3 className="font-black text-cyan-800 text-sm">{u.utilityName}</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Closing Reading</label>
                      <input
                        type="text"
                        disabled={status === "completed"}
                        value={u.closingReading}
                        onChange={(e) => updateNested("utilityReadings", "closingReading", e.target.value, idx)}
                        className="w-full bg-white border border-cyan-100 rounded-xl px-3 py-2 text-sm focus:border-cyan-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Consumption</label>
                      <input
                        type="text"
                        disabled={status === "completed"}
                        value={u.consumption}
                        onChange={(e) => updateNested("utilityReadings", "consumption", e.target.value, idx)}
                        className="w-full bg-white border border-cyan-100 rounded-xl px-3 py-2 text-sm focus:border-cyan-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section F: Chemical Consumption */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-emerald-500 to-teal-600"></div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Droplets className="text-emerald-600" /> F) PTCED Line Consumptions / Day
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    <th className="py-4 px-4">Chemical Item</th>
                    <th className="py-4 px-4">Batch No</th>
                    <th className="py-4 px-4">MFG</th>
                    <th className="py-4 px-4">EXP</th>
                    <th className="py-4 px-4">Consumption (KG/Ltr)</th>
                    <th className="py-4 px-4">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {formData.lineConsumptions.map((item, idx) => (
                    <tr key={item.itemName} className="hover:bg-gray-50/50">
                      <td className="py-4 px-4 font-bold text-gray-700">{item.itemName}</td>
                      <td className="py-2 px-2">
                        <input type="text" disabled={status === "completed"} value={item.batchNo} onChange={(e) => updateNested("lineConsumptions", "batchNo", e.target.value, idx)} className="w-full border-b border-gray-200 outline-none focus:border-emerald-500 py-1" />
                      </td>
                      <td className="py-2 px-2">
                        <input type="text" disabled={status === "completed"} value={item.mfgDate} onChange={(e) => updateNested("lineConsumptions", "mfgDate", e.target.value, idx)} className="w-full border-b border-gray-200 outline-none focus:border-emerald-500 py-1" />
                      </td>
                      <td className="py-2 px-2">
                        <input type="text" disabled={status === "completed"} value={item.expDate} onChange={(e) => updateNested("lineConsumptions", "expDate", e.target.value, idx)} className="w-full border-b border-gray-200 outline-none focus:border-emerald-500 py-1" />
                      </td>
                      <td className="py-2 px-2">
                        <input type="text" disabled={status === "completed"} value={item.consumption} onChange={(e) => updateNested("lineConsumptions", "consumption", e.target.value, idx)} className="w-full border-b border-gray-200 outline-none focus:border-emerald-500 py-1" />
                      </td>
                      <td className="py-2 px-2">
                        <input type="text" disabled={status === "completed"} value={item.remarks} onChange={(e) => updateNested("lineConsumptions", "remarks", e.target.value, idx)} className="w-full border-b border-gray-200 outline-none focus:border-emerald-500 py-1" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section G: Other Consumables */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-purple-500 to-pink-600"></div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Package className="text-purple-600" /> G) Other Consumables
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {formData.otherConsumables.map((item, idx) => (
                <div key={item.itemName} className="flex items-center gap-6 group">
                  <div className="w-1/3 text-sm font-bold text-gray-600 group-hover:text-purple-600 transition-colors">{item.itemName}</div>
                  <div className="flex-1 space-y-1">
                    <input 
                      type="text" 
                      placeholder="Consumption"
                      disabled={status === "completed"}
                      value={item.consumption} 
                      onChange={(e) => updateNested("otherConsumables", "consumption", e.target.value, idx)} 
                      className="w-full border-b border-gray-200 outline-none focus:border-purple-500 py-2 text-sm bg-transparent" 
                    />
                    <input 
                      type="text" 
                      placeholder="Remarks"
                      disabled={status === "completed"}
                      value={item.remarks} 
                      onChange={(e) => updateNested("otherConsumables", "remarks", e.target.value, idx)} 
                      className="w-full border-b border-gray-200 outline-none focus:border-purple-500 py-1 text-xs text-gray-400 bg-transparent italic" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operator Details */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">CED Operator</label>
              <input 
                type="text" 
                disabled={status === "completed"}
                value={formData.operatorDetails.cedOperator} 
                onChange={(e) => updateNested("operatorDetails", "cedOperator", e.target.value)} 
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inspector Name</label>
              <input 
                type="text" 
                disabled={status === "completed"}
                value={formData.operatorDetails.inspector} 
                onChange={(e) => updateNested("operatorDetails", "inspector", e.target.value)} 
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500" 
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-6">
            <button
              onClick={handleEndDay}
              disabled={saving || status === "completed" || status === "not-started"}
              className="group flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl shadow-emerald-200 hover:shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale transition-all duration-300"
            >
              {saving ? "Finalizing..." : status === "completed" ? "Day Completed" : "End Day & Finalize"}
              <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
