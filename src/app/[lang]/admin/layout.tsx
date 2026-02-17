
'use client';

import React from 'react';
import { LayoutDashboard, Home, MessageSquare, Settings, LogOut, User } from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './layout.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const params = useParams();
    const pathname = usePathname();
    const lang = (params?.lang as string) || 'en';

    const navItems = [
        { label: lang === 'ar' ? 'لوحة التحكم' : 'Dashboard', icon: LayoutDashboard, href: `/${lang}/admin` },
        { label: lang === 'ar' ? 'العقارات' : 'Properties', icon: Home, href: `/${lang}/admin/properties` },
        { label: lang === 'ar' ? 'الرسائل' : 'Leads', icon: MessageSquare, href: `/${lang}/admin/leads` },
        { label: lang === 'ar' ? 'الإعدادات' : 'Settings', icon: Settings, href: `/${lang}/admin/settings` },
    ];

    return (
        <div className={styles.adminLayout} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <Link href={`/${lang}`} className={styles.logo}>
                        <span>MODON</span>
                    </Link>
                </div>

                <nav className={styles.nav}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className={styles.sidebarFooter}>
                    <button
                        className={styles.navLink}
                        onClick={async () => {
                            try {
                                await fetch('/api/auth/logout', { method: 'POST' });
                            } catch (error) {
                                console.error('Logout failed:', error);
                            }
                            window.location.href = `/${lang}/login`;
                        }}
                    >
                        <LogOut size={20} />
                        <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                <header className={styles.topBar}>
                    <div className={styles.userProfile}>
                        <div className={styles.avatar}>
                            <User size={20} />
                        </div>
                        <span>Admin</span>
                    </div>
                </header>

                <div className={styles.content}>
                    {children}
                </div>
            </main>
        </div>
    );
}
