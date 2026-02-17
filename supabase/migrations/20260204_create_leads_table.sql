-- ==============================================
-- LEADS TABLE MIGRATION
-- Baerz & Co Lead Capture System
-- Run this in Supabase SQL Editor
-- ==============================================
-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Contact Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    -- Lead Details
    subject VARCHAR(255),
    message TEXT NOT NULL,
    -- Lead Classification
    lead_type VARCHAR(50) NOT NULL DEFAULT 'contact',
    -- Types: contact, sell_private, sell_professional, sell_developer, 
    --        property_inquiry, off_market, auction, newsletter, other
    -- Property Association (optional)
    property_id UUID REFERENCES properties(id) ON DELETE
    SET NULL,
        property_title VARCHAR(255),
        -- Source Tracking
        source VARCHAR(100) DEFAULT 'website',
        ip_address VARCHAR(45),
        user_agent TEXT,
        -- Additional Data
        metadata JSONB DEFAULT '{}',
        -- Lead Management
        status VARCHAR(50) DEFAULT 'new',
        -- Statuses: new, contacted, qualified, proposal, won, lost
        assigned_to UUID REFERENCES users(id) ON DELETE
    SET NULL,
        notes TEXT,
        contacted_at TIMESTAMPTZ,
        -- Timestamps
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_type ON leads(lead_type);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);
-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_leads_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trigger_leads_updated_at ON leads;
CREATE TRIGGER trigger_leads_updated_at BEFORE
UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_leads_updated_at();
-- Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
-- Policy: Service role can do everything
CREATE POLICY "Service role full access" ON leads FOR ALL TO service_role USING (true) WITH CHECK (true);
-- Policy: Authenticated users can view leads assigned to them
CREATE POLICY "Users can view assigned leads" ON leads FOR
SELECT TO authenticated USING (assigned_to = auth.uid());
-- Policy: Allow anonymous inserts (for contact form)
CREATE POLICY "Allow anonymous inserts" ON leads FOR
INSERT TO anon WITH CHECK (true);
-- Grant permissions
GRANT SELECT,
    INSERT,
    UPDATE,
    DELETE ON leads TO service_role;
GRANT INSERT ON leads TO anon;
GRANT SELECT,
    UPDATE ON leads TO authenticated;
-- ==============================================
-- SAMPLE DATA (Optional - for testing)
-- ==============================================
-- INSERT INTO leads (first_name, last_name, email, phone, subject, message, lead_type, source)
-- VALUES 
--     ('John', 'Doe', 'john@example.com', '+31 6 1234 5678', 'Property Valuation', 'I would like to sell my villa in Amsterdam.', 'sell_private', 'website'),
--     ('Jane', 'Smith', 'jane@example.com', '+971 50 123 4567', 'Buying Inquiry', 'Looking for a luxury penthouse in Dubai.', 'contact', 'website');
-- ==============================================
-- VERIFICATION QUERIES
-- ==============================================
-- Check table exists
-- SELECT * FROM leads LIMIT 1;
-- Count leads by type
-- SELECT lead_type, COUNT(*) FROM leads GROUP BY lead_type;
-- Count leads by status
-- SELECT status, COUNT(*) FROM leads GROUP BY status;