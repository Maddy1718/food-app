import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { supabase } from "../services/supabase";

export default function Admin() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  async function fetchRestaurants() {
    const { data, error } = await supabase
      .from("restaurant")
      .select(`
        *,
        items (*)
      `);

    if (!error) {
      setRestaurants(data);
    }
  }

  async function updateRestaurant(id, updates) {
    // updates: object with fields to update
    await supabase
      .from("restaurant")
      .update(updates)
      .eq("id", id);

    fetchRestaurants();
  }

  async function deleteRestaurant(id) {
    await supabase
      .from("restaurant")
      .delete()
      .eq("id", id);

    fetchRestaurants();
  }

  async function updateItem(id, name, price) {
    // update both possible name fields for compatibility
    await supabase
      .from("items")
      .update({
        name,
        item_name: name,
        price,
      })
      .eq("id", id);

    fetchRestaurants();
  }

  async function addRestaurant() {
    const restaurant_name = prompt("Restaurant name (required)");
    if (!restaurant_name) return;
    const cuisine = prompt("Cuisine (optional)");
    const address = prompt("Address (optional)");
    const image_url = prompt("Image URL (optional)");
    const description = prompt("Description (optional)");

    await supabase.from("restaurant").insert([
      {
        restaurant_name,
        cuisine,
        address,
        image_url,
        description,
      },
    ]);

    fetchRestaurants();
  }

  async function addItemToRestaurant(restaurantId) {
    const item_name = prompt("Item name (required)");
    if (!item_name) return;
    const priceStr = prompt("Price (required)");
    const price = Number(priceStr) || 0;
    const description = prompt("Description (optional)");
    const image_url = prompt("Image URL (optional)");
    const category = prompt("Category (optional)");
    const is_veg = confirm("Is this item vegetarian? OK = Yes, Cancel = No") ? true : false;

    await supabase.from("items").insert([
      {
        item_name,
        name: item_name,
        price,
        description,
        image_url,
        category,
        is_veg,
        restaurant_id: restaurantId,
      },
    ]);

    fetchRestaurants();
  }

  return (
    <MainLayout>

      <div
        style={{
          minHeight: "100vh",
          background: "#f4f4f4",
          padding: "30px",
        }}
      >

        <h1
          style={{
            fontSize: "36px",
            fontWeight: "700",
            marginBottom: "30px",
            color: "#111",
          }}
        >
          Manage Restaurants
        </h1>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <div style={{ fontSize: "20px", fontWeight: 600 }}>Restaurants ({restaurants.length})</div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={addRestaurant} style={{ background: "#10b981", color: "white", border: "none", padding: "10px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}>Add Restaurant</button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "25px",
          }}
        >

          {restaurants.map((restaurant) => (

            <div
              key={restaurant.id}
              style={{
                background: "#fff",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow:
                  "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >

              {/* IMAGE */}

              <img
                src={
                  restaurant.image_url ||
                  restaurant.image ||
                  "https://images.unsplash.com/photo-1504674900247-0877df9cc836"
                }
                alt={restaurant.restaurant_name || restaurant.name || `Restaurant ${restaurant.id}`}
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                }}
              />

              {/* CONTENT */}

              <div
                style={{
                  padding: "20px",
                }}
              >

                {/* NAME */}

                <h2
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#111",
                    marginBottom: "6px",
                  }}
                >
                  {restaurant.restaurant_name || restaurant.name || `Restaurant ${restaurant.id}`}
                </h2>

                {/* CUISINE */}

                <p
                  style={{
                    color: "#555",
                    marginBottom: "10px",
                    fontSize: "16px",
                  }}
                >
                  {restaurant.cuisine}
                </p>

                {/* RATING */}

                <p
                  style={{
                    color: "#111",
                    fontWeight: "600",
                    marginBottom: "18px",
                    fontSize: "16px",
                  }}
                >
                  ⭐ {restaurant.rating}
                </p>

                {/* MENU SECTION */}

                <div
                  style={{
                    background: "#f7f7f7",
                    padding: "15px",
                    borderRadius: "12px",
                    marginBottom: "20px",
                  }}
                >

                  <h3
                    style={{
                      marginBottom: "15px",
                      color: "#111",
                    }}
                  >
                    Menu Items
                  </h3>

                  {restaurant.items &&
                  restaurant.items.length > 0 ? (

                    restaurant.items.map((item) => (

                      <div
                        key={item.id}
                        style={{
                          background: "#fff",
                          borderRadius: "10px",
                          padding: "12px",
                          marginBottom: "10px",
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems: "center",
                          border:
                            "1px solid #eee",
                        }}
                      >

                        <div>

                          <h4
                            style={{
                              color: "#111",
                              marginBottom: "4px",
                              fontSize: "18px",
                            }}
                          >
                            {item.item_name || item.name}
                          </h4>

                          <p
                            style={{
                              color: "#444",
                              fontWeight: "600",
                            }}
                          >
                            ₹ {item.price}
                          </p>

                        </div>

                        <button
                          onClick={() => {

                            const newName =
                              prompt(
                                "Edit Item Name",
                                item.name
                              );

                            const newPrice =
                              prompt(
                                "Edit Item Price",
                                item.price
                              );

                            if (
                              !newName ||
                              !newPrice
                            )
                              return;

                            updateItem(
                              item.id,
                              newName,
                              newPrice
                            );
                          }}
                          style={{
                            background: "#2563eb",
                            color: "white",
                            border: "none",
                            padding:
                              "10px 14px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "600",
                          }}
                        >
                          Edit Item
                        </button>

                      </div>

                    ))

                  ) : (

                    <p
                      style={{
                        color: "#666",
                      }}
                    >
                      No menu items found
                    </p>

                  )}

                </div>

                {/* BUTTONS */}

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >

                  <button
                    onClick={async () => {
                      const updatedName = prompt("Restaurant name:", restaurant.restaurant_name || restaurant.name || "");
                      if (updatedName === null) return;
                      const cuisine = prompt("Cuisine:", restaurant.cuisine || "");
                      if (cuisine === null) return;
                      const address = prompt("Address:", restaurant.address || "");
                      if (address === null) return;
                      const image_url = prompt("Image URL:", restaurant.image_url || restaurant.image || "");
                      if (image_url === null) return;
                      const description = prompt("Description:", restaurant.description || "");
                      if (description === null) return;

                      const updates = {
                        restaurant_name: updatedName,
                        name: updatedName,
                        cuisine,
                        address,
                        image_url,
                        description,
                      };

                      await updateRestaurant(restaurant.id, updates);
                    }}
                    style={{
                      background: "#2563eb",
                      color: "#fff",
                      border: "none",
                      padding:
                        "12px 18px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Edit Restaurant
                  </button>

                  <button
                    onClick={() => addItemToRestaurant(restaurant.id)}
                    style={{
                      background: "#06b6d4",
                      color: "#fff",
                      border: "none",
                      padding: "12px 18px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Add Item
                  </button>

                  <button
                    onClick={() =>
                      deleteRestaurant(
                        restaurant.id
                      )
                    }
                    style={{
                      background: "red",
                      color: "#fff",
                      border: "none",
                      padding:
                        "12px 18px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </MainLayout>
  );
}