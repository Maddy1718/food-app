export const getPalette = (isDark) => ({
  page: isDark
    ? "linear-gradient(135deg, #020617 0%, #0f172a 100%)"
    : "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
  panel: isDark ? "rgba(15, 23, 42, 0.88)" : "rgba(255, 255, 255, 0.92)",
  surface: isDark ? "rgba(15, 23, 42, 0.96)" : "rgba(255, 255, 255, 0.98)",
  border: isDark ? "rgba(148, 163, 184, 0.14)" : "rgba(15, 23, 42, 0.08)",
  text: isDark ? "#ffffff" : "#0f172a",
  muted: isDark ? "#94a3b8" : "#475569",
  subtle: isDark ? "#cbd5e1" : "#64748b",
  primary: "#f97316",
  accent: "#8b5cf6",
  success: "#22c55e",
  danger: "#ef4444",
  info: isDark ? "#bfdbfe" : "#1d4ed8",
});
