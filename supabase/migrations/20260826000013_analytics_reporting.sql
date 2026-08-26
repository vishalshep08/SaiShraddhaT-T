-- ==============================================================================
-- SAI SHRADDHA TOURS & TRAVELS
-- Migration: 20260826000013_analytics_reporting.sql
-- Description: Module 13 — Analytics, Business Reporting & Performance Aggregations
--
-- CRITICAL COMPLIANCE NOTICE:
-- THIS SQL FILE IS GENERATED FOR MANUAL EXECUTION ONLY.
-- DO NOT EXECUTE AUTOMATICALLY.
-- COPY AND EXECUTE IN SUPABASE SQL EDITOR MANUALLY.
-- ==============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. ANALYTICS & REPORTING PERFORMANCE INDEXES
-- ─────────────────────────────────────────────────────────────────────────────

-- Enquiries: Date range + status filtering
CREATE INDEX IF NOT EXISTS idx_enquiries_created_status
    ON enquiries(created_at DESC, status);

CREATE INDEX IF NOT EXISTS idx_enquiries_travel_date
    ON enquiries(travel_date DESC)
    WHERE travel_date IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_enquiries_service_slug
    ON enquiries(service_slug)
    WHERE service_slug IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_enquiries_destination_slug
    ON enquiries(destination_slug)
    WHERE destination_slug IS NOT NULL;

-- Bookings: Date range + status filtering
CREATE INDEX IF NOT EXISTS idx_bookings_created_status
    ON bookings(created_at DESC, status);

CREATE INDEX IF NOT EXISTS idx_bookings_travel_status
    ON bookings(travel_date DESC, status);

CREATE INDEX IF NOT EXISTS idx_bookings_assigned_vehicle
    ON bookings(assigned_vehicle_id, travel_date DESC)
    WHERE assigned_vehicle_id IS NOT NULL;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. RLS AUDIT & VERIFICATION
-- ─────────────────────────────────────────────────────────────────────────────

-- Ensure only authenticated administrators can access booking and enquiry data
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
