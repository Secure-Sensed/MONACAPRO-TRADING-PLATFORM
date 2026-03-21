import { createClient } from '@supabase/supabase-js';

// These should be replaced by actual environment variables (.env)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
