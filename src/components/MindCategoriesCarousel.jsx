import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const fallbackGradients = [
  "from-orange-400 via-pink-500 to-violet-500",
  "from-cyan-400 via-blue-500 to-indigo-600",
  "from-emerald-400 via-lime-400 to-amber-400",
  "from-fuchsia-500 via-purple-500 to-sky-500",
  "from-rose-500 via-orange-500 to-yellow-400",
];

function getGradient(name) {
  const index = Math.abs(name.length) % fallbackGradients.length;
  return fallbackGradients[index];
}

function getBadgeLabel(category) {
  return category.split(" ").slice(0, 2).map((word) => word[0]).join("");
}

function MindCategoriesCarousel({ categories, selectedCategory, onSelectCategory, darkMode }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const visibleCategories = useMemo(() => categories || [], [categories]);

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: direction * 260, behavior: "smooth" });
  };

  const handleScrollUpdate = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  }, [visibleCategories]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => handleScroll(-1)}
        className={`absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-slate-950/80 p-2 text-white shadow-2xl transition hover:-translate-x-1 hover:bg-orange-500/90 ${
          canScrollLeft ? "opacity-100" : "pointer-events-none opacity-40"
        }`}
      >
        <ChevronLeft size={20} />
      </button>

      <div
        ref={scrollRef}
        onScroll={handleScrollUpdate}
        className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth py-2 px-8"
      >
        {visibleCategories.map((category) => {
          const active = selectedCategory === category.name;
          const gradient = getGradient(category.name);
          return (
            <button
              key={category.name}
              type="button"
              onClick={() => onSelectCategory(category.name)}
              className={`group min-w-[150px] flex-shrink-0 rounded-[32px] border px-5 py-5 text-left transition duration-300 will-change-transform ${
                active
                  ? "border-orange-400 bg-orange-500/15 text-white shadow-[0_30px_70px_rgba(255,150,80,0.16)]"
                  : darkMode
                  ? "border-white/10 bg-[#0d1630] text-slate-200 hover:-translate-y-1 hover:border-white/20 hover:bg-[#13203c]"
                  : "border-slate-200 bg-white text-slate-900 hover:-translate-y-1 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-full ${category.image ? "bg-white/5" : `bg-gradient-to-br ${gradient}`} text-xl font-black text-white shadow-lg shadow-orange-500/10 transition duration-300 group-hover:scale-105`}>
                  {category.image ? (
                    <img src={category.image} alt={category.name} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    getBadgeLabel(category.name)
                  )}
                </div>
                <div>
                  <p className="font-semibold text-base">{category.name}</p>
                  <p className="mt-1 text-xs text-slate-400">Explore {category.name}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => handleScroll(1)}
        className={`absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-slate-950/80 p-2 text-white shadow-2xl transition hover:translate-x-1 hover:bg-orange-500/90 ${
          canScrollRight ? "opacity-100" : "pointer-events-none opacity-40"
        }`}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

export default MindCategoriesCarousel;
