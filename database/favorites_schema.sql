-- ============================================
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
CREATE POLICY "Service role bypass" ON user_favorites FOR ALL TO service_role USING (true) WITH CHECK (true);