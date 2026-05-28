import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useParams } from "react-router-dom";

import {
  Star,
  MapPin,
  Clock3,
  Bike,
} from "lucide-react";

import Navbar from "../components/Navbar";
import MenuItemCard from "../components/MenuItemCard";

import { CartContext } from "../context/CartContext";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

import { supabase }
  from "../services/supabase";

import {
  fetchRestaurantById,
  fetchBranchesByName,
} from "../services/api/restaurantService";

import {
  fetchMenuItemsByRestaurant,
} from "../services/api/menuService";

import {
  fetchReviewsByRestaurant,
  addReview,
} from "../services/api/reviewService";

export default function RestaurantDetails() {

  const { id } =
    useParams();

  const restaurantId =
    Number(id);

  const {
    addToCart,
    cartItems,
    increaseQuantity,
    decreaseQuantity,
  } = useContext(CartContext);

  const { darkMode } =
    useContext(ThemeContext);

  const { user } =
    useContext(AuthContext);

  const [restaurant,
    setRestaurant] =
    useState(null);

  const [branches,
    setBranches] =
    useState([]);

  const [
    selectedBranch,
    setSelectedBranch,
  ] = useState(null);

  const [menuItems,
    setMenuItems] =
    useState([]);

  const [reviews,
    setReviews] =
    useState([]);

  const [reviewText,
    setReviewText] =
    useState("");

  const [reviewRating,
    setReviewRating] =
    useState(5);

  const [submittingReview,
    setSubmittingReview] =
    useState(false);

  const [loading,
    setLoading] =
    useState(true);

  const [activeCategory,
    setActiveCategory] =
    useState("");

  const sectionRefs =
    useRef({});

  // LOAD DATA
  useEffect(() => {

    const loadRestaurant =
      async () => {

        try {

          setLoading(true);

          const restaurantData =
            await fetchRestaurantById(
              restaurantId
            );

          if (!restaurantData) {

            setRestaurant(
              null
            );

            return;
          }

          setRestaurant(
            restaurantData
          );

          const branchData =
            await fetchBranchesByName(
              restaurantData.name
            );

          setBranches(
            branchData || []
          );

          const currentBranch =
            branchData?.find(
              (branch) =>
                branch.id ===
                restaurantId
            ) ||
            branchData?.[0] ||
            restaurantData;

          setSelectedBranch(
            currentBranch
          );

          const menu =
            await fetchMenuItemsByRestaurant(
              restaurantId
            );

          setMenuItems(
            menu || []
          );

          const reviewData =
            await fetchReviewsByRestaurant(
              restaurantId
            );

          setReviews(
            reviewData || []
          );

        } catch (err) {

          console.error(
            "Restaurant load error:",
            err
          );

        } finally {

          setLoading(
            false
          );
        }
      };

    loadRestaurant();

  }, [restaurantId]);

  // GROUP ITEMS
  const groupedItems =
    useMemo(() => {

      const groups =
        {};

      menuItems.forEach(
        (item) => {

          const category =
            item.category ||
            "Main Course";

          if (
            !groups[
              category
            ]
          ) {

            groups[
              category
            ] = [];
          }

          groups[
            category
          ].push(item);
        }
      );

      return groups;

    }, [menuItems]);

  // CATEGORIES
  const categories =
    useMemo(() => {

      return Object.keys(
        groupedItems
      );

    }, [groupedItems]);

  // INITIAL CATEGORY
  useEffect(() => {

    if (
      categories.length &&
      !activeCategory
    ) {

      setActiveCategory(
        categories[0]
      );
    }

  }, [
    categories,
    activeCategory,
  ]);

  // CATEGORY CLICK
  const handleCategoryClick =
    (
      category
    ) => {

      setActiveCategory(
        category
      );

      const section =
        sectionRefs.current[
          category
        ];

      if (
        section
      ) {

        section.scrollIntoView(
          {
            behavior:
              "smooth",

            block:
              "start",
          }
        );
      }
    };

  // SUBMIT REVIEW
  const handleReviewSubmit =
    async () => {

      try {

        if (!user) {

          alert(
            "Please login to review"
          );

          return;
        }

        if (
          !reviewText.trim()
        ) {

          alert(
            "Please write a review"
          );

          return;
        }

        setSubmittingReview(
          true
        );

        // GET CUSTOMER
        const {
          data: customer,
          error: customerError,
        } = await supabase

          .from("customer")

          .select("id")

          .eq(
            "auth_id",
            user.id
          )

          .single();

        if (
          customerError ||
          !customer
        ) {

          alert(
            "Customer not found"
          );

          return;
        }

        // GET ALL ORDERS
        const {
          data: orders,
          error: orderError,
        } = await supabase

          .from("placed_order")

          .select("id")

          .eq(
            "customer_id",
            customer.id
          )

          .eq(
            "restaurant_id",
            restaurantId
          );

        if (
          orderError ||
          !orders ||
          orders.length === 0
        ) {

          alert(
            "You can only review restaurants you ordered from"
          );

          return;
        }

        // FIND ORDER WITHOUT REVIEW
        let availableOrder =
          null;

        for (const order of orders) {

          const {
            data:
              existingReview,
          } = await supabase

            .from(
              "reviews"
            )

            .select("id")

            .eq(
              "placed_order_id",
              order.id
            )

            .maybeSingle();

          if (
            !existingReview
          ) {

            availableOrder =
              order;

            break;
          }
        }

        if (
          !availableOrder
        ) {

          alert(
            "You already reviewed all your orders for this restaurant"
          );

          return;
        }

        // ADD REVIEW
        const newReview =
          await addReview({

            customer_id:
              customer.id,

            restaurant_id:
              restaurantId,

            placed_order_id:
              availableOrder.id,

            rating:
              reviewRating,

            review_text:
              reviewText,
          });

        if (!newReview) {

          alert(
            "Failed to submit review"
          );

          return;
        }

        // REFRESH REVIEWS
        const updatedReviews =
          await fetchReviewsByRestaurant(
            restaurantId
          );

        setReviews(
          updatedReviews || []
        );

        setReviewText("");

        setReviewRating(
          5
        );

        alert(
          "Review submitted successfully"
        );

      } catch (err) {

        console.error(
          "Review submit error:",
          err
        );

      } finally {

        setSubmittingReview(
          false
        );
      }
    };

  // HERO IMAGE
  const heroImage =
    selectedBranch?.image_url ||
    restaurant?.image_url ||
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80";

  // LOADING
  if (loading) {

    return (

      <div
        className={`min-h-screen ${
          darkMode
            ? "bg-[#020817]"
            : "bg-white"
        }`}
      >

        <Navbar />

      </div>
    );
  }

  // NOT FOUND
  if (!restaurant) {

    return (

      <div
        className={`min-h-screen ${
          darkMode
            ? "bg-[#020817] text-white"
            : "bg-white text-black"
        }`}
      >

        <Navbar />

        <div className="pt-40 text-center">

          <h2 className="text-4xl font-black">
            Restaurant Not Found
          </h2>
        </div>
      </div>
    );
  }

  return (

    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-gradient-to-b from-[#020817] via-[#071028] to-[#020617] text-white"
          : "bg-gradient-to-b from-[#fff7ed] via-[#ffffff] to-[#fff1f2] text-slate-900"
      }`}
    >

      <Navbar />

      <div className="max-w-[1300px] mx-auto px-5 md:px-8 py-6">

        {/* HERO */}
        <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[#0b1220]/70 backdrop-blur-xl shadow-2xl">

          <div className="relative h-[320px] md:h-[380px]">

            <img
              src={
                heroImage
              }
              alt={
                selectedBranch?.name
              }
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#071028] via-[#071028]/50 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">

              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">

                <div>

                  <h1 className="text-5xl font-black text-white">

                    {
                      selectedBranch?.name
                    }

                  </h1>

                  <div className="mt-5 flex flex-wrap gap-4 text-sm">

                    {/* DELIVERY */}
                    <div className="rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-white backdrop-blur-xl">

                      <p className="text-slate-400">
                        Delivery
                      </p>

                      <div className="mt-1 flex items-center gap-2 font-bold">

                        <Clock3 size={18} />

                        20-30 mins

                      </div>
                    </div>

                    {/* DELIVERY FEE */}
                    <div className="rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-white backdrop-blur-xl">

                      <p className="text-slate-400">
                        Delivery Fee
                      </p>

                      <div className="mt-1 flex items-center gap-2 font-bold">

                        <Bike size={18} />

                        Free

                      </div>
                    </div>

                    {/* CUISINE */}
                    <div className="rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-white backdrop-blur-xl">

                      <p className="text-slate-400">
                        Cuisine
                      </p>

                      <div className="mt-1 font-bold">

                        {
                          selectedBranch?.category ||
                          "South Indian"
                        }

                      </div>
                    </div>

                    {/* ADDRESS */}
                    <div className="rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-white backdrop-blur-xl">

                      <p className="text-slate-400">
                        Address
                      </p>

                      <div className="mt-1 flex items-center gap-2 font-bold">

                        <MapPin size={18} />

                        {
                          selectedBranch?.address
                        }

                      </div>
                    </div>
                  </div>
                </div>

                {/* RATING */}
                <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl px-6 py-5 shadow-xl">

                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Rating
                  </p>

                  <div className="mt-3 flex items-center gap-3">

                    <Star
                      size={24}
                      className="fill-yellow-400 text-yellow-400"
                    />

                    <span className="text-3xl font-black text-orange-400">

                      {
                        selectedBranch?.rating ||
                        4.5
                      }

                    </span>

                    <span className="text-slate-300">

                      (
                      {
                        reviews.length
                      }{" "}
                      reviews
                      )

                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BRANCHES */}
        <section className="mt-14">

          <h2 className="text-3xl font-black">

            Available Branches

          </h2>

          <p className="mt-2 text-slate-400">

            Choose your nearby branch

          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            {branches.map(
              (
                branch
              ) => (

                <button
                  key={
                    branch.id
                  }
                  onClick={() =>
                    setSelectedBranch(
                      branch
                    )
                  }
                  className={`rounded-[28px] border p-6 text-left transition-all ${
                    selectedBranch?.id ===
                    branch.id
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-white/10 bg-[#0b1220]/60"
                  }`}
                >

                  <h3 className="text-2xl font-black text-white">

                    {
                      branch.name
                    }

                  </h3>

                  <p className="mt-3 text-slate-400">

                    {
                      branch.address
                    }

                  </p>
                </button>
              )
            )}
          </div>
        </section>

        {/* CATEGORY TABS */}
        <section className="sticky top-0 z-30 mt-16 border-y border-white/10 bg-[#020817]/90 backdrop-blur-xl">

          <div className="flex gap-5 overflow-x-auto py-5">

            {categories.map(
              (
                category
              ) => (

                <button
                  key={
                    category
                  }
                  onClick={() =>
                    handleCategoryClick(
                      category
                    )
                  }
                  className={`whitespace-nowrap rounded-full px-6 py-3 text-sm font-bold transition-all ${
                    activeCategory ===
                    category
                      ? "bg-orange-500 text-white"
                      : "bg-white/5 text-slate-300"
                  }`}
                >

                  {
                    category
                  }

                </button>
              )
            )}
          </div>
        </section>

        {/* MENU */}
        <div className="mt-14 space-y-16">

          {categories.map(
            (
              category
            ) => (

              <section
                key={
                  category
                }
                ref={(el) => {
                  sectionRefs.current[
                    category
                  ] = el;
                }}
              >

                <h2 className="mb-7 text-3xl font-black">

                  {
                    category
                  }

                </h2>

                <div className="space-y-5">

                  {groupedItems[
                    category
                  ]?.map(
                    (
                      item
                    ) => {

                      const cartItem =
                        cartItems.find(
                          (
                            product
                          ) =>
                            product.id ===
                            item.id
                        );

                      return (

                        <MenuItemCard
                          key={
                            item.id
                          }
                          item={
                            item
                          }
                          quantity={
                            cartItem?.quantity ||
                            0
                          }
                          onAdd={() =>
                            addToCart(
                              item
                            )
                          }
                          onIncrease={() =>
                            increaseQuantity(
                              item.id
                            )
                          }
                          onDecrease={() =>
                            decreaseQuantity(
                              item.id
                            )
                          }
                          darkMode={
                            darkMode
                          }
                        />
                      );
                    }
                  )}
                </div>
              </section>
            )
          )}
        </div>

        {/* REVIEWS */}
        <section className="mt-20">

          <div className="mb-8">

            <h2 className="text-4xl font-black text-white">

              Customer Reviews

            </h2>

            <p className="mt-2 text-slate-400">

              Real reviews from customers

            </p>
          </div>

          {/* ADD REVIEW */}
          <div className="rounded-[32px] border border-white/10 bg-[#0b1220]/80 p-6 backdrop-blur-xl">

            <h3 className="text-2xl font-black text-white">

              Write a Review

            </h3>

            {/* STARS */}
            <div className="mt-5 flex gap-3">

              {[1, 2, 3, 4, 5].map(
                (
                  star
                ) => (

                  <button
                    key={
                      star
                    }
                    onClick={() =>
                      setReviewRating(
                        star
                      )
                    }
                    className={`text-4xl transition ${
                      reviewRating >=
                      star
                        ? "text-yellow-400"
                        : "text-slate-600"
                    }`}
                  >

                    ★

                  </button>
                )
              )}
            </div>

            {/* TEXTAREA */}
            <textarea
              value={
                reviewText
              }
              onChange={(
                e
              ) =>
                setReviewText(
                  e.target
                    .value
                )
              }
              placeholder="Write your experience..."
              className="mt-6 h-36 w-full rounded-3xl border border-white/10 bg-white/5 p-5 text-white outline-none"
            />

            {/* SUBMIT */}
            <button
              onClick={
                handleReviewSubmit
              }
              disabled={
                submittingReview
              }
              className="mt-5 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 px-8 py-4 font-black text-white shadow-xl"
            >

              {submittingReview
                ? "Submitting..."
                : "Submit Review"}

            </button>
          </div>

          {/* REVIEW LIST */}
          <div className="mt-10 space-y-5">

            {reviews.length ===
            0 ? (

              <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-slate-400">

                No reviews yet

              </div>

            ) : (

              reviews.map(
                (
                  review
                ) => (

                  <div
                    key={
                      review.id
                    }
                    className="rounded-[28px] border border-white/10 bg-[#0b1220]/70 p-6 backdrop-blur-xl"
                  >

                    <div className="flex items-center justify-between">

                      <div>

                        <h4 className="text-lg font-black text-white">

                          {review.customer
                            ?.customer_name ||
                            "Customer"}

                        </h4>

                        <p className="mt-2 text-yellow-400">

                          {"★".repeat(
                            review.rating
                          )}

                        </p>
                      </div>

                      <p className="text-sm text-slate-400">

                        {new Date(
                          review.created_at
                        ).toLocaleDateString()}

                      </p>
                    </div>

                    <p className="mt-5 leading-relaxed text-slate-300">

                      {
                        review.review_text
                      }

                    </p>
                  </div>
                )
              )
            )}
          </div>
        </section>
      </div>
    </div>
  );
}