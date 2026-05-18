import { supabase } from "../supabase";

export const fetchMenuItems = async () => {
  try {
    const { data, error } = await supabase.from("items").select("*");
    if (error) {
      console.error("Error fetching menu items:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Unexpected error fetching menu items:", err);
    return [];
  }
};

export const fetchMenuItemsByRestaurant = async (restaurantId) => {
  try {
    if (!restaurantId) {
      return [];
    }

    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("item_name", { ascending: true });

    if (error) {
      console.error(`Error fetching items for restaurant ${restaurantId}:`, error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Unexpected error fetching menu items by restaurant:", err);
    return [];
  }
};

export const fetchMenuItemsByIds = async (itemIds = []) => {
  if (!itemIds.length) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .in("id", itemIds);

    if (error) {
      console.error("Error fetching menu items by ids:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Unexpected error fetching menu items by ids:", err);
    return [];
  }
};

export const searchMenuItems = async (query) => {
  if (!query) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .ilike("item_name", `%${query}%`)
      .or(`description.ilike.%${query}%, ingredients.ilike.%${query}%`)
      .order("item_name", { ascending: true });

    if (error) {
      console.error("Error searching menu items:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Unexpected error searching menu items:", err);
    return [];
  }
};

export const fetchCategories = async () => {
  try {
    const { data, error } = await supabase.from("category").select("*").order("category_name", { ascending: true });
    if (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Unexpected error fetching categories:", err);
    return [];
  }
};

export const fetchMenuItemsByRestaurantName = async (restaurantName) => {
  if (!restaurantName) {
    return [];
  }

  try {
    const searchValue = restaurantName.trim();
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .or(`restaurant_name.ilike.%${searchValue}%,name.ilike.%${searchValue}%`)
      .order("item_name", { ascending: true });

    if (error) {
      console.error(
        `Error fetching items for restaurant name ${restaurantName}:", error`
      );
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Unexpected error fetching items by restaurant name:", err);
    return [];
  }
};
