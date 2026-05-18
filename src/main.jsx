import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";

import ThemeProvider from "./context/ThemeContext";
import CartProvider from "./context/CartContext";
import AuthProvider from "./context/AuthContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);