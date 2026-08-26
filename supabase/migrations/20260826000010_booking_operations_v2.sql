-- ==============================================================================
-- SAI SHRADDHA TOURS & TRAVELS
-- Migration: 20260826000010_booking_operations_v2.sql
-- Description: Module 10 — Booking & Trip Operations Enhancement
--   Extends vehicles and drivers tables with is_active flag,
--   adds RLS policies, improves indexes for conflict detection queries.
--
-- CRITICAL COMPLIANCE NOTICE:
-- THIS SQL FILE IS GENERATED FOR MANUAL EXECUTION ONLY.
-- DO NOT EXECUTE AUTOMATICALLY.
-- COPY AND EXECUTE IN SUPABASE SQL EDITOR MANUALLY.
-- ==============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. EXTEND VEHICLES TABLE
-- ─────────────────────────────────────────────────────────────────────────────

-- is_active: soft-delete flag. Inactive vehicles don't show in assignment UI.
ALTER TABLE vehicles
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

-- display_name: human-readable label shown in admin (e.g. "Ertiga — White (MH-15-AB-1234)")
ALTER TABLE vehicles
    ADD COLUMN IF NOT EXISTS display_name VARCHAR(200);

-- registration_number: already exists in Migration 1 (UNIQUE constraint). No change needed.

