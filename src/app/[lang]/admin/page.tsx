/**
 * Admin Dashboard Page
 * ====================
 * Protected admin panel for managing properties and viewing leads
 * Only accessible by authenticated users
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
    Home,
    MessageSquare,
    Plus,
    TrendingUp,
    Users,
    Eye,
    Loader2,
    AlertCircle,
    Mail,
    Phone,
    Calendar
} from 'lucide-react';
import styles from './admin.module.css';

//============================================
// TYPES
// ============================================

interface DashboardStats {
    totalProperties: number;
    totalLeads: number;
    newLeadsToday: number;
    activeProperties: number;
}

interface Lead {
    id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    type: string;
    property_id?: string;
    property_title?: string;
    created_at: string;
    status: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats>({
        totalProperties: 0,
        totalLeads: 0,
        newLeadsToday: 0,
        activeProperties: 0,
    });
    const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // SECURITY: Authentication is enforced by server-side middleware (src/middleware.ts)
    // which verifies the HttpOnly modon_auth_token cookie before allowing access to /admin routes.
    // No client-side token check needed — localStorage is NOT used for auth tokens.

    const params = useParams();
    const lang = (params?.lang as string) || 'en';

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);

                // Fetch properties count
                const propertiesRes = await fetch('/api/properties?limit=1');

                if (propertiesRes.status === 401) {
                    router.push(`/${lang}/login`);
                    return;
                }

                const propertiesData = await propertiesRes.json();

                // SECURITY: Credentials include HttpOnly cookies automatically.
                // No Authorization header needed — the modon_auth_token cookie is sent by the browser.
                const leadsRes = await fetch('/api/leads', {
                    credentials: 'same-origin',
                });

                if (leadsRes.status === 401) {
                    // Session expired or invalid — redirect to login
                    router.push(`/${lang}/login`);
                    return;
                }

                const leadsData = await leadsRes.json();

                if (propertiesData.success && leadsData.success) {
                    const leads = leadsData.data || [];
                    const today = new Date().toDateString();
                    const newToday = leads.filter((lead: Lead) =>
                        new Date(lead.created_at).toDateString() === today
                    ).length;

                    setStats({
                        totalProperties: propertiesData.pagination?.total || 0,
                        totalLeads: leads.length,
                        newLeadsToday: newToday,
                        activeProperties: propertiesData.pagination?.total || 0,
                    });

                    // Get 5 most recent leads
                    setRecentLeads(leads.slice(0, 5));
                }
            } catch (_err) {
                setError('Failed to load dashboard data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [router, lang]);

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <Loader2 className={styles.spinner} size={40} />
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div>
                    <h1>{lang === 'ar' ? 'لوحة التحكم' : 'Admin Dashboard'}</h1>
                    <p className={styles.subtitle}>
                        {lang === 'ar' ? 'إدارة منصة العقارات الفاخرة الخاصة بك' : 'Manage your luxury real estate platform'}
                    </p>
                </div>
                <Link href={`/${lang}`} className={styles.backButton}>
                    <Eye size={18} />
                    {lang === 'ar' ? 'عرض الموقع' : 'View Site'}
                </Link>
            </header>

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statIconHome}`}>
                        <Home size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>{lang === 'ar' ? 'إجمالي العقارات' : 'Total Properties'}</p>
                        <h2 className={styles.statValue}>{stats.totalProperties}</h2>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statIconLeads}`}>
                        <MessageSquare size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>{lang === 'ar' ? 'إجمالي العملاء المهتمين' : 'Total Leads'}</p>
                        <h2 className={styles.statValue}>{stats.totalLeads}</h2>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statIconTrend}`}>
                        <TrendingUp size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>{lang === 'ar' ? 'عملاء جدد اليوم' : 'New Leads Today'}</p>
                        <h2 className={styles.statValue}>{stats.newLeadsToday}</h2>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statIconUsers}`}>
                        <Users size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>{lang === 'ar' ? 'العقارات النشطة' : 'Active Properties'}</p>
                        <h2 className={styles.statValue}>{stats.activeProperties}</h2>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.quickActions}>
                <h2>{lang === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}</h2>
                <div className={styles.actionsGrid}>
                    <Link href={`/${lang}/admin/properties/new`} className={styles.actionCard}>
                        <Plus size={24} />
                        <span>{lang === 'ar' ? 'إضافة عقار جديد' : 'Add New Property'}</span>
                    </Link>
                    <Link href={`/${lang}/admin/leads`} className={styles.actionCard}>
                        <MessageSquare size={24} />
                        <span>{lang === 'ar' ? 'عرض جميع العملاء' : 'View All Leads'}</span>
                    </Link>
                    <Link href={`/${lang}/admin/properties`} className={styles.actionCard}>
                        <Home size={24} />
                        <span>{lang === 'ar' ? 'إدارة العقارات' : 'Manage Properties'}</span>
                    </Link>
                </div>
            </div>

            {/* Recent Leads Table */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>{lang === 'ar' ? 'أحدث الطلبات' : 'Recent Leads'}</h2>
                    <Link href={`/${lang}/admin/leads`} className={styles.viewAllLink}>
                        {lang === 'ar' ? 'عرض الكل ←' : 'View All →'}
                    </Link>
                </div>

                {error ? (
                    <div className={styles.errorState}>
                        <AlertCircle size={32} />
                        <p>{error}</p>
                    </div>
                ) : recentLeads.length === 0 ? (
                    <div className={styles.emptyState}>
                        <MessageSquare size={48} />
                        <h3>{lang === 'ar' ? 'لا توجد طلبات بعد' : 'No leads yet'}</h3>
                        <p>{lang === 'ar' ? 'ستظهر هنا الطلبات من نماذج الاتصال' : 'Leads from contact forms will appear here'}</p>
                    </div>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>{lang === 'ar' ? 'الاسم' : 'Name'}</th>
                                    <th>{lang === 'ar' ? 'بيانات الاتصال' : 'Contact'}</th>
                                    <th>{lang === 'ar' ? 'العقار' : 'Property'}</th>
                                    <th>{lang === 'ar' ? 'الرسالة' : 'Message'}</th>
                                    <th>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                                    <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentLeads.map((lead) => (
                                    <tr key={lead.id}>
                                        <td className={styles.nameCell}>
                                            <div className={styles.nameAvatar}>
                                                {lead.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span>{lead.name}</span>
                                        </td>
                                        <td className={styles.contactCell}>
                                            <div>
                                                <div className={styles.contactRow}>
                                                    <Mail size={14} />
                                                    <span>{lead.email}</span>
                                                </div>
                                                {lead.phone && (
                                                    <div className={styles.contactRow}>
                                                        <Phone size={14} />
                                                        <span>{lead.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className={styles.propertyCell}>
                                            {lead.property_title || (lang === 'ar' ? 'استفسار عام' : 'General Inquiry')}
                                        </td>
                                        <td className={styles.messageCell}>
                                            <div className={styles.messageTruncate}>
                                                {lead.message}
                                            </div>
                                        </td>
                                        <td className={styles.dateCell}>
                                            <div className={styles.dateWrapper}>
                                                <Calendar size={14} />
                                                <span>
                                                    {(() => {
                                                        const d = new Date(lead.created_at);
                                                        return isNaN(d.getTime())
                                                            ? '—'
                                                            : d.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
                                                    })()}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${styles[lead.status]}`}>
                                                {lead.status === 'new' && (lang === 'ar' ? 'جديد' : 'New')}
                                                {lead.status === 'contacted' && (lang === 'ar' ? 'تم الاتصال' : 'Contacted')}
                                                {lead.status === 'closed' && (lang === 'ar' ? 'مغلق' : 'Closed')}
                                                {lead.status !== 'new' && lead.status !== 'contacted' && lead.status !== 'closed' && lead.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
