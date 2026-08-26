-- ==============================================================================
-- SHIRDI TOURS & TRAVELS / SAI SHRADDHA TOURS & TRAVELS
-- Migration: 20260825000002_services_and_fleet.sql
-- Description: Enhanced Schema for Services, Vehicle Categories, and Service-Vehicle Relationships
--
-- CRITICAL COMPLIANCE NOTICE:
-- THIS SQL FILE IS GENERATED FOR MANUAL EXECUTION ONLY.
-- DO NOT EXECUTE AUTOMATICALLY.
-- COPY AND EXECUTE IN SUPABASE SQL EDITOR MANUALLY.
-- ==============================================================================

-- 1. ENHANCE SERVICES TABLE
ALTER TABLE IF EXISTS services
    ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'local',
    ADD COLUMN IF NOT EXISTS suitable_for TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS key_highlights TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS coverage_areas TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS how_it_works JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS cta_label VARCHAR(100) DEFAULT 'Get a Quote';

-- 2. ENHANCE VEHICLE CATEGORIES TABLE
ALTER TABLE IF EXISTS vehicle_categories
    ADD COLUMN IF NOT EXISTS short_name VARCHAR(100),
    ADD COLUMN IF NOT EXISTS typical_capacity VARCHAR(100),
    ADD COLUMN IF NOT EXISTS ac_type VARCHAR(100) DEFAULT 'Air Conditioned',
    ADD COLUMN IF NOT EXISTS ownership_label VARCHAR(50) DEFAULT 'Available On Request',
    ADD COLUMN IF NOT EXISTS owned_count_text VARCHAR(50),
    ADD COLUMN IF NOT EXISTS features TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS is_owned BOOLEAN DEFAULT false;

-- 3. CREATE SERVICE ↔ VEHICLE CATEGORY RELATIONSHIP JUNCTION TABLE
CREATE TABLE IF NOT EXISTS service_vehicle_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    vehicle_category_id UUID NOT NULL REFERENCES vehicle_categories(id) ON DELETE CASCADE,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (service_id, vehicle_category_id)
);

CREATE INDEX IF NOT EXISTS idx_svc_veh_service_id ON service_vehicle_categories(service_id);
CREATE INDEX IF NOT EXISTS idx_svc_veh_category_id ON service_vehicle_categories(vehicle_category_id);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES FOR JUNCTION TABLE
ALTER TABLE service_vehicle_categories ENABLE ROW LEVEL SECURITY;

-- Public can read relationships
CREATE POLICY "Public read service_vehicle_categories"
    ON service_vehicle_categories FOR SELECT
    USING (true);

-- Admins full access
CREATE POLICY "Admins full access service_vehicle_categories"
    ON service_vehicle_categories FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 5. SEED / UPDATE DATA FOR CORE SERVICES (EST. 2014)
