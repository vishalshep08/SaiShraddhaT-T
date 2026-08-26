-- ==============================================================================
-- SHIRDI TOURS & TRAVELS — V1 PRODUCTION DATABASE SCHEMA
-- Migration: 20260825000001_initial_schema.sql
-- Description: Foundation schema for Shirdi Tours & Travels platform (Est. 2014)
-- NOTE: THIS SQL IS GENERATED FOR MANUAL EXECUTION IN SUPABASE SQL EDITOR.
-- DO NOT EXECUTE AUTOMATICALLY.
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. HELPER FUNCTIONS & TRIGGERS
-- ==============================================================================

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Sequence for Booking Reference Codes (SHD-YYYY-XXXXX)
CREATE SEQUENCE IF NOT EXISTS booking_code_seq START WITH 1001;

CREATE OR REPLACE FUNCTION generate_booking_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.booking_code IS NULL OR NEW.booking_code = '' THEN
        NEW.booking_code = 'SHD-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('booking_code_seq')::TEXT, 5, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Sequence for Enquiry Reference Codes (ENQ-YYYY-XXXXX)
CREATE SEQUENCE IF NOT EXISTS enquiry_code_seq START WITH 1001;

CREATE OR REPLACE FUNCTION generate_enquiry_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.enquiry_code IS NULL OR NEW.enquiry_code = '' THEN
        NEW.enquiry_code = 'ENQ-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('enquiry_code_seq')::TEXT, 5, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ==============================================================================
-- 2. VEHICLE CATEGORIES & FLEET
-- ==============================================================================

CREATE TABLE IF NOT EXISTS vehicle_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    seating_capacity VARCHAR(50) NOT NULL, -- e.g. "4+1 Seater", "6+1 Seater", "17 Seater"
    min_passengers INTEGER NOT NULL DEFAULT 1,
    max_passengers INTEGER NOT NULL DEFAULT 4,
    luggage_capacity VARCHAR(50) DEFAULT '2-3 Bags',
    ideal_for TEXT,
    starting_per_km NUMERIC(10, 2),
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Vehicles (Distinguishing Owned Fleet vs Partner/Network Fleet)
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES vehicle_categories(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL, -- e.g. "Maruti Suzuki Ertiga (White)", "Chevrolet Tavera"
    registration_number VARCHAR(50) UNIQUE,
    seating_capacity INTEGER NOT NULL DEFAULT 6,
    owner_type VARCHAR(50) NOT NULL DEFAULT 'owned' CHECK (owner_type IN ('owned', 'partner_network')),
    status VARCHAR(50) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'assigned', 'on_trip', 'maintenance', 'inactive')),
    fuel_type VARCHAR(50) DEFAULT 'Diesel/CNG',
    ac_type VARCHAR(50) DEFAULT 'AC',
    notes TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_vehicles_updated_at
BEFORE UPDATE ON vehicles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ==============================================================================
-- 3. DRIVER MANAGEMENT
-- ==============================================================================

CREATE TABLE IF NOT EXISTS drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    license_number VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'assigned', 'on_trip', 'inactive')),
    assigned_vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    internal_rating NUMERIC(3, 2) DEFAULT 5.00,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_drivers_updated_at
BEFORE UPDATE ON drivers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ==============================================================================
-- 4. SERVICES, DESTINATIONS & PACKAGES (SEO & CONTENT DATA-DRIVEN)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT,
    icon_name VARCHAR(50) DEFAULT 'Car',
    featured_image_url TEXT,
    is_published BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    seo_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON services
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS destinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL, -- e.g. "Nashik", "Mumbai", "Trimbakeshwar"
    slug VARCHAR(150) UNIQUE NOT NULL, -- e.g. "shirdi-to-nashik"
    origin VARCHAR(100) NOT NULL DEFAULT 'Shirdi',
    distance_km INTEGER,
    approx_travel_time VARCHAR(50), -- e.g. "2 - 2.5 hrs"
    starting_fare NUMERIC(10, 2),
    short_description TEXT NOT NULL,
    long_description TEXT,
    highlights TEXT[],
    is_popular BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    seo_title VARCHAR(255),
    meta_description TEXT,
    keywords TEXT[],
    faq JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_destinations_updated_at
BEFORE UPDATE ON destinations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL, -- e.g. "Shirdi + Shani Shingnapur + Trimbakeshwar 2D/1N"
    slug VARCHAR(200) UNIQUE NOT NULL,
    duration VARCHAR(100) NOT NULL, -- e.g. "1 Day", "2 Days / 1 Night"
    destinations TEXT[],
    starting_fare NUMERIC(10, 2),
    short_description TEXT NOT NULL,
    itinerary JSONB DEFAULT '[]'::jsonb,
    inclusions TEXT[],
    exclusions TEXT[],
    is_published BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    seo_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_packages_updated_at
