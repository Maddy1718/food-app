import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function SearchBar({ value, onChange, placeholder = "Search", className = "" }) {
  const { theme } = useContext(ThemeContext) || {};
  const isDark = theme === "dark";

  return (
    <label className={[
      "flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-sm",
      isDark
        ? "border-slate-800 bg-slate-900 text-slate-100 shadow-slate-950/20"
        : "border-slate-200 bg-white text-slate-700 shadow-slate-100",
      className,
    ].join(" ")}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 text-slate-400">
        <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="11" cy="11" r="6" />
      </svg>
      <input
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
      />
    </label>
  );
}
