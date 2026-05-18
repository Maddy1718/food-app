import { supabase } from "../supabase";
import { fetchMenuItemsByIds } from "./menuService";

export const fetchCartByCustomer = async (customerId) => {
  try {
    const { data: cart, error: cartError } = await supabase
      .from("cart")
      .select("*")
      .eq("customer_id", customerId)
      .single();

    if (cartError) {
      console.error("Error fetching cart:", cartError);
      return { cart: null, items: [] };
    }

    if (!cart) {
      return { cart: null, items: [] };
    }

    const { data: cartItems, error: cartItemError } = await supabase
      .from("cart_item")
      .select("*")
      .eq("cart_id", cart.id);

    if (cartItemError) {
      console.error("Error fetching cart items:", cartItemError);
      return { cart, items: [] };
    }

    const menuItemIds = cartItems.map((row) => row.menu_item_id).filter(Boolean);
    const menuItems = menuItemIds.length
      ? await fetchMenuItemsByIds(menuItemIds)
      : [];

    const itemsById = new Map(menuItems.map((item) => [item.id, item]));

    const items = cartItems.map((row) => {
      const menuItem = itemsById.get(row.menu_item_id) || {};
      return {
        id: menuItem.id || row.menu_item_id,
        cartItemId: row.id,
        menu_item_id: row.menu_item_id,
        name: menuItem.item_name || menuItem.name || "Item",
        item_name: menuItem.item_name || menuItem.name || "Item",
        description: menuItem.description || "",
        price: row.item_price ?? menuItem.price ?? 0,
        image_url: menuItem.image_url || menuItem.image || "",
        quantity: row.quantity,
        total_price: row.total_price ?? (row.quantity * (row.item_price ?? menuItem.price ?? 0)),
      };
    });

    return { cart, items };
  } catch (err) {
    console.error("Unexpected error fetching cart by customer:", err);
    return { cart: null, items: [] };
  }
};

export const createCartForCustomer = async (customerId) => {
  try {
    const { data, error } = await supabase
      .from("cart")
      .insert([{ customer_id: customerId }])
      .select()
      .single();

    if (error) {
      console.error("Error creating cart:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error creating cart:", err);
    return null;
  }
};

export const addCartItem = async (customerId, menuItem, quantity = 1) => {
  try {
    let { cart } = await fetchCartByCustomer(customerId);
    if (!cart) {
      cart = await createCartForCustomer(customerId);
    }

    if (!cart) {
      return null;
    }

    const { data: existingItems, error: existingError } = await supabase
      .from("cart_item")
      .select("*")
      .eq("cart_id", cart.id)
      .eq("menu_item_id", menuItem.id)
      .single();

    if (existingError && existingError.code !== "PGRST116") {
      console.error("Error checking existing cart item:", existingError);
      return null;
    }

    if (existingItems) {
      const updatedQuantity = existingItems.quantity + quantity;
      const { error: updateError } = await supabase
        .from("cart_item")
        .update({
          quantity: updatedQuantity,
          total_price: updatedQuantity * (existingItems.item_price ?? menuItem.price ?? 0),
        })
        .eq("id", existingItems.id);

      if (updateError) {
        console.error("Error updating cart item quantity:", updateError);
        return null;
      }
    } else {
      const price = menuItem.price ?? 0;
      const { error: insertError } = await supabase.from("cart_item").insert([
        {
          cart_id: cart.id,
          menu_item_id: menuItem.id,
          quantity,
          item_price: price,
          total_price: quantity * price,
        },
      ]);

      if (insertError) {
        console.error("Error inserting cart item:", insertError);
        return null;
      }
    }

    return await fetchCartByCustomer(customerId);
  } catch (err) {
    console.error("Unexpected error adding cart item:", err);
    return null;
  }
};

export const updateCartItemQuantity = async (cartItemId, quantity) => {
  try {
    if (quantity <= 0) {
      return await removeCartItem(cartItemId);
    }

    const { data: itemRow, error: rowError } = await supabase
      .from("cart_item")
      .select("*")
      .eq("id", cartItemId)
      .single();

    if (rowError) {
      console.error("Error loading cart item:", rowError);
      return null;
    }

    const unitPrice = itemRow.item_price ?? 0;
    const { data, error } = await supabase
      .from("cart_item")
      .update({ quantity, total_price: quantity * unitPrice })
      .eq("id", cartItemId)
      .select();

    if (error) {
      console.error("Error updating cart item:", error);
      return null;
    }

    return data?.[0] || null;
  } catch (err) {
    console.error("Unexpected error updating cart item quantity:", err);
    return null;
  }
};

export const removeCartItem = async (cartItemId) => {
  try {
    const { data, error } = await supabase
      .from("cart_item")
      .delete()
      .eq("id", cartItemId)
      .select();

    if (error) {
      console.error("Error removing cart item:", error);
      return null;
    }

    return data || [];
  } catch (err) {
    console.error("Unexpected error removing cart item:", err);
    return null;
  }
};

export const clearCart = async (customerId) => {
  try {
    const { cart } = await fetchCartByCustomer(customerId);
    if (!cart) {
      return null;
    }

    const { data, error } = await supabase
      .from("cart_item")
      .delete()
      .eq("cart_id", cart.id)
      .select();

    if (error) {
      console.error("Error clearing cart:", error);
      return null;
    }

    return data || [];
  } catch (err) {
    console.error("Unexpected error clearing cart:", err);
    return null;
  }
};
