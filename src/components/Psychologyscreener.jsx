import React, { useState } from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const questions = {
  fear: [
    "Saya takut untuk masuk posisi walaupun setup dah valid",
    "Saya kerap close posisi awal kerana takut market reverse",
    "Saya rasa takut selepas mengalami kerugian besar",
    "Saya lebih selesa untuk tidak trade daripada rugi"
  ],
  greed: [
    "Saya tambah posisi walaupun harga dah naik banyak",
    "Saya trade terlalu banyak dalam satu hari sebab taknak terlepas peluang",
    "Saya rasa tak puas kalau untung saya kecil",
    "Saya masuk posisi walaupun tak ada signal jelas sebab 'rasa' akan naik"
  ],
  discipline: [
    "Saya ikut trading plan yang telah saya buat",
    "Saya tunggu setup lengkap sebelum masuk trade",
    "Saya selalu gunakan stop loss dan take profit",
    "Saya tidak revenge trade selepas rugi"
  ],
  bias: [
    "Saya terlalu yakin dengan analisis saya sendiri",
    "Saya abaikan signal dari sistem sebab yakin dengan 'gut feeling'",
    "Saya hanya trade saham yang saya dah biasa walaupun tiada signal",
    "Saya fikir saya lebih tahu daripada market"
  ],
  stress: [
    "Saya rasa stress semasa market bergerak",
    "Saya susah tidur lepas kerugian besar",
    "Saya rasa marah bila posisi bertentangan dengan jangkaan",
    "Saya masih trading walaupun tengah penat atau emosi terganggu"
  ]
};

export default function TraderPsychologySurvey() {
  const categories = Object.keys(questions);
  const [responses, setResponses] = useState({});
  const [scores, setScores] = useState(null);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  const handleChange = (category, index, value) => {
    setResponses((prev) => {
      const updated = { ...prev };
      if (!updated[category]) updated[category] = [];
      updated[category][index] = parseInt(value);
      return updated;
    });
  };

  const calculateScore = (answers) => {
    const maxScore = answers.length * 5;
    const total = answers.reduce((a, b) => a + b, 0);
    return Math.round((total / maxScore) * 100);
  };

  const handleNext = () => {
    const currentCategory = categories[activeCategoryIndex];
    const answers = responses[currentCategory] || [];
    if (answers.length !== questions[currentCategory].length) {
      alert(`Sila jawab semua soalan untuk kategori ${currentCategory}`);
      return;
    }
    setActiveCategoryIndex((prev) => prev + 1);
  };

  const handleSubmit = () => {
    const result = {};
    for (const category in questions) {
      const answers = responses[category] || [];
      result[category] = calculateScore(answers);
    }
    setScores(result);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 overflow-hidden">
      <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-xl">
        <h1 className="text-xl font-bold mb-6 text-center text-black">
          Trader Psychology Survey
        </h1>

        {/* Slide Container */}
        {!scores && (
          <div className="overflow-hidden h-[650px] relative">
            <div
              className="flex flex-col transition-transform duration-500"
              style={{
                height: `${categories.length * 100}%`,
                transform: `translateY(-${activeCategoryIndex * (100 / categories.length)}%)`,
              }}
            >
              {categories.map((category, catIdx) => (
                <div
                  key={category}
                  className="w-full px-4 shrink-0"
                  style={{ height: `${100 / categories.length}%` }}
                >
                  <h2 className="text-xl font-semibold capitalize mb-4 text-gray-700 border-b pb-2">
                    {category}
                  </h2>
                  {questions[category].map((q, i) => (
                    <div key={i} className="mb-6 bg-white p-4 rounded-lg shadow-sm">
                      <p className="mb-3 text-gray-800 font-medium text-center">{q}</p>
                      <div className="flex flex-wrap gap-4 justify-center">
                        {[1, 2, 3, 4, 5].map((val) => {
                          const selected = responses[category]?.[i] === val;
                          return (
                            <button
                              key={val}
                              onClick={() => handleChange(category, i, val)}
                              className={`w-12 h-12 flex items-center justify-center font-semibold rounded-lg shadow border transition transform active:scale-95
                                ${selected ? "!bg-blue-600 !text-white" : "!bg-white !text-black hover:bg-blue-100"}`}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Next or Submit Button */}
                  <div className="text-center mt-6">
                    {catIdx < categories.length - 1 ? (
                      <button
                        onClick={handleNext}
                        className="bg-blue-600 text-white !px-4 !py-1 rounded-lg hover:bg-blue-700 text-base font-semibold shadow"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white !px-4 !py-1 rounded-lg hover:bg-blue-700 text-base font-semibold shadow"
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hasil Keputusan */}
        {scores && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6 text-center text-green-700">
              Keputusan Psikologi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(scores).map(([category, score]) => (
                <div
                  key={category}
                  className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center"
                >
                  <h3 className="font-bold capitalize mb-4 text-center text-gray-700">
                    {category} Level
                  </h3>
                  <div className="w-36 h-36 relative">
                    <CircularProgressbarWithChildren
                      value={score}
                      maxValue={100}
                      styles={buildStyles({
                        strokeLinecap: "round",
                        trailColor: "#eee",
                        pathColor: `url(#${category}-gradient)`
                      })}
                    >
                      <div className="text-xl font-bold text-gray-800">{score}%</div>
                    </CircularProgressbarWithChildren>

                    {/* Gradient Definition */}
                    <svg style={{ height: 0 }}>
                      <defs>
                        <linearGradient id={`${category}-gradient`} gradientTransform="rotate(90)">
                          <stop offset="0%" stopColor="#34d399" />
                          <stop offset="50%" stopColor="#60a5fa" />
                          <stop offset="100%" stopColor="#c084fc" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
