import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Student {
  id?: string;
  student_id: string;
  name: string;
  created_at?: string;
}

export interface AttendanceRecord {
  id?: string;
  student_id: string;
  name: string;
  date: string; // YYYY-MM-DD
  timestamp?: string;
  status: 'PRESENT' | 'LATE' | 'ABSENT';
}
