import { useEffect, useState } from "react";

import { supabase } from "../services/supabase";

function useMenuItems(restaurantId) {

  const [menuItems, setMenuItems] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const fetchMenuItems = async () => {

    const { data, error } = await supabase

      .from("menu_items")

      .select("*")

      .eq("restaurant_id", restaurantId);

    if (!error) {

      setMenuItems(data);
    }

    setLoading(false);
  };

  useEffect(() => {

    fetchMenuItems();

  }, [restaurantId]);

  return {
    menuItems,
    loading,
  };
}

export default useMenuItems;