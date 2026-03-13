import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('CRITICAL ERROR: Supabase environment variables are missing!');
  console.error('- SUPABASE_URL exists:', !!supabaseUrl);
  console.error('- SUPABASE_API_KEY exists:', !!supabaseKey);
}

const db = createClient(supabaseUrl || '', supabaseKey || '');

console.log('✓ Connected to Supabase database');

export default db;

