import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yhkppvundpvzajhzcgdh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inloa3BwdnVuZHB2emFqaHpjZ2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NzAxMDAsImV4cCI6MjA5NDE0NjEwMH0.TxDJMoR6q_Phb-K9AOzCkXDqUOnLOHqg6vzIiJzzMS0';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const probe = async () => {
  const tests = {
    cart: ['id', 'customer_id', 'created_at', 'updated_at', 'restaurant_id', 'status', 'total_price', 'discount', 'customer_email', 'delivery_address'],
    cart_item: ['id', 'cart_id', 'menu_item_id', 'quantity', 'total_price', 'unit_price', 'item_price', 'item_name', 'item_description', 'item_image'],
    placed_order: ['id', 'customer_id', 'restaurant_id', 'order_time', 'estimated_delivery_time', 'food_ready', 'actual_delivery_time', 'delivery_address', 'price', 'discount', 'total_price', 'order_status', 'created_at', 'updated_at', 'customer_email'],
    orders: ['id', 'user_id', 'items', 'total', 'status', 'created_at', 'deleted_at'],
    favorite_restaurant: ['id', 'customer_id', 'restaurant_id', 'created_at', 'deleted_at'],
    favorite_item: ['id', 'customer_id', 'item_id', 'created_at', 'deleted_at'],
    delivery_tracking: ['id', 'order_id', 'updated_at', 'status', 'location', 'tracking_details'],
    delivery_partner: ['id', 'phone', 'created_at', 'name', 'status', 'email', 'vehicle'],
    locations: ['id', 'created_at', 'city_id', 'code', 'type', 'region', 'name', 'address'],
    offer: ['id', 'restaurant_id', 'valid_from', 'valid_to', 'discount', 'name', 'expiry_date', 'status', 'value', 'description'],
    coupon: ['id', 'coupon_code', 'created_at', 'description', 'expires_at', 'status', 'discount_value'],
    order_history: ['id', 'customer_id', 'order_id', 'order_status', 'created_at', 'total_price']
  };

  for (const [table, cols] of Object.entries(tests)) {
    console.log('===', table);
    for (const col of cols) {
      const { error } = await supabase.from(table).select(col).limit(1);
      console.log(col, error ? error.message : 'OK');
    }
  }
};

probe();
