
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Mail,
    Phone,
    Calendar,
    User,
    CheckCircle,
    XCircle,
    Clock,
    MoreVertical,
    Eye,
    Check,
    MessageSquare,
    Loader2,
    AlertCircle
} from 'lucide-react';
import styles from '../admin.module.css';

export default function LeadsAdminPage() {
    const params = useParams();
    const router = useRouter();
    const lang = (params?.lang as string) || 'en';

    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchLeads = useCallback(async () => {
        setLoading(true);
        try {
            const url = `/api/leads?limit=50${statusFilter !== 'all' ? `&status=${statusFilter}` : ''}`;
            const res = await fetch(url);

            if (res.status === 401) {
                router.push(`/${lang}/login`);
                return;
            }

            const result = await res.json();
            if (result.success) {
                setLeads(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch leads:', error);
        } finally {
            setLoading(false);
        }
    }, [statusFilter, lang, router]);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    async function updateLeadStatus(id: string, newStatus: string) {
        try {
            const res = await fetch('/api/leads', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });

            if (res.status === 401) {
                router.push(`/${lang}/login`);
                return;
            }

            const result = await res.json();
            if (result.success) {
                setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
            }
        } catch (error) {
            console.error('Update status failed:', error);
        }
    }

    const t = {
        title: lang === 'ar' ? 'إدارة الطلبات' : 'Leads Management',
        all: lang === 'ar' ? 'الكل' : 'All',
        new: lang === 'ar' ? 'جديد' : 'New',
        contacted: lang === 'ar' ? 'تم الاتصال' : 'Contacted',
        closed: lang === 'ar' ? 'مغلق' : 'Closed',
        name: lang === 'ar' ? 'الاسم' : 'Name',
        contact: lang === 'ar' ? 'الاتصال' : 'Contact',
        property: lang === 'ar' ? 'العقار' : 'Property',
        date: lang === 'ar' ? 'التاريخ' : 'Date',
        status: lang === 'ar' ? 'الحالة' : 'Status',
        actions: lang === 'ar' ? 'إجراءات' : 'Actions',
        noLeads: lang === 'ar' ? 'لا توجد طلبات' : 'No leads found'
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>{t.title}</h1>
                    <p className={styles.subtitle}>
                        {lang === 'ar' ? 'تتبع طلبات العملاء والرد عليها' : 'Track and respond to client inquiries'}
                    </p>
                </div>
                <div className={styles.flexGap1}>
                    {['all', 'new', 'contacted', 'closed'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`${styles.btnFilter} ${statusFilter === status ? styles.btnFilterActive : ''}`}
                        >
                            {status === 'all' ? t.all : status === 'new' ? t.new : status === 'contacted' ? t.contacted : t.closed}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                {loading ? (
                    <div className={styles.loading}>
                        <Loader2 className={styles.spinner} size={40} />
                        <p>{lang === 'ar' ? 'جاري التحميل...' : 'Loading leads...'}</p>
                    </div>
                ) : leads.length === 0 ? (
                    <div className={styles.emptyState}>
                        <AlertCircle size={48} />
                        <h3>{t.noLeads}</h3>
                    </div>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>{t.name}</th>
                                    <th>{t.contact}</th>
                                    <th>{t.property}</th>
                                    <th>{t.date}</th>
                                    <th>{t.status}</th>
                                    <th>{t.actions}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leads.map((lead) => (
                                    <tr key={lead.id}>
                                        <td>
                                            <div className={styles.nameCell}>
                                                <div className={styles.nameAvatar}>
                                                    {lead.name ? lead.name[0].toUpperCase() : (lead.firstName ? lead.firstName[0].toUpperCase() : 'L')}
                                                </div>
                                                <div>
                                                    <div className={styles.leadName}>{lead.name || `${lead.firstName} ${lead.lastName}`}</div>
                                                    <div className={styles.leadType}>{lead.type}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.contactCell}>
                                                <div className={styles.contactRow}><Mail size={14} /> {lead.email}</div>
                                                {lead.phone && <div className={styles.contactRow}><Phone size={14} /> {lead.phone}</div>}
                                            </div>
                                        </td>
                                        <td>
                                            {lead.property ? (
                                                <div className={styles.propertyCell}>
                                                    <div className={styles.propertyTitleLink}>{lead.property.title}</div>
                                                </div>
                                            ) : (
                                                <div className={styles.generalInquiry}>General Inquiry</div>
                                            )}
                                        </td>
                                        <td>
                                            <div className={styles.dateWrapper}>
                                                <Calendar size={14} />
                                                {new Date(lead.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${lead.status === 'new' ? styles.new : lead.status === 'contacted' ? styles.contacted : styles.closed}`}>
                                                {lead.status === 'new' ? t.new : lead.status === 'contacted' ? t.contacted : t.closed}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.flexGap1}>
                                                {lead.status === 'new' && (
                                                    <button
                                                        onClick={() => updateLeadStatus(lead.id, 'contacted')}
                                                        className={styles.viewAllLink}
                                                        title={lang === 'ar' ? 'تحديد كمتواصل معه' : 'Mark as Contacted'}
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                )}
                                                {lead.status !== 'closed' && (
                                                    <button
                                                        onClick={() => updateLeadStatus(lead.id, 'closed')}
                                                        className={`${styles.viewAllLink} ${styles.buttonDangerText}`}
                                                        title={lang === 'ar' ? 'إغلاق الطلب' : 'Close Lead'}
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                )}
                                                <button className={styles.viewAllLink} title={lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}>
                                                    <Eye size={18} />
                                                </button>
                                            </div>
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
