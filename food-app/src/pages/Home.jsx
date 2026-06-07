import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import MindCategoriesCarousel from "../components/MindCategoriesCarousel";

import { ThemeContext } from "../context/ThemeContext";

import {
  fetchRestaurants,
  fetchUniqueBrands,
} from "../services/api/restaurantService";

import {
  fetchMenuItems,
  fetchCategories,
} from "../services/api/menuService";

export default function Home() {

  const { darkMode } =
    useContext(ThemeContext);

  const restaurantsSectionRef =
    useRef(null);

  const [restaurants,
    setRestaurants] =
    useState([]);

  const [allRestaurants,
    setAllRestaurants] =
    useState([]);

  const [items,
    setItems] =
    useState([]);

  const [categories,
    setCategories] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [searchText,
    setSearchText] =
    useState("");

  const [debouncedSearch,
    setDebouncedSearch] =
    useState("");

  const [selectedCategory,
    setSelectedCategory] =
    useState("All");

  const [showSuggestions,
    setShowSuggestions] =
    useState(false);

  // SEARCH DEBOUNCE
  useEffect(() => {

    const timeout =
      setTimeout(() => {

        setDebouncedSearch(
          searchText
            .trim()
            .toLowerCase()
        );

      }, 300);

    return () =>
      clearTimeout(timeout);

  }, [searchText]);

  // LOAD DATA
  useEffect(() => {

    const loadData =
      async () => {

        try {

          setLoading(true);

          const [
            uniqueRestaurants,
            allRestaurantData,
            menuItems,
            categoryData,
          ] = await Promise.all([
            fetchUniqueBrands(),
            fetchRestaurants(),
            fetchMenuItems(),
            fetchCategories(),
          ]);

          setRestaurants(
            uniqueRestaurants || []
          );

          setAllRestaurants(
            allRestaurantData || []
          );

          setItems(
            menuItems || []
          );

          setCategories(
            categoryData || []
          );

        } catch (err) {

          console.error(
            "Error loading homepage:",
            err
          );

        } finally {

          setLoading(false);
        }
      };

    loadData();

  }, []);

  // CATEGORY LIST
  const restaurantCategories =
    useMemo(() => {

      const result = [
        {
          name: "All",
        },
      ];

      categories.forEach(
        (category) => {

          const categoryName =
            category.category_name
              ?.trim();

          if (!categoryName)
            return;

          result.push({
            name:
              categoryName,

            image:
              category.image_url ||
              category.icon_url ||
              "",
          });
        }
      );

      return result;

    }, [categories]);

  // BRANCH MAP
  const brandBranchMap =
    useMemo(() => {

      const map =
        new Map();

      allRestaurants.forEach(
        (restaurant) => {

          const key =
            restaurant.name
              ?.trim()
              .toLowerCase();

          if (!key)
            return;

          const existing =
            map.get(key) ||
            new Set();

          existing.add(
            restaurant.id
          );

          map.set(
            key,
            existing
          );
        }
      );

      return map;

    }, [allRestaurants]);

  // SEARCH FILTER
  const restaurantMatchesSearch =
    (restaurant) => {

      if (!debouncedSearch)
        return true;

      const fields = [
        restaurant.name,
        restaurant.category,
        restaurant.cuisine,
        restaurant.address,
        restaurant.description,
      ];

      const restaurantMatch =
        fields.some(
          (field) =>
            field
              ?.toString()
              .toLowerCase()
              .includes(
                debouncedSearch
              )
        );

      const branchIds =
        brandBranchMap.get(
          restaurant.name
            ?.trim()
            .toLowerCase()
        ) ||
        new Set([
          restaurant.id,
        ]);

      const itemMatch =
        items.some(
          (item) => {

            if (
              !branchIds.has(
                item.restaurant_id
              )
            )
              return false;

            return [
              item.name,
              item.category,
              item.description,
            ].some((field) =>
              field
                ?.toString()
                .toLowerCase()
                .includes(
                  debouncedSearch
                )
            );
          }
        );

      return (
        restaurantMatch ||
        itemMatch
      );
    };

  // CATEGORY FILTER
  const restaurantMatchesCategory =
    (restaurant) => {

      if (
        selectedCategory ===
          "All" ||
        !selectedCategory
      ) {

        return true;
      }

      const categoryMatch = [
        restaurant.category,
        restaurant.cuisine,
      ].some((field) =>
        field
          ?.toString()
          .toLowerCase()
          .includes(
            selectedCategory.toLowerCase()
          )
      );

      const branchIds =
        brandBranchMap.get(
          restaurant.name
            ?.trim()
            .toLowerCase()
        ) ||
        new Set([
          restaurant.id,
        ]);

      const itemCategoryMatch =
        items.some(
          (item) =>
            branchIds.has(
              item.restaurant_id
            ) &&
            item.category
              ?.toLowerCase()
              .includes(
                selectedCategory.toLowerCase()
              )
        );

      return (
        categoryMatch ||
        itemCategoryMatch
      );
    };

  // FINAL FILTERED LIST
  const filteredRestaurants =
    useMemo(() => {

      return restaurants.filter(
        (restaurant) =>
          restaurantMatchesSearch(
            restaurant
          ) &&
          restaurantMatchesCategory(
            restaurant
          )
      );

    }, [
      restaurants,
      items,
      debouncedSearch,
      selectedCategory,
      brandBranchMap,
    ]);

  // SEARCH SUGGESTIONS
  const suggestions =
    useMemo(() => {

      if (!debouncedSearch)
        return [];

      return filteredRestaurants.slice(
        0,
        6
      );

    }, [
      filteredRestaurants,
      debouncedSearch,
    ]);

  // CATEGORY CLICK
  const handleCategorySelect =
    (category) => {

      setSelectedCategory(
        category
      );

      setSearchText("");

      setShowSuggestions(
        false
      );
    };

  // SEARCH CLEAR
  const handleSearchClear =
    () => {

      setSearchText("");

      setShowSuggestions(
        false
      );
    };

  // SEARCH FOCUS
  const handleSearchFocus =
    () => {

      if (
        searchText.trim()
      ) {

        setShowSuggestions(
          true
        );
      }
    };

  // SEARCH BLUR
  const handleSearchBlur =
    () => {

      window.setTimeout(() => {

        setShowSuggestions(
          false
        );

      }, 150);
    };

  // SCROLL
  const scrollToRestaurants =
    () => {

      restaurantsSectionRef.current?.scrollIntoView(
        {
          behavior:
            "smooth",

          block:
            "start",
        }
      );
    };

  return (

    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-gradient-to-b from-[#020817] via-[#071028] to-[#020617] text-white"
          : "bg-gradient-to-b from-[#fff7ed] via-[#ffffff] to-[#fff1f2] text-slate-900"
      }`}
    >

      <Navbar />

      <main className="px-5 md:px-10 py-6">

        {/* HERO */}
        <section
          className={`relative overflow-hidden rounded-[40px] border px-6 py-10 shadow-[0_40px_120px_rgba(0,0,0,0.15)] sm:px-10 sm:py-14 ${
            darkMode
              ? "border-white/10 bg-[#07112a]"
              : "border-orange-100 bg-white"
          }`}
        >

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.16),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_25%)]" />

          <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] items-center">

            <div className="space-y-8">

              <div className="space-y-4">

                <p className="text-sm uppercase tracking-[0.35em] text-orange-500">

                  Online Food Delivery

                </p>

                <h1
                  className={`text-4xl md:text-6xl font-black leading-tight tracking-[-0.04em] ${
                    darkMode
                      ? "text-white"
                      : "text-slate-900"
                  }`}
                >

                  Delicious food delivered fast

                </h1>

                <p
                  className={`max-w-2xl text-base md:text-lg ${
                    darkMode
                      ? "text-slate-300"
                      : "text-slate-600"
                  }`}
                >

                  Discover top-rated restaurants,
                  trending dishes and exclusive
                  offers near you.

                </p>
              </div>

              <div className="flex flex-wrap gap-4">

                <button
                  onClick={
                    scrollToRestaurants
                  }
                  className="rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-xl transition hover:scale-[1.02]"
                >

                  Explore Restaurants

                </button>
              </div>

              {/* SEARCH */}
              <div
                className={`rounded-[32px] border p-4 backdrop-blur-xl sm:p-6 ${
                  darkMode
                    ? "border-white/10 bg-white/10"
                    : "border-orange-100 bg-orange-50/70"
                }`}
              >

                <SearchBar
                  value={
                    searchText
                  }
                  onChange={(
                    event
                  ) => {

                    setSearchText(
                      event.target.value
                    );

                    setShowSuggestions(
                      true
                    );
                  }}
                  onClear={
                    handleSearchClear
                  }
                  onFocus={
                    handleSearchFocus
                  }
                  onBlur={
                    handleSearchBlur
                  }
                  suggestions={
                    showSuggestions
                      ? suggestions
                      : []
                  }
                  loading={
                    loading
                  }
                  noResults={
                    debouncedSearch &&
                    suggestions.length ===
                      0
                  }
                  darkMode={
                    darkMode
                  }
                />
              </div>
            </div>

            {/* HERO IMAGE */}
            <div className="relative mx-auto flex max-w-xl items-center justify-center">

              <div
                className={`relative overflow-hidden rounded-[40px] border shadow-[0_30px_80px_rgba(15,23,42,0.15)] ${
                  darkMode
                    ? "border-white/10"
                    : "border-orange-100"
                }`}
              >

                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
                  alt="Food delivery"
                  className="h-[430px] w-full object-cover transition duration-700 hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="mt-20">

          <div className="mb-8">

            <p className="text-sm uppercase tracking-[0.35em] text-orange-500">

              Categories

            </p>

            <h2
              className={`mt-3 text-4xl font-black ${
                darkMode
                  ? "text-white"
                  : "text-slate-900"
              }`}
            >

              What&apos;s on your mind?

            </h2>
          </div>

          <MindCategoriesCarousel
            categories={
              restaurantCategories
            }
            selectedCategory={
              selectedCategory
            }
            onSelectCategory={
              handleCategorySelect
            }
            darkMode={
              darkMode
            }
          />
        </section>

        {/* RESTAURANTS */}
        <section
          ref={
            restaurantsSectionRef
          }
          className="mt-20"
        >

          <div className="mb-10">

            <p className="text-sm uppercase tracking-[0.35em] text-orange-500">

              Top restaurants

            </p>

            <h3
              className={`mt-3 text-4xl font-black ${
                darkMode
                  ? "text-white"
                  : "text-slate-900"
              }`}
            >

              Restaurants near you

            </h3>
          </div>

          {/* LOADING */}
          {loading ? (

            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3">

              {[1, 2, 3, 4].map(
                (
                  skeleton
                ) => (

                  <div
                    key={
                      skeleton
                    }
                    className={`animate-pulse rounded-[36px] p-8 h-[420px] ${
                      darkMode
                        ? "bg-slate-900"
                        : "bg-slate-200"
                    }`}
                  />
                )
              )}
            </div>

          ) : filteredRestaurants.length ===
            0 ? (

            <div
              className={`rounded-[34px] border p-16 text-center ${
                darkMode
                  ? "border-white/10 bg-[#091126]"
                  : "border-orange-100 bg-white"
              }`}
            >

              <p
                className={`text-3xl font-black ${
                  darkMode
                    ? "text-white"
                    : "text-slate-900"
                }`}
              >

                No restaurants found

              </p>

              <p
                className={`mt-3 ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >

                Try another search or category.

              </p>
            </div>

          ) : (

            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">

              {filteredRestaurants.map(
                (
                  restaurant
                ) => {

                  const key =
                    restaurant.name
                      ?.trim()
                      .toLowerCase();

                  const branchCount =
                    brandBranchMap.get(
                      key
                    )?.size || 1;

                  const imageUrl =
                    restaurant.image_url ||
                    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80";

                  return (

                    <Link
                      key={
                        restaurant.id
                      }
                      to={`/restaurant/${restaurant.id}`}
                      className={`group overflow-hidden rounded-[36px] border backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.15)] transition duration-300 hover:-translate-y-1 hover:scale-[1.015] hover:shadow-2xl ${
                        darkMode
                          ? "border-white/10 bg-[#0d1830]/95"
                          : "border-orange-100 bg-white"
                      }`}
                    >

                      <div className="relative h-80 overflow-hidden">

                        <img
                          src={
                            imageUrl
                          }
                          alt={
                            restaurant.name
                          }
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                        <div className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white">

                          {branchCount >
                          1
                            ? `${branchCount} branches`
                            : "Single branch"}

                        </div>
                      </div>

                      <div className="space-y-4 p-6">

                        <div className="flex items-center justify-between gap-3">

                          <div>

                            <h4
                              className={`text-2xl font-black ${
                                darkMode
                                  ? "text-white"
                                  : "text-slate-900"
                              }`}
                            >

                              {
                                restaurant.name
                              }

                            </h4>

                            <p
                              className={`mt-2 text-sm ${
                                darkMode
                                  ? "text-slate-400"
                                  : "text-slate-500"
                              }`}
                            >

                              {
                                restaurant.address
                              }

                            </p>
                          </div>

                          <div className="rounded-full bg-emerald-500 px-3 py-2 text-sm font-semibold text-white">

                            ⭐{" "}
                            {restaurant.rating ||
                              4.5}

                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">

                          {[
                            restaurant.category,
                            restaurant.cuisine,
                          ]
                            .filter(
                              Boolean
                            )
                            .map(
                              (
                                tag
                              ) => (

                                <span
                                  key={
                                    tag
                                  }
                                  className={`rounded-full border px-3 py-2 text-sm ${
                                    darkMode
                                      ? "border-white/10 bg-white/5 text-slate-200"
                                      : "border-orange-100 bg-orange-50 text-slate-700"
                                  }`}
                                >

                                  {tag}

                                </span>
                              )
                            )}
                        </div>

                        <div
                          className={`flex items-center justify-between text-sm ${
                            darkMode
                              ? "text-slate-300"
                              : "text-slate-600"
                          }`}
                        >

                          <div
                            className={`rounded-full px-3 py-2 ${
                              darkMode
                                ? "bg-white/5"
                                : "bg-orange-50"
                            }`}
                          >

                            🚚{" "}
                            {
                              restaurant.delivery_time
                            }

                          </div>

                          <div
                            className={`rounded-full px-3 py-2 ${
                              darkMode
                                ? "bg-white/5"
                                : "bg-orange-50"
                            }`}
                          >

                            💸{" "}
                            {
                              restaurant.delivery_fee
                            }

                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                }
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}