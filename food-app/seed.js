import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { menuItems } from './src/data/menuItems.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedMenuItems() {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .insert(menuItems);

    if (error) {
      console.error('Error seeding menu items:', error);
    } else {
      console.log('Menu items seeded successfully:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

seedMenuItems();