BEFORE UPDATE ON packages
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ==============================================================================
-- 5. CUSTOMERS & REPEAT CLIENTS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    mobile VARCHAR(20) UNIQUE NOT NULL,
    whatsapp VARCHAR(20),
    email VARCHAR(150),
    city VARCHAR(100),
    total_bookings INTEGER NOT NULL DEFAULT 0,
    total_spend NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    lead_source VARCHAR(50) DEFAULT 'website',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ==============================================================================
-- 6. ENQUIRIES (LEAD CAPTURE)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enquiry_code VARCHAR(30) UNIQUE,
    customer_name VARCHAR(150) NOT NULL,
    customer_mobile VARCHAR(20) NOT NULL,
    customer_whatsapp VARCHAR(20),
    customer_email VARCHAR(150),
    pickup_location VARCHAR(200) NOT NULL,
    drop_location VARCHAR(200) NOT NULL,
    travel_date DATE NOT NULL,
    pickup_time VARCHAR(50),
    passenger_count INTEGER NOT NULL DEFAULT 1,
    trip_type VARCHAR(50) NOT NULL DEFAULT 'one_way' CHECK (trip_type IN ('one_way', 'round_trip', 'local_sightseeing', 'custom_package')),
    vehicle_category_id UUID REFERENCES vehicle_categories(id) ON DELETE SET NULL,
    preferred_vehicle VARCHAR(100),
    lead_source VARCHAR(50) NOT NULL DEFAULT 'website' CHECK (lead_source IN ('google_search', 'google_maps', 'website', 'whatsapp', 'phone', 'instagram', 'facebook', 'referral', 'existing_customer', 'other')),
    status VARCHAR(50) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'converted', 'cancelled', 'spam')),
    estimated_fare NUMERIC(10, 2),
    quoted_fare NUMERIC(10, 2),
    customer_notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER generate_enquiry_code_trigger
BEFORE INSERT ON enquiries
FOR EACH ROW EXECUTE FUNCTION generate_enquiry_code();

