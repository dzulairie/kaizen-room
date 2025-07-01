import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { supabase } from "../supabaseUser";
import { Trash2 } from "lucide-react";


const FridayruleStock = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [stocks, setStocks] = useState([]);
  const [formData, setFormData] = useState({
    date: dayjs().format("YYYY-MM-DD"),
    stock: "",
    sector: "Tech",
    level: "52WH",
    price: ""
  });
  const [showModal, setShowModal] = useState(false);

  const fetchStocks = async () => {
    const { data, error } = await supabase.from("friday_rule_stocks").select("*");
    if (!error) setStocks(data);
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanData = {
      ...formData,
      price: parseFloat(formData.price)
    };
    const { error } = await supabase.from("friday_rule_stocks").insert([cleanData]);
    if (!error) {
      fetchStocks();
      setFormData({
        date: dayjs().format("YYYY-MM-DD"),
        stock: "",
        sector: "Tech",
        level: "52WH",
        price: ""
      });
      setShowModal(false);
    } else {
      console.error("Insert error:", error);
    }
  };

  const handleUpdateMondayPrice = async (id, value) => {
    const { error } = await supabase.from("friday_rule_stocks").update({ mondayPrice: value }).eq("id", id);
    if (!error) fetchStocks();
  };

  const handleUpdateTuesdayPrice = async (id, value) => {
    const { error } = await supabase.from("friday_rule_stocks").update({ tuesdayPrice: value }).eq("id", id);
    if (!error) fetchStocks();
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("friday_rule_stocks").delete().eq("id", id);
    if (!error) fetchStocks();
  };

  const fridaysInMonth = () => {
    const start = selectedDate.startOf("month").startOf("week");
    const end = selectedDate.endOf("month").endOf("week");
    const fridays = [];
    let date = start;
    while (date.isBefore(end)) {
      if (date.day() === 5) fridays.push(date);
      date = date.add(1, "day");
    }
    return fridays;
  };

  const getROI = (buy, sell) => {
    if (!buy || !sell) return null;
    const roi = ((sell - buy) / buy) * 100;
    return roi.toFixed(2);
  };

  const summary = () => {
    const total = stocks.filter(s => dayjs(s.date).isSame(selectedDate, "day"));
    const results = total.map(s => getROI(s.price, s.mondayPrice || s.tuesdayPrice));
    const win = results.filter(r => r && r > 0).length;
    const loss = results.filter(r => r && r <= 0).length;
    return { count: total.length, win, loss };
  };

  const { count, win, loss } = summary();

  return (
    <div className="p-6 min-h-screen bg-[#f0f4ff]">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Friday Rule Stock</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Select a Friday</h2>
        <div className="flex flex-wrap gap-2">
          {fridaysInMonth().map((date) => (
            <button
              key={date.format("YYYY-MM-DD")}
              onClick={() => setSelectedDate(date)}
              className={`px-3 py-1 rounded transition ${
                selectedDate.isSame(date, "day") ? "!bg-white !text-black border-blue-600 ring-2 ring-blue-500" : "!bg-white !text-black border-gray-300 hover:border-blue-400"
              }`}
            >
              {date.format("DD MMM")}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="mb-6 bg-green-600 text-white px-4 py-2 rounded"
      >
        Add Friday Rule Stock
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Stock</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-red-500">✖</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="border border-gray-400 p-2 rounded text-gray-800 custom-date" required />
                <input type="text" placeholder="Stock Name" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="border border-gray-400 p-2 rounded text-gray-500" required />
                <select value={formData.sector} onChange={(e) => setFormData({...formData, sector: e.target.value})} className="border border-gray-400 p-2 rounded text-gray-800">
                  <option>Tech</option><option>Energy</option><option>Construction</option>
                </select>
                <select value={formData.level} onChange={(e) => setFormData({...formData, level: e.target.value})} className="border border-gray-400 p-2 rounded text-gray-800">
                  <option>52WH</option><option>ATH</option>
                </select>
                <input type="number" placeholder="Friday Price" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="border border-gray-400 p-2 rounded text-gray-500 no-spinner" required />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded shadow overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4 text-black">Stocks on {selectedDate.format("DD MMM YYYY")} (Total: {count})</h2>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-black">
              <th className="p-2">Stock</th>
              <th className="p-2">Sector</th>
              <th className="p-2">Level</th>
              <th className="p-2">Friday Price</th>
              <th className="p-2">Mon Price</th>
              <th className="p-2">Tue Price</th>
              <th className="p-2">ROI Mon (%)</th>
              <th className="p-2">ROI Tue (%)</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {stocks.filter(s => dayjs(s.date).isSame(selectedDate, "day")).map((s, i) => (
              <tr key={i} className="border-t bg-white text-black">
                <td className="p-2 text-center">{s.stock}</td>
                <td className="p-2 text-center">{s.sector}</td>
                <td className="p-2 text-center">{s.level}</td>
                <td className="p-2 text-center">{s.price}</td>
                <td className="p-2 text-center">
                  <input
                    type="text"
                    inputMode="decimal"
                    defaultValue={s.mondayPrice || ""}
                    onBlur={(e) => handleUpdateMondayPrice(s.id, parseFloat(e.target.value))}
                    className="w-full border border-gray-300 p-1 rounded text-center appearance-none"
                  />
                </td>
                <td className="p-2 text-center">
                  <input
                    type="text"
                    inputMode="decimal"
                    defaultValue={s.tuesdayPrice || ""}
                    onBlur={(e) => handleUpdateTuesdayPrice(s.id, parseFloat(e.target.value))}
                    className="w-full border border-gray-300 p-1 rounded text-center appearance-none"
                  />
                </td>
                <td className={`p-2 text-center font-medium ${getROI(s.price, s.mondayPrice) > 0 ? "text-green-600" : getROI(s.price, s.mondayPrice) < 0 ? "text-red-600" : "text-gray-600"}`}>
                  {getROI(s.price, s.mondayPrice) || "-"}
                </td>
                <td className={`p-2 text-center font-medium ${getROI(s.price, s.tuesdayPrice) > 0 ? "text-green-600" : getROI(s.price, s.tuesdayPrice) < 0 ? "text-red-600" : "text-gray-600"}`}>
                  {getROI(s.price, s.tuesdayPrice) || "-"}
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-2 !bg-white border border-gray-300 rounded hover:bg-gray-100 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-gray-800" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 text-sm text-gray-700">
          ✅ Win: {win} | ❌ Loss: {loss}
        </div>
      </div>
    </div>
  );
};

export default FridayruleStock;
