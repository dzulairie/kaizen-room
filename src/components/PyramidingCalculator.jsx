import React, { useState } from "react";

const EntryCalculator = () => {
  const [selectedCalc, setSelectedCalc] = useState("entry");

  // ----- STATE UNTUK ENTRY PYRAMIDING -----
  const [targetMaxIncrease, setTargetMaxIncrease] = useState(2);
  const [entries, setEntries] = useState([
    { qty: '', price: '' },
    { qty: '', price: '' },
    { qty: '', price: '' }
  ]);
  const [result, setResult] = useState(null);

  const handleChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const calculate = () => {
    const parsed = entries.map((e) => ({
      qty: parseFloat(e.qty) || 0,
      price: parseFloat(e.price) || 0,
    })).filter(e => e.qty > 0 && e.price > 0);

    const totalQty = parsed.reduce((sum, e) => sum + e.qty, 0);
    const totalCost = parsed.reduce((sum, e) => sum + e.qty * e.price, 0);
    const avgPrice = totalCost / totalQty;

    const maxAvg = parsed.length > 0 ? ((parsed[0].price * (1 + targetMaxIncrease / 100))) : 0;

    const remainingQty = [0.5, 0.3, 0.2].slice(parsed.length).map(p => p * totalQty);

    const suggestedTopups = remainingQty.map((qty, i) => {
      const maxExtraCost = maxAvg * (totalQty + qty) - totalCost;
      const suggestedPrice = maxExtraCost / qty;
      return {
        entry: parsed.length + i + 1,
        qty: Math.round(qty),
        suggestedPrice: suggestedPrice > 0 ? suggestedPrice.toFixed(3) : '-'
      };
    });

    setResult({ avgPrice: avgPrice.toFixed(4), suggestedTopups, maxAvg: maxAvg.toFixed(4) });
  };

  // ----- STATE UNTUK AVERAGE TABLE -----
  const [initialUnits, setInitialUnits] = useState(1000);
  const [initialPrice, setInitialPrice] = useState(1.0);
  const [priceToAdd, setPriceToAdd] = useState(1.20);
  const [tableResult, setTableResult] = useState([]);

  const calcTable = () => {
    const increments = Array.from({ length: 10 }, (_, i) => (i + 1) * 100);
    const output = increments.map((addUnits) => {
      const totalUnits = initialUnits + addUnits;
      const totalCost = (initialUnits * initialPrice) + (addUnits * priceToAdd);
      const avgPrice = totalCost / totalUnits;
      return {
        addUnits,
        priceToAdd,
        totalUnits,
        totalCost: totalCost.toFixed(2),
        avgPrice: avgPrice.toFixed(4),
      };
    });
    setTableResult(output);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 text-gray-800">
      <div className="max-w-6xl mx-auto">

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold mb-4">📊 Stock Calculator Tools</h2>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setSelectedCalc("entry")}
              className={`px-4 py-2 rounded ${selectedCalc === "entry" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
            >
              📈 Entry Pyramiding
            </button>
            <button
              onClick={() => setSelectedCalc("table")}
              className={`px-4 py-2 rounded ${selectedCalc === "table" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
            >
              📉 Average Price Table
            </button>
          </div>
        </div>

        {selectedCalc === "entry" && (
          <div className="bg-white shadow-md rounded-xl p-6 mb-10">
            <h2 className="text-xl font-semibold mb-4">📈 Entry Pyramiding Calculator</h2>

            <div className="mb-4">
              <label>Max Avg Buy Increase (%)</label>
              <input
                type="number"
                className="w-full p-2 border rounded mt-1"
                value={targetMaxIncrease}
                onChange={(e) => setTargetMaxIncrease(parseFloat(e.target.value))}
              />
            </div>

            {[0, 1, 2].map((i) => (
              <div key={i} className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label>Entry {i + 1} Qty</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={entries[i].qty}
                    onChange={(e) => handleChange(i, 'qty', e.target.value)}
                  />
                </div>
                <div>
                  <label>Entry {i + 1} Price (RM)</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={entries[i].price}
                    onChange={(e) => handleChange(i, 'price', e.target.value)}
                  />
                </div>
              </div>
            ))}

            <button
              onClick={calculate}
              className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
            >
              Calculate
            </button>

            {result && (
              <div className="mt-6">
                <p className="mb-1">Current Avg Buy Price: <strong>RM {result.avgPrice}</strong></p>
                <p className="mb-4 text-sm text-gray-500">Max Allowed Avg Buy: <strong>RM {result.maxAvg}</strong></p>

                <h4 className="font-medium mt-4 mb-2">Suggested Top-Up Plans</h4>
                <table className="w-full border text-sm mt-2">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border">Entry</th>
                      <th className="p-2 border">Qty</th>
                      <th className="p-2 border">Max Suggested Price (RM)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.suggestedTopups.map((s, i) => (
                      <tr key={i} className="text-center">
                        <td className="p-2 border">{s.entry}</td>
                        <td className="p-2 border">{s.qty}</td>
                        <td className="p-2 border text-blue-600 font-semibold">{s.suggestedPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {selectedCalc === "table" && (
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">📉 Average Price Table Calculator</h2>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label>Initial Units</label>
                <input
                  type="number"
                  value={initialUnits}
                  onChange={(e) => setInitialUnits(Number(e.target.value))}
                  className="border p-2 w-full rounded"
                />
              </div>
              <div>
                <label>Initial Price (RM)</label>
                <input
                  type="number"
                  step="0.01"
                  value={initialPrice}
                  onChange={(e) => setInitialPrice(Number(e.target.value))}
                  className="border p-2 w-full rounded"
                />
              </div>
              <div>
                <label>Additional Price (RM)</label>
                <input
                  type="number"
                  step="0.01"
                  value={priceToAdd}
                  onChange={(e) => setPriceToAdd(Number(e.target.value))}
                  className="border p-2 w-full rounded"
                />
              </div>
            </div>

            <button
              onClick={calcTable}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
              Generate Average Price Table (100 to 1000 Units)
            </button>

            {tableResult.length > 0 && (
              <table className="w-full text-sm border border-collapse mt-6">
                <thead className="bg-gray-200 text-center">
                  <tr>
                    <th className="border p-2">Tambah Unit</th>
                    <th className="border p-2">Harga Tambahan (RM)</th>
                    <th className="border p-2">Total Unit</th>
                    <th className="border p-2">Total Cost (RM)</th>
                    <th className="border p-2">Avg Price (RM)</th>
                  </tr>
                </thead>
                <tbody>
                  {tableResult.map((row, i) => (
                    <tr key={i} className="text-center">
                      <td className="border p-2">{row.addUnits}</td>
                      <td className="border p-2">{row.priceToAdd.toFixed(2)}</td>
                      <td className="border p-2">{row.totalUnits}</td>
                      <td className="border p-2">{row.totalCost}</td>
                      <td className="border p-2 text-green-700 font-semibold">{row.avgPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EntryCalculator;

