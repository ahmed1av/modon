
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    Eye,
    MoreVertical,
    CheckCircle,
    Clock,
    AlertCircle,
    Loader2
} from 'lucide-react';
import styles from '../admin.module.css'; // Reuse some styles

export default function PropertiesAdminPage() {
    const params = useParams();
    const router = useRouter();
    const lang = (params?.lang as string) || 'en';

    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const t = {
        title: lang === 'ar' ? 'نموذج العقارات' : 'Properties Management',
        addNew: lang === 'ar' ? 'إضافة عقار جديد' : 'Add New Property',
        searchPlaceholder: lang === 'ar' ? 'بحث عن عقار...' : 'Search properties...',
        all: lang === 'ar' ? 'الكل' : 'All',
        published: lang === 'ar' ? 'منشور' : 'Published',
        draft: lang === 'ar' ? 'مسودة' : 'Draft',
        sold: lang === 'ar' ? 'مباع' : 'Sold',
        actions: lang === 'ar' ? 'إجراءات' : 'Actions',
        property: lang === 'ar' ? 'العقار' : 'Property',
        type: lang === 'ar' ? 'النوع' : 'Type',
        price: lang === 'ar' ? 'السعر' : 'Price',
        status: lang === 'ar' ? 'الحالة' : 'Status',
        noProperties: lang === 'ar' ? 'لم يتم العثور على عقارات' : 'No properties found',
    };

    const fetchProperties = useCallback(async () => {
        setLoading(true);
        try {
            const url = `/api/properties?limit=50${statusFilter !== 'all' ? `&status=${statusFilter}` : ''}`;
            const res = await fetch(url);

            if (res.status === 401) {
                router.push(`/${lang}/login`);
                return;
            }

            const result = await res.json();
            if (result.success) {
                setProperties(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch properties:', error);
        } finally {
            setLoading(false);
        }
    }, [statusFilter, lang, router]);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(lang === 'ar' ? `هل أنت متأكد من حذف "${title}"؟` : `Are you sure you want to delete "${title}"?`)) {
            return;
        }

        try {
            const res = await fetch(`/api/properties/${id}`, {
                method: 'DELETE'
            });

            if (res.status === 401) {
                router.push(`/${lang}/login`);
                return;
            }

            const result = await res.json();
            if (result.success) {
                setProperties(prev => prev.filter(p => p.id !== id));
            } else {
                alert(result.error || 'Failed to delete property');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('An error occurred');
        }
    };

    const filteredProperties = properties.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.reference_code?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>{t.title}</h1>
                    <p className={styles.subtitle}>
                        {lang === 'ar' ? 'إدارة وتعديل قائمة العقارات الخاصة بك' : 'Manage and edit your property listings'}
                    </p>
                </div>
                <Link href={`/${lang}/admin/properties/new`} className={styles.buttonPrimary}>
                    <Plus size={20} />
                    <span>{t.addNew}</span>
                </Link>
            </div>

            {/* Filters Bar */}
            <div className={styles.filtersWrapper}>
                <div className={styles.searchContainer}>
                    <Search
                        className={`${styles.searchIcon} ${lang === 'ar' ? styles.searchIconRight : styles.searchIconLeft}`}
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder={t.searchPlaceholder}
                        title={t.searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`${styles.searchInput} ${lang === 'ar' ? styles.searchInputAr : styles.searchInputEn}`}
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={styles.filterSelect}
                    title={lang === 'ar' ? 'تصفية حسب الحالة' : 'Filter by Status'}
                >
                    <option value="all">{t.all}</option>
                    <option value="active">{t.published}</option>
                    <option value="draft">{t.draft}</option>
                    <option value="sold">{t.sold}</option>
                </select>
            </div>

            {/* Properties Table */}
            <div className={styles.section}>
                {loading ? (
                    <div className={styles.loading}>
                        <Loader2 className={styles.spinner} size={40} />
                        <p>{lang === 'ar' ? 'جاري التحميل...' : 'Loading properties...'}</p>
                    </div>
                ) : filteredProperties.length === 0 ? (
                    <div className={styles.emptyState}>
                        <AlertCircle size={48} />
                        <h3>{t.noProperties}</h3>
                    </div>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>{t.property}</th>
                                    <th>{t.type}</th>
                                    <th>{t.price}</th>
                                    <th>{t.status}</th>
                                    <th>{t.actions}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProperties.map((property) => (
                                    <tr key={property.id}>
                                        <td>
                                            <div className={styles.propertyInfo}>
                                                <div className={styles.propertyThumb}>
                                                    {property.image_url && (
                                                        <Image
                                                            src={property.image_url}
                                                            alt={property.title}
                                                            fill
                                                            sizes="48px"
                                                            style={{ objectFit: 'cover' }}
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className={styles.propertyTitle}>{lang === 'ar' && property.title_ar ? property.title_ar : property.title}</div>
                                                    <div className={styles.propertyRef}>{property.reference_code}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{property.type}</td>
                                        <td>{property.price?.formatted || property.price?.amount}</td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${property.status === 'active' || property.status === 'published' ? styles.new : styles.contacted}`}>
                                                {property.status === 'active' || property.status === 'published' ? (
                                                    <><CheckCircle size={14} /> {t.published}</>
                                                ) : (
                                                    <><Clock size={14} /> {t.draft}</>
                                                )}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.flexGap05}>
                                                <button onClick={() => router.push(`/${lang}/admin/properties/edit/${property.id}`)} className={styles.viewAllLink} title="Edit">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(property.id, lang === 'ar' && property.title_ar ? property.title_ar : property.title)}
                                                    className={`${styles.viewAllLink} ${styles.btnDelete}`}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <Link href={`/${lang}/buy/${property.slug}`} target="_blank" className={styles.viewAllLink} title="View Online">
                                                    <Eye size={18} />
                                                </Link>
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
