import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { supabase } from "../supabaseUser";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const MomentumStock = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [showForm, setShowForm] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");

  const [formData, setFormData] = useState({
    mmdate: dayjs().format("YYYY-MM-DD"),
    stock: "",
    sector: "Tech",
    week: "low",
    tactic: "first BO",
  });

  const [editFormData, setEditFormData] = useState({
    mmdate: "",
    mmstock: "",
    sector: "",
    week: "",
    tactic: "",
  });

  const fetchStocksFromSupabase = async () => {
    const { data, error } = await supabase.from("momentum_stocks").select("*");
    if (!error) setStocks(data);
  };

  useEffect(() => {
    fetchStocksFromSupabase();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const newStock = {
      mmdate: formData.mmdate,
      mmstock: formData.stock,
      sector: formData.sector,
      week: formData.week,
      tactic: formData.tactic,
    };
    const { error } = await supabase.from("momentum_stocks").insert([newStock]);
    if (!error) {
      await fetchStocksFromSupabase();
      setFormData({
        mmdate: selectedDate ? selectedDate.format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
        stock: "",
        sector: "Tech",
        week: "low",
        tactic: "First BO",
      });
      setSaveMessage("✔️ Saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("momentum_stocks").delete().eq("id", id);
    if (!error) await fetchStocksFromSupabase();
  };

  const handleEdit = (item) => {
    setEditMode(item.id);
    setEditFormData({
      mmdate: item.mmdate,
      mmstock: item.mmstock,
      sector: item.sector,
      week: item.week,
      tactic: item.tactic,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from("momentum_stocks")
      .update(editFormData)
      .eq("id", editMode);
    if (!error) {
      setEditMode(null);
      await fetchStocksFromSupabase();
    }
  };

  const filteredStocks = stocks.filter((item) => {
    const dateMatch = !selectedDate || dayjs(item.mmdate).isSame(selectedDate, "day");
    const searchMatch = item.mmstock.toLowerCase().includes(searchTerm.toLowerCase());
    const sectorMatch = !sectorFilter || item.sector === sectorFilter;
    return dateMatch && searchMatch && sectorMatch;
  });

  const handlePrevMonth = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const handleNextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));

  const generateCalendar = () => {
    const weeks = [];
    let current = currentMonth.startOf("month").startOf("week").add(1, "day");
    while (
      current.isBefore(currentMonth.endOf("month")) ||
      current.isSame(currentMonth.endOf("month"), "day")
    ) {
      const week = [];
      for (let i = 0; i < 5; i++) {
        week.push(current);
        current = current.add(1, "day");
      }
      weeks.push(week);
      current = current.add(2, "day");
    }
    return weeks;
  };

  const getStockCountForDate = (date) =>
    stocks.filter((item) => dayjs(item.mmdate).isSame(date, "day")).length;

  return (
    <div className="flex gap-6 p-6 bg-gradient-to-tr from-[#050435] to-[#004aad] min-h-screen">
      {/* Left Table */}
      <div className="w-1/2 bg-white border border-gray-300 rounded-xl p-4">
        <h2 className="text-lg font-bold mb-1 text-black">Momentum Stocks</h2>
        {selectedDate && (
          <div className="text-sm text-gray-600 mb-3">
            Showing {filteredStocks.length} stock(s) on {selectedDate.format("DD/MM/YYYY")}
          </div>
        )}
        <input
          type="text"
          placeholder="Search stock name..."
          className="w-full mb-2 p-2 border border-black rounded text-black placeholder:text-gray-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="w-full mb-4 p-2 border border-black rounded text-black"
          value={sectorFilter}
          onChange={(e) => setSectorFilter(e.target.value)}
        >
          <option value="">All Sectors</option>
          <option>Construction</option>
          <option>Consumer</option>
          <option>Energy</option>
          <option>Healthcare</option>
          <option>Industrial Product</option>
          <option>Plantation</option>
          <option>Property</option>
          <option>Technology</option>
          <option>Telecommunication</option>
          <option>Transportation</option>
          <option>Utilities</option>
        </select>

        <table className="w-full table-auto">
          <thead className="bg-gray-100 text-black text-center">
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Sector</th>
              <th className="p-2">52 Week</th>
              <th className="p-2">Tactics</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-black">
            {filteredStocks.map((item) => (
              <tr key={item.id} className="border-t text-center">
                <td className="p-2">{dayjs(item.mmdate).format("DD/MM/YYYY")}</td>
                <td className="p-2">{item.mmstock}</td>
                <td className="p-2">{item.sector}</td>
                <td className="p-2">{item.week}</td>
                <td className="p-2">{item.tactic}</td>
                <td className="p-2 flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="!bg-white border border-gray-400 text-black px-2 py-1 rounded hover:bg-gray-100"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="!bg-white border border-gray-400 text-black px-2 py-1 rounded hover:bg-gray-100"
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Right Calendar */}
      <div className="w-1/2 flex flex-col items-center justify-center gap-4">
        <div className="bg-[#050435] text-white border border-gray-800 rounded-xl p-6 w-[500px]">
          <div className="flex justify-between items-center mb-6">
            <button onClick={handlePrevMonth} className="!bg-white p-3 rounded">
              <div className="w-0 h-0 border-y-[6px] border-y-transparent border-r-[8px] border-r-black"></div>
            </button>
            <div className="text-xl font-semibold">{currentMonth.format("MMM YYYY")}</div>
            <button onClick={handleNextMonth} className="!bg-white p-3 rounded">
              <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[8px] border-l-black"></div>
            </button>
          </div>
          <div className="grid grid-cols-5 text-center mb-4 font-bold text-base">
            {weekdays.map((day) => <div key={day}>{day}</div>)}
          </div>
          <div className="grid grid-cols-5 gap-2 text-center text-base">
            {generateCalendar().map((week, wIdx) =>
              week.map((date, dIdx) => {
                const isSelected = selectedDate && date.isSame(selectedDate, "day");
                const stockCount = getStockCountForDate(date);
                return (
                  <div
                    key={`${wIdx}-${dIdx}`}
                    className={`p-3 rounded-md cursor-pointer relative transition-all duration-150 ${
                      isSelected ? "border border-purple-400 bg-purple-700" : "hover:bg-purple-800"
                    }`}
                    onClick={() => {
                      setSelectedDate(date);
                      setFormData((prev) => ({
                        ...prev,
                        mmdate: date.format("YYYY-MM-DD"),
                      }));
                    }}
                  >
                    <div>{date.date()}</div>
                    {stockCount > 0 && (
                      <div className="absolute top-1 right-1 text-xs bg-yellow-400 text-black px-1 rounded">
                        {stockCount}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => setShowForm(true)}
            className="!bg-[#004aad] text-white px-4 py-2 !rounded-2xl"
          >
            Add Momentum Stock
          </button>
          <button className="!bg-[#5e17eb] text-white px-4 py-2 !rounded-2xl">Graph</button>
        </div>

        {/* Form - Add */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
            <form
              onSubmit={handleFormSubmit}
              className="relative bg-white text-black p-6 rounded-xl w-[350px] shadow-lg"
            >
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="absolute top-2 right-2 text-white text-xl"
              >
                ×
              </button>

              <h3 className="text-lg font-bold mb-4">Add Momentum Stock</h3>
              <div className="space-y-4">
                <input type="date" className="w-full border border-black p-2 rounded" value={formData.mmdate} onChange={(e) => setFormData({ ...formData, mmdate: e.target.value })} required />
                <input type="text" className="w-full border border-black p-2 rounded" placeholder="Stock Name" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />
                <select className="w-full border border-black p-2 rounded" value={formData.sector} onChange={(e) => setFormData({ ...formData, sector: e.target.value })}>
                  <option>Construction</option><option>Consumer</option><option>Energy</option><option>Healthcare</option><option>Industrial Product</option><option>Plantation</option><option>Property</option><option>Technology</option><option>Telecommunication</option><option>Transportation</option><option>Utilities</option>
                </select>
                <select className="w-full border border-black p-2 rounded" value={formData.week} onChange={(e) => setFormData({ ...formData, week: e.target.value })}>
                  <option>Low</option><option>High</option>
                </select>
                <select className="w-full border border-black p-2 rounded" value={formData.tactic} onChange={(e) => setFormData({ ...formData, tactic: e.target.value })}>
                  <option>First BO</option><option>BO with Gap</option><option>BO Resistance</option><option>BO 52WH</option><option>BO ATH</option><option>BODTL</option>
                </select>
                <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded w-full">Save</button>
              </div>
            </form>
          </div>
        )}

        {/* Form - Edit */}
        {editMode && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
            <form
              onSubmit={handleUpdate}
              className="relative bg-white text-black p-6 rounded-xl w-[350px] shadow-lg"
            >
              <button
                type="button"
                onClick={() => setEditMode(null)}
                className="absolute top-2 right-2 text-white text-xl"
              >
                ×
              </button>

              <h3 className="text-lg font-bold mb-4">Edit Momentum Stock</h3>
              <div className="space-y-4">
                <input type="date" className="w-full border border-black p-2 rounded" value={editFormData.mmdate} onChange={(e) => setEditFormData({ ...editFormData, mmdate: e.target.value })} required />
                <input type="text" className="w-full border border-black p-2 rounded" value={editFormData.mmstock} onChange={(e) => setEditFormData({ ...editFormData, mmstock: e.target.value })} required />
                <select className="w-full border border-black p-2 rounded" value={editFormData.sector} onChange={(e) => setEditFormData({ ...editFormData, sector: e.target.value })}>
                  <option>Construction</option><option>Consumer</option><option>Energy</option><option>Healthcare</option><option>Industrial Product</option><option>Plantation</option><option>Property</option><option>Technology</option><option>Telecommunication</option><option>Transportation</option><option>Utilities</option>
                </select>
                <select className="w-full border border-black p-2 rounded" value={editFormData.week} onChange={(e) => setEditFormData({ ...editFormData, week: e.target.value })}>
                  <option>Low</option><option>High</option>
                </select>
                <select className="w-full border border-black p-2 rounded" value={editFormData.tactic} onChange={(e) => setEditFormData({ ...editFormData, tactic: e.target.value })}>
                  <option>First BO</option><option>BO with Gap</option><option>BO Resistance</option><option>BO 52WH</option><option>BO ATH</option><option>BODTL</option>
                </select>
                <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded w-full">Update</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MomentumStock;


