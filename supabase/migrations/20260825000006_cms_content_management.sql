-- ==============================================================================
-- SHIRDI TOURS & TRAVELS / SAI SHRADDHA TOURS & TRAVELS
-- Migration: 20260825000006_cms_content_management.sql
-- Description: Robust CMS Publishing Schema for Services, Destinations, Routes, Tours & Fleet
--
-- CRITICAL COMPLIANCE NOTICE:
-- THIS SQL FILE IS GENERATED FOR MANUAL EXECUTION ONLY.
-- DO NOT EXECUTE AUTOMATICALLY.
-- COPY AND EXECUTE IN SUPABASE SQL EDITOR MANUALLY.
-- ==============================================================================

-- 1. ENHANCE SERVICES TABLE
ALTER TABLE IF EXISTS services
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'published',
    ADD COLUMN IF NOT EXISTS service_category VARCHAR(100) DEFAULT 'Outstation',
    ADD COLUMN IF NOT EXISTS image_alt_text VARCHAR(255),
    ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_services_is_featured ON services(is_featured);

-- 2. ENHANCE DESTINATIONS TABLE
ALTER TABLE IF EXISTS destinations
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'published',
    ADD COLUMN IF NOT EXISTS primary_image_url TEXT,
    ADD COLUMN IF NOT EXISTS image_alt_text VARCHAR(255),
    ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_destinations_status ON destinations(status);
CREATE INDEX IF NOT EXISTS idx_destinations_is_featured ON destinations(is_featured);

-- 3. ENSURE AND ENHANCE ROUTES TABLE
CREATE TABLE IF NOT EXISTS routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE routes
    ADD COLUMN IF NOT EXISTS title VARCHAR(200),
    ADD COLUMN IF NOT EXISTS headline VARCHAR(255),
    ADD COLUMN IF NOT EXISTS slug VARCHAR(150),
    ADD COLUMN IF NOT EXISTS origin VARCHAR(100) DEFAULT 'Shirdi',
    ADD COLUMN IF NOT EXISTS destination VARCHAR(100),
    ADD COLUMN IF NOT EXISTS destination_name VARCHAR(150),
    ADD COLUMN IF NOT EXISTS destination_slug VARCHAR(150),
    ADD COLUMN IF NOT EXISTS short_description TEXT,
    ADD COLUMN IF NOT EXISTS full_description TEXT,
    ADD COLUMN IF NOT EXISTS route_overview TEXT,
    ADD COLUMN IF NOT EXISTS approx_distance_km INTEGER,
    ADD COLUMN IF NOT EXISTS approx_travel_time VARCHAR(50),
    ADD COLUMN IF NOT EXISTS starting_fare NUMERIC(10, 2),
    ADD COLUMN IF NOT EXISTS trip_type VARCHAR(50) DEFAULT 'one_way',
    ADD COLUMN IF NOT EXISTS vehicle_categories TEXT[],
    ADD COLUMN IF NOT EXISTS primary_image_url TEXT,
    ADD COLUMN IF NOT EXISTS image_alt_text VARCHAR(255),
    ADD COLUMN IF NOT EXISTS is_popular BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'published',
    ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255),
    ADD COLUMN IF NOT EXISTS meta_description TEXT,
    ADD COLUMN IF NOT EXISTS seo_description TEXT;

-- Synchronize old route columns if needed
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='routes' AND column_name='headline') THEN
        UPDATE routes SET title = headline WHERE title IS NULL;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='routes' AND column_name='destination_name') THEN
        UPDATE routes SET destination = destination_name WHERE destination IS NULL;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='routes' AND column_name='is_published') THEN
        UPDATE routes SET status = CASE WHEN is_published THEN 'published' ELSE 'draft' END WHERE status IS NULL;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_routes_slug ON routes(slug);
CREATE INDEX IF NOT EXISTS idx_routes_status ON routes(status);
CREATE INDEX IF NOT EXISTS idx_routes_is_featured ON routes(is_featured);

