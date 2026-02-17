# 🇪🇬 MODON EVOLUTIO - KEY CODE SNIPPETS

## 📦 **DELIVERABLES**

This file contains the exact code for the 3 key areas you requested.

---

## 1️⃣ **NAVBAR.TSX - MODON EVOLUTIO BRANDING**

**File:** `src/app/components/navigation/Header.tsx`

### **Import Section (Top of file):**

```tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Globe, Menu, X, ChevronDown, Heart, Building2 } from 'lucide-react';
//                                                 ^^^^^^^^^ Added
import styles from './header.module.css';
import LanguageSwitcher from './LanguageSwitcher';
```

### **Logo Section (Around line 105):**

```tsx
{/* Logo - Center - MODON EVOLUTIO */}
<Link href="/" className={styles.logo}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Building2 size={32} strokeWidth={1.5} />
        <span style={{ fontSize: '18px', fontWeight: '300', letterSpacing: '0.5px' }}>
            MODON EVOLUTIO
        </span>
    </div>
</Link>
```

**Note:** If you have a custom logo image in `/public/logo.png`, replace with:

```tsx
<Link href="/" className={styles.logo}>
    <Image src="/logo.png" alt="MODON Evolutio" width={120} height={40} />
    <span>MODON EVOLUTIO</span>
</Link>
```

---

## 2️⃣ **LAYOUT.TSX - SITE METADATA**

**File:** `src/app/[lang]/layout.tsx`

### **Complete Updated Section:**

```tsx
import type { Metadata } from 'next';
import { Playfair_Display, Montserrat } from 'next/font/google';
import '../globals.css';
import '../luxury-hovers.css';

/**
 * MODON EVOLUTIO - Root Layout (MainLayout)
 * ==========================================
 * Global layout wrapper ensuring Header/Footer persistence
 * across all routes with premium typography system
 */

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
});

const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-montserrat',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'MODON Evolutio | Personal Property Advisors in Egypt',
    description: 'MODON Evolutio offers a groundbreaking standard of qualified insight and seamless experience in Egyptian luxury real estate. Discover exceptional properties in New Cairo, North Coast, and beyond.',
    keywords: 'luxury real estate Egypt, property advisors Cairo, high-end homes Egypt, New Cairo properties, North Coast villas, MODON Evolutio',
};

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dir = lang === 'ar' ? 'rtl' : 'ltr';

    return (
        <html lang={lang} dir={dir} className={`${playfair.variable} ${montserrat.variable}`}>
            <body>
                {children}
            </body>
        </html>
    );
}
```

---

## 3️⃣ **CURRENCY SYSTEM - EGP INTEGRATION**

**File:** `src/lib/currency/index.ts`

### **Supported Currency Type:**

```typescript
export type SupportedCurrency = 'EGP' | 'EUR' | 'USD' | 'GBP' | 'AED' | 'SAR';
//                                ^^^^ Added EGP first
```

### **EGP Configuration:**

```typescript
export const currencies: Record<SupportedCurrency, CurrencyConfig> = {
    EGP: {
        code: 'EGP',
        name: 'Egyptian Pound',
        symbol: 'EGP',
        symbolPosition: 'before',
        decimals: 0,  // No decimals for Egyptian market
        thousandsSeparator: ',',
        decimalSeparator: '.',
        flag: '🇪🇬',
    },
    EUR: { /* ... existing config ... */ },
    USD: { /* ... existing config ... */ },
    // ... other currencies
};
```

### **Default Currency:**

```typescript
export const defaultCurrency: SupportedCurrency = 'EGP';
//                                                 ^^^^^ Changed from 'EUR'
```

### **Exchange Rates (Base: EGP):**

```typescript
// Base: EGP (Egyptian Pound)
const exchangeRates: Record<SupportedCurrency, number> = {
    EGP: 1.0,
    EUR: 0.019,  // 1 EGP ≈ 0.019 EUR
    USD: 0.020,  // 1 EGP ≈ 0.02 USD
    GBP: 0.016,
    AED: 0.074,
    SAR: 0.076,
};
```

### **Usage Example:**

```typescript
import { formatPropertyPrice } from '@/lib/currency';

// Automatically formats as EGP
const price = formatPropertyPrice(85000000);  // "EGP 85,000,000"

// Or specify currency explicitly
const priceUSD = formatPropertyPrice(85000000, 'USD');  // "$1,700,000"
```

---

## 4️⃣ **PROPERTY CARD COMPONENT - EGP DISPLAY**

**File:** `src/app/components/property/PropertyCard.tsx`

### **Updated Price Display:**

```tsx
import { formatPropertyPrice } from '@/lib/currency';

export default function PropertyCard({ property }: { property: Property }) {
    // EGP is now the default
    const formattedPrice = formatPropertyPrice(property.price);
    
    return (
        <div className={styles.propertyCard}>
            {/* ... image ... */}
            <div className={styles.price}>
                {formattedPrice}  {/* Displays: EGP 85,000,000 */}
            </div>
            {/* ... rest of card ... */}
        </div>
    );
}
```

---

## 5️⃣ **DATABASE SEED - EGYPTIAN PROPERTIES**

