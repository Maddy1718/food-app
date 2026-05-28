import {
  Minus,
  Plus,
  Leaf,
} from "lucide-react";

export default function MenuItemCard({

  item,

  quantity,

  onAdd,

  onIncrease,

  onDecrease,

  darkMode,
}) {

  // FOOD TYPE
  const foodType =

    item.food_type
      ?.trim()
      ?.toUpperCase();

  const isVeg =
    foodType === "VEG";

  const isNonVeg =
    foodType === "NON VEG";

  // AVAILABILITY
  const isUnavailable =

    item.stock_status
      ?.trim()
      ?.toLowerCase()
      .includes("out");

  return (

    <div
      className={`group overflow-hidden rounded-[32px] border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)] ${
        darkMode
          ? "border-white/10 bg-white/5 hover:bg-white/[0.07]"
          : "border-slate-200 bg-white hover:shadow-2xl"
      } ${
        isUnavailable
          ? "opacity-75"
          : ""
      }`}
    >

      <div className="flex flex-col md:flex-row">

        {/* LEFT */}
        <div className="flex-1 p-6 md:p-7">

          {/* FOOD TYPE */}
          <div className="mb-4 flex items-center gap-3">

            <div
              className={`flex h-6 w-6 items-center justify-center rounded-md border ${
                isVeg
                  ? "border-green-500"
                  : isNonVeg
                  ? "border-red-500"
                  : "border-slate-400"
              }`}
            >

              <div
                className={`h-3 w-3 rounded-full ${
                  isVeg
                    ? "bg-green-500"
                    : isNonVeg
                    ? "bg-red-500"
                    : "bg-slate-400"
                }`}
              />
            </div>

            <span
              className={`text-xs font-bold uppercase tracking-[0.25em] ${
                isVeg
                  ? "text-green-400"
                  : isNonVeg
                  ? "text-red-400"
                  : "text-slate-400"
              }`}
            >

              {isVeg
                ? "Veg"
                : isNonVeg
                ? "Non Veg"
                : "Food"}

            </span>

            {isVeg && (

              <Leaf
                size={14}
                className="text-green-400"
              />
            )}
          </div>

          {/* TITLE */}
          <h3
            className={`text-2xl font-black tracking-tight ${
              darkMode
                ? "text-white"
                : "text-slate-900"
            }`}
          >

            {item.item_name}

          </h3>

          {/* DESCRIPTION */}
          <p
            className={`mt-3 max-w-2xl text-sm leading-relaxed ${
              darkMode
                ? "text-slate-300"
                : "text-slate-500"
            }`}
          >

            {item.description ||
              "Freshly prepared delicious food made with premium ingredients."}

          </p>

          {/* INGREDIENTS */}
          {item.ingredients && (

            <div className="mt-4 flex flex-wrap gap-2">

              {item.ingredients
                .split(",")
                .slice(0, 4)
                .map(
                  (
                    ingredient,
                    idx
                  ) => (

                    <span
                      key={idx}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        darkMode
                          ? "bg-white/10 text-slate-300"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >

                      {
                        ingredient.trim()
                      }

                    </span>
                  )
                )}
            </div>
          )}

          {/* PRICE + ACTION */}
          <div className="mt-6 flex items-center justify-between">

            <div>

              <p
                className={`text-xs uppercase tracking-[0.2em] ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >

                Price

              </p>

              <h4 className="mt-1 text-3xl font-black text-orange-500">

                ₹ {item.price}

              </h4>
            </div>

            {/* BUTTONS */}
            {isUnavailable ? (

              <button
                disabled
                className="cursor-not-allowed rounded-2xl bg-slate-500/40 px-7 py-4 text-sm font-black uppercase tracking-[0.2em] text-slate-300"
              >

                Unavailable

              </button>

            ) : quantity > 0 ? (

              <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-3 shadow-xl">

                <button
                  onClick={
                    onDecrease
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white transition hover:bg-white/30"
                >

                  <Minus size={18} />

                </button>

                <span className="min-w-[24px] text-center text-lg font-black text-white">

                  {quantity}

                </span>

                <button
                  onClick={
                    onIncrease
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white transition hover:bg-white/30"
                >

                  <Plus size={18} />

                </button>
              </div>

            ) : (

              <button
                onClick={onAdd}
                className="rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 px-7 py-4 text-sm font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_40px_rgba(255,115,0,0.35)]"
              >

                Add

              </button>
            )}
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative md:w-[320px]">

          <img
            src={
              item.image_url ||
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
            }
            alt={item.item_name}
            className="h-[260px] w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-full"
          />

          {/* IMAGE OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {/* STOCK STATUS */}
          <div className="absolute right-4 top-4">

            <div
              className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.2em] backdrop-blur-xl ${
                isUnavailable
                  ? "bg-red-500/90 text-white"
                  : "bg-green-500/90 text-white"
              }`}
            >

              {isUnavailable
                ? "Unavailable"
                : "Available"}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}