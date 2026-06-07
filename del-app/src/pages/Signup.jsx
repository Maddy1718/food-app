import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function Signup() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [loading, setLoading] = useState(false);

  function validateForm() {
    if (!/^[A-Za-z ]{3,}$/.test(fullName.trim())) {
      alert("Enter a valid full name");
      return false;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Phone number must contain exactly 10 digits");
      return false;
    }

    if (!vehicleType) {
      alert("Please select a vehicle type");
      return false;
    }

    if (
      !/^[A-Z]{2}\s[0-9]{2}\s[A-Z]{1,2}\s[0-9]{4}$/.test(
        vehicleNumber.toUpperCase()
      )
    ) {
      alert("Vehicle number format should be: KA 01 AB 1234");
      return false;
    }

    if (licenseNumber.trim().length < 10) {
      alert("License number must contain at least 10 characters");
      return false;
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)
    ) {
      alert(
        "Password must be at least 8 characters and contain uppercase, lowercase and a number"
      );
      return false;
    }

    return true;
  }

  async function handleSignup(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { data, error } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (error) throw error;

      const { error: insertError } =
        await supabase
          .from("delivery_partner")
          .insert([
            {
              auth_id: data.user.id,
              full_name: fullName,
              email,
              phone,
              vehicle_type: vehicleType,
              vehicle_number: vehicleNumber.toUpperCase(),
              license_number: licenseNumber,
              availability_status: true,
            },
          ]);

      if (insertError) throw insertError;

      alert(
        "Delivery Partner Account Created Successfully"
      );

      navigate("/");
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
          "linear-gradient(135deg,#0f172a,#1e293b)",
        padding: "20px",
      }}
    >
      <form
        onSubmit={handleSignup}
        style={{
          background: "#1e293b",
          padding: "40px",
          borderRadius: "20px",
          width: "450px",
          boxShadow:
            "0 10px 25px rgba(0,0,0,0.3)",
        }}
      >
        <h1
          style={{
            color: "white",
            marginBottom: "25px",
            textAlign: "center",
          }}
        >
          Delivery Partner Signup
        </h1>

        <input
          placeholder="Full Name"
          value={fullName}
          onChange={(e) =>
            setFullName(e.target.value)
          }
          style={inputStyle}
        />

        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={inputStyle}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={inputStyle}
        />

        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) =>
            setPhone(
              e.target.value.replace(
                /\D/g,
                ""
              )
            )
          }
          style={inputStyle}
        />

        <select
          value={vehicleType}
          onChange={(e) =>
            setVehicleType(
              e.target.value
            )
          }
          style={inputStyle}
        >
          <option value="">
            Select Vehicle Type
          </option>

          <option value="Bike">
            Bike
          </option>

          <option value="Scooter">
            Scooter
          </option>

          <option value="Cycle">
            Cycle
          </option>

          <option value="Car">
            Car
          </option>
        </select>

        <input
          placeholder="Vehicle Number (KA 01 AB 1234)"
          value={vehicleNumber}
          onChange={(e) =>
            setVehicleNumber(
              e.target.value.toUpperCase()
            )
          }
          style={inputStyle}
        />

        <input
          placeholder="License Number"
          value={licenseNumber}
          onChange={(e) =>
            setLicenseNumber(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <button
          type="submit"
          disabled={loading}
          style={buttonStyle}
        >
          {loading
            ? "Creating..."
            : "Create Account"}
        </button>

        <p
          style={{
            color: "#cbd5e1",
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          Already have an account?

          <Link
            to="/"
            style={{
              color: "#60a5fa",
              marginLeft: "6px",
              textDecoration:
                "none",
            }}
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "10px",
  border: "none",
  outline: "none",
  fontSize: "14px",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "#6d28d9",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "15px",
};