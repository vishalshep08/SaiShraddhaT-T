-- ==============================================================================
-- SAI SHRADDHA TOURS & TRAVELS
-- Migration: 20260825000009_enquiry_conversion.sql
-- Description: Module 9 — Enquiry Conversion Enhancement
--   Extends enquiries table with:
--     - landing_page       (full URL path where visitor first landed)
--     - context_type       (route | destination | service | tour | package | direct)
--     - source_device_hint (optional: mobile | desktop — sent by client if available)
--     - trip_duration_hint (optional text: "1 day", "3 days", hints for admin)
--
-- CRITICAL COMPLIANCE NOTICE:
-- THIS SQL FILE IS GENERATED FOR MANUAL EXECUTION ONLY.
-- DO NOT EXECUTE AUTOMATICALLY.
-- COPY AND EXECUTE IN SUPABASE SQL EDITOR MANUALLY.
-- ==============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. ADD NEW COLUMNS TO ENQUIRIES TABLE (Fully idempotent — one per statement)
-- ─────────────────────────────────────────────────────────────────────────────

-- The URL of the first page the visitor landed on (before navigating to quote form).
-- Stored as the pathname, e.g. "/routes/shirdi-to-nashik".
ALTER TABLE enquiries
    ADD COLUMN IF NOT EXISTS landing_page VARCHAR(500);

-- What type of page context triggered this enquiry.
-- Enum-like: 'route' | 'destination' | 'service' | 'tour' | 'package' | 'general'
-- Populated from the context passed to InlineQuoteForm / EnquiryForm.
ALTER TABLE enquiries
    ADD COLUMN IF NOT EXISTS context_type VARCHAR(50);

-- Optional client hint about the device type from which the enquiry was submitted.
-- Values: 'mobile' | 'desktop' | 'tablet'
ALTER TABLE enquiries
    ADD COLUMN IF NOT EXISTS source_device_hint VARCHAR(20);

-- Optional: free-text trip duration hint entered by the customer or inferred from context.
-- For multi-day tours, may be like "3 days", "Shirdi Nashik 1 day", etc.
ALTER TABLE enquiries
    ADD COLUMN IF NOT EXISTS trip_duration_hint VARCHAR(100);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. BACKFILL context_type from existing enquiry_type values
--    This is safe because enquiry_type maps 1:1 to context_type conceptually.
-- ─────────────────────────────────────────────────────────────────────────────

DO $$
BEGIN
    -- Only backfill where context_type is currently NULL and enquiry_type exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'enquiries' AND column_name = 'enquiry_type'
    ) THEN
        EXECUTE '
            UPDATE enquiries
            SET context_type = enquiry_type
            WHERE context_type IS NULL
              AND enquiry_type IS NOT NULL
        ';
    END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. BACKFILL landing_page from source_page where landing_page is NULL
-- ─────────────────────────────────────────────────────────────────────────────

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'enquiries' AND column_name = 'source_page'
    ) THEN
        EXECUTE '
            UPDATE enquiries
            SET landing_page = source_page
            WHERE landing_page IS NULL
              AND source_page IS NOT NULL
        ';
    END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. ADD USEFUL INDEXES FOR ADMIN FILTERING
-- ─────────────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_enquiries_context_type ON enquiries(context_type);
CREATE INDEX IF NOT EXISTS idx_enquiries_landing_page ON enquiries(landing_page);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. ENSURE uttm_source (TYPO FROM MIGRATION 4) IS CLEANED UP
--    Migration 4 had both "uttm_source" (typo) and "utm_source" (correct).
--    Silently fill utm_source from uttm_source where missing, then ignore uttm_source.
-- ─────────────────────────────────────────────────────────────────────────────

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'enquiries' AND column_name = 'uttm_source'
    ) THEN
        EXECUTE '
            UPDATE enquiries
            SET utm_source = uttm_source
            WHERE utm_source IS NULL
              AND uttm_source IS NOT NULL
        ';
    END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- VERIFICATION QUERY (Run after migration to confirm columns exist)
-- ─────────────────────────────────────────────────────────────────────────────
-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'enquiries'
--   AND column_name IN ('landing_page', 'context_type', 'source_device_hint', 'trip_duration_hint')
-- ORDER BY column_name;
