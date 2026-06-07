import {
  useContext,
} from "react";

import Navbar
  from "../components/Navbar";

import { ThemeContext }
  from "../context/ThemeContext";

function MainLayout({
  children,
}) {

  const {
    darkMode,
  } = useContext(
    ThemeContext
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>
      <Navbar />

      <div className="px-4 py-6 md:px-6">
        {children}
      </div>
    </div>
  );
}

export default MainLayout;