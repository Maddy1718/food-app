import { FaSearch, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

function SearchBar({
  value,
  onChange,
  onClear,
  onFocus,
  onBlur,
  suggestions,
  loading,
  noResults,
  darkMode,
}) {
  return (
    <div className="relative w-full">
      <div
        className={`group relative mx-auto flex w-full max-w-4xl items-center gap-3 rounded-[32px] border border-white/15 bg-white/10 px-4 py-3 shadow-[0_30px_70px_rgba(15,23,42,0.22)] backdrop-blur-xl transition duration-300 focus-within:border-orange-400/80 focus-within:shadow-orange-500/20 ${
          darkMode ? "text-white" : "text-slate-900"
        }`}
      >
        <FaSearch className="text-slate-400 text-xl transition duration-300 group-focus-within:text-orange-400" />

        <input
          type="text"
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="Search restaurants, cuisines or dishes"
          className={`w-full bg-transparent text-lg outline-none placeholder:text-slate-400 ${
            darkMode ? "text-white" : "text-slate-900"
          }`}
          autoComplete="off"
        />

        {value && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <FaTimes />
          </button>
        )}
      </div>

      {(suggestions?.length > 0 || noResults) && (
        <div className="absolute left-0 right-0 z-30 mt-3 w-full rounded-[32px] border border-white/10 bg-[#080f20] shadow-2xl backdrop-blur-xl">
          {loading ? (
            <div className="p-4 text-center text-slate-400">Searching...</div>
          ) : suggestions.length > 0 ? (
            suggestions.map((restaurant) => (
              <Link
                key={restaurant.id}
                to={`/restaurant/${restaurant.id}`}
                className="block px-4 py-4 transition hover:bg-white/5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold text-white text-lg">
                      {restaurant.restaurant_name || restaurant.name || `Restaurant ${restaurant.id}`}
                    </div>
                    <div className="mt-1 text-sm text-slate-400">
                      {restaurant.cuisine || restaurant.category || restaurant.address || "Popular restaurant"}
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-3 py-1 text-sm font-semibold text-orange-300">
                    ⭐ {restaurant.rating || 4.5}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-4 text-center text-slate-400">No restaurants found.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
