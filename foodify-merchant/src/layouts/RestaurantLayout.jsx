import {
  useContext,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

function RestaurantLayout({
  children,
}) {

  const navigate =
    useNavigate();

  const {
    logout,
  } = useContext(
    AuthContext
  );

  const {
    darkMode,
  } = useContext(
    ThemeContext
  );

  const handleLogout = async () => {

    await logout();

    navigate("/login");
  };

  return (

    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>

      <header className={`border-b shadow-sm ${darkMode ? "border-slate-800 bg-slate-950/95" : "border-slate-200 bg-white/95"}`}>

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500">

              Restaurant Panel

            </p>

            <h1 className={`mt-1 text-2xl font-black ${darkMode ? "text-white" : "text-slate-900"}`}>

              Dashboard

            </h1>
          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={() =>
                navigate(
                  "/dashboard"
                )
              }
              className={`rounded-2xl px-4 py-2 text-sm font-bold ${darkMode ? "bg-slate-800 text-white" : "bg-slate-900 text-white"}`}
            >

              Dashboard

            </button>

            <button
              onClick={() =>
                navigate(
                  "/restaurant-settings"
                )
              }
              className="rounded-2xl bg-orange-500 px-4 py-2 text-sm font-bold text-white"
            >

              Restaurant Settings

            </button>

            <button
              onClick={handleLogout}
              className="rounded-2xl bg-red-500 px-4 py-2 text-sm font-bold text-white"
            >

              Logout

            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-6">

        {children}

      </main>
    </div>
  );
}

export default RestaurantLayout;
