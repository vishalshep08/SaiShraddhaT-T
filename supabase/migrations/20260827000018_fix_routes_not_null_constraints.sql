-- ==============================================================================
-- Migration: 20260827000018_fix_routes_not_null_constraints.sql
-- Purpose: Align legacy NOT NULL constraints on routes and packages tables
-- NOTE: DO NOT RUN VIA CLI. Execute manually in Supabase SQL Editor if needed.
-- ==============================================================================

DO $$
BEGIN
    -- Relax obsolete legacy constraints on routes table
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='routes' AND column_name='destination_name') THEN
        ALTER TABLE public.routes ALTER COLUMN destination_name DROP NOT NULL;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='routes' AND column_name='destination_slug') THEN
        ALTER TABLE public.routes ALTER COLUMN destination_slug DROP NOT NULL;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='routes' AND column_name='headline') THEN
        ALTER TABLE public.routes ALTER COLUMN headline DROP NOT NULL;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='routes' AND column_name='route_overview') THEN
        ALTER TABLE public.routes ALTER COLUMN route_overview DROP NOT NULL;
    END IF;
END $$;
