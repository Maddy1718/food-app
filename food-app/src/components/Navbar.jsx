import {
  Link,
} from "react-router-dom";

import {
  useContext,
} from "react";

import {
  FaShoppingCart,
} from "react-icons/fa";

import { CartContext }
  from "../context/CartContext";

import { ThemeContext }
  from "../context/ThemeContext";

import { AuthContext }
  from "../context/AuthContext";

function Navbar() {

  const {
    cartItems,
  } = useContext(
    CartContext
  );

  const {
    darkMode,
    toggleTheme,
  } = useContext(
    ThemeContext
  );

  const {
    user,
    logout,
  } = useContext(
    AuthContext
  );

  const totalItems =
    cartItems.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  const adminEmails = [
    "mathanes9396@gmail.com",
  ];

  const isAdmin =
    user &&
    adminEmails.includes(
      user.email
    );

  const navLinkClass =
    "rounded-xl px-3 py-2 text-sm font-semibold transition-colors duration-300";

  return (
    <div
      className={`sticky top-0 z-40 border-b backdrop-blur-xl ${darkMode ? "border-slate-800 bg-slate-950/95" : "border-slate-200 bg-white/95"}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link
          to="/"
          className="text-2xl font-black text-orange-500"
        >
          Foodify
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          <Link
            to="/"
            className={`${navLinkClass} ${darkMode ? "text-slate-300 hover:bg-white/5" : "text-slate-600 hover:bg-slate-100"}`}
          >
            Home
          </Link>

          <Link
            to="/orders"
            className={`${navLinkClass} ${darkMode ? "text-slate-300 hover:bg-white/5" : "text-slate-600 hover:bg-slate-100"}`}
          >
            Orders
          </Link>

          <Link
            to="/cart"
            className={`relative rounded-xl p-2 transition-colors duration-300 ${darkMode ? "text-slate-300 hover:bg-white/5" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <FaShoppingCart className="text-lg" />

            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          <Link
            to="/profile"
            className={`${navLinkClass} ${darkMode ? "text-slate-300 hover:bg-white/5" : "text-slate-600 hover:bg-slate-100"}`}
          >
            Profile
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className={`${navLinkClass} ${darkMode ? "text-slate-300 hover:bg-white/5" : "text-slate-600 hover:bg-slate-100"}`}
            >
              Admin
            </Link>
          )}

          <button
            onClick={toggleTheme}
            className={`rounded-xl px-3 py-2 text-sm font-bold transition-colors duration-300 ${darkMode ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-slate-200 text-slate-900 hover:bg-slate-300"}`}
          >
            {darkMode ? "Light" : "Dark"}
          </button>

          {user ? (
            <button
              onClick={logout}
              className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;