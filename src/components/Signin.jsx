import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const SignIn = () => {
  const navigate = useNavigate();
  const { signInUser } = UserAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signInUser(email, password);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error); // result.error already string
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[url('/bg.login.png')] bg-cover bg-center">
      <div className="bg-white/20 border border-white/10 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-3 text-center text-black">Trader Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-black mb-1">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-white/20 text-black placeholder:text-gray-500 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              required
            />
          </div>

          <div>
            <label className="block text-black mb-1">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-white/20 text-black placeholder:text-gray-500 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-black">
          No account?{" "}
          <Link to="/signup" className="text-sky-600 hover:underline font-medium">
            Request now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;






