/*
  # Create Custom Unit Data Table

  1. New Tables
    - `aos_custom_unit_data`
      - `id` (uuid, primary key)
      - `faction_id` (text, reference to faction)
      - `unit_id` (text, battlescribe unit ID)
      - `user_id` (uuid, reference to auth.users - for multi-user support)
      - `stl_files` (jsonb, array of STL file information)
      - `preview_image` (text, URL or path to preview image)
      - `print_notes` (text, notes about 3D printing)
      - `notes` (text, general notes)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `aos_custom_unit_data` table
    - Add policies for authenticated users to manage their own data
    - Add policies for anonymous users to manage data with null user_id

  3. Indexes
    - Index on faction_id and unit_id for fast lookups
    - Composite unique index on (user_id, faction_id, unit_id) to prevent duplicates
*/

CREATE TABLE IF NOT EXISTS aos_custom_unit_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  faction_id text NOT NULL,
  unit_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  stl_files jsonb DEFAULT '[]'::jsonb,
  preview_image text,
  print_notes text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_aos_custom_unit_data_faction_unit
  ON aos_custom_unit_data(faction_id, unit_id);

CREATE INDEX IF NOT EXISTS idx_aos_custom_unit_data_user
  ON aos_custom_unit_data(user_id);

-- Create unique constraint to prevent duplicate entries per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_aos_custom_unit_data_unique
  ON aos_custom_unit_data(COALESCE(user_id, '00000000-0000-0000-0000-000000000000'::uuid), faction_id, unit_id);

-- Enable Row Level Security
ALTER TABLE aos_custom_unit_data ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous users to read/write their own data (using null user_id)
CREATE POLICY "Allow anonymous users full access to their data"
  ON aos_custom_unit_data
  FOR ALL
  TO anon
  USING (user_id IS NULL)
  WITH CHECK (user_id IS NULL);

-- Policy: Allow authenticated users to read their own data
CREATE POLICY "Users can read own custom data"
  ON aos_custom_unit_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Allow authenticated users to insert their own data
CREATE POLICY "Users can insert own custom data"
  ON aos_custom_unit_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Allow authenticated users to update their own data
CREATE POLICY "Users can update own custom data"
  ON aos_custom_unit_data
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Allow authenticated users to delete their own data
CREATE POLICY "Users can delete own custom data"
  ON aos_custom_unit_data
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_aos_custom_unit_data_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_aos_custom_unit_data_updated_at_trigger ON aos_custom_unit_data;
CREATE TRIGGER update_aos_custom_unit_data_updated_at_trigger
  BEFORE UPDATE ON aos_custom_unit_data
  FOR EACH ROW
  EXECUTE FUNCTION update_aos_custom_unit_data_updated_at();
