import {
  createContext,
  useEffect,
  useState,
} from "react";

export const ThemeContext = createContext();

export default function ThemeProvider({
  children,
}) {
  const [darkMode, setDarkMode] =
    useState(() => {
      if (typeof window === "undefined") {
        return false;
      }

      const savedTheme =
        window.localStorage.getItem("darkMode");

      if (savedTheme === null) {
        return false;
      }

      return savedTheme === "true";
    });

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const root = document.documentElement;

    root.classList.toggle("dark", darkMode);
    root.style.colorScheme = darkMode ? "dark" : "light";
    window.localStorage.setItem(
      "darkMode",
      String(darkMode)
    );
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}