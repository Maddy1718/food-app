function CategorySidebar({ categories, activeCategory, onSelectCategory, darkMode }) {
  return (
    <div className="hidden xl:block sticky top-28 h-[calc(100vh-7rem)] overflow-y-auto pr-4">
      <div className={`rounded-[32px] border p-5 shadow-xl ${darkMode ? "border-white/10 bg-[#0b1221]" : "border-slate-200 bg-white"}`}>
        <h3 className="text-xl font-black mb-5">Menu categories</h3>
        <div className="space-y-3">
          {categories.map((category) => {
            const active = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => onSelectCategory(category)}
                className={`block w-full rounded-3xl px-5 py-4 text-left transition duration-300 ${
                  active
                    ? "bg-orange-500 text-white shadow-lg"
                    : darkMode
                    ? "bg-[#111827] text-slate-200 hover:bg-white/5"
                    : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CategorySidebar;
