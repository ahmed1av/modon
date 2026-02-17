
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    Save,
    X,
    ArrowLeft,
    Image as ImageIcon,
    MapPin,
    Info,
    CheckSquare,
    Globe,
    Loader2,
    Plus,
    Trash2,
    Upload
} from 'lucide-react';
import styles from '../../admin.module.css';

export default function NewPropertyPage() {
    const params = useParams();
    const router = useRouter();
    const lang = (params?.lang as string) || 'en';

    const [activeTab, setActiveTab] = useState('basic');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        titleAr: '',
        slug: '',
        referenceCode: `MODON-${Math.floor(Math.random() * 10000)}`,
        type: 'Villa',
        listingType: 'sale',
        price: 0,
        currency: 'EGP',
        description: '',
        descriptionAr: '',
        bedrooms: 3,
        bathrooms: 3,
        area: 250,
        plotArea: 400,
        city: 'New Cairo',
        country: 'Egypt',
        location: '',
        status: 'draft',
        imageUrl: '',
        images: [] as { url: string; alt: string }[],
        features: [] as string[]
    });

    const categories = {
        basic: lang === 'ar' ? 'البيانات الأساسية' : 'Basic Info',
        location: lang === 'ar' ? 'الموقع والتفاصيل' : 'Location & Details',
        media: lang === 'ar' ? 'الوسائط' : 'Media',
        features: lang === 'ar' ? 'الميزات والحالة' : 'Features & Status'
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: ['price', 'bedrooms', 'bathrooms', 'area', 'plotArea'].includes(name) ? Number(value) : value };

            // Auto-generate slug from English title
            if (name === 'title') {
                updated.slug = value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
            }

            return updated;
        });
    };

    const handleFeatureToggle = (feature: string) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.includes(feature)
                ? prev.features.filter(f => f !== feature)
                : [...prev.features, feature]
        }));
    };

    const [newImageUrl, setNewImageUrl] = useState('');

    const handleAddImage = () => {
        if (newImageUrl) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, { url: newImageUrl, alt: prev.title }],
                imageUrl: prev.imageUrl || newImageUrl
            }));
            setNewImageUrl('');
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation
        if (!formData.title || formData.title.length < 3) {
            alert(lang === 'ar' ? 'يرجى إدخال عنوان العقار بالإنجليزية (3 أحرف على الأقل)' : 'Please enter a property title (at least 3 characters)');
            setActiveTab('basic');
            return;
        }
        if (!formData.description || formData.description.length < 10) {
            alert(lang === 'ar' ? 'يرجى إدخال وصف العقار (10 أحرف على الأقل)' : 'Please enter a description (at least 10 characters)');
            setActiveTab('basic');
            return;
        }
        if (!formData.location || formData.location.length < 2) {
            alert(lang === 'ar' ? 'يرجى إدخال عنوان/موقع العقار' : 'Please enter the property location/address');
            setActiveTab('location');
            return;
        }
        if (!formData.city || formData.city.length < 2) {
            alert(lang === 'ar' ? 'يرجى إدخال المدينة' : 'Please enter the city');
            setActiveTab('location');
            return;
        }

        setLoading(true);
        try {
            // Clean up data before sending
            const payload: Record<string, unknown> = {
                ...formData,
                // Remove empty imageUrl so it doesn't fail URL validation
                imageUrl: formData.imageUrl || undefined,
                // Filter out images with empty URLs (e.g. from base64 upload issues)
                images: formData.images.length > 0 ? formData.images.filter(img => img.url) : undefined,
            };

            // Remove empty optional strings
            if (!payload.imageUrl) delete payload.imageUrl;
            if (!payload.titleAr) delete payload.titleAr;
            if (!payload.descriptionAr) delete payload.descriptionAr;

            const res = await fetch('/api/properties', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.status === 401) {
                router.push(`/${lang}/login`);
                return;
            }

            const result = await res.json();
            if (result.success) {
                alert(lang === 'ar' ? 'تم إضافة العقار بنجاح! ✅' : 'Property created successfully! ✅');
                router.push(`/${lang}/admin/properties`);
            } else {
                // Show detailed validation errors
                let errorMsg = result.error || 'Failed to create property';
                if (result.details && Array.isArray(result.details)) {
                    const fieldErrors = result.details.map((d: { path?: string[]; message?: string }) =>
                        `${d.path?.join('.') || 'unknown'}: ${d.message || 'invalid'}`
                    ).join('\n');
                    errorMsg += '\n\n' + (lang === 'ar' ? 'تفاصيل الأخطاء:\n' : 'Error details:\n') + fieldErrors;
                }
                alert(errorMsg);
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert(lang === 'ar' ? 'حدث خطأ في الاتصال بالخادم' : 'Server connection error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <button onClick={() => router.back()} className={styles.btnTextLink}>
                        <ArrowLeft size={18} />
                        <span>{lang === 'ar' ? 'العودة' : 'Back'}</span>
                    </button>
                    <h1>{lang === 'ar' ? 'إضافة عقار جديد' : 'Add New Property'}</h1>
                </div>
                <div className={styles.flexGap1}>
                    <button onClick={() => router.back()} className={`${styles.backButton} ${styles.buttonDanger}`}>
                        <X size={20} />
                        <span>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</span>
                    </button>
                    <button onClick={handleSubmit} className={styles.buttonPrimary} disabled={loading}>
                        {loading ? <Loader2 className={styles.spinner} size={20} /> : <Save size={20} />}
                        <span>{lang === 'ar' ? 'حفظ العقار' : 'Save Property'}</span>
                    </button>
                </div>
            </div>

            <div className={styles.tabsContainer}>
                {Object.entries(categories).map(([id, label]) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setActiveTab(id)}
                        className={`${styles.tabButton} ${activeTab === id ? styles.activeTab : ''}`}
                    >
                        {id === 'basic' && <Info size={18} />}
                        {id === 'location' && <MapPin size={18} />}
                        {id === 'media' && <ImageIcon size={18} />}
                        {id === 'features' && <CheckSquare size={18} />}
                        {label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className={styles.formContent}>
                {activeTab === 'basic' && (
                    <div className={styles.mediaContainer}>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}>
                                <label htmlFor="title">{lang === 'ar' ? 'العنوان (English)' : 'Title (English)'}</label>
                                <input
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleTextChange}
                                    placeholder="Luxury Villa in Beverly Hills"
                                    title={lang === 'ar' ? 'العنوان بالإنجليزية' : 'Title in English'}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup} dir="rtl">
                                <label htmlFor="titleAr">{lang === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}</label>
                                <input
                                    id="titleAr"
                                    name="titleAr"
                                    value={formData.titleAr}
                                    onChange={handleTextChange}
                                    placeholder="فيلا فاخرة في بيفرلي هيلز"
                                    title={lang === 'ar' ? 'العنوان بالعربية' : 'Title in Arabic'}
                                    required
                                />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="slug">Slug (Auto-generated)</label>
                            <input
                                id="slug"
                                name="slug"
                                value={formData.slug}
                                onChange={handleTextChange}
                                disabled
                                className={styles.inputDisabled}
                                title="Property Slug"
                                placeholder="property-slug"
                            />
                        </div>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}>
                                <label htmlFor="description">{lang === 'ar' ? 'الوصف (English)' : 'Description (English)'}</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleTextChange}
                                    rows={6}
                                    title={lang === 'ar' ? 'الوصف بالإنجليزية' : 'Description in English'}
                                    placeholder={lang === 'ar' ? 'أدخل الوصف بالإنجليزية' : 'Enter description in English'}
                                />
                            </div>
                            <div className={styles.formGroup} dir="rtl">
                                <label htmlFor="descriptionAr">{lang === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}</label>
                                <textarea
                                    id="descriptionAr"
                                    name="descriptionAr"
                                    value={formData.descriptionAr}
                                    onChange={handleTextChange}
                                    rows={6}
                                    title={lang === 'ar' ? 'الوصف بالعربية' : 'Description in Arabic'}
                                    placeholder={lang === 'ar' ? 'أدخل الوصف بالعربية' : 'Enter description in Arabic'}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'location' && (
                    <div className={styles.mediaContainer}>
                        <div className={`${styles.grid} ${styles.grid3}`}>
                            <div className={styles.formGroup}>
                                <label htmlFor="type">Type</label>
                                <select name="type" id="type" value={formData.type} onChange={handleTextChange} title="Property Type">
                                    <option value="Villa">Villa</option>
                                    <option value="Apartment">Apartment</option>
                                    <option value="Penthouse">Penthouse</option>
                                    <option value="Townhouse">Townhouse</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="listingType">Listing Type</label>
                                <select name="listingType" id="listingType" value={formData.listingType} onChange={handleTextChange} title="Listing Type">
                                    <option value="sale">For Sale</option>
                                    <option value="rent">For Rent</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="price">Price ({formData.currency})</label>
                                <input
                                    id="price"
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleTextChange}
                                    title="Property Price"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div className={`${styles.grid} ${styles.grid4}`}>
                            <div className={styles.formGroup}>
                                <label htmlFor="bedrooms">Bedrooms</label>
                                <input
                                    id="bedrooms"
                                    name="bedrooms"
                                    type="number"
                                    value={formData.bedrooms}
                                    onChange={handleTextChange}
                                    title="Number of Bedrooms"
                                    placeholder="0"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="bathrooms">Bathrooms</label>
                                <input
                                    id="bathrooms"
                                    name="bathrooms"
                                    type="number"
                                    value={formData.bathrooms}
                                    onChange={handleTextChange}
                                    title="Number of Bathrooms"
                                    placeholder="0"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="area">Area (m²)</label>
                                <input
                                    id="area"
                                    name="area"
                                    type="number"
                                    value={formData.area}
                                    onChange={handleTextChange}
                                    title="Total Area"
                                    placeholder="0"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="plotArea">Plot Area (m²)</label>
                                <input
                                    id="plotArea"
                                    name="plotArea"
                                    type="number"
                                    value={formData.plotArea}
                                    onChange={handleTextChange}
                                    title="Plot Area"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div className={`${styles.grid} ${styles.grid3}`}>
                            <div className={styles.formGroup}>
                                <label htmlFor="city">City</label>
                                <input
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleTextChange}
                                    title="City"
                                    placeholder="New Cairo"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="location">{lang === 'ar' ? 'العنوان' : 'Address/Location'}</label>
                                <input
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleTextChange}
                                    title="Location"
                                    placeholder="e.g. 123 Main St, Compound Name"
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="country">Country</label>
                                <input
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleTextChange}
                                    title="Country"
                                    placeholder="Egypt"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="referenceCode">Reference Code</label>
                                <input
                                    id="referenceCode"
                                    name="referenceCode"
                                    value={formData.referenceCode}
                                    onChange={handleTextChange}
                                    title="Property Reference Code"
                                    placeholder="MODON-1234"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'media' && (
                    <div className={styles.mediaContainer}>
                        <div className={styles.formGroup}>
                            <label>{lang === 'ar' ? 'رابط الصورة' : 'Image URL'}</label>
                            <div className={styles.flexGap1}>
                                <input
                                    value={newImageUrl}
                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                    placeholder={lang === 'ar' ? 'https://example.com/image.jpg' : 'https://example.com/image.jpg'}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddImage();
                                        }
                                    }}
                                    style={{ flex: 1 }}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddImage}
                                    className={styles.buttonPrimary}
                                >
                                    <Plus size={20} />
                                    <span>{lang === 'ar' ? 'إضافة' : 'Add'}</span>
                                </button>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>{lang === 'ar' ? 'أو رفع من الجهاز' : 'Or Upload from Device'}</label>
                            <div
                                className={styles.dropzone}
                                onClick={() => document.getElementById('fileInput')?.click()}
                            >
                                <Upload size={48} color="#d4af37" />
                                <p>{lang === 'ar' ? 'انقر لرفع صورة' : 'Click to Upload Image'}</p>
                                <span>{lang === 'ar' ? 'JPG, PNG بحد أقصى 5 ميجابايت' : 'JPG, PNG max 5MB'}</span>
                                <input
                                    id="fileInput"
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            if (file.size > 5 * 1024 * 1024) {
                                                alert(lang === 'ar' ? 'حجم الملف كبير جداً' : 'File too large (max 5MB)');
                                                return;
                                            }
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                const url = reader.result as string;
                                                setFormData(prev => ({
                                                    ...prev,
                                                    images: [...prev.images, { url, alt: file.name }],
                                                    imageUrl: prev.imageUrl || url
                                                }));
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {formData.images.length === 0 && (
                            <div className={styles.emptyState}>
                                <ImageIcon size={48} />
                                <p>{lang === 'ar' ? 'لا توجد صور مضافة بعد' : 'No images added yet'}</p>
                            </div>
                        )}

                        {formData.images.length > 0 && (
                            <div className={styles.imagePreviewGrid}>
                                {formData.images.map((img, index) => (
                                    <div key={index} className={styles.previewCard}>
                                        <Image
                                            src={img.url}
                                            alt={`Property ${index}`}
                                            fill
                                            sizes="150px"
                                            style={{ objectFit: 'cover' }}
                                        />
                                        <button
                                            type="button"
                                            className={styles.deleteImageBtn}
                                            title="Remove Image"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeImage(index);
                                            }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'features' && (
                    <div className={styles.mediaContainer}>
                        <div className={styles.formGroup}>
                            <label>{lang === 'ar' ? 'الميزات والخدمات' : 'Features & Amenities'}</label>
                            <div className={styles.featuresGrid}>
                                {['Swimming Pool', 'Private Garden', 'Security 24/7', 'Gym', 'Parking', 'Seaview', 'Smart Home', 'Balcony', 'Maid Service'].map(feature => (
                                    <button
                                        key={feature}
                                        type="button"
                                        onClick={() => handleFeatureToggle(feature)}
                                        className={`${styles.featureItem} ${formData.features.includes(feature) ? styles.selectedFeature : ''}`}
                                    >
                                        <div className={`${styles.featureCheck} ${formData.features.includes(feature) ? styles.featureCheckActive : ''}`}>
                                            {formData.features.includes(feature) && <Save size={12} color="#1a1a1a" />}
                                        </div>
                                        <span>{feature}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>{lang === 'ar' ? 'حالة النشر' : 'Publishing Status'}</label>
                            <div className={styles.flexGap1}>
                                <button
                                    type="button"
                                    onClick={() => setFormData(p => ({ ...p, status: 'draft' }))}
                                    className={`${styles.featureItem} ${styles.flex1} ${formData.status === 'draft' ? styles.selectedFeature : ''}`}
                                >
                                    {lang === 'ar' ? 'مسودة' : 'Draft'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(p => ({ ...p, status: 'active' }))}
                                    className={`${styles.featureItem} ${styles.flex1} ${formData.status === 'active' ? styles.selectedFeature : ''}`}
                                >
                                    {lang === 'ar' ? 'نشر' : 'Publish'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
