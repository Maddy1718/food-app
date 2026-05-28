import {
  Link,
} from "react-router-dom";

import {
  Star,
  Clock3,
  Bike,
} from "lucide-react";

function RestaurantCard({
  restaurant,
}) {

  const fallbackImage =
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop";

  return (

    <Link
      to={`/restaurant/${restaurant.id}`}
      style={{
        textDecoration:
          "none",

        color:
          "inherit",
      }}
    >

      <div
        className="group overflow-hidden rounded-[30px] bg-white shadow-[0_4px_25px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
      >

        {/* IMAGE */}
        <div className="relative overflow-hidden">

          <img
            src={
              restaurant.image ||
              fallbackImage
            }

            alt={restaurant.name}

            onError={(e) => {
              e.target.src =
                fallbackImage;
            }}

            className="h-[260px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* RATING */}
          <div className="absolute right-4 top-4">

            <div className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 shadow-xl backdrop-blur-xl">

              <Star
                size={16}
                className="fill-yellow-400 text-yellow-400"
              />

              <span className="text-sm font-black text-slate-800">

                {restaurant.rating || 4.5}

              </span>
            </div>
          </div>

          {/* DELIVERY TIME */}
          <div className="absolute bottom-4 left-4">

            <div className="flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-white backdrop-blur-xl">

              <Clock3 size={16} />

              <span className="text-sm font-bold">

                {restaurant.delivery_time ||
                  "25-30 mins"}

              </span>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6">

          {/* TITLE */}
          <div className="flex items-start justify-between gap-4">

            <div>

              <h2 className="text-2xl font-black tracking-tight text-slate-900">

                {restaurant.name}

              </h2>

              <p className="mt-2 text-sm font-medium text-slate-500">

                {restaurant.cuisine ||
                  "Multi Cuisine"}

              </p>
            </div>

            {/* STATUS */}
            <div
              className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.15em] ${
                restaurant.is_open
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >

              {restaurant.is_open
                ? "Open"
                : "Closed"}

            </div>
          </div>

          {/* DESCRIPTION */}
          <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-500">

            {restaurant.description ||
              "Freshly prepared premium food with rich taste and high-quality ingredients."}

          </p>

          {/* BOTTOM */}
          <div className="mt-6 flex items-center justify-between">

            {/* DELIVERY */}
            <div className="flex items-center gap-2 text-slate-500">

              <Bike size={18} />

              <span className="text-sm font-semibold">

                Free Delivery

              </span>
            </div>

            {/* CTA */}
            <div className="rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-5 py-2 text-sm font-black text-white shadow-lg transition-all duration-300 group-hover:scale-105">

              View Menu

            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default RestaurantCard;