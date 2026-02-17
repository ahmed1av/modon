#!/usr/bin/env ts-node
/**
 * Security Verification Script
 * ==============================
 * Automated smoke tests for critical security layers
 * 
 * Tests:
 * 1. Admin route protection (JWT verification)
 * 2. API route authentication (PUT/DELETE endpoints)
 * 3. Public endpoint accessibility
 * 4. Rate limiting protection
 * 
 * Usage:
 *   ts-node scripts/verify-security.ts
 *   or: npm run verify:security
 */

import * as http from 'http';

// ============================================
// CONFIGURATION
// ============================================

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:1000';
const ANSI_GREEN = '\x1b[32m';
const ANSI_RED = '\x1b[31m';
const ANSI_YELLOW = '\x1b[33m';
const ANSI_RESET = '\x1b[0m';

interface TestResult {
    name: string;
    passed: boolean;
    message: string;
    expectedStatus?: number;
    actualStatus?: number;
}

const results: TestResult[] = [];

// ============================================
// HTTP REQUEST HELPER
// ============================================

async function makeRequest(options: {
    path: string;
    method?: string;
    headers?: Record<string, string>;
    body?: unknown;
}): Promise<{ status: number; body: string; headers: http.IncomingHttpHeaders }> {
    return new Promise((resolve, reject) => {
        const url = new URL(options.path, BASE_URL);

        const requestOptions: http.RequestOptions = {
            hostname: url.hostname,
            port: url.port || (url.protocol === 'https:' ? 443 : 80),
            path: url.pathname + url.search,
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        };

        const req = http.request(requestOptions, (res) => {
            let body = '';

            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', () => {
                resolve({
                    status: res.statusCode || 0,
                    body,
                    headers: res.headers,
                });
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (options.body) {
            req.write(JSON.stringify(options.body));
        }

        req.end();
    });
}

// ============================================
// TEST SUITE
// ============================================

async function test1_AdminBypass() {
    console.log('\n🔒 Test 1: Admin Route Protection (No Token)');
    console.log('   Attempting to access /admin without authentication...');

    try {
        const response = await makeRequest({
            path: '/admin',
            method: 'GET',
        });

        // Expect redirect (302/307) or unauthorized (401)
        const validStatuses = [302, 307, 401];
        const passed = validStatuses.includes(response.status);

        results.push({
            name: 'Admin Route Protection',
            passed,
            message: passed
                ? 'Admin route correctly blocked unauthenticated access'
                : 'SECURITY RISK: Admin route accessible without token',
            expectedStatus: 302,
            actualStatus: response.status,
        });

        const icon = passed ? '✅' : '❌';
        const color = passed ? ANSI_GREEN : ANSI_RED;
        console.log(`   ${color}${icon} ${passed ? 'PASSED' : 'FAILED'}${ANSI_RESET}`);
        console.log(`   Expected: Redirect (302/307) or Unauthorized (401)`);
        console.log(`   Actual: ${response.status}`);

    } catch (error) {
        results.push({
            name: 'Admin Route Protection',
            passed: false,
            message: `Test failed with error: ${error}`,
        });
        console.log(`   ${ANSI_RED}❌ FAILED${ANSI_RESET} - ${error}`);
    }
}

async function test2_APIProtection() {
    console.log('\n🔒 Test 2: API Route Authentication (DELETE without token)');
    console.log('   Attempting to DELETE property without authentication...');

    try {
        const response = await makeRequest({
            path: '/api/properties/test-slug-12345',
            method: 'DELETE',
        });

        // Expect 401 Unauthorized
        const passed = response.status === 401;

        results.push({
            name: 'API DELETE Protection',
            passed,
            message: passed
                ? 'API correctly requires authentication for DELETE'
                : 'SECURITY RISK: DELETE endpoint accessible without token',
            expectedStatus: 401,
            actualStatus: response.status,
        });

        const icon = passed ? '✅' : '❌';
        const color = passed ? ANSI_GREEN : ANSI_RED;
        console.log(`   ${color}${icon} ${passed ? 'PASSED' : 'FAILED'}${ANSI_RESET}`);
        console.log(`   Expected: 401 Unauthorized`);
        console.log(`   Actual: ${response.status}`);

    } catch (error) {
        results.push({
            name: 'API DELETE Protection',
            passed: false,
            message: `Test failed with error: ${error}`,
        });
        console.log(`   ${ANSI_RED}❌ FAILED${ANSI_RESET} - ${error}`);
    }
}

async function test3_PublicAccess() {
    console.log('\n🌐 Test 3: Public Endpoint Accessibility');
    console.log('   Attempting to GET public properties...');

    try {
        const response = await makeRequest({
            path: '/api/properties',
            method: 'GET',
        });

        // Expect 200 OK
        const passed = response.status === 200;

        let responseData;
        try {
            responseData = JSON.parse(response.body);
        } catch {
            responseData = null;
        }

        results.push({
            name: 'Public API Access',
            passed,
            message: passed
                ? 'Public endpoint correctly accessible'
                : 'Public endpoint not responding correctly',
            expectedStatus: 200,
            actualStatus: response.status,
        });

        const icon = passed ? '✅' : '❌';
        const color = passed ? ANSI_GREEN : ANSI_RED;
        console.log(`   ${color}${icon} ${passed ? 'PASSED' : 'FAILED'}${ANSI_RESET}`);
        console.log(`   Expected: 200 OK`);
        console.log(`   Actual: ${response.status}`);

        if (responseData) {
            console.log(`   Response format: ${responseData.success ? 'Valid' : 'Invalid'}`);
        }

    } catch (error) {
        results.push({
            name: 'Public API Access',
            passed: false,
            message: `Test failed with error: ${error}`,
        });
        console.log(`   ${ANSI_RED}❌ FAILED${ANSI_RESET} - ${error}`);
    }
}

async function test4_RateLimiting() {
    console.log('\n⏱️  Test 4: Rate Limiting Protection');
    console.log('   Sending 6 rapid requests to test rate limiter...');

    try {
        const requests = [];

        // Send 6 rapid requests (limit is 5 per hour)
        for (let i = 0; i < 6; i++) {
            requests.push(
                makeRequest({
                    path: '/api/leads',
                    method: 'POST',
                    body: {
                        firstName: 'Test',
                        lastName: 'User',
                        email: 'test@example.com',
                        message: 'Rate limit test',
                    },
                })
            );
        }

        const responses = await Promise.all(requests);
        const statuses = responses.map(r => r.status);

        // Last request should be rate-limited (429)
        const rateLimitTriggered = statuses[statuses.length - 1] === 429;

        results.push({
            name: 'Rate Limiting',
            passed: rateLimitTriggered,
            message: rateLimitTriggered
                ? 'Rate limiting correctly blocks excessive requests'
                : 'Rate limiting may not be working',
            expectedStatus: 429,
            actualStatus: statuses[statuses.length - 1],
        });

        const icon = rateLimitTriggered ? '✅' : '⚠️';
        const color = rateLimitTriggered ? ANSI_GREEN : ANSI_YELLOW;
        console.log(`   ${color}${icon} ${rateLimitTriggered ? 'PASSED' : 'WARNING'}${ANSI_RESET}`);
        console.log(`   Statuses: [${statuses.join(', ')}]`);
        console.log(`   Expected 6th request: 429 (Rate Limited)`);
        console.log(`   Actual 6th request: ${statuses[statuses.length - 1]}`);

    } catch (error) {
        results.push({
            name: 'Rate Limiting',
            passed: false,
            message: `Test failed with error: ${error}`,
        });
        console.log(`   ${ANSI_YELLOW}⚠️ WARNING${ANSI_RESET} - ${error}`);
    }
}

// ============================================
// MAIN EXECUTION
// ============================================

async function runSecurityTests() {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║       MODON DEVELOPMENT - SECURITY VERIFICATION            ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log(`\n🎯 Testing against: ${BASE_URL}`);
    console.log(`⏰ Started at: ${new Date().toISOString()}\n`);

    // Run all tests
    await test1_AdminBypass();
    await test2_APIProtection();
    await test3_PublicAccess();
    await test4_RateLimiting();

    // Summary
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                    TEST SUMMARY                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    const passed = results.filter(r => r.passed).length;
    const total = results.length;
    const percentage = ((passed / total) * 100).toFixed(0);

    results.forEach((result) => {
        const icon = result.passed ? '✅' : '❌';
        const color = result.passed ? ANSI_GREEN : ANSI_RED;
        console.log(`${color}${icon} ${result.name}${ANSI_RESET}`);
        console.log(`   ${result.message}`);
        if (result.expectedStatus && result.actualStatus) {
            console.log(`   Expected: ${result.expectedStatus}, Got: ${result.actualStatus}`);
        }
        console.log('');
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const summaryColor = passed === total ? ANSI_GREEN : ANSI_YELLOW;
    console.log(`${summaryColor}📊 Results: ${passed}/${total} tests passed (${percentage}%)${ANSI_RESET}\n`);

    if (passed === total) {
        console.log('🎉 All security tests PASSED! Application is secure.\n');
        process.exit(0);
    } else {
        console.log('⚠️  Some tests FAILED. Review security configuration.\n');
        process.exit(1);
    }
}

// Run tests if executed directly
if (require.main === module) {
    runSecurityTests().catch((error) => {
        console.error(`${ANSI_RED}❌ Fatal error: ${error}${ANSI_RESET}`);
        process.exit(1);
    });
}

export { runSecurityTests, makeRequest };
