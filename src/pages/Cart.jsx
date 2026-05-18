import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import { CartContext } from "../context/CartContext";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

import { createOrder } from "../services/api/orderService";

export default function Cart() {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
  } = useContext(CartContext);

  const { darkMode } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const total = cartItems.reduce(
    (acc, item) =>
      acc + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (!user) {
      alert("Please login to place an order");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        user_id: user.id || user.email,
        items: JSON.stringify(cartItems),
        total,
        status: "placed",
      };

      const result = await createOrder(orderData);

      if (result) {
        alert("Order placed successfully!");
        clearCart();
        navigate("/orders");
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing your order");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: darkMode
          ? "#0f172a"
          : "#f3f4f6",
      }}
    >
      <Navbar />

      <div
        style={{
          maxWidth: "1400px",
          margin: "auto",
          padding: "40px 24px",
        }}
      >
        <h1
          style={{
            fontSize: "52px",
            fontWeight: "900",
            marginBottom: "40px",
            color: darkMode
              ? "white"
              : "#111827",
          }}
        >
          Your Cart
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "2fr 1fr",
            gap: "30px",
          }}
        >
          <div>
            {cartItems.map((item) => (
              <div
                key={item.id}
                style={{
                  background: darkMode
                    ? "#1e293b"
                    : "#ffffff",
                  borderRadius: "30px",
                  padding: "24px",
                  marginBottom: "24px",
                  display: "flex",
                  gap: "24px",
                  alignItems: "center",
                  boxShadow:
                    "0 15px 35px rgba(0,0,0,0.08)",
                }}
              >
                <img
                  src={item.image_url || item.image}
                  alt={item.name}
                  style={{
                    width: "180px",
                    height: "140px",
                    borderRadius: "22px",
                    objectFit: "cover",
                  }}
                />

                <div style={{ flex: 1 }}>
                  <h2
                    style={{
                      color: darkMode
                        ? "white"
                        : "#111827",
                      fontSize: "28px",
                      fontWeight: "800",
                    }}
                  >
                    {item.name}
                  </h2>

                  <p
                    style={{
                      color: "#f97316",
                      fontWeight: "800",
                      fontSize: "24px",
                      marginTop: "10px",
                    }}
                  >
                    ₹ {item.price}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: "14px",
                      marginTop: "18px",
                    }}
                  >
                    <button
                      onClick={() =>
                        removeFromCart(
                          item.id
                        )
                      }
                      style={{
                        width: "42px",
                        height: "42px",
                        border: "none",
                        borderRadius: "12px",
                        background:
                          "#ef4444",
                        color: "white",
                        fontSize: "20px",
                        cursor: "pointer",
                      }}
                    >
                      -
                    </button>

                    <div
                      style={{
                        color: darkMode
                          ? "white"
                          : "#111827",
                        fontWeight: "700",
                        fontSize: "20px",
                      }}
                    >
                      {item.quantity}
                    </div>

                    <button
                      onClick={() =>
                        addToCart(item)
                      }
                      style={{
                        width: "42px",
                        height: "42px",
                        border: "none",
                        borderRadius: "12px",
                        background:
                          "#16a34a",
                        color: "white",
                        fontSize: "20px",
                        cursor: "pointer",
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SUMMARY */}

          <div
            style={{
              background: darkMode
                ? "#1e293b"
                : "#ffffff",
              borderRadius: "30px",
              padding: "30px",
              height: "fit-content",
              boxShadow:
                "0 15px 35px rgba(0,0,0,0.08)",
            }}
          >
            <h2
              style={{
                color: darkMode
                  ? "white"
                  : "#111827",
                fontSize: "34px",
                fontWeight: "900",
                marginBottom: "30px",
              }}
            >
              Order Summary
            </h2>

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                marginBottom: "20px",
              }}
            >
              <p
                style={{
                  color: darkMode
                    ? "#cbd5e1"
                    : "#6b7280",
                }}
              >
                Total
              </p>

              <h3
                style={{
                  color: "#f97316",
                  fontSize: "30px",
                  fontWeight: "900",
                }}
              >
                ₹ {total}
              </h3>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing || cartItems.length === 0}
              style={{
                width: "100%",
                border: "none",
                padding: "18px",
                borderRadius: "18px",
                background:
                  isProcessing || cartItems.length === 0
                    ? "#9ca3af"
                    : "linear-gradient(to right,#9333ea,#2563eb)",
                color: "white",
                fontWeight: "800",
                fontSize: "18px",
                cursor: isProcessing || cartItems.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              {isProcessing ? "Processing..." : "Proceed To Checkout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}