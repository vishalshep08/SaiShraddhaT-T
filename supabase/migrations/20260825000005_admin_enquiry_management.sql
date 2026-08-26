-- ==============================================================================
-- SHIRDI TOURS & TRAVELS / SAI SHRADDHA TOURS & TRAVELS
-- Migration: 20260825000005_admin_enquiry_management.sql
-- Description: Profiles, Internal Notes, Status History, and Follow-Up Schema for Admin Panel
--
-- CRITICAL COMPLIANCE NOTICE:
-- THIS SQL FILE IS GENERATED FOR MANUAL EXECUTION ONLY.
-- DO NOT EXECUTE AUTOMATICALLY.
-- COPY AND EXECUTE IN SUPABASE SQL EDITOR MANUALLY.
-- ==============================================================================

-- 1. ENHANCE ENQUIRIES TABLE FOR ADMIN WORKFLOW
ALTER TABLE IF EXISTS enquiries
    ADD COLUMN IF NOT EXISTS follow_up_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_enquiries_follow_up_at ON enquiries(follow_up_at);
CREATE INDEX IF NOT EXISTS idx_enquiries_is_archived ON enquiries(is_archived);

-- 2. CREATE PROFILES TABLE FOR AUTHENTICATED STAFF / ADMINS
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL DEFAULT 'Admin',
    email VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'staff')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active);

-- Safely recreate trigger to keep updated_at in sync for profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function and trigger to auto-create profile on Supabase auth user creation
CREATE OR REPLACE FUNCTION handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, role, is_active)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1), 'Admin'),
        NEW.email,
        'admin',
        true
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user_profile();

-- 3. CREATE ENQUIRY NOTES TABLE (Private Internal Staff Notes)
CREATE TABLE IF NOT EXISTS enquiry_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enquiry_id UUID NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name VARCHAR(150) NOT NULL DEFAULT 'Staff',
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enquiry_notes_enquiry_id ON enquiry_notes(enquiry_id);
CREATE INDEX IF NOT EXISTS idx_enquiry_notes_created_at ON enquiry_notes(created_at DESC);

-- 4. CREATE ENQUIRY STATUS HISTORY TABLE (Audit Trail)
CREATE TABLE IF NOT EXISTS enquiry_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enquiry_id UUID NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
    old_status VARCHAR(50) NOT NULL,
    new_status VARCHAR(50) NOT NULL,
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    changed_by_name VARCHAR(150) NOT NULL DEFAULT 'Admin',
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enquiry_status_history_enquiry_id ON enquiry_status_history(enquiry_id);
CREATE INDEX IF NOT EXISTS idx_enquiry_status_history_changed_at ON enquiry_status_history(changed_at DESC);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES FOR ADMIN TABLES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiry_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiry_status_history ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Authenticated users can read profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Public can view own profile" ON profiles;

CREATE POLICY "Authenticated users can read profiles"
    ON profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- Enquiry Notes Policies
DROP POLICY IF EXISTS "Authenticated users can read enquiry notes" ON enquiry_notes;
DROP POLICY IF EXISTS "Authenticated users can create enquiry notes" ON enquiry_notes;

CREATE POLICY "Authenticated users can read enquiry notes"
    ON enquiry_notes FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can create enquiry notes"
    ON enquiry_notes FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Enquiry Status History Policies
DROP POLICY IF EXISTS "Authenticated users can read status history" ON enquiry_status_history;
DROP POLICY IF EXISTS "Authenticated users can insert status history" ON enquiry_status_history;

CREATE POLICY "Authenticated users can read status history"
    ON enquiry_status_history FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can insert status history"
    ON enquiry_status_history FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Public is strictly denied from reading notes and status history (no public policies created).
