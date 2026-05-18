import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import MindCategoriesCarousel from "../components/MindCategoriesCarousel";

import { ThemeContext } from "../context/ThemeContext";
import { fetchRestaurants, fetchUniqueBrands } from "../services/api/restaurantService";
import { fetchMenuItems, fetchCategories } from "../services/api/menuService";

export default function Home() {
  const { darkMode } = useContext(ThemeContext);
  const restaurantsSectionRef = useRef(null);

  const [restaurants, setRestaurants] = useState([]);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchText.trim());
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchText]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [restaurantData, allRestaurantData, itemsData, categoriesData] = await Promise.all([
        fetchUniqueBrands(),
        fetchRestaurants(),
        fetchMenuItems(),
        fetchCategories(),
      ]);

      setRestaurants(restaurantData || []);
      setAllRestaurants(allRestaurantData || []);
      setItems(itemsData || []);
      setCategories(categoriesData || []);
      setLoading(false);
    };

    loadData();
  }, []);

  const restaurantCategories = useMemo(() => {
    const result = [{ name: "All" }];

    categories.forEach((category) => {
      const categoryName = category.category_name?.toString().trim();
      if (!categoryName) return;
      result.push({
        name: categoryName,
        image: category.image_url || category.icon_url || undefined,
      });
    });

    return result;
  }, [categories]);

  const brandBranchMap = useMemo(() => {
    const map = new Map();
    allRestaurants.forEach((restaurant) => {
      const key = restaurant.restaurant_name?.toString().trim().toLowerCase();
      if (!key) return;
      const existing = map.get(key) ?? new Set();
      existing.add(restaurant.id);
      map.set(key, existing);
    });
    return map;
  }, [allRestaurants]);

  const normalizedText = debouncedSearch.toLowerCase();

  const restaurantMatchesSearch = (restaurant) => {
    if (!normalizedText) return true;

    const searchFields = [
      restaurant.restaurant_name,
      restaurant.name,
      restaurant.cuisine,
      restaurant.category,
      restaurant.address,
    ];

    const brandMatch = searchFields.some((field) =>
      field?.toString().toLowerCase().includes(normalizedText)
    );

    const branchIds = brandBranchMap.get(restaurant.restaurant_name?.toString().trim().toLowerCase()) ?? new Set([restaurant.id]);

    const itemMatch = items.some((item) => {
      if (!branchIds.has(item.restaurant_id)) return false;
      return [item.item_name, item.name, item.category, item.description].some((value) =>
        value?.toString().toLowerCase().includes(normalizedText)
      );
    });

    return brandMatch || itemMatch;
  };

  const restaurantMatchesCategory = (restaurant) => {
    if (selectedCategory === "All" || !selectedCategory) return true;

    const categoryTerms = [restaurant.category, restaurant.cuisine].filter(Boolean);
    const restaurantCategoryMatch = categoryTerms.some((value) =>
      value.toString().toLowerCase().includes(selectedCategory.toLowerCase())
    );

    const branchIds = brandBranchMap.get(restaurant.restaurant_name?.toString().trim().toLowerCase()) ?? new Set([restaurant.id]);

    const itemCategoryMatch = items.some(
      (item) =>
        branchIds.has(item.restaurant_id) &&
        item.category?.toString().toLowerCase().includes(selectedCategory.toLowerCase())
    );

    return restaurantCategoryMatch || itemCategoryMatch;
  };

  const filteredRestaurants = useMemo(
    () => restaurants.filter((restaurant) => restaurantMatchesCategory(restaurant) && restaurantMatchesSearch(restaurant)),
    [restaurants, items, brandBranchMap, selectedCategory, normalizedText]
  );

  const suggestions = useMemo(() => {
    if (!normalizedText) return [];
    return filteredRestaurants.slice(0, 6);
  }, [filteredRestaurants, normalizedText]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchText("");
    setShowSuggestions(false);
  };

  const handleSearchClear = () => {
    setSearchText("");
    setShowSuggestions(false);
  };

  const handleSearchFocus = () => {
    if (searchText.trim()) {
      setShowSuggestions(true);
    }
  };

  const handleSearchBlur = () => {
    window.setTimeout(() => setShowSuggestions(false), 150);
  };

  const scrollToRestaurants = () => {
    restaurantsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? "bg-[#071028] text-white" : "bg-[#f5f5f7] text-slate-900"}`}>
      <Navbar />

      <main className="px-5 md:px-10 py-6">
        <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[#07112a] px-6 py-10 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:px-10 sm:py-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.16),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_25%)]" />
          <div className="pointer-events-none absolute left-[-120px] top-10 h-60 w-60 rounded-full bg-orange-500/10 blur-3xl" />
          <div className="pointer-events-none absolute right-[-100px] top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] items-center">
            <div className="space-y-8">
              <div className="max-w-3xl space-y-4">
                <p className="text-sm uppercase tracking-[0.35em] text-orange-300/90">Online Food Delivery</p>
                <h1 className="text-5xl font-black leading-tight tracking-[-0.04em] text-white md:text-6xl lg:text-7xl">
                  Delicious food delivered fast
                </h1>
                <p className="max-w-2xl text-lg text-slate-300 md:text-xl">
                  Discover top-rated restaurants, trending dishes and offers near you.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <button onClick={scrollToRestaurants} className="rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-xl shadow-orange-500/20 transition hover:-translate-y-0.5 hover:brightness-110">
                  Explore
                </button>
              </div>

              <div className="rounded-[32px] border border-white/10 bg-white/10 p-4 shadow-[0_30px_70px_rgba(15,23,42,0.28)] backdrop-blur-xl sm:p-6">
                <SearchBar
                  value={searchText}
                  onChange={(event) => {
                    setSearchText(event.target.value);
                    setShowSuggestions(true);
                  }}
                  onClear={handleSearchClear}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  suggestions={showSuggestions ? suggestions : []}
                  loading={loading}
                  noResults={normalizedText && suggestions.length === 0}
                  darkMode={darkMode}
                />
              </div>
            </div>

            <div className="relative mx-auto flex max-w-xl items-center justify-center">
              <div className="absolute inset-0 rounded-[40px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_55%)]" />
              <div className="relative overflow-hidden rounded-[40px] border border-white/10 shadow-[0_30px_80px_rgba(15,23,42,0.35)]">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
                  alt="Delicious food delivery"
                  className="h-[520px] w-full object-cover transition duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-orange-300/90">What&apos;s on your mind?</p>
              <h2 className="mt-3 text-4xl font-black text-white">Discover categories, flavors, and trending restaurants</h2>
            </div>
          </div>

          <MindCategoriesCarousel categories={restaurantCategories} selectedCategory={selectedCategory} onSelectCategory={handleCategorySelect} darkMode={darkMode} />
        </section>

        <section ref={restaurantsSectionRef} className="mt-16">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-orange-300/90">Top restaurants</p>
              <h3 className="mt-3 text-4xl font-black text-white">Top restaurants near you</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {['Top Rated', 'Fast Delivery', 'Near You', 'Offers'].map((tab) => (
                <button key={tab} className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10">
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4].map((skeleton) => (
                <div key={skeleton} className="animate-pulse rounded-[36px] bg-slate-900 p-8" />
              ))}
            </div>
          ) : filteredRestaurants.length === 0 ? (
            <div className="rounded-[34px] border border-white/10 bg-[#091126] p-16 text-center">
              <p className="text-3xl font-black text-white">No restaurants found</p>
              <p className="mt-3 text-slate-400">Try a different cuisine, category, or dish keyword.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
              {filteredRestaurants.map((restaurant) => {
                const key = restaurant.restaurant_name?.toString().trim().toLowerCase();
                const branchCount = brandBranchMap.get(key)?.size ?? 1;
                const tags = [restaurant.category, restaurant.cuisine].filter(Boolean).slice(0, 3);
                const imageUrl = restaurant.image_url || restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80";
                const offerText = restaurant.offer || restaurant.discount || "Special offers";

                return (
                  <Link
                    key={restaurant.id}
                    to={`/restaurant/${restaurant.id}`}
                    className="group overflow-hidden rounded-[36px] border border-white/10 bg-[#0d1830] shadow-[0_30px_90px_rgba(0,0,0,0.4)] transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <div className="relative h-80 overflow-hidden">
                      <img src={imageUrl} alt={restaurant.restaurant_name || restaurant.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-lg shadow-black/30">
                        {branchCount > 1 ? `${branchCount} branches` : "Single branch"}
                      </div>
                      <div className="absolute right-4 top-4 rounded-full bg-orange-500/95 px-3 py-2 text-xs font-bold text-white shadow-lg shadow-orange-500/20">{offerText}</div>
                    </div>
                    <div className="space-y-4 p-6">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h4 className="text-2xl font-black text-white">{restaurant.restaurant_name || restaurant.name || `Restaurant ${restaurant.id}`}</h4>
                          <p className="mt-2 text-sm text-slate-400">{restaurant.address || restaurant.category || restaurant.cuisine || "Popular choice"}</p>
                        </div>
                        <div className="rounded-full bg-slate-950/80 px-3 py-2 text-sm font-semibold text-emerald-300">⭐ {restaurant.rating || 4.5}</div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">{tag}</span>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                        <span className="rounded-full bg-white/5 px-3 py-2">20-30 mins</span>
                        <span className="rounded-full bg-white/5 px-3 py-2">Free delivery</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
