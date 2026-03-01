import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;

const db = createClient(supabaseUrl, supabaseKey);

console.log('✓ Connected to Supabase database');

export default db;

