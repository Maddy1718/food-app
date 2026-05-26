import {
  createContext,
  useEffect,
  useState,
} from "react";

import { supabase }
  from "../services/supabase";

export const AuthContext =
  createContext();

function AuthProvider({
  children,
}) {

  const [user,
    setUser] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

  // GET CURRENT USER
  useEffect(() => {

    // SESSION
    supabase.auth
      .getSession()

      .then(({ data }) => {

        setUser(
          data.session?.user || null
        );

        setLoading(false);
      });

    // LISTENER
    const {

      data: listener,

    } = supabase.auth
      .onAuthStateChange(
        (_event, session) => {

          setUser(
            session?.user || null
          );
        }
      );

    return () => {

      listener.subscription.unsubscribe();
    };

  }, []);

  // SIGNUP
  const signUp =
    async (
      name,
      email,
      password
    ) => {

      const {

        data,

        error,

      } = await supabase.auth
        .signUp({

          email,

          password,
        });

      if (error) {

        return {
          error,
        };
      }

      // INSERT INTO CUSTOMER TABLE
      await supabase
        .from("customer")
        .insert([

          {
            customer_name:
              name,

            email:
              email,

            auth_id:
              data.user.id,

            role:
              "customer",
          },
        ]);

      return {
        data,
      };
    };

  // LOGIN
  const login =
    async (
      email,
      password
    ) => {

      return await supabase.auth
        .signInWithPassword({

          email,

          password,
        });
    };

  // LOGOUT
  const logout =
    async () => {

      await supabase.auth
        .signOut();
    };

  return (

    <AuthContext.Provider
      value={{

        user,

        loading,

        signUp,

        login,

        logout,
      }}
    >

      {children}

    </AuthContext.Provider>
  );
}

export default AuthProvider;