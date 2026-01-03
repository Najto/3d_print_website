/*
  # Create AoS Official Data Tables

  ## Overview
  Creates tables to store official Age of Sigmar data imported from BSData GitHub repository.

  ## New Tables
  
  ### `aos_factions`
  Stores information about AoS armies/factions
  - `id` (uuid, primary key)
  - `name` (text) - Display name (e.g., "Stormcast Eternals")
  - `catalog_file` (text) - GitHub filename (e.g., "Stormcast Eternals.cat")
  - `last_synced` (timestamptz) - Last successful import timestamp
  - `unit_count` (integer) - Number of units in this faction
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `aos_units`
  Stores official unit data from BSData catalogs
  - `id` (uuid, primary key)
  - `faction_id` (uuid, foreign key) - Reference to aos_factions
  - `battlescribe_id` (text) - Original targetId from .cat file
  - `name` (text) - Unit name
  - `points` (integer) - Points cost
  - `unit_type` (text) - Type (e.g., "Hero", "Battleline", "Artillery")
  - `min_size` (integer) - Minimum unit size
  - `max_size` (integer) - Maximum unit size
  - `raw_data` (jsonb) - Complete data from catalog for future parsing
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on both tables
  - Allow public read access (official game data)
  - Restrict write access to service role only

  ## Indexes
  - Index on faction_id for fast lookups
  - Index on name for search functionality
  - Unique constraint on battlescribe_id
*/

-- Create aos_factions table
CREATE TABLE IF NOT EXISTS aos_factions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  catalog_file text UNIQUE NOT NULL,
  last_synced timestamptz,
  unit_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create aos_units table
CREATE TABLE IF NOT EXISTS aos_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  faction_id uuid REFERENCES aos_factions(id) ON DELETE CASCADE,
  battlescribe_id text UNIQUE NOT NULL,
  name text NOT NULL,
  points integer DEFAULT 0,
  unit_type text,
  min_size integer,
  max_size integer,
  raw_data jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_aos_units_faction_id ON aos_units(faction_id);
CREATE INDEX IF NOT EXISTS idx_aos_units_name ON aos_units(name);
CREATE INDEX IF NOT EXISTS idx_aos_factions_name ON aos_factions(name);

-- Enable RLS
ALTER TABLE aos_factions ENABLE ROW LEVEL SECURITY;
ALTER TABLE aos_units ENABLE ROW LEVEL SECURITY;

-- Public read access policies (official game data is public)
CREATE POLICY "Anyone can read factions"
  ON aos_factions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read units"
  ON aos_units FOR SELECT
  TO public
  USING (true);

-- Service role can insert/update/delete (for import process)
CREATE POLICY "Service role can manage factions"
  ON aos_factions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage units"
  ON aos_units FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_aos_factions_updated_at
  BEFORE UPDATE ON aos_factions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_aos_units_updated_at
  BEFORE UPDATE ON aos_units
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();