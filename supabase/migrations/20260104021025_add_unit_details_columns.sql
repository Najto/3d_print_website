/*
  # Add detailed unit data columns

  1. New Columns
    - `move` (text) - Movement characteristic (e.g., "4\"", "6\"")
    - `health` (integer) - Health/wounds characteristic
    - `save` (text) - Save characteristic (e.g., "6+", "4+")
    - `control` (integer) - Control characteristic
    - `base_size` (text) - Base size (e.g., "32mm", "40mm")
    - `abilities` (jsonb) - Array of abilities with name, type, effect, keywords
    - `weapons` (jsonb) - Array of weapons with name, type, stats (Atk, Hit, Wnd, Rnd, Dmg, Ability)
    - `keywords` (text[]) - Array of keywords (e.g., WARD, DAEMON, INFANTRY)
  
  2. Purpose
    - Store detailed unit statistics from BattleScribe .cat files
    - Enable rich unit information display
    - Support advanced filtering by keywords and abilities
*/

-- Add unit profile columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'aos_units' AND column_name = 'move'
  ) THEN
    ALTER TABLE aos_units ADD COLUMN move text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'aos_units' AND column_name = 'health'
  ) THEN
    ALTER TABLE aos_units ADD COLUMN health integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'aos_units' AND column_name = 'save'
  ) THEN
    ALTER TABLE aos_units ADD COLUMN save text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'aos_units' AND column_name = 'control'
  ) THEN
    ALTER TABLE aos_units ADD COLUMN control integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'aos_units' AND column_name = 'base_size'
  ) THEN
    ALTER TABLE aos_units ADD COLUMN base_size text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'aos_units' AND column_name = 'abilities'
  ) THEN
    ALTER TABLE aos_units ADD COLUMN abilities jsonb DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'aos_units' AND column_name = 'weapons'
  ) THEN
    ALTER TABLE aos_units ADD COLUMN weapons jsonb DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'aos_units' AND column_name = 'keywords'
  ) THEN
    ALTER TABLE aos_units ADD COLUMN keywords text[] DEFAULT ARRAY[]::text[];
  END IF;
END $$;