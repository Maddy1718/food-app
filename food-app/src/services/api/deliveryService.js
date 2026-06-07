import { supabase } from "../supabase";

export const fetchDeliveryTracking = async (orderId) => {
  try {
    const { data, error } = await supabase
      .from("delivery_tracking")
      .select("*")
      .eq("order_id", orderId)
      .order("updated_at", { ascending: true });

    if (error) {
      console.error("Error fetching delivery tracking:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Unexpected error fetching delivery tracking:", err);
    return [];
  }
};

export const fetchDeliveryPartners = async () => {
  try {
    const { data, error } = await supabase.from("delivery_partner").select("*");
    if (error) {
      console.error("Error fetching delivery partners:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Unexpected error fetching delivery partners:", err);
    return [];
  }
};
