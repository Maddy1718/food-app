import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function StatsCard({ label, value, change, icon }) {
  const { theme } = useContext(ThemeContext) || {};
  const isDark = theme === "dark";

  return (
    <article className={[
      "rounded-3xl border p-5 shadow-xl transition hover:-translate-y-0.5",
      isDark
        ? "border-slate-800 bg-slate-900/95 shadow-slate-950/30"
        : "border-slate-200 bg-white/95 shadow-slate-200/70",
    ].join(" ")}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={isDark ? "text-xs uppercase tracking-[0.18em] text-slate-400" : "text-xs uppercase tracking-[0.18em] text-slate-500"}>{label}</p>
          <p className={isDark ? "mt-3 text-3xl font-black text-slate-100" : "mt-3 text-3xl font-black text-slate-900"}>{value}</p>
          {change ? <p className="mt-2 text-sm text-emerald-500">{change}</p> : null}
        </div>
        {icon ? <div className="rounded-2xl bg-orange-500/10 p-3 text-orange-500">{icon}</div> : null}
      </div>
    </article>
  );
}
