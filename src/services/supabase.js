import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://yhkppvundpvzajhzcgdh.supabase.co";

const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inloa3BwdnVuZHB2emFqaHpjZ2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NzAxMDAsImV4cCI6MjA5NDE0NjEwMH0.TxDJMoR6q_Phb-K9AOzCkXDqUOnLOHqg6vzIiJzzMS0";

export const supabase =
  createClient(
    supabaseUrl,
    supabaseAnonKey
  );