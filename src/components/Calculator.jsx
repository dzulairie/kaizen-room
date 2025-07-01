import React, { useState } from "react";

const Calculator = () => {
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [brokerFee, setBrokerFee] = useState("0.34"); // in percent
  const [minBroker, setMinBroker] = useState("12");
  const [clearanceFee, setClearanceFee] = useState("0.03"); // in percent
  const [stampDuty, setStampDuty] = useState("1");

  const [result, setResult] = useState(null);

  const handleCalculate = (e) => {
    e.preventDefault();

    const qty = parseFloat(quantity);
    const buy = parseFloat(buyPrice);
    const sell = parseFloat(sellPrice);
    const broker = parseFloat(brokerFee) / 100;
    const minB = parseFloat(minBroker);
    const clear = parseFloat(clearanceFee) / 100;
    const stamp = parseFloat(stampDuty);

    if (isNaN(qty) || isNaN(buy) || isNaN(sell)) return;

    const totalBuy = qty * buy;
    const totalSell = qty * sell;

    // BUY FEES
    const buyBrokerage = Math.max(totalBuy * broker, minB);
    const buyClearance = totalBuy * clear;
    const buyStamp = Math.ceil((qty * buy) / 1000) * stamp;

    // SELL FEES
    const sellBrokerage = Math.max(totalSell * broker, minB);
    const sellClearance = totalSell * clear;
    const sellStamp = Math.ceil((qty * sell) / 1000) * stamp;

    const totalBuyCost = totalBuy + buyBrokerage + buyClearance + buyStamp;
    const totalSellRevenue = totalSell - sellBrokerage - sellClearance - sellStamp;
    const profit = totalSellRevenue - totalBuyCost;

    // BREAK-EVEN PRICE CALCULATION
    const estimatedSellFeePercent = broker + clear;
    const estimatedStampPerUnit = stamp / 1000;
    const breakEvenPrice = (
      (totalBuyCost + Math.max(minB, 0)) / qty +
      estimatedSellFeePercent * buy +
      estimatedStampPerUnit
    ).toFixed(4);

    setResult({
      totalBuyCost: totalBuyCost.toFixed(2),
      totalSellRevenue: totalSellRevenue.toFixed(2),
      profit: profit.toFixed(2),
      buyBrokerage: buyBrokerage.toFixed(2),
      buyClearance: buyClearance.toFixed(2),
      buyStamp: buyStamp.toFixed(2),
      sellBrokerage: sellBrokerage.toFixed(2),
      sellClearance: sellClearance.toFixed(2),
      sellStamp: sellStamp.toFixed(2),
      breakEvenPrice,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trade Inputs */}
        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">📥 Trade Inputs</h2>
          <form onSubmit={handleCalculate} className="space-y-4">
            <div>
              <label className="block text-gray-700">Quantity (Units)</label>
              <input type="text" className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white/80"
                value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g. 10000" />
            </div>
            <div>
              <label className="block text-gray-700">Buy Price (RM)</label>
              <input type="text" className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white/80"
                value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} placeholder="e.g. 0.80" />
            </div>
            <div>
              <label className="block text-gray-700">Sell Price (RM)</label>
              <input type="text" className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white/80"
                value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} placeholder="e.g. 0.95" />
            </div>
            <button type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition">
              Calculate
            </button>
          </form>
        </div>

        {/* Fee Settings */}
        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">⚙️ Fee Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700">Brokerage Fee (%)</label>
              <input type="text" className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white/80"
                value={brokerFee} onChange={(e) => setBrokerFee(e.target.value)} placeholder="e.g. 0.34" />
            </div>
            <div>
              <label className="block text-gray-700">Minimum Brokerage (RM)</label>
              <input type="text" className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white/80"
                value={minBroker} onChange={(e) => setMinBroker(e.target.value)} placeholder="e.g. 12" />
            </div>
            <div>
              <label className="block text-gray-700">Clearance Fee (%)</label>
              <input type="text" className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white/80"
                value={clearanceFee} onChange={(e) => setClearanceFee(e.target.value)} placeholder="e.g. 0.03" />
            </div>
            <div>
              <label className="block text-gray-700">Stamp Duty (RM per 1000)</label>
              <input type="text" className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white/80"
                value={stampDuty} onChange={(e) => setStampDuty(e.target.value)} placeholder="e.g. 1" />
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="mt-8 max-w-6xl mx-auto bg-white/80 p-6 rounded-lg shadow-inner text-gray-800 space-y-6">
          <h3 className="text-xl font-bold text-center mb-4">📊 Trade Summary</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Buy Order */}
            <div>
              <h4 className="text-lg font-semibold mb-2">🟩 Buy Order</h4>
              <p>Quantity: <strong>{quantity}</strong></p>
              <p>Buy Price: <strong>RM {parseFloat(buyPrice).toFixed(2)}</strong></p>
              <p>Brokerage: <strong>RM {result.buyBrokerage}</strong></p>
              <p>Clearance Fee: <strong>RM {result.buyClearance}</strong></p>
              <p>Stamp Duty: <strong>RM {result.buyStamp}</strong></p>
              <p className="mt-2 border-t pt-2 font-semibold">Gross Buy Amount: <strong>RM {result.totalBuyCost}</strong></p>
            </div>

            {/* Sell Order */}
            <div>
              <h4 className="text-lg font-semibold mb-2">🟥 Sell Order</h4>
              <p>Quantity: <strong>{quantity}</strong></p>
              <p>Sell Price: <strong>RM {parseFloat(sellPrice).toFixed(2)}</strong></p>
              <p>Brokerage: <strong>RM {result.sellBrokerage}</strong></p>
              <p>Clearance Fee: <strong>RM {result.sellClearance}</strong></p>
              <p>Stamp Duty: <strong>RM {result.sellStamp}</strong></p>
              <p className="mt-2 border-t pt-2 font-semibold">Gross Sell Amount: <strong>RM {result.totalSellRevenue}</strong></p>
            </div>
          </div>

          {/* Profit Summary */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">💹 Realised Profit/Loss</h4>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Without Fees */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h5 className="font-semibold text-gray-700 mb-2">Without Fees</h5>
                  <p>(RM): <strong>RM {(((parseFloat(sellPrice) - parseFloat(buyPrice)) * parseFloat(quantity)).toFixed(2))}</strong></p>
                  <p>(%): <strong>{(((parseFloat(sellPrice) - parseFloat(buyPrice)) / parseFloat(buyPrice)) * 100).toFixed(2)}%</strong></p>
              </div>

              {/* After All Fees */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h5 className="font-semibold text-gray-700 mb-2">After All Fees</h5>
                <p>(RM): <strong>RM {result.profit}</strong></p>
                <p>(%): <strong>{((parseFloat(result.profit) / parseFloat(result.totalBuyCost)) * 100).toFixed(2)}%</strong></p>
              </div>
            </div>

            {/* Break Even */}
            <div className="mt-4 border-t pt-2 text-blue-600 font-semibold">
              🔁 Break-Even Sell Price: <strong>RM {result.breakEvenPrice}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;