-- Recreate trigger safely for routes
DROP TRIGGER IF EXISTS update_routes_updated_at ON routes;
CREATE TRIGGER update_routes_updated_at
BEFORE UPDATE ON routes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. ENSURE AND ENHANCE PACKAGES TABLE
CREATE TABLE IF NOT EXISTS packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE packages
    ADD COLUMN IF NOT EXISTS title VARCHAR(200),
    ADD COLUMN IF NOT EXISTS slug VARCHAR(200),
    ADD COLUMN IF NOT EXISTS duration VARCHAR(100),
    ADD COLUMN IF NOT EXISTS duration_text VARCHAR(100),
    ADD COLUMN IF NOT EXISTS starting_location VARCHAR(100) DEFAULT 'Shirdi',
    ADD COLUMN IF NOT EXISTS destinations TEXT[],
    ADD COLUMN IF NOT EXISTS destinations_covered TEXT[],
    ADD COLUMN IF NOT EXISTS starting_fare NUMERIC(10, 2),
    ADD COLUMN IF NOT EXISTS short_description TEXT,
    ADD COLUMN IF NOT EXISTS full_description TEXT,
    ADD COLUMN IF NOT EXISTS full_overview TEXT,
    ADD COLUMN IF NOT EXISTS itinerary JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS inclusions TEXT[],
    ADD COLUMN IF NOT EXISTS exclusions TEXT[],
    ADD COLUMN IF NOT EXISTS primary_image_url TEXT,
    ADD COLUMN IF NOT EXISTS image_alt_text VARCHAR(255),
    ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'published',
    ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255),
    ADD COLUMN IF NOT EXISTS meta_description TEXT,
    ADD COLUMN IF NOT EXISTS seo_description TEXT;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packages' AND column_name='duration_text') THEN
        UPDATE packages SET duration = duration_text WHERE duration IS NULL;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packages' AND column_name='is_published') THEN
        UPDATE packages SET status = CASE WHEN is_published THEN 'published' ELSE 'draft' END WHERE status IS NULL;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_packages_slug ON packages(slug);
CREATE INDEX IF NOT EXISTS idx_packages_status ON packages(status);
CREATE INDEX IF NOT EXISTS idx_packages_is_featured ON packages(is_featured);

-- 5. ENSURE AND ENHANCE VEHICLE CATEGORIES & VEHICLES
ALTER TABLE IF EXISTS vehicle_categories
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'published',
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS availability_note VARCHAR(150),
    ADD COLUMN IF NOT EXISTS image_url TEXT,
    ADD COLUMN IF NOT EXISTS image_alt_text VARCHAR(255),
    ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vehicle_categories' AND column_name='is_active') THEN
        UPDATE vehicle_categories SET status = CASE WHEN is_active THEN 'published' ELSE 'draft' END WHERE status IS NULL;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_vehicle_categories_status ON vehicle_categories(status);

ALTER TABLE IF EXISTS vehicles
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'available';

-- 6. ROW LEVEL SECURITY (RLS) FOR CMS TABLES
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Drop old policies to prevent duplicates
DROP POLICY IF EXISTS "Public can view published services" ON services;
DROP POLICY IF EXISTS "Admins can manage services" ON services;
DROP POLICY IF EXISTS "Public can view published destinations" ON destinations;
DROP POLICY IF EXISTS "Admins can manage destinations" ON destinations;
DROP POLICY IF EXISTS "Public can view published routes" ON routes;
DROP POLICY IF EXISTS "Admins can manage routes" ON routes;
DROP POLICY IF EXISTS "Public can view published packages" ON packages;
DROP POLICY IF EXISTS "Admins can manage packages" ON packages;
DROP POLICY IF EXISTS "Public can view published vehicle categories" ON vehicle_categories;
DROP POLICY IF EXISTS "Admins can manage vehicle categories" ON vehicle_categories;
DROP POLICY IF EXISTS "Public can view active vehicles" ON vehicles;
DROP POLICY IF EXISTS "Admins can manage vehicles" ON vehicles;

-- Public Policies (Published only)
CREATE POLICY "Public can view published services"
    ON services FOR SELECT
    TO public
    USING (status = 'published');

CREATE POLICY "Public can view published destinations"
    ON destinations FOR SELECT
    TO public
    USING (status = 'published');

CREATE POLICY "Public can view published routes"
    ON routes FOR SELECT
    TO public
    USING (status = 'published');

CREATE POLICY "Public can view published packages"
    ON packages FOR SELECT
    TO public
    USING (status = 'published');

CREATE POLICY "Public can view published vehicle categories"
    ON vehicle_categories FOR SELECT
    TO public
    USING (status = 'published');

CREATE POLICY "Public can view active vehicles"
    ON vehicles FOR SELECT
    TO public
    USING (status != 'inactive');

-- Authenticated Admin Policies (Full management access)
CREATE POLICY "Admins can manage services"
    ON services FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins can manage destinations"
    ON destinations FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins can manage routes"
    ON routes FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins can manage packages"
    ON packages FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins can manage vehicle categories"
    ON vehicle_categories FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins can manage vehicles"
    ON vehicles FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
