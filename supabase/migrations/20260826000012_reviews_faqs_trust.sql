-- ==============================================================================
-- SAI SHRADDHA TOURS & TRAVELS
-- Migration: 20260826000012_reviews_faqs_trust.sql
-- Description: Module 12 — Reviews, Testimonials, FAQs & Trust Content Management
--
-- CRITICAL COMPLIANCE NOTICE:
-- THIS SQL FILE IS GENERATED FOR MANUAL EXECUTION ONLY.
-- DO NOT EXECUTE AUTOMATICALLY.
-- COPY AND EXECUTE IN SUPABASE SQL EDITOR MANUALLY.
-- ==============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. REVIEWS TABLE (Create if not exists + Add missing columns idempotently)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_display_name VARCHAR(150),
    review_text TEXT,
    rating INT DEFAULT 5,
    source VARCHAR(50) DEFAULT 'google',
    review_date DATE DEFAULT CURRENT_DATE,
    service_name VARCHAR(150),
    destination_name VARCHAR(150),
    is_verified BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'published',
    original_url TEXT,
    image_url TEXT,
    image_alt_text TEXT,
    has_photo_consent BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all Module 12 columns exist if the table was created in an earlier migration
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'customer_display_name') THEN
        ALTER TABLE reviews ADD COLUMN customer_display_name VARCHAR(150);
        -- Backfill from customer_name if customer_name exists
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'customer_name') THEN
            UPDATE reviews SET customer_display_name = customer_name WHERE customer_display_name IS NULL;
        END IF;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'status') THEN
        ALTER TABLE reviews ADD COLUMN status VARCHAR(20) DEFAULT 'published';
        -- Backfill from is_published if is_published exists
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'is_published') THEN
            UPDATE reviews SET status = CASE WHEN is_published = false THEN 'draft' ELSE 'published' END WHERE status IS NULL;
        END IF;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'source') THEN
        ALTER TABLE reviews ADD COLUMN source VARCHAR(50) DEFAULT 'google';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'review_date') THEN
        ALTER TABLE reviews ADD COLUMN review_date DATE DEFAULT CURRENT_DATE;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'travel_date') THEN
            UPDATE reviews SET review_date = travel_date WHERE review_date IS NULL AND travel_date IS NOT NULL;
        END IF;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'service_name') THEN
        ALTER TABLE reviews ADD COLUMN service_name VARCHAR(150);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'destination_name') THEN
        ALTER TABLE reviews ADD COLUMN destination_name VARCHAR(150);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'original_url') THEN
        ALTER TABLE reviews ADD COLUMN original_url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'image_url') THEN
        ALTER TABLE reviews ADD COLUMN image_url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'image_alt_text') THEN
        ALTER TABLE reviews ADD COLUMN image_alt_text TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'has_photo_consent') THEN
        ALTER TABLE reviews ADD COLUMN has_photo_consent BOOLEAN DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'updated_at') THEN
        ALTER TABLE reviews ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. FREQUENTLY ASKED QUESTIONS (FAQS) TABLE
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'general',
    context_type VARCHAR(50),
    context_slug VARCHAR(100),
    display_order INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure all Module 12 columns exist on faqs if table already existed
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'faqs' AND column_name = 'category') THEN
        ALTER TABLE faqs ADD COLUMN category VARCHAR(50) DEFAULT 'general';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'faqs' AND column_name = 'context_type') THEN
        ALTER TABLE faqs ADD COLUMN context_type VARCHAR(50);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'faqs' AND column_name = 'context_slug') THEN
        ALTER TABLE faqs ADD COLUMN context_slug VARCHAR(100);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'faqs' AND column_name = 'display_order') THEN
        ALTER TABLE faqs ADD COLUMN display_order INT DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'faqs' AND column_name = 'status') THEN
        ALTER TABLE faqs ADD COLUMN status VARCHAR(20) DEFAULT 'published';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'faqs' AND column_name = 'updated_at') THEN
        ALTER TABLE faqs ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. SITE SETTINGS TABLE (Configurable Links & Trust Info)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description VARCHAR(255),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default site settings keys (idempotent)
INSERT INTO site_settings (key, value, description)
VALUES
    ('google_review_url', '', 'Direct URL for customers to leave a Google review for Sai Shraddha Tours & Travels'),
    ('google_business_profile_url', '', 'Public Google Business Profile link for Sai Shraddha Tours & Travels'),
    ('trust_headline', 'Serving Shirdi Pilgrims & Families Since 2014', 'Primary trust headline displayed on public pages')
ON CONFLICT (key) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. PERFORMANCE INDEXES
-- ─────────────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_reviews_status_featured_order
    ON reviews(status, is_featured, display_order);

CREATE INDEX IF NOT EXISTS idx_reviews_date
    ON reviews(review_date DESC);

CREATE INDEX IF NOT EXISTS idx_faqs_status_category_order
    ON faqs(status, category, display_order);

CREATE INDEX IF NOT EXISTS idx_faqs_context
    ON faqs(context_type, context_slug);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- REVIEWS POLICIES
DROP POLICY IF EXISTS "Public can view published reviews" ON reviews;
DROP POLICY IF EXISTS "Public read published reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can manage all reviews" ON reviews;
DROP POLICY IF EXISTS "Admins full access reviews" ON reviews;

CREATE POLICY "Public can view published reviews"
    ON reviews FOR SELECT
    USING (status = 'published');

CREATE POLICY "Admins can manage all reviews"
    ON reviews FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- FAQS POLICIES
DROP POLICY IF EXISTS "Public can view published faqs" ON faqs;
DROP POLICY IF EXISTS "Public read published faqs" ON faqs;
DROP POLICY IF EXISTS "Admins can manage all faqs" ON faqs;
DROP POLICY IF EXISTS "Admins full access faqs" ON faqs;

CREATE POLICY "Public can view published faqs"
    ON faqs FOR SELECT
    USING (status = 'published');

CREATE POLICY "Admins can manage all faqs"
    ON faqs FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- SITE SETTINGS POLICIES
DROP POLICY IF EXISTS "Public can read site settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can manage site settings" ON site_settings;

CREATE POLICY "Public can read site settings"
    ON site_settings FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage site settings"
    ON site_settings FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
