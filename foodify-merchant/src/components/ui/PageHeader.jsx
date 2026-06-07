import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function PageHeader({ eyebrow, title, description, action }) {
  const { theme } = useContext(ThemeContext) || {};
  const isDark = theme === "dark";

  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-transparent bg-gradient-to-r from-orange-500/10 via-transparent to-violet-500/10 p-6 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        {eyebrow ? <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-orange-500">{eyebrow}</p> : null}
        {title ? <h1 className={isDark ? "text-3xl font-black text-slate-100 md:text-4xl" : "text-3xl font-black text-slate-900 md:text-4xl"}>{title}</h1> : null}
        {description ? <p className={isDark ? "max-w-2xl text-sm text-slate-300" : "max-w-2xl text-sm text-slate-600"}>{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
