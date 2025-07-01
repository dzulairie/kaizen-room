import React, { useState } from "react";

const CompoundingCalculator = () => {
  const [initial, setInitial] = useState("");
  const [roi, setRoi] = useState("");
  const [roiType, setRoiType] = useState("Yearly");
  const [frequency, setFrequency] = useState("Monthly");
  const [years, setYears] = useState("");
  const [months, setMonths] = useState("");
  const [result, setResult] = useState(null);
  const [compoundTable, setCompoundTable] = useState([]);

  const handleCalculate = (e) => {
    e.preventDefault();

    const P = parseFloat(initial);
    const roiInput = parseFloat(roi) / 100;
    const y = parseInt(years) || 0;
    const m = parseInt(months) || 0;

    if (isNaN(P) || isNaN(roiInput) || (y === 0 && m === 0)) return;

    const totalYears = y + m / 12;

    const n =
      frequency === "Daily" ? 365 :
      frequency === "Weekly" ? 52 :
      frequency === "Monthly" ? 12 :
      1;

    // Convert input ROI to effective annual rate
    let annualRate;
    switch (roiType) {
      case "Monthly":
        annualRate = Math.pow(1 + roiInput, 12) - 1;
        break;
      case "Weekly":
        annualRate = Math.pow(1 + roiInput, 52) - 1;
        break;
      case "Daily":
        annualRate = Math.pow(1 + roiInput, 365) - 1;
        break;
      default: // Yearly
        annualRate = roiInput;
    }

    // Adjust rate per compounding period
    const ratePerPeriod = Math.pow(1 + annualRate, 1 / n) - 1;
    const periods = Math.round(n * totalYears);

    let table = [];
    for (let i = 1; i <= periods; i++) {
      const amount = P * Math.pow(1 + ratePerPeriod, i);
      table.push({
        period: i,
        amount: amount.toFixed(2),
        profit: (amount - P).toFixed(2),
      });
    }

    const finalAmount = P * Math.pow(1 + ratePerPeriod, periods);
    const profit = finalAmount - P;

    setResult({
      finalAmount: finalAmount.toFixed(2),
      profit: profit.toFixed(2),
      totalYears: totalYears.toFixed(2),
    });

    setCompoundTable(table);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">💰 Compounding Calculator</h2>

        <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Initial Amount (RM)</label>
            <input type="text" value={initial} onChange={(e) => setInitial(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white/80"
              placeholder="e.g. 1000" />
          </div>

          <div>
            <label className="block text-gray-700">ROI (%)</label>
            <input type="text" value={roi} onChange={(e) => setRoi(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white/80"
              placeholder="e.g. 10" />
          </div>

          <div>
            <label className="block text-gray-700">ROI Type</label>
            <select value={roiType} onChange={(e) => setRoiType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white/80">
              <option>Yearly</option>
              <option>Monthly</option>
              <option>Weekly</option>
              <option>Daily</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Compounding Frequency</label>
            <select value={frequency} onChange={(e) => setFrequency(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white/80">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Yearly</option>
            </select>
          </div>

          <div className="flex gap-2 md:col-span-2">
            <div className="w-1/2">
              <label className="block text-gray-700">Years</label>
              <input type="number" value={years} onChange={(e) => setYears(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white/80"
                placeholder="e.g. 1" />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700">Months</label>
              <input type="number" value={months} onChange={(e) => setMonths(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white/80"
                placeholder="e.g. 6" />
            </div>
          </div>

          <div className="md:col-span-2">
            <button type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-semibold transition">
              Calculate
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-8 p-6 bg-gray-50 rounded-xl shadow-inner space-y-4 text-gray-800">
            <h3 className="text-lg font-semibold text-center mb-2">📈 Compounding Summary</h3>
            <p>Initial Investment: <strong>RM {parseFloat(initial).toFixed(2)}</strong></p>
            <p>Final Amount: <strong>RM {result.finalAmount}</strong></p>
            <p>Total Profit: <strong>RM {result.profit}</strong></p>
            <p>Effective Duration: <strong>{result.totalYears} years</strong></p>
          </div>
        )}

        {compoundTable.length > 0 && (
          <div className="mt-10">
            <h4 className="text-lg font-semibold mb-4 text-center">📋 Compounding Table</h4>
            <div className="overflow-x-auto max-h-[500px] border rounded-lg">
              <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-200 sticky top-0">
                  <tr>
                    <th className="px-4 py-2">Period</th>
                    <th className="px-4 py-2">Amount (RM)</th>
                    <th className="px-4 py-2">Profit (RM)</th>
                  </tr>
                </thead>
                <tbody>
                  {compoundTable.map((row) => (
                    <tr key={row.period} className="border-t">
                      <td className="px-4 py-2">{row.period}</td>
                      <td className="px-4 py-2">RM {row.amount}</td>
                      <td className="px-4 py-2">RM {row.profit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompoundingCalculator;

