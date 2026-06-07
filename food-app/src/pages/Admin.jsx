import {
  useContext,
  useEffect,
  useState,
} from "react";

import MainLayout from "../layouts/MainLayout";
import { ThemeContext } from "../context/ThemeContext";
import { supabase } from "../services/supabase";

export default function Admin() {

  const { darkMode } = useContext(ThemeContext);

  const [restaurants, setRestaurants] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [showRestaurantModal,
    setShowRestaurantModal] =
    useState(false);

  const [showItemModal,
    setShowItemModal] =
    useState(false);

  const [editingRestaurant,
    setEditingRestaurant] =
    useState(null);

  const [editingItem,
    setEditingItem] =
    useState(null);

  const [selectedRestaurantId,
    setSelectedRestaurantId] =
    useState(null);

  const [restaurantOwners,
    setRestaurantOwners] =
    useState([]);

  const [showOwnerModal,
    setShowOwnerModal] =
    useState(false);

  const [ownerForm,
    setOwnerForm] =
    useState({

      owner_name: "",

      email: "",

      mobile_number: "",

      temporary_password: "",

      restaurant_name: "",

      address: "",

      contact_number: "",

      category: "",

      image_url: "",

      cover_image_url: "",

      opening_time: "",

      closing_time: "",
    });

  // RESTAURANT FORM
  const [restaurantForm,
    setRestaurantForm] =
    useState({

      restaurant_name: "",

      address: "",

      contact_number: "",

      category: "",

      image_url: "",

      cover_image_url: "",

      current_status: "Active",

      is_open: true,

      opening_time: "",

      closing_time: "",

      rating: 4.5,
    });

  // ITEM FORM
  const [itemForm,
    setItemForm] =
    useState({

      item_name: "",

      description: "",

      ingredients: "",

      recipe: "",

      image_url: "",

      category_id: "",

      food_type: "VEG",

      price: "",

      stock_status: "In Stock",

      active: true,
    });

  // FETCH DATA
  useEffect(() => {

    fetchData();

  }, []);

  async function fetchData() {

    try {

      setLoading(true);

      // RESTAURANTS
      const {
        data: restaurantData,
        error: restaurantError,
      } = await supabase

        .from("restaurant")

        .select(`
          *,
          items (*)
        `)

        .order(
          "id",
          {
            ascending: true,
          }
        );

      if (restaurantError)
        throw restaurantError;

      // CATEGORIES
      const {
        data: categoryData,
        error: categoryError,
      } = await supabase

        .from("category")

        .select("*");

      if (categoryError)
        throw categoryError;

      const {
        data: ownerData,
        error: ownerError,
      } = await supabase

        .from("restaurant_admin")

        .select(`
          *,
          restaurant:restaurant_id (
            restaurant_name
          )
        `)

        .order(
          "created_at",
          {
            ascending: false,
          }
        );

      if (ownerError)
        throw ownerError;

      setRestaurants(
        restaurantData || []
      );

      setCategories(
        categoryData || []
      );

      setRestaurantOwners(
        ownerData || []
      );

    } catch (err) {

      console.error(
        "Fetch error:",
        err
      );

    } finally {

      setLoading(false);
    }
  }

  // OPEN RESTAURANT MODAL
  function openRestaurantModal(
    restaurant = null
  ) {

    if (restaurant) {

      setEditingRestaurant(
        restaurant
      );

      setRestaurantForm({

        restaurant_name:
          restaurant.restaurant_name || "",

        address:
          restaurant.address || "",

        contact_number:
          restaurant.contact_number || "",

        category:
          restaurant.category || "",

        image_url:
          restaurant.image_url || "",

        cover_image_url:
          restaurant.cover_image_url || "",

        current_status:
          restaurant.current_status || "Active",

        is_open:
          restaurant.is_open ?? true,

        opening_time:
          restaurant.opening_time || "",

        closing_time:
          restaurant.closing_time || "",

        rating:
          restaurant.rating || 4.5,
      });

    } else {

      setEditingRestaurant(null);

      setRestaurantForm({

        restaurant_name: "",

        address: "",

        contact_number: "",

        category: "",

        image_url: "",

        cover_image_url: "",

        current_status: "Active",

        is_open: true,

        opening_time: "",

        closing_time: "",

        rating: 4.5,
      });
    }

    setShowRestaurantModal(
      true
    );
  }

  // SAVE RESTAURANT
  async function saveRestaurant() {

    try {

      const payload = {

        ...restaurantForm,

        rating:
          Number(
            restaurantForm.rating
          ) || 4.5,
      };

      if (
        editingRestaurant
      ) {

        const {
          error,
        } = await supabase

          .from("restaurant")

          .update(payload)

          .eq(
            "id",
            editingRestaurant.id
          );

        if (error)
          throw error;

      } else {

        const {
          error,
        } = await supabase

          .from("restaurant")

          .insert([
            payload,
          ]);

        if (error)
          throw error;
      }

      setShowRestaurantModal(
        false
      );

      fetchData();

    } catch (err) {

      console.error(
        "Save restaurant error:",
        err
      );

      alert(
        err.message
      );
    }
  }

  // DELETE RESTAURANT
  async function deleteRestaurant(
    id
  ) {

    const confirmDelete =
      window.confirm(
        "Delete restaurant?"
      );

    if (!confirmDelete)
      return;

    try {

      const {
        error,
      } = await supabase

        .from("restaurant")

        .delete()

        .eq("id", id);

      if (error)
        throw error;

      fetchData();

    } catch (err) {

      console.error(
        "Delete restaurant error:",
        err
      );
    }
  }

  // OPEN ITEM MODAL
  function openItemModal(
    restaurantId,
    item = null
  ) {

    setSelectedRestaurantId(
      restaurantId
    );

    if (item) {

      setEditingItem(item);

      setItemForm({

        item_name:
          item.item_name || "",

        description:
          item.description || "",

        ingredients:
          item.ingredients || "",

        recipe:
          item.recipe || "",

        image_url:
          item.image_url || "",

        category_id:
          item.category_id || "",

        food_type:
          item.food_type || "VEG",

        price:
          item.price || "",

        stock_status:
          item.stock_status || "In Stock",

        active:
          item.active ?? true,
      });

    } else {

      setEditingItem(null);

      setItemForm({

        item_name: "",

        description: "",

        ingredients: "",

        recipe: "",

        image_url: "",

        category_id: "",

        food_type: "VEG",

        price: "",

        stock_status: "In Stock",

        active: true,
      });
    }

    setShowItemModal(
      true
    );
  }

  // SAVE ITEM
  async function saveItem() {

    try {

      const payload = {

        ...itemForm,

        restaurant_id:
          selectedRestaurantId,

        price:
          Number(
            itemForm.price
          ) || 0,
      };

      if (
        editingItem
      ) {

        const {
          error,
        } = await supabase

          .from("items")

          .update(payload)

          .eq(
            "id",
            editingItem.id
          );

        if (error)
          throw error;

      } else {

        const {
          error,
        } = await supabase

          .from("items")

          .insert([
            payload,
          ]);

        if (error)
          throw error;
      }

      setShowItemModal(
        false
      );

      fetchData();

    } catch (err) {

      console.error(
        "Save item error:",
        err
      );

      alert(
        err.message
      );
    }
  }

  // DELETE ITEM
  async function deleteItem(
    id
  ) {

    const confirmDelete =
      window.confirm(
        "Delete item?"
      );

    if (!confirmDelete)
      return;

    try {

      const {
        error,
      } = await supabase

        .from("items")

        .delete()

        .eq("id", id);

      if (error)
        throw error;

      fetchData();

    } catch (err) {

      console.error(
        "Delete item error:",
        err
      );
    }
  }

  function openOwnerModal() {

    setOwnerForm({

      owner_name: "",

      email: "",

      mobile_number: "",

      temporary_password: "",

      restaurant_name: "",

      address: "",

      contact_number: "",

      category: "",

      image_url: "",

      cover_image_url: "",

      opening_time: "",

      closing_time: "",
    });

    setShowOwnerModal(true);
  }

  async function createRestaurantOwner() {

    try {

      if (
        !ownerForm.owner_name.trim() ||
        !ownerForm.email.trim() ||
        !ownerForm.mobile_number.trim() ||
        !ownerForm.temporary_password.trim() ||
        !ownerForm.restaurant_name.trim() ||
        !ownerForm.address.trim() ||
        !ownerForm.contact_number.trim() ||
        !ownerForm.category.trim()
      ) {

        alert(
          "Please fill in all owner details and restaurant details"
        );

        return;
      }

      const {
        data: authData,
        error: authError,
      } = await supabase.auth.signUp({

        email:
          ownerForm.email.trim(),

        password:
          ownerForm.temporary_password,

        options: {
          data: {
            owner_name:
              ownerForm.owner_name.trim(),
          },
        },
      });

      if (authError)
        throw authError;

      if (!authData?.user?.id) {

        throw new Error(
          "Unable to create restaurant owner account"
        );
      }

      const restaurantPayload = {

        restaurant_name:
          ownerForm.restaurant_name.trim(),

        address:
          ownerForm.address.trim(),

        contact_number:
          ownerForm.contact_number.trim(),

        category:
          ownerForm.category.trim(),

        image_url:
          ownerForm.image_url.trim(),

        cover_image_url:
          ownerForm.cover_image_url.trim(),

        opening_time:
          ownerForm.opening_time.trim(),

        closing_time:
          ownerForm.closing_time.trim(),

        current_status:
          "Active",

        is_open:
          true,

        rating:
          4.5,
      };

      const {
        data: createdRestaurantData,
        error: restaurantInsertError,
      } = await supabase

        .from("restaurant")

        .insert([
          restaurantPayload,
        ])

        .select();

      if (restaurantInsertError)
        throw restaurantInsertError;

      const createdRestaurant =
        createdRestaurantData?.[0];

      if (!createdRestaurant?.id) {

        throw new Error(
          "Unable to create restaurant assignment"
        );
      }

      const {
        error: ownerInsertError,
      } = await supabase

        .from("restaurant_admin")

        .insert([
          {
            auth_id:
              authData.user.id,

            restaurant_id:
              createdRestaurant.id,

            owner_name:
              ownerForm.owner_name.trim(),

            email:
              ownerForm.email.trim(),

            mobile_number:
              ownerForm.mobile_number.trim(),
          },
        ]);

      if (ownerInsertError)
        throw ownerInsertError;

      setShowOwnerModal(false);

      setOwnerForm({

        owner_name: "",

        email: "",

        mobile_number: "",

        temporary_password: "",

        restaurant_name: "",

        address: "",

        contact_number: "",

        category: "",

        image_url: "",

        cover_image_url: "",

        opening_time: "",

        closing_time: "",
      });

      fetchData();

    } catch (err) {

      console.error(
        "Create restaurant owner error:",
        err
      );

      alert(
        err.message
      );
    }
  }

  return (

    <MainLayout>

      <div className={`min-h-screen p-8 transition-colors duration-300 ${darkMode ? "bg-slate-950 text-white" : "bg-[#f4f7fb] text-slate-900"}`}>

        {/* HEADER */}
        <div className="mb-10 flex items-center justify-between">

          <div>

            <h1 className={`text-5xl font-black ${darkMode ? "text-white" : "text-slate-900"}`}>
              Admin Dashboard
            </h1>

            <p className={`mt-3 ${darkMode ? "text-slate-300" : "text-slate-500"}`}>
              Manage restaurants and menu items
            </p>
          </div>

          <div className="flex gap-3">

            <button
              onClick={() =>
                openRestaurantModal()
              }
              className="rounded-2xl bg-orange-500 px-6 py-4 font-bold text-white"
            >

              + Add Restaurant

            </button>

            <button
              onClick={openOwnerModal}
              className="rounded-2xl bg-green-500 px-6 py-4 font-bold text-white"
            >

              + Add Restaurant Owner

            </button>
          </div>
        </div>

        <div className={`mb-10 rounded-[32px] border p-6 shadow-xl ${darkMode ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"}`}>

          <div className="mb-6 flex items-center justify-between">

            <div>

              <h2 className={`text-3xl font-black ${darkMode ? "text-white" : "text-slate-900"}`}>
                Restaurant Owners
              </h2>

              <p className={`mt-2 ${darkMode ? "text-slate-300" : "text-slate-500"}`}>
                Manage assigned restaurant owners and their restaurant access
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">

            {restaurantOwners.map(
              (owner) => (

                <div
                  key={owner.id}
                  className={`rounded-[28px] border p-5 ${darkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-50"}`}
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex-1">

                      <h3 className={`text-xl font-black ${darkMode ? "text-white" : "text-slate-900"}`}>
                        {
                          owner.owner_name
                        }
                      </h3>

                      <p className={`mt-2 text-sm font-bold ${darkMode ? "text-slate-300" : "text-slate-500"}`}>
                        {
                          owner.email
                        }
                      </p>

                      <p className={`mt-2 text-sm ${darkMode ? "text-slate-300" : "text-slate-500"}`}>
                        Mobile: {
                          owner.mobile_number
                        }
                      </p>

                      <div className="mt-3 inline-flex rounded-full bg-orange-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-orange-600">

                        {
                          owner.restaurant?.restaurant_name ||
                          owner.restaurant_name ||
                          "Unassigned Restaurant"
                        }

                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* LOADING */}
        {loading ? (

          <div className="text-xl font-bold">
            Loading...
          </div>

        ) : (

          <div className="grid gap-8 lg:grid-cols-2">

            {restaurants.map(
              (restaurant) => (

                <div
                  key={restaurant.id}
                  className={`overflow-hidden rounded-[32px] border shadow-xl ${darkMode ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"}`}
                >

                  <img
                    src={
                      restaurant.image_url ||
                      "https://images.unsplash.com/photo-1504674900247-0877df9cc836"
                    }
                    alt={
                      restaurant.restaurant_name
                    }
                    className="h-64 w-full object-cover"
                  />

                  <div className="p-6">

                    <div className="flex items-start justify-between">

                      <div>

                        <h2 className={`text-3xl font-black ${darkMode ? "text-white" : "text-slate-900"}`}>
                          {
                            restaurant.restaurant_name
                          }
                        </h2>

                        <p className={`mt-2 ${darkMode ? "text-slate-300" : "text-slate-500"}`}>
                          {
                            restaurant.category
                          }
                        </p>

                        <p className="mt-2 font-bold text-orange-500">
                          ⭐ {
                            restaurant.rating
                          }
                        </p>
                      </div>

                      <div className="flex gap-2">

                        <button
                          onClick={() =>
                            openRestaurantModal(
                              restaurant
                            )
                          }
                          className="rounded-xl bg-blue-500 px-4 py-2 font-bold text-white"
                        >

                          Edit

                        </button>

                        <button
                          onClick={() =>
                            deleteRestaurant(
                              restaurant.id
                            )
                          }
                          className="rounded-xl bg-red-500 px-4 py-2 font-bold text-white"
                        >

                          Delete

                        </button>
                      </div>
                    </div>

                    {/* ITEMS */}
                    <div className="mt-8">

                      <div className="mb-4 flex items-center justify-between">

                        <h3 className="text-2xl font-black">
                          Menu Items
                        </h3>

                        <button
                          onClick={() =>
                            openItemModal(
                              restaurant.id
                            )
                          }
                          className="rounded-xl bg-green-500 px-4 py-2 font-bold text-white"
                        >

                          + Add Item

                        </button>
                      </div>

                      <div className="space-y-4">

                        {restaurant.items?.map(
                          (item) => (

                            <div
                              key={item.id}
                              className={`flex items-center gap-4 rounded-2xl p-4 ${darkMode ? "bg-slate-800" : "bg-slate-100"}`}
                            >

                              <img
                                src={
                                  item.image_url ||
                                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
                                }
                                alt={
                                  item.item_name
                                }
                                className="h-20 w-20 rounded-2xl object-cover"
                              />

                              <div className="flex-1">

                                <h4 className={`text-xl font-black ${darkMode ? "text-white" : "text-slate-900"}`}>
                                  {
                                    item.item_name
                                  }
                                </h4>

                                <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-500"}`}>
                                  {
                                    item.food_type
                                  }
                                </p>

                                <p className="font-bold text-orange-500">
                                  ₹ {
                                    item.price
                                  }
                                </p>

                                <div className="mt-2 flex gap-2">

                                  <span
                                    className={`rounded-full px-3 py-1 text-xs font-bold text-white ${
                                      item.stock_status ===
                                      "Out of Stock"
                                        ? "bg-red-500"
                                        : "bg-green-500"
                                    }`}
                                  >

                                    {
                                      item.stock_status
                                    }

                                  </span>

                                  <span
                                    className={`rounded-full px-3 py-1 text-xs font-bold text-white ${
                                      item.active
                                        ? "bg-orange-500"
                                        : "bg-slate-500"
                                    }`}
                                  >

                                    {item.active
                                      ? "Active"
                                      : "Disabled"}

                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-col gap-2">

                                {/* STOCK TOGGLE */}
                                <button
                                  onClick={async () => {

                                    const updatedStatus =

                                      item.stock_status ===
                                      "Out of Stock"
                                        ? "In Stock"
                                        : "Out of Stock";

                                    const { error } =
                                      await supabase

                                        .from("items")

                                        .update({
                                          stock_status:
                                            updatedStatus,
                                        })

                                        .eq(
                                          "id",
                                          item.id
                                        );

                                    if (!error) {

                                      fetchData();
                                    }
                                  }}
                                  className={`rounded-xl px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-white ${
                                    item.stock_status ===
                                    "Out of Stock"
                                      ? "bg-red-500"
                                      : "bg-green-500"
                                  }`}
                                >

                                  {item.stock_status ===
                                  "Out of Stock"
                                    ? "Set Available"
                                    : "Set Unavailable"}

                                </button>

                                {/* ACTIVE TOGGLE */}
                                <button
                                  onClick={async () => {

                                    const { error } =
                                      await supabase

                                        .from("items")

                                        .update({
                                          active:
                                            !item.active,
                                        })

                                        .eq(
                                          "id",
                                          item.id
                                        );

                                    if (!error) {

                                      fetchData();
                                    }
                                  }}
                                  className={`rounded-xl px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-white ${
                                    item.active
                                      ? "bg-orange-500"
                                      : "bg-slate-500"
                                  }`}
                                >

                                  {item.active
                                    ? "Disable"
                                    : "Enable"}

                                </button>

                                <button
                                  onClick={() =>
                                    openItemModal(
                                      restaurant.id,
                                      item
                                    )
                                  }
                                  className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-bold text-white"
                                >

                                  Edit

                                </button>

                                <button
                                  onClick={() =>
                                    deleteItem(
                                      item.id
                                    )
                                  }
                                  className="rounded-lg bg-red-500 px-3 py-2 text-sm font-bold text-white"
                                >

                                  Delete

                                </button>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* RESTAURANT MODAL */}
        {showRestaurantModal && (

          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-6">

            <div className={`w-full max-w-2xl rounded-[32px] border p-8 ${darkMode ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"}`}>

              <h2 className={`mb-6 text-3xl font-black ${darkMode ? "text-white" : "text-slate-900"}`}>

                {editingRestaurant
                  ? "Edit Restaurant"
                  : "Add Restaurant"}

              </h2>

              <div className="grid gap-4">

                <input
                  type="text"
                  placeholder="Restaurant Name"
                  value={restaurantForm.restaurant_name}
                  onChange={(e) =>
                    setRestaurantForm({
                      ...restaurantForm,
                      restaurant_name: e.target.value,
                    })
                  }
                  className="rounded-2xl border p-4"
                />

                <input
                  type="text"
                  placeholder="Address"
                  value={restaurantForm.address}
                  onChange={(e) =>
                    setRestaurantForm({
                      ...restaurantForm,
                      address: e.target.value,
                    })
                  }
                  className="rounded-2xl border p-4"
                />

                <input
                  type="text"
                  placeholder="Contact Number"
                  value={restaurantForm.contact_number}
                  onChange={(e) =>
                    setRestaurantForm({
                      ...restaurantForm,
                      contact_number: e.target.value,
                    })
                  }
                  className="rounded-2xl border p-4"
                />

                <input
                  type="text"
                  placeholder="Category"
                  value={restaurantForm.category}
                  onChange={(e) =>
                    setRestaurantForm({
                      ...restaurantForm,
                      category: e.target.value,
                    })
                  }
                  className="rounded-2xl border p-4"
                />

                <input
                  type="text"
                  placeholder="Image URL"
                  value={restaurantForm.image_url}
                  onChange={(e) =>
                    setRestaurantForm({
                      ...restaurantForm,
                      image_url: e.target.value,
                    })
                  }
                  className="rounded-2xl border p-4"
                />
              </div>

              <div className="mt-8 flex justify-end gap-4">

                <button
                  onClick={() =>
                    setShowRestaurantModal(false)
                  }
                  className="rounded-2xl bg-slate-200 px-6 py-3 font-bold"
                >

                  Cancel

                </button>

                <button
                  onClick={saveRestaurant}
                  className="rounded-2xl bg-orange-500 px-6 py-3 font-bold text-white"
                >

                  Save

                </button>
              </div>
            </div>
          </div>
        )}

        {/* ITEM MODAL */}
        {showItemModal && (

          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-6">

            <div className={`w-full max-w-2xl rounded-[32px] border p-8 ${darkMode ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"}`}>

              <h2 className={`mb-6 text-3xl font-black ${darkMode ? "text-white" : "text-slate-900"}`}>

                {editingItem
                  ? "Edit Item"
                  : "Add Item"}

              </h2>

              <div className="grid gap-4">

                <input
                  type="text"
                  placeholder="Item Name"
                  value={itemForm.item_name}
                  onChange={(e) =>
                    setItemForm({
                      ...itemForm,
                      item_name: e.target.value,
                    })
                  }
                  className="rounded-2xl border p-4"
                />

                <textarea
                  placeholder="Description"
                  value={itemForm.description}
                  onChange={(e) =>
                    setItemForm({
                      ...itemForm,
                      description: e.target.value,
                    })
                  }
                  className="rounded-2xl border p-4"
                />

                <input
                  type="number"
                  placeholder="Price"
                  value={itemForm.price}
                  onChange={(e) =>
                    setItemForm({
                      ...itemForm,
                      price: e.target.value,
                    })
                  }
                  className="rounded-2xl border p-4"
                />

                {/* FOOD TYPE */}
                <select
                  value={itemForm.food_type}
                  onChange={(e) =>
                    setItemForm({
                      ...itemForm,
                      food_type:
                        e.target.value,
                    })
                  }
                  className="rounded-2xl border p-4"
                >

                  <option value="VEG">
                    VEG
                  </option>

                  <option value="NON VEG">
                    NON VEG
                  </option>
                </select>

                {/* STOCK STATUS */}
                <select
                  value={itemForm.stock_status}
                  onChange={(e) =>
                    setItemForm({
                      ...itemForm,
                      stock_status:
                        e.target.value,
                    })
                  }
                  className="rounded-2xl border p-4"
                >

                  <option value="In Stock">
                    In Stock
                  </option>

                  <option value="Out of Stock">
                    Out of Stock
                  </option>
                </select>
              </div>

              <div className="mt-8 flex justify-end gap-4">

                <button
                  onClick={() =>
                    setShowItemModal(false)
                  }
                  className="rounded-2xl bg-slate-200 px-6 py-3 font-bold"
                >

                  Cancel

                </button>

                <button
                  onClick={saveItem}
                  className="rounded-2xl bg-orange-500 px-6 py-3 font-bold text-white"
                >

                  Save

                </button>
              </div>
            </div>
          </div>
        )}

        {showOwnerModal && (

          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-6">

            <div className={`w-full max-w-2xl rounded-[32px] border p-8 ${darkMode ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"}`}>

              <h2 className={`mb-6 text-3xl font-black ${darkMode ? "text-white" : "text-slate-900"}`}>

                Create Restaurant Owner

              </h2>

              <div className="grid gap-4">

                <div className="grid gap-4 md:grid-cols-2">

                  <input
                    type="text"
                    placeholder="Owner Name"
                    value={ownerForm.owner_name}
                    onChange={(e) =>
                      setOwnerForm({
                        ...ownerForm,
                        owner_name: e.target.value,
                      })
                    }
                    className="rounded-2xl border p-4"
                  />

                  <input
                    type="email"
                    placeholder="Email"
                    value={ownerForm.email}
                    onChange={(e) =>
                      setOwnerForm({
                        ...ownerForm,
                        email: e.target.value,
                      })
                    }
                    className="rounded-2xl border p-4"
                  />

                  <input
                    type="text"
                    placeholder="Mobile Number"
                    value={ownerForm.mobile_number}
                    onChange={(e) =>
                      setOwnerForm({
                        ...ownerForm,
                        mobile_number: e.target.value,
                      })
                    }
                    className="rounded-2xl border p-4"
                  />

                  <input
                    type="password"
                    placeholder="Temporary Password"
                    value={ownerForm.temporary_password}
                    onChange={(e) =>
                      setOwnerForm({
                        ...ownerForm,
                        temporary_password: e.target.value,
                      })
                    }
                    className="rounded-2xl border p-4"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">

                  <input
                    type="text"
                    placeholder="Restaurant Name"
                    value={ownerForm.restaurant_name}
                    onChange={(e) =>
                      setOwnerForm({
                        ...ownerForm,
                        restaurant_name: e.target.value,
                      })
                    }
                    className="rounded-2xl border p-4"
                  />

                  <input
                    type="text"
                    placeholder="Category"
                    value={ownerForm.category}
                    onChange={(e) =>
                      setOwnerForm({
                        ...ownerForm,
                        category: e.target.value,
                      })
                    }
                    className="rounded-2xl border p-4"
                  />

                  <input
                    type="text"
                    placeholder="Contact Number"
                    value={ownerForm.contact_number}
                    onChange={(e) =>
                      setOwnerForm({
                        ...ownerForm,
                        contact_number: e.target.value,
                      })
                    }
                    className="rounded-2xl border p-4"
                  />

                  <input
                    type="text"
                    placeholder="Address"
                    value={ownerForm.address}
                    onChange={(e) =>
                      setOwnerForm({
                        ...ownerForm,
                        address: e.target.value,
                      })
                    }
                    className="rounded-2xl border p-4"
                  />

                  <input
                    type="text"
                    placeholder="Image URL"
                    value={ownerForm.image_url}
                    onChange={(e) =>
                      setOwnerForm({
                        ...ownerForm,
                        image_url: e.target.value,
                      })
                    }
                    className="rounded-2xl border p-4"
                  />

                  <input
                    type="text"
                    placeholder="Cover Image URL"
                    value={ownerForm.cover_image_url}
                    onChange={(e) =>
                      setOwnerForm({
                        ...ownerForm,
                        cover_image_url: e.target.value,
                      })
                    }
                    className="rounded-2xl border p-4"
                  />

                  <input
                    type="text"
                    placeholder="Opening Time"
                    value={ownerForm.opening_time}
                    onChange={(e) =>
                      setOwnerForm({
                        ...ownerForm,
                        opening_time: e.target.value,
                      })
                    }
                    className="rounded-2xl border p-4"
                  />

                  <input
                    type="text"
                    placeholder="Closing Time"
                    value={ownerForm.closing_time}
                    onChange={(e) =>
                      setOwnerForm({
                        ...ownerForm,
                        closing_time: e.target.value,
                      })
                    }
                    className="rounded-2xl border p-4"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-4">

                <button
                  onClick={() =>
                    setShowOwnerModal(false)
                  }
                  className="rounded-2xl bg-slate-200 px-6 py-3 font-bold"
                >

                  Cancel

                </button>

                <button
                  onClick={createRestaurantOwner}
                  className="rounded-2xl bg-green-500 px-6 py-3 font-bold text-white"
                >

                  Create Owner

                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </MainLayout>
  );
}