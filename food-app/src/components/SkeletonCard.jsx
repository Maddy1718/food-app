function SkeletonCard() {

  return (

    <div className="animate-pulse overflow-hidden rounded-[30px] border border-slate-200 bg-slate-200 dark:border-white/10 dark:bg-white/5">

      {/* IMAGE */}
      <div className="h-56 bg-slate-300/80 dark:bg-white/10" />

      {/* CONTENT */}
      <div className="space-y-4 p-5">

        <div className="h-6 rounded-xl bg-slate-300/80 dark:bg-white/10" />

        <div className="h-4 w-2/3 rounded-xl bg-slate-300/80 dark:bg-white/10" />

        <div className="h-4 w-1/3 rounded-xl bg-slate-300/80 dark:bg-white/10" />

      </div>

    </div>
  );
}

export default SkeletonCard;