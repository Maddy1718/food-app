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

function Login() {

  const navigate =
    useNavigate();

  const {
    login,
  } = useContext(
    AuthContext
  );

  const [email,
    setEmail] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const handleLogin =
    async (e) => {

      e.preventDefault();

      const {
        error,
      } = await login(

        email,

        password
      );

      if (error) {

        alert(
          error.message
        );

      } else {

        alert(
          "Login Successful"
        );

        navigate("/");
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
          handleLogin
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
          <h1>Login</h1>
          <Link to="/" style={{ textDecoration: 'none', background: '#e5e7eb', padding: '8px 12px', borderRadius: '8px' }}>Home</Link>
        </div>

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

          Login

        </button>

        <p
          style={{
            marginTop:
              "20px",
          }}
        >

          Don’t have account?

          <Link to="/signup">

            Signup

          </Link>

        </p>

      </form>

    </div>
  );
}

export default Login;