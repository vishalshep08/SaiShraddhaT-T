-- ==============================================================================
-- SHIRDI TOURS & TRAVELS / SAI SHRADDHA TOURS & TRAVELS
-- Migration: 20260825000007_booking_operations.sql
-- Description: Bookings, Driver Management, Journey Stops, Timeline Activity & Internal Fare Tracking
--
-- CRITICAL COMPLIANCE NOTICE:
-- THIS SQL FILE IS GENERATED FOR MANUAL EXECUTION ONLY.
-- DO NOT EXECUTE AUTOMATICALLY.
-- COPY AND EXECUTE IN SUPABASE SQL EDITOR MANUALLY.
-- ==============================================================================

-- 1. DRIVERS TABLE & CONSTRAINTS
CREATE TABLE IF NOT EXISTS drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    alternate_mobile VARCHAR(20),
    status VARCHAR(50) NOT NULL DEFAULT 'available',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure status check constraint allows all driver statuses
ALTER TABLE IF EXISTS drivers DROP CONSTRAINT IF EXISTS drivers_status_check;
ALTER TABLE IF EXISTS drivers ADD CONSTRAINT drivers_status_check CHECK (status IN ('available', 'active', 'assigned', 'on_trip', 'inactive'));

CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);
CREATE INDEX IF NOT EXISTS idx_drivers_mobile ON drivers(mobile_number);

DROP TRIGGER IF EXISTS update_drivers_updated_at ON drivers;
CREATE TRIGGER update_drivers_updated_at
BEFORE UPDATE ON drivers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed initial known core drivers safely
INSERT INTO drivers (name, mobile_number, status, notes)
VALUES
    ('Ramesh (Owner / Lead Driver)', '09890073081', 'available', 'Sai Ashram Desk Lead'),
    ('Uttam (Owner / Coordinator)', '07218901012', 'available', 'Sai Ashram Operations')
ON CONFLICT DO NOTHING;

-- 2. ENSURE AND ENHANCE BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(150) NOT NULL,
    customer_mobile VARCHAR(20) NOT NULL,
    pickup_location VARCHAR(200) NOT NULL DEFAULT 'Shirdi',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add all required columns to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_reference VARCHAR(30);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_code VARCHAR(30);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS enquiry_id UUID REFERENCES enquiries(id) ON DELETE SET NULL;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES customers(id) ON DELETE SET NULL;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_whatsapp VARCHAR(20);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_email VARCHAR(150);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS pickup_landmark VARCHAR(200);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS destination VARCHAR(200);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS destination_landmark VARCHAR(200);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS drop_location VARCHAR(200);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS travel_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS pickup_time VARCHAR(50);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS return_date DATE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS return_pickup_time VARCHAR(50);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS trip_type VARCHAR(50) DEFAULT 'one_way';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS passenger_count INTEGER DEFAULT 1;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS children_count INTEGER DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS vehicle_category_id UUID REFERENCES vehicle_categories(id) ON DELETE SET NULL;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS vehicle_category_name VARCHAR(150);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS assigned_vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS assigned_vehicle_name VARCHAR(150);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS assigned_driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS assigned_driver_name VARCHAR(150);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS assigned_driver_mobile VARCHAR(20);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS quoted_fare NUMERIC(10, 2);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS final_fare NUMERIC(10, 2);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS advance_received NUMERIC(10, 2) DEFAULT 0.00;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS advance_amount NUMERIC(10, 2) DEFAULT 0.00;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS balance_amount NUMERIC(10, 2) DEFAULT 0.00;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'not_recorded';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'confirmed';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS journey_notes TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_notes TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_source VARCHAR(50) DEFAULT 'website';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS lead_source VARCHAR(50) DEFAULT 'website';

-- Synchronize legacy column names safely using dynamic SQL
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='booking_code') THEN
        EXECUTE 'UPDATE bookings SET booking_reference = booking_code WHERE booking_reference IS NULL';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='drop_location') THEN
        EXECUTE 'UPDATE bookings SET destination = drop_location WHERE destination IS NULL';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='advance_amount') THEN
        EXECUTE 'UPDATE bookings SET advance_received = advance_amount WHERE advance_received IS NULL OR advance_received = 0';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='driver_id') THEN
        EXECUTE 'UPDATE bookings SET assigned_driver_id = driver_id WHERE assigned_driver_id IS NULL';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='vehicle_id') THEN
        EXECUTE 'UPDATE bookings SET assigned_vehicle_id = vehicle_id WHERE assigned_vehicle_id IS NULL';
    END IF;
END $$;

-- Drop legacy check constraints on bookings
ALTER TABLE IF EXISTS bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE IF EXISTS bookings DROP CONSTRAINT IF EXISTS bookings_payment_status_check;

-- Create indexes safely
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_travel_date ON bookings(travel_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_mobile ON bookings(customer_mobile);
CREATE INDEX IF NOT EXISTS idx_bookings_assigned_driver ON bookings(assigned_driver_id);
CREATE INDEX IF NOT EXISTS idx_bookings_assigned_vehicle ON bookings(assigned_vehicle_id);

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. BOOKING STOPS TABLE
CREATE TABLE IF NOT EXISTS booking_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    stop_order INTEGER NOT NULL DEFAULT 1,
    location VARCHAR(200) NOT NULL,
    landmark VARCHAR(200),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_stops_booking_id ON booking_stops(booking_id);

-- 4. BOOKING INTERNAL NOTES TABLE
CREATE TABLE IF NOT EXISTS booking_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name VARCHAR(150) NOT NULL DEFAULT 'Staff',
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_notes_booking_id ON booking_notes(booking_id);

-- 5. BOOKING ACTIVITY / TIMELINE AUDIT TABLE
CREATE TABLE IF NOT EXISTS booking_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    actor_name VARCHAR(150) NOT NULL DEFAULT 'Admin',
    action VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_activity_booking_id ON booking_activity(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_activity_created_at ON booking_activity(created_at DESC);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_activity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage drivers" ON drivers;
DROP POLICY IF EXISTS "Admins manage bookings" ON bookings;
DROP POLICY IF EXISTS "Admins manage booking stops" ON booking_stops;
DROP POLICY IF EXISTS "Admins manage booking notes" ON booking_notes;
DROP POLICY IF EXISTS "Admins manage booking activity" ON booking_activity;

CREATE POLICY "Admins manage drivers"
    ON drivers FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins manage bookings"
    ON bookings FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins manage booking stops"
    ON booking_stops FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins manage booking notes"
    ON booking_notes FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins manage booking activity"
    ON booking_activity FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
