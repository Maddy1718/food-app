import { useContext, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Moon, Sun, ChevronDown, LayoutGrid, User, ShieldCheck } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { cartItems } =
    useContext(CartContext);

  const {
    darkMode,
    toggleTheme,
  } = useContext(ThemeContext);

  const totalItems =
    cartItems.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-md border-b ${
        darkMode
          ? "bg-[#081028]/95 border-white/10"
          : "bg-white/95 border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            BB
          </div>

          <div>
            <h1
              className={`text-2xl font-bold ${
                darkMode
                  ? "text-white"
                  : "text-black"
              }`}
            >
              BiteBox
            </h1>

            <p
              className={`text-sm ${
                darkMode
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              Fast Food Delivery
            </p>
          </div>
        </Link>

        {/* NAV LINKS */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className={`font-semibold hover:text-orange-500 transition ${
              darkMode
                ? "text-white"
                : "text-black"
            }`}
          >
            Home
          </Link>

          <Link
            to="/orders"
            className={`font-semibold hover:text-orange-500 transition ${
              darkMode
                ? "text-white"
                : "text-black"
            }`}
          >
            Orders
          </Link>

          {/* CART */}
          <Link
            to="/cart"
            className="relative"
          >
            <ShoppingCart
              size={28}
              className={
                darkMode
                  ? "text-white"
                  : "text-black"
              }
            />

            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>

          {/* DARK MODE BUTTON */}
          <button
            onClick={toggleTheme}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
              darkMode
                ? "bg-[#1e293b] text-yellow-400"
                : "bg-gray-100 text-black"
            }`}
          >
            {darkMode ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>

          {/* LOGIN */}
          <Link to="/login">
            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition">
              Login
            </button>
          </Link>

          {/* SIGNUP */}
          <Link to="/signup">
            <button
              className={`px-6 py-3 rounded-full font-semibold border transition ${
                darkMode
                  ? "border-white/20 text-white hover:bg-white/10"
                  : "border-gray-300 text-black hover:bg-gray-100"
              }`}
            >
              Signup
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}