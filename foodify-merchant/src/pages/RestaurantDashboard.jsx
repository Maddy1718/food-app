import {
  useContext,
  useEffect,
  useState,
} from "react";

import RestaurantLayout
  from "../layouts/RestaurantLayout";

import { AuthContext }
  from "../context/AuthContext";

import { ThemeContext }
  from "../context/ThemeContext";

import { supabase }
  from "../services/supabase";

import {
  updateOrderStatus as updateOrderStatusService,
} from "../services/api/orderService";

import {
  ORDER_STATUS_IDS,
  ORDER_STATUS_LABELS,
  getStatusColorFromOrder,
  getStatusName,
} from "../utils/orderStatus";

export default function RestaurantDashboard() {

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

  const [restaurant,
    setRestaurant] =
    useState(null);

  const [items,
    setItems] =
    useState([]);

  const [orders,
    setOrders] =
    useState([]);

  const [categories,
    setCategories] =
    useState([]);

  const [showItemModal,
    setShowItemModal] =
    useState(false);

  const [editingItem,
    setEditingItem] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

  const [itemForm,
    setItemForm] =
    useState({

      item_name: "",

      category_id: "",

      image_url: "",

      description: "",

      ingredients: "",

      recipe: "",

      price: "",

      food_type: "VEG",

      stock_status: "Available",

      active: true,
    });

  // FETCH EVERYTHING
  useEffect(() => {

    if (!restaurantOwner)
      return;

    fetchDashboardData();

    const itemChannel =
      supabase

        .channel(
          `restaurant-items-${restaurantOwner.restaurant_id}`
        )

        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "items",
            filter: `restaurant_id=eq.${restaurantOwner.restaurant_id}`,
          },
          async (payload) => {

            console.log(
              "Realtime restaurant item update",
              {
                restaurantId:
                  restaurantOwner.restaurant_id,
                payload,
              }
            );

            await refreshItems();
          }
        )

        .subscribe();

    // REALTIME ORDERS
    const orderChannel =
      supabase

        .channel(
          `restaurant-orders-${restaurantOwner.restaurant_id}`
        )

        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "placed_order",
            filter: `restaurant_id=eq.${restaurantOwner.restaurant_id}`,
          },
          async (payload) => {

            console.log(
              "Realtime restaurant order update",
              {
                restaurantId:
                  restaurantOwner.restaurant_id,
                payload,
              }
            );

            await fetchOrders();
          }
        )

        .subscribe();

    return () => {

      supabase.removeChannel(
        itemChannel
      );

      supabase.removeChannel(
        orderChannel
      );
    };

  }, [restaurantOwner]);

  // FETCH DASHBOARD
  async function fetchDashboardData() {

    try {

      setLoading(
        true
      );

      // RESTAURANT
      console.log(
        "Restaurant dashboard owner context",
        {
          restaurantOwner,
        }
      );

      const {
        data: restaurantData,
        error:
          restaurantError,
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

      console.log(
        "Restaurant dashboard fetched restaurant",
        {
          restaurantId:
            restaurantOwner.restaurant_id,
          restaurantData,
        }
      );

      if (
        restaurantError
      ) {

        console.error(
          restaurantError
        );

        return;
      }

      setRestaurant(
        restaurantData
      );

      await refreshItems();

      // CATEGORIES
      const {
        data: categoryData,
        error:
          categoryError,
      } = await supabase

        .from(
          "category"
        )

        .select("*")

        .order(
          "category_name",
          {
            ascending:
              true,
          }
        );

      if (
        categoryError
      ) {

        console.error(
          categoryError
        );
      }

      setCategories(
        categoryData || []
      );

      // ORDERS
      await fetchOrders();

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

  // FETCH ORDERS
  async function fetchOrders() {

    try {

      const {
        data: orderData,
        error: orderError,
      } = await supabase

        .from(
          "placed_order"
        )

        .select(`
          *,
          status_catalog (
            id,
            status_name
          )
        `)

        .eq(
          "restaurant_id",
          restaurantOwner.restaurant_id
        )

        .order(
          "order_time",
          {
            ascending:
              false,
          }
        );

      if (orderError) {

        console.error(
          orderError
        );

        return;
      }

      console.log(
        "Fetched joined restaurant orders",
        {
          restaurantId:
            restaurantOwner.restaurant_id,
          orderCount:
            orderData?.length || 0,
          sampleOrder:
            orderData?.[0],
        }
      );

      setOrders(
        orderData || []
      );

    } catch (err) {

      console.error(
        err
      );
    }
  }

  // CREATE ITEM
  async function createItem() {

    try {

      const restaurantId =
        restaurant?.id ||
        restaurantOwner?.restaurant_id;

      if (!restaurantId) {

        alert(
          "No restaurant assigned"
        );

        return;
      }

      const itemPayload = {

        item_name:
          itemForm.item_name,

        category_id:
          itemForm.category_id,

        restaurant_id:
          restaurantId,

        image_url:
          itemForm.image_url,

        description:
          itemForm.description,

        ingredients:
          itemForm.ingredients,

        recipe:
          itemForm.recipe,

        price:
          Number(
            itemForm.price
          ),

        food_type:
          itemForm.food_type,

        stock_status:
          itemForm.stock_status,

        active:
          itemForm.active,
      };

      console.log(
        "Creating restaurant item",
        itemPayload
      );

      const {
        error,
      } = await supabase

        .from(
          "items"
        )

        .insert([
          itemPayload,
        ]);

      if (error)
        throw error;

      alert(
        "Item Added Successfully"
      );

      setShowItemModal(
        false
      );

      await refreshItems();

      resetForm();

    } catch (err) {

      console.error(
        err
      );

      alert(
        "Failed to add item"
      );
    }
  }

  // UPDATE ITEM
  async function updateItem() {

    try {

      const {
        error,
      } = await supabase

        .from(
          "items"
        )

        .update({

          item_name:
            itemForm.item_name,

          category_id:
            itemForm.category_id,

          image_url:
            itemForm.image_url,

          description:
            itemForm.description,

          ingredients:
            itemForm.ingredients,

          recipe:
            itemForm.recipe,

          price:
            Number(
              itemForm.price
            ),

          food_type:
            itemForm.food_type,

          stock_status:
            itemForm.stock_status,

          active:
            itemForm.active,
        })

        .eq(
          "id",
          editingItem.id
        );

      if (error)
        throw error;

      alert(
        "Item Updated Successfully"
      );

      await refreshItems();

      setEditingItem(
        null
      );

      setShowItemModal(
        false
      );

      resetForm();

    } catch (err) {

      console.error(
        err
      );

      alert(
        "Failed to update item"
      );
    }
  }

  // REFRESH ITEMS
  async function refreshItems() {

    const restaurantId =
      restaurant?.id ||
      restaurantOwner?.restaurant_id;

    console.log(
      "Refreshing dashboard items",
      {
        restaurantId,
      }
    );

    if (!restaurantId)
      return;

    const {
      data,
      error,
    } = await supabase

      .from(
        "items"
      )

      .select("*")

      .eq(
        "restaurant_id",
        restaurantId
      )

      .order(
        "id",
        {
          ascending:
            false,
        }
      );

    if (error) {

      console.error(
        "Refresh items error:",
        error
      );

      return;
    }

    console.log(
      "Dashboard items refreshed",
      {
        restaurantId,
        count: (data || []).length,
        items: data || [],
      }
    );

    setItems(
      data || []
    );
  }

  // RESET FORM
  function resetForm() {

    setItemForm({

      item_name: "",

      category_id: "",

      image_url: "",

      description: "",

      ingredients: "",

      recipe: "",

      price: "",

      food_type: "VEG",

      stock_status: "Available",

      active: true,
    });
  }

  // TOGGLE ACTIVE
  async function toggleItemActive(
    itemId,
    currentValue
  ) {

    console.log(
      "Toggling item active",
      {
        itemId,
        currentValue,
      }
    );

    await supabase

      .from(
        "items"
      )

      .update({

        active:
          !currentValue,
      })

      .eq(
        "id",
        itemId
      );

    setItems(
      items.map(
        (item) =>

          item.id === itemId

            ? {
                ...item,
                active:
                  !currentValue,
              }

            : item
      )
    );
  }

  // TOGGLE STOCK
  async function toggleStockStatus(
    itemId,
    currentStatus
  ) {

    const newStatus =
      currentStatus ===
      "Available"

        ? "Unavailable"

        : "Available";

    console.log(
      "Toggling item stock",
      {
        itemId,
        currentStatus,
        newStatus,
      }
    );

    await supabase

      .from(
        "items"
      )

      .update({

        stock_status:
          newStatus,
      })

      .eq(
        "id",
        itemId
      );

    setItems(
      items.map(
        (item) =>

          item.id === itemId

            ? {
                ...item,
                stock_status:
                  newStatus,
              }

            : item
      )
    );
  }

  // DELETE ITEM
  async function deleteItem(
    itemId
  ) {

    const confirmDelete =
      window.confirm(
        "Delete this item?"
      );

    if (!confirmDelete)
      return;

    console.log(
      "Deleting item",
      {
        itemId,
      }
    );

    await supabase

      .from(
        "items"
      )

      .delete()

      .eq(
        "id",
        itemId
      );

    setItems(
      items.filter(
        (item) =>
          item.id !== itemId
      )
    );
  }

  // RESTAURANT OPEN/CLOSE
  async function toggleRestaurantStatus() {

    const newStatus =
      !restaurant.is_open;

    await supabase

      .from(
        "restaurant"
      )

      .update({

        is_open:
          newStatus,

        current_status:
          newStatus
            ? "Open"
            : "Closed",
      })

      .eq(
        "id",
        restaurant.id
      );

    setRestaurant({

      ...restaurant,

      is_open:
        newStatus,

      current_status:
        newStatus
          ? "Open"
          : "Closed",
    });
  }

  // UPDATE ORDER STATUS
  async function updateOrderStatus(
    orderId,
    newStatusId
  ) {

    console.log(
      "Restaurant owner status transition",
      {
        orderId,
        newStatusId,
        newStatusName:
          ORDER_STATUS_LABELS[
            newStatusId
          ],
      }
    );

    const updatedOrder =
      await updateOrderStatusService(
        orderId,
        newStatusId
      );

    if (!updatedOrder) {

      console.error(
        "Update order status error"
      );

      return;
    }

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status_id:
                updatedOrder.status_id,
              status_catalog:
                updatedOrder.status_catalog || {
                  id:
                    updatedOrder.status_id,
                  status_name:
                    ORDER_STATUS_LABELS[
                      updatedOrder.status_id
                    ],
                },
            }
          : order
      )
    );
  }

  return (

    <RestaurantLayout>

      <div className={`min-h-screen p-8 transition-colors duration-300 ${darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>

        {loading ? (

          <h1 className={`text-3xl font-black ${darkMode ? "text-white" : "text-slate-900"}`}>

            Loading...

          </h1>

        ) : !restaurant ? (

          <h1 className="text-3xl font-black text-red-500">

            No Restaurant Assigned

          </h1>

        ) : (

          <>

            {/* HEADER */}
            <div className="mb-10">

              <h1 className={`text-5xl font-black ${darkMode ? "text-white" : "text-slate-900"}`}>

                {
                  restaurant.restaurant_name
                }

              </h1>

              <p className={`mt-3 text-xl ${darkMode ? "text-slate-300" : "text-slate-500"}`}>

                Restaurant Dashboard

              </p>

              <div className="mt-6">

                <button
                  onClick={
                    toggleRestaurantStatus
                  }
                  className={`rounded-2xl px-6 py-3 font-bold text-white ${
                    restaurant.is_open
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >

                  {restaurant.is_open
                    ? "Restaurant Open"
                    : "Restaurant Closed"}

                </button>

              </div>

            </div>

            {/* RESTAURANT DETAILS */}
            <div className={`mb-10 rounded-[32px] border p-8 shadow-xl ${darkMode ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"}`}>

              <div className="grid gap-6 md:grid-cols-2">

                <div>

                  <h2 className={`text-2xl font-black ${darkMode ? "text-white" : "text-slate-900"}`}>

                    Restaurant Details

                  </h2>

                  <p className={`mt-4 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>

                    📍 {
                      restaurant.address
                    }

                  </p>

                  <p className={`mt-2 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>

                    📞 {
                      restaurant.contact_number
                    }

                  </p>

                  <p className={`mt-2 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>

                    🍽️ {
                      restaurant.category
                    }

                  </p>

                  <p className={`mt-2 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>

                    ⭐ {
                      restaurant.rating
                    }

                  </p>

                </div>

                <div>

                  <img
                    src={
                      restaurant.image_url
                    }
                    alt={
                      restaurant.restaurant_name
                    }
                    className="h-64 w-full rounded-3xl object-cover"
                  />

                </div>

              </div>

            </div>

            {/* LIVE ORDERS */}
            <div className={`mb-10 rounded-[32px] border p-8 shadow-xl ${darkMode ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"}`}>

              <h2 className={`mb-8 text-3xl font-black ${darkMode ? "text-white" : "text-slate-900"}`}>

                Live Orders

              </h2>

              {orders.length === 0 ? (

                <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-500"}`}>

                  No orders yet

                </p>

              ) : (

                <div className="space-y-6">

                  {orders.map(
                    (order) => (

                      <div
                        key={order.id}
                        className={`rounded-3xl border p-6 ${darkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"}`}
                      >

                        <div className="flex flex-wrap items-center justify-between gap-4">

                          <div>

                            <h3 className={`text-2xl font-black ${darkMode ? "text-white" : "text-slate-900"}`}>

                              Order #
                              {order.id}

                            </h3>

                            <p className={`mt-2 ${darkMode ? "text-slate-300" : "text-slate-500"}`}>

                              ₹ {Number(order.total_price ?? order.total ?? 0).toFixed(2)}

                            </p>

                            <p className={`mt-2 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>

                              {
                                new Date(
                                  order.order_time || order.created_at
                                ).toLocaleString()
                              }

                            </p>

                          </div>

                          <div className="flex flex-wrap gap-3">

                            <button
                              onClick={() =>
                                updateOrderStatus(
                                  order.id,
                                  ORDER_STATUS_IDS.ORDER_PLACED
                                )
                              }
                              className="rounded-xl bg-blue-500 px-4 py-2 font-bold text-white"
                            >

                              Received

                            </button>

                            <button
                              onClick={() =>
                                updateOrderStatus(
                                  order.id,
                                  ORDER_STATUS_IDS.PREPARING
                                )
                              }
                              className="rounded-xl bg-orange-500 px-4 py-2 font-bold text-white"
                            >

                              Preparing

                            </button>

                            <button
                              onClick={() =>
                                updateOrderStatus(
                                  order.id,
                                  ORDER_STATUS_IDS.READY_FOR_PICKUP
                                )
                              }
                              className="rounded-xl bg-green-500 px-4 py-2 font-bold text-white"
                            >

                              Ready

                            </button>

                          </div>

                        </div>

                        <div className="mt-6">

                          <div
                            className={`mb-4 inline-block rounded-xl px-4 py-2 font-bold ${darkMode ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-900"}`}
                            style={{
                              backgroundColor:
                                getStatusColorFromOrder(order) + "20",
                              color:
                                getStatusColorFromOrder(order),
                            }}
                          >

                            Status:
                            {" "}
                            {getStatusName(order)}

                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>
              )}

            </div>

            {/* MENU ITEMS */}
            <div className={`rounded-[32px] border p-8 shadow-xl ${darkMode ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"}`}>

              <div className="mb-8 flex items-center justify-between">

                <h2 className={`text-3xl font-black ${darkMode ? "text-white" : "text-slate-900"}`}>

                  Menu Items

                </h2>

                <button
                  onClick={() => {

                    setEditingItem(
                      null
                    );

                    resetForm();

                    setShowItemModal(
                      true
                    );
                  }}
                  className="rounded-2xl bg-orange-500 px-6 py-3 font-bold text-white"
                >

                  + Add Item

                </button>

              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                {items.map(
                  (item) => (

                    <div
                      key={item.id}
                      className={`overflow-hidden rounded-[28px] border ${darkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-100"}`}
                    >

                      <img
                        src={
                          item.image_url
                        }
                        alt={
                          item.item_name
                        }
                        className="h-52 w-full object-cover"
                      />

                      <div className="p-5">

                        <div className="flex items-start justify-between">

                          <div>

                            <h3 className={`text-2xl font-black ${darkMode ? "text-white" : "text-slate-900"}`}>

                              {
                                item.item_name
                              }

                            </h3>

                            <p className={`mt-2 ${darkMode ? "text-slate-300" : "text-slate-500"}`}>

                              {
                                item.food_type
                              }

                            </p>

                            <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>

                              {
                                categories.find(
                                  (cat) =>
                                    cat.id ===
                                    item.category_id
                                )?.category_name
                              }

                            </p>

                          </div>

                          <div className="rounded-xl bg-orange-500 px-4 py-2 font-bold text-white">

                            ₹ {
                              item.price
                            }

                          </div>

                        </div>

                        <div className="mt-4 space-y-4">

                          <div className="flex flex-wrap gap-3">

                            <button
                              onClick={() =>
                                toggleItemActive(
                                  item.id,
                                  item.active
                                )
                              }
                              className={`rounded-xl px-4 py-2 font-bold text-white ${
                                item.active
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            >

                              {item.active
                                ? "Active"
                                : "Inactive"}

                            </button>

                            <button
                              onClick={() =>
                                toggleStockStatus(
                                  item.id,
                                  item.stock_status
                                )
                              }
                              className={`rounded-xl px-4 py-2 font-bold text-white ${
                                item.stock_status ===
                                "Available"

                                  ? "bg-blue-500"

                                  : "bg-gray-500"
                              }`}
                            >

                              {
                                item.stock_status
                              }

                            </button>

                          </div>

                          <div className="flex gap-3">

                            <button
                              onClick={() => {

                                setEditingItem(
                                  item
                                );

                                setItemForm({

                                  item_name:
                                    item.item_name,

                                  category_id:
                                    item.category_id,

                                  image_url:
                                    item.image_url,

                                  description:
                                    item.description,

                                  ingredients:
                                    item.ingredients,

                                  recipe:
                                    item.recipe,

                                  price:
                                    item.price,

                                  food_type:
                                    item.food_type,

                                  stock_status:
                                    item.stock_status,

                                  active:
                                    item.active,
                                });

                                setShowItemModal(
                                  true
                                );
                              }}
                              className="rounded-xl bg-orange-500 px-4 py-2 font-bold text-white"
                            >

                              Edit

                            </button>

                            <button
                              onClick={() =>
                                deleteItem(
                                  item.id
                                )
                              }
                              className="rounded-xl bg-red-500 px-4 py-2 font-bold text-white"
                            >

                              Delete

                            </button>

                          </div>

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* ADD / EDIT ITEM MODAL */}
            {showItemModal && (

              <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-6">

                <div className={`max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-[32px] border p-8 ${darkMode ? "border-slate-700 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-900"}`}>

                  <h2 className={`mb-6 text-3xl font-black ${darkMode ? "text-white" : "text-slate-900"}`}>

                    {editingItem
                      ? "Edit Menu Item"
                      : "Add Menu Item"}

                  </h2>

                  <div className="grid gap-4">

                    <input
                      type="text"
                      placeholder="Item Name"
                      value={
                        itemForm.item_name
                      }
                      onChange={(e) =>
                        setItemForm({
                          ...itemForm,
                          item_name:
                            e.target.value,
                        })
                      }
                      className={`rounded-2xl border p-4 ${darkMode ? "border-slate-600 bg-slate-800 text-white placeholder:text-slate-400" : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"}`}
                    />

                    <input
                      type="text"
                      placeholder="Image URL"
                      value={
                        itemForm.image_url
                      }
                      onChange={(e) =>
                        setItemForm({
                          ...itemForm,
                          image_url:
                            e.target.value,
                        })
                      }
                      className={`rounded-2xl border p-4 ${darkMode ? "border-slate-600 bg-slate-800 text-white placeholder:text-slate-400" : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"}`}
                    />

                    <textarea
                      placeholder="Description"
                      value={
                        itemForm.description
                      }
                      onChange={(e) =>
                        setItemForm({
                          ...itemForm,
                          description:
                            e.target.value,
                        })
                      }
                      className={`rounded-2xl border p-4 ${darkMode ? "border-slate-600 bg-slate-800 text-white placeholder:text-slate-400" : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"}`}
                    />

                    <textarea
                      placeholder="Ingredients"
                      value={
                        itemForm.ingredients
                      }
                      onChange={(e) =>
                        setItemForm({
                          ...itemForm,
                          ingredients:
                            e.target.value,
                        })
                      }
                      className={`rounded-2xl border p-4 ${darkMode ? "border-slate-600 bg-slate-800 text-white placeholder:text-slate-400" : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"}`}
                    />

                    <textarea
                      placeholder="Recipe"
                      value={
                        itemForm.recipe
                      }
                      onChange={(e) =>
                        setItemForm({
                          ...itemForm,
                          recipe:
                            e.target.value,
                        })
                      }
                      className={`rounded-2xl border p-4 ${darkMode ? "border-slate-600 bg-slate-800 text-white placeholder:text-slate-400" : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"}`}
                    />

                    <input
                      type="number"
                      placeholder="Price"
                      value={
                        itemForm.price
                      }
                      onChange={(e) =>
                        setItemForm({
                          ...itemForm,
                          price:
                            e.target.value,
                        })
                      }
                      className={`rounded-2xl border p-4 ${darkMode ? "border-slate-600 bg-slate-800 text-white placeholder:text-slate-400" : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"}`}
                    />

                    <select
                      value={
                        itemForm.category_id
                      }
                      onChange={(e) =>
                        setItemForm({
                          ...itemForm,
                          category_id:
                            e.target.value,
                        })
                      }
                      className={`rounded-2xl border p-4 ${darkMode ? "border-slate-600 bg-slate-800 text-white placeholder:text-slate-400" : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"}`}
                    >

                      <option value="">
                        Select Category
                      </option>

                      {categories.map(
                        (category) => (

                          <option
                            key={
                              category.id
                            }
                            value={
                              category.id
                            }
                          >

                            {
                              category.category_name
                            }

                          </option>
                        )
                      )}

                    </select>

                    <select
                      value={
                        itemForm.food_type
                      }
                      onChange={(e) =>
                        setItemForm({
                          ...itemForm,
                          food_type:
                            e.target.value,
                        })
                      }
                      className={`rounded-2xl border p-4 ${darkMode ? "border-slate-600 bg-slate-800 text-white placeholder:text-slate-400" : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"}`}
                    >

                      <option value="VEG">
                        VEG
                      </option>

                      <option value="NON-VEG">
                        NON-VEG
                      </option>

                    </select>

                    <select
                      value={
                        itemForm.stock_status
                      }
                      onChange={(e) =>
                        setItemForm({
                          ...itemForm,
                          stock_status:
                            e.target.value,
                        })
                      }
                      className={`rounded-2xl border p-4 ${darkMode ? "border-slate-600 bg-slate-800 text-white placeholder:text-slate-400" : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"}`}
                    >

                      <option value="Available">
                        Available
                      </option>

                      <option value="Unavailable">
                        Unavailable
                      </option>

                    </select>

                  </div>

                  <div className="mt-8 flex justify-end gap-4">

                    <button
                      onClick={() => {

                        setShowItemModal(
                          false
                        );

                        setEditingItem(
                          null
                        );
                      }}
                      className={`rounded-2xl px-6 py-3 font-bold ${darkMode ? "bg-slate-700 text-white" : "bg-slate-200 text-slate-900"}`}
                    >

                      Cancel

                    </button>

                    <button
                      onClick={
                        editingItem
                          ? updateItem
                          : createItem
                      }
                      className="rounded-2xl bg-orange-500 px-6 py-3 font-bold text-white"
                    >

                      {editingItem
                        ? "Update Item"
                        : "Add Item"}

                    </button>

                  </div>

                </div>

              </div>
            )}

          </>
        )}

      </div>

    </RestaurantLayout>
  );
}