import { useContext, useMemo, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { ThemeContext } from "../context/ThemeContext";

export default function Topbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [online, setOnline] = useState(true);
  const isDark = theme === "dark";

  const dateLabel = useMemo(() => new Date().toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" }), []);

  return (
    <header className={`rounded-3xl border p-4 shadow-2xl backdrop-blur-xl ${isDark ? "border-slate-800 bg-slate-900/90 text-slate-100" : "border-slate-200 bg-white/95 text-slate-900"}`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-orange-500 font-bold">Delivery Partner</p>
          <h2 className="mt-1 text-2xl font-black">Welcome back, ready for the next rush.</h2>
          <p className={`mt-1 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>{dateLabel} • Daily goal: keep every order moving.</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className={`grid place-items-center rounded-2xl border p-3 transition hover:-translate-y-0.5 ${isDark ? "border-slate-700 bg-slate-950 text-slate-100" : "border-slate-200 bg-white text-slate-900"}`}>
            {isDark ? <FiSun /> : <FiMoon />}
          </button>
          <button onClick={() => setOnline(!online)} className={`rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-lg ${online ? "bg-emerald-500" : "bg-rose-500"}`}>
            {online ? "🟢 Online" : "🔴 Offline"}
          </button>
        </div>
      </div>
    </header>
  );
}