import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function Input({ label, id, error, className = "", ...props }) {
  const { theme } = useContext(ThemeContext) || {};
  const isDark = theme === "dark";

  return (
    <label htmlFor={id} className="block space-y-2 text-sm">
      {label ? <span className={isDark ? "text-slate-200" : "text-slate-700"}>{label}</span> : null}
      <input
        id={id}
        className={[
          "w-full rounded-2xl border px-4 py-3 text-sm transition outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-orange-400",
          isDark
            ? "border-slate-800 bg-slate-950 text-slate-100 focus:border-orange-400"
            : "border-slate-200 bg-white text-slate-900 focus:border-orange-400",
          error ? "border-red-400" : "",
          className,
        ].join(" ")}
        {...props}
      />
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </label>
  );
}
