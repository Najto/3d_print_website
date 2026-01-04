/*
  # Extend Custom Unit Data Table for Full Unit Storage

  ## Overview
  Extends the `aos_custom_unit_data` table to store complete unit information
  for custom units created by users. This allows custom units to be fully
  self-contained and properly displayed without requiring an entry in `aos_units`.

  ## Changes

  ### New Columns Added to `aos_custom_unit_data`
  - `name` (text) - Unit name (required for custom units)
  - `points` (integer) - Points cost
  - `move` (text) - Movement characteristic (e.g., "6\"")
  - `health` (integer) - Health/wounds characteristic
  - `save` (text) - Save characteristic (e.g., "4+")
  - `control` (integer) - Control characteristic
  - `base_size` (text) - Base size (e.g., "32mm")
  - `unit_size` (text) - Unit size (e.g., "1", "5-10")
  - `reinforcement` (text) - Reinforcement options (e.g., "+5")
  - `weapons` (jsonb) - Array of weapons with full stats
  - `abilities` (jsonb) - Array of abilities
  - `keywords` (text[]) - Array of keywords

  ## Usage
  - When `is_custom = true`: All fields are populated and the row represents a complete unit
  - When `is_custom = false`: Only STL files, images, and notes are populated (enhancement data)

  ## Security
  - Existing RLS policies apply
  - Users can only manage their own custom units
  - Anonymous users can only manage data where user_id IS NULL
*/

-- Add unit detail columns for custom units
DO $$
BEGIN
  -- Name (required for custom units)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'aos_custom_unit_data' AND column_name = 'name'
  ) THEN
    ALTER TABLE aos_custom_unit_data ADD COLUMN name text;
  END IF;

  -- Points cost
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'aos_custom_unit_data' AND column_name = 'points'
  ) THEN
    ALTER TABLE aos_custom_unit_data ADD COLUMN points integer DEFAULT 0;
  END IF;

  -- Movement
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'aos_custom_unit_data' AND column_name = 'move'
  ) THEN
    ALTER TABLE aos_custom_unit_data ADD COLUMN move text;
  END IF;

  -- Health/Wounds
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'aos_custom_unit_data' AND column_name = 'health'
  ) THEN
    ALTER TABLE aos_custom_unit_data ADD COLUMN health integer;
  END IF;

  -- Save
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'aos_custom_unit_data' AND column_name = 'save'
  ) THEN
    ALTER TABLE aos_custom_unit_data ADD COLUMN save text;
  END IF;

  -- Control
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'aos_custom_unit_data' AND column_name = 'control'
  ) THEN
    ALTER TABLE aos_custom_unit_data ADD COLUMN control integer;
  END IF;

  -- Base size
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'aos_custom_unit_data' AND column_name = 'base_size'
  ) THEN
    ALTER TABLE aos_custom_unit_data ADD COLUMN base_size text;
  END IF;

  -- Unit size
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'aos_custom_unit_data' AND column_name = 'unit_size'
  ) THEN
    ALTER TABLE aos_custom_unit_data ADD COLUMN unit_size text;
  END IF;

  -- Reinforcement
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'aos_custom_unit_data' AND column_name = 'reinforcement'
  ) THEN
    ALTER TABLE aos_custom_unit_data ADD COLUMN reinforcement text;
  END IF;

  -- Weapons (jsonb array)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'aos_custom_unit_data' AND column_name = 'weapons'
  ) THEN
    ALTER TABLE aos_custom_unit_data ADD COLUMN weapons jsonb DEFAULT '[]'::jsonb;
  END IF;

  -- Abilities (jsonb array)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'aos_custom_unit_data' AND column_name = 'abilities'
  ) THEN
    ALTER TABLE aos_custom_unit_data ADD COLUMN abilities jsonb DEFAULT '[]'::jsonb;
  END IF;

  -- Keywords (text array)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'aos_custom_unit_data' AND column_name = 'keywords'
  ) THEN
    ALTER TABLE aos_custom_unit_data ADD COLUMN keywords text[] DEFAULT ARRAY[]::text[];
  END IF;
END $$;

-- Add index on is_custom for efficient querying
CREATE INDEX IF NOT EXISTS idx_aos_custom_unit_data_is_custom
  ON aos_custom_unit_data(is_custom)
  WHERE is_custom = true;

-- Add index on faction_id for custom units
CREATE INDEX IF NOT EXISTS idx_aos_custom_unit_data_faction
  ON aos_custom_unit_data(faction_id)
  WHERE is_custom = true;
