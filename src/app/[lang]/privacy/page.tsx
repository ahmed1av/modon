import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './privacy.module.css';

export const metadata: Metadata = {
    title: 'Privacy Policy | MODON Evolutio',
    description: 'Privacy Policy for MODON Evolutio - Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicy() {
    return (
        <div className={styles.container}>
            <Link href="/" className={styles.backLink}>
                ← Back to Home
            </Link>

            <h1 className={styles.title}>
                Privacy Policy
            </h1>

            <p className={styles.lastUpdated}>
                <strong>Last Updated:</strong> February 5, 2026
            </p>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    1. Introduction
                </h2>
                <p>
                    Welcome to MODON Evolutio (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your personal information
                    and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your
                    information when you visit our website <strong>modonevolutio.com</strong> (the &quot;Site&quot;) and use our services.
                </p>
                <p>
                    By using our Site, you consent to the data practices described in this policy. If you do not agree with
                    this policy, please do not access or use our Site.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    2. Information We Collect
                </h2>
                <h3 className={styles.subTitle}>
                    2.1 Personal Information
                </h3>
                <p>We may collect personally identifiable information that you voluntarily provide to us when you:</p>
                <ul className={styles.list}>
                    <li>Register on the Site</li>
                    <li>Submit a property inquiry or contact form</li>
                    <li>Request to schedule a property viewing</li>
                    <li>Subscribe to our newsletter</li>
                    <li>Contact us via email, phone, or WhatsApp</li>
                </ul>
                <p>This information may include:</p>
                <ul className={styles.listNoBottom}>
                    <li>Name and contact information (email address, phone number)</li>
                    <li>Property preferences and search criteria</li>
                    <li>Financial information (income range, budget) for property matching</li>
                    <li>Communication preferences</li>
                </ul>

                <h3 className={styles.subTitle}>
                    2.2 Automatically Collected Information
                </h3>
                <p>When you visit our Site, we automatically collect certain information about your device, including:</p>
                <ul className={styles.listNoBottom}>
                    <li>IP address and browser type</li>
                    <li>Operating system and device information</li>
                    <li>Pages visited and time spent on pages</li>
                    <li>Referring website</li>
                    <li>Clickstream data</li>
                </ul>

                <h3 className={styles.subTitle}>
                    2.3 Cookies and Tracking Technologies
                </h3>
                <p>
                    We use cookies, web beacons, and similar tracking technologies to collect information about your browsing
                    activities. This helps us improve our Site, analyze trends, and personalize your experience.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    3. How We Use Your Information
                </h2>
                <p>We use the information we collect for the following purposes:</p>
                <ul className={styles.listNoBottom}>
                    <li>To provide, operate, and maintain our services</li>
                    <li>To process your inquiries and respond to your requests</li>
                    <li>To match you with suitable properties based on your preferences</li>
                    <li>To schedule property viewings and arrange meetings</li>
                    <li>To send you marketing communications (with your consent)</li>
                    <li>To analyze usage trends and improve our Site</li>
                    <li>To detect, prevent, and address technical issues or fraudulent activity</li>
                    <li>To comply with legal obligations</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    4. How We Share Your Information
                </h2>
                <p>We may share your information in the following situations:</p>
                <ul className={styles.listNoBottom}>
                    <li><strong>With Property Owners/Developers:</strong> When you inquire about a specific property</li>
                    <li><strong>With Service Providers:</strong> Third-party vendors who assist us in operating our Site
                        (e.g., hosting providers, analytics services, email marketing platforms)</li>
                    <li><strong>For Legal Compliance:</strong> When required by law or to protect our rights</li>
                    <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                    <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
                </ul>
                <p className={styles.highlight}>
                    <strong>We do not sell your personal information to third parties.</strong>
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    5. Data Security
                </h2>
                <p>
                    We implement appropriate technical and organizational security measures to protect your personal information
                    from unauthorized access, disclosure, alteration, or destruction. These measures include:
                </p>
                <ul className={styles.listNoBottom}>
                    <li>SSL/TLS encryption for data transmission</li>
                    <li>Secure database storage with access controls</li>
                    <li>Regular security assessments and updates</li>
                    <li>Employee training on data protection</li>
                </ul>
                <p className={styles.highlight}>
                    However, no method of transmission over the Internet is 100% secure. While we strive to protect your
                    information, we cannot guarantee absolute security.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    6. Your Rights
                </h2>
                <p>Depending on your location, you may have the following rights regarding your personal information:</p>
                <ul className={styles.listNoBottom}>
                    <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                    <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                    <li><strong>Objection:</strong> Object to our processing of your personal information</li>
                    <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
                    <li><strong>Portability:</strong> Request transfer of your information to another service</li>
                    <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
                </ul>
                <p className={styles.highlight}>
                    To exercise these rights, please contact us at <a href="mailto:privacy@modonevolutio.com" className={styles.link}>
                        privacy@modonevolutio.com</a>.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    7. Third-Party Services
                </h2>
                <p>
                    Our Site may contain links to third-party websites and services (e.g., Google Maps, WhatsApp, social media
                    platforms). We are not responsible for the privacy practices of these third parties. We encourage you to
                    review their privacy policies before providing any personal information.
                </p>
                <p className={styles.highlight}>
                    <strong>Third-Party Services We Use:</strong>
                </p>
                <ul className={styles.listNoBottom}>
                    <li>Google Analytics (for website analytics)</li>
                    <li>WhatsApp (for direct communication)</li>
                    <li>Supabase (for database hosting)</li>
                    <li>Vercel (for website hosting)</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    8. International Data Transfers
                </h2>
                <p>
                    Your information may be transferred to and processed in countries other than Egypt, including the United
                    States and European Union. These countries may have different data protection laws than Egypt. By using
                    our Site, you consent to the transfer of your information to these countries.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    9. Children&apos;s Privacy
                </h2>
                <p>
                    Our Site is not directed to individuals under the age of 18. We do not knowingly collect personal
                    information from children. If you believe we have collected information from a child, please contact
                    us immediately.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    10. Changes to This Privacy Policy
                </h2>
                <p>
                    We may update this Privacy Policy from time to time. The updated version will be indicated by an updated
                    &quot;Last Updated&quot; date at the top of this page. We encourage you to review this policy periodically.
                </p>
                <p className={styles.highlight}>
                    Continued use of our Site after changes constitutes acceptance of the updated policy.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    11. Contact Us
                </h2>
                <p>
                    If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className={styles.contactCard}>
                    <p className={styles.contactLine}><strong>MODON Evolutio</strong></p>
                    <p className={styles.contactLine}>Email: <a href="mailto:privacy@modonevolutio.com" className={styles.link}>
                        privacy@modonevolutio.com</a></p>
                    <p className={styles.contactLine}>Phone: <a href="tel:+201000000000" className={styles.link}>+20 100 000 0000</a></p>
                    <p className={styles.contactLine}>Address: Cairo, Egypt</p>
                </div>
            </section>

            <div className={styles.footer}>
                <p>
                    © 2026 MODON Evolutio. All rights reserved.
                </p>
                <p className={styles.footerLinks}>
                    <Link href="/terms" className={styles.footerLink}>
                        Terms of Use
                    </Link>
                    <Link href="/" className={styles.footerLink}>
                        Home
                    </Link>
                </p>
            </div>
        </div>
    );
}
