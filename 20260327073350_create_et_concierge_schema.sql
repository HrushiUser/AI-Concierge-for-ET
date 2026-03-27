/*
  # ET AI Concierge Database Schema

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `profession` (text)
      - `income_bracket` (text)
      - `financial_goals` (jsonb)
      - `interests` (jsonb)
      - `risk_profile` (text)
      - `onboarding_complete` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `conversations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `messages` (jsonb)
      - `profiling_data` (jsonb)
      - `created_at` (timestamptz)
    
    - `recommendations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `product_type` (text)
      - `product_name` (text)
      - `reason` (text)
      - `priority` (integer)
      - `accepted` (boolean)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text DEFAULT '',
  profession text DEFAULT '',
  income_bracket text DEFAULT '',
  financial_goals jsonb DEFAULT '[]'::jsonb,
  interests jsonb DEFAULT '[]'::jsonb,
  risk_profile text DEFAULT '',
  onboarding_complete boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  messages jsonb DEFAULT '[]'::jsonb,
  profiling_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  product_type text NOT NULL,
  product_name text NOT NULL,
  reason text DEFAULT '',
  priority integer DEFAULT 0,
  accepted boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own conversations"
  ON conversations FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read own recommendations"
  ON recommendations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own recommendations"
  ON recommendations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own recommendations"
  ON recommendations FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow anonymous access to user_profiles"
  ON user_profiles FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous access to conversations"
  ON conversations FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous access to recommendations"
  ON recommendations FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);