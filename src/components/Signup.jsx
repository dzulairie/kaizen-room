import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const Signup = () => {
  const { signUpNewUser } = UserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signUpNewUser(email, password);
      console.log("Signup result:", result);

      if (result.success) {
        alert("Sign up berjaya! Sila semak email anda untuk pengesahan.");
        // navigate("/"); // Optional: Biar user decide bila nak login
      } else {
        setError(result.error); // ✅ betulkan error
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[url('/bg.login.png')] bg-cover bg-center">
      <div className="bg-white/20 border border-white/10 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Sign up request</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-black mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full p-3 bg-white/50 text-black placeholder:text-gray-500 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              required
            />
          </div>

          <div>
            <label className="block text-black mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full p-3 bg-white/50 text-black placeholder:text-gray-500 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              required
            />
          </div>

          {/* Optional fields - NOT connected to Supabase yet */}
          <div>
            <label className="block text-black mb-1">Name</label>
            <input
              type="text"
              placeholder="Full Name as per IC"
              className="w-full p-3 bg-white/50 text-black placeholder:text-gray-500 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
            />
          </div>

          <div>
            <label className="block text-black mb-1">Trading Experience</label>
            <input
              type="text"
              placeholder="Example: 1 year etc"
              className="w-full p-3 bg-white/50 text-black placeholder:text-gray-500 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
            />
          </div>

          <div>
            <label className="block text-black mb-1">Trading Capital (RM)</label>
            <input
              type="number"
              placeholder="Example: RM 1000"
              className="w-full p-3 bg-white/50 text-black placeholder:text-gray-500 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;


