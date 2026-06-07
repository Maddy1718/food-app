import { useContext } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { ThemeContext } from "../context/ThemeContext";

export default function DeliveryLayout({ children, className = "" }) {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen w-full flex bg-gradient-to-br ${isDark ? "from-slate-950 via-slate-900 to-slate-950 text-slate-100" : "from-slate-100 via-white to-slate-100 text-slate-900"}`}>
      <Sidebar />
      <main className="flex-1 min-w-0 px-4 py-4 md:px-6 lg:px-8">
        <Topbar />
        <section className={`mt-6 flex flex-col gap-6 ${className}`}>{children}</section>
      </main>
    </div>
  );
}
