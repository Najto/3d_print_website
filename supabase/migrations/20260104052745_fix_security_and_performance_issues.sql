/*
  # Fix Security and Performance Issues

  ## Overview
  Addresses security warnings and performance optimizations identified in the database audit.

  ## Changes

  ### 1. RLS Policy Performance Optimization
  Optimizes Row Level Security policies on `aos_custom_unit_data` table by wrapping
  `auth.uid()` calls with `(select auth.uid())`. This prevents the function from being
  re-evaluated for each row, significantly improving query performance at scale.

  #### Affected Policies:
  - "Users can read own custom data" (SELECT)
  - "Users can insert own custom data" (INSERT)
  - "Users can update own custom data" (UPDATE)
  - "Users can delete own custom data" (DELETE)

  ### 2. Remove Unused Index
  Drops `idx_aos_factions_grand_alliance` index which is not being used by any queries.

  ### 3. Fix Function Search Paths
  Adds `SECURITY DEFINER` and explicit `search_path` settings to functions to prevent
  potential security vulnerabilities from search path manipulation.

  #### Affected Functions:
  - `update_updated_at_column()`
  - `assign_grand_alliance()`
  - `update_aos_custom_unit_data_updated_at()`

  ## Security Impact
  - Improved RLS performance
  - Eliminated search path vulnerabilities in functions
  - Reduced index storage overhead

  ## Notes
  The Auth DB Connection Strategy warning requires manual configuration in the Supabase
  dashboard and cannot be fixed via migration.
*/

-- ============================================================================
-- 1. OPTIMIZE RLS POLICIES
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own custom data" ON aos_custom_unit_data;
DROP POLICY IF EXISTS "Users can insert own custom data" ON aos_custom_unit_data;
DROP POLICY IF EXISTS "Users can update own custom data" ON aos_custom_unit_data;
DROP POLICY IF EXISTS "Users can delete own custom data" ON aos_custom_unit_data;

-- Recreate policies with optimized auth.uid() calls
CREATE POLICY "Users can read own custom data"
  ON aos_custom_unit_data
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own custom data"
  ON aos_custom_unit_data
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own custom data"
  ON aos_custom_unit_data
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own custom data"
  ON aos_custom_unit_data
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- 2. REMOVE UNUSED INDEX
-- ============================================================================

DROP INDEX IF EXISTS idx_aos_factions_grand_alliance;

-- ============================================================================
-- 3. FIX FUNCTION SEARCH PATHS
-- ============================================================================

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix assign_grand_alliance function
CREATE OR REPLACE FUNCTION assign_grand_alliance()
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
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
$$;

-- Fix update_aos_custom_unit_data_updated_at function
CREATE OR REPLACE FUNCTION update_aos_custom_unit_data_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
