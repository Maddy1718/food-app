import { supabase }
  from "./supabase";

export const uploadImage =
  async (file) => {

    if (!file) {

      return null;
    }

    // UNIQUE FILE NAME
    const fileName =
      `${Date.now()}-${file.name}`;

    // UPLOAD
    const {
      error,
    } = await supabase.storage

      .from("food-images")

      .upload(
        fileName,
        file
      );

    if (error) {

      console.log(error);

      return null;
    }

    // GET PUBLIC URL
    const {
      data,
    } = supabase.storage

      .from("food-images")

      .getPublicUrl(fileName);

    return data.publicUrl;
  };