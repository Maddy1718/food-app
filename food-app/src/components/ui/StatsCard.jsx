import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function StatsCard({ label, value, change, icon, className = "" }) {
  const { theme } = useContext(ThemeContext) || {};
  const isDark = theme === "dark";

  return (
    <article className={[
      "h-full min-w-0 rounded-3xl border p-5 shadow-xl transition hover:-translate-y-0.5",
      isDark
        ? "border-slate-800 bg-slate-900/95 shadow-slate-950/30"
        : "border-slate-200 bg-white/95 shadow-slate-200/70",
      className,
    ].join(" ")}>
      <div className="flex h-full items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className={isDark ? "text-xs uppercase tracking-[0.18em] text-slate-400" : "text-xs uppercase tracking-[0.18em] text-slate-500"}>{label}</p>
          <p className={isDark ? "mt-3 text-2xl font-black text-slate-100 break-words sm:text-3xl" : "mt-3 text-2xl font-black text-slate-900 break-words sm:text-3xl"}>{value}</p>
          {change ? <p className="mt-2 text-sm text-emerald-500 break-words">{change}</p> : null}
        </div>
        {icon ? <div className="shrink-0 rounded-2xl bg-orange-500/10 p-3 text-orange-500">{icon}</div> : null}
      </div>
    </article>
  );
}
