-- ============================================
-- SUGGESTED RLS POLICIES FOR SECURITY HARDENING
-- ============================================
-- Based on Security Audit (2026-02-17)
-- 
-- ⚠ CURRENT RISKS:
-- 1. "Authenticated users view all" (Properties) -> Safe for read, but maybe hide draft/archived?
-- 2. "Authenticated users can insert" (Properties) -> Allows ANY logged-in user to create properties.
-- 3. "Authenticated users can view leads" (Leads) -> Allows ANY logged-in user to see ALL leads (PII leak risk).
--
-- 📜 RECOMMENDED FIXES:
-- 1. Helper function to check for admin/agent role
-- (Assuming you store roles in public.users or auth metadata)
CREATE OR REPLACE FUNCTION is_staff() RETURNS BOOLEAN AS $$ BEGIN -- Check if user exists in 'users' table with role 'admin' or 'agent'
    RETURN EXISTS (
        SELECT 1
        FROM public.users
        WHERE id = auth.uid()
            AND role IN ('admin', 'agent')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- 2. Hardening Properties Insert
DROP POLICY IF EXISTS "Authenticated users can insert" ON properties;
CREATE POLICY "Staff can insert properties" ON properties FOR
INSERT TO authenticated WITH CHECK (is_staff());
-- 3. Hardening Leads Access (CRITICAL)
DROP POLICY IF EXISTS "Authenticated users can view leads" ON leads;
CREATE POLICY "Staff can view leads" ON leads FOR
SELECT TO authenticated USING (
        is_staff()
        OR assigned_to = auth.uid()
    );
DROP POLICY IF EXISTS "Authenticated users can update leads" ON leads;
CREATE POLICY "Staff can update leads" ON leads FOR
UPDATE TO authenticated USING (
        is_staff()
        OR assigned_to = auth.uid()
    );
-- 4. Restrict Property Updates to Owner or Staff
-- (Current policy "Owners can update their properties" handles owner check, but we should add Staff override)
DROP POLICY IF EXISTS "Owners can update their properties" ON properties;
CREATE POLICY "Owners and Staff can update properties" ON properties FOR
UPDATE TO authenticated USING (
        agent_id = auth.uid()
        OR owner_id = auth.uid()
        OR is_staff()
    );