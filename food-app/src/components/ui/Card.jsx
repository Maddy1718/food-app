import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function Card({ children, className = "", padding = "md", hover = true }) {
  const { theme } = useContext(ThemeContext) || {};
  const isDark = theme === "dark";

  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-5",
    lg: "p-6",
  };

  return (
    <article
      className={[
        "h-full min-w-0 rounded-3xl border transition duration-200",
        isDark
          ? "border-slate-800 bg-slate-900/95 text-slate-100 shadow-2xl shadow-slate-950/30"
          : "border-slate-200 bg-white/95 text-slate-900 shadow-xl shadow-slate-200/70",
        hover ? "hover:-translate-y-0.5 hover:shadow-2xl" : "",
        paddings[padding] || paddings.md,
        className,
      ].join(" ")}
    >
      {children}
    </article>
  );
}
