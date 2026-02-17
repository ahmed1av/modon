-- ============================================
-- MODON PLATFORM - USERS SCHEMA
-- ============================================
-- Derived from SupabaseUserRepository.ts and User.ts
-- ============================================
-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    -- Profile
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    avatar_url TEXT,
    -- Status & Role
    role VARCHAR(50) DEFAULT 'user' CHECK (
        role IN ('buyer', 'agent', 'admin', 'super_admin', 'user')
    ),
    status VARCHAR(50) DEFAULT 'pending_verification' CHECK (
        status IN (
            'active',
            'inactive',
            'suspended',
            'pending_verification'
        )
    ),
    -- Preferences
    preferred_language VARCHAR(10) DEFAULT 'en',
    preferred_currency VARCHAR(10) DEFAULT 'EGP',
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    push_notifications BOOLEAN DEFAULT true,
    newsletter BOOLEAN DEFAULT false,
    theme VARCHAR(20) DEFAULT 'light',
    -- Verification & Security
    email_verified BOOLEAN DEFAULT false,
    email_verified_at TIMESTAMPTZ,
    phone_verified BOOLEAN DEFAULT false,
    two_factor_enabled BOOLEAN DEFAULT false,
    -- Security / Login Tracking
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    last_login_ip VARCHAR(45),
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
-- 2. USER SESSIONS (for custom auth)
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_info JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_sessions_refresh_token ON user_sessions(refresh_token_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);
-- 3. PASSWORD RESET TOKENS
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_pwd_reset_token ON password_reset_tokens(token_hash);
-- 4. RLS POLICIES
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
-- Allow users to view/edit their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users FOR
SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users FOR
UPDATE USING (auth.uid() = id);
-- Service Role (bypass RLS for admin operations if needed, though service_role key bypasses RLS by default)
-- Adding explicit policy just in case.
DROP POLICY IF EXISTS "Service role full access" ON users;
CREATE POLICY "Service role full access" ON users FOR ALL TO service_role USING (true) WITH CHECK (true);-- ============================================
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
-- Next step: Run seed.ts to populate with data-- ============================================
-- MODON PLATFORM - FAVORITES SCHEMA
-- ============================================
-- 1. Create user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- UNIQUE constraint for duplicate prevention (VULN-005 FIX)
    UNIQUE(user_id, property_id)
);
-- 2. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_property_id ON user_favorites(property_id);
-- 3. Enable RLS
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
-- 4. RLS Policies
-- NOTE: Since the project uses a custom JWT system, true Supabase RLS 
-- via auth.uid() only works if we sign the JWT with Supabase's secret.
-- For now, we define policies that allow access for the service role and authenticated users.
-- Allow authenticated users to view their own favorites
DROP POLICY IF EXISTS "Users can view their own favorites" ON user_favorites;
CREATE POLICY "Users can view their own favorites" ON user_favorites FOR
SELECT TO authenticated USING (user_id = auth.uid());
-- Allow authenticated users to manage their own favorites
DROP POLICY IF EXISTS "Users can manage their own favorites" ON user_favorites;
CREATE POLICY "Users can manage their own favorites" ON user_favorites FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
-- Allow service role to do everything (for API routes)
DROP POLICY IF EXISTS "Service role bypass" ON user_favorites;
CREATE POLICY "Service role bypass" ON user_favorites FOR ALL TO service_role USING (true) WITH CHECK (true);-- User: admin@modon.com
INSERT INTO users (email, password_hash, first_name, last_name, role, status, email_verified) VALUES ('admin@modon.com', '$2b$10$q/HmpZZeN98TctMYBJEpb.5OE5Bm8x1m0NKvjyvnQDrJvFtdweSGa', 'Admin', 'User', 'admin', 'active', true) ON CONFLICT (email) DO NOTHING;
-- User: agent1@modon.com
INSERT INTO users (email, password_hash, first_name, last_name, role, status, email_verified) VALUES ('agent1@modon.com', '$2b$10$VHM8.IWSXKJbyY/jKrnKBOkF369B.bqVZTpHWiEOznV/kKfV5PY46', 'Karim', 'Nabil', 'agent', 'active', true) ON CONFLICT (email) DO NOTHING;
-- User: buyer1@modon.com
INSERT INTO users (email, password_hash, first_name, last_name, role, status, email_verified) VALUES ('buyer1@modon.com', '$2b$10$5M1RHFv8JfqA5vFAGJ.ckO8TkBy4eFFbC9vSdITnKejxqrzPTzZYu', 'Mona', 'Ahmed', 'buyer', 'active', true) ON CONFLICT (email) DO NOTHING;
-- User: buyer2@modon.com
INSERT INTO users (email, password_hash, first_name, last_name, role, status, email_verified) VALUES ('buyer2@modon.com', '$2b$10$1IrJe6Boim5Fgqcsic2yEeHBEEIcaaDAih6eBOSZ6xEwZBz4.HQca', 'Youssef', 'Kamal', 'buyer', 'active', true) ON CONFLICT (email) DO NOTHING;
-- User: investor@modon.com
INSERT INTO users (email, password_hash, first_name, last_name, role, status, email_verified) VALUES ('investor@modon.com', '$2b$10$I1hRbeUCg1vRn.16/d/xROgrCwn179zc1yzEJTdE9t.hJUDz8ki/u', 'Khaled', 'Ibrahim', 'buyer', 'active', true) ON CONFLICT (email) DO NOTHING;
-- User: vip@modon.com
INSERT INTO users (email, password_hash, first_name, last_name, role, status, email_verified) VALUES ('vip@modon.com', '$2b$10$uEJeWw2xXu3LSQBZCL8l2.PbxOsg1LBU6MnqZ6PTJUm/VIgrFaaZS', 'Laila', 'El-Sayed', 'buyer', 'active', true) ON CONFLICT (email) DO NOTHING;
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Luxury Villa in Zamalek - Premium Unit 1', 'villa-zamalek-1771144774867-0', 'Experience the epitome of luxury in this stunning villa located in Zamalek. Featuring 5 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Cairo.', 102207994, 'EGP', 'Zamalek, Cairo', 'Cairo', 'Egypt', 'Villa', 5, 6, 457, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', 'active', 'rent', 'MOD-2026-1000');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Luxury Chalet in Telal Sokhna - Premium Unit 2', 'chalet-telal-sokhna-1771144774968-1', 'Experience the epitome of luxury in this stunning chalet located in Telal Sokhna. Featuring 3 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Ain Sokhna.', 58932079, 'EGP', 'Telal Sokhna, Ain Sokhna', 'Ain Sokhna', 'Egypt', 'Chalet', 3, 4, 532, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80', 'active', 'sale', 'MOD-2026-1001');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Luxury Penthouse in Telal - Premium Unit 3', 'penthouse-telal-1771144775066-2', 'Experience the epitome of luxury in this stunning penthouse located in Telal. Featuring 7 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in North Coast.', 65386997, 'EGP', 'Telal, North Coast', 'North Coast', 'Egypt', 'Penthouse', 7, 8, 161, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80', 'active', 'sale', 'MOD-2026-1002');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Luxury Twin House in New Giza - Premium Unit 4', 'twin house-new-giza-1771144775163-3', 'Experience the epitome of luxury in this stunning twin house located in New Giza. Featuring 8 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Giza.', 43704502, 'EGP', 'New Giza, Giza', 'Giza', 'Egypt', 'Twin House', 8, 9, 232, 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80', 'active', 'rent', 'MOD-2026-1003');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Luxury Chalet in 6th of October - Premium Unit 5', 'chalet-6th-of-october-1771144775265-4', 'Experience the epitome of luxury in this stunning chalet located in 6th of October. Featuring 7 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Giza.', 56288468, 'EGP', '6th of October, Giza', 'Giza', 'Egypt', 'Chalet', 7, 8, 631, 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', 'active', 'rent', 'MOD-2026-1004');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Luxury Apartment in Pyramids Heights - Premium Unit 6', 'apartment-pyramids-heights-1771144775361-5', 'Experience the epitome of luxury in this stunning apartment located in Pyramids Heights. Featuring 9 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Giza.', 146162450, 'EGP', 'Pyramids Heights, Giza', 'Giza', 'Egypt', 'Apartment', 9, 10, 1113, 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80', 'active', 'rent', 'MOD-2026-1005');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Luxury Apartment in Sheikh Zayed - Premium Unit 7', 'apartment-sheikh-zayed-1771144775460-6', 'Experience the epitome of luxury in this stunning apartment located in Sheikh Zayed. Featuring 3 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Cairo.', 17413103, 'EGP', 'Sheikh Zayed, Cairo', 'Cairo', 'Egypt', 'Apartment', 3, 4, 753, 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80', 'active', 'rent', 'MOD-2026-1006');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Luxury Townhouse in Zamalek - Premium Unit 8', 'townhouse-zamalek-1771144775555-7', 'Experience the epitome of luxury in this stunning townhouse located in Zamalek. Featuring 5 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Cairo.', 56262636, 'EGP', 'Zamalek, Cairo', 'Cairo', 'Egypt', 'Townhouse', 5, 6, 453, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', 'active', 'rent', 'MOD-2026-1007');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Luxury Chalet in Maadi - Premium Unit 9', 'chalet-maadi-1771144775651-8', 'Experience the epitome of luxury in this stunning chalet located in Maadi. Featuring 2 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Cairo.', 107933709, 'EGP', 'Maadi, Cairo', 'Cairo', 'Egypt', 'Chalet', 2, 3, 1458, 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80', 'active', 'sale', 'MOD-2026-1008');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Luxury Penthouse in Pyramids Heights - Premium Unit 10', 'penthouse-pyramids-heights-1771144775748-9', 'Experience the epitome of luxury in this stunning penthouse located in Pyramids Heights. Featuring 8 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Giza.', 145144566, 'EGP', 'Pyramids Heights, Giza', 'Giza', 'Egypt', 'Penthouse', 8, 9, 700, 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80', 'active', 'rent', 'MOD-2026-1009');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Luxury Townhouse in Pyramids Heights - Premium Unit 11', 'townhouse-pyramids-heights-1771144775850-10', 'Experience the epitome of luxury in this stunning townhouse located in Pyramids Heights. Featuring 5 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Giza.', 79473323, 'EGP', 'Pyramids Heights, Giza', 'Giza', 'Egypt', 'Townhouse', 5, 6, 630, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', 'active', 'rent', 'MOD-2026-1010');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Luxury Villa in New Giza - Premium Unit 12', 'villa-new-giza-1771144775949-11', 'Experience the epitome of luxury in this stunning villa located in New Giza. Featuring 9 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Giza.', 47539919, 'EGP', 'New Giza, Giza', 'Giza', 'Egypt', 'Villa', 9, 10, 142, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80', 'active', 'rent', 'MOD-2026-1011');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Luxury Twin House in Zamalek - Premium Unit 13', 'twin house-zamalek-1771144776047-12', 'Experience the epitome of luxury in this stunning twin house located in Zamalek. Featuring 3 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Cairo.', 14731262, 'EGP', 'Zamalek, Cairo', 'Cairo', 'Egypt', 'Twin House', 3, 4, 928, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80', 'active', 'rent', 'MOD-2026-1012');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Luxury Chalet in Sidi Abdel Rahman - Premium Unit 14', 'chalet-sidi-abdel-rahman-1771144776145-13', 'Experience the epitome of luxury in this stunning chalet located in Sidi Abdel Rahman. Featuring 8 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in North Coast.', 30187744, 'EGP', 'Sidi Abdel Rahman, North Coast', 'North Coast', 'Egypt', 'Chalet', 8, 9, 649, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', 'active', 'rent', 'MOD-2026-1013');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Luxury Townhouse in Marassi - Premium Unit 15', 'townhouse-marassi-1771144776247-14', 'Experience the epitome of luxury in this stunning townhouse located in Marassi. Featuring 5 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in North Coast.', 10222709, 'EGP', 'Marassi, North Coast', 'North Coast', 'Egypt', 'Townhouse', 5, 6, 1322, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', 'active', 'rent', 'MOD-2026-1014');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Penthouse in New Cairo with Outstanding Views', 'penthouse-new-cairo-1771144776341-15', 'Experience the epitome of luxury in this stunning penthouse located in New Cairo. Featuring 3 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Cairo.', 136027912, 'EGP', 'New Cairo, Cairo', 'Cairo', 'Egypt', 'Penthouse', 3, 4, 1069, 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80', 'active', 'rent', 'MOD-2026-1015');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Apartment in Telal Sokhna with Outstanding Views', 'apartment-telal-sokhna-1771144776451-16', 'Experience the epitome of luxury in this stunning apartment located in Telal Sokhna. Featuring 3 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Ain Sokhna.', 140151845, 'EGP', 'Telal Sokhna, Ain Sokhna', 'Ain Sokhna', 'Egypt', 'Apartment', 3, 4, 739, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', 'active', 'sale', 'MOD-2026-1016');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Villa in Almaza Bay with Outstanding Views', 'villa-almaza-bay-1771144776554-17', 'Experience the epitome of luxury in this stunning villa located in Almaza Bay. Featuring 2 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in North Coast.', 45936168, 'EGP', 'Almaza Bay, North Coast', 'North Coast', 'Egypt', 'Villa', 2, 3, 1497, 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80', 'active', 'rent', 'MOD-2026-1017');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Townhouse in Zamalek with Outstanding Views', 'townhouse-zamalek-1771144776649-18', 'Experience the epitome of luxury in this stunning townhouse located in Zamalek. Featuring 2 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Cairo.', 144729488, 'EGP', 'Zamalek, Cairo', 'Cairo', 'Egypt', 'Townhouse', 2, 3, 763, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80', 'active', 'rent', 'MOD-2026-1018');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Villa in Little Venice with Outstanding Views', 'villa-little-venice-1771144776744-19', 'Experience the epitome of luxury in this stunning villa located in Little Venice. Featuring 3 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Ain Sokhna.', 145559349, 'EGP', 'Little Venice, Ain Sokhna', 'Ain Sokhna', 'Egypt', 'Villa', 3, 4, 837, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80', 'active', 'rent', 'MOD-2026-1019');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Townhouse in Telal with Outstanding Views', 'townhouse-telal-1771144776844-20', 'Experience the epitome of luxury in this stunning townhouse located in Telal. Featuring 9 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in North Coast.', 114386204, 'EGP', 'Telal, North Coast', 'North Coast', 'Egypt', 'Townhouse', 9, 10, 576, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', 'active', 'rent', 'MOD-2026-1020');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Chalet in Almaza Bay with Outstanding Views', 'chalet-almaza-bay-1771144776946-21', 'Experience the epitome of luxury in this stunning chalet located in Almaza Bay. Featuring 2 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in North Coast.', 119023778, 'EGP', 'Almaza Bay, North Coast', 'North Coast', 'Egypt', 'Chalet', 2, 3, 382, 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80', 'active', 'rent', 'MOD-2026-1021');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Chalet in New Cairo with Outstanding Views', 'chalet-new-cairo-1771144777040-22', 'Experience the epitome of luxury in this stunning chalet located in New Cairo. Featuring 8 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Cairo.', 18953505, 'EGP', 'New Cairo, Cairo', 'Cairo', 'Egypt', 'Chalet', 8, 9, 1257, 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80', 'active', 'sale', 'MOD-2026-1022');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Townhouse in Zamalek with Outstanding Views', 'townhouse-zamalek-1771144777137-23', 'Experience the epitome of luxury in this stunning townhouse located in Zamalek. Featuring 7 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Cairo.', 37188087, 'EGP', 'Zamalek, Cairo', 'Cairo', 'Egypt', 'Townhouse', 7, 8, 353, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80', 'active', 'rent', 'MOD-2026-1023');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Villa in Pyramids Heights with Outstanding Views', 'villa-pyramids-heights-1771144777239-24', 'Experience the epitome of luxury in this stunning villa located in Pyramids Heights. Featuring 9 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Giza.', 44637889, 'EGP', 'Pyramids Heights, Giza', 'Giza', 'Egypt', 'Villa', 9, 10, 132, 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80', 'active', 'rent', 'MOD-2026-1024');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Villa in Pyramids Heights with Outstanding Views', 'villa-pyramids-heights-1771144777337-25', 'Experience the epitome of luxury in this stunning villa located in Pyramids Heights. Featuring 4 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Giza.', 112641082, 'EGP', 'Pyramids Heights, Giza', 'Giza', 'Egypt', 'Villa', 4, 5, 647, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', 'active', 'rent', 'MOD-2026-1025');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Apartment in Marassi with Outstanding Views', 'apartment-marassi-1771144777483-26', 'Experience the epitome of luxury in this stunning apartment located in Marassi. Featuring 8 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in North Coast.', 126098789, 'EGP', 'Marassi, North Coast', 'North Coast', 'Egypt', 'Apartment', 8, 9, 1314, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', 'active', 'rent', 'MOD-2026-1026');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Townhouse in Maadi with Outstanding Views', 'townhouse-maadi-1771144777579-27', 'Experience the epitome of luxury in this stunning townhouse located in Maadi. Featuring 7 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Cairo.', 149660108, 'EGP', 'Maadi, Cairo', 'Cairo', 'Egypt', 'Townhouse', 7, 8, 1192, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', 'active', 'sale', 'MOD-2026-1027');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Twin House in New Giza with Outstanding Views', 'twin house-new-giza-1771144777676-28', 'Experience the epitome of luxury in this stunning twin house located in New Giza. Featuring 9 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Giza.', 99680011, 'EGP', 'New Giza, Giza', 'Giza', 'Egypt', 'Twin House', 9, 10, 303, 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80', 'active', 'rent', 'MOD-2026-1028');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Villa in Zamalek with Outstanding Views', 'villa-zamalek-1771144777774-29', 'Experience the epitome of luxury in this stunning villa located in Zamalek. Featuring 7 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Cairo.', 11365502, 'EGP', 'Zamalek, Cairo', 'Cairo', 'Egypt', 'Villa', 7, 8, 578, 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80', 'active', 'rent', 'MOD-2026-1029');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Penthouse in Pyramids Heights with Outstanding Views', 'penthouse-pyramids-heights-1771144777875-30', 'Experience the epitome of luxury in this stunning penthouse located in Pyramids Heights. Featuring 9 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Giza.', 59877209, 'EGP', 'Pyramids Heights, Giza', 'Giza', 'Egypt', 'Penthouse', 9, 10, 698, 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80', 'active', 'sale', 'MOD-2026-1030');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Apartment in Hacienda Bay with Outstanding Views', 'apartment-hacienda-bay-1771144777971-31', 'Experience the epitome of luxury in this stunning apartment located in Hacienda Bay. Featuring 9 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in North Coast.', 31780495, 'EGP', 'Hacienda Bay, North Coast', 'North Coast', 'Egypt', 'Apartment', 9, 10, 1490, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', 'active', 'sale', 'MOD-2026-1031');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Chalet in Galala City with Outstanding Views', 'chalet-galala-city-1771144778067-32', 'Experience the epitome of luxury in this stunning chalet located in Galala City. Featuring 9 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Ain Sokhna.', 129634774, 'EGP', 'Galala City, Ain Sokhna', 'Ain Sokhna', 'Egypt', 'Chalet', 9, 10, 276, 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80', 'active', 'rent', 'MOD-2026-1032');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Chalet in Maadi with Outstanding Views', 'chalet-maadi-1771144778164-33', 'Experience the epitome of luxury in this stunning chalet located in Maadi. Featuring 6 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Cairo.', 146574204, 'EGP', 'Maadi, Cairo', 'Cairo', 'Egypt', 'Chalet', 6, 7, 243, 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80', 'active', 'sale', 'MOD-2026-1033');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Townhouse in Pyramids Heights with Outstanding Views', 'townhouse-pyramids-heights-1771144778261-34', 'Experience the epitome of luxury in this stunning townhouse located in Pyramids Heights. Featuring 2 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Giza.', 43282190, 'EGP', 'Pyramids Heights, Giza', 'Giza', 'Egypt', 'Townhouse', 2, 3, 144, 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80', 'active', 'sale', 'MOD-2026-1034');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Penthouse in Hacienda Bay with Outstanding Views', 'penthouse-hacienda-bay-1771144778361-35', 'Experience the epitome of luxury in this stunning penthouse located in Hacienda Bay. Featuring 3 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in North Coast.', 140153516, 'EGP', 'Hacienda Bay, North Coast', 'North Coast', 'Egypt', 'Penthouse', 3, 4, 669, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', 'active', 'rent', 'MOD-2026-1035');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Townhouse in New Giza with Outstanding Views', 'townhouse-new-giza-1771144778456-36', 'Experience the epitome of luxury in this stunning townhouse located in New Giza. Featuring 3 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Giza.', 94164811, 'EGP', 'New Giza, Giza', 'Giza', 'Egypt', 'Townhouse', 3, 4, 1375, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80', 'active', 'rent', 'MOD-2026-1036');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Apartment in Pyramids Heights with Outstanding Views', 'apartment-pyramids-heights-1771144778552-37', 'Experience the epitome of luxury in this stunning apartment located in Pyramids Heights. Featuring 3 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Giza.', 129984187, 'EGP', 'Pyramids Heights, Giza', 'Giza', 'Egypt', 'Apartment', 3, 4, 283, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', 'active', 'rent', 'MOD-2026-1037');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Twin House in Heliopolis with Outstanding Views', 'twin house-heliopolis-1771144778657-38', 'Experience the epitome of luxury in this stunning twin house located in Heliopolis. Featuring 7 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Cairo.', 62298257, 'EGP', 'Heliopolis, Cairo', 'Cairo', 'Egypt', 'Twin House', 7, 8, 1126, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', 'active', 'rent', 'MOD-2026-1038');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Apartment in Zamalek with Outstanding Views', 'apartment-zamalek-1771144778753-39', 'Experience the epitome of luxury in this stunning apartment located in Zamalek. Featuring 6 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Cairo.', 137811759, 'EGP', 'Zamalek, Cairo', 'Cairo', 'Egypt', 'Apartment', 6, 7, 369, 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80', 'active', 'rent', 'MOD-2026-1039');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Twin House in Galala City with Outstanding Views', 'twin house-galala-city-1771144778847-40', 'Experience the epitome of luxury in this stunning twin house located in Galala City. Featuring 3 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Ain Sokhna.', 88903277, 'EGP', 'Galala City, Ain Sokhna', 'Ain Sokhna', 'Egypt', 'Twin House', 3, 4, 232, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', 'active', 'rent', 'MOD-2026-1040');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Apartment in Almaza Bay with Outstanding Views', 'apartment-almaza-bay-1771144778941-41', 'Experience the epitome of luxury in this stunning apartment located in Almaza Bay. Featuring 7 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in North Coast.', 4569428, 'EGP', 'Almaza Bay, North Coast', 'North Coast', 'Egypt', 'Apartment', 7, 8, 452, 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80', 'active', 'rent', 'MOD-2026-1041');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Villa in Marassi with Outstanding Views', 'villa-marassi-1771144779036-42', 'Experience the epitome of luxury in this stunning villa located in Marassi. Featuring 3 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in North Coast.', 108109274, 'EGP', 'Marassi, North Coast', 'North Coast', 'Egypt', 'Villa', 3, 4, 1113, 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80', 'active', 'rent', 'MOD-2026-1042');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Townhouse in Almaza Bay with Outstanding Views', 'townhouse-almaza-bay-1771144779136-43', 'Experience the epitome of luxury in this stunning townhouse located in Almaza Bay. Featuring 2 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in North Coast.', 93374362, 'EGP', 'Almaza Bay, North Coast', 'North Coast', 'Egypt', 'Townhouse', 2, 3, 366, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', 'active', 'rent', 'MOD-2026-1043');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Chalet in Zamalek with Outstanding Views', 'chalet-zamalek-1771144779233-44', 'Experience the epitome of luxury in this stunning chalet located in Zamalek. Featuring 8 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Cairo.', 40175087, 'EGP', 'Zamalek, Cairo', 'Cairo', 'Egypt', 'Chalet', 8, 9, 1096, 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80', 'active', 'rent', 'MOD-2026-1044');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Twin House in Galala City with Outstanding Views', 'twin house-galala-city-1771144779325-45', 'Experience the epitome of luxury in this stunning twin house located in Galala City. Featuring 3 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Ain Sokhna.', 96524626, 'EGP', 'Galala City, Ain Sokhna', 'Ain Sokhna', 'Egypt', 'Twin House', 3, 4, 847, 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', 'active', 'sale', 'MOD-2026-1045');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Villa in La Vista with Outstanding Views', 'villa-la-vista-1771144779421-46', 'Experience the epitome of luxury in this stunning villa located in La Vista. Featuring 7 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Ain Sokhna.', 121922888, 'EGP', 'La Vista, Ain Sokhna', 'Ain Sokhna', 'Egypt', 'Villa', 7, 8, 809, 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80', 'active', 'sale', 'MOD-2026-1046');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Apartment in New Cairo with Outstanding Views', 'apartment-new-cairo-1771144779516-47', 'Experience the epitome of luxury in this stunning apartment located in New Cairo. Featuring 3 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in Cairo.', 141414017, 'EGP', 'New Cairo, Cairo', 'Cairo', 'Egypt', 'Apartment', 3, 4, 615, 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80', 'active', 'sale', 'MOD-2026-1047');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Villa in Sidi Abdel Rahman with Outstanding Views', 'villa-sidi-abdel-rahman-1771144779612-48', 'Experience the epitome of luxury in this stunning villa located in Sidi Abdel Rahman. Featuring 2 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in North Coast.', 138696473, 'EGP', 'Sidi Abdel Rahman, North Coast', 'North Coast', 'Egypt', 'Villa', 2, 3, 272, 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', 'active', 'sale', 'MOD-2026-1048');
INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('Villa in Almaza Bay with Outstanding Views', 'villa-almaza-bay-1771144779710-49', 'Experience the epitome of luxury in this stunning villa located in Almaza Bay. Featuring 7 bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in North Coast.', 83773012, 'EGP', 'Almaza Bay, North Coast', 'North Coast', 'Egypt', 'Villa', 7, 8, 884, 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80', 'active', 'rent', 'MOD-2026-1049');
