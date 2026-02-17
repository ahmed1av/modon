import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './terms.module.css';

export const metadata: Metadata = {
    title: 'Terms of Use | MODON Evolutio',
    description: 'Terms of Use for MODON Evolutio - Review the terms and conditions for using our real estate platform.',
};

export default function TermsOfUse() {
    return (
        <div className={styles.container}>
            <Link href="/" className={styles.backLink}>
                ← Back to Home
            </Link>

            <h1 className={styles.title}>
                Terms of Use
            </h1>

            <p className={styles.lastUpdated}>
                <strong>Last Updated:</strong> February 5, 2026
            </p>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    1. Acceptance of Terms
                </h2>
                <p>
                    Welcome to MODON Evolutio. By accessing or using our website <strong>modonevolutio.com</strong> (the &quot;Site&quot;)
                    and our real estate advisory services (the &quot;Services&quot;), you agree to be bound by these Terms of Use
                    (&quot;Terms&quot;). If you do not agree to these Terms, please do not use our Site or Services.
                </p>
                <p className={styles.highlight}>
                    These Terms constitute a legally binding agreement between you and MODON Evolutio (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;).
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    2. Description of Services
                </h2>
                <p>
                    MODON Evolutio provides luxury real estate advisory services in Egypt, including:
                </p>
                <ul className={styles.listNoBottom}>
                    <li>Property listings for sale and rent</li>
                    <li>Property search and matching services</li>
                    <li>Virtual property tours and viewings</li>
                    <li>Market analysis and advisory</li>
                    <li>Property valuation services</li>
                    <li>Connection with property owners, developers, and buyers</li>
                </ul>
                <p className={styles.highlight}>
                    We act as intermediaries and advisors. We do not own, develop, or directly sell the properties listed
                    on our Site unless explicitly stated.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    3. User Eligibility
                </h2>
                <p>
                    You must be at least 18 years old and legally capable of entering into binding contracts to use our
                    Services. By using our Site, you represent and warrant that you meet these eligibility requirements.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    4. Property Information and Accuracy
                </h2>
                <p>
                    While we strive to provide accurate and up-to-date property information, we make no guarantees regarding:
                </p>
                <ul className={styles.listNoBottom}>
                    <li>The accuracy, completeness, or currency of property listings</li>
                    <li>The availability of properties shown on our Site</li>
                    <li>Property prices, specifications, or features</li>
                    <li>Legal status, ownership, or title of listed properties</li>
                </ul>
                <p className={styles.highlight}>
                    <strong>Important:</strong> All property information is provided by third parties (owners, developers,
                    agents). You should independently verify all information before making any purchase or rental decision.
                    We recommend:
                </p>
                <ul className={styles.listNoBottom}>
                    <li>Conducting independent property inspections</li>
                    <li>Verifying legal documentation and ownership</li>
                    <li>Consulting with legal and financial advisors</li>
                    <li>Reviewing all contracts carefully before signing</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    5. User Conduct
                </h2>
                <p>When using our Site and Services, you agree to:</p>
                <ul className={styles.listNoBottom}>
                    <li>Provide accurate, current, and complete information</li>
                    <li>Use the Services for lawful purposes only</li>
                    <li>Respect intellectual property rights</li>
                    <li>Not engage in fraudulent or deceptive practices</li>
                    <li>Not harass, abuse, or harm other users or our staff</li>
                    <li>Not upload malicious code, viruses, or harmful content</li>
                    <li>Not scrape, crawl, or systematically extract data from our Site</li>
                    <li>Not impersonate any person or entity</li>
                </ul>
                <p className={styles.highlight}>
                    Violation of these terms may result in termination of your access to our Services and potential legal action.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    6. Intellectual Property
                </h2>
                <p>
                    All content on our Site, including but not limited to text, graphics, logos, images, videos, software,
                    and design, is the property of MODON Evolutio or our licensors and is protected by intellectual property laws.
                </p>
                <p className={styles.highlight}>
                    You may not:
                </p>
                <ul className={styles.listNoBottom}>
                    <li>Copy, reproduce, or distribute our content without permission</li>
                    <li>Modify, reverse engineer, or create derivative works</li>
                    <li>Use our trademarks, logos, or branding without authorization</li>
                    <li>Remove copyright or proprietary notices</li>
                </ul>
                <p className={styles.highlight}>
                    Property images and descriptions are provided by property owners and may be subject to their own copyrights.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    7. Fees and Payments
                </h2>
                <p>
                    Browsing our Site and submitting property inquiries is free for users. However, we may charge fees for:
                </p>
                <ul className={styles.listNoBottom}>
                    <li>Premium advisory services</li>
                    <li>Property valuation reports</li>
                    <li>Exclusive property finder services</li>
                    <li>Other specialized services as offered</li>
                </ul>
                <p className={styles.highlight}>
                    All fees will be clearly disclosed before you commit to using paid services. Fees are typically paid
                    by sellers, developers, or as commission from successful transactions.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    8. Third-Party Links and Services
                </h2>
                <p>
                    Our Site may contain links to third-party websites, services, or resources (e.g., property developers,
                    mortgage providers, legal services). These links are provided for your convenience, and we do not
                    endorse, control, or assume responsibility for the content, privacy policies, or practices of third parties.
                </p>
                <p className={styles.highlight}>
                    You access third-party sites at your own risk and should review their terms and policies.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    9. Disclaimer of Warranties
                </h2>
                <p>
                    OUR SITE AND SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
                    EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className={styles.listNoBottom}>
                    <li>Warranties of merchantability or fitness for a particular purpose</li>
                    <li>Warranties of accuracy, reliability, or completeness of information</li>
                    <li>Warranties of uninterrupted or error-free service</li>
                    <li>Warranties that properties will meet your requirements</li>
                </ul>
                <p className={styles.highlight}>
                    We do not guarantee property availability, accuracy of listings, or successful transactions. Real
                    estate transactions involve inherent risks, and you are solely responsible for your decisions.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    10. Limitation of Liability
                </h2>
                <p>
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, MODON EVOLUTIO SHALL NOT BE LIABLE FOR:
                </p>
                <ul className={styles.listNoBottom}>
                    <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                    <li>Loss of profits, revenue, data, or business opportunities</li>
                    <li>Personal injury or property damage arising from your use of our Services</li>
                    <li>Errors, omissions, or inaccuracies in property listings</li>
                    <li>Actions or omissions of third parties (property owners, developers, buyers)</li>
                    <li>Failed transactions or disputes between parties</li>
                </ul>
                <p className={styles.highlight}>
                    Our total liability for any claim shall not exceed the amount you paid us (if any) for the specific
                    service giving rise to the claim, or EGP 1,000, whichever is greater.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    11. Indemnification
                </h2>
                <p>
                    You agree to indemnify, defend, and hold harmless MODON Evolutio, its affiliates, officers, directors,
                    employees, and agents from any claims, liabilities, damages, losses, costs, or expenses (including
                    legal fees) arising from:
                </p>
                <ul className={styles.listNoBottom}>
                    <li>Your use of our Site or Services</li>
                    <li>Your violation of these Terms</li>
                    <li>Your violation of any third-party rights</li>
                    <li>Your interactions with propertyowners, developers, or other users</li>
                    <li>Any false or misleading information you provide</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    12. Privacy and Data Protection
                </h2>
                <p>
                    Your use of our Site is also governed by our <Link href="/privacy" className={styles.link}>
                        Privacy Policy</Link>, which explains how we collect, use, and protect your personal information.
                    By using our Services, you consent to our data practices as described in the Privacy Policy.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    13. Governing Law and Jurisdiction
                </h2>
                <p>
                    These Terms shall be governed by and construed in accordance with the laws of the Arab Republic of Egypt,
                    without regard to its conflict of law provisions.
                </p>
                <p className={styles.highlight}>
                    Any disputes arising from these Terms or your use of our Services shall be subject to the exclusive
                    jurisdiction of the courts of Cairo, Egypt.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    14. Termination
                </h2>
                <p>
                    We reserve the right to suspend or terminate your access to our Site and Services at any time, with
                    or without notice, for any reason, including but not limited to:
                </p>
                <ul className={styles.listNoBottom}>
                    <li>Violation of these Terms</li>
                    <li>Fraudulent or illegal activity</li>
                    <li>Providing false information</li>
                    <li>Abuse of our Services or staff</li>
                </ul>
                <p className={styles.highlight}>
                    Upon termination, your right to use our Services will cease immediately. Provisions that should
                    survive termination (e.g., disclaimers, limitations of liability, indemnification) shall remain in effect.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    15. Changes to Terms
                </h2>
                <p>
                    We may modify these Terms at any time by posting the updated version on our Site with a new &quot;Last
                    Updated&quot; date. Your continued use of our Services after changes are posted constitutes acceptance
                    of the modified Terms.
                </p>
                <p className={styles.highlight}>
                    We encourage you to review these Terms periodically. Material changes will be communicated via email
                    or prominent notice on our Site.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    16. Severability
                </h2>
                <p>
                    If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining
                    provisions shall continue in full force and effect. The invalid provision shall be replaced with a
                    valid provision that most closely reflects the original intent.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    17. Entire Agreement
                </h2>
                <p>
                    These Terms, together with our Privacy Policy, constitute the entire agreement between you and
                    MODON Evolutio regarding your use of our Site and Services, and supersede all prior agreements
                    and understandings.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    18. Contact Us
                </h2>
                <p>
                    If you have questions about these Terms of Use, please contact us:
                </p>
                <div className={styles.contactCard}>
                    <p className={styles.contactLine}><strong>MODON Evolutio</strong></p>
                    <p className={styles.contactLine}>Email: <a href="mailto:legal@modonevolutio.com" className={styles.link}>
                        legal@modonevolutio.com</a></p>
                    <p className={styles.contactLine}>Phone: <a href="tel:+201000000000" className={styles.link}>+20 100 000 0000</a></p>
                    <p className={styles.contactLine}>Address: Cairo, Egypt</p>
                </div>
            </section>

            <div className={styles.footer}>
                <p>
                    © 2026 MODON Evolutio. All rights reserved.
                </p>
                <p className={styles.footerLinks}>
                    <Link href="/privacy" className={styles.footerLink}>
                        Privacy Policy
                    </Link>
                    <Link href="/" className={styles.footerLink}>
                        Home
                    </Link>
                </p>
            </div>
        </div>
    );
}
