/*
  # Add Faction Metadata

  ## Overview
  Extends aos_factions table with additional metadata fields needed for complete
  database-driven army management.

  ## Changes to Tables

  ### `aos_factions`
  - Add `grand_alliance` (text) - Order, Chaos, Death, or Destruction
  - Add `description` (text) - Faction lore/description
  - Add `color_scheme` (text) - Primary color for UI (e.g., "blue", "red", "purple", "green")
  - Add `icon_name` (text) - Icon identifier for UI

  ## Data Migration
  - Set sensible defaults for existing factions
  - Map grand alliance based on faction names

  ## Security
  - No changes to RLS policies (existing policies remain)
*/

-- Add new columns to aos_factions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'aos_factions' AND column_name = 'grand_alliance'
  ) THEN
    ALTER TABLE aos_factions ADD COLUMN grand_alliance text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'aos_factions' AND column_name = 'description'
  ) THEN
    ALTER TABLE aos_factions ADD COLUMN description text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'aos_factions' AND column_name = 'color_scheme'
  ) THEN
    ALTER TABLE aos_factions ADD COLUMN color_scheme text DEFAULT 'blue';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'aos_factions' AND column_name = 'icon_name'
  ) THEN
    ALTER TABLE aos_factions ADD COLUMN icon_name text DEFAULT 'shield';
  END IF;
END $$;

-- Create function to auto-assign grand alliance based on faction name
CREATE OR REPLACE FUNCTION assign_grand_alliance()
RETURNS void AS $$
BEGIN
  -- ORDER factions
  UPDATE aos_factions
  SET grand_alliance = 'Order',
      color_scheme = 'blue',
      icon_name = 'shield'
  WHERE grand_alliance IS NULL
    AND (
      name ILIKE '%Stormcast%'
      OR name ILIKE '%Cities of Sigmar%'
      OR name ILIKE '%Daughters of Khaine%'
      OR name ILIKE '%Fyreslayers%'
      OR name ILIKE '%Idoneth%'
      OR name ILIKE '%Kharadron%'
      OR name ILIKE '%Lumineth%'
      OR name ILIKE '%Seraphon%'
      OR name ILIKE '%Sylvaneth%'
    );

  -- CHAOS factions
  UPDATE aos_factions
  SET grand_alliance = 'Chaos',
      color_scheme = 'red',
      icon_name = 'zap'
  WHERE grand_alliance IS NULL
    AND (
      name ILIKE '%Khorne%'
      OR name ILIKE '%Tzeentch%'
      OR name ILIKE '%Slaanesh%'
      OR name ILIKE '%Nurgle%'
      OR name ILIKE '%Skaven%'
      OR name ILIKE '%Slaves to Darkness%'
      OR name ILIKE '%Beasts of Chaos%'
    );

  -- DEATH factions
  UPDATE aos_factions
  SET grand_alliance = 'Death',
      color_scheme = 'purple',
      icon_name = 'skull'
  WHERE grand_alliance IS NULL
    AND (
      name ILIKE '%Flesh-eater%'
      OR name ILIKE '%Nighthaunt%'
      OR name ILIKE '%Ossiarch%'
      OR name ILIKE '%Soulblight%'
    );

  -- DESTRUCTION factions
  UPDATE aos_factions
  SET grand_alliance = 'Destruction',
      color_scheme = 'green',
      icon_name = 'mountain'
  WHERE grand_alliance IS NULL
    AND (
      name ILIKE '%Gloomspite%'
      OR name ILIKE '%Ironjawz%'
      OR name ILIKE '%Kruleboyz%'
      OR name ILIKE '%Ogor%'
      OR name ILIKE '%Orruk%'
      OR name ILIKE '%Sons of Behemat%'
      OR name ILIKE '%Bonesplitterz%'
    );

  -- Default to Order for any remaining factions
  UPDATE aos_factions
  SET grand_alliance = 'Order',
      color_scheme = 'blue',
      icon_name = 'shield'
  WHERE grand_alliance IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to populate grand alliance for existing data
SELECT assign_grand_alliance();

-- Create index on grand_alliance for filtering
CREATE INDEX IF NOT EXISTS idx_aos_factions_grand_alliance ON aos_factions(grand_alliance);