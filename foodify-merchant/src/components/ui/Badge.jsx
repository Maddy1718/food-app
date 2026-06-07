import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function Badge({ children, tone = "neutral", className = "" }) {
  const { theme } = useContext(ThemeContext) || {};
  const isDark = theme === "dark";

  const tones = {
    neutral: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100",
    primary: "bg-orange-500/10 text-orange-700 dark:bg-orange-500/15 dark:text-orange-200",
    accent: "bg-violet-500/10 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200",
    success: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200",
  };

  return (
    <span className={["inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", tones[tone] || tones.neutral, className].join(" ")}>
      {children}
    </span>
  );
}
