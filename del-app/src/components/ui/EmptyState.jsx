import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function EmptyState({ title, description, action }) {
  const { theme } = useContext(ThemeContext) || {};
  const isDark = theme === "dark";

  return (
    <section className={[
      "rounded-3xl border p-10 text-center shadow-xl",
      isDark
        ? "border-slate-800 bg-slate-900/90 shadow-slate-950/25"
        : "border-slate-200 bg-white/95 shadow-slate-200/70",
    ].join(" ")}>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">✦</div>
      <h2 className={isDark ? "mt-4 text-xl font-black text-slate-100" : "mt-4 text-xl font-black text-slate-900"}>{title}</h2>
      <p className={isDark ? "mx-auto mt-2 max-w-md text-sm text-slate-300" : "mx-auto mt-2 max-w-md text-sm text-slate-600"}>{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </section>
  );
}
