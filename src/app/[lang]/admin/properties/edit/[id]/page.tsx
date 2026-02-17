
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    Save,
    ArrowLeft,
    Upload,
    X,
    Check,
    Info,
    MapPin,
    Image as ImageIcon,
    List,
    Loader2,
    AlertCircle,
    Trash2
} from 'lucide-react';
import styles from '../../../admin.module.css';

export default function EditPropertyPage() {
    const params = useParams();
    const router = useRouter();
    const lang = (params?.lang as string) || 'en';
    const id = params?.id as string;

    const [activeTab, setActiveTab] = useState('basic');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        titleAr: '',
        description: '',
        descriptionAr: '',
        type: 'Apartment',
        listingType: 'sale',
        price: 0,
        currency: 'EGP',
        city: '',
        address: '',
        bedrooms: 0,
        bathrooms: 0,
        area: 0,
        status: 'draft',
        features: [] as string[],
        images: [] as string[]
    });

    const fetchProperty = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/properties/${id}`);

            if (res.status === 401) {
                router.push(`/${lang}/login`);
                return;
            }

            const result = await res.json();
            if (result.success) {
                const p = result.data;
                setFormData({
                    title: p.title,
                    titleAr: p.titleAr || '',
                    description: p.description,
                    descriptionAr: p.descriptionAr || '',
                    type: p.type || 'Apartment',
                    listingType: p.listingType || 'sale',
                    price: p.price?.amount || 0,
                    currency: p.price?.currency || 'EGP',
                    city: p.location?.city || '',
                    address: p.location?.address || '',
                    bedrooms: p.specs?.bedrooms || 0,
                    bathrooms: p.specs?.bathrooms || 0,
                    area: p.specs?.livingAreaSqm || 0,
                    status: p.status || 'draft',
                    features: p.features?.map((f: any) => f.name) || [],
                    images: p.images?.map((img: any) => img.url) || []
                });
            } else {
                setError(result.error || 'Failed to fetch property');
            }
        } catch (err) {
            setError('An error occurred while fetching property');
        } finally {
            setLoading(false);
        }
    }, [id, lang, router]);

    useEffect(() => {
        if (id) {
            fetchProperty();
        }
    }, [id, fetchProperty]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: ['price', 'bedrooms', 'bathrooms', 'area'].includes(name) ? Number(value) : value }));
    };

    const handleFeatureToggle = (feature: string) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.includes(feature)
                ? prev.features.filter(f => f !== feature)
                : [...prev.features, feature]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const res = await fetch(`/api/properties/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.status === 401) {
                router.push(`/${lang}/login`);
                return;
            }

            const result = await res.json();
            if (result.success) {
                router.push(`/${lang}/admin/properties`);
            } else {
                setError(result.error || 'Failed to update property');
            }
        } catch (err) {
            setError('An error occurred while saving');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Loader2 className={styles.spinner} size={48} />
                <p>{lang === 'ar' ? 'جاري تحميل العقار...' : 'Loading property details...'}</p>
            </div>
        );
    }

    if (error && !formData.title) {
        return (
            <div className={styles.container}>
                <div className={styles.errorCard}>
                    <AlertCircle size={48} color="#ef4444" />
                    <h2>{lang === 'ar' ? 'خطأ' : 'Error'}</h2>
                    <p>{error}</p>
                    <button onClick={() => router.back()} className={styles.backButton}>
                        <ArrowLeft size={18} /> {lang === 'ar' ? 'رجوع' : 'Go Back'}
                    </button>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'basic', label: lang === 'ar' ? 'المعلومات الأساسية' : 'Basic Info', icon: <Info size={18} /> },
        { id: 'location', label: lang === 'ar' ? 'الموقع والتفاصيل' : 'Location & Details', icon: <MapPin size={18} /> },
        { id: 'media', label: lang === 'ar' ? 'الوسائط' : 'Media', icon: <ImageIcon size={18} /> },
        { id: 'features', label: lang === 'ar' ? 'المميزات والحالة' : 'Features & Status', icon: <List size={18} /> },
    ];

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit}>
                <div className={styles.header}>
                    <div>
                        <button type="button" onClick={() => router.back()} className={`${styles.viewAllLink} ${styles.flexGap1} ${styles.mb05} ${styles.noPadding}`}>
                            <ArrowLeft size={16} />
                            {lang === 'ar' ? 'العودة للعقارات' : 'Back to Properties'}
                        </button>
                        <h1>{lang === 'ar' ? 'تعديل العقار' : 'Edit Property'}</h1>
                    </div>
                    <div className={styles.flexGap1}>
                        <button
                            type="button"
                            className={styles.backButton}
                            onClick={() => router.back()}
                        >
                            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className={styles.buttonPrimary}
                        >
                            {saving ? <Loader2 className={styles.spinner} size={18} /> : <Save size={18} />}
                            {lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                {error && <div className={styles.errorBanner}>{error}</div>}

                <div className={styles.tabsContainer}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            className={`${styles.tabButton} ${activeTab === tab.id ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className={styles.formContent}>
                    {activeTab === 'basic' && (
                        <div className={styles.grid}>
                            <div className={styles.formGroup}>
                                <label htmlFor="title">{lang === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}</label>
                                <input id="title" type="text" name="title" value={formData.title} onChange={handleChange} required placeholder={lang === 'ar' ? 'العنوان بالإنجليزية' : 'Title in English'} title={lang === 'ar' ? 'العنوان بالإنجليزية' : 'Title in English'} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="titleAr">{lang === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}</label>
                                <input id="titleAr" type="text" name="titleAr" value={formData.titleAr} onChange={handleChange} dir="rtl" placeholder={lang === 'ar' ? 'العنوان بالعربية' : 'Title in Arabic'} title={lang === 'ar' ? 'العنوان بالعربية' : 'Title in Arabic'} />
                            </div>
                            <div className={`${styles.formGroup} ${styles.span2}`}>
                                <label htmlFor="description">{lang === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}</label>
                                <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={5} required placeholder={lang === 'ar' ? 'الوصف بالإنجليزية' : 'Description in English'} title={lang === 'ar' ? 'الوصف بالإنجليزية' : 'Description in English'} />
                            </div>
                            <div className={`${styles.formGroup} ${styles.span2}`}>
                                <label htmlFor="descriptionAr">{lang === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}</label>
                                <textarea id="descriptionAr" name="descriptionAr" value={formData.descriptionAr} onChange={handleChange} rows={5} dir="rtl" placeholder={lang === 'ar' ? 'الوصف بالعربية' : 'Description in Arabic'} title={lang === 'ar' ? 'الوصف بالعربية' : 'Description in Arabic'} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'location' && (
                        <div className={styles.grid}>
                            <div className={styles.formGroup}>
                                <label htmlFor="type">{lang === 'ar' ? 'نوع العقار' : 'Property Type'}</label>
                                <select id="type" name="type" value={formData.type} onChange={handleChange} title={lang === 'ar' ? 'نوع العقار' : 'Property Type'}>
                                    <option value="Villa">Villa</option>
                                    <option value="Apartment">Apartment</option>
                                    <option value="Penthouse">Penthouse</option>
                                    <option value="Townhouse">Townhouse</option>
                                    <option value="Duplex">Duplex</option>
                                    <option value="Chalet">Chalet</option>
                                    <option value="Studio">Studio</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="listingType">{lang === 'ar' ? 'نوع القائمة' : 'Listing Type'}</label>
                                <select id="listingType" name="listingType" value={formData.listingType} onChange={handleChange} title={lang === 'ar' ? 'نوع القائمة' : 'Listing Type'}>
                                    <option value="sale">{lang === 'ar' ? 'للبيع' : 'For Sale'}</option>
                                    <option value="rent">{lang === 'ar' ? 'للإيجار' : 'For Rent'}</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="city">{lang === 'ar' ? 'المدينة' : 'City'}</label>
                                <input id="city" type="text" name="city" value={formData.city} onChange={handleChange} required placeholder={lang === 'ar' ? 'المدينة' : 'City'} title={lang === 'ar' ? 'المدينة' : 'City'} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="address">{lang === 'ar' ? 'العنوان بالتفصيل' : 'Full Address'}</label>
                                <input id="address" type="text" name="address" value={formData.address} onChange={handleChange} required placeholder={lang === 'ar' ? 'العنوان بالتفصيل' : 'Full Address'} title={lang === 'ar' ? 'العنوان بالتفصيل' : 'Full Address'} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="price">{lang === 'ar' ? 'السعر' : 'Price'}</label>
                                <input id="price" type="number" name="price" value={formData.price} onChange={handleChange} required placeholder={lang === 'ar' ? 'السعر' : 'Price'} title={lang === 'ar' ? 'السعر' : 'Price'} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="currency">{lang === 'ar' ? 'العملة' : 'Currency'}</label>
                                <select id="currency" name="currency" value={formData.currency} onChange={handleChange} title={lang === 'ar' ? 'العملة' : 'Currency'}>
                                    <option value="EGP">EGP</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="bedrooms">{lang === 'ar' ? 'عدد الغرف' : 'Bedrooms'}</label>
                                <input id="bedrooms" type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} placeholder={lang === 'ar' ? 'عدد الغرف' : 'Bedrooms'} title={lang === 'ar' ? 'عدد الغرف' : 'Bedrooms'} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="bathrooms">{lang === 'ar' ? 'عدد الحمامات' : 'Bathrooms'}</label>
                                <input id="bathrooms" type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} placeholder={lang === 'ar' ? 'عدد الحمامات' : 'Bathrooms'} title={lang === 'ar' ? 'عدد الحمامات' : 'Bathrooms'} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="area">{lang === 'ar' ? 'المساحة (م٢)' : 'Area (sqm)'}</label>
                                <input id="area" type="number" name="area" value={formData.area} onChange={handleChange} placeholder={lang === 'ar' ? 'المساحة' : 'Area'} title={lang === 'ar' ? 'المساحة' : 'Area'} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'media' && (
                        <div className={styles.mediaContainer}>
                            <div className={styles.dropzone} onClick={() => {
                                const url = prompt(lang === 'ar' ? 'أدخل رابط الصورة:' : 'Enter image URL:');
                                if (url) setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
                            }}>
                                <Upload size={48} color="#d4af37" />
                                <p>{lang === 'ar' ? 'إضافة صور للعقار' : 'Add Property Images'}</p>
                                <span>{lang === 'ar' ? 'انقر لإضافة رابط صورة جديد' : 'Click to add a new image URL'}</span>
                            </div>

                            <div className={styles.imagePreviewGrid}>
                                {formData.images.map((url, idx) => (
                                    <div key={idx} className={styles.previewCard}>
                                        <Image
                                            src={url}
                                            alt={`Preview ${idx}`}
                                            fill
                                            sizes="150px"
                                            style={{ objectFit: 'cover' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                                            className={styles.deleteImageBtn}
                                            title={lang === 'ar' ? 'حذف الصورة' : 'Delete Image'}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'features' && (
                        <div>
                            <div className={styles.featuresGrid}>
                                {['Swimming Pool', 'Private Garden', 'Security 24/7', 'Gym', 'Parking', 'Seaview', 'Smart Home', 'Balcony', 'Maid Service'].map(feature => (
                                    <button
                                        key={feature}
                                        type="button"
                                        className={`${styles.featureItem} ${formData.features.includes(feature) ? styles.selectedFeature : ''}`}
                                        onClick={() => handleFeatureToggle(feature)}
                                        title={feature}
                                    >
                                        <Check
                                            size={16}
                                            className={`${styles.featureCheck} ${formData.features.includes(feature) ? styles.featureCheckActive : ''}`}
                                        />
                                        {feature}
                                    </button>
                                ))}
                            </div>

                            <div className={`${styles.formGroup} ${styles.mt3} ${styles.mw400}`}>
                                <label>{lang === 'ar' ? 'حالة العقار' : 'Property Status'}</label>
                                <div className={styles.statusGrid}>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, status: 'draft' }))}
                                        className={`${styles.featureItem} ${styles.justifyCenter} ${formData.status === 'draft' ? styles.selectedFeature : ''}`}
                                        title={lang === 'ar' ? 'مسودة' : 'Draft'}
                                    >
                                        {lang === 'ar' ? 'مسودة' : 'Draft'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, status: 'active' }))}
                                        className={`${styles.featureItem} ${styles.justifyCenter} ${formData.status === 'active' ? styles.activeStatus : ''}`}
                                        title={lang === 'ar' ? 'نشر' : 'Active/Publish'}
                                    >
                                        {lang === 'ar' ? 'نشر' : 'Active/Publish'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}