CREATE TRIGGER update_enquiries_updated_at
BEFORE UPDATE ON enquiries
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ==============================================================================
-- 7. BOOKINGS & TRIP LIFECYCLE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code VARCHAR(30) UNIQUE,
    enquiry_id UUID REFERENCES enquiries(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_mobile VARCHAR(20) NOT NULL,
    customer_whatsapp VARCHAR(20),
    pickup_location VARCHAR(200) NOT NULL,
    drop_location VARCHAR(200) NOT NULL,
    travel_date DATE NOT NULL,
    pickup_time VARCHAR(50),
    return_date DATE,
    passenger_count INTEGER NOT NULL DEFAULT 1,
    trip_type VARCHAR(50) NOT NULL DEFAULT 'one_way',
    vehicle_category_id UUID REFERENCES vehicle_categories(id) ON DELETE SET NULL,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'enquiry' CHECK (status IN (
        'enquiry',
        'contacted',
        'quoted',
        'awaiting_confirmation',
        'confirmed',
        'vehicle_assigned',
        'driver_assigned',
        'driver_on_way',
        'passenger_picked_up',
        'trip_started',
        'trip_completed',
        'cancelled'
    )),
    quoted_fare NUMERIC(10, 2),
    advance_amount NUMERIC(10, 2) DEFAULT 0.00,
    final_fare NUMERIC(10, 2),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid')),
    lead_source VARCHAR(50) DEFAULT 'website',
    customer_notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER generate_booking_code_trigger
BEFORE INSERT ON bookings
FOR EACH ROW EXECUTE FUNCTION generate_booking_code();

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ==============================================================================
-- 8. REVIEWS & TRUST
-- ==============================================================================

CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(150) NOT NULL,
    customer_city VARCHAR(100),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    route_or_service VARCHAR(150) NOT NULL, -- e.g. "Shirdi to Nashik Roundtrip"
    review_text TEXT NOT NULL,
    travel_date DATE,
    is_verified BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ==============================================================================
-- 9. BUSINESS SETTINGS & METADATA
-- ==============================================================================

CREATE TABLE IF NOT EXISTS business_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ==============================================================================
-- 10. INDEXES FOR PERFORMANCE & FAST LOOKUPS
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_destinations_slug ON destinations(slug);
CREATE INDEX IF NOT EXISTS idx_destinations_is_published ON destinations(is_published);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_packages_slug ON packages(slug);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_travel_date ON bookings(travel_date DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_code ON bookings(booking_code);
CREATE INDEX IF NOT EXISTS idx_customers_mobile ON customers(mobile);
CREATE INDEX IF NOT EXISTS idx_reviews_is_published ON reviews(is_published);


-- ==============================================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE vehicle_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;

-- 11.1 Public Read-Only Data (Destinations, Services, Packages, Published Reviews, Active Categories)
CREATE POLICY "Public read active vehicle categories"
    ON vehicle_categories FOR SELECT
    USING (is_active = true);

CREATE POLICY "Public read published services"
    ON services FOR SELECT
    USING (is_published = true);

CREATE POLICY "Public read published destinations"
    ON destinations FOR SELECT
    USING (is_published = true);

CREATE POLICY "Public read published packages"
    ON packages FOR SELECT
    USING (is_published = true);

CREATE POLICY "Public read published reviews"
    ON reviews FOR SELECT
    USING (is_published = true);

-- 11.2 Public Lead Capture (Enquiries & Customers)
CREATE POLICY "Public can submit enquiry"
    ON enquiries FOR INSERT
    WITH CHECK (true);

-- 11.3 Admin Full Access Policies (Authenticated Users / Service Role)
-- Allow authenticated staff/admins full access to manage all operational tables
CREATE POLICY "Admins full access vehicle_categories"
    ON vehicle_categories FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins full access vehicles"
    ON vehicles FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins full access drivers"
    ON drivers FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins full access services"
    ON services FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins full access destinations"
    ON destinations FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins full access packages"
    ON packages FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins full access customers"
    ON customers FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins full access enquiries"
    ON enquiries FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins full access bookings"
    ON bookings FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins full access reviews"
    ON reviews FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins full access business_settings"
    ON business_settings FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);


-- ==============================================================================
-- 12. INITIAL SEED DATA (CORE SYSTEM DEFAULTS — EST. 2014)
-- ==============================================================================

-- Default Vehicle Categories
INSERT INTO vehicle_categories (name, slug, seating_capacity, min_passengers, max_passengers, luggage_capacity, ideal_for, display_order)
VALUES
('Maruti Suzuki Ertiga (SUV/MUV)', 'ertiga', '6+1 Seater', 1, 6, '3-4 Bags', 'Families, pilgrimage groups, outstation and airport travel', 1),
('Chevrolet Tavera (SUV/MUV)', 'tavera', '7+1 / 8+1 Seater', 1, 8, '4-5 Bags', 'Group pilgrimage and family outstation tours', 2),
('Sedan (Dzire / Etios)', 'sedan', '4+1 Seater', 1, 4, '2-3 Bags', 'Couples, small families, local sightseeing and direct transfers', 3),
('Tempo Traveller (13/17/20 Seater)', 'tempo-traveller', '13-20 Seater', 9, 20, '10-15 Bags', 'Medium pilgrimage groups, family gatherings, corporate trips', 4),
('Mini Bus & Luxury Coach', 'bus-coach', '22-53 Seater', 20, 53, 'Large Luggage Hold', 'Large religious tour groups, wedding and event transportation', 5)
ON CONFLICT (slug) DO NOTHING;

-- Initial Owned Fleet Records
INSERT INTO vehicles (name, registration_number, seating_capacity, owner_type, status, notes, display_order)
VALUES
('Maruti Suzuki Ertiga (Fleet #1)', 'MH-17-XX-0001', 6, 'owned', 'available', 'Owned vehicle in continuous service since 2014', 1),
('Maruti Suzuki Ertiga (Fleet #2)', 'MH-17-XX-0002', 6, 'owned', 'available', 'Owned vehicle dedicated for outstation and airport routes', 2),
('Maruti Suzuki Ertiga (Fleet #3)', 'MH-17-XX-0003', 6, 'owned', 'available', 'Owned vehicle for Shirdi local and temple circuits', 3),
('Chevrolet Tavera (Fleet #4)', 'MH-17-XX-0004', 8, 'owned', 'available', 'Owned spacious MUV for large family pilgrimage', 4)
ON CONFLICT DO NOTHING;

-- Default Business Settings
INSERT INTO business_settings (setting_key, setting_value, description)
VALUES
('general', '{
    "business_name": "Shirdi Tours & Travels",
    "tagline": "Serving Customers Since 2014",
    "established_year": 2014,
    "primary_phone": "+91 94237 86555",
    "whatsapp_number": "+91 94237 86555",
    "address": "Near Sai Baba Temple, Pimpalwadi Road, Shirdi, Maharashtra 423109",
    "email": "contact@shirditourstravels.com"
}'::jsonb, 'General business details and contact numbers')
ON CONFLICT (setting_key) DO NOTHING;
