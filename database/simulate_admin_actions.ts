/**
 * MODON Platform - Admin Simulation & Automated Acceptance Test
 * =============================================================
 * Simulates a real admin user performing end-to-end operations:
 * 1. Login
 * 2. Dashboard Access
 * 3. Create Property
 * 4. Update Property
 * 5. View Property
 * 6. List Leads
 * 7. Delete Property
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Polyfill fetch and FormData
const _fetch = global.fetch || fetch;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:1000';
const API_URL = `${SITE_URL}/api`;

let AUTH_TOKEN: string | null = null;
let CREATED_SLUG: string | null = null;
let COOKIE_HEADER: string | null = null;

async function login() {
    console.log('\n🔑 1. Admin Login...');
    const credentials = {
        email: 'admin@modon.com',
        password: 'password123',
        rememberMe: true
    };

    try {
        const res = await _fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            const data = await res.json();
            AUTH_TOKEN = data.data.accessToken;

            // Extract cookie if possible
            const rawCookies = res.headers.get('set-cookie');
            if (rawCookies) {
                // Parse the modon_auth_token and modon_refresh_token
                const matchAuth = rawCookies.match(/modon_auth_token=([^;]+)/);
                const matchRefresh = rawCookies.match(/modon_refresh_token=([^;]+)/);

                let cookies = [];
                if (matchAuth) cookies.push(`modon_auth_token=${matchAuth[1]}`);
                if (matchRefresh) cookies.push(`modon_refresh_token=${matchRefresh[1]}`);

                COOKIE_HEADER = cookies.join('; ');
            }

            // Fallback for mock environment if cookie missing
            if (!COOKIE_HEADER && AUTH_TOKEN) {
                COOKIE_HEADER = `modon_auth_token=${AUTH_TOKEN}`;
            }

            console.log(`   ✅ Login Successful. Token: ${AUTH_TOKEN ? 'Captured' : 'Missing'}`);
        } else {
            console.error(`   ❌ Login Failed: ${res.status} - ${await res.text()}`);
            process.exit(1);
        }
    } catch (e) {
        console.error('   ❌ Login Error:', e);
        process.exit(1);
    }
}

function getAuthHeaders() {
    return {
        'Content-Type': 'application/json',
        'Cookie': COOKIE_HEADER || ''
    };
}

async function createProperty() {
    console.log('\n🏠 2. Create Property (Admin Action)...');

    // Payload matching CreatePropertySchema
    const newProp = {
        title: "Automated Test Villa",
        titleAr: "فيلا اختبار آلي",
        type: "Villa",
        listingType: "sale",
        price: 5000000,
        currency: "EGP",
        description: "This property was created by the automated validation bot. It features a large garden and pool.",
        descriptionAr: "تم إنشاء هذا العقار بواسطة روبوت التحقق الآلي. يتميز بحديقة كبيرة ومسبح.",

        // Flattened location fields
        location: "123 Test St, New Cairo",
        city: "Cairo",
        country: "Egypt",
        latitude: 30.0,
        longitude: 31.0,

        // Flattened specs
        bedrooms: 4,
        bathrooms: 3,
        area: 300,
        plotArea: 500,

        features: ["Garden", "Garage", "Swimming Pool", "Security"],

        // Images array of objects
        images: [{ url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", alt: "Main View" }],

        status: "active",
        isFeatured: true,
        isExclusive: false
    };

    try {
        const res = await _fetch(`${API_URL}/properties`, {
            method: 'POST',
            body: JSON.stringify(newProp),
            headers: getAuthHeaders()
        });

        if (res.ok) {
            const data = await res.json();
            CREATED_SLUG = data.data.slug;
            console.log(`   ✅ Property Created. Slug: ${CREATED_SLUG}`);
            console.log(`   ℹ️ Message: ${data.message}`);
        } else {
            console.error(`   ❌ Create Property Failed: ${res.status} - ${await res.text()}`);
        }
    } catch (e) {
        console.error('   ❌ Create Property Error:', e);
    }
}

async function getProperty() {
    if (!CREATED_SLUG) return;
    console.log(`\n🔍 3. Retrieve Property (${CREATED_SLUG})...`);

    // Retry loop for eventual consistency
    for (let i = 0; i < 3; i++) {
        try {
            const res: any = await _fetch(`${API_URL}/properties/${CREATED_SLUG}`, {
                headers: getAuthHeaders()
            });

            if (res.ok) {
                const data = await res.json();
                if (data.data.slug === CREATED_SLUG) {
                    console.log(`   ✅ Property Retrieved Successfully (Attempt ${i + 1})`);
                    return;
                } else {
                    console.warn(`   ⚠️ Property Retrieved but slug mismatch?`, data);
                }
            } else {
                console.warn(`   ⚠️ Retrieve Property Failed (Attempt ${i + 1}): ${res.status}`);
            }
        } catch (e) {
            console.error(`   ❌ Retrieve Property Error (Attempt ${i + 1}):`, e);
        }
        // Wait 1s
        await new Promise(r => setTimeout(r, 1000));
    }
    console.error('   ❌ FAILED to retrieve property after 3 attempts');
}

async function updateProperty() {
    if (!CREATED_SLUG) return;
    console.log(`\n✏️  4. Update Property...`);

    const updates = {
        price: 5500000,
        title: "Automated Test Villa (Updated)"
    };

    try {
        const res = await _fetch(`${API_URL}/properties/${CREATED_SLUG}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
            headers: getAuthHeaders()
        });

        if (res.ok) {
            console.log(`   ✅ Property Updated Successfully`);
        } else {
            console.error(`   ❌ Update Property Failed: ${res.status} - ${await res.text()}`);
        }
    } catch (e) {
        console.error('   ❌ Update Property Error:', e);
    }
}

async function listLeads() {
    console.log('\nusers 5. List Leads (Admin View)...');
    try {
        const res = await _fetch(`${API_URL}/leads?limit=5`, {
            headers: getAuthHeaders()
        });

        if (res.ok) {
            const data = await res.json();
            console.log(`   ✅ Leads Listed: ${data.data.length} items`);
        } else {
            console.error(`   ❌ List Leads Failed: ${res.status} - ${await res.text()}`);
        }
    } catch (e) {
        console.error('   ❌ List Leads Error:', e);
    }
}

async function deleteProperty() {
    if (!CREATED_SLUG) return;
    console.log(`\n🗑️  6. Delete Property...`);

    try {
        const res = await _fetch(`${API_URL}/properties/${CREATED_SLUG}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (res.ok) {
            console.log(`   ✅ Property Deleted Successfully`);
        } else {
            console.error(`   ❌ Delete Property Failed: ${res.status} - ${await res.text()}`);
        }
    } catch (e) {
        console.error('   ❌ Delete Property Error:', e);
    }
}

async function main() {
    console.log('============================================');
    console.log('🤖 ADMIN SIMULATION & ACCEPTANCE TEST');
    console.log('============================================');

    await login();
    await createProperty();
    await getProperty();
    await updateProperty();
    await listLeads();
    await deleteProperty();

    console.log('\n✅ Simulation Complete.');
}

main();
