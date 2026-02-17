
/**
 * HIGH-FIDELITY MOCK STORE (Simulation Mode)
 * ==========================================
 * Centralized in-memory storage for the Investor War Room simulation.
 * Ensures data consistency across API routes when Supabase is disconnected.
 */

import { MOCK_PROPERTIES } from '@/data/mock-properties';

import fs from 'fs';
import path from 'path';

// Types derived from usage
export interface MockLead {
    id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    type: string;
    status: string;
    created_at: string;
    source?: string;
    property_slug?: string;
}

export interface MockUser {
    id: string;
    email: string;
    role: string;
    created_at: string;
}

class MockStore {
    public properties = [...MOCK_PROPERTIES];
    public leads: MockLead[] = [];
    public users: MockUser[] = [
        {
            id: 'mock-admin-id',
            email: 'admin@modon.com',
            role: 'admin',
            created_at: new Date().toISOString()
        }
    ];
    public favorites: Record<string, string[]> = {}; // userId -> propertyIds

    private persistenceFile = path.resolve(process.cwd(), '.mock-state.json');

    constructor() {
        this.loadState();
        console.log('🚀 [SIMULATION] High-Fidelity Mock Store Initialized');
        console.log(`   - Properties: ${this.properties.length}`);
        console.log(`   - Users: ${this.users.length}`);
    }

    private loadState() {
        if (typeof window !== 'undefined') return; // Skip on client
        try {
            if (fs.existsSync(this.persistenceFile)) {
                const data = fs.readFileSync(this.persistenceFile, 'utf-8');
                const state = JSON.parse(data);
                if (state.properties) {
                    // Merge saved properties with MOCK_PROPERTIES, prioritizing saved
                    const savedIds = new Set(state.properties.map((p: any) => p.id));
                    const newMocks = MOCK_PROPERTIES.filter(p => !savedIds.has(p.id));
                    this.properties = [...state.properties, ...newMocks];
                }
                if (state.leads) this.leads = state.leads;
                if (state.users) this.users = state.users;
                if (state.favorites) this.favorites = state.favorites;
                console.log('📦 Loaded mock state from disk');
            }
        } catch (e) {
            console.error('⚠️ Failed to load mock state:', e);
        }
    }

    private saveState() {
        if (typeof window !== 'undefined') return; // Skip on client
        try {
            const state = {
                properties: this.properties,
                leads: this.leads,
                users: this.users,
                favorites: this.favorites
            };
            fs.writeFileSync(this.persistenceFile, JSON.stringify(state, null, 2));
        } catch (e) {
            console.error('⚠️ Failed to save mock state:', e);
        }
    }

    // Properties --------------------------------
    getProperties() {
        return this.properties;
    }

    addProperty(property: any) {
        const newProp = {
            ...property,
            id: property.id || `mock-prop-${Date.now()}`,
            created_at: new Date().toISOString()
        };
        this.properties.unshift(newProp);
        this.saveState();
        return newProp;
    }

    // Explicit sync method for properties array modification outside
    sync() {
        this.saveState();
    }

    // Leads -------------------------------------
    addLead(lead: Partial<MockLead>) {
        const newLead: MockLead = {
            id: `lead-${Date.now()}`,
            name: lead.name || 'Anonymous',
            email: lead.email || 'unknown@example.com',
            message: lead.message || '',
            type: lead.type || 'contact',
            status: 'new',
            created_at: new Date().toISOString(),
            ...lead
        };
        this.leads.unshift(newLead);
        this.saveState();
        return newLead;
    }

    getLeads() {
        return this.leads;
    }

    // Auth --------------------------------------
    isAdmin(token: string) {
        // For simulation, we accept any token that looks valid or the specific admin mock token
        return token.includes('admin') || token.length > 20;
    }

    // Favorites ---------------------------------
    getFavorites(userId: string): string[] {
        return this.favorites[userId] || [];
    }

    addFavorite(userId: string, propertyId: string) {
        if (!this.favorites[userId]) {
            this.favorites[userId] = [];
        }
        if (!this.favorites[userId].includes(propertyId)) {
            this.favorites[userId].push(propertyId);
            this.saveState();
        }
        return this.favorites[userId];
    }

    removeFavorite(userId: string, propertyId: string) {
        if (this.favorites[userId]) {
            this.favorites[userId] = this.favorites[userId].filter(id => id !== propertyId);
            this.saveState();
        }
        return this.favorites[userId] || [];
    }
}

// Singleton instance
export const mockStore = new MockStore();
