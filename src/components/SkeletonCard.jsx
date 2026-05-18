function SkeletonCard() {

  return (

    <div className="animate-pulse bg-white/5 border border-white/10 rounded-[30px] overflow-hidden">

      {/* IMAGE */}
      <div className="h-56 bg-white/10" />

      {/* CONTENT */}
      <div className="p-5 space-y-4">

        <div className="h-6 bg-white/10 rounded-xl" />

        <div className="h-4 bg-white/10 rounded-xl w-2/3" />

        <div className="h-4 bg-white/10 rounded-xl w-1/3" />

      </div>

    </div>
  );
}

export default SkeletonCard;