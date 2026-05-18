import {
  createContext,
  useState,
} from "react";

export const ThemeContext = createContext();

export default function ThemeProvider({
  children,
}) {
  const [darkMode, setDarkMode] =
    useState(() => {
      const savedTheme =
        localStorage.getItem("darkMode");
      return savedTheme === "true";
    });

  const toggleTheme = () => {
    setDarkMode((prev) => {
      const updated = !prev;

      localStorage.setItem(
        "darkMode",
        updated
      );

      return updated;
    });
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