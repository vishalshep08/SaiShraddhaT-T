-- ==============================================================================
-- SAI SHRADDHA TOURS & TRAVELS
-- Migration: 20260826000011_daily_operations.sql
-- Description: Module 11 — Daily Operations, Fleet Availability & Vehicle Maintenance
--
-- CRITICAL COMPLIANCE NOTICE:
-- THIS SQL FILE IS GENERATED FOR MANUAL EXECUTION ONLY.
-- DO NOT EXECUTE AUTOMATICALLY.
-- COPY AND EXECUTE IN SUPABASE SQL EDITOR MANUALLY.
-- ==============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. VEHICLE MAINTENANCE ENHANCEMENTS
-- ─────────────────────────────────────────────────────────────────────────────

-- Add maintenance fields to vehicles table
ALTER TABLE vehicles
    ADD COLUMN IF NOT EXISTS maintenance_notes TEXT,
    ADD COLUMN IF NOT EXISTS maintenance_start_date DATE,
    ADD COLUMN IF NOT EXISTS maintenance_end_date DATE;

-- Add driver leave / unavailability notes to drivers table
ALTER TABLE drivers
    ADD COLUMN IF NOT EXISTS unavailable_notes TEXT,
    ADD COLUMN IF NOT EXISTS unavailable_until DATE;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. PERFORMANCE INDEXES FOR DAILY OPERATIONS
-- ─────────────────────────────────────────────────────────────────────────────

-- Composite index for fast daily operations dispatch query
CREATE INDEX IF NOT EXISTS idx_bookings_operations_dispatch
    ON bookings(travel_date, status)
    INCLUDE (pickup_time, assigned_vehicle_id, assigned_driver_id, customer_name, customer_mobile);

-- Index for vehicle availability range lookups
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle_active_window
    ON bookings(assigned_vehicle_id, travel_date, return_date)
    WHERE status NOT IN ('cancelled', 'completed', 'no_show');

-- Index for driver active window lookups
CREATE INDEX IF NOT EXISTS idx_bookings_driver_active_window
    ON bookings(assigned_driver_id, travel_date, return_date)
    WHERE status NOT IN ('cancelled', 'completed', 'no_show');

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. RLS COMPLIANCE (Admins Only)
-- ─────────────────────────────────────────────────────────────────────────────

-- Ensure RLS remains enabled
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────────────────────
-- VERIFICATION QUERY (Run after migration to confirm)
-- ─────────────────────────────────────────────────────────────────────────────
/*
SELECT table_name, column_name, data_type 
FROM information_schema.columns
WHERE table_name IN ('vehicles', 'drivers')
  AND column_name IN ('maintenance_notes', 'maintenance_start_date', 'maintenance_end_date', 'unavailable_notes', 'unavailable_until')
ORDER BY table_name, column_name;
*/
