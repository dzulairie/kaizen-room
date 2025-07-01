import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseUser";

const IPOstudy = () => {
  const [stocks, setStocks] = useState([]);
  const [newStock, setNewStock] = useState({ stock: "", description: "" });
  const [editDescriptions, setEditDescriptions] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchStocks = async () => {
    const { data, error } = await supabase
      .from("IPOstock")
      .select("*")
      //.order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching stocks:", error.message);
    } else {
      setStocks(data);
    }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    if (!newStock.stock.trim()) {
      alert("Stock name cannot be empty.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("IPOstock").insert(newStock);
    if (error) {
      console.error("Error adding stock:", error.message);
    } else {
      setNewStock({ stock: "", description: "" });
      fetchStocks();
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("IPOstock").delete().eq("id", id);
    if (error) {
      console.error("Error deleting stock:", error.message);
    } else {
      fetchStocks();
    }
  };

  const handleUpdate = async (id) => {
    const newDesc = editDescriptions[id];
    if (!newDesc || newDesc.trim() === "") {
      alert("New description cannot be empty.");
      return;
    }

    const { error } = await supabase
      .from("IPOstock")
      .update({ description: newDesc })
      .eq("id", id);

    if (error) {
      console.error("Error updating description:", error.message);
    } else {
      setEditDescriptions((prev) => ({ ...prev, [id]: "" }));
      fetchStocks();
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Stock Section */}
        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">➕ Add Stock</h2>
          <form onSubmit={handleAddStock} className="space-y-4">
            <div>
              <label className="block text-gray-700">Stock Name</label>
              <input
                type="text"
                value={newStock.stock}
                onChange={(e) =>
                  setNewStock((prev) => ({ ...prev, stock: e.target.value }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white/80"
                placeholder="e.g. MYEG, INARI, UEMS"
              />
            </div>
            <div>
              <label className="block text-gray-700">Description</label>
              <textarea
                value={newStock.description}
                onChange={(e) =>
                  setNewStock((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white/80"
                placeholder="Catalyst, reason, notes..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-semibold transition"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Stock"}
            </button>
          </form>
        </div>

        {/* Stock Table Section */}
        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">📋 Stock List</h2>
          <div className="overflow-x-auto max-h-[500px] border rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-200 sticky top-0">
                <tr>
                  <th className="px-4 py-2">Stock</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Edit</th>
                  <th className="px-4 py-2">Delete</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => (
                  <tr key={stock.id} className="border-t">
                    <td className="px-4 py-2 font-semibold">{stock.stock}</td>
                    <td className="px-4 py-2">{stock.description}</td>
                    <td className="px-4 py-2">
                      <textarea
                        value={editDescriptions[stock.id] || ""}
                        onChange={(e) =>
                          setEditDescriptions((prev) => ({
                            ...prev,
                            [stock.id]: e.target.value,
                          }))
                        }
                        className="w-full p-2 border border-gray-300 rounded mb-2 text-gray-800"
                        placeholder="Edit..."
                      />
                      <button
                        onClick={() => handleUpdate(stock.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Save
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(stock.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPOstudy;

