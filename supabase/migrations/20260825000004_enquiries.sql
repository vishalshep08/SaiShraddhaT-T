-- ==============================================================================
-- SHIRDI TOURS & TRAVELS / SAI SHRADDHA TOURS & TRAVELS
-- Migration: 20260825000004_enquiries.sql
-- Description: Customer Enquiries Schema & Robust Migration for Existing Table
--
-- CRITICAL COMPLIANCE NOTICE:
-- THIS SQL FILE IS GENERATED FOR MANUAL EXECUTION ONLY.
-- DO NOT EXECUTE AUTOMATICALLY.
-- COPY AND EXECUTE IN SUPABASE SQL EDITOR MANUALLY.
-- ==============================================================================

-- 1. CREATE TABLE IF IT DOES NOT EXIST
CREATE TABLE IF NOT EXISTS enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. SAFELY ADD ALL REQUIRED COLUMNS (Idempotent for fresh or existing tables)
ALTER TABLE enquiries
    ADD COLUMN IF NOT EXISTS reference_number VARCHAR(30),
    ADD COLUMN IF NOT EXISTS customer_name VARCHAR(150),
    ADD COLUMN IF NOT EXISTS mobile_number VARCHAR(20),
    ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(20),
    ADD COLUMN IF NOT EXISTS email VARCHAR(150),
    ADD COLUMN IF NOT EXISTS pickup_location VARCHAR(200) DEFAULT 'Shirdi',
    ADD COLUMN IF NOT EXISTS destination VARCHAR(200),
    ADD COLUMN IF NOT EXISTS trip_type VARCHAR(50) DEFAULT 'one_way',
    ADD COLUMN IF NOT EXISTS travel_date DATE,
    ADD COLUMN IF NOT EXISTS return_date DATE,
    ADD COLUMN IF NOT EXISTS pickup_time VARCHAR(50),
    ADD COLUMN IF NOT EXISTS passenger_count INTEGER DEFAULT 1,
    ADD COLUMN IF NOT EXISTS children_count INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS vehicle_category_slug VARCHAR(100),
    ADD COLUMN IF NOT EXISTS vehicle_preference_text VARCHAR(150),
    ADD COLUMN IF NOT EXISTS additional_requirements VARCHAR(1500),
    ADD COLUMN IF NOT EXISTS request_intent VARCHAR(50) DEFAULT 'quote',
    ADD COLUMN IF NOT EXISTS enquiry_type VARCHAR(50) DEFAULT 'general',
    ADD COLUMN IF NOT EXISTS source_page VARCHAR(255),
    ADD COLUMN IF NOT EXISTS service_slug VARCHAR(150),
    ADD COLUMN IF NOT EXISTS route_slug VARCHAR(150),
    ADD COLUMN IF NOT EXISTS destination_slug VARCHAR(150),
    ADD COLUMN IF NOT EXISTS package_slug VARCHAR(150),
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'new',
    ADD COLUMN IF NOT EXISTS internal_notes TEXT,
    ADD COLUMN IF NOT EXISTS uttm_source VARCHAR(100),
    ADD COLUMN IF NOT EXISTS utm_source VARCHAR(100),
    ADD COLUMN IF NOT EXISTS utm_medium VARCHAR(100),
    ADD COLUMN IF NOT EXISTS utm_campaign VARCHAR(100);

-- 3. MIGRATE DATA FROM OLD COLUMN NAMES (If table was created in initial migration)
DO $$
BEGIN
    -- If enquiry_code exists but reference_number is NULL
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='enquiries' AND column_name='enquiry_code') THEN
        UPDATE enquiries SET reference_number = enquiry_code WHERE reference_number IS NULL;
    END IF;

    -- If customer_mobile exists but mobile_number is NULL
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='enquiries' AND column_name='customer_mobile') THEN
        UPDATE enquiries SET mobile_number = customer_mobile WHERE mobile_number IS NULL;
        ALTER TABLE enquiries ALTER COLUMN customer_mobile DROP NOT NULL;
    END IF;

    -- If customer_whatsapp exists but whatsapp_number is NULL
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='enquiries' AND column_name='customer_whatsapp') THEN
        UPDATE enquiries SET whatsapp_number = customer_whatsapp WHERE whatsapp_number IS NULL;
    END IF;

    -- If customer_email exists but email is NULL
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='enquiries' AND column_name='customer_email') THEN
        UPDATE enquiries SET email = customer_email WHERE email IS NULL;
    END IF;

    -- If drop_location exists but destination is NULL
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='enquiries' AND column_name='drop_location') THEN
        UPDATE enquiries SET destination = drop_location WHERE destination IS NULL;
        ALTER TABLE enquiries ALTER COLUMN drop_location DROP NOT NULL;
    END IF;

    -- If customer_notes exists but additional_requirements is NULL
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='enquiries' AND column_name='customer_notes') THEN
        UPDATE enquiries SET additional_requirements = customer_notes WHERE additional_requirements IS NULL;
    END IF;

    -- If admin_notes exists but internal_notes is NULL
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='enquiries' AND column_name='admin_notes') THEN
        UPDATE enquiries SET internal_notes = admin_notes WHERE internal_notes IS NULL;
    END IF;
END $$;

-- 4. RELAX PREVIOUS STRICT CONSTRAINTS THAT PREVENT QUOTE REQUESTS
ALTER TABLE enquiries ALTER COLUMN travel_date DROP NOT NULL;
ALTER TABLE enquiries ALTER COLUMN pickup_location DROP NOT NULL;

-- Remove old restrictive check constraints if they exist
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT conname
        FROM pg_constraint
        WHERE conrelid = 'enquiries'::regclass
          AND contype = 'c'
          AND (conname LIKE '%trip_type%' OR conname LIKE '%status%' OR conname LIKE '%lead_source%')
    ) LOOP
        EXECUTE 'ALTER TABLE enquiries DROP CONSTRAINT IF EXISTS ' || quote_ident(r.conname);
    END LOOP;
END $$;

-- 5. CREATE SAFE INDEXES
CREATE INDEX IF NOT EXISTS idx_enquiries_reference_number ON enquiries(reference_number);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_travel_date ON enquiries(travel_date);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_mobile_number ON enquiries(mobile_number);

-- 6. CONFIGURE ROW LEVEL SECURITY (RLS)
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist to avoid duplicate conflicts
DROP POLICY IF EXISTS "Public insert only for enquiries" ON enquiries;
DROP POLICY IF EXISTS "Public can create enquiries" ON enquiries;
DROP POLICY IF EXISTS "Admins full access to enquiries" ON enquiries;
DROP POLICY IF EXISTS "Admin manage enquiries" ON enquiries;

-- Policy A: Public visitors can insert new enquiries
CREATE POLICY "Public insert only for enquiries"
    ON enquiries FOR INSERT
    TO public
    WITH CHECK (true);

-- Policy B: Authenticated / Admin users have full access
CREATE POLICY "Admins full access to enquiries"
    ON enquiries FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Public SELECT, UPDATE, DELETE are automatically denied under Postgres RLS.
