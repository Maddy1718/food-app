import { supabase } from "../supabase";

export const fetchFavoriteRestaurants = async (customerId) => {
  try {
    const { data, error } = await supabase
      .from("favorite_restaurant")
      .select("*")
      .eq("customer_id", customerId);

    if (error) {
      console.error("Error fetching favorite restaurants:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Unexpected error fetching favorite restaurants:", err);
    return [];
  }
};

export const fetchFavoriteItems = async (customerId) => {
  try {
    const { data, error } = await supabase
      .from("favorite_item")
      .select("*")
      .eq("customer_id", customerId);

    if (error) {
      console.error("Error fetching favorite items:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Unexpected error fetching favorite items:", err);
    return [];
  }
};

export const toggleFavoriteRestaurant = async (customerId, restaurantId, enabled) => {
  try {
    if (enabled) {
      const { data, error } = await supabase
        .from("favorite_restaurant")
        .insert([{ customer_id: customerId, restaurant_id: restaurantId }])
        .select();

      if (error) {
        console.error("Error adding favorite restaurant:", error);
        return null;
      }

      return data?.[0] || null;
    }

    const { data, error } = await supabase
      .from("favorite_restaurant")
      .delete()
      .eq("customer_id", customerId)
      .eq("restaurant_id", restaurantId)
      .select();

    if (error) {
      console.error("Error removing favorite restaurant:", error);
      return null;
    }

    return data || [];
  } catch (err) {
    console.error("Unexpected error toggling favorite restaurant:", err);
    return null;
  }
};

export const toggleFavoriteItem = async (customerId, itemId, enabled) => {
  try {
    if (enabled) {
      const { data, error } = await supabase
        .from("favorite_item")
        .insert([{ customer_id: customerId, item_id: itemId }])
        .select();

      if (error) {
        console.error("Error adding favorite item:", error);
        return null;
      }

      return data?.[0] || null;
    }

    const { data, error } = await supabase
      .from("favorite_item")
      .delete()
      .eq("customer_id", customerId)
      .eq("item_id", itemId)
      .select();

    if (error) {
      console.error("Error removing favorite item:", error);
      return null;
    }

    return data || [];
  } catch (err) {
    console.error("Unexpected error toggling favorite item:", err);
    return null;
  }
};
