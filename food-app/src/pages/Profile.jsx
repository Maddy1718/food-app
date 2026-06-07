import {
  useContext,
  useEffect,
  useState,
} from "react";

import MainLayout from "../layouts/MainLayout";

import {
  AuthContext,
} from "../context/AuthContext";

import {
  ThemeContext,
} from "../context/ThemeContext";

import {
  supabase,
} from "../services/supabase";

export default function Profile() {

  const {
    user,
    logout,
  } = useContext(
    AuthContext
  );

  const {
    darkMode,
  } = useContext(
    ThemeContext
  );

  const [loading,
    setLoading] =
    useState(true);

  const [saving,
    setSaving] =
    useState(false);

  const [profile,
    setProfile] =
    useState({

      customer_name: "",

      email: "",

      contact_phone: "",

      address: "",

      profile_image: "",
    });

  // FETCH PROFILE
  useEffect(() => {

    if (!user)
      return;

    fetchProfile();

  }, [user]);

  async function fetchProfile() {

    try {

      setLoading(
        true
      );

      const {
        data,
        error,
      } = await supabase

        .from(
          "customer"
        )

        .select("*")

        .eq(
          "auth_id",
          user.id
        )

        .single();

      if (error) {

        console.error(
          error
        );

        return;
      }

      console.log(
        "Customer Profile:",
        data
      );

      setProfile({

        customer_name:
          data.customer_name || "",

        email:
          data.email || "",

        contact_phone:
          data.contact_phone || "",

        address:
          data.address || "",

        profile_image:
          data.profile_image || "",
      });

    } catch (err) {

      console.error(
        err
      );

    } finally {

      setLoading(
        false
      );
    }
  }

  // SAVE PROFILE
  async function saveProfile() {

    try {

      setSaving(
        true
      );

      const {
        error,
      } = await supabase

        .from(
          "customer"
        )

        .update({

          customer_name:
            profile.customer_name,

          contact_phone:
            profile.contact_phone,

          address:
            profile.address,

          profile_image:
            profile.profile_image,
        })

        .eq(
          "auth_id",
          user.id
        );

      if (error)
        throw error;

      alert(
        "Profile Updated Successfully"
      );

    } catch (err) {

      console.error(
        err
      );

      alert(
        "Failed to update profile"
      );

    } finally {

      setSaving(
        false
      );
    }
  }

  // LOGOUT
  async function handleLogout() {

    await logout();

    window.location.href =
      "/login";
  }

  if (loading) {

    return (

      <div className={`flex min-h-screen items-center justify-center ${darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>

        <h1 className="text-3xl font-black">

          Loading Profile...

        </h1>

      </div>
    );
  }

  return (

    <MainLayout>

      <div className={`min-h-screen p-8 ${darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>

        <div className={`mx-auto max-w-3xl rounded-[32px] border p-10 shadow-xl ${darkMode ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"}`}>

        {/* HEADER */}
        <div className="mb-10 flex items-center gap-6">

          <img
            src={
              profile.profile_image ||

              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Profile"
            className="h-28 w-28 rounded-full object-cover"
          />

          <div>

            <h1 className={`text-4xl font-black ${darkMode ? "text-white" : "text-slate-900"}`}>

              My Profile

            </h1>

            <p className={`mt-2 ${darkMode ? "text-slate-300" : "text-slate-500"}`}>

              Manage your account details

            </p>

          </div>

        </div>

        {/* FORM */}
        <div className="space-y-6">

          {/* NAME */}
          <div>

            <label className={`mb-2 block font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>

              Full Name

            </label>

            <input
              type="text"
              value={
                profile.customer_name
              }
              onChange={(e) =>
                setProfile({

                  ...profile,

                  customer_name:
                    e.target.value,
                })
              }
              className={`w-full rounded-2xl border p-4 outline-none ${darkMode ? "border-slate-600 bg-slate-800 text-white placeholder:text-slate-400" : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"}`}
            />

          </div>

          {/* EMAIL */}
          <div>

            <label className={`mb-2 block font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>

              Email

            </label>

            <input
              type="email"
              value={
                profile.email
              }
              disabled
              className={`w-full rounded-2xl border p-4 ${darkMode ? "border-slate-600 bg-slate-700 text-slate-200" : "border-slate-200 bg-slate-100 text-slate-700"}`}
            />

          </div>

          {/* PHONE */}
          <div>

            <label className={`mb-2 block font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>

              Mobile Number

            </label>

            <input
              type="text"
              value={
                profile.contact_phone
              }
              onChange={(e) =>
                setProfile({

                  ...profile,

                  contact_phone:
                    e.target.value,
                })
              }
              className={`w-full rounded-2xl border p-4 outline-none ${darkMode ? "border-slate-600 bg-slate-800 text-white placeholder:text-slate-400" : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"}`}
            />

          </div>

          {/* ADDRESS */}
          <div>

            <label className={`mb-2 block font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>

              Address

            </label>

            <textarea
              value={
                profile.address
              }
              onChange={(e) =>
                setProfile({

                  ...profile,

                  address:
                    e.target.value,
                })
              }
              className={`w-full rounded-2xl border p-4 outline-none ${darkMode ? "border-slate-600 bg-slate-800 text-white placeholder:text-slate-400" : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"}`}
            />

          </div>

          {/* PROFILE IMAGE */}
          <div>

            <label className={`mb-2 block font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>

              Profile Image URL

            </label>

            <input
              type="text"
              value={
                profile.profile_image
              }
              onChange={(e) =>
                setProfile({

                  ...profile,

                  profile_image:
                    e.target.value,
                })
              }
              className={`w-full rounded-2xl border p-4 outline-none ${darkMode ? "border-slate-600 bg-slate-800 text-white placeholder:text-slate-400" : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"}`}
            />

          </div>

        </div>

        {/* BUTTONS */}
        <div className="mt-10 flex flex-wrap gap-4">

          <button
            onClick={
              saveProfile
            }
            disabled={saving}
            className="rounded-2xl bg-orange-500 px-8 py-4 text-lg font-black text-white"
          >

            {saving
              ? "Saving..."
              : "Save Changes"}

          </button>

          <button
            onClick={
              handleLogout
            }
            className="rounded-2xl bg-red-500 px-8 py-4 text-lg font-black text-white"
          >

            Logout

          </button>

        </div>

      </div>

    </div>

    </MainLayout>
  );
}