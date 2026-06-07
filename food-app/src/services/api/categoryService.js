import { supabase } from "../supabase";

export const fetchCategories = async () => {
  try {
    const { data, error } = await supabase
      .from("category")
      .select("*")
      .order("category_name", { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Unexpected error fetching categories:", err);
    return [];
  }
};

export const fetchCategoryById = async (categoryId) => {
  try {
    const { data, error } = await supabase
      .from("category")
      .select("*")
      .eq("id", categoryId)
      .single();

    if (error) {
      console.error(`Error fetching category ${categoryId}:`, error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error fetching category:", err);
    return null;
  }
};
