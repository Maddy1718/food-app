import { supabase } from "../supabase";

export const fetchLocations = async () => {
  try {
    const { data, error } = await supabase.from("locations").select("*");
    if (error) {
      console.error("Error fetching locations:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Unexpected error fetching locations:", err);
    return [];
  }
};
