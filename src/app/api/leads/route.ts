/**
 * Leads API Route Handler (SECURED)
 * ===================================
 * REAL DATABASE INTEGRATION - Captures leads from contact forms
 * CRITICAL SECURITY: Rate limiting, CSRF protection, bot detection
 * 
 * Endpoints:
 *   POST /api/leads - Submit new lead (public, rate-limited)
 *   GET  /api/leads - List leads (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { applySecurityHeaders } from '@/server/security/headers';
import { sanitizeInput, sanitizeEmail, sanitizePhone, sanitizeObject } from '@/lib/sanitize';
import { checkCSRF } from '@/lib/security/csrf'; // CSRF Protection
import { rateLimit } from '@/lib/security/rate-limit'; // RATE LIMITING

// ============================================
// TYPE DEFINITIONS
// ============================================

interface LeadRow {
    id: string;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    subject: string | null;
    message: string;
    type: string;
    status: string;
    priority: string;
    preferred_contact: string;
    property_id: string | null;
    property_title: string | null;
    property_slug: string | null;
    source: string;
    ip_address: string;
    user_agent: string;
    metadata: Record<string, unknown>;
    notes: string | null;
    created_at: string;
    contacted_at: string | null;
    properties?: {
        title: string;
        slug: string;
    };
}

// ============================================
// SUPABASE CLIENT (With Fallback)
// ============================================

import { mockStore } from '@/lib/mock-store';

let supabaseInstance: ReturnType<typeof createClient> | null = null;
let isMockMode = false;

function getSupabase() {
    if (!supabaseInstance) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        // VULN-010 FIX: Do NOT fallback to anon key — leads API needs service role for write operations
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

        // Check for placeholder credentials
        const isPlaceholder = !url || !key || url.includes('your-project-id');

        if (isPlaceholder) {
            // Only mock if explicit credentials are bad, otherwise we risk partial failures
            console.warn('⚠️ [API/Leads] Supabase credentials missing/invalid. Activating MOCK SIMULATION MODE.');
            isMockMode = true;
            return null;
        }

        try {
            supabaseInstance = createClient(url!, key!, {
                auth: { persistSession: false }
            });
        } catch (e) {
            console.warn('⚠️ [API/Leads] Client init failed. Fallback active.');
            isMockMode = true;
            return null;
        }
    }
    return supabaseInstance;
}

// ============================================
// VALIDATION SCHEMA
// ============================================

const LeadSchema = z.object({
    // Contact info - support both formats
    name: z.string().min(2).max(200).optional(),
    firstName: z.string().min(1).max(100).optional(),
    lastName: z.string().min(1).max(100).optional(),
    email: z.string().email().max(255),
    phone: z.string().max(50).optional(),

    // Message
    subject: z.string().max(255).optional(),
    message: z.string().min(5).max(5000),

    // Lead type
    type: z.enum([
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
    ]).default('contact'),

    // Property reference
    propertyId: z.string().uuid().optional(),
    propertyTitle: z.string().max(255).optional(),
    propertySlug: z.string().max(255).optional(),

    // Contact preference
    preferredContact: z.enum(['email', 'phone', 'whatsapp']).default('email'),

    // Source tracking
    source: z.string().max(100).optional(),

    // Additional data
    metadata: z.record(z.string(), z.unknown()).optional(),
});

// ============================================
// BOT DETECTION (Honeypot)
// ============================================

function isBot(body: Record<string, unknown>): boolean {
    // Honeypot fields - bots fill hidden fields
    if (body.website || body.url || body.company_website || body.fax) {
        console.warn('[SECURITY] Honeypot triggered');
        return true;
    }

    // Time-based detection - forms submitted too fast
    if (body._formStartTime) {
        const submitTime = Date.now();
        const startTime = Number(body._formStartTime);
        if (!isNaN(startTime) && submitTime - startTime < 2000) {
            console.warn('[SECURITY] Form submitted too fast');
            return true;
        }
    }

    return false;
}

// ============================================
// POST /api/leads - Submit Lead (RATE LIMITED)
// ============================================

export async function POST(request: NextRequest) {
    const startTime = Date.now();
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // ============================================
    // CRITICAL SECURITY: RATE LIMITING (NEW)
    // ============================================
    const rateLimitResult = await rateLimit(request, {
        maxRequests: 5,        // Max 5 submissions
        windowMs: 3600000,     // Per 1 hour
        message: 'Too many form submissions. Please try again later.',
    });

    if (!rateLimitResult.allowed) {
        console.warn(`[API] Rate limit exceeded for IP: ${ip}`);

        const response = NextResponse.json(
            {
                success: false,
                error: rateLimitResult.message,
            },
            {
                status: 429,
                headers: {
                    'Retry-After': Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000).toString(),
                },
            }
        );

        return applySecurityHeaders(response);
    }

    // ============================================
    // CSRF PROTECTION (Phase 2 Security)
    // ============================================
    const csrfError = checkCSRF(request);
    if (csrfError) return csrfError;

    try {
        const rawBody = await request.json();

        // ============================================
        // BOT DETECTION
        // ============================================

        if (isBot(rawBody)) {
            // Return fake success to not inform bots
            return NextResponse.json({
                success: true,
                message: 'Thank you! We will contact you shortly.'
            }, { status: 201 });
        }

        // ============================================
        // SANITIZE INPUT
        // ============================================

        const sanitizedBody = sanitizeObject(rawBody, {
            excludeFields: ['_formStartTime'],
            maxStringLength: 5000
        });

        // ============================================
        // VALIDATE
        // ============================================

        const validation = LeadSchema.safeParse(sanitizedBody);

        if (!validation.success) {
            return NextResponse.json({
                success: false,
                error: 'Validation failed',
                details: validation.error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }))
            }, { status: 400 });
        }

        const data = validation.data;

        // ============================================
        // ADDITIONAL SANITIZATION
        // ============================================

        const cleanEmail = sanitizeEmail(data.email);
        if (!cleanEmail) {
            return NextResponse.json({
                success: false,
                error: 'Invalid email format'
            }, { status: 400 });
        }

        const cleanPhone = data.phone ? sanitizePhone(data.phone) : null;

        // Build name from firstName/lastName or use name directly
        let fullName = data.name || '';
        let firstName = data.firstName || '';
        let lastName = data.lastName || '';

        if (!fullName && (firstName || lastName)) {
            fullName = `${firstName} ${lastName}`.trim();
        } else if (fullName && !firstName) {
            const nameParts = fullName.split(' ');
            firstName = nameParts[0] || '';
            lastName = nameParts.slice(1).join(' ') || '';
        }

        // ============================================
        // INSERT INTO DATABASE
        // ============================================

        // ============================================
        // INSERT INTO DATABASE (OR MOCK STORE)
        // ============================================

        const supabase = getSupabase();
        let createdLead: { id: string; created_at: string } | null = null;

        if (supabase) {
            const leadRow = {
                name: sanitizeInput(fullName, { maxLength: 200 }),
                first_name: sanitizeInput(firstName, { maxLength: 100 }),
                last_name: sanitizeInput(lastName, { maxLength: 100 }),
                email: cleanEmail,
                phone: cleanPhone,
                subject: data.subject ? sanitizeInput(data.subject, { maxLength: 255 }) : null,
                message: sanitizeInput(data.message, { maxLength: 5000 }),
                type: data.type, // Enum validated above
                property_id: data.propertyId || null,
                property_title: data.propertyTitle ? sanitizeInput(data.propertyTitle, { maxLength: 255 }) : null,
                property_slug: data.propertySlug ? sanitizeInput(data.propertySlug, { maxLength: 255 }) : null,
                preferred_contact: data.preferredContact,
                source: data.source ? sanitizeInput(data.source, { maxLength: 100 }) : 'website',
                ip_address: ip,
                user_agent: userAgent.substring(0, 500),
                metadata: data.metadata ? sanitizeObject(data.metadata as Record<string, unknown>) : {},
                status: 'new',
                priority: 'normal'
            };

            const { data: lead, error } = await supabase
                .from('leads')
                .insert(leadRow as never) // Type assertion for ungenerated schema
                .select('id, created_at')
                .single();

            if (error) {
                console.error('[API] Lead insertion error:', error);
                throw new Error(error.message);
            }

            // Cast the result
            createdLead = lead as { id: string; created_at: string } | null;
        } else {
            // MOCK FALLBACK
            const newLead = mockStore.addLead({
                name: fullName,
                email: cleanEmail,
                phone: cleanPhone || undefined,
                message: data.message,
                type: data.type,
                property_slug: data.propertySlug
            });
            createdLead = { id: newLead.id, created_at: newLead.created_at };
        }

        // ============================================
        // SUCCESS RESPONSE
        // ============================================

        console.log(`[LEAD] New ${data.type} lead from ${cleanEmail}`);

        const response = NextResponse.json({
            success: true,
            message: 'Thank you! We will contact you shortly.',
            data: {
                id: createdLead?.id,
                createdAt: createdLead?.created_at
            },
            meta: {
                duration: Date.now() - startTime
            }
        }, { status: 201 });

        return applySecurityHeaders(response);

    } catch (error) {
        console.error('[API] Lead submission error:', error);

        return NextResponse.json({
            success: false,
            error: 'Failed to submit your request. Please try again.'
        }, { status: 500 });
    }
}

// ============================================
// GET /api/leads - List Leads (Admin Only)
// ============================================

export async function GET(request: NextRequest) {
    // ============================================
    // AUTHENTICATION CHECK
    // ============================================

    // SECURITY: Use the standard auth cookie (matches login endpoint)
    const adminToken = request.cookies.get('modon_auth_token');
    if (!adminToken?.value) {
        return NextResponse.json({
            success: false,
            error: 'Admin authentication required'
        }, { status: 401 });
    }

    // SECURITY (VULN-003 FIX): Actually verify the JWT signature and check admin role
    try {
        const { verifyToken } = await import('@/server/auth/jwt');
        const tokenPayload = await verifyToken(adminToken.value);
        if (!tokenPayload || tokenPayload.role !== 'admin') {
            return NextResponse.json({
                success: false,
                error: 'Insufficient permissions. Admin role required.'
            }, { status: 403 });
        }
    } catch (_verifyError) {
        return NextResponse.json({
            success: false,
            error: 'Invalid or expired authentication token'
        }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);

        // Parse query parameters
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
        const status = searchParams.get('status');
        const type = searchParams.get('type');
        const search = searchParams.get('q');

        const offset = (page - 1) * limit;
        const supabase = getSupabase();

        // ============================================
        // BUILD QUERY
        // ============================================

        // ============================================
        // EXECUTE QUERY (WITH MOCK FALLBACK)
        // ============================================

        let leads: LeadRow[] = [];
        let count = 0;

        if (supabase) {
            let query = supabase
                .from('leads')
                .select('*, properties(title, slug)', { count: 'exact' })
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);

            if (status) query = query.eq('status', sanitizeInput(status, { maxLength: 50 }));
            if (type) query = query.eq('type', sanitizeInput(type, { maxLength: 50 }));
            if (search) {
                const searchTerm = sanitizeInput(search, { maxLength: 100 });
                query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,message.ilike.%${searchTerm}%`);
            }

            const { data, error, count: total } = await query;

            if (error) {
                console.error('[API] Leads query error:', error);
                throw new Error(error.message);
            }
            leads = (data || []) as LeadRow[];
            count = total || 0;
        } else {
            // MOCK MODE
            const allLeads = mockStore.getLeads();
            let filtered = allLeads;

            if (status) filtered = filtered.filter(l => l.status === status);
            if (type) filtered = filtered.filter(l => l.type === type);
            if (search) {
                const lowSearch = search.toLowerCase();
                filtered = filtered.filter(l =>
                    l.name.toLowerCase().includes(lowSearch) ||
                    l.email.toLowerCase().includes(lowSearch) ||
                    l.message.toLowerCase().includes(lowSearch)
                );
            }

            count = filtered.length;
            // Manual pagination
            const start = offset;
            const end = offset + limit;
            leads = filtered.slice(start, end) as unknown as LeadRow[];
        }

        // ============================================
        // FORMAT RESPONSE
        // ============================================

        // Cast to LeadRow[] for type safety
        const formattedLeads = ((leads || []) as LeadRow[]).map(lead => ({
            id: lead.id,
            name: lead.name,
            firstName: lead.first_name,
            lastName: lead.last_name,
            email: lead.email,
            phone: lead.phone,
            subject: lead.subject,
            message: lead.message,
            type: lead.type,
            status: lead.status,
            priority: lead.priority,
            preferredContact: lead.preferred_contact,
            property: lead.properties ? {
                title: lead.properties.title,
                slug: lead.properties.slug
            } : null,
            source: lead.source,
            ipAddress: lead.ip_address,
            metadata: lead.metadata,
            createdAt: lead.created_at,
            contactedAt: lead.contacted_at
        }));

        return NextResponse.json({
            success: true,
            data: formattedLeads,
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit)
            }
        });

    } catch (error) {
        console.error('[API] Leads GET error:', error);

        return NextResponse.json({
            success: false,
            error: 'Failed to fetch leads'
        }, { status: 500 });
    }
}

// ============================================
// PATCH /api/leads - Update Lead Status
// ============================================

export async function PATCH(request: NextRequest) {
    // Authentication check
    // SECURITY: Use the standard auth cookie (matches login endpoint)
    const adminToken = request.cookies.get('modon_auth_token');
    if (!adminToken?.value) {
        return NextResponse.json({
            success: false,
            error: 'Admin authentication required'
        }, { status: 401 });
    }

    // SECURITY (VULN-003 FIX): Actually verify the JWT signature and check admin role
    try {
        const { verifyToken } = await import('@/server/auth/jwt');
        const tokenPayload = await verifyToken(adminToken.value);
        if (!tokenPayload || tokenPayload.role !== 'admin') {
            return NextResponse.json({
                success: false,
                error: 'Insufficient permissions. Admin role required.'
            }, { status: 403 });
        }
    } catch (_verifyError) {
        return NextResponse.json({
            success: false,
            error: 'Invalid or expired authentication token'
        }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, status, priority, notes } = body;

        if (!id) {
            return NextResponse.json({
                success: false,
                error: 'Lead ID is required'
            }, { status: 400 });
        }

        const supabase = getSupabase();
        const updates: Record<string, unknown> = {};

        if (status) {
            updates.status = sanitizeInput(status, { maxLength: 50 });
            if (status === 'contacted') {
                updates.contacted_at = new Date().toISOString();
            }
        }

        if (priority) {
            updates.priority = sanitizeInput(priority, { maxLength: 20 });
        }

        if (notes !== undefined) {
            updates.notes = sanitizeInput(notes, { maxLength: 2000 });
        }

        if (supabase) {
            const { data, error } = await supabase
                .from('leads')
                .update(updates as never)
                .eq('id', id)
                .select()
                .single();

            if (error) throw new Error(error.message);

            return NextResponse.json({
                success: true,
                message: 'Lead updated successfully',
                data
            });
        } else {
            // MOCK MODE
            const storeLeads = mockStore.getLeads();
            const leadIndex = storeLeads.findIndex(l => l.id === id);

            if (leadIndex === -1) {
                return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
            }

            const updatedLead = { ...storeLeads[leadIndex], ...updates };
            storeLeads[leadIndex] = updatedLead as any;

            return NextResponse.json({
                success: true,
                message: 'Lead updated successfully (Mock)',
                data: updatedLead
            });
        }

    } catch (error) {
        console.error('[API] Lead update error:', error);

        return NextResponse.json({
            success: false,
            error: 'Failed to update lead'
        }, { status: 500 });
    }
}
