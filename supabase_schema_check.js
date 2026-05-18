import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yhkppvundpvzajhzcgdh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inloa3BwdnVuZHB2emFqaHpjZ2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NzAxMDAsImV4cCI6MjA5NDE0NjEwMH0.TxDJMoR6q_Phb-K9AOzCkXDqUOnLOHqg6vzIiJzzMS0';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const main = async () => {
  const { data: tables, error: tablesError } = await supabase
    .from('information_schema.tables')
    .select('table_name, table_schema')
    .eq('table_schema', 'public');
  console.log('tablesError', tablesError);
  console.log('tables', tables);

  const { data: columns, error: columnsError } = await supabase
    .from('information_schema.columns')
    .select('table_name, column_name, data_type')
    .eq('table_schema', 'public')
    .order('table_name');
  console.log('columnsError', columnsError);
  console.log('columns', columns);
};

main();
