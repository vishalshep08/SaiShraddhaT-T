-- ==============================================================================
-- SAI SHRADDHA TOURS & TRAVELS
-- Migration: 20260826000015_hero_fleet_showcase.sql
-- Description: Module 15 — Homepage Hero Fleet Showcase & Vehicle Image Storage
--
-- CRITICAL COMPLIANCE NOTICE:
-- THIS SQL FILE IS GENERATED FOR MANUAL EXECUTION ONLY.
-- DO NOT EXECUTE AUTOMATICALLY.
-- COPY AND EXECUTE IN SUPABASE SQL EDITOR MANUALLY.
-- ==============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. EXTEND VEHICLES TABLE WITH SHOWCASE & IMAGE FIELDS
-- ─────────────────────────────────────────────────────────────────────────────

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'image_url') THEN
        ALTER TABLE vehicles ADD COLUMN image_url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'images') THEN
        ALTER TABLE vehicles ADD COLUMN images JSONB DEFAULT '[]'::jsonb;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'alt_text') THEN
        ALTER TABLE vehicles ADD COLUMN alt_text TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'description') THEN
        ALTER TABLE vehicles ADD COLUMN description TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'show_in_hero') THEN
        ALTER TABLE vehicles ADD COLUMN show_in_hero BOOLEAN DEFAULT true;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'category_name') THEN
        ALTER TABLE vehicles ADD COLUMN category_name VARCHAR(100);
    END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. HERO SHOWCASE PERFORMANCE INDEX
-- ─────────────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_vehicles_hero_showcase
    ON vehicles(show_in_hero, is_active, display_order)
    WHERE show_in_hero = true AND is_active = true;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. SUPABASE STORAGE BUCKET: fleet-images
-- ─────────────────────────────────────────────────────────────────────────────

-- Create storage bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('fleet-images', 'fleet-images', true)
ON CONFLICT (id) DO NOTHING;

-- STORAGE POLICIES: Public read-only access
DROP POLICY IF EXISTS "Public can view fleet images" ON storage.objects;
CREATE POLICY "Public can view fleet images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'fleet-images');

-- STORAGE POLICIES: Authenticated admins can upload fleet images
DROP POLICY IF EXISTS "Admins can upload fleet images" ON storage.objects;
CREATE POLICY "Admins can upload fleet images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'fleet-images');

-- STORAGE POLICIES: Authenticated admins can update fleet images
DROP POLICY IF EXISTS "Admins can update fleet images" ON storage.objects;
CREATE POLICY "Admins can update fleet images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'fleet-images')
    WITH CHECK (bucket_id = 'fleet-images');

-- STORAGE POLICIES: Authenticated admins can delete fleet images
DROP POLICY IF EXISTS "Admins can delete fleet images" ON storage.objects;
CREATE POLICY "Admins can delete fleet images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'fleet-images');
