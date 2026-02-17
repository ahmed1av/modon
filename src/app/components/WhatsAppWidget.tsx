'use client';

import { useState, useEffect } from 'react';
import styles from './whatsapp-widget.module.css';

/**
 * WhatsApp Floating Widget
 * ========================
 * Direct communication button for Egyptian market
 * 
 * Features:
 * - Floating bottom-right position
 * - Official WhatsApp green branding
 * - Pre-filled message for property inquiries
 * - Pulse animation on load
 * - Responsive design (mobile + desktop)
 * - Environment variable for phone number
 */

interface WhatsAppWidgetProps {
    phoneNumber?: string;
    message?: string;
    position?: 'bottom-right' | 'bottom-left';
}

export default function WhatsAppWidget({
    phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '201070058019',
    message = 'Hello MODON Evolutio, I am interested in your luxury properties.',
    position = 'bottom-right',
}: WhatsAppWidgetProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldPulse, setShouldPulse] = useState(true);

    // Show widget after component mounts (for animation)
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 500);

        // Stop pulse animation after 5 seconds
        const pulseTimer = setTimeout(() => {
            setShouldPulse(false);
        }, 5000);

        return () => {
            clearTimeout(timer);
            clearTimeout(pulseTimer);
        };
    }, []);

    // Generate WhatsApp link with pre-filled message
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9+]/g, '')}?text=${encodeURIComponent(message)}`;

    const handleClick = () => {
        // Track WhatsApp click (if analytics is available)
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'whatsapp_clicked', {
                event_category: 'engagement',
                event_label: 'WhatsApp Widget',
                phone_number: phoneNumber,
            });
        }

        // Open WhatsApp in new tab
        window.open(whatsappLink, '_blank', 'noopener,noreferrer');
    };

    return (
        <div
            className={`${styles.whatsappWidget} ${position === 'bottom-left' ? styles.left : styles.right
                } ${isVisible ? styles.visible : ''} ${shouldPulse ? styles.pulse : ''}`}
            role="button"
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                }
            }}
            aria-label="Contact us on WhatsApp"
        >
            {/* WhatsApp Icon (Official SVG) */}
            <svg
                className={styles.icon}
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <path
                    fill="currentColor"
                    d="M16 0C7.164 0 0 7.163 0 16c0 2.824.739 5.477 2.031 7.777L0 32l8.399-2.003A15.926 15.926 0 0016 32c8.836 0 16-7.163 16-16S24.836 0 16 0zm0 29.333c-2.547 0-4.95-.71-6.991-1.943l-.501-.296-5.197 1.237 1.248-5.113-.325-.518A13.267 13.267 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333z"
                />
                <path
                    fill="currentColor"
                    d="M23.197 19.803c-.385-.193-2.279-1.124-2.633-1.253-.353-.128-.611-.193-.868.193-.257.385-1.001 1.253-1.226 1.51-.225.258-.45.29-.835.097-.385-.193-1.627-.6-3.098-1.912-1.145-1.022-1.918-2.284-2.143-2.669-.225-.385-.024-.593.169-.785.173-.172.385-.45.578-.674.193-.225.257-.385.385-.643.128-.257.064-.482-.032-.674-.097-.193-.868-2.092-1.19-2.863-.314-.75-.633-.649-.868-.661-.225-.011-.482-.013-.74-.013s-.675.096-1.029.482c-.353.385-1.351 1.317-1.351 3.216s1.383 3.73 1.575 3.987c.193.257 2.719 4.188 6.601 5.87.922.399 1.642.637 2.203.816.926.295 1.769.253 2.435.153.743-.111 2.279-.932 2.601-1.832.321-.9.321-1.671.225-1.832-.097-.161-.353-.257-.74-.45z"
                />
            </svg>

            {/* Tooltip (optional, shows on hover) */}
            <div className={styles.tooltip}>
                <span>Chat on WhatsApp</span>
            </div>
        </div>
    );
}
