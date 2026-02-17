/**
 * Create Admin User Script
 * ========================
 * Creates a default admin user for testing
 */

import { createClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcryptjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
    console.log('👑 Creating Admin User...');

    const email = 'admin@modon.com';
    const password = 'password123';
    const passwordHash = await bcrypt.hash(password, 12);

    // Check if exists
    const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

    if (existing) {
        console.log('Admin already exists. Updating password...');
        await supabase
            .from('users')
            .update({
                password_hash: passwordHash,
                status: 'active',
                role: 'admin',
                first_name: 'Admin',
                last_name: 'Modon'
            })
            .eq('id', existing.id);
    } else {
        console.log('Creating new admin...');
        const { error } = await supabase.from('users').insert({
            email,
            password_hash: passwordHash,
            first_name: 'Admin',
            last_name: 'User',
            role: 'admin',
            status: 'active',
            preferred_language: 'en',
            preferred_currency: 'EGP'
        });

        if (error) {
            console.error('Error creating admin:', error);
            return;
        }
    }

    console.log('✅ Admin User Ready:');
    console.log('   Email: admin@modon.com');
    console.log('   Pass:  password123');
}

createAdmin();
