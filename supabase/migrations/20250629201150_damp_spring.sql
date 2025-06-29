/*
  # Create user_profiles table

  1. New Tables
    - `user_profiles`
      - `id` (integer, primary key, auto-increment)
      - `user_id` (uuid, foreign key to auth.users, unique)
      - `full_name` (text, nullable)
      - `guild_level` (text, default 'ROOKIE')
      - `xp` (integer, default 0)
      - `pathways_completed` (integer, default 0)
      - `guild_rank` (integer, default 999999)
      - `total_hours` (integer, default 0)
      - `projects_completed` (integer, default 0)
      - `learning_style` (text, nullable)
      - `experience_level` (text, nullable)
      - `career_goals` (text array, nullable)
      - `current_skills` (text array, nullable)
      - `evaluation_completed` (boolean, default false)
      - `evaluation_results` (jsonb, nullable)
      - `evaluation_answers` (jsonb, nullable)
      - `created_at` (timestamp with time zone, default now())
      - `updated_at` (timestamp with time zone, default now())

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policies for authenticated users to read and update their own data
    - Add policy for creating new profiles

  3. Functions
    - Create trigger function to automatically update `updated_at` timestamp
    - Create trigger to automatically create profile when user signs up
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT,
  guild_level TEXT DEFAULT 'ROOKIE',
  xp INTEGER DEFAULT 0,
  pathways_completed INTEGER DEFAULT 0,
  guild_rank INTEGER DEFAULT 999999,
  total_hours INTEGER DEFAULT 0,
  projects_completed INTEGER DEFAULT 0,
  learning_style TEXT,
  experience_level TEXT,
  career_goals TEXT[],
  current_skills TEXT[],
  evaluation_completed BOOLEAN DEFAULT false,
  evaluation_results JSONB,
  evaluation_answers JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update updated_at on profile changes
DROP TRIGGER IF EXISTS on_user_profile_updated ON user_profiles;
CREATE TRIGGER on_user_profile_updated
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, ignore
    RETURN new;
  WHEN OTHERS THEN
    -- Log error but don't fail user creation
    RAISE WARNING 'Failed to create user profile for %: %', new.id, SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_guild_level ON user_profiles(guild_level);
CREATE INDEX IF NOT EXISTS idx_user_profiles_xp ON user_profiles(xp);