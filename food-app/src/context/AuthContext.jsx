import {
  createContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../services/supabase";

export const AuthContext =
  createContext();

function AuthProvider({
  children,
}) {

  const [user,
    setUser] =
    useState(null);

  const [restaurantOwner,
    setRestaurantOwner] =
    useState(null);

  const [loading,
    setLoading] =
    useState(false);

  useEffect(() => {

    let mounted = true;

    const initializeAuth = async () => {

      try {

        const {
          data: {
            session,
          },
        } = await supabase.auth
          .getSession();

        if (!mounted)
          return;

        setUser(
          session?.user || null
        );

      } catch (err) {

        console.error(
          "Auth init error:",
          err
        );
      }
    };

    initializeAuth();

    const {
      data: listener,
    } = supabase.auth
      .onAuthStateChange(
        (_event,
          session) => {

          if (!mounted)
            return;

          setUser(
            session?.user || null
          );
        }
      );

    return () => {

      mounted = false;

      listener.subscription.unsubscribe();
    };

  }, []);

  useEffect(() => {

    let isActive = true;

    const fetchRestaurantOwner = async () => {

      if (!user?.id) {

        if (isActive)
          setRestaurantOwner(null);

        return;
      }

      try {

        const {
          data: ownerData,
          error,
        } = await supabase

          .from("restaurant_admin")

          .select("*")

          .eq(
            "auth_id",
            user.id
          )

          .maybeSingle();

        if (error) {

          console.error(
            "Restaurant owner fetch error:",
            error
          );

          if (isActive)
            setRestaurantOwner(null);

          return;
        }

        if (isActive)
          setRestaurantOwner(
            ownerData || null
          );

      } catch (err) {

        console.error(
          "Restaurant owner lookup error:",
          err
        );

        if (isActive)
          setRestaurantOwner(null);
      }
    };

    fetchRestaurantOwner();

    return () => {

      isActive = false;
    };

  }, [user?.id]);

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

        restaurantOwner,

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