'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import styles from './login.module.css';

interface LoginClientProps {
    lang: 'en' | 'ar';
}

export default function LoginClient({ lang }: LoginClientProps) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, rememberMe }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Redirect to admin dashboard
            router.push(`/${lang}/admin`);
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const isRtl = lang === 'ar';

    return (
        <div className={styles.loginPage} dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Image Section (Left) */}
            <div className={styles.imageSection}>
                <div className={styles.imagePlaceholder} />
                <Image
                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000&auto=format&fit=crop"
                    alt="Luxury Real Estate"
                    fill
                    className={styles.heroImage}
                    priority
                />
                <div className={styles.imageOverlay} />
                <div className={styles.imageText}>
                    <h2 className={styles.imageTitle}>
                        {lang === 'ar' ? 'بوابة الإدارة العقارية' : 'Property Management Portal'}
                    </h2>
                    <p className={styles.imageSubtitle}>
                        {lang === 'ar'
                            ? 'نظام متكامل لإدارة المحفظة العقارية والعملاء المتميزين بكل احترافية.'
                            : 'Integrated system to manage your property portfolio and distinguished clientele with professional excellence.'}
                    </p>
                </div>
            </div>

            {/* Form Section (Right) */}
            <div className={styles.formSection}>
                <div className={styles.formContainer}>
                    {/* Brand */}
                    <Link href={`/${lang}`} className={styles.brandLink}>
                        <span className={styles.brandText}>MODON</span>
                    </Link>

                    {/* Title */}
                    <h1 className={styles.formTitle}>
                        {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                    </h1>
                    <p className={styles.formSubtitle}>
                        {lang === 'ar'
                            ? 'أهلاً بك في نظام إدارة "مدن". يرجى إدخال بياناتك.'
                            : 'Welcome to MODON Management System. Please enter your credentials.'}
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className={styles.loginForm} dir={isRtl ? 'rtl' : 'ltr'}>
                        {error && (
                            <div className={styles.errorBox}>
                                <AlertCircle className={styles.errorIcon} size={18} />
                                <span className={styles.errorText}>{error}</span>
                            </div>
                        )}

                        {/* Email Field */}
                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>
                                {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                            </label>
                            <div className={styles.inputWrapper}>
                                <Mail className={styles.inputIcon} size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={styles.formInput}
                                    placeholder="admin@modon.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>
                                {lang === 'ar' ? 'كلمة المرور' : 'Password'}
                            </label>
                            <div className={styles.inputWrapper}>
                                <Lock className={styles.inputIcon} size={20} />
                                <input
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={styles.formInput}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Remember + Forgot */}
                        <div className={styles.rememberRow}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className={styles.checkbox}
                                />
                                <span className={styles.checkboxText}>
                                    {lang === 'ar' ? 'تذكرني' : 'Remember me'}
                                </span>
                            </label>
                            <Link href="#" className={styles.forgotLink}>
                                {lang === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                            </Link>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={styles.submitBtn}
                        >
                            {loading ? (
                                <Loader2 className={styles.spinner} size={24} />
                            ) : (
                                <>
                                    {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                                    <ArrowRight size={22} className={styles.submitBtnArrow} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
