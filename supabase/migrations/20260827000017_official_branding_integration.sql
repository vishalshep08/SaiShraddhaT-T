-- ==============================================================================
-- Migration: 20260827000017_official_branding_integration.sql
-- Purpose: Initialize official brand defaults, storage bucket and idempotent RLS
-- NOTE: DO NOT RUN VIA CLI. Execute manually in Supabase SQL Editor if needed.
-- ==============================================================================

-- 1. Ensure business_settings table exists
CREATE TABLE IF NOT EXISTS public.business_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 2. Enable RLS
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;

-- 3. Idempotent Policy Setup (Drop existing policies first to eliminate ERROR 42710)
DROP POLICY IF EXISTS "Public can read business settings" ON public.business_settings;
CREATE POLICY "Public can read business settings"
    ON public.business_settings
    FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can update business settings" ON public.business_settings;
CREATE POLICY "Authenticated users can update business settings"
    ON public.business_settings
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 4. Ensure 'branding' storage bucket exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'branding',
    'branding',
    true,
    5242880, -- 5MB limit
    ARRAY['image/png', 'image/webp', 'image/jpeg', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/png', 'image/webp', 'image/jpeg', 'image/svg+xml'];

-- 5. Storage Policies for 'branding' bucket (Idempotent)
DROP POLICY IF EXISTS "Public read branding bucket" ON storage.objects;
CREATE POLICY "Public read branding bucket"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'branding');

DROP POLICY IF EXISTS "Authenticated upload branding bucket" ON storage.objects;
CREATE POLICY "Authenticated upload branding bucket"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'branding');

DROP POLICY IF EXISTS "Authenticated update branding bucket" ON storage.objects;
CREATE POLICY "Authenticated update branding bucket"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'branding');

DROP POLICY IF EXISTS "Authenticated delete branding bucket" ON storage.objects;
CREATE POLICY "Authenticated delete branding bucket"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'branding');

-- 6. Seed official default branding configuration
INSERT INTO public.business_settings (setting_key, setting_value, updated_at)
VALUES (
    'branding',
    '{
        "businessName": "Sai Shraddha Tours & Travels",
        "tagline": "Safe Journeys • Happy Pilgrims • Sai Ashram, Shirdi",
        "establishedYear": 2014,
        "logoUrl": "/images/branding/official-logo.png",
        "emblemUrl": "/images/branding/logo-emblem.png",
        "logoAltText": "Sai Shraddha Tours & Travels - Shirdi (Serving Customers Since 2014)"
    }'::jsonb,
    NOW()
)
ON CONFLICT (setting_key) DO UPDATE SET
    setting_value = EXCLUDED.setting_value,
    updated_at = NOW();
