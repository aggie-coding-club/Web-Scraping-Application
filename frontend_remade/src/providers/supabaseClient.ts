import { createClient } from '@supabase/supabase-js';

const supabaseUrl: string = 'https://oumstviczrvxmknqgkcp.supabase.co';
const supabaseAnonKey: string | undefined = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey as string);
