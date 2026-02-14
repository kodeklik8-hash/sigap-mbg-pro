
import { createClient } from '@supabase/supabase-js';

/**
 * SIGAP MBG Supabase Configuration
 * Data ini diatur secara langsung untuk menghubungkan aplikasi ke database produksi.
 */

const supabaseUrl = 'https://htzclbmnrgzxpwqutzhk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0emNsYm1ucmd6eHB3cXV0emhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNDUxMDYsImV4cCI6MjA4NjYyMTEwNn0.UlzauHDds__S3bxvy57IYCK3SLOJQH6HJ18zfr6fa9U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
