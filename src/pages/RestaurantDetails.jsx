import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

import Navbar from "../components/Navbar";
import MenuItemCard from "../components/MenuItemCard";
import CategorySidebar from "../components/CategorySidebar";

import { CartContext } from "../context/CartContext";
import { ThemeContext } from "../context/ThemeContext";

import { fetchRestaurantById, fetchBranchesByName } from "../services/api/restaurantService";
import { fetchMenuItemsByRestaurant, fetchMenuItemsByRestaurantName } from "../services/api/menuService";

export default function RestaurantDetails() {
  const { id } = useParams();
  const restaurantId = Number(id);

  const { addToCart, cartItems, increaseQuantity, decreaseQuantity } = useContext(CartContext);
  const { darkMode } = useContext(ThemeContext);

  const [restaurant, setRestaurant] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  const sectionRefs = useRef({});

  useEffect(() => {
    const loadRestaurant = async () => {
      if (!restaurantId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const restaurantData = await fetchRestaurantById(restaurantId);
        if (!restaurantData) {
          setRestaurant(null);
          setBranches([]);
          setSelectedBranch(null);
          setMenuItems([]);
          return;
        }

        const restaurantName = restaurantData.restaurant_name || restaurantData.name;
        const branchData = await fetchBranchesByName(restaurantName);
        setBranches(branchData || []);

        const currentBranch = branchData.find((branch) => branch.id === restaurantId) || branchData[0] || restaurantData;
        setSelectedBranch(currentBranch);
        setRestaurant(restaurantData);

        const itemsById = await fetchMenuItemsByRestaurant(restaurantId);
        const finalMenuItems = itemsById.length ? itemsById : await fetchMenuItemsByRestaurantName(restaurantName);
        console.log("Fetched menu items:", finalMenuItems);
        console.log("Items count:", finalMenuItems?.length || 0);
        setMenuItems(finalMenuItems || []);
      } catch (error) {
        console.error("Error loading restaurant details:", error);
        setRestaurant(null);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurant();
  }, [restaurantId]);

  useEffect(() => {
    const onScroll = () => {
      setShowStickyHeader(window.scrollY > 300);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const groupedItems = useMemo(() => {
    const groups = {};
    
    console.log("Total items to group:", menuItems.length);
    
    menuItems.forEach((item) => {
      // Try item.category first, then cuisine, then fallback to "Uncategorized"
      let category = item.category?.toString().trim() || item.cuisine?.toString().trim() || "Uncategorized";
      
      console.log(`Item: ${item.name || item.item_name}, Category: ${category}`);
      
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
    });
    
    console.log("Grouped items by category:", groups);
    console.log("Categories found:", Object.keys(groups));
    return groups;
  }, [menuItems]);

  const categories = useMemo(() => {
    const cats = Object.keys(groupedItems).sort();
    console.log("Extracted categories:", cats);
    console.log("Categories count:", cats.length);
    return cats;
  }, [groupedItems]);

  useEffect(() => {
    if (categories.length && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  useEffect(() => {
    if (!categories.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.dataset.category);
          }
        });
      },
      { rootMargin: "-50% 0px -45% 0px", threshold: 0.4 }
    );

    categories.forEach((category) => {
      const element = sectionRefs.current[category];
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [categories]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    const ref = sectionRefs.current[category];
    if (ref) {
      ref.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const heroImage = selectedBranch?.image_url || selectedBranch?.image || restaurant?.image_url || restaurant?.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80";

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? "bg-[#0f172a] text-white" : "bg-[#f5f7fb] text-black"}`}>
        <Navbar />
        <div className="max-w-[1400px] mx-auto px-6 py-10">
          <div className="space-y-6">
            <div className="h-72 animate-pulse rounded-[40px] bg-slate-800" />
            <div className="h-20 animate-pulse rounded-[30px] bg-slate-800" />
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
              <div className="h-[calc(100vh-18rem)] animate-pulse rounded-[32px] bg-slate-800" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-40 animate-pulse rounded-[32px] bg-slate-800" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className={`min-h-screen ${darkMode ? "bg-[#0f172a] text-white" : "bg-[#f5f7fb] text-black"}`}>
        <Navbar />
        <div className="pt-40 text-center px-6">
          <h2 className="text-4xl font-black mb-4">Restaurant Not Found</h2>
          <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            The restaurant you&apos;re looking for could not be found.
          </p>
        </div>
      </div>
    );
  }

  const statusTag = selectedBranch?.status || selectedBranch?.open_status || "Open now";
  const deliveryTime = selectedBranch?.delivery_time || restaurant?.delivery_time || "20-30 mins";
  const rating = selectedBranch?.rating || restaurant?.rating || 4.6;
  const branchCount = branches.length || 1;
  const offerTag = selectedBranch?.offer || selectedBranch?.discount || "Exclusive deals available";
  const address = selectedBranch?.address || restaurant?.address || selectedBranch?.location || "Delivery area";
  const fee = selectedBranch?.delivery_fee || restaurant?.delivery_fee || "Free";

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? "bg-[#071028] text-white" : "bg-[#f5f7fb] text-slate-900"}`}>
      <Navbar />

      {showStickyHeader && (
        <div className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#070e1f]/95 backdrop-blur-xl px-6 py-3 shadow-2xl shadow-black/20">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-3xl bg-gradient-to-br from-orange-500 to-pink-500 text-lg font-black text-white shadow-lg shadow-orange-500/20">R</div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Now viewing</p>
                <h2 className="text-lg font-black text-white">{selectedBranch?.restaurant_name || selectedBranch?.name || restaurant?.restaurant_name || restaurant?.name}</h2>
              </div>
            </div>
            <div className="inline-flex items-center gap-3 rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 shadow-lg shadow-black/20">
              <ShoppingCart size={16} />
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-6 pt-6 pb-20 md:px-10">
        {/* Restaurant Header */}
        <section className="rounded-2xl overflow-hidden bg-[#0c1325] shadow-lg mb-8">
          <div className="relative h-[240px] overflow-hidden">
            <img src={heroImage} alt={selectedBranch?.restaurant_name || selectedBranch?.name || restaurant?.restaurant_name || restaurant?.name} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c1325]/95 via-[#0c1325]/40 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
              <div className="flex items-end justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-black text-white">{selectedBranch?.restaurant_name || selectedBranch?.name || restaurant?.restaurant_name || restaurant?.name}</h1>
                  <p className="mt-2 text-sm text-slate-300">{selectedBranch?.description || restaurant?.description || "Order fresh food with fast delivery"}</p>
                </div>
                <div className="rounded-2xl bg-white/10 backdrop-blur px-4 py-3 min-w-max">
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Rating</p>
                  <p className="mt-1 text-xl font-black text-orange-300">{rating}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Restaurant Info Grid - Compact */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-5 md:p-6 border-t border-white/10">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide">Delivery</p>
              <p className="mt-1 text-sm font-bold text-white">{deliveryTime}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide">Fee</p>
              <p className="mt-1 text-sm font-bold text-white">{fee}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide">Status</p>
              <p className="mt-1 text-sm font-bold text-white">{statusTag}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide">Branches</p>
              <p className="mt-1 text-sm font-bold text-white">{branchCount}</p>
            </div>
          </div>
        </section>

        {/* Branch Selector - Compact */}
        {branches.length > 1 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-3">Select Branch</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {branches.map((branch) => {
                const active = selectedBranch?.id === branch.id;
                return (
                  <button
                    key={branch.id}
                    type="button"
                    onClick={() => setSelectedBranch(branch)}
                    className={`rounded-xl border p-3 text-left transition text-sm ${
                      active
                        ? "border-orange-500 bg-orange-500/15 text-white"
                        : "border-white/10 bg-[#0d1728] text-slate-200 hover:bg-white/5"
                    }`}
                  >
                    <p className="font-semibold">{branch.restaurant_name || branch.name || `Branch ${branch.id}`}</p>
                    <p className="mt-1 text-xs text-slate-400">{branch.address || "Location"}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Menu Section */}
        <section>
          {/* Category Navigation - Compact */}
          {categories.length > 0 && (
            <div className="mb-6 sticky top-16 z-20 bg-[#071028]/95 backdrop-blur-sm -mx-6 md:-mx-10 px-6 md:px-10 py-3 border-b border-white/10">
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {categories.map((category) => {
                  const active = activeCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleCategoryClick(category)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
                        active
                          ? "bg-orange-500 text-white shadow-lg"
                          : "bg-white/10 text-slate-200 hover:bg-white/20"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Menu Items by Category */}
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category} data-category={category} ref={(el) => { sectionRefs.current[category] = el; }} className="scroll-mt-32 mb-10">
                <h3 className="text-lg font-bold text-white mb-4 sticky top-40 bg-[#071028] py-2 z-10">{category}</h3>
                <div className="space-y-4">
                  {groupedItems[category].map((item) => {
                    const cartItem = cartItems.find((product) => product.id === item.id);
                    return (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        quantity={cartItem?.quantity || 0}
                        onAdd={() => addToCart(item)}
                        onIncrease={() => increaseQuantity(item.id)}
                        onDecrease={() => decreaseQuantity(item.id)}
                        darkMode={darkMode}
                      />
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-white/10 bg-[#0c1325] p-10 text-center text-slate-400">
              <p className="font-bold text-white">No menu items found</p>
              <p className="mt-2 text-sm">This restaurant has no items available.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
