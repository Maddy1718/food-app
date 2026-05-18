import { supabase } from "../supabase";

export const fetchOffers = async () => {
  try {
    const { data, error } = await supabase
      .from("offer")
      .select("*")
      .order("valid_from", { ascending: false });

    if (error) {
      console.error("Error fetching offers:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Unexpected error fetching offers:", err);
    return [];
  }
};

export const fetchActiveOffers = async () => {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("offer")
      .select("*")
      .lte("valid_from", now)
      .gte("valid_to", now)
      .order("valid_from", { ascending: false });

    if (error) {
      console.error("Error fetching active offers:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Unexpected error fetching active offers:", err);
    return [];
  }
};

export const fetchOffersByRestaurant = async (restaurantId) => {
  try {
    const { data, error } = await supabase
      .from("offer")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("valid_from", { ascending: false });

    if (error) {
      console.error("Error fetching restaurant offers:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Unexpected error fetching restaurant offers:", err);
    return [];
  }
};
