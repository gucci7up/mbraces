import { createClient } from '@supabase/supabase-js';

// Estas variables deben ser reemplazadas por las de tu proyecto en Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);