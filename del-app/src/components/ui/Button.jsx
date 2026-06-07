import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}) {
  const { theme } = useContext(ThemeContext) || {};
  const isDark = theme === "dark";

  const variants = {
    primary: "bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-400 shadow-lg shadow-orange-500/20",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-400 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-300 dark:text-slate-100 dark:hover:bg-slate-800",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-sm",
    lg: "px-5 py-3.5 text-base",
  };

  return (
    <button
      type="button"
      className={[
        "inline-flex items-center justify-center rounded-2xl border border-transparent font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        isDark ? "focus:ring-offset-slate-950" : "focus:ring-offset-white",
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
