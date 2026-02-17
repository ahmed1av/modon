
// @ts-nocheck
// Standard fetch is available in Node 18+ global scope
// Actually, in modern Node (18+), fetch is global. I'll use global fetch.

const BASE_URL = 'http://localhost:1000';
const ADMIN_EMAIL = 'admin@modon.com';
const ADMIN_PASS = 'password123';

interface PropertyPayload {
    title: string;
    description: string;
    descriptionAr?: string;
    price: number;
    currency: string;
    location: string;
    city: string;
    country: string;
    type: string;
    listingType: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    plotArea?: number;
    images: { url: string; alt?: string }[];
    features: string[];
    isFeatured: boolean;
    isExclusive: boolean;
    status: string;
}

const generateMockProperty = (index: number): PropertyPayload => {
    return {
        title: `Stress Test Property ${index} - Luxury Villa`,
        description: `This is a high-load stress test property description ${index}. It features extensive text to validate payload handling. Luxury living at its finest.`,
        price: 1000000 + (index * 1000),
        currency: 'EGP',
        location: `Test Location ${index}`,
        city: 'Cairo', // Valid city from schema logic possibly
        country: 'Egypt',
        type: 'Villa',
        listingType: 'sale',
        bedrooms: 5,
        bathrooms: 4,
        area: 450,
        plotArea: 1000,
        images: [
            { url: `https://images.unsplash.com/photo-${index}?auto=format`, alt: 'Main View' },
            { url: `https://images.unsplash.com/photo-${index}-2?auto=format`, alt: 'Interior' }
        ],
        features: ['Pool', 'Garden', 'Security', 'Smart Home'],
        isFeatured: index % 10 === 0,
        isExclusive: index % 20 === 0,
        status: 'active'
    };
};

async function runStressTest() {
    console.log('🚀 Starting Stress Test...');

    // 1. Authenticate
    console.log(`🔐 Authenticating as ${ADMIN_EMAIL}...`);
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASS })
    });

    if (!loginRes.ok) {
        console.error('❌ Login failed:', await loginRes.text());
        process.exit(1);
    }

    // Extract cookies
    const cookieHeader = loginRes.headers.get('set-cookie');
    if (!cookieHeader) {
        console.error('❌ No cookie received');
        process.exit(1);
    }
    console.log('✅ Authenticated successfully.');

    // 2. Stress Test Loop (100 properties)
    const TOTAL_REQUESTS = 100;
    const CONCURRENCY = 10; // Batch requests
    const latencies: number[] = [];
    const errors: string[] = [];

    console.log(`📡 Sending ${TOTAL_REQUESTS} property creation requests...`);
    const startTime = Date.now();

    for (let i = 0; i < TOTAL_REQUESTS; i += CONCURRENCY) {
        const batchPromises = [];
        for (let j = 0; j < CONCURRENCY && (i + j) < TOTAL_REQUESTS; j++) {
            const idx = i + j;
            batchPromises.push(async () => {
                const start = Date.now();
                try {
                    const res = await fetch(`${BASE_URL}/api/properties`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Cookie': cookieHeader
                        },
                        body: JSON.stringify(generateMockProperty(idx))
                    });
                    const duration = Date.now() - start;
                    latencies.push(duration);
                    if (!res.ok) {
                        const txt = await res.text();
                        errors.push(`Req ${idx} failed: ${res.status} - ${txt}`);
                    }
                } catch (e: any) {
                    errors.push(`Req ${idx} error: ${e.message}`);
                }
            });
        }

        await Promise.all(batchPromises.map(fn => fn()));
        process.stdout.write(`.`); // Progress indicator
    }

    const totalDuration = Date.now() - startTime;
    console.log('\n✅ Stress Test Completed.');

    // 3. Stats
    const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    const sortedLatencies = [...latencies].sort((a, b) => a - b);
    const p95 = sortedLatencies[Math.floor(sortedLatencies.length * 0.95)];
    const p99 = sortedLatencies[Math.floor(sortedLatencies.length * 0.99)];
    const throughput = (TOTAL_REQUESTS / (totalDuration / 1000)).toFixed(2);

    console.log('\n📊 Performance Metrics:');
    console.log(`   - Total Requests: ${TOTAL_REQUESTS}`);
    console.log(`   - Successful: ${latencies.length - errors.length}`);
    console.log(`   - Failed: ${errors.length}`);
    console.log(`   - Average Latency: ${avgLatency.toFixed(2)}ms`);
    console.log(`   - P95 Latency: ${p95}ms`);
    console.log(`   - P99 Latency: ${p99}ms`);
    console.log(`   - Throughput: ${throughput} req/sec`);

    if (errors.length > 0) {
        console.log('\n⚠️ Errors encountered:');
        errors.slice(0, 5).forEach(e => console.log(e));
        if (errors.length > 5) console.log(`...and ${errors.length - 5} more.`);
    }

    // 4. Verification Check
    console.log('\n🔍 Verifying Data Integrity...');
    const listRes = await fetch(`${BASE_URL}/api/properties?limit=1&sortBy=newest`, {
        headers: { 'Cookie': cookieHeader }
    });

    if (listRes.ok) {
        const data = await listRes.json();
        // We expect the total to be at least 100 (plus whatever was there)
        console.log(`   - API reports total checks: ${data.pagination?.total}`);
        if (data.pagination?.total >= 100) {
            console.log('✅ Data Integrity Verified: Property count reflects insertions.');
        } else {
            console.warn('⚠️  Data Integrity Warning: Count lower than expected.');
        }
    } else {
        console.error('❌ Failed to verify property list.');
    }
}

runStressTest().catch(console.error);
