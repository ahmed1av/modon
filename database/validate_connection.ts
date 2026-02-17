
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const REQUIRED_TABLES = ['properties', 'users', 'leads', 'user_favorites'];

// Color codes for console output
const COLORS = {
    RESET: '\x1b[0m',
    RED: '\x1b[31m',
    GREEN: '\x1b[32m',
    YELLOW: '\x1b[33m',
    BLUE: '\x1b[34m',
    CYAN: '\x1b[36m'
};

function log(level: 'INFO' | 'PASS' | 'FAIL' | 'WARN', message: string) {
    let color = COLORS.RESET;
    switch (level) {
        case 'INFO': color = COLORS.CYAN; break;
        case 'PASS': color = COLORS.GREEN; break;
        case 'FAIL': color = COLORS.RED; break;
        case 'WARN': color = COLORS.YELLOW; break;
    }
    console.log(`${color}[${level}] ${message}${COLORS.RESET}`);
}

async function main() {
    log('INFO', 'Starting Supabase Connection & Validation...');

    if (!supabaseUrl || !supabaseKey) {
        log('FAIL', 'Missing Supabase credentials in .env.local');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        }
    });

    // 1. Test Connection
    log('INFO', `Connecting to ${supabaseUrl}...`);
    try {
        // Simple query to test connection. 'users' might not exist yet, so we query a system table or just init.
        // We'll try to list tables using a query or just a simple robust check.
        // Actually, let's just try to query 'properties' and see if it errors with 'relation does not exist' vs 'connection error'.
        const { data, error } = await supabase.from('properties').select('id').limit(1);

        if (error) {
            if (error.code === 'PGRST301' || error.message?.includes('relation "public.properties" does not exist')) {
                log('PASS', 'Connected to Supabase (Database exists, tables may be missing)');
            } else if (error.message?.includes('FetchError') || error.message?.includes('enotfound')) {
                log('FAIL', `Connection failed: ${error.message}`);
                // Fallback check?
            } else {
                // It might be a permission error if key is invalid
                log('WARN', `Connection issue or Table missing: ${error.message} (Code: ${error.code})`);
                if (error.code === '401' || error.message.includes('JWT')) {
                    log('FAIL', 'Authentication failed. Check SUPABASE_SERVICE_ROLE_KEY.');
                    return;
                }
            }
        } else {
            log('PASS', 'Connected successfully to Supabase.');
        }

    } catch (e: any) {
        log('FAIL', `Unexpected connection error: ${e.message}`);
        return;
    }

    // 2. Validate Tables
    log('INFO', 'Verifying required tables...');
    const tablesStatus: Record<string, boolean> = {};

    for (const table of REQUIRED_TABLES) {
        const { error } = await supabase.from(table).select('id').limit(1);
        // If error is "relation does not exist", table is missing.
        // If error is null or empty, table exists.

        if (!error) {
            log('PASS', `Table '${table}' exists.`);
            tablesStatus[table] = true;
        } else {
            if (error.code === '42P01') { // PostgreSQL code for undefined table
                log('WARN', `Table '${table}' is MISSING.`);
                tablesStatus[table] = false;
            } else {
                // If we use a publishable key, we might get 401 Unauthorized for tables with RLS and no public policy
                // OR we get 401 if the key itself is bad.
                // Assuming service role key, we should bypass RLS.
                log('WARN', `Could not verify '${table}': ${error.message} (${error.code})`);
                tablesStatus[table] = false;
            }
        }
    }

    // 3. Create Missing Tables
    // Note: The supabase-js client cannot execute raw SQL unless we use the rpc() call to a function that executes SQL, 
    // OR if we use the REST API to post to valid endpoints. 
    // Standard Supabase client DOES NOT support arbitrary SQL execution directly without an endpoint or pg driver.
    // However, the prompt asks to "Create it using schema...". 
    // Check if we can use a direct postgres connection via 'pg' library? 
    // The prompt says "using the Service Role Key". 

    // Since we don't have the direct postgres connection string (only the HTTP URL and Key), 
    // we cannot easily run "CREATE TABLE" statements via 'supabase-js' client unless we have a stored procedure for it.

    // BUT! I can provide the SQL instructions to the user or report that manual execution is needed.
    // OR, if I have a "pg" connection string in env, I could use that. I do NOT have it in .env.local usually.
    // The previous context "create-admin.ts" used supabase-js. 

    // Strategy: Since I cannot create tables via supabase-js without an RPC, 
    // I will log the SQL commands needed and mark them as "PENDING MANUAL EXECUTION" or "FAILED AUTO-CREATION".
    // Wait, usually the "Service Role Key" allows admin API access but creating tables is a Management API feature or SQL feature.

    // Let's check if the user provided connection string?
    // User only provided URL and Key.

    // However, if the user provided the "sb_publishable_..." key, it is NOT a service role key.
    // It is an API key. I cannot create tables with it anyway.

    // I will generate the report with the status.

    const missingTables = REQUIRED_TABLES.filter(t => !tablesStatus[t]);

    if (missingTables.length > 0) {
        log('WARN', `Missing tables: ${missingTables.join(', ')}`);
        log('INFO', 'Attempting to locate SQL files for missing tables...');

        const sqlFiles = {
            'properties': 'database/schema.sql',
            'leads': 'database/schema.sql',
            'users': 'database/users_schema.sql',
            'user_favorites': 'database/favorites_schema.sql'
        };

        for (const table of missingTables) {
            const file = sqlFiles[table as keyof typeof sqlFiles];
            if (fs.existsSync(file)) {
                log('INFO', `SQL for '${table}' found in '${file}'.`);
                // Here we would execute it if we could.
                log('WARN', `Cannot auto-execute SQL via HTTP client for '${table}'. Run SQL in Supabase Dashboard.`);
            } else {
                log('FAIL', `SQL file for '${table}' NOT found.`);
            }
        }
    }
}

main().catch(console.error);
