import {
  useState,
  useContext,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  AuthContext,
} from "../context/AuthContext";

export default function Login() {

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

  const [loading,
    setLoading] =
    useState(false);

  async function handleLogin(e) {

    e.preventDefault();

    try {

      setLoading(
        true
      );

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

        return;
      }

      navigate(
        "/dashboard"
      );

    } catch (err) {

      console.error(
        err
      );

      alert(
        "Login failed"
      );

    } finally {

      setLoading(
        false
      );
    }
  }

  return (

    <div className="flex min-h-screen items-center justify-center bg-slate-100">

      <form

        onSubmit={
          handleLogin
        }

        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"
      >

        <h1 className="mb-8 text-center text-4xl font-black">

          Merchant Login

        </h1>

        <input

          type="email"

          placeholder="Email"

          value={email}

          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }

          className="mb-4 w-full rounded-xl border p-4"
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

          className="mb-6 w-full rounded-xl border p-4"
        />

        <button

          type="submit"

          disabled={loading}

          className="w-full rounded-xl bg-orange-500 p-4 font-bold text-white"
        >

          {loading

            ? "Logging in..."

            : "Login"}

        </button>

      </form>

    </div>
  );
}