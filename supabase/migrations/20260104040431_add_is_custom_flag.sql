/*
  # Add is_custom flag to aos_custom_unit_data

  1. Changes
    - Add `is_custom` boolean column to `aos_custom_unit_data` table
    - Default value is `false` for existing units
    - New custom units created by users will be marked as `true`
  
  2. Notes
    - This allows us to distinguish between units imported from official data
      and units manually created by users
    - Custom units will be displayed at the end of unit lists
    - Custom units will show a "-CUSTOM-" badge in the UI
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'aos_custom_unit_data' AND column_name = 'is_custom'
  ) THEN
    ALTER TABLE aos_custom_unit_data ADD COLUMN is_custom BOOLEAN DEFAULT false;
  END IF;
END $$;