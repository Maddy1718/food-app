export const normalizeRestaurant = (restaurant = {}) => ({
  id: restaurant.id,

  name:
    restaurant.restaurant_name ||
    restaurant.name ||
    "",

  image_url:
    restaurant.image_url ||
    restaurant.image ||
    "",

  category:
    restaurant.category ||
    restaurant.cuisine ||
    "",

  cuisine:
    restaurant.cuisine ||
    restaurant.category ||
    "",

  description:
    restaurant.description ||
    "",

  address:
    restaurant.address ||
    "",

  rating:
    Number(restaurant.rating) || 0,

  delivery_time:
    restaurant.delivery_time ||
    "20-30 mins",

  delivery_fee:
    restaurant.delivery_fee ||
    "Free",

  offer:
    restaurant.offer ||
    restaurant.discount ||
    "",

  status:
    restaurant.status ||
    restaurant.open_status ||
    "Open",
});

export const normalizeMenuItem = (item = {}) => ({
  id: item.id,

  name:
    item.item_name ||
    item.name ||
    "",

  image_url:
    item.image_url ||
    item.image ||
    "",

  category:
    item.category ||
    item.cuisine ||
    "Uncategorized",

  description:
    item.description ||
    "",

  ingredients:
    item.ingredients ||
    "",

  price:
    Number(item.price) || 0,

  is_veg:
  item.is_veg === true ||
  item.is_veg === "true" ||
  item.is_veg === "veg" ||
  item.is_veg === "Veg" ||
  item.is_veg === 1 ||
  item.food_type === "veg",

  restaurant_id:
    item.restaurant_id || null,
});