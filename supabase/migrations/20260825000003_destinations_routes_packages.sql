-- ==============================================================================
-- SHIRDI TOURS & TRAVELS / SAI SHRADDHA TOURS & TRAVELS
-- Migration: 20260825000003_destinations_routes_packages.sql
-- Description: Schema for Destinations, Outstation Routes, Tour Packages & Junction Tables
--
-- CRITICAL COMPLIANCE NOTICE:
-- THIS SQL FILE IS GENERATED FOR MANUAL EXECUTION ONLY.
-- DO NOT EXECUTE AUTOMATICALLY.
-- COPY AND EXECUTE IN SUPABASE SQL EDITOR MANUALLY.
-- ==============================================================================

-- 1. ENHANCE DESTINATIONS TABLE
ALTER TABLE IF EXISTS destinations
    ADD COLUMN IF NOT EXISTS state VARCHAR(100) DEFAULT 'Maharashtra',
    ADD COLUMN IF NOT EXISTS district VARCHAR(100),
    ADD COLUMN IF NOT EXISTS destination_type VARCHAR(50) DEFAULT 'pilgrimage',
    ADD COLUMN IF NOT EXISTS why_visit_from_shirdi TEXT,
    ADD COLUMN IF NOT EXISTS key_attractions TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS approx_distance_text VARCHAR(100),
    ADD COLUMN IF NOT EXISTS approx_duration_text VARCHAR(100),
    ADD COLUMN IF NOT EXISTS route_slug VARCHAR(150);

-- 2. CREATE ROUTES TABLE (Shirdi to Destination Specific Taxi Routes)
CREATE TABLE IF NOT EXISTS routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    origin VARCHAR(100) NOT NULL DEFAULT 'Shirdi',
    destination_name VARCHAR(150) NOT NULL,
    destination_slug VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL, -- e.g. "shirdi-to-nashik"
    headline VARCHAR(255) NOT NULL,
    short_description TEXT NOT NULL,
    route_overview TEXT NOT NULL,
    approx_distance_text VARCHAR(100),
    approx_duration_text VARCHAR(100),
    highway_route VARCHAR(255),
    trip_types_available TEXT[] DEFAULT '{"One-Way Drop", "Round Trip"}',
    key_stops TEXT[] DEFAULT '{}',
    faqs JSONB DEFAULT '[]'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_routes_slug ON routes(slug);
CREATE INDEX IF NOT EXISTS idx_routes_destination_slug ON routes(destination_slug);
CREATE INDEX IF NOT EXISTS idx_routes_is_published ON routes(is_published);

-- 3. ENHANCE PACKAGES TABLE
ALTER TABLE IF EXISTS packages
    ADD COLUMN IF NOT EXISTS package_type VARCHAR(50) DEFAULT 'day_darshan',
    ADD COLUMN IF NOT EXISTS places_covered_details JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS suitable_for TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS customization_notes TEXT,
    ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb;

-- 4. CREATE JUNCTION TABLES (Normalized Relationships)
CREATE TABLE IF NOT EXISTS package_destinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (package_id, destination_id)
);

CREATE TABLE IF NOT EXISTS route_vehicle_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    vehicle_category_id UUID NOT NULL REFERENCES vehicle_categories(id) ON DELETE CASCADE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (route_id, vehicle_category_id)
);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_vehicle_categories ENABLE ROW LEVEL SECURITY;

-- Public can read published routes & relationships
CREATE POLICY "Public read published routes"
    ON routes FOR SELECT
    USING (is_published = true);

CREATE POLICY "Public read package_destinations"
    ON package_destinations FOR SELECT
    USING (true);

CREATE POLICY "Public read route_vehicle_categories"
    ON route_vehicle_categories FOR SELECT
    USING (true);

-- Admins full access
CREATE POLICY "Admins full access routes"
    ON routes FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins full access package_destinations"
    ON package_destinations FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins full access route_vehicle_categories"
    ON route_vehicle_categories FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
