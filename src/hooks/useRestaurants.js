import { useEffect, useState } from "react";

import { supabase } from "../services/supabase";

function useRestaurants() {

  const [restaurants, setRestaurants] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const fetchRestaurants = async () => {

    const { data, error } = await supabase

      .from("restaurants")

      .select("*");

    if (!error) {

      setRestaurants(data);
    }

    setLoading(false);
  };

  useEffect(() => {

    fetchRestaurants();

  }, []);

  return {
    restaurants,
    loading,
  };
}

export default useRestaurants;