import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://prqgbrnmtklmyngwbqpv.supabase.co';
const supabaseAnonKey = 'sb_publishable__N49G8UhD5Z494Fz-zJ9CA_I3bzQH6N';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
