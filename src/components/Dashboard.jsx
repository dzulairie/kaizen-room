import React, { useEffect, useState } from "react";
import { BookOpen, Quote, Plus, Edit3, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { supabase } from "../supabaseUser";

const Dashboard = () => {
  const navigate = useNavigate();
  const { signOutUser } = UserAuth();

  const analysisTools = [
    { title: "CANSLIM Stocks", desc: "Study stocks using the CANSLIM strategy", path: "/Taskmanager" },
    { title: "Momentum Stocks", desc: "Track momentum stocks", path: "/MomentumStock" },
    { title: "Friday Rule Stocks", desc: "Friday breakout stocks (follow-up on Monday)", path: "/FridayruleStock" },
    { title: "IPO Stocks", desc: "Analyze upcoming IPOs", path: "/IPOstudy" },
  ];

  const calculatorTools = [
    { title: "Trading Calculator", desc: "Risk, reward, position sizing", path: "/Calculator" },
    { title: "Compounding Calculator", desc: "Calculate capital growth", path: "/CompoundingCalculator" },
    { title: "Trading Pyramiding Calculator", desc: "Calculate optimal add-on points", path: "/PyramidingCalculator" },
  ];

  const psychologyTools = [
    { title: "Trader Psychology Screener", desc: "Assess your emotional and psychological state before trading.", path: "/PsychologyScreener" },
  ];

  const notesTools = [
    { title: "Learning Corner", desc: "Trading Notes", path: "/LearningCorner" },
  ];

  const [quotes, setQuotes] = useState([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [fadeOut, setFadeOut] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [newQuote, setNewQuote] = useState({ quote: "", author: "" });

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    const { data, error } = await supabase.from("quotes").select("*").order("created_at", { ascending: true });
    if (!error) setQuotes(data);
  };

  useEffect(() => {
    if (quotes.length === 0) return;

    let isCancelled = false;

    const playTypingAnimation = async () => {
      const fullQuote = quotes[currentQuoteIndex]?.quote || "";
      let index = 0;
      setDisplayedText("");
      setFadeOut(false);

      while (index < fullQuote.length && !isCancelled) {
        setDisplayedText((prev) => prev + fullQuote.charAt(index));
        index++;
        await new Promise((res) => setTimeout(res, 50)); // Konsisten speed
      }

      // Tunggu 3 saat sebelum fade
      await new Promise((res) => setTimeout(res, 3000));
      setFadeOut(true);

      // Tunggu lagi 1 saat untuk fadeOut habis, then teruskan
      await new Promise((res) => setTimeout(res, 1000));
      if (!isCancelled) {
        setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
      }
    };

    playTypingAnimation();

    return () => {
      isCancelled = true;
    };
  }, [currentQuoteIndex, quotes]);


  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    if (!newQuote.quote || !newQuote.author) return;

    if (editIndex !== null) {
      const quoteToEdit = quotes[editIndex];
      const { error } = await supabase
        .from("quotes")
        .update({ quote: newQuote.quote, author: newQuote.author })
        .eq("id", quoteToEdit.id);

      if (error) {
        console.error("Update error:", error.message); 
      }
    } else {
      const { error } = await supabase
        .from("quotes")
        .insert([{ quote: newQuote.quote, author: newQuote.author }]); // ✅ NO 'columns' here

      if (error) {
        console.error("Insert error:", error.message);
      }
    }

  setNewQuote({ quote: "", author: "" });
  setEditIndex(null);
  setShowQuoteForm(false);
  fetchQuotes(); // Refresh data
};


  const handleQuoteEdit = () => {
    setEditIndex(currentQuoteIndex);
    setNewQuote(quotes[currentQuoteIndex]);
    setShowQuoteForm(true);
  };

  const handleQuoteDelete = async () => {
    const toDelete = quotes[currentQuoteIndex];
    await supabase.from("quotes").delete().eq("id", toDelete.id);
    setCurrentQuoteIndex(0);
    fetchQuotes();
  };

  const handleNavigate = (path) => navigate(path);

  const handleSignOut = async () => {
    await signOutUser();
    navigate("/");
  };

  const get2025Stats = () => {
    const now = new Date();
    const start = new Date("2025-01-01");
    const end = new Date("2025-12-31");
    const totalDays = Math.ceil((end - start + 1) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.max(0, Math.ceil((now - start) / (1000 * 60 * 60 * 24)));
    const daysLeft = totalDays - daysPassed;
    const percentage = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
    return { percentage: percentage.toFixed(1), daysPassed, daysLeft };
  };

  const { percentage, daysPassed, daysLeft } = get2025Stats();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#050435] to-[#004aad] text-white py-6 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white whitespace-nowrap">Welcome, Dzul Airie</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-[300px]">
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-blue-500 to-green-400 transition-all duration-700 ease-in-out" style={{ width: `${percentage}%` }}></div>
              </div>
              <div className="mt-2 text-sm text-gray-300 text-right">
                <strong>2025 Progress:</strong> {percentage}% · {daysPassed} days passed · {daysLeft} days remaining
              </div>
            </div>
            <button onClick={handleSignOut} className="!backdrop-blur-md !bg-red-500/20 hover:!bg-red-500/40 text-white px-6 py-2 rounded-xl text-sm font-semibold shadow-md border !border-red-500/30">
              Sign Out
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-16">
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">📘 Analysis & Study Tools</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {analysisTools.map((tool, index) => (
                  <div key={index} onClick={() => handleNavigate(tool.path)} className="cursor-pointer p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg hover:shadow-2xl hover:ring-2 hover:ring-blue-400 transition duration-300">
                    <h3 className="text-lg font-bold text-white mb-2">{tool.title}</h3>
                    <p className="text-sm text-white/80">{tool.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6">📊 Trading Calculators</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {calculatorTools.map((tool, index) => (
                  <div key={index} onClick={() => handleNavigate(tool.path)} className="cursor-pointer p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg hover:shadow-2xl hover:ring-2 hover:ring-green-400 transition duration-300">
                    <h3 className="text-lg font-bold text-white mb-2">{tool.title}</h3>
                    <p className="text-sm text-white/80">{tool.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">🧠 Psychology</h2>
                  <div onClick={() => handleNavigate(psychologyTools[0].path)} className="cursor-pointer p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg hover:shadow-2xl hover:ring-2 hover:ring-purple-400 transition duration-300">
                    <h3 className="text-lg font-bold text-white mb-2">{psychologyTools[0].title}</h3>
                    <p className="text-sm text-white/80">{psychologyTools[0].desc}</p>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">📒 Notes</h2>
                  <div onClick={() => handleNavigate(notesTools[0].path)} className="cursor-pointer p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg hover:shadow-2xl hover:ring-2 hover:ring-yellow-400 transition duration-300">
                    <h3 className="text-lg font-bold text-white mb-2">{notesTools[0].title}</h3>
                    <p className="text-sm text-white/80">{notesTools[0].desc}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="w-full lg:w-[350px] xl:w-[400px] xl:pl-4">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg overflow-hidden relative h-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Quote className="w-6 h-6" /> Motivational Quotes
                </h2>
                <div className="relative">
                  <button onClick={() => setShowQuoteForm(true)} className="!bg-transparent hover:bg-white/20 rounded-full transition">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className={`transition-all duration-700 transform ${fadeOut ? "-translate-y-12 opacity-0" : "translate-y-0 opacity-100"} text-base text-white/90 min-h-[80px]`}>
                "{displayedText}"
                <div className="text-sm text-white/60 mt-2">— {quotes[currentQuoteIndex]?.author}</div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button onClick={handleQuoteEdit} className="!bg-transparent text-white/80 hover:text-white">
                  <Edit3 className="w-5 h-5" />
                </button>
                <button onClick={handleQuoteDelete} className="!bg-transparent text-red-400 hover:text-red-600">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showQuoteForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <form onSubmit={handleQuoteSubmit} className="bg-white text-black p-6 rounded-xl w-[350px] shadow-xl relative">
            <button type="button" onClick={() => setShowQuoteForm(false)} className="absolute top-2 right-4 text-2xl text-white">&times;</button>
            <h3 className="text-lg font-bold mb-4">{editIndex !== null ? "Edit Quote" : "Add New Quote"}</h3>
            <div className="space-y-4">
              <textarea className="w-full p-2 border rounded" placeholder="Enter quote" value={newQuote.quote} onChange={(e) => setNewQuote({ ...newQuote, quote: e.target.value })} required />
              <input type="text" className="w-full p-2 border rounded" placeholder="Author" value={newQuote.author} onChange={(e) => setNewQuote({ ...newQuote, author: e.target.value })} required />
              <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded w-full">
                {editIndex !== null ? "Update" : "Add Quote"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;








