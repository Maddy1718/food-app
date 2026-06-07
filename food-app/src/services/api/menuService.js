import { supabase } from "../supabase";

// NORMALIZE MENU ITEM
const normalizeMenuItem = (item = {}) => ({
  id: item.id,

  item_name:
    item.item_name ||
    item.name ||
    "",

  name:
    item.item_name ||
    item.name ||
    "",

  image_url:
    item.image_url ||
    "",

  description:
    item.description ||
    "",

  ingredients:
    item.ingredients ||
    "",

  recipe:
    item.recipe ||
    "",

  food_type:
    item.food_type ||
    "",

  price:
    Number(item.price) || 0,

  restaurant_id:
    item.restaurant_id || null,

  category_id:
    item.category_id || null,

  category:
    item.category?.category_name ||
    item.category ||
    "Main Course",

  stock_status:
    item.stock_status ||
    "In Stock",

  active:
    item.active ?? true,
});

// FETCH ALL MENU ITEMS
export const fetchMenuItems =
  async () => {
    try {

      const {
        data,
        error,
      } = await supabase

        .from("items")

        .select(`
          *,
          category (
            id,
            category_name
          )
        `);

      if (error) {
        console.error(
          "Error fetching menu items:",
          error
        );

        return [];
      }

      return (data || []).map(
        normalizeMenuItem
      );

    } catch (err) {

      console.error(
        "Unexpected error fetching menu items:",
        err
      );

      return [];
    }
  };

// FETCH ITEMS BY RESTAURANT
export const fetchMenuItemsByRestaurant =
  async (restaurantId) => {

    try {

      if (!restaurantId)
        return [];

      console.log(
        "Fetching customer restaurant items",
        {
          restaurantId,
          active: true,
          stock_status: "Available",
        }
      );

      const {
        data,
        error,
      } = await supabase

        .from("items")

        .select(`
          *,
          category (
            id,
            category_name
          )
        `)

        .eq(
          "restaurant_id",
          restaurantId
        )

        .eq(
          "active",
          true
        )

        .eq(
          "stock_status",
          "Available"
        )

        .order(
          "item_name",
          {
            ascending: true,
          }
        );

      if (error) {

        console.error(
          "Error fetching restaurant menu:",
          error
        );

        return [];
      }

      console.log(
        "Fetched customer restaurant items",
        {
          restaurantId,
          count: (data || []).length,
          items: data || [],
        }
      );

      const normalizedItems = (data || []).map(
        normalizeMenuItem
      );

      console.log(
        "Normalized restaurant items",
        normalizedItems
      );

      return normalizedItems;

    } catch (err) {

      console.error(
        "Unexpected error fetching restaurant menu:",
        err
      );

      return [];
    }
  };

// FETCH MENU ITEMS BY IDS
export const fetchMenuItemsByIds =
  async (itemIds = []) => {

    try {

      if (!itemIds.length)
        return [];

      const {
        data,
        error,
      } = await supabase

        .from("items")

        .select(`
          *,
          category (
            id,
            category_name
          )
        `)

        .in("id", itemIds);

      if (error) {

        console.error(
          "Error fetching menu items by ids:",
          error
        );

        return [];
      }

      return (data || []).map(
        normalizeMenuItem
      );

    } catch (err) {

      console.error(
        "Unexpected error fetching items by ids:",
        err
      );

      return [];
    }
  };

// SEARCH MENU ITEMS
export const searchMenuItems =
  async (query) => {

    try {

      if (!query)
        return [];

      const {
        data,
        error,
      } = await supabase

        .from("items")

        .select(`
          *,
          category (
            id,
            category_name
          )
        `)

        .or(
          `item_name.ilike.%${query}%,description.ilike.%${query}%`
        );

      if (error) {

        console.error(
          "Error searching menu items:",
          error
        );

        return [];
      }

      return (data || []).map(
        normalizeMenuItem
      );

    } catch (err) {

      console.error(
        "Unexpected error searching items:",
        err
      );

      return [];
    }
  };

// FETCH CATEGORIES
export const fetchCategories =
  async () => {

    try {

      const {
        data,
        error,
      } = await supabase

        .from("category")

        .select("*")

        .order(
          "category_name",
          {
            ascending: true,
          }
        );

      if (error) {

        console.error(
          "Error fetching categories:",
          error
        );

        return [];
      }

      return data || [];

    } catch (err) {

      console.error(
        "Unexpected error fetching categories:",
        err
      );

      return [];
    }
  };