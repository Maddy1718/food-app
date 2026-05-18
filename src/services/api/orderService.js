import { supabase } from "../supabase";

export const createPlacedOrder = async (orderData) => {
  try {
    const { data, error } = await supabase.from("placed_order").insert([orderData]).select();
    if (error) {
      console.error("Error creating placed order:", error);
      return null;
    }
    return data?.[0] || null;
  } catch (err) {
    console.error("Unexpected error creating placed order:", err);
    return null;
  }
};

export const fetchPlacedOrders = async (customerId) => {
  try {
    const { data, error } = await supabase
      .from("placed_order")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching placed orders:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Unexpected error fetching placed orders:", err);
    return [];
  }
};

export const fetchAllPlacedOrders = async () => {
  try {
    const { data, error } = await supabase.from("placed_order").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching all placed orders:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Unexpected error fetching all placed orders:", err);
    return [];
  }
};

export const updatePlacedOrderStatus = async (orderId, status) => {
  try {
    const { data, error } = await supabase
      .from("placed_order")
      .update({ order_status: status })
      .eq("id", orderId)
      .select();

    if (error) {
      console.error("Error updating placed order status:", error);
      return null;
    }

    return data?.[0] || null;
  } catch (err) {
    console.error("Unexpected error updating placed order:", err);
    return null;
  }
};

export const fetchOrders = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Unexpected error fetching orders:", err);
    return [];
  }
};

export const fetchOrderHistory = async () => {
  try {
    const { data, error } = await supabase.from("order_history").select("*");
    if (error) {
      console.error("Error fetching order history:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Unexpected error fetching order history:", err);
    return [];
  }
};

export const createOrder = async (orderData) => {
  return await createPlacedOrder(orderData);
};

export const fetchAllOrders = async () => {
  return await fetchAllPlacedOrders();
};

export const updateOrderStatus = async (orderId, status) => {
  return await updatePlacedOrderStatus(orderId, status);
};
