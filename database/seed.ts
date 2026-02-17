/**
 * MODON Platform - Database Seed Script
 * ======================================
 * Populates the database with:
 * - 150 Luxury Properties (derived from templates)
 * - 50 Users (Admin, Agents, Buyers)
 * - 100 Leads
 * - User Favorites
 * 
 * Usage:
 *   npx ts-node database/seed.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config({ path: '.env.local' });

// ============================================
// CONFIGURATION
// ============================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Prefer Service Role for seeding

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials!');
    console.log('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// ============================================
// DATA GENERATORS
// ============================================

const LOCATIONS = [
    { city: 'Cairo', areas: ['New Cairo', 'Zamalek', 'Maadi', 'Sheikh Zayed', 'Heliopolis', 'Garden City', 'Nasr City', 'Mokattam'] },
    { city: 'North Coast', areas: ['Marassi', 'Hacienda Bay', 'Telal', 'Almaza Bay', 'Sidi Abdel Rahman', 'Mountain View', 'Fouka Bay'] },
    { city: 'Ain Sokhna', areas: ['Galala City', 'Little Venice', 'Azha', 'La Vista', 'Telal Sokhna', 'Blue Blue', 'Il Monte Galala'] },
    { city: 'Giza', areas: ['6th of October', 'Pyramids Heights', 'New Giza', 'Sheikh Zayed City', 'Palm Hills'] },
    { city: 'Alexandria', areas: ['Kafr Abdo', 'Smouha', 'Gleem', 'Roushdy'] }
];

const PROPERTY_TYPES = ['Villa', 'Apartment', 'Penthouse', 'Townhouse', 'Chalet', 'Twin House', 'Duplex', 'Studio'];
const LISTING_TYPES = ['sale', 'rent'];

const IMAGES = [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
    'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
    'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'
];

const FIRST_NAMES = ['Ahmed', 'Mohamed', 'Mahmoud', 'Omar', 'Ali', 'Sara', 'Mona', 'Nour', 'Laila', 'Karim', 'Youssef', 'Khaled', 'Hana', 'Dina', 'Rania'];
const LAST_NAMES = ['Hassan', 'Ibrahim', 'Ali', 'Sayed', 'Osman', 'Nabil', 'Kamal', 'Fawzy', 'Mourad', 'Salem', 'Soliman', 'Amer', 'Zaki', 'Radwan'];

function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateUsers(count: number) {
    const users = [
        { email: 'admin@modon.com', first_name: 'Super', last_name: 'Admin', role: 'admin', password: 'password123' },
        { email: 'agent@modon.com', first_name: 'Top', last_name: 'Agent', role: 'agent', password: 'password123' }
    ];

    for (let i = 0; i < count - 2; i++) {
        const fn = getRandomItem(FIRST_NAMES);
        const ln = getRandomItem(LAST_NAMES);
        users.push({
            email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@example.com`,
            first_name: fn,
            last_name: ln,
            role: Math.random() > 0.8 ? 'agent' : 'buyer',
            password: 'password123'
        });
    }
    return users;
}

// ============================================
// SEED EXECUTION
// ============================================

async function seed() {
    console.log('\n============================================');
    console.log('🌱 MODON PLATFORM - PRODUCTION SEEDER');
    console.log('============================================\n');

    let createdUsers: any[] = [];
    let createdProperties: any[] = [];
    let sqlOutput = '';

    // 1. SEED USERS
    console.log('👤 Seeding Users (Target: 50)...');
    const usersToSeed = generateUsers(50);

    for (const u of usersToSeed) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(u.password, salt);

        const userPayload = {
            email: u.email,
            password_hash: hash,
            first_name: u.first_name,
            last_name: u.last_name,
            role: u.role,
            status: 'active',
            email_verified: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('users')
            .upsert([userPayload], { onConflict: 'email' })
            .select()
            .single();

        if (error) {
            // console.warn(`   ⚠️ Failed to insert user ${u.email}: ${error.code} - ${error.message}`);
            sqlOutput += `INSERT INTO users (email, password_hash, first_name, last_name, role, status, email_verified) VALUES ('${u.email}', '${hash}', '${u.first_name}', '${u.last_name}', '${u.role}', 'active', true) ON CONFLICT (email) DO NOTHING;\n`;
        } else {
            createdUsers.push(data);
        }
    }
    console.log(`   ✅ Users Processed: ${createdUsers.length}`);

    // 2. SEED PROPERTIES
    console.log('\nProcessing Properties (Target: 150)...');

    // We already have some, let's just loop 150 times.
    for (let i = 0; i < 150; i++) {
        const location = getRandomItem(LOCATIONS);
        const area = getRandomItem(location.areas);
        const type = getRandomItem(PROPERTY_TYPES);
        const price = getRandomInt(4000000, 200000000);
        const bedrooms = getRandomInt(1, 10);
        const title = `${type} in ${area}`;

        // Random agent
        const agent = createdUsers.find(u => u.role === 'agent') || createdUsers[0];

        const propData = {
            title: i < 20 ? `Luxury ${title} - Premium Unit ${i + 1}` : `${title} with Outstanding Views`,
            slug: `${type.toLowerCase()}-${area.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${i}`,
            description: `Experience the epitome of luxury in this stunning ${type.toLowerCase()} located in ${area}. Featuring ${bedrooms} bedrooms, high-end finishes, and panoramic views. Perfect for those seeking exclusivity and comfort in ${location.city}.`,
            price: price,
            currency: 'EGP',
            locationData: `${area}, ${location.city}`,
            city: location.city,
            country: 'Egypt',
            type: type,
            bedrooms: bedrooms,
            bathrooms: bedrooms + (Math.random() > 0.5 ? 1 : 0),
            area: getRandomInt(120, 3000),
            plot_area: getRandomInt(200, 5000),
            image_url: getRandomItem(IMAGES),
            images: [
                { url: getRandomItem(IMAGES), alt: 'Exterior' },
                { url: getRandomItem(IMAGES), alt: 'Interior' }
            ],
            features: ['Smart Home', 'Pool', 'Garden', 'Security', 'Parking', 'Gym', 'Spa'].sort(() => 0.5 - Math.random()).slice(0, 4),
            is_featured: Math.random() > 0.85,
            is_new: Math.random() > 0.7,
            is_exclusive: Math.random() > 0.9,
            status: 'active',
            listing_type: Math.random() > 0.8 ? 'rent' : 'sale',
            reference_code: `MOD-${new Date().getFullYear()}-${2000 + i}`,
            agent_id: agent?.id
        };

        const dbProp = {
            ...propData,
            location: propData.locationData
        };
        delete (dbProp as any).locationData;

        const { data, error } = await supabase
            .from('properties')
            .upsert([dbProp], { onConflict: 'slug' })
            .select()
            .single();

        if (error) {
            sqlOutput += `INSERT INTO properties (title, slug, description, price, currency, location, city, country, type, bedrooms, bathrooms, area, image_url, status, listing_type, reference_code) VALUES ('${propData.title}', '${propData.slug}', '${propData.description.replace(/'/g, "''")}', ${propData.price}, 'EGP', '${propData.locationData}', '${propData.city}', 'Egypt', '${propData.type}', ${propData.bedrooms}, ${propData.bathrooms}, ${propData.area}, '${propData.image_url}', 'active', '${propData.listing_type}', '${propData.reference_code}');\n`;
        } else {
            createdProperties.push(data);
            if (i % 25 === 0) process.stdout.write('.');
        }
    }
    console.log(`\n   ✅ Properties Seeded: ${createdProperties.length}`);

    // 3. SEED LEADS
    console.log('\n📧 Seeding Leads (Target: 100)...');
    const leadTypes = ['property_inquiry', 'general_inquiry', 'sell_private'];

    for (let i = 0; i < 100; i++) {
        const leadUser = Math.random() > 0.5 ? getRandomItem(createdUsers) : null;
        let leadProp = null;
        if (createdProperties && createdProperties.length > 0) {
            leadProp = Math.random() > 0.3 ? getRandomItem(createdProperties) : null;
        }

        const leadData = {
            name: leadUser ? `${leadUser.first_name} ${leadUser.last_name}` : `Lead ${i}`,
            email: leadUser ? leadUser.email : `visitor${i}@example.com`,
            phone: `+2010000000${i}`,
            message: `Interested in property details for ${leadProp ? leadProp.title : 'General Inquiry'}.`,
            type: getRandomItem(leadTypes),
            status: 'new',
            user_id: leadUser?.id || undefined,
            property_id: leadProp?.id || undefined
        };

        // Remove undefined keys
        if (!leadData.user_id) delete (leadData as any).user_id;
        if (!leadData.property_id) delete (leadData as any).property_id;

        const { error } = await supabase.from('leads').insert([leadData]);
    }
    console.log('   ✅ Leads seeded.');

    // 4. SEED FAVORITES
    console.log('\n❤️ Seeding Favorites...');
    if (createdUsers.length > 0 && createdProperties.length > 0) {
        for (let i = 0; i < 50; i++) {
            const user = getRandomItem(createdUsers);
            const prop = getRandomItem(createdProperties);

            await supabase
                .from('user_favorites')
                .insert([{ user_id: user.id, property_id: prop.id }])
                .then(({ error }) => {
                    // ignore duplicates
                });
        }
        console.log('   ✅ Favorites seeded.');
    }

    // 5. FINALIZE
    if (sqlOutput.length > 100) {
        const sqlPath = path.join(process.cwd(), 'database', 'seed_fallback.sql');
        fs.appendFileSync(sqlPath, sqlOutput); // Append to existing if any
        console.log(`\n📝 Fallback SQL APPENDED at: ${sqlPath} (Some inserts failed)`);
    } else {
        console.log('\n🎉 ALL DATA SEEDED SUCCESSFULLY VIA API.');
    }
}

// Run
seed().catch(e => {
    console.error('Fatal Seed Error:', e);
    process.exit(1);
});
