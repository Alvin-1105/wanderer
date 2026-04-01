import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and Anon Key from environment variables.
// Vite loads .env variables that are prefixed with VITE_. 
// We will also configure vite.config.ts to inject process.env just in case.
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder_anon_key'
);
