import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  profession: string;
  income_bracket: string;
  financial_goals: string[];
  interests: string[];
  risk_profile: string;
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Recommendation {
  id: string;
  user_id: string;
  product_type: string;
  product_name: string;
  reason: string;
  priority: number;
  accepted: boolean;
  created_at: string;
}
