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

import { ThemeContext }
  from "../context/ThemeContext";

import { supabase }
  from "../services/supabase";

function Login() {

  const navigate =
    useNavigate();

  const {
    login,
  } = useContext(
    AuthContext
  );

  const { darkMode } =
    useContext(ThemeContext);

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
        data,
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

        // CURRENT USER
        const currentUser =
          data?.user;

        // CHECK RESTAURANT OWNER
        const {
          data: ownerData,
          error: ownerError,
        } = await supabase

          .from(
            "restaurant_admin"
          )

          .select("*")

          .eq(
            "auth_id",
            currentUser.id
          )

          .maybeSingle();

        if (ownerError) {

          console.error(
            ownerError
          );
        }

        alert(
          "Login Successful"
        );

        // OWNER LOGIN
        if (ownerData) {

          navigate(
            "/restaurant-dashboard"
          );

        } else {

          // NORMAL CUSTOMER
          navigate("/");
        }
      }
    };

  return (

    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-slate-950" : "bg-slate-50"}`}>

      <div className="flex min-h-screen items-center justify-center px-4">

        <form

          onSubmit={
            handleLogin
          }
          className={`w-full max-w-md rounded-[28px] border p-8 shadow-2xl ${darkMode ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"}`}
        >

          <div className="flex items-center justify-between gap-4">

            <h1 className={`text-3xl font-black ${darkMode ? "text-white" : "text-slate-900"}`}>

              Login

            </h1>

            <Link
              to="/"
              className={`rounded-xl px-3 py-2 text-sm font-bold ${darkMode ? "bg-slate-800 text-slate-200" : "bg-slate-200 text-slate-800"}`}
            >

              Home

            </Link>

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
            className={`mt-6 w-full rounded-2xl border px-4 py-3 outline-none ${darkMode ? "border-slate-600 bg-slate-800 text-white placeholder:text-slate-400" : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"}`}
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
            className={`mt-4 w-full rounded-2xl border px-4 py-3 outline-none ${darkMode ? "border-slate-600 bg-slate-800 text-white placeholder:text-slate-400" : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"}`}
          />

          <button
            type="submit"
            className="mt-6 w-full rounded-2xl bg-orange-500 px-4 py-3 font-bold text-white"
          >

            Login

          </button>

          <p className={`mt-5 text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>

            Don’t have account?

            <Link to="/signup" className="ml-1 font-bold text-orange-500">

              Signup

            </Link>

          </p>

        </form>

      </div>
    </div>
  );
}

export default Login;