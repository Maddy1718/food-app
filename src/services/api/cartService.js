import { supabase } from "../supabase";

// NORMALIZE CART ITEM
const normalizeCartItem = (
  cartItem = {}
) => {

  const item =
    cartItem.items || {};

  const category =
    item.category
      ?.category_name ||
    "Main Course";

  return {
    cartItemId:
      cartItem.id,

    id:
      item.id,

    name:
      item.item_name ||
      "",

    image_url:
      item.image_url ||
      "",

    description:
      item.description ||
      "",

    price:
      Number(item.price) || 0,

    quantity:
      cartItem.quantity || 1,

    total_price:
      Number(
        cartItem.total_price
      ) || 0,

    restaurant_id:
      item.restaurant_id ||
      null,

    category,
  };
};

// GET CUSTOMER
const getCustomerId =
  async ({
    authId,
    email,
  }) => {

    const {
      data,
      error,
    } = await supabase

      .from("customer")

      .select("id")

      .or(
        `auth_id.eq.${authId},email.eq.${email}`
      )

      .single();

    if (error || !data) {
      console.error(
        "Customer lookup failed:",
        error
      );

      return null;
    }

    return data.id;
  };

// FETCH CART
export const fetchCartByCustomer =
  async ({
    authId,
    email,
  }) => {

    try {

      const customerId =
        await getCustomerId({
          authId,
          email,
        });

      if (!customerId) {
        return {
          items: [],
        };
      }

      const {
        data,
        error,
      } = await supabase

        .from("cart")

        .select(`
          *,
          items (
            *,
            category (
              id,
              category_name
            )
          )
        `)

        .eq(
          "customer_id",
          customerId
        );

      if (error) {

        console.error(
          "Error fetching cart:",
          error
        );

        return {
          items: [],
        };
      }

      return {
        items:
          (data || []).map(
            normalizeCartItem
          ),
      };

    } catch (err) {

      console.error(
        "Unexpected error fetching cart:",
        err
      );

      return {
        items: [],
      };
    }
  };

// ADD TO CART
export const addCartItem =
  async (
    user,
    item,
    quantity = 1
  ) => {

    try {

      const customerId =
        await getCustomerId(
          user
        );

      if (!customerId)
        return null;

      // CHECK EXISTING
      const {
        data: existing,
      } = await supabase

        .from("cart")

        .select("*")

        .eq(
          "customer_id",
          customerId
        )

        .eq(
          "item_id",
          item.id
        )

        .maybeSingle();

      // UPDATE EXISTING
      if (existing) {

        const newQuantity =
          existing.quantity +
          quantity;

        const totalPrice =
          newQuantity *
          Number(item.price);

        await supabase

          .from("cart")

          .update({
            quantity:
              newQuantity,
            total_price:
              totalPrice,
          })

          .eq(
            "id",
            existing.id
          );

      } else {

        // INSERT NEW
        await supabase

          .from("cart")

          .insert([
            {
              customer_id:
                customerId,

              item_id:
                item.id,

              quantity,

              total_price:
                quantity *
                Number(
                  item.price
                ),
            },
          ]);
      }

      return await fetchCartByCustomer(
        user
      );

    } catch (err) {

      console.error(
        "Unexpected error adding cart item:",
        err
      );

      return null;
    }
  };

// UPDATE QUANTITY
export const updateCartItemQuantity =
  async (
    cartItemId,
    quantity
  ) => {

    try {

      const {
        data: cartItem,
      } = await supabase

        .from("cart")

        .select(`
          *,
          items (*)
        `)

        .eq(
          "id",
          cartItemId
        )

        .single();

      if (!cartItem)
        return null;

      const total_price =
        Number(
          cartItem.items
            ?.price || 0
        ) * quantity;

      const {
        error,
      } = await supabase

        .from("cart")

        .update({
          quantity,
          total_price,
        })

        .eq(
          "id",
          cartItemId
        );

      if (error) {
        console.error(error);
        return null;
      }

      return true;

    } catch (err) {

      console.error(
        "Unexpected error updating cart:",
        err
      );

      return null;
    }
  };

// REMOVE ITEM
export const removeCartItem =
  async (cartItemId) => {

    try {

      const {
        error,
      } = await supabase

        .from("cart")

        .delete()

        .eq(
          "id",
          cartItemId
        );

      if (error) {
        console.error(error);
        return null;
      }

      return true;

    } catch (err) {

      console.error(
        "Unexpected error removing cart item:",
        err
      );

      return null;
    }
  };

// CLEAR CART
export const clearCart =
  async ({
    authId,
    email,
  }) => {

    try {

      const customerId =
        await getCustomerId({
          authId,
          email,
        });

      if (!customerId)
        return null;

      const {
        error,
      } = await supabase

        .from("cart")

        .delete()

        .eq(
          "customer_id",
          customerId
        );

      if (error) {
        console.error(error);
        return null;
      }

      return true;

    } catch (err) {

      console.error(
        "Unexpected error clearing cart:",
        err
      );

      return null;
    }
  };