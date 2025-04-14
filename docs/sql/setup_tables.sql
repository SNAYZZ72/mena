-- Create a secure schema for our application
CREATE SCHEMA IF NOT EXISTS mena;

-- Enable Row Level Security
ALTER TABLE IF EXISTS mena.hair_profiles ENABLE ROW LEVEL SECURITY;

-- Create hair_profiles table
CREATE TABLE IF NOT EXISTS mena.hair_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  gender TEXT,
  hair_type TEXT,
  hair_length TEXT,
  hair_density TEXT,
  hair_texture TEXT,
  scalp_condition TEXT,
  hair_concerns TEXT[],
  hair_goals TEXT[],
  routine_preference TEXT,
  product_preference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_hair_profiles_user_id ON mena.hair_profiles(user_id);

-- Set up Row Level Security policies
-- Users can only view their own profile
CREATE POLICY view_own_profile ON mena.hair_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own profile
CREATE POLICY insert_own_profile ON mena.hair_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own profile
CREATE POLICY update_own_profile ON mena.hair_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION mena.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on hair_profiles table
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON mena.hair_profiles
FOR EACH ROW
EXECUTE FUNCTION mena.set_updated_at();

-- Add this table to the public API
ALTER TABLE mena.hair_profiles ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE mena.hair_profiles IS 'User hair profiles for personalization';

-- Grant access to authenticated users
GRANT ALL ON mena.hair_profiles TO authenticated;
GRANT USAGE ON SCHEMA mena TO authenticated;