INSERT INTO services (title, slug, short_description, full_description, category, cta_label, is_published, display_order, seo_title, meta_description)
VALUES
('Shirdi Local Taxi & Cab Service', 'shirdi-local-taxi', 'Temple pickups, Sai Ashram transfers, hotel drops, and local errands in Shirdi.', 'Our Shirdi Local Taxi service provides 24/7 punctual temple transfers and local cab rides across Shirdi.', 'local', 'Book a Local Taxi', true, 1, 'Shirdi Local Taxi & Cab Service | Sai Baba Temple & Hotel Transfers', 'Book local taxi in Shirdi with Sai Shraddha Tours & Travels. Clean Ertiga & Tavera cabs for Sai Baba temple visits, Sai Ashram transfers, and hotel pickups.'),
('Shirdi Local Sightseeing & Temple Tour', 'shirdi-sightseeing', 'Half-day and full-day temple sightseeing covering Dwarkamai, Chavadi, Khandoba, and Gurusthan.', 'Explore the sacred footsteps of Shri Sai Baba with our comprehensive Shirdi sightseeing cab service.', 'local', 'Plan Sightseeing Tour', true, 2, 'Shirdi Sightseeing Cab Service | Dwarkamai, Chavadi & Temple Tour', 'Explore Shirdi holy places with Sai Shraddha Tours & Travels. Half-day and full-day sightseeing cabs for Dwarkamai, Chavadi, Gurusthan, and Khandoba Temple.'),
('Outstation Taxi & Cab Service', 'outstation-taxi', 'One-way and roundtrip cab service connecting Shirdi to Nashik, Mumbai, Pune, and Aurangabad.', 'Sai Shraddha Tours & Travels provides professional outstation cab services from Shirdi across Maharashtra.', 'outstation', 'Get an Outstation Quote', true, 3, 'Outstation Taxi From Shirdi | Cabs to Nashik, Mumbai, Pune, Aurangabad', 'Book reliable outstation cabs from Shirdi with Sai Shraddha Tours & Travels. Clean Ertiga, Tavera, and Sedan taxis for one-way and round trips across Maharashtra.'),
('Airport Pickup & Drop Taxi Service', 'airport-transfer', 'Punctual transfers for Shirdi Airport (Kakadi), Mumbai (BOM), Pune (PNQ), and Nashik airports.', 'Pre-booked airport cabs from Shirdi directly to Shirdi Airport (SAG), Mumbai (BOM), and Pune (PNQ).', 'airport', 'Book Airport Transfer', true, 4, 'Shirdi Airport Taxi Service | Cab Pickup & Drop at Shirdi, Mumbai, Pune Airports', 'Book punctual Shirdi Airport taxi transfers with Sai Shraddha Tours & Travels. 24/7 airport drops and pickups for Shirdi (SAG), Mumbai (BOM), and Pune (PNQ).'),
('Pilgrimage & Sacred Darshan Tours', 'pilgrimage-tours', 'Curated spiritual yatra packages for Shani Shingnapur, Trimbakeshwar Jyotirlinga, and Maharashtra Jyotirlingas.', 'Specialized organized holy darshan tours originating from Shirdi with patient, family-friendly pacing.', 'pilgrimage', 'Plan a Pilgrimage', true, 5, 'Pilgrimage Tours From Shirdi | Shani Shingnapur, Trimbakeshwar & Jyotirlinga Cabs', 'Book Shirdi pilgrimage tour cabs with Sai Shraddha Tours & Travels. Dedicated darshan packages for Shani Shingnapur, Trimbakeshwar, Grishneshwar, and Maharashtra Jyotirlingas.'),
('Group Transportation & Tempo Travellers', 'group-transportation', 'Spacious 13, 17, 20 & 26-seater Tempo Travellers, mini-buses, and tour coaches for yatra groups.', 'High-quality AC Tempo Travellers and tour coaches arranged for joint families, yatra sanghas, and wedding guests.', 'group', 'Arrange Group Travel', true, 6, 'Tempo Traveller in Shirdi | 13, 17, 20 Seater AC Vans & Bus Hire', 'Hire AC Tempo Travellers and mini buses in Shirdi with Sai Shraddha Tours & Travels. 13-26 seater luxury vans for family groups, yatra sanghas, and wedding travel.'),
('Corporate, Wedding & Event Travel', 'corporate-event-travel', 'Multi-vehicle fleet coordination for Shirdi destination weddings, corporate pilgrimages, and conferences.', 'End-to-end multi-vehicle ground transportation for corporate teams, wedding parties, and event attendees.', 'event', 'Discuss Event Requirements', true, 7, 'Corporate & Wedding Transportation in Shirdi | Fleet Hire & Event Cabs', 'Book corporate car rentals and wedding transportation in Shirdi with Sai Shraddha Tours & Travels. Multi-vehicle dispatch, executive SUVs, and guest shuttles.'),
('Customized & Tailored Tours', 'customized-tours', 'Personalized holiday and pilgrimage itineraries crafted around your family exact destinations.', 'Design your own custom tour from Shirdi with direct consultation and route optimization by Ramesh & Uttam.', 'custom', 'Plan My Custom Trip', true, 8, 'Customized Tour Packages From Shirdi | Tailor-Made Maharashtra Cab Tours', 'Plan your personalized holiday and pilgrimage tour from Shirdi with Sai Shraddha Tours & Travels. Flexible custom routes, clean AC vehicles, and honest quotes.')
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    short_description = EXCLUDED.short_description,
    full_description = EXCLUDED.full_description,
    category = EXCLUDED.category,
    cta_label = EXCLUDED.cta_label,
    seo_title = EXCLUDED.seo_title,
    meta_description = EXCLUDED.meta_description;
