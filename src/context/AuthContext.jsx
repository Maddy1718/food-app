/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../services/supabase";

export const AuthContext = createContext();

const ADMIN_EMAILS = [
  "mathanes9396@gmail.com",
];

async function resolveAdminStatus(user) {
  if (!user) return false;

  if (user.app_metadata?.role === "admin" || user.user_metadata?.role === "admin") {
    return true;
  }

  if (ADMIN_EMAILS.includes(user.email)) {
    return true;
  }

  try {
    const { data, error } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (!error && data?.role === "admin") {
      return true;
    }
  } catch (err) {
    console.warn("Profile role check skipped:", err);
  }

  return false;
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const sessionUser = data.session?.user ?? null;
        if (!mounted) return;

        setUser(sessionUser);
        setIsAdmin(await resolveAdminStatus(sessionUser));
      } catch (err) {
        console.warn("Failed to load Supabase session:", err);
        if (!mounted) return;
        setUser(null);
        setIsAdmin(false);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const sessionUser = session?.user ?? null;
      if (!mounted) return;
      setUser(sessionUser);
      setIsAdmin(await resolveAdminStatus(sessionUser));
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  const signup = async (name, email, password) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: "user",
        },
      },
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
