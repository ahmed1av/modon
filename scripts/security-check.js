const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const RESET = '\x1b[0m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';

console.log(`${BLUE}🔒 Starting Security Audit...${RESET}\n`);

let hasError = false;

function fail(message) {
    console.error(`${RED}❌ [FAIL] ${message}${RESET}`);
    hasError = true;
}

function pass(message) {
    console.log(`${GREEN}✔ [PASS] ${message}${RESET}`);
}

function warn(message) {
    console.warn(`${YELLOW}⚠ [WARN] ${message}${RESET}`);
}

// 1. Check .env.local (keys and gitignore)
console.log(`${BLUE}--- Checking Environment Variables ---${RESET}`);

// Check gitignore
try {
    const gitignore = fs.readFileSync('.gitignore', 'utf8');
    if (!gitignore.includes('.env.local')) {
        fail('.env.local is NOT in .gitignore!');
    } else {
        pass('.env.local is ignored in git.');
    }
} catch (e) {
    fail('Could not read .gitignore');
}

// Check .env.local content
if (!fs.existsSync('.env.local')) {
    warn('.env.local file not found. Skipping env scan.');
} else {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const lines = envContent.split('\n');
    let hasNextPublicSecret = false;

    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('#') || !trimmed.includes('=')) return;

        const [key, value] = trimmed.split('=');

        // Check for NEXT_PUBLIC_ + SECRET/KEY usage that looks suspicious
        if (key.startsWith('NEXT_PUBLIC_')) {
            if (key.includes('SECRET') || key.includes('SERVICE_ROLE') || key.includes('PRIVATE')) {
                fail(`Sensitive key exposed: ${key} starts with NEXT_PUBLIC_`);
                hasNextPublicSecret = true;
            }
        }
    });

    if (!hasNextPublicSecret) {
        pass('No obvious secrets exposed via NEXT_PUBLIC_.');
    }
}

// 2. Scan Codebase for Leaks and Bad Practices
console.log(`\n${BLUE}--- Scanning Codebase ---${RESET}`);

const SOURCE_DIR = 'src';

function getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            getAllFiles(filePath, fileList);
        } else {
            if (/\.(ts|tsx|js|jsx)$/.test(file)) {
                fileList.push(filePath);
            }
        }
    });

    return fileList;
}

try {
    const allFiles = getAllFiles(SOURCE_DIR);

    allFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');

        // Check 1: Hardcoded "sb_secret_"
        // We look for 'sb_secret_' string, but exclude the security check script itself if it scans itself (it is in scripts/ not src/, so safe)
        if (content.includes('sb_secret_')) {
            // Check if it's just the variable name in process.env (allowable) or a string literal
            // Simplified check: validation
            // If it's literally "sb_secret_" followed by something, it's likely a hardcoded key.
            // But we created a placeholder in .env.local... scanning code, not env.
            // The user instruction: "If sb_secret_ found inside any file other than server -> stop process."
            // We assume 'server' context is API routes or lib/dal.

            const isServerFile = file.includes('/api/') || file.includes('/dal/') || file.includes('/lib/');
            if (!isServerFile) {
                fail(`Hardcoded secret pattern 'sb_secret_' found in non-server file: ${file}`);
            } else {
                // Even in server files, we should not have hardcoded keys, only env vars.
                // But maybe strings like "sb_secret_" are used for validation logic?
                // Warning only for server files if it looks like a key.
                if (/"sb_secret_[a-zA-Z0-9]+/.test(content)) {
                    warn(`Possible hardcoded secret in server file: ${file}`);
                }
            }
        }

        // Check 2: Usage of SUPABASE_SERVICE_ROLE_KEY in client components
        if (content.includes('SUPABASE_SERVICE_ROLE_KEY')) {
            // detailed check for "use client"
            if (content.includes('"use client"') || content.includes("'use client'")) {
                fail(`SUPABASE_SERVICE_ROLE_KEY accessed in Client Component: ${file}`);
            }
        }
    });

    pass('Code scanning completed.');

} catch (e) {
    fail(`Error scanning files: ${e.message}`);
}

// 3. Git History Check (Simple check of staged files)
console.log(`\n${BLUE}--- Checking Git Status ---${RESET}`);
try {
    // Check staged files for .env
    const stagedFiles = execSync('git diff --cached --name-only').toString();
    if (stagedFiles.includes('.env')) {
        fail('Environment file is staged for commit!');
    } else {
        pass('No environment files staged.');
    }
} catch (e) {
    warn('Could not run git checks (not a git repo or git not found).');
}

console.log('\n------------------------------------------------');
if (hasError) {
    console.error(`${RED}⛔ SECURITY CHECK FAILED. Fix issues before deploying.${RESET}`);
    process.exit(1);
} else {
    console.log(`${GREEN}✅ SECURITY CHECK PASSED.${RESET}`);
    process.exit(0);
}
