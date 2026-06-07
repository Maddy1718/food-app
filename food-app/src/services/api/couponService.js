import { supabase } from "../supabase";

export const fetchCoupons = async () => {
  try {
    const { data, error } = await supabase
      .from("coupon")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching coupons:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Unexpected error fetching coupons:", err);
    return [];
  }
};

export const fetchCouponByCode = async (code) => {
  try {
    const { data, error } = await supabase
      .from("coupon")
      .select("*")
      .eq("coupon_code", code)
      .single();

    if (error) {
      console.error(`Error fetching coupon ${code}:`, error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error fetching coupon:", err);
    return null;
  }
};
