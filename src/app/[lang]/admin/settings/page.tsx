
'use client';

import { useParams } from 'next/navigation';
import {
    Settings,
    User,
    Shield,
    Globe,
    Database,
    Bell,
    Lock,
    Save,
    ExternalLink
} from 'lucide-react';
import styles from '../admin.module.css';

export default function AdminSettingsPage() {
    const params = useParams();
    const lang = (params?.lang as string) || 'en';

    const t = {
        title: lang === 'ar' ? 'الإعدادات' : 'Settings',
        profile: lang === 'ar' ? 'الملف الشخصي' : 'Profile Settings',
        security: lang === 'ar' ? 'الأمان' : 'Security',
        localization: lang === 'ar' ? 'اللغة والموقع' : 'Localization',
        system: lang === 'ar' ? 'النظام' : 'System',
        save: lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes'
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>{t.title}</h1>
                    <p className={styles.subtitle}>
                        {lang === 'ar' ? 'تخصيص تجربة لوحة التحكم الخاصة بك' : 'Customize your admin experience'}
                    </p>
                </div>
                <button className={styles.buttonPrimary} title={t.save}>
                    <Save size={18} />
                    {t.save}
                </button>
            </div>

            <div className={styles.statsGrid}>
                <div className={`${styles.statCard} ${styles.cursorPointer}`}>
                    <div className={`${styles.statIcon} ${styles.statIconProfile}`}>
                        <User size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <h3 className={styles.statTitle}>{t.profile}</h3>
                        <p className={styles.statDesc}>Update your info and avatar</p>
                    </div>
                </div>

                <div className={`${styles.statCard} ${styles.cursorPointer}`}>
                    <div className={`${styles.statIcon} ${styles.statIconSecurity}`}>
                        <Shield size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <h3 className={styles.statTitle}>{t.security}</h3>
                        <p className={styles.statDesc}>Password and 2FA settings</p>
                    </div>
                </div>

                <div className={`${styles.statCard} ${styles.cursorPointer}`}>
                    <div className={`${styles.statIcon} ${styles.statIconLocalization}`}>
                        <Globe size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <h3 className={styles.statTitle}>{t.localization}</h3>
                        <p className={styles.statDesc}>Language and currency preferences</p>
                    </div>
                </div>

                <div className={`${styles.statCard} ${styles.cursorPointer}`}>
                    <div className={`${styles.statIcon} ${styles.statIconSystem}`}>
                        <Database size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <h3 className={styles.statTitle}>{t.system}</h3>
                        <p className={styles.statDesc}>Cache and database maintenance</p>
                    </div>
                </div>
            </div>

            <div className={`${styles.section} ${styles.mt2}`}>
                <h2 className={styles.tabTitle}>
                    <Lock size={20} />
                    {lang === 'ar' ? 'الأمان والخصوصية' : 'Security & Privacy'}
                </h2>

                <div className={styles.securityGrid}>
                    <div className={styles.securityCard}>
                        <h4 className={styles.securityCardTitle}>Admin Access Logs</h4>
                        <p className={styles.securityCardDesc}>Review recent login activity and security events.</p>
                        <button className={`${styles.viewAllLink} ${styles.noPadding}`} title="View Access Logs">
                            View activity logs <ExternalLink size={14} />
                        </button>
                    </div>

                    <div className={styles.securityCard}>
                        <h4 className={styles.securityCardTitle}>API Tokens</h4>
                        <p className={styles.securityCardDesc}>Manage personal access tokens for external integrations.</p>
                        <button className={`${styles.viewAllLink} ${styles.noPadding}`} title="Manage API Tokens">
                            Generate new token <ExternalLink size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
