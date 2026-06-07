export default function Skeleton({ className = "", variant = "card" }) {
  const variants = {
    card: "h-24 rounded-3xl",
    text: "h-4 rounded-full",
    avatar: "h-12 w-12 rounded-full",
  };

  return (
    <div
      className={[
        "animate-pulse bg-slate-200/80 dark:bg-slate-800/80",
        variants[variant] || variants.card,
        className,
      ].join(" ")}
    />
  );
}
