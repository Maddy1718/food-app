import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await login(email, password);
      if (error) {
        setError(error.message);
      } else {
        navigate("/");
      }
    } catch {
      setError("An error occurred while logging in.");
    }

    setLoading(false);
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? "bg-[#0f172a]" : "bg-[#f3f4f6]"}`}>
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className={`rounded-[40px] shadow-2xl p-10 ${darkMode ? "bg-[#111827] text-white" : "bg-white text-black"}`}>
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-500 font-semibold">Welcome Back</p>
            <h1 className="mt-4 text-4xl font-black">Login to BiteBox</h1>
            <p className="mt-3 text-gray-500 dark:text-gray-400">Use your Supabase email and password to continue.</p>
          </div>

          {error && <div className="mb-6 rounded-3xl bg-red-50 px-6 py-4 text-red-700">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-3xl border border-gray-200 bg-transparent px-5 py-4 text-lg outline-none transition focus:border-orange-500 dark:border-gray-700 dark:bg-[#0f172a] dark:text-white"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-3xl border border-gray-200 bg-transparent px-5 py-4 text-lg outline-none transition focus:border-orange-500 dark:border-gray-700 dark:bg-[#0f172a] dark:text-white"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-3xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 text-lg font-bold text-white transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link className="font-semibold text-orange-500 hover:text-orange-600" to="/signup">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
