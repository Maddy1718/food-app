import {
  useState,
  useContext,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { AuthContext }
  from "../context/AuthContext";

function Signup() {

  const navigate =
    useNavigate();

  const {
    signUp,
  } = useContext(
    AuthContext
  );

  const [name,
    setName] =
    useState("");

  const [email,
    setEmail] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const handleSignup =
    async (e) => {

      e.preventDefault();

      const {
        error,
      } = await signUp(

        name,

        email,

        password
      );

      if (error) {

        alert(
          error.message
        );

      } else {

        alert(
          "Signup Successful"
        );

        navigate("/login");
      }
    };

  return (

    <div
      style={{
        minHeight:
          "100vh",

        display:
          "flex",

        justifyContent:
          "center",

        alignItems:
          "center",

        background:
          "#f5f5f5",
      }}
    >

      <form

        onSubmit={
          handleSignup
        }

        style={{
          background:
            "white",

          padding:
            "40px",

          borderRadius:
            "20px",

          width:
            "400px",
        }}
      >

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Signup</h1>
          <Link to="/" style={{ textDecoration: 'none', background: '#e5e7eb', padding: '8px 12px', borderRadius: '8px' }}>Home</Link>
        </div>

        <input
          type="text"
          placeholder="Name"

          value={name}

          onChange={(e) =>
            setName(
              e.target.value
            )
          }

          required

          style={{
            width: "100%",
            padding: "15px",
            marginTop:
              "20px",
          }}
        />

        <input
          type="email"
          placeholder="Email"

          value={email}

          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }

          required

          style={{
            width: "100%",
            padding: "15px",
            marginTop:
              "20px",
          }}
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

          style={{
            width: "100%",
            padding: "15px",
            marginTop:
              "20px",
          }}
        />

        <button
          type="submit"

          style={{
            width: "100%",
            padding: "15px",
            marginTop:
              "20px",

            background:
              "#ff6b00",

            color:
              "white",

            border:
              "none",
          }}
        >

          Signup

        </button>

        <p
          style={{
            marginTop:
              "20px",
          }}
        >

          Already have account?

          <Link to="/login">

            Login

          </Link>

        </p>

      </form>

    </div>
  );
}

export default Signup;