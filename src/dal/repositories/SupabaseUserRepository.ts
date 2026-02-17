/**
 * Supabase User Repository Implementation
 * =======================================
 * Implements IUserRepository using Supabase/PostgreSQL
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IUserRepository, PaginatedResult } from '../interfaces';
import { User, UserRole, UserStatus } from '@/core/entities/User';
import * as bcrypt from 'bcryptjs';
import { mockStore } from '@/lib/mock-store';

// ============================================
// SUPABASE CLIENT (Lazy Initialization)
// ============================================

let supabaseInstance: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
    if (!supabaseInstance) {
        // SECURITY CHECK: Ensure this code only runs on the server
        if (typeof window !== 'undefined') {
            throw new Error('CRITICAL SECURITY ERROR: Attempting to access Supabase Service Role Key from client-side code! This operation is forbidden.');
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error(
                'Supabase configuration missing. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.'
            );
        }

        supabaseInstance = createClient(supabaseUrl, supabaseKey, {
            auth: { persistSession: false },
        });
    }
    return supabaseInstance;
}

// ============================================
// TYPE MAPPINGS
// ============================================

interface UserRow {
    id: string;
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    phone: string | null;
    avatar_url: string | null;
    role: UserRole;
    status: UserStatus;

    preferred_language: string;
    preferred_currency: string;
    email_notifications: boolean;
    sms_notifications: boolean;
    push_notifications?: boolean;
    newsletter?: boolean;
    theme?: string;

    email_verified: boolean;
    email_verified_at: string | null;
    phone_verified: boolean;

    two_factor_enabled: boolean;
    failed_login_attempts: number;
    locked_until: string | null;
    last_login_at: string | null;
    last_login_ip: string | null;

    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

// ============================================
// MAPPER
// ============================================

function mapRowToUser(row: UserRow): User {
    return {
        id: row.id,
        email: row.email,
        emailVerified: row.email_verified,

        role: row.role,
        status: row.status,

        profile: {
            firstName: row.first_name,
            lastName: row.last_name,
            phone: row.phone || undefined,
            avatar: row.avatar_url || undefined,
        },

        preferences: {
            language: row.preferred_language || 'en',
            currency: row.preferred_currency || 'EUR',
            emailNotifications: row.email_notifications ?? true,
            smsNotifications: row.sms_notifications ?? false,
            pushNotifications: row.push_notifications ?? true,
            newsletter: row.newsletter ?? false,
            theme: (row.theme as 'light' | 'dark' | 'system') || 'light',
        },

        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
        lastLoginAt: row.last_login_at ? new Date(row.last_login_at) : undefined,

        twoFactorEnabled: row.two_factor_enabled,
    };
}

// ============================================
// REPOSITORY IMPLEMENTATION
// ============================================

export class SupabaseUserRepository implements IUserRepository {

    // ----------------------------------------
    // Basic CRUD
    // ----------------------------------------

    async findById(id: string): Promise<User | null> {
        // MOCK FALLBACK
        if (id === 'mock-admin-id') {
            const mockUser = mockStore.users.find(u => u.id === id);
            return mockUser ? this.mapMockToUser(mockUser) : null;
        }

        try {
            const { data, error } = await getSupabase()
                .from('users')
                .select('*')
                .eq('id', id)
                .is('deleted_at', null)
                .single();

            if (error || !data) return null;
            return mapRowToUser(data);
        } catch (error) {
            console.warn('SupabaseUserRepository.findById failed, falling back to mock check', error);
            const mockUser = mockStore.users.find(u => u.id === id);
            return mockUser ? this.mapMockToUser(mockUser) : null;
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        // MOCK FALLBACK
        if (email.includes('admin@modon.com')) {
            const mockUser = mockStore.users.find(u => u.email === email);
            return mockUser ? this.mapMockToUser(mockUser) : null;
        }

        try {
            const { data, error } = await getSupabase()
                .from('users')
                .select('*')
                .eq('email', email.toLowerCase())
                .is('deleted_at', null)
                .single();

            if (error || !data) return null;
            return mapRowToUser(data);
        } catch (error) {
            console.warn('SupabaseUserRepository.findByEmail failed, falling back to mock check', error);
            const mockUser = mockStore.users.find(u => u.email === email);
            return mockUser ? this.mapMockToUser(mockUser) : null;
        }
    }

    private mapMockToUser(mock: any): User {
        return {
            id: mock.id,
            email: mock.email,
            emailVerified: true,
            role: mock.role,
            status: 'active',
            profile: { firstName: 'Mock', lastName: 'Admin' },
            preferences: {
                language: 'en',
                currency: 'USD',
                theme: 'dark',
                emailNotifications: true,
                smsNotifications: false,
                pushNotifications: true,
                newsletter: false
            },
            createdAt: new Date(mock.created_at),
            updatedAt: new Date(mock.created_at),
            lastLoginAt: new Date(),
            twoFactorEnabled: false
        };
    }

    async findAll(criteria?: {
        role?: UserRole;
        status?: UserStatus;
        page?: number;
        limit?: number;
    }): Promise<PaginatedResult<User>> {
        const page = criteria?.page || 1;
        const limit = Math.min(criteria?.limit || 20, 100);
        const offset = (page - 1) * limit;

        let query = getSupabase()
            .from('users')
            .select('*', { count: 'exact' })
            .is('deleted_at', null);

        if (criteria?.role) {
            query = query.eq('role', criteria.role);
        }

        if (criteria?.status) {
            query = query.eq('status', criteria.status);
        }

        query = query.order('created_at', { ascending: false });
        query = query.range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) {
            return {
                data: [],
                pagination: {
                    page,
                    limit,
                    total: 0,
                    totalPages: 0,
                    hasNext: false,
                    hasPrev: false,
                },
            };
        }

        const total = count || 0;
        const totalPages = Math.ceil(total / limit);

        return {
            data: (data || []).map(mapRowToUser),
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        };
    }

    async create(userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone?: string;
        role?: UserRole;
    }): Promise<User> {
        // Hash password
        const passwordHash = await bcrypt.hash(userData.password, 12);

        const row = {
            email: userData.email.toLowerCase(),
            password_hash: passwordHash,
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            role: userData.role || 'user',
            status: 'pending_verification',
            preferred_language: 'en',
            preferred_currency: 'EUR',
        };

        const { data, error } = await getSupabase()
            .from('users')
            .insert(row)
            .select()
            .single();

        if (error || !data) {
            throw new Error(`Failed to create user: ${error?.message}`);
        }

        return mapRowToUser(data);
    }

    async update(id: string, data: Partial<User>): Promise<User> {
        const updateRow: Record<string, unknown> = {};

        // Profile fields
        if (data.profile) {
            if (data.profile.firstName) updateRow.first_name = data.profile.firstName;
            if (data.profile.lastName) updateRow.last_name = data.profile.lastName;
            if (data.profile.phone !== undefined) updateRow.phone = data.profile.phone;
            if (data.profile.avatar !== undefined) updateRow.avatar_url = data.profile.avatar;
        }

        if (data.role) updateRow.role = data.role;
        if (data.status) updateRow.status = data.status;
        if (data.emailVerified !== undefined) updateRow.email_verified = data.emailVerified;

        if (data.preferences) {
            if (data.preferences.language) updateRow.preferred_language = data.preferences.language;
            if (data.preferences.currency) updateRow.preferred_currency = data.preferences.currency;
            if (data.preferences.emailNotifications !== undefined) {
                updateRow.email_notifications = data.preferences.emailNotifications;
            }
            if (data.preferences.smsNotifications !== undefined) {
                updateRow.sms_notifications = data.preferences.smsNotifications;
            }
        }

        const { data: updated, error } = await getSupabase()
            .from('users')
            .update(updateRow)
            .eq('id', id)
            .select()
            .single();

        if (error || !updated) {
            throw new Error(`Failed to update user: ${error?.message}`);
        }

        return mapRowToUser(updated);
    }

    async delete(id: string): Promise<void> {
        // Soft delete
        const { error } = await getSupabase()
            .from('users')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id);

        if (error) {
            throw new Error(`Failed to delete user: ${error.message}`);
        }
    }

    // ----------------------------------------
    // Authentication
    // ----------------------------------------

    async verifyPassword(email: string, password: string): Promise<User | null> {
        const { data, error } = await getSupabase()
            .from('users')
            .select('*')
            .eq('email', email.toLowerCase())
            .is('deleted_at', null)
            .single();

        if (error || !data) return null;

        // Check if account is locked
        if (data.locked_until && new Date(data.locked_until) > new Date()) {
            return null;
        }

        const isValid = await bcrypt.compare(password, data.password_hash);

        if (!isValid) {
            // Increment failed attempts
            await getSupabase()
                .from('users')
                .update({
                    failed_login_attempts: data.failed_login_attempts + 1,
                    locked_until: data.failed_login_attempts >= 4
                        ? new Date(Date.now() + 15 * 60 * 1000).toISOString() // Lock for 15 minutes
                        : null,
                })
                .eq('id', data.id);

            return null;
        }

        // Reset failed attempts and update last login
        await getSupabase()
            .from('users')
            .update({
                failed_login_attempts: 0,
                locked_until: null,
                last_login_at: new Date().toISOString(),
            })
            .eq('id', data.id);

        return mapRowToUser(data);
    }

    async updatePassword(id: string, newPassword: string): Promise<void> {
        const passwordHash = await bcrypt.hash(newPassword, 12);

        const { error } = await getSupabase()
            .from('users')
            .update({ password_hash: passwordHash })
            .eq('id', id);

        if (error) {
            throw new Error(`Failed to update password: ${error.message}`);
        }
    }

    async updateLastLogin(id: string, ip: string): Promise<void> {
        await getSupabase()
            .from('users')
            .update({
                last_login_at: new Date().toISOString(),
                last_login_ip: ip,
                failed_login_attempts: 0,
            })
            .eq('id', id);
    }

    async verifyEmail(id: string): Promise<User> {
        const { data, error } = await getSupabase()
            .from('users')
            .update({
                email_verified: true,
                email_verified_at: new Date().toISOString(),
                status: 'active',
            })
            .eq('id', id)
            .select()
            .single();

        if (error || !data) {
            throw new Error(`Failed to verify email: ${error?.message}`);
        }

        return mapRowToUser(data);
    }

    // ----------------------------------------
    // Session Management
    // ----------------------------------------

    async createSession(userId: string, refreshTokenHash: string, deviceInfo: {
        ip: string;
        userAgent: string;
    }): Promise<void> {
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        const { error } = await getSupabase()
            .from('user_sessions')
            .insert({
                user_id: userId,
                refresh_token_hash: refreshTokenHash,
                device_info: deviceInfo,
                ip_address: deviceInfo.ip,
                user_agent: deviceInfo.userAgent,
                expires_at: expiresAt.toISOString(),
            });

        if (error) {
            throw new Error(`Failed to create session: ${error.message}`);
        }
    }

    async findSession(refreshTokenHash: string): Promise<{
        userId: string;
        refreshTokenHash: string;
        isValid: boolean;
    } | null> {
        const { data, error } = await getSupabase()
            .from('user_sessions')
            .select('*')
            .eq('refresh_token_hash', refreshTokenHash)
            .is('revoked_at', null)
            .single();

        if (error || !data) return null;

        const isValid = new Date(data.expires_at) > new Date();

        return {
            userId: data.user_id,
            refreshTokenHash: data.refresh_token_hash,
            isValid,
        };
    }

    async revokeSession(sessionId: string): Promise<void> {
        await getSupabase()
            .from('user_sessions')
            .update({ revoked_at: new Date().toISOString() })
            .eq('id', sessionId);
    }

    async revokeAllSessions(userId: string): Promise<void> {
        await getSupabase()
            .from('user_sessions')
            .update({ revoked_at: new Date().toISOString() })
            .eq('user_id', userId)
            .is('revoked_at', null);
    }

    // ----------------------------------------
    // Password Reset
    // ----------------------------------------

    async createPasswordResetToken(userId: string, tokenHash: string): Promise<void> {
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await getSupabase()
            .from('password_reset_tokens')
            .insert({
                user_id: userId,
                token_hash: tokenHash,
                expires_at: expiresAt.toISOString(),
            });
    }

    async findPasswordResetToken(tokenHash: string): Promise<{
        userId: string;
        expiresAt: Date;
    } | null> {
        const { data, error } = await getSupabase()
            .from('password_reset_tokens')
            .select('*')
            .eq('token_hash', tokenHash)
            .is('used_at', null)
            .gt('expires_at', new Date().toISOString())
            .single();

        if (error || !data) return null;

        return {
            userId: data.user_id,
            expiresAt: new Date(data.expires_at),
        };
    }

    async usePasswordResetToken(tokenHash: string): Promise<void> {
        await getSupabase()
            .from('password_reset_tokens')
            .update({ used_at: new Date().toISOString() })
            .eq('token_hash', tokenHash);
    }

    // ----------------------------------------
    // Preferences
    // ----------------------------------------

    async updatePreferences(
        id: string,
        preferences: Partial<User['preferences']>
    ): Promise<User> {
        const updateRow: Record<string, unknown> = {};

        if (preferences.language) updateRow.preferred_language = preferences.language;
        if (preferences.currency) updateRow.preferred_currency = preferences.currency;
        if (preferences.emailNotifications !== undefined) {
            updateRow.email_notifications = preferences.emailNotifications;
        }
        if (preferences.smsNotifications !== undefined) {
            updateRow.sms_notifications = preferences.smsNotifications;
        }

        const { data, error } = await getSupabase()
            .from('users')
            .update(updateRow)
            .eq('id', id)
            .select()
            .single();

        if (error || !data) {
            throw new Error(`Failed to update preferences: ${error?.message}`);
        }

        return mapRowToUser(data);
    }

    // ----------------------------------------
    // Counts
    // ----------------------------------------

    async count(criteria?: {
        role?: UserRole;
        status?: UserStatus;
    }): Promise<number> {
        let query = getSupabase()
            .from('users')
            .select('id', { count: 'exact', head: true })
            .is('deleted_at', null);

        if (criteria?.role) {
            query = query.eq('role', criteria.role);
        }

        if (criteria?.status) {
            query = query.eq('status', criteria.status);
        }

        const { count } = await query;
        return count || 0;
    }

    async exists(email: string): Promise<boolean> {
        const { count } = await getSupabase()
            .from('users')
            .select('id', { count: 'exact', head: true })
            .eq('email', email.toLowerCase())
            .is('deleted_at', null);

        return (count || 0) > 0;
    }
}

// Export singleton
export const userRepository = new SupabaseUserRepository();

