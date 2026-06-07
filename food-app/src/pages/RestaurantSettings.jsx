import {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  AuthContext,
} from "../context/AuthContext";

import { ThemeContext } from "../context/ThemeContext";

import RestaurantLayout from "../layouts/RestaurantLayout";

import {
  supabase,
} from "../services/supabase";

export default function RestaurantSettings() {

  const {
    restaurantOwner,
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

  const [restaurant,
    setRestaurant] =
    useState({

      restaurant_name: "",

      image_url: "",

      address: "",

      contact_number: "",

      category: "",

      opening_time: "",

      closing_time: "",

      is_open: true,
    });

  // FETCH RESTAURANT
  useEffect(() => {

    if (!restaurantOwner)
      return;

    fetchRestaurant();

  }, [restaurantOwner]);

  async function fetchRestaurant() {

    try {

      setLoading(
        true
      );

      const {
        data,
        error,
      } = await supabase

        .from(
          "restaurant"
        )

        .select("*")

        .eq(
          "id",
          restaurantOwner.restaurant_id
        )

        .single();

      if (error) {

        console.error(
          error
        );

        return;
      }

      console.log(
        "Restaurant Settings:",
        data
      );

      setRestaurant({

        restaurant_name:
          data.restaurant_name || "",

        image_url:
          data.image_url || "",

        address:
          data.address || "",

        contact_number:
          data.contact_number || "",

        category:
          data.category || "",

        opening_time:
          data.opening_time || "",

        closing_time:
          data.closing_time || "",

        is_open:
          data.is_open ?? true,
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

  // SAVE SETTINGS
  async function saveRestaurant() {

    try {

      setSaving(
        true
      );

      const {
        error,
      } = await supabase

        .from(
          "restaurant"
        )

        .update({

          restaurant_name:
            restaurant.restaurant_name,

          image_url:
            restaurant.image_url,

          address:
            restaurant.address,

          contact_number:
            restaurant.contact_number,

          category:
            restaurant.category,

          opening_time:
            restaurant.opening_time,

          closing_time:
            restaurant.closing_time,

          is_open:
            restaurant.is_open,

          current_status:
            restaurant.is_open
              ? "Open"
              : "Closed",
        })

        .eq(
          "id",
          restaurantOwner.restaurant_id
        );

      if (error)
        throw error;

      alert(
        "Restaurant Updated Successfully"
      );

    } catch (err) {

      console.error(
        err
      );

      alert(
        "Failed to update restaurant"
      );

    } finally {

      setSaving(
        false
      );
    }
  }

  if (loading) {

    return (

      <RestaurantLayout>

        <div className={`flex min-h-screen items-center justify-center ${darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>

          <h1 className="text-3xl font-black">

            Loading Restaurant...

          </h1>

        </div>

      </RestaurantLayout>
    );
  }

  return (

    <RestaurantLayout>

      <div className={`min-h-screen p-8 ${darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>

      <div className={`mx-auto max-w-4xl rounded-[32px] border p-10 shadow-xl ${darkMode ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"}`}>

        {/* HEADER */}
        <div className="mb-10 flex items-center gap-6">

          <img
            src={
              restaurant.image_url ||

              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
            }
            alt="Restaurant"
            className="h-32 w-32 rounded-3xl object-cover"
          />

          <div>

            <h1 className={`text-4xl font-black ${darkMode ? "text-white" : "text-slate-900"}`}>

              Restaurant Settings

            </h1>

            <p className={`mt-2 ${darkMode ? "text-slate-300" : "text-slate-500"}`}>

              Manage your restaurant information

            </p>

          </div>

        </div>

        {/* FORM */}
        <div className="grid gap-6">

          {/* NAME */}
          <div>

            <label className={`mb-2 block font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>

              Restaurant Name

            </label>

            <input
              type="text"
              value={
                restaurant.restaurant_name
              }
              onChange={(e) =>
                setRestaurant({

                  ...restaurant,

                  restaurant_name:
                    e.target.value,
                })
              }
              className={`w-full rounded-2xl border p-4 outline-none ${darkMode ? "border-slate-600 bg-slate-800 text-white placeholder:text-slate-400" : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"}`}
            />

          </div>

          {/* IMAGE */}
          <div>

            <label className={`mb-2 block font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>

              Restaurant Image URL

            </label>

            <input
              type="text"
              value={
                restaurant.image_url
              }
              onChange={(e) =>
                setRestaurant({

                  ...restaurant,

                  image_url:
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
                restaurant.address
              }
              onChange={(e) =>
                setRestaurant({

                  ...restaurant,

                  address:
                    e.target.value,
                })
              }
              className={`w-full rounded-2xl border p-4 outline-none ${darkMode ? "border-slate-600 bg-slate-800 text-white placeholder:text-slate-400" : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"}`}
            />

          </div>

          {/* CONTACT */}
          <div>

            <label className={`mb-2 block font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>

              Contact Number

            </label>

            <input
              type="text"
              value={
                restaurant.contact_number
              }
              onChange={(e) =>
                setRestaurant({

                  ...restaurant,

                  contact_number:
                    e.target.value,
                })
              }
              className={`w-full rounded-2xl border p-4 outline-none ${darkMode ? "border-slate-600 bg-slate-800 text-white placeholder:text-slate-400" : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"}`}
            />

          </div>

          {/* CATEGORY */}
          <div>

            <label className={`mb-2 block font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>

              Category

            </label>

            <input
              type="text"
              value={
                restaurant.category
              }
              onChange={(e) =>
                setRestaurant({

                  ...restaurant,

                  category:
                    e.target.value,
                })
              }
              className={`w-full rounded-2xl border p-4 outline-none ${darkMode ? "border-slate-600 bg-slate-800 text-white placeholder:text-slate-400" : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"}`}
            />

          </div>

          {/* OPENING TIME */}
          <div>

            <label className={`mb-2 block font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>

              Opening Time

            </label>

            <input
              type="time"
              value={
                restaurant.opening_time
              }
              onChange={(e) =>
                setRestaurant({

                  ...restaurant,

                  opening_time:
                    e.target.value,
                })
              }
              className={`w-full rounded-2xl border p-4 outline-none ${darkMode ? "border-slate-600 bg-slate-800 text-white" : "border-slate-200 bg-white text-slate-900"}`}
            />

          </div>

          {/* CLOSING TIME */}
          <div>

            <label className={`mb-2 block font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>

              Closing Time

            </label>

            <input
              type="time"
              value={
                restaurant.closing_time
              }
              onChange={(e) =>
                setRestaurant({

                  ...restaurant,

                  closing_time:
                    e.target.value,
                })
              }
              className={`w-full rounded-2xl border p-4 outline-none ${darkMode ? "border-slate-600 bg-slate-800 text-white" : "border-slate-200 bg-white text-slate-900"}`}
            />

          </div>

          {/* OPEN/CLOSE */}
          <div className="flex items-center gap-4">

            <input
              type="checkbox"
              checked={
                restaurant.is_open
              }
              onChange={(e) =>
                setRestaurant({

                  ...restaurant,

                  is_open:
                    e.target.checked,
                })
              }
              className="h-5 w-5 accent-orange-500"
            />

            <label className={`font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>

              Restaurant Open

            </label>

          </div>

        </div>

        {/* SAVE BUTTON */}
        <div className="mt-10">

          <button
            onClick={
              saveRestaurant
            }
            disabled={saving}
            className="rounded-2xl bg-orange-500 px-8 py-4 text-lg font-black text-white"
          >

            {saving
              ? "Saving..."
              : "Save Changes"}

          </button>

        </div>

      </div>

    </div>

    </RestaurantLayout>
  );
}