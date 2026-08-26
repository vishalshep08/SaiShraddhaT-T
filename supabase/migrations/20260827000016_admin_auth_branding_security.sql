-- ==============================================================================
-- SAI SHRADDHA TOURS & TRAVELS — V1 PRODUCTION DATABASE MIGRATION
-- Migration: 20260827000016_admin_auth_branding_security.sql
-- Description: Admin Security, Authorization, Storage Bucket & Global Branding Schema
--
-- CRITICAL COMPLIANCE NOTICE:
-- THIS SQL IS GENERATED FOR MANUAL EXECUTION ONLY IN SUPABASE SQL EDITOR.
-- DO NOT EXECUTE AUTOMATICALLY.
-- ==============================================================================

-- ==============================================================================
-- 1. GLOBAL BUSINESS BRANDING & SETTINGS CONFIGURATION
-- ==============================================================================

-- Ensure business_settings table exists
CREATE TABLE IF NOT EXISTS business_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert or update default canonical branding configuration
INSERT INTO business_settings (setting_key, setting_value, description)
VALUES
(
    'branding',
    '{
        "business_name": "Sai Shraddha Tours & Travels",
        "tagline": "Serving Customers Since 2014 • Sai Ashram (Bhakta Niwas), Shirdi",
        "established_year": 2014,
        "logo_url": null,
        "logo_storage_path": null,
        "logo_alt_text": "Sai Shraddha Tours & Travels, Shirdi"
    }'::jsonb,
    'Global business branding, logo metadata, and visual identity configuration'
)
ON CONFLICT (setting_key) DO UPDATE
SET setting_value = EXCLUDED.setting_value,
    updated_at = NOW();

-- Enable RLS on business_settings
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;

-- Drop obsolete broad policies if present
DROP POLICY IF EXISTS "Public read business_settings" ON business_settings;
DROP POLICY IF EXISTS "Admins full access business_settings" ON business_settings;
DROP POLICY IF EXISTS "Allow public read access for business_settings" ON business_settings;
DROP POLICY IF EXISTS "Allow admin write access for business_settings" ON business_settings;

-- Public can READ business branding and public settings
CREATE POLICY "Public read business_settings"
    ON business_settings FOR SELECT
    TO public
    USING (true);

-- Only authenticated users (admins/staff) can modify business settings
CREATE POLICY "Admins full access business_settings"
    ON business_settings FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);


-- ==============================================================================
-- 2. SUPABASE STORAGE BUCKET CONFIGURATION FOR BRANDING & ASSETS
-- ==============================================================================

-- Create 'branding' storage bucket if it does not exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'branding',
    'branding',
    true,
    3145728, -- 3MB limit
    ARRAY['image/png', 'image/webp', 'image/jpeg', 'image/jpg', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE
SET public = true,
    file_size_limit = 3145728,
    allowed_mime_types = ARRAY['image/png', 'image/webp', 'image/jpeg', 'image/jpg', 'image/svg+xml'];

-- Storage RLS: Public can view branding assets
CREATE POLICY "Public read branding bucket"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'branding');

-- Storage RLS: Authenticated admin users can upload/update/delete branding assets
CREATE POLICY "Admins insert branding bucket"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'branding');

CREATE POLICY "Admins update branding bucket"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'branding')
    WITH CHECK (bucket_id = 'branding');

CREATE POLICY "Admins delete branding bucket"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'branding');


-- ==============================================================================
-- 3. PROFILES & ROLE-BASED ACCESS CONTROL (OWNER / ADMIN / STAFF)
-- ==============================================================================

-- Ensure profiles table exists for user role authorization
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin' CHECK (role IN ('owner', 'admin', 'staff')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
    ON profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- Admins can update profiles
CREATE POLICY "Admins can manage profiles"
    ON profiles FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role IN ('owner', 'admin') AND is_active = true
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role IN ('owner', 'admin') AND is_active = true
        )
    );