-- Backfill display_name from existing name + registration_number
DO $$
BEGIN
    EXECUTE '
        UPDATE vehicles
        SET display_name = CASE
            WHEN registration_number IS NOT NULL AND registration_number != ''''
                THEN name || '' ('' || registration_number || '')''
            ELSE name
        END
        WHERE display_name IS NULL
    ';
END $$;

-- Mark vehicles with status=inactive as is_active=false
DO $$
BEGIN
    EXECUTE '
        UPDATE vehicles
        SET is_active = false
        WHERE status = ''inactive''
          AND is_active = true
    ';
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. EXTEND DRIVERS TABLE
-- ─────────────────────────────────────────────────────────────────────────────

-- is_active: soft-delete flag. Inactive drivers don't show in assignment UI.
ALTER TABLE drivers
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

-- email: optional contact email for driver coordination
ALTER TABLE drivers
    ADD COLUMN IF NOT EXISTS email VARCHAR(150);

-- Mark drivers with status=inactive as is_active=false
DO $$
BEGIN
    EXECUTE '
        UPDATE drivers
        SET is_active = false
        WHERE status = ''inactive''
          AND is_active = true
    ';
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. EXTEND BOOKINGS TABLE
-- ─────────────────────────────────────────────────────────────────────────────

-- journey_description: free-text multi-stop itinerary description
-- e.g. "Shirdi → Nashik → Trimbakeshwar → Shirdi"
ALTER TABLE bookings
    ADD COLUMN IF NOT EXISTS journey_description TEXT;

-- pickup_notes: specific pickup instructions (hotel name, landmark, timing hint)
ALTER TABLE bookings
    ADD COLUMN IF NOT EXISTS pickup_notes VARCHAR(500);

-- drop_notes: specific drop instructions
ALTER TABLE bookings
    ADD COLUMN IF NOT EXISTS drop_notes VARCHAR(500);

-- customer_requirements: the original enquiry message from the customer
ALTER TABLE bookings
    ADD COLUMN IF NOT EXISTS customer_requirements TEXT;

-- internal_admin_notes: private staff notes separate from journey_notes
ALTER TABLE bookings
    ADD COLUMN IF NOT EXISTS internal_admin_notes TEXT;

-- Backfill journey_notes → journey_description where needed
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'bookings' AND column_name = 'journey_notes'
    ) THEN
        EXECUTE '
            UPDATE bookings
            SET journey_description = journey_notes
            WHERE journey_description IS NULL
              AND journey_notes IS NOT NULL
        ';
    END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. INDEXES FOR CONFLICT DETECTION & OPERATIONAL QUERIES
-- ─────────────────────────────────────────────────────────────────────────────

-- Conflict detection: vehicle assignment range check
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle_date_range
    ON bookings(assigned_vehicle_id, travel_date, return_date)
    WHERE status NOT IN ('cancelled', 'completed', 'no_show');

-- Conflict detection: driver assignment range check
CREATE INDEX IF NOT EXISTS idx_bookings_driver_date_range
    ON bookings(assigned_driver_id, travel_date, return_date)
    WHERE status NOT IN ('cancelled', 'completed', 'no_show');

-- Operational: today's trips query
CREATE INDEX IF NOT EXISTS idx_bookings_travel_date_status
    ON bookings(travel_date, status);

-- Vehicle management
CREATE INDEX IF NOT EXISTS idx_vehicles_is_active ON vehicles(is_active);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_owner_type ON vehicles(owner_type);

-- Driver management
CREATE INDEX IF NOT EXISTS idx_drivers_is_active ON drivers(is_active);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. ROW LEVEL SECURITY — VEHICLES
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Public cannot read vehicles (contains internal fleet information)
DROP POLICY IF EXISTS "Public cannot access vehicles" ON vehicles;
DROP POLICY IF EXISTS "Admins manage vehicles" ON vehicles;

CREATE POLICY "Admins manage vehicles"
    ON vehicles FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. ROW LEVEL SECURITY — DRIVERS
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage drivers" ON drivers;

CREATE POLICY "Admins manage drivers"
    ON drivers FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. UPDATE STATUS CONSTRAINTS (Idempotent)
-- ─────────────────────────────────────────────────────────────────────────────

-- Ensure bookings status allows all operational statuses
ALTER TABLE IF EXISTS bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
-- No new constraint added — we use application-level validation for flexibility

-- Ensure vehicles status allows all operational statuses
ALTER TABLE IF EXISTS vehicles DROP CONSTRAINT IF EXISTS vehicles_status_check;
ALTER TABLE IF EXISTS vehicles ADD CONSTRAINT vehicles_status_check
    CHECK (status IN ('available', 'assigned', 'on_trip', 'maintenance', 'inactive'));

-- Ensure drivers status allows all operational statuses
ALTER TABLE IF EXISTS drivers DROP CONSTRAINT IF EXISTS drivers_status_check;
ALTER TABLE IF EXISTS drivers ADD CONSTRAINT drivers_status_check
    CHECK (status IN ('available', 'active', 'assigned', 'on_trip', 'inactive'));

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. OPTIONAL SEED — OWNED FLEET (Only if vehicles table is empty)
-- Run only if you want to pre-seed the owned fleet.
-- Admin can edit names/registration numbers after seeding.
-- ─────────────────────────────────────────────────────────────────────────────

/*
INSERT INTO vehicles (name, display_name, seating_capacity, owner_type, status, notes, is_active)
VALUES
    ('Maruti Suzuki Ertiga', 'Ertiga — Vehicle 01', 7, 'owned', 'available', 'Owned fleet — Vehicle 01. Update registration number from admin panel.', true),
    ('Maruti Suzuki Ertiga', 'Ertiga — Vehicle 02', 7, 'owned', 'available', 'Owned fleet — Vehicle 02. Update registration number from admin panel.', true),
    ('Maruti Suzuki Ertiga', 'Ertiga — Vehicle 03', 7, 'owned', 'available', 'Owned fleet — Vehicle 03. Update registration number from admin panel.', true),
    ('Chevrolet Tavera', 'Tavera — Vehicle 01', 9, 'owned', 'available', 'Owned fleet — Tavera. Update seating configuration from admin panel.', true)
ON CONFLICT DO NOTHING;
*/

-- ─────────────────────────────────────────────────────────────────────────────
-- VERIFICATION QUERIES (Run after migration to confirm)
-- ─────────────────────────────────────────────────────────────────────────────
/*
-- Confirm new columns on vehicles
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'vehicles'
  AND column_name IN ('is_active', 'display_name')
ORDER BY column_name;

-- Confirm new columns on drivers
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'drivers'
  AND column_name IN ('is_active', 'email')
ORDER BY column_name;

-- Confirm new columns on bookings
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'bookings'
  AND column_name IN ('journey_description', 'pickup_notes', 'drop_notes', 'customer_requirements', 'internal_admin_notes')
ORDER BY column_name;
*/
