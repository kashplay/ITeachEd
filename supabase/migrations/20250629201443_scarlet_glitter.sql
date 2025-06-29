/*
  # Fix User Profiles Table Schema

  1. New Tables
    - `user_profiles` - Complete user profile with learning data
      - `id` (serial, primary key)
      - `user_id` (uuid, unique foreign key to auth.users)
      - `full_name` (text)
      - `guild_level` (text, default 'ROOKIE')
      - `xp` (integer, default 0)
      - `pathways_completed` (integer, default 0)
      - `guild_rank` (integer, default 999999)
      - `total_hours` (integer, default 0)
      - `projects_completed` (integer, default 0)
      - `learning_style` (text)
      - `experience_level` (text)
      - `career_goals` (text array)
      - `current_skills` (text array)
      - `evaluation_completed` (boolean, default false)
      - `evaluation_results` (jsonb)
      - `evaluation_answers` (jsonb)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policies for authenticated users to manage their own profiles

  3. Functions & Triggers
    - Auto-update `updated_at` timestamp
    - Auto-create profile on user signup
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- Drop existing triggers to avoid conflicts
DROP TRIGGER IF EXISTS on_user_profile_updated ON user_profiles;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create user_profiles table with all required columns
CREATE TABLE IF NOT EXISTS user_profiles (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Add unique constraint on user_id if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_profiles_user_id_key' 
    AND table_name = 'user_profiles'
  ) THEN
    ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Add missing columns if they don't exist
DO $$
BEGIN
  -- Check and add learning_style column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'learning_style'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN learning_style TEXT;
  END IF;

  -- Check and add experience_level column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'experience_level'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN experience_level TEXT;
  END IF;

  -- Check and add career_goals column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'career_goals'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN career_goals TEXT[];
  END IF;

  -- Check and add current_skills column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'current_skills'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN current_skills TEXT[];
  END IF;

  -- Check and add evaluation_completed column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'evaluation_completed'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN evaluation_completed BOOLEAN DEFAULT false;
  END IF;

  -- Check and add evaluation_results column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'evaluation_results'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN evaluation_results JSONB;
  END IF;

  -- Check and add evaluation_answers column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'evaluation_answers'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN evaluation_answers JSONB;
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create fresh policies
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

-- Create trigger to update updated_at on profile changes
CREATE TRIGGER on_user_profile_updated
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail user creation
    RAISE WARNING 'Failed to create user profile for %: %', new.id, SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_guild_level ON user_profiles(guild_level);
CREATE INDEX IF NOT EXISTS idx_user_profiles_xp ON user_profiles(xp);
CREATE INDEX IF NOT EXISTS idx_user_profiles_evaluation_completed ON user_profiles(evaluation_completed);