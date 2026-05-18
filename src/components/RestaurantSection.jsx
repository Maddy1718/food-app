import RestaurantCard from "./RestaurantCard";

import useRestaurants from "../hooks/useRestaurants";

function RestaurantSection() {

  const {
    restaurants,
    loading,
  } = useRestaurants();

  if (loading) {

    return (
      <h1 className="mt-10">
        Loading restaurants...
      </h1>
    );
  }

  return (

    <div className="mt-10">

      <div className="flex items-center justify-between mb-5">

        <h2 className="text-2xl font-bold">
          Popular Restaurants
        </h2>

        <button className="text-orange-500 font-medium">
          View All
        </button>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {
          restaurants.map((restaurant) => (

            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
            />
          ))
        }

      </div>

    </div>
  );
}

export default RestaurantSection;