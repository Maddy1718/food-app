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

  // ADMIN EMAILS
  const adminEmails = [

    "mathanes9396@gmail.com",
  ];

  const isAdmin =
    user &&
    adminEmails.includes(
      user.email
    );

  return (

    <div
      style={{
        background:
          darkMode
            ? "#111827"
            : "#ffffff",

        padding:
          "18px 40px",

        display: "flex",

        justifyContent:
          "space-between",

        alignItems:
          "center",
      }}
    >

      <Link
        to="/"

        style={{
          textDecoration:
            "none",

          color:
            "#ff6b00",

          fontSize:
            "32px",

          fontWeight:
            "bold",
        }}
      >

        Foodify

      </Link>

      <div
        style={{
          display:
            "flex",

          gap:
            "20px",

          alignItems:
            "center",
        }}
      >

        <Link to="/">

          Home

        </Link>

        <Link to="/orders">

          Orders

        </Link>

        <Link
          to="/cart"

          style={{
            position:
              "relative",
          }}
        >

          <FaShoppingCart />

          {
            totalItems > 0 && (

              <span
                style={{
                  position:
                    "absolute",

                  top:
                    "-10px",

                  right:
                    "-10px",

                  background:
                    "#ff6b00",

                  color:
                    "white",

                  borderRadius:
                    "50%",

                  width:
                    "20px",

                  height:
                    "20px",

                  display:
                    "flex",

                  justifyContent:
                    "center",

                  alignItems:
                    "center",

                  fontSize:
                    "12px",
                }}
              >

                {totalItems}

              </span>
            )
          }

        </Link>

        {/* ADMIN */}
        {
          isAdmin && (

            <Link to="/admin">

              Admin

            </Link>
          )
        }

        {/* THEME TOGGLE */}
        <button onClick={toggleTheme} style={{ background: darkMode ? "#374151" : "#e5e7eb", color: darkMode ? "white" : "#111", border: "none", padding: "8px 12px", borderRadius: "8px", cursor: "pointer" }}>
          {darkMode ? "Light" : "Dark"}
        </button>

        {/* LOGIN/LOGOUT */}
        {
          user ? (

            <button
              onClick={logout}

              style={{
                background:
                  "#ff6b00",

                color:
                  "white",

                border:
                  "none",

                padding:
                  "10px 20px",

                borderRadius:
                  "10px",
              }}
            >

              Logout

            </button>

          ) : (

            <Link
              to="/login"

              style={{
                background:
                  "#ff6b00",

                color:
                  "white",

                padding:
                  "10px 20px",

                borderRadius:
                  "10px",

                textDecoration:
                  "none",
              }}
            >

              Login

            </Link>
          )
        }

      </div>

    </div>
  );
}

export default Navbar;