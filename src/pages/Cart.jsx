import {
  useContext,
  useMemo,
  useState,
} from "react";

import Navbar from "../components/Navbar";

import {
  CartContext,
} from "../context/CartContext";

import {
  AuthContext,
} from "../context/AuthContext";

import {
  ThemeContext,
} from "../context/ThemeContext";

import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
} from "lucide-react";

import {
  createOrder,
} from "../services/api/orderService";

export default function Cart() {

  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useContext(CartContext);

  const { user } =
    useContext(AuthContext);

  const { darkMode } =
    useContext(ThemeContext);

  const [loading, setLoading] =
    useState(false);

  // SUBTOTAL
  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum +
          Number(item.price) *
            item.quantity,
        0
      ),
    [cartItems]
  );

  // EXTRA FEES
  const deliveryFee =
    subtotal > 0 ? 40 : 0;

  const platformFee = 5;

  const gstAmount =
    subtotal * 0.05;

  const packingCharge = 10;

  // FINAL TOTAL
  const totalPrice =
    subtotal +
    deliveryFee +
    platformFee +
    gstAmount +
    packingCharge;

  // CHECKOUT
  const handleCheckout =
    async () => {

      try {

        if (!user) {

          alert(
            "Please login first"
          );

          return;
        }

        if (
          !cartItems.length
        ) {

          alert(
            "Cart is empty"
          );

          return;
        }

        setLoading(true);

        const result =
          await createOrder({
            user,
            cartItems,
          });

        if (result) {

          clearCart();

          alert(
            "Order placed successfully!"
          );

        } else {

          alert(
            "Failed to place order"
          );
        }

      } catch (err) {

        console.error(
          "Checkout error:",
          err
        );

        alert(
          "Something went wrong"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-[#071028] text-white"
          : "bg-[#f5f7fb] text-slate-900"
      }`}
    >

      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-5xl font-black">
            Your Cart
          </h1>

          <p className="mt-3 text-slate-400">
            Review your order before checkout.
          </p>
        </div>

        {/* EMPTY CART */}
        {!cartItems.length ? (

          <div className="rounded-[36px] border border-white/10 bg-[#0d1728] p-16 text-center">

            <ShoppingBag
              size={72}
              className="mx-auto text-orange-400"
            />

            <h2 className="mt-6 text-3xl font-black text-white">
              Cart is Empty
            </h2>

            <p className="mt-3 text-slate-400">
              Add some delicious food to your cart.
            </p>
          </div>

        ) : (

          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

            {/* LEFT */}
            <div className="space-y-6">

              {cartItems.map(
                (item, index) => (

                  <div
                    key={`${item.id}-${index}`}
                    className="rounded-[32px] border border-white/10 bg-[#0d1728] p-5"
                  >

                    <div className="flex flex-col gap-5 md:flex-row">

                      {/* IMAGE */}
                      <div className="h-36 w-full overflow-hidden rounded-2xl md:w-40">

                        <img
                          src={
                            item.image_url ||
                            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
                          }
                          alt={
                            item.name
                          }
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* CONTENT */}
                      <div className="flex-1">

                        <div className="flex items-start justify-between gap-4">

                          <div>

                            <h2 className="text-2xl font-black text-white">
                              {
                                item.name
                              }
                            </h2>

                            <p className="mt-2 text-sm text-slate-400">
                              {
                                item.category ||
                                "Food Item"
                              }
                            </p>

                            <p className="mt-4 text-xl font-black text-orange-400">
                              ₹ {item.price}
                            </p>
                          </div>

                          {/* REMOVE */}
                          <button
                            onClick={() =>
                              removeFromCart(
                                item.id
                              )
                            }
                            className="rounded-xl bg-red-500/15 p-3 text-red-400 transition hover:bg-red-500/25"
                          >

                            <Trash2
                              size={18}
                            />
                          </button>
                        </div>

                        {/* QUANTITY */}
                        <div className="mt-6 flex items-center justify-between">

                          <div className="flex items-center gap-4 rounded-full bg-orange-500 px-5 py-3">

                            <button
                              onClick={() =>
                                decreaseQuantity(
                                  item.id
                                )
                              }
                              className="grid h-8 w-8 place-items-center rounded-full bg-white/20 text-white"
                            >

                              <Minus
                                size={16}
                              />
                            </button>

                            <span className="font-black text-white">
                              {
                                item.quantity
                              }
                            </span>

                            <button
                              onClick={() =>
                                increaseQuantity(
                                  item.id
                                )
                              }
                              className="grid h-8 w-8 place-items-center rounded-full bg-white/20 text-white"
                            >

                              <Plus
                                size={16}
                              />
                            </button>
                          </div>

                          <p className="text-xl font-black text-white">

                            ₹{" "}

                            {(
                              item.price *
                              item.quantity
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* RIGHT */}
            <div className="sticky top-28 h-fit rounded-[36px] border border-white/10 bg-[#0d1728] p-8">

              <h2 className="text-3xl font-black text-white">
                Order Summary
              </h2>

              <div className="mt-8 space-y-5">

                <div className="flex items-center justify-between text-slate-300">

                  <span>
                    Subtotal
                  </span>

                  <span>
                    ₹{" "}
                    {subtotal.toFixed(
                      2
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-300">

                  <span>
                    Delivery Fee
                  </span>

                  <span>
                    ₹{" "}
                    {deliveryFee.toFixed(
                      2
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-300">

                  <span>
                    Platform Fee
                  </span>

                  <span>
                    ₹{" "}
                    {platformFee.toFixed(
                      2
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-300">

                  <span>
                    GST
                  </span>

                  <span>
                    ₹{" "}
                    {gstAmount.toFixed(
                      2
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-300">

                  <span>
                    Packing Charge
                  </span>

                  <span>
                    ₹{" "}
                    {packingCharge.toFixed(
                      2
                    )}
                  </span>
                </div>

                {/* TOTAL */}
                <div className="flex items-center justify-between border-t border-white/10 pt-5 text-2xl font-black text-white">

                  <span>
                    Total
                  </span>

                  <span>
                    ₹{" "}
                    {totalPrice.toFixed(
                      2
                    )}
                  </span>
                </div>
              </div>

              {/* BUTTON */}
              <button
                onClick={
                  handleCheckout
                }
                disabled={loading}
                className="mt-8 w-full rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-5 text-lg font-black text-white shadow-2xl transition hover:scale-[1.01] disabled:opacity-50"
              >

                {loading
                  ? "Placing Order..."
                  : "Place Order"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}