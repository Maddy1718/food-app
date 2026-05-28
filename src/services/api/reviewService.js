import { supabase } from "../supabase";

// FETCH REVIEWS BY RESTAURANT
export const fetchReviewsByRestaurant =
  async (restaurantId) => {

    try {

      const { data, error } =
        await supabase

          .from("reviews")

          .select(`
            *,
            customer (
              customer_name
            )
          `)

          .eq(
            "restaurant_id",
            restaurantId
          )

          .order(
            "created_at",
            {
              ascending: false,
            }
          );

      if (error) {

        console.error(
          "Error fetching reviews:",
          error
        );

        return [];
      }

      return data || [];

    } catch (err) {

      console.error(
        "Unexpected reviews fetch error:",
        err
      );

      return [];
    }
  };

// ADD REVIEW
export const addReview =
  async ({
    customer_id,
    restaurant_id,
    placed_order_id,
    rating,
    review_text,
  }) => {

    try {

      const { data, error } =
        await supabase

          .from("reviews")

          .insert([
            {
              customer_id,
              restaurant_id,
              placed_order_id,
              rating,
              review_text,
            },
          ])

          .select()

          .single();

      if (error) {

        console.error(
          "Error adding review:",
          error
        );

        return null;
      }

      // UPDATE RESTAURANT RATING
      await updateRestaurantRating(
        restaurant_id
      );

      return data;

    } catch (err) {

      console.error(
        "Unexpected add review error:",
        err
      );

      return null;
    }
  };

// UPDATE RESTAURANT AVERAGE RATING
export const updateRestaurantRating =
  async (restaurantId) => {

    try {

      const { data, error } =
        await supabase

          .from("reviews")

          .select("rating")

          .eq(
            "restaurant_id",
            restaurantId
          );

      if (error) {

        console.error(
          "Rating fetch error:",
          error
        );

        return;
      }

      const reviews =
        data || [];

      if (!reviews.length)
        return;

      const averageRating =
        reviews.reduce(
          (sum, review) =>
            sum + review.rating,
          0
        ) / reviews.length;

      const roundedRating =
        Number(
          averageRating.toFixed(1)
        );

      const { error: updateError } =
        await supabase

          .from("restaurant")

          .update({
            rating:
              roundedRating,
          })

          .eq(
            "id",
            restaurantId
          );

      if (updateError) {

        console.error(
          "Restaurant rating update error:",
          updateError
        );
      }

    } catch (err) {

      console.error(
        "Unexpected rating update error:",
        err
      );
    }
  };