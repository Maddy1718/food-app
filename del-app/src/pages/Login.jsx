import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) throw error;

      const {
        data: partner,
        error: partnerError,
      } = await supabase
        .from("delivery_partner")
        .select("*")
        .eq(
          "auth_id",
          data.user.id
        )
        .single();

      if (partnerError)
        throw partnerError;

      if (!partner) {
        throw new Error(
          "Delivery Partner account not found"
        );
      }

      localStorage.setItem(
        "deliveryPartnerId",
        partner.id
      );

      localStorage.setItem(
        "deliveryPartnerName",
        partner.full_name
      );

      localStorage.setItem(
        "deliveryPartnerRating",
        partner.rating || 0
      );

      localStorage.setItem(
        "deliveryPartnerVehicle",
        partner.vehicle_type || ""
      );

      localStorage.setItem(
        "deliveryPartnerPhone",
        partner.phone || ""
      );

      navigate("/dashboard");

    } catch (err) {

      alert(err.message);

    } finally {

      setLoading(false);

    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg,#020617,#0f172a,#1e293b)",
        padding: "20px",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: "500px",
          background: "#1e293b",
          borderRadius: "24px",
          padding: "50px",
          border:
            "1px solid #334155",
          boxShadow:
            "0 25px 50px rgba(0,0,0,0.35)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          <h1
            style={{
              color: "#f97316",
              margin: 0,
              fontSize: "42px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            <span
              style={{
                fontSize: "36px",
              }}
            >
              🚚
            </span>

            Foodify Delivery
          </h1>
        </div>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          required
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          required
          style={inputStyle}
        />

        <button
          type="submit"
          disabled={loading}
          style={buttonStyle}
        >
          {
            loading
              ? "Logging In..."
              : "Login"
          }
        </button>

        <div
          style={{
            textAlign: "center",
            marginTop: "25px",
          }}
        >
          <span
            style={{
              color: "#cbd5e1",
            }}
          >
            New Delivery Partner?
          </span>

          <Link
            to="/signup"
            style={{
              color: "#f97316",
              marginLeft: "8px",
              textDecoration:
                "none",
              fontWeight: "600",
            }}
          >
            Create Account
          </Link>
        </div>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "16px",
  marginBottom: "16px",
  borderRadius: "12px",
  border: "1px solid #475569",
  background: "#0f172a",
  color: "white",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  padding: "16px",
  border: "none",
  borderRadius: "12px",
  background: "#f97316",
  color: "white",
  fontWeight: "700",
  fontSize: "16px",
  cursor: "pointer",
  marginTop: "8px",
};