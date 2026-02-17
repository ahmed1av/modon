-- ============================================
-- MODON PLATFORM - SUPABASE DATABASE SCHEMA
-- ============================================
-- Run this in Supabase SQL Editor to initialize the database
-- Created: 2026-02-04
-- ============================================
-- ============================================
-- 1. PROPERTIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Basic Info
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    -- Pricing
    price DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EGP',
    price_per_sqm DECIMAL(10, 2),
    -- Location
    location VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Egypt',
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    -- Property Details
    type VARCHAR(50) NOT NULL CHECK (
        type IN (
            'Villa',
            'Penthouse',
            'Apartment',
            'Townhouse',
            'Duplex',
            'Chalet',
            'Studio'
        )
    ),
    listing_type VARCHAR(20) DEFAULT 'sale' CHECK (listing_type IN ('sale', 'rent')),
    status VARCHAR(20) DEFAULT 'active' CHECK (
        status IN ('active', 'pending', 'sold', 'rented', 'draft')
    ),
    -- Specifications
    bedrooms INTEGER DEFAULT 0,
    bathrooms INTEGER DEFAULT 0,
    area DECIMAL(10, 2),
    -- in square meters
    plot_area DECIMAL(10, 2),
    -- land area for villas
    floors INTEGER DEFAULT 1,
    year_built INTEGER,
    -- Media
    image_url TEXT NOT NULL,
    images JSONB DEFAULT '[]'::jsonb,
    -- Array of image objects
    video_url TEXT,
    virtual_tour_url TEXT,
    -- Features
    features JSONB DEFAULT '[]'::jsonb,
    -- Array of feature strings
    amenities JSONB DEFAULT '[]'::jsonb,
    -- Flags
    is_featured BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT true,
    is_exclusive BOOLEAN DEFAULT false,
    is_off_market BOOLEAN DEFAULT false,
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    -- Analytics
    views INTEGER DEFAULT 0,
    inquiries INTEGER DEFAULT 0,
    -- Agent/Owner
    agent_id UUID,
    owner_id UUID,
    reference_code VARCHAR(50) UNIQUE,
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);
-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_is_featured ON properties(is_featured)
WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_location_search ON properties USING gin(
    to_tsvector(
        'english',
        location || ' ' || COALESCE(city, '') || ' ' || title
    )
);
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS properties_updated_at ON properties;
CREATE TRIGGER properties_updated_at BEFORE
UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- ============================================
-- 2. LEADS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Contact Info
    name VARCHAR(200) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    -- Inquiry Details
    subject VARCHAR(255),
    message TEXT NOT NULL,
    -- Lead Classification
    type VARCHAR(50) DEFAULT 'contact' CHECK (
        type IN (
            'contact',
            'property_inquiry',
            'sell_private',
            'sell_professional',
            'sell_developer',
            'off_market',
            'auction',
            'newsletter',
            'viewing_request',
            'other'
        )
    ),
    -- Property Reference (if inquiry is about a property)
    property_id UUID REFERENCES properties(id) ON DELETE
    SET NULL,
        property_title VARCHAR(255),
        property_slug VARCHAR(255),
        -- Lead Management
        status VARCHAR(50) DEFAULT 'new' CHECK (
            status IN (
                'new',
                'contacted',
                'qualified',
                'converted',
                'lost',
                'spam'
            )
        ),
        priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
        assigned_to UUID,
        -- Source Tracking
        source VARCHAR(100) DEFAULT 'website',
        referrer TEXT,
        utm_source VARCHAR(100),
        utm_medium VARCHAR(100),
        utm_campaign VARCHAR(100),
        -- Technical Info
        ip_address VARCHAR(45),
        user_agent TEXT,
        preferred_contact VARCHAR(20) DEFAULT 'email' CHECK (
            preferred_contact IN ('email', 'phone', 'whatsapp')
        ),
        -- Metadata
        metadata JSONB DEFAULT '{}'::jsonb,
        notes TEXT,
        -- Timestamps
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        contacted_at TIMESTAMPTZ,
        converted_at TIMESTAMPTZ
);
-- Indexes for leads
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_type ON leads(type);
CREATE INDEX IF NOT EXISTS idx_leads_property_id ON leads(property_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
-- Trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS leads_updated_at ON leads;
CREATE TRIGGER leads_updated_at BEFORE
UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- ============================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS on both tables
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
-- ============================================
-- PROPERTIES POLICIES
-- ============================================
-- Allow public to read active properties
DROP POLICY IF EXISTS "Public can view active properties" ON properties;
CREATE POLICY "Public can view active properties" ON properties FOR
SELECT TO anon,
    authenticated USING (status = 'active');
-- Allow authenticated users to view all properties (for agents/admins)
DROP POLICY IF EXISTS "Authenticated users view all" ON properties;
CREATE POLICY "Authenticated users view all" ON properties FOR
SELECT TO authenticated USING (true);
-- Allow authenticated users to insert properties
DROP POLICY IF EXISTS "Authenticated users can insert" ON properties;
CREATE POLICY "Authenticated users can insert" ON properties FOR
INSERT TO authenticated WITH CHECK (true);
-- Allow owners/agents to update their properties
DROP POLICY IF EXISTS "Owners can update their properties" ON properties;
CREATE POLICY "Owners can update their properties" ON properties FOR
UPDATE TO authenticated USING (
        agent_id = auth.uid()
        OR owner_id = auth.uid()
    );
-- ============================================
-- LEADS POLICIES
-- ============================================
-- Allow public to insert leads (contact forms)
DROP POLICY IF EXISTS "Public can submit leads" ON leads;
CREATE POLICY "Public can submit leads" ON leads FOR
INSERT TO anon,
    authenticated WITH CHECK (true);
-- Only authenticated users (agents/admins) can view leads
DROP POLICY IF EXISTS "Authenticated users can view leads" ON leads;
CREATE POLICY "Authenticated users can view leads" ON leads FOR
SELECT TO authenticated USING (true);
-- Authenticated users can update leads
DROP POLICY IF EXISTS "Authenticated users can update leads" ON leads;
CREATE POLICY "Authenticated users can update leads" ON leads FOR
UPDATE TO authenticated USING (true);
-- ============================================
-- 4. HELPER FUNCTIONS
-- ============================================
-- Function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title TEXT) RETURNS TEXT AS $$ BEGIN RETURN lower(
        regexp_replace(
            regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'),
            '\s+',
            '-',
            'g'
        )
    ) || '-' || substring(gen_random_uuid()::text, 1, 8);
END;
$$ LANGUAGE plpgsql;
-- Function to generate reference code
CREATE OR REPLACE FUNCTION generate_reference_code() RETURNS TEXT AS $$ BEGIN RETURN 'MOD-' || to_char(NOW(), 'YYMM') || '-' || upper(substring(gen_random_uuid()::text, 1, 6));
END;
$$ LANGUAGE plpgsql;
-- ============================================
-- 5. VIEWS FOR COMMON QUERIES
-- ============================================
-- Featured properties view
CREATE OR REPLACE VIEW featured_properties AS
SELECT *
FROM properties
WHERE is_featured = true
    AND status = 'active'
ORDER BY created_at DESC
LIMIT 8;
-- Recent leads view
CREATE OR REPLACE VIEW recent_leads AS
SELECT l.*,
    p.title as property_title,
    p.slug as property_slug
FROM leads l
    LEFT JOIN properties p ON l.property_id = p.id
WHERE l.status = 'new'
ORDER BY l.created_at DESC
LIMIT 50;
-- ============================================
-- SCHEMA COMPLETE
-- ============================================
-- Next step: Run seed.ts to populate with data