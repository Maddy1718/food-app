import { supabase } from "../supabase";
import { normalizeRestaurant } from "../../utils/normalizers";

export const fetchRestaurants = async () => {
  try {
    const { data, error } = await supabase
      .from("restaurant")
      .select("*");

    if (error) {
      console.error("Error fetching restaurants:", error);
      return [];
    }

    return (data || []).map(normalizeRestaurant);
  } catch (err) {
    console.error("Unexpected error fetching restaurants:", err);
    return [];
  }
};

export const fetchUniqueBrands = async () => {
  try {
    const restaurants = await fetchRestaurants();

    const brandMap = new Map();

    restaurants.forEach((restaurant) => {
      const brandKey = restaurant.name
        ?.trim()
        .toLowerCase();

      if (!brandMap.has(brandKey)) {
        brandMap.set(brandKey, restaurant);
      }
    });

    return Array.from(brandMap.values());
  } catch (err) {
    console.error("Unexpected error fetching unique brands:", err);
    return [];
  }
};

export const fetchBranchesByName = async (restaurantName) => {
  try {
    const { data, error } = await supabase
      .from("restaurant")
      .select("*")
      .eq("restaurant_name", restaurantName)
      .order("id", { ascending: true });

    if (error) {
      console.error(
        `Error fetching branches for ${restaurantName}:`,
        error
      );
      return [];
    }

    return (data || []).map(normalizeRestaurant);
  } catch (err) {
    console.error(
      "Unexpected error fetching branches:",
      err
    );
    return [];
  }
};

export const fetchRestaurantById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("restaurant")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(
        "Error fetching restaurant by id:",
        error
      );
      return null;
    }

    return normalizeRestaurant(data);
  } catch (err) {
    console.error(
      "Unexpected error fetching restaurant by id:",
      err
    );
    return null;
  }
};

export const fetchRestaurantsByCategory = async (
  categoryName
) => {
  try {
    const { data, error } = await supabase
      .from("restaurant")
      .select("*")
      .ilike("category", `%${categoryName}%`);

    if (error) {
      console.error(
        `Error fetching restaurants by category ${categoryName}:`,
        error
      );
      return [];
    }

    return (data || []).map(normalizeRestaurant);
  } catch (err) {
    console.error(
      "Unexpected error fetching restaurants by category:",
      err
    );
    return [];
  }
};