**File:** `database/seed.ts`

### **Sample Property (Cairo):**

```typescript
{
    title: "Presidential Villa in New Cairo",
    slug: "presidential-villa-new-cairo-" + Date.now().toString(36),
    description: "An extraordinary 8-bedroom presidential villa in the heart of New Cairo's most prestigious compound. This architectural masterpiece spans 1,200 sqm of living space with a private 3,000 sqm garden featuring a heated infinity pool, tennis court, and landscaped gardens.",
    price: 85000000,
    currency: "EGP",
    location: "Katameya Heights, New Cairo",
    city: "Cairo",
    country: "Egypt",
    type: "Villa",
    bedrooms: 8,
    bathrooms: 10,
    area: 1200,
    plot_area: 3000,
    image_url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    features: ["Private Pool", "Tennis Court", "Smart Home", "Cinema Room", "Wine Cellar", "Staff Quarters", "6-Car Garage", "Elevator"],
    is_featured: true,
    is_new: true,
    is_exclusive: true,
    status: "active",
    listing_type: "sale",
    reference_code: "MOD-2602-VIP001"
},
```

### **Sample Lead (Egyptian Phone):**

```typescript
{
    name: "Ahmed Hassan",
    email: "ahmed.hassan@example.com",
    phone: "+201001234567",  // ← Egyptian phone format
    message: "I'm interested in the Presidential Villa in New Cairo...",
    type: "property_inquiry",
    status: "new",
    preferred_contact: "whatsapp"
}
```

### **To Run the Seed:**

```bash
# Method 1
npm run db:seed

# Method 2
npx ts-node database/seed.ts
```

---

## 6️⃣ **DICTIONARIES - EGYPTIAN LOCATIONS**

### **English Dictionary** (`src/dictionaries/en.json`)

```json
{
  "buy_page": {
    "hero_title": "Luxury Properties for Sale in Egypt",
    "hero_subtitle": "Discover extraordinary homes across Egypt's most prestigious locations - from New Cairo to North Coast",
    "popular_locations": [
      "New Cairo", 
      "Sheikh Zayed", 
      "North Coast", 
      "El Gouna", 
      "Ain Sokhna", 
      "New Capital"
    ]
  }
}
```

### **Arabic Dictionary** (`src/dictionaries/ar.json`)

```json
{
  "buy_page": {
    "hero_title": "عقارات فاخرة للبيع في مصر",
    "hero_subtitle": "اكتشف منازل استثنائية في أرقى المواقع في مصر - من القاهرة الجديدة إلى الساحل الشمالي",
    "popular_locations": [
      "القاهرة الجديدة",
      "الشيخ زايد",
      "الساحل الشمالي",
      "الجونة",
      "عين السخنة",
      "العاصمة الإدارية الجديدة"
    ]
  }
}
```

---

## 🧪 **QUICK TESTING**

### **Test Currency Formatting:**

```typescript
import { formatPropertyPrice } from '@/lib/currency';

console.log(formatPropertyPrice(85000000));       // "EGP 85,000,000"
console.log(formatPropertyPrice(3200000));        // "EGP 3,200,000"
console.log(formatPropertyPrice(95000000));       // "EGP 95,000,000"

// With compact notation (for very large numbers)
console.log(formatPropertyPrice(85000000, 'EGP', { compact: true }));  // "EGP 85.0M"
```

### **Test in Component:**

```tsx
'use client';
import { formatPropertyPrice } from '@/lib/currency';

export default function TestPage() {
    const testPrices = [3200000, 15800000, 85000000];
    
    return (
        <div>
            {testPrices.map(price => (
                <div key={price}>
                    {formatPropertyPrice(price)}
                </div>
            ))}
        </div>
    );
}
```

---

## 📊 **EXPECTED OUTPUT**

### **Homepage:**

- Title bar: "MODON Evolutio | Personal Property Advisors in Egypt"
- Navbar: "MODON EVOLUTIO" with Building2 icon
- Hero: "PERSONAL PROPERTY ADVISORS FOR LUXURY HOMES"

### **/en/buy Page:**

- Title: "Luxury Properties for Sale in Egypt"
- Subtitle: "Discover extraordinary homes across Egypt's most prestigious locations..."
- Prices: "EGP 85,000,000", "EGP 32,000,000", etc.

### **/ar/buy Page:** (RTL)

- Title: "عقارات فاخرة للبيع في مصر"
- Prices: "EGP 85,000,000" (EGP shown in Latin, numbers in Western Arabic)

---

## 🎯 **VERIFICATION CHECKLIST**

After build:

- [ ] Check browser tab title = "MODON Evolutio | Personal Property Advisors in Egypt"
- [ ] Check navbar shows "MODON EVOLUTIO" with building icon
- [ ] Visit `/en/buy` → prices show "EGP X,XXX,XXX"
- [ ] Visit `/ar/buy` → layout is RTL, prices in EGP
- [ ] Run seed script → 15 Egyptian properties inserted
- [ ] All properties have +20 phone codes

---

**🇪🇬 Ready to dominate the Egyptian luxury market!**
