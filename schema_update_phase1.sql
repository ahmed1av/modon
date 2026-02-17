-- ============================================
-- PHASE 1 SCHEMA UPDATE: Coordinates & Virtual Tours
-- ============================================
-- Purpose: Enable interactive maps and luxury virtual tour features
-- Run this in your Supabase SQL Editor
-- Add latitude column for map positioning
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS latitude FLOAT;
-- Add longitude column for map positioning
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS longitude FLOAT;
-- Add virtual tour URL for Matterport/Vimeo/360 tours
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS virtual_tour_url TEXT;
-- Add comments for documentation
COMMENT ON COLUMN properties.latitude IS 'Latitude coordinate for map display';
COMMENT ON COLUMN properties.longitude IS 'Longitude coordinate for map display';
COMMENT ON COLUMN properties.virtual_tour_url IS 'URL for virtual tour (Matterport, Vimeo, etc.)';
-- Optional: Create index for map queries (improves performance when filtering by location)
CREATE INDEX IF NOT EXISTS idx_properties_coordinates ON properties(latitude, longitude);
-- Verify the changes
SELECT column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'properties'
    AND column_name IN ('latitude', 'longitude', 'virtual_tour_url');
-- ============================================
-- SUCCESS! 
-- Your properties table now supports:
-- ✅ Interactive map positioning
-- ✅ Luxury virtual tour embeds
-- ============================================