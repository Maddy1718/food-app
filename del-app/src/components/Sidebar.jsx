import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiGrid, FiPackage, FiTruck, FiClock, FiUser } from "react-icons/fi";
import { ThemeContext } from "../context/ThemeContext";

export default function Sidebar() {
  const { theme } = useContext(ThemeContext);
  const location = useLocation();
  const isDark = theme === "dark";

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <FiGrid /> },
    { to: "/available-orders", label: "Available Orders", icon: <FiPackage /> },
    { to: "/my-deliveries", label: "My Deliveries", icon: <FiTruck /> },
    { to: "/history", label: "Delivery History", icon: <FiClock /> },
    { to: "/profile", label: "Profile", icon: <FiUser /> },
  ];

  return (
    <aside className={`hidden md:flex sticky top-0 h-screen w-[280px] shrink-0 flex-col border-r px-4 py-4 backdrop-blur-xl ${isDark ? "border-slate-800 bg-slate-950/95 text-slate-100" : "border-slate-200 bg-white/95 text-slate-900"}`}>
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3 rounded-2xl p-1">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 via-fuchsia-500 to-violet-600 text-xl shadow-lg shadow-orange-500/20">🚚</div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] font-bold text-orange-500">Delivery Partner</p>
            <h2 className="text-xl font-black">Foodify</h2>
          </div>
        </div>

        <div className={`rounded-3xl border p-4 shadow-xl ${isDark ? "border-slate-800 bg-slate-900/90" : "border-slate-200 bg-slate-50/95"}`}>
          <p className="mb-1 text-[11px] uppercase tracking-[0.25em] text-slate-400">Today</p>
          <strong className="text-base font-semibold">Ready to deliver</strong>
          <p className={`mt-1 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>Track, accept, and complete deliveries in one place.</p>
        </div>

        <nav className="flex flex-col gap-2">
          {links.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center justify-between rounded-2xl border px-3 py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${active ? "border-orange-500/30 bg-orange-500/10 text-white shadow-lg shadow-orange-500/10" : isDark ? "border-slate-800 bg-slate-900/80 text-slate-100" : "border-slate-200 bg-white text-slate-800"}`}
              >
                <span className="inline-flex items-center gap-3">{item.icon}<strong>{item.label}</strong></span>
                {active && <span className="h-2 w-2 rounded-full bg-gradient-to-r from-orange-500 to-violet-500" />}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}