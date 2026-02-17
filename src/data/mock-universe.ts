/**
 * MOCK UNIVERSE - Complete Data Store
 * ====================================
 * Centralized, type-safe mock data for ALL entities
 * Used as fallback when Supabase is offline/empty
 * 
 * ENTITIES:
 * - Properties (20+ luxury listings)
 * - Agents (5+ professional profiles)
 * - Blog Posts (8+ SEO articles)
 * - Testimonials (6+ client reviews)
 * - Partners (10+ logos)
 * - Stats (company counters)
 * - FAQ (10+ Q&A)
 */

import type { PropertyListItem, PropertyImage, PropertyType, ListingType } from '@/types';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface MockAgent {
    id: string;
    name: string;
    nameAr: string;
    title: string;
    titleAr: string;
    bio: string;
    bioAr: string;
    avatar: string;
    phone: string;
    email: string;
    whatsapp: string;
    languages: string[];
    specializations: string[];
    yearsExperience: number;
    propertiesSold: number;
    rating: number;
    featured: boolean;
}

export interface MockBlogPost {
    id: string;
    slug: string;
    title: string;
    titleAr: string;
    excerpt: string;
    excerptAr: string;
    content: string;
    contentAr: string;
    author: string;
    authorAvatar: string;
    category: string;
    tags: string[];
    image: string;
    publishedAt: string;
    readTime: number;
    featured: boolean;
}

export interface MockTestimonial {
    id: string;
    name: string;
    nameAr: string;
    location: string;
    avatar: string;
    rating: number;
    review: string;
    reviewAr: string;
    propertyType: string;
    date: string;
}

export interface MockPartner {
    id: string;
    name: string;
    logo: string;
    category: 'bank' | 'developer' | 'insurance' | 'legal';
    website?: string;
}

export interface MockStats {
    yearsExperience: number;
    propertiesSold: number;
    happyClients: number;
    activeListings: number;
    citiesCovered: number;
    teamMembers: number;
}

export interface MockFAQ {
    id: string;
    question: string;
    questionAr: string;
    answer: string;
    answerAr: string;
    category: 'buying' | 'selling' | 'renting' | 'investment' | 'general';
}

// ============================================
// MOCK AGENTS (5+ Profiles)
// ============================================

export const MOCK_AGENTS: MockAgent[] = [
    {
        id: 'agent-001',
        name: 'Ahmed Al-Rashid',
        nameAr: 'أحمد الراشد',
        title: 'Senior Property Advisor',
        titleAr: 'مستشار عقاري أول',
        bio: 'With over 15 years of experience in Egypt\'s luxury real estate market, Ahmed specializes in premium properties across New Cairo and the North Coast. His deep understanding of market trends and commitment to client satisfaction has made him one of the most sought-after advisors in the region.',
        bioAr: 'مع أكثر من 15 عاماً من الخبرة في سوق العقارات الفاخرة في مصر، يتخصص أحمد في العقارات المميزة في القاهرة الجديدة والساحل الشمالي.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop&q=80',
        phone: '+20 100 123 4567',
        email: 'ahmed@modon.com',
        whatsapp: '+201001234567',
        languages: ['English', 'Arabic', 'French'],
        specializations: ['Luxury Villas', 'Penthouses', 'Waterfront Properties'],
        yearsExperience: 15,
        propertiesSold: 320,
        rating: 4.9,
        featured: true,
    },
    {
        id: 'agent-002',
        name: 'Sarah El-Masry',
        nameAr: 'سارة المصري',
        title: 'Head of Sales',
        titleAr: 'رئيسة قسم المبيعات',
        bio: 'Sarah leads our sales team with exceptional expertise in commercial and residential investments. Her background in finance combined with real estate knowledge provides clients with comprehensive investment guidance.',
        bioAr: 'تقود سارة فريق المبيعات لدينا بخبرة استثنائية في الاستثمارات التجارية والسكنية.',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&fit=crop&q=80',
        phone: '+20 100 234 5678',
        email: 'sarah@modon.com',
        whatsapp: '+201002345678',
        languages: ['English', 'Arabic'],
        specializations: ['Commercial Properties', 'Investment Advisory', 'New Developments'],
        yearsExperience: 12,
        propertiesSold: 280,
        rating: 4.8,
        featured: true,
    },
    {
        id: 'agent-003',
        name: 'Omar Hassan',
        nameAr: 'عمر حسن',
        title: 'Luxury Property Specialist',
        titleAr: 'متخصص العقارات الفاخرة',
        bio: 'Omar brings a unique perspective to luxury real estate with his architectural background. He excels at matching discerning clients with properties that reflect their lifestyle aspirations.',
        bioAr: 'يجلب عمر منظوراً فريداً للعقارات الفاخرة من خلال خلفيته المعمارية.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&fit=crop&q=80',
        phone: '+20 100 345 6789',
        email: 'omar@modon.com',
        whatsapp: '+201003456789',
        languages: ['English', 'Arabic', 'German'],
        specializations: ['Architectural Homes', 'Modern Design', 'Smart Homes'],
        yearsExperience: 10,
        propertiesSold: 195,
        rating: 4.9,
        featured: true,
    },
    {
        id: 'agent-004',
        name: 'Layla Mahmoud',
        nameAr: 'ليلى محمود',
        title: 'International Sales Director',
        titleAr: 'مديرة المبيعات الدولية',
        bio: 'Layla specializes in serving international clients looking to invest in Egyptian real estate. Her multilingual skills and cross-cultural expertise make her the go-to advisor for overseas buyers.',
        bioAr: 'تتخصص ليلى في خدمة العملاء الدوليين الذين يتطلعون للاستثمار في العقارات المصرية.',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&fit=crop&q=80',
        phone: '+20 100 456 7890',
        email: 'layla@modon.com',
        whatsapp: '+201004567890',
        languages: ['English', 'Arabic', 'Italian', 'Spanish'],
        specializations: ['International Buyers', 'Investment Properties', 'Relocation Services'],
        yearsExperience: 8,
        propertiesSold: 150,
        rating: 4.7,
        featured: false,
    },
    {
        id: 'agent-005',
        name: 'Karim Farouk',
        nameAr: 'كريم فاروق',
        title: 'Rental & Leasing Manager',
        titleAr: 'مدير التأجير',
        bio: 'Karim manages our rental portfolio with expertise in both short-term and long-term leasing. His attention to detail ensures seamless experiences for landlords and tenants alike.',
        bioAr: 'يدير كريم محفظة الإيجارات لدينا بخبرة في كل من التأجير قصير وطويل الأجل.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop&q=80',
        phone: '+20 100 567 8901',
        email: 'karim@modon.com',
        whatsapp: '+201005678901',
        languages: ['English', 'Arabic'],
        specializations: ['Rental Properties', 'Property Management', 'Corporate Housing'],
        yearsExperience: 6,
        propertiesSold: 85,
        rating: 4.8,
        featured: false,
    },
];

// ============================================
// MOCK BLOG POSTS (8+ SEO Articles)
// ============================================

export const MOCK_BLOG_POSTS: MockBlogPost[] = [
    {
        id: 'blog-001',
        slug: 'egypt-real-estate-investment-guide-2026',
        title: 'Egypt Real Estate Investment Guide 2026: Where Smart Money Is Heading',
        titleAr: 'دليل الاستثمار العقاري في مصر 2026: أين تتجه الأموال الذكية',
        excerpt: 'Discover the hottest investment opportunities in Egypt\'s booming property market. From the New Administrative Capital to North Coast developments, learn where savvy investors are placing their bets.',
        excerptAr: 'اكتشف أهم فرص الاستثمار في سوق العقارات المزدهر في مصر.',
        content: `<h2>Why Egypt\'s Real Estate Market Is Attracting Global Investors</h2>
<p>Egypt\'s real estate sector continues to demonstrate remarkable resilience and growth, making it one of the most attractive investment destinations in the Middle East and North Africa region. With GDP growth projections exceeding 5% and a population of over 100 million, the fundamentals for property investment remain strong.</p>

<h3>Top Investment Hotspots for 2026</h3>
<h4>1. New Administrative Capital</h4>
<p>The government\'s flagship project is now operational, with ministries relocated and residential communities thriving. Property values have appreciated 40% since launch, and further growth is anticipated as infrastructure expands.</p>

<h4>2. New Cairo & Fifth Settlement</h4>
<p>Established luxury communities continue to command premium prices. New projects by top developers offer both immediate rental returns and long-term capital appreciation.</p>

<h4>3. North Coast Developments</h4>
<p>The extension of the coastal highway has opened new areas for development. Year-round communities are emerging, transforming seasonal destinations into permanent residential options.</p>

<h3>Investment Strategies for Different Budgets</h3>
<ul>
<li><strong>Entry Level (500K-2M EGP):</strong> Studios and one-bedroom apartments in emerging areas</li>
<li><strong>Mid-Range (2M-8M EGP):</strong> Family apartments in established compounds</li>
<li><strong>Premium (8M-25M EGP):</strong> Villas and penthouses in prime locations</li>
<li><strong>Ultra-Luxury (25M+ EGP):</strong> Exclusive waterfront and landmark properties</li>
</ul>

<h3>Key Considerations for Foreign Investors</h3>
<p>Foreign nationals can purchase property in Egypt with minimal restrictions. Key benefits include competitive pricing compared to regional markets, strong rental yields (7-12% annually), and potential for significant capital appreciation.</p>`,
        contentAr: '<p>محتوى عربي...</p>',
        author: 'Ahmed Al-Rashid',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        category: 'Investment',
        tags: ['investment', 'egypt', 'real estate', '2026', 'guide'],
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&fit=crop&q=80',
        publishedAt: '2026-01-15',
        readTime: 8,
        featured: true,
    },
    {
        id: 'blog-002',
        slug: 'luxury-living-new-cairo-complete-guide',
        title: 'Luxury Living in New Cairo: The Complete Neighborhood Guide',
        titleAr: 'الحياة الفاخرة في القاهرة الجديدة: الدليل الشامل للأحياء',
        excerpt: 'From Fifth Settlement to Mostakbal City, explore the most prestigious neighborhoods in New Cairo. Compare amenities, prices, and lifestyle options in Egypt\'s premier residential destination.',
        excerptAr: 'من التجمع الخامس إلى مدينة المستقبل، استكشف أرقى الأحياء في القاهرة الجديدة.',
        content: `<h2>New Cairo: Egypt\'s Premier Residential Destination</h2>
<p>New Cairo has evolved from a suburban development to Egypt\'s most sought-after residential area. With world-class amenities, international schools, and modern infrastructure, it represents the pinnacle of contemporary Egyptian living.</p>

<h3>Fifth Settlement (التجمع الخامس)</h3>
<p>The heart of New Cairo, Fifth Settlement offers established communities with mature landscaping, comprehensive services, and excellent connectivity. Key compounds include:</p>
<ul>
<li><strong>Lake View:</strong> Golf course living with panoramic views</li>
<li><strong>Mivida:</strong> Contemporary design with smart home features</li>
<li><strong>Mountain View iCity:</strong> Technology-integrated lifestyle</li>
</ul>

<h3>Price Ranges by Area</h3>
<table>
<tr><th>Area</th><th>Apartment (per m²)</th><th>Villa (per m²)</th></tr>
<tr><td>Fifth Settlement Core</td><td>25,000-40,000 EGP</td><td>35,000-60,000 EGP</td></tr>
<tr><td>New Cairo Extensions</td><td>18,000-28,000 EGP</td><td>25,000-45,000 EGP</td></tr>
<tr><td>Mostakbal City</td><td>15,000-22,000 EGP</td><td>20,000-35,000 EGP</td></tr>
</table>`,
        contentAr: '<p>محتوى عربي...</p>',
        author: 'Sarah El-Masry',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
        category: 'Neighborhood Guide',
        tags: ['new cairo', 'luxury', 'neighborhoods', 'fifth settlement'],
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&fit=crop&q=80',
        publishedAt: '2026-01-10',
        readTime: 10,
        featured: true,
    },
    {
        id: 'blog-003',
        slug: 'north-coast-egypt-summer-2026-properties',
        title: 'North Coast 2026: Best Properties for Summer Living and Investment',
        titleAr: 'الساحل الشمالي 2026: أفضل العقارات للسكن الصيفي والاستثمار',
        excerpt: 'Explore the most exclusive beachfront developments on Egypt\'s Mediterranean coast. From Hacienda to Marassi, discover where to find your perfect summer escape.',
        excerptAr: 'استكشف أفخم المشاريع الشاطئية على ساحل البحر المتوسط في مصر.',
        content: `<h2>Egypt\'s Mediterranean Riviera</h2>
<p>The North Coast has transformed from a seasonal getaway to a year-round lifestyle destination. New developments offer world-class amenities, and improved infrastructure makes these properties accessible for permanent residence.</p>`,
        contentAr: '<p>محتوى عربي...</p>',
        author: 'Omar Hassan',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
        category: 'Destinations',
        tags: ['north coast', 'beachfront', 'summer', 'mediterranean'],
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&fit=crop&q=80',
        publishedAt: '2026-01-08',
        readTime: 7,
        featured: false,
    },
    {
        id: 'blog-004',
        slug: 'buying-property-egypt-foreigners-guide',
        title: 'Buying Property in Egypt as a Foreigner: Legal Guide & Process',
        titleAr: 'شراء العقارات في مصر للأجانب: الدليل القانوني والإجراءات',
        excerpt: 'Everything international buyers need to know about purchasing real estate in Egypt. From legal requirements to payment terms, this comprehensive guide covers all essential steps.',
        excerptAr: 'كل ما يحتاج المشترون الدوليون معرفته حول شراء العقارات في مصر.',
        content: `<h2>International Property Ownership in Egypt</h2>
<p>Egypt welcomes foreign property investors with relatively straightforward regulations. This guide covers everything you need to navigate the purchase process successfully.</p>`,
        contentAr: '<p>محتوى عربي...</p>',
        author: 'Layla Mahmoud',
        authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
        category: 'Legal & Finance',
        tags: ['foreigners', 'legal', 'buying guide', 'international'],
        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&fit=crop&q=80',
        publishedAt: '2026-01-05',
        readTime: 12,
        featured: true,
    },
    {
        id: 'blog-005',
        slug: 'smart-home-technology-egyptian-properties',
        title: 'Smart Home Technology in Egyptian Properties: The Future is Here',
        titleAr: 'تقنيات المنزل الذكي في العقارات المصرية: المستقبل هنا',
        excerpt: 'Discover how leading developers are integrating IoT, automation, and AI into new residential projects. Learn what smart features add the most value to your property.',
        excerptAr: 'اكتشف كيف يدمج المطورون الرائدون تقنيات إنترنت الأشياء والأتمتة في المشاريع السكنية الجديدة.',
        content: `<h2>The Smart Home Revolution in Egypt</h2>
<p>Egyptian developers are rapidly adopting smart home technology to meet growing demand from tech-savvy buyers.</p>`,
        contentAr: '<p>محتوى عربي...</p>',
        author: 'Omar Hassan',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
        category: 'Technology',
        tags: ['smart home', 'technology', 'automation', 'IoT'],
        image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=1200&fit=crop&q=80',
        publishedAt: '2026-01-02',
        readTime: 6,
        featured: false,
    },
    {
        id: 'blog-006',
        slug: 'rental-yields-egypt-2026-analysis',
        title: 'Rental Yields in Egypt 2026: Neighborhood-by-Neighborhood Analysis',
        titleAr: 'عوائد الإيجار في مصر 2026: تحليل حي بحي',
        excerpt: 'Data-driven analysis of rental returns across Cairo, Alexandria, and coastal areas. Find out which neighborhoods offer the best balance of yield and appreciation.',
        excerptAr: 'تحليل مبني على البيانات لعوائد الإيجار عبر القاهرة والإسكندرية والمناطق الساحلية.',
        content: `<h2>Maximizing Rental Returns in Egypt</h2>
<p>Understanding rental yields is crucial for property investors. This analysis breaks down returns by location and property type.</p>`,
        contentAr: '<p>محتوى عربي...</p>',
        author: 'Sarah El-Masry',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
        category: 'Investment',
        tags: ['rental', 'yields', 'analysis', 'investment'],
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&fit=crop&q=80',
        publishedAt: '2025-12-28',
        readTime: 9,
        featured: false,
    },
    {
        id: 'blog-007',
        slug: 'new-administrative-capital-living-guide',
        title: 'Living in the New Administrative Capital: What to Expect in 2026',
        titleAr: 'العيش في العاصمة الإدارية الجديدة: ماذا تتوقع في 2026',
        excerpt: 'The New Administrative Capital is now home to thousands of residents. Discover life in Egypt\'s newest city, from daily amenities to investment opportunities.',
        excerptAr: 'العاصمة الإدارية الجديدة هي الآن موطن لآلاف السكان. اكتشف الحياة في أحدث مدينة في مصر.',
        content: `<h2>Egypt\'s City of the Future</h2>
<p>The New Administrative Capital represents Egypt\'s most ambitious urban development project. Here\'s what life is really like for early residents.</p>`,
        contentAr: '<p>محتوى عربي...</p>',
        author: 'Ahmed Al-Rashid',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        category: 'Neighborhood Guide',
        tags: ['new capital', 'living', 'development', 'urban'],
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&fit=crop&q=80',
        publishedAt: '2025-12-20',
        readTime: 8,
        featured: false,
    },
    {
        id: 'blog-008',
        slug: 'luxury-property-interior-design-trends-2026',
        title: 'Luxury Property Interior Design Trends Dominating Egypt in 2026',
        titleAr: 'اتجاهات التصميم الداخلي للعقارات الفاخرة المهيمنة في مصر 2026',
        excerpt: 'From earthy minimalism to bold statement pieces, explore the interior design trends shaping Egypt\'s most exclusive homes this year.',
        excerptAr: 'من البساطة الترابية إلى القطع الجريئة، استكشف اتجاهات التصميم الداخلي التي تشكل أفخم المنازل في مصر.',
        content: `<h2>Design Excellence in Egyptian Luxury Homes</h2>
<p>Egypt\'s high-end real estate market is embracing sophisticated design trends that blend international aesthetics with local craftsmanship.</p>`,
        contentAr: '<p>محتوى عربي...</p>',
        author: 'Layla Mahmoud',
        authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
        category: 'Design',
        tags: ['interior design', 'luxury', 'trends', '2026'],
        image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&fit=crop&q=80',
        publishedAt: '2025-12-15',
        readTime: 5,
        featured: false,
    },
];

// ============================================
// MOCK TESTIMONIALS (6+ Reviews)
// ============================================

export const MOCK_TESTIMONIALS: MockTestimonial[] = [
    {
        id: 'testimonial-001',
        name: 'Dr. Michael Thompson',
        nameAr: 'د. مايكل طومسون',
        location: 'London, UK',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&fit=crop&q=80',
        rating: 5,
        review: 'MODON made my investment in Egyptian real estate seamless. From property selection to legal completion, their team handled everything professionally. The villa I purchased in New Cairo has already appreciated 25% in value.',
        reviewAr: 'جعل موطن استثماري في العقارات المصرية سلساً. من اختيار العقار إلى الانتهاء القانوني، تعامل فريقهم مع كل شيء بشكل احترافي.',
        propertyType: 'Villa',
        date: '2025-12-10',
    },
    {
        id: 'testimonial-002',
        name: 'Fatima Al-Saud',
        nameAr: 'فاطمة آل سعود',
        location: 'Riyadh, Saudi Arabia',
        avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=200&fit=crop&q=80',
        rating: 5,
        review: 'I was looking for a summer home on the North Coast and MODON delivered exactly what I wanted. Their understanding of luxury properties and attention to my specific requirements was exceptional.',
        reviewAr: 'كنت أبحث عن منزل صيفي على الساحل الشمالي وقدم موطن بالضبط ما أردته.',
        propertyType: 'Beach Villa',
        date: '2025-11-28',
    },
    {
        id: 'testimonial-003',
        name: 'Ahmed & Nour Zaki',
        nameAr: 'أحمد ونور زكي',
        location: 'Cairo, Egypt',
        avatar: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=200&fit=crop&q=80',
        rating: 5,
        review: 'As first-time homebuyers, we were nervous about the process. Our agent at MODON guided us through every step, from mortgage options to final walkthrough. We found our dream apartment in Fifth Settlement!',
        reviewAr: 'كمشترين لأول مرة، كنا متوترين بشأن العملية. وجهنا الوكيل في موطن خلال كل خطوة.',
        propertyType: 'Apartment',
        date: '2025-11-15',
    },
    {
        id: 'testimonial-004',
        name: 'James Chen',
        nameAr: 'جيمس تشين',
        location: 'Singapore',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&fit=crop&q=80',
        rating: 4,
        review: 'Managing an investment property from overseas seemed daunting, but MODON\'s rental management service has been excellent. Regular updates, prompt maintenance, and consistent returns.',
        reviewAr: 'بدت إدارة عقار استثماري من الخارج مخيفة، لكن خدمة إدارة الإيجارات من موطن كانت ممتازة.',
        propertyType: 'Investment Apartment',
        date: '2025-10-20',
    },
    {
        id: 'testimonial-005',
        name: 'Maria Gonzalez',
        nameAr: 'ماريا جونزاليس',
        location: 'Madrid, Spain',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&fit=crop&q=80',
        rating: 5,
        review: 'I relocated to Egypt for work and needed a furnished rental quickly. MODON found me a stunning penthouse in Zamalek within a week. The multilingual support made everything easy.',
        reviewAr: 'انتقلت إلى مصر للعمل واحتجت إلى إيجار مفروش بسرعة. وجد لي موطن بنتهاوس مذهل في الزمالك خلال أسبوع.',
        propertyType: 'Penthouse',
        date: '2025-10-05',
    },
    {
        id: 'testimonial-006',
        name: 'Hassan & Amira Khalil',
        nameAr: 'حسن وأميرة خليل',
        location: 'Alexandria, Egypt',
        avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&fit=crop&q=80',
        rating: 5,
        review: 'We sold our family home through MODON and bought a larger villa in the same compound. They managed the entire transition beautifully. Highly recommend their end-to-end service!',
        reviewAr: 'بعنا منزل عائلتنا من خلال موطن واشترينا فيلا أكبر في نفس الكمبوند. أداروا الانتقال بالكامل بشكل جميل.',
        propertyType: 'Villa',
        date: '2025-09-22',
    },
];

// ============================================
// MOCK PARTNERS (10+ Logos)
// ============================================

export const MOCK_PARTNERS: MockPartner[] = [
    { id: 'partner-001', name: 'National Bank of Egypt', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/National_Bank_of_Egypt_logo.svg/200px-National_Bank_of_Egypt_logo.svg.png', category: 'bank' },
    { id: 'partner-002', name: 'CIB Egypt', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Commercial_International_Bank_Egypt_Logo.svg/200px-Commercial_International_Bank_Egypt_Logo.svg.png', category: 'bank' },
    { id: 'partner-003', name: 'Banque Misr', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Banque_Misr_Logo.svg/200px-Banque_Misr_Logo.svg.png', category: 'bank' },
    { id: 'partner-004', name: 'SODIC', logo: 'https://cdn.worldvectorlogo.com/logos/sodic.svg', category: 'developer' },
    { id: 'partner-005', name: 'Palm Hills Developments', logo: 'https://cdn.worldvectorlogo.com/logos/palm-hills-developments.svg', category: 'developer' },
    { id: 'partner-006', name: 'Emaar Misr', logo: 'https://cdn.worldvectorlogo.com/logos/emaar-2.svg', category: 'developer' },
    { id: 'partner-007', name: 'Orascom Development', logo: 'https://cdn.worldvectorlogo.com/logos/orascom.svg', category: 'developer' },
    { id: 'partner-008', name: 'Mountain View', logo: 'https://cdn.worldvectorlogo.com/logos/mountain-view-1.svg', category: 'developer' },
    { id: 'partner-009', name: 'AXA Insurance Egypt', logo: 'https://cdn.worldvectorlogo.com/logos/axa-4.svg', category: 'insurance' },
    { id: 'partner-010', name: 'Allianz Egypt', logo: 'https://cdn.worldvectorlogo.com/logos/allianz-logo.svg', category: 'insurance' },
];

// ============================================
// MOCK STATS
// ============================================

export const MOCK_STATS: MockStats = {
    yearsExperience: 15,
    propertiesSold: 2500,
    happyClients: 3200,
    activeListings: 850,
    citiesCovered: 12,
    teamMembers: 45,
};

// ============================================
// MOCK FAQ (10+ Q&A)
// ============================================

export const MOCK_FAQ: MockFAQ[] = [
    {
        id: 'faq-001',
        question: 'What documents do I need to buy property in Egypt?',
        questionAr: 'ما هي المستندات التي أحتاجها لشراء عقار في مصر؟',
        answer: 'For Egyptian nationals, you need a valid national ID, tax card, and proof of income. Foreign buyers require a valid passport, proof of funds, and in some cases, security clearance for properties in certain areas. Our team handles all documentation to ensure a smooth process.',
        answerAr: 'للمواطنين المصريين، تحتاج بطاقة هوية وطنية سارية وبطاقة ضريبية وإثبات دخل. يحتاج المشترون الأجانب جواز سفر ساري وإثبات أموال.',
        category: 'buying',
    },
    {
        id: 'faq-002',
        question: 'Can foreigners buy property in Egypt?',
        questionAr: 'هل يمكن للأجانب شراء عقارات في مصر؟',
        answer: 'Yes, foreigners can buy property in Egypt with minimal restrictions. Non-Egyptians can own up to two properties for residential purposes. Some areas near borders or military installations may require additional security clearance. We specialize in guiding international buyers through this process.',
        answerAr: 'نعم، يمكن للأجانب شراء عقارات في مصر مع قيود بسيطة. يمكن لغير المصريين امتلاك ما يصل إلى عقارين لأغراض سكنية.',
        category: 'buying',
    },
    {
        id: 'faq-003',
        question: 'What are the typical costs beyond the property price?',
        questionAr: 'ما هي التكاليف النموذجية بخلاف سعر العقار؟',
        answer: 'Additional costs typically include: Registration fees (3% of property value), legal fees (1-2%), stamp duty (0.5%), and real estate agent commission (2.5%). For new properties, there may also be club membership and maintenance deposit fees. We provide a detailed cost breakdown for every property.',
        answerAr: 'تشمل التكاليف الإضافية عادةً: رسوم التسجيل (3٪ من قيمة العقار)، رسوم قانونية (1-2٪)، رسوم الدمغة (0.5٪)، وعمولة الوكيل العقاري (2.5٪).',
        category: 'buying',
    },
    {
        id: 'faq-004',
        question: 'How long does the property buying process take?',
        questionAr: 'كم تستغرق عملية شراء العقار؟',
        answer: 'For ready properties, the process typically takes 4-8 weeks from initial offer to key handover. This includes due diligence, contract negotiation, and registration. Off-plan properties have varied timelines depending on construction phases.',
        answerAr: 'بالنسبة للعقارات الجاهزة، تستغرق العملية عادةً 4-8 أسابيع من العرض الأولي إلى تسليم المفاتيح.',
        category: 'buying',
    },
    {
        id: 'faq-005',
        question: 'What is the process for selling my property through MODON?',
        questionAr: 'ما هي عملية بيع عقاري من خلال موطن؟',
        answer: 'Our selling process includes: Free property valuation, professional photography and marketing, verified buyer screenings, negotiation support, and complete legal assistance until closing. We charge a competitive 2.5% commission on successful sales.',
        answerAr: 'تشمل عملية البيع لدينا: تقييم مجاني للعقار، تصوير احترافي وتسويق، فحص المشترين المعتمدين، دعم التفاوض، ومساعدة قانونية كاملة حتى الإغلاق.',
        category: 'selling',
    },
    {
        id: 'faq-006',
        question: 'Do you offer property management services for rentals?',
        questionAr: 'هل تقدمون خدمات إدارة العقارات للإيجارات؟',
        answer: 'Yes, we offer comprehensive property management including tenant sourcing, rent collection, maintenance coordination, and regular property inspections. Our management fee is 8% of monthly rent for long-term leases and 15% for short-term/vacation rentals.',
        answerAr: 'نعم، نقدم إدارة عقارات شاملة تشمل البحث عن مستأجرين، تحصيل الإيجار، تنسيق الصيانة، وفحوصات العقار المنتظمة.',
        category: 'renting',
    },
    {
        id: 'faq-007',
        question: 'What rental yields can I expect in Egypt?',
        questionAr: 'ما هي عوائد الإيجار المتوقعة في مصر؟',
        answer: 'Rental yields vary by location and property type. Premium areas like New Cairo average 7-9% annually, while coastal properties can achieve 10-15% during peak seasons. Commercial properties in business districts often yield 9-12%. We provide detailed yield projections for every investment property.',
        answerAr: 'تختلف عوائد الإيجار حسب الموقع ونوع العقار. تحقق المناطق المميزة مثل القاهرة الجديدة 7-9٪ سنوياً.',
        category: 'investment',
    },
    {
        id: 'faq-008',
        question: 'Are mortgage financing options available?',
        questionAr: 'هل تتوفر خيارات التمويل العقاري؟',
        answer: 'Yes, several Egyptian banks offer mortgage financing. Egyptian nationals can typically finance up to 80% of property value with terms up to 20 years. Expats and foreign residents may qualify for financing up to 60%. We partner with major banks to help secure competitive rates.',
        answerAr: 'نعم، تقدم العديد من البنوك المصرية التمويل العقاري. يمكن للمواطنين المصريين عادةً تمويل ما يصل إلى 80٪ من قيمة العقار.',
        category: 'buying',
    },
    {
        id: 'faq-009',
        question: 'How do you verify property ownership and legal status?',
        questionAr: 'كيف تتحققون من ملكية العقار والوضع القانوني؟',
        answer: 'We conduct thorough due diligence including title deed verification, encumbrance checks, developer license verification, and building permit review. Our legal team ensures every property we list has clear ownership and no outstanding issues.',
        answerAr: 'نجري العناية الواجبة الشاملة بما في ذلك التحقق من سند الملكية، فحوصات الأعباء، التحقق من ترخيص المطور، ومراجعة تصريح البناء.',
        category: 'general',
    },
    {
        id: 'faq-010',
        question: 'Can I schedule a property viewing online?',
        questionAr: 'هل يمكنني جدولة معاينة عقار عبر الإنترنت؟',
        answer: 'Absolutely! You can schedule viewings through our website, WhatsApp, or by calling our team. We also offer virtual tours for international clients. For in-person viewings, we arrange transportation and can show multiple properties in a single visit.',
        answerAr: 'بالتأكيد! يمكنك جدولة المعاينات من خلال موقعنا أو واتساب أو بالاتصال بفريقنا. نقدم أيضاً جولات افتراضية للعملاء الدوليين.',
        category: 'general',
    },
];

// ============================================
// EXTENDED MOCK PROPERTIES (20+ Listings)
// ============================================

export const MOCK_PROPERTIES_EXTENDED: PropertyListItem[] = [
    // Re-export from mock-properties.ts and add more
    {
        id: 'mock-ext-001',
        slug: 'exclusive-compound-villa-madinaty',
        title: 'Exclusive Compound Villa with Private Garden in Madinaty',
        location: { city: 'Madinaty', country: 'Egypt' },
        price: { amount: 28500000, currency: 'EGP' },
        specs: { bedrooms: 5, bathrooms: 5, livingAreaSqm: 520 },
        images: [
            { id: 'ext-001-1', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&fit=crop&q=80', alt: 'Modern villa exterior', isPrimary: true, order: 0 },
            { id: 'ext-001-2', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&fit=crop&q=80', alt: 'Villa pool area', isPrimary: false, order: 1 },
        ],
        type: 'villa',
        listingType: 'sale',
        featured: true,
    },
    {
        id: 'mock-ext-002',
        slug: 'skyline-penthouse-zamalek',
        title: 'Skyline Penthouse with Nile Views in Zamalek',
        location: { city: 'Zamalek', country: 'Egypt' },
        price: { amount: 45000000, currency: 'EGP' },
        specs: { bedrooms: 4, bathrooms: 4, livingAreaSqm: 380 },
        images: [
            { id: 'ext-002-1', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&fit=crop&q=80', alt: 'Penthouse living room', isPrimary: true, order: 0 },
        ],
        type: 'penthouse',
        listingType: 'sale',
        featured: true,
    },
    {
        id: 'mock-ext-003',
        slug: 'modern-apartment-sodic-east',
        title: 'Modern 3BR Apartment in SODIC East',
        location: { city: 'New Heliopolis', country: 'Egypt' },
        price: { amount: 8500000, currency: 'EGP' },
        specs: { bedrooms: 3, bathrooms: 2, livingAreaSqm: 185 },
        images: [
            { id: 'ext-003-1', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&fit=crop&q=80', alt: 'Modern apartment', isPrimary: true, order: 0 },
        ],
        type: 'apartment',
        listingType: 'sale',
        featured: false,
    },
    {
        id: 'mock-ext-004',
        slug: 'beachfront-chalet-ain-sokhna',
        title: 'Beachfront Chalet in Ain Sokhna Resort',
        location: { city: 'Ain Sokhna', country: 'Egypt' },
        price: { amount: 4200000, currency: 'EGP' },
        specs: { bedrooms: 2, bathrooms: 2, livingAreaSqm: 120 },
        images: [
            { id: 'ext-004-1', url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&fit=crop&q=80', alt: 'Beach chalet', isPrimary: true, order: 0 },
        ],
        type: 'apartment',
        listingType: 'sale',
        featured: false,
    },
    {
        id: 'mock-ext-005',
        slug: 'luxury-duplex-beverly-hills',
        title: 'Luxury Duplex in Beverly Hills Sheikh Zayed',
        location: { city: 'Sheikh Zayed', country: 'Egypt' },
        price: { amount: 22000000, currency: 'EGP' },
        specs: { bedrooms: 4, bathrooms: 4, livingAreaSqm: 350 },
        images: [
            { id: 'ext-005-1', url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&fit=crop&q=80', alt: 'Luxury duplex', isPrimary: true, order: 0 },
        ],
        type: 'duplex',
        listingType: 'sale',
        featured: true,
    },
    {
        id: 'mock-ext-006',
        slug: 'rental-studio-downtown-cairo',
        title: 'Furnished Studio in Downtown Cairo',
        location: { city: 'Downtown Cairo', country: 'Egypt' },
        price: { amount: 18000, currency: 'EGP' },
        specs: { bedrooms: 0, bathrooms: 1, livingAreaSqm: 55 },
        images: [
            { id: 'ext-006-1', url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&fit=crop&q=80', alt: 'Downtown studio', isPrimary: true, order: 0 },
        ],
        type: 'apartment',
        listingType: 'rent',
        featured: false,
    },
    {
        id: 'mock-ext-007',
        slug: 'family-villa-mivida-new-cairo',
        title: 'Spacious Family Villa in Mivida New Cairo',
        location: { city: 'New Cairo', country: 'Egypt' },
        price: { amount: 35000000, currency: 'EGP' },
        specs: { bedrooms: 6, bathrooms: 6, livingAreaSqm: 650 },
        images: [
            { id: 'ext-007-1', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&fit=crop&q=80', alt: 'Family villa', isPrimary: true, order: 0 },
        ],
        type: 'villa',
        listingType: 'sale',
        featured: true,
    },
    {
        id: 'mock-ext-008',
        slug: 'commercial-office-smart-village',
        title: 'Premium Office Space in Smart Village',
        location: { city: 'Smart Village', country: 'Egypt' },
        price: { amount: 5500000, currency: 'EGP' },
        specs: { bedrooms: 0, bathrooms: 2, livingAreaSqm: 200 },
        images: [
            { id: 'ext-008-1', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&fit=crop&q=80', alt: 'Office space', isPrimary: true, order: 0 },
        ],
        type: 'office',
        listingType: 'sale',
        featured: false,
    },
    {
        id: 'mock-ext-009',
        slug: 'furnished-rental-marassi-north-coast',
        title: 'Furnished 3BR in Marassi North Coast',
        location: { city: 'North Coast', country: 'Egypt' },
        price: { amount: 150000, currency: 'EGP' },
        specs: { bedrooms: 3, bathrooms: 3, livingAreaSqm: 180 },
        images: [
            { id: 'ext-009-1', url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&fit=crop&q=80', alt: 'Marassi apartment', isPrimary: true, order: 0 },
        ],
        type: 'apartment',
        listingType: 'rent',
        featured: false,
    },
    {
        id: 'mock-ext-010',
        slug: 'townhouse-palm-hills-october',
        title: 'Corner Townhouse in Palm Hills October',
        location: { city: '6th October', country: 'Egypt' },
        price: { amount: 16500000, currency: 'EGP' },
        specs: { bedrooms: 4, bathrooms: 3, livingAreaSqm: 280 },
        images: [
            { id: 'ext-010-1', url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&fit=crop&q=80', alt: 'Townhouse exterior', isPrimary: true, order: 0 },
        ],
        type: 'townhouse',
        listingType: 'sale',
        featured: false,
    },
    {
        id: 'mock-ext-011',
        slug: 'garden-apartment-lake-view-new-cairo',
        title: 'Ground Floor with Garden in Lake View New Cairo',
        location: { city: 'New Cairo', country: 'Egypt' },
        price: { amount: 14200000, currency: 'EGP' },
        specs: { bedrooms: 3, bathrooms: 3, livingAreaSqm: 220 },
        images: [
            { id: 'ext-011-1', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&fit=crop&q=80', alt: 'Garden apartment', isPrimary: true, order: 0 },
        ],
        type: 'apartment',
        listingType: 'sale',
        featured: false,
    },
    {
        id: 'mock-ext-012',
        slug: 'investment-building-mohandessin',
        title: 'Investment Building in Mohandessin',
        location: { city: 'Mohandessin', country: 'Egypt' },
        price: { amount: 85000000, currency: 'EGP' },
        specs: { bedrooms: 12, bathrooms: 12, livingAreaSqm: 1200 },
        images: [
            { id: 'ext-012-1', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&fit=crop&q=80', alt: 'Investment building', isPrimary: true, order: 0 },
        ],
        type: 'commercial',
        listingType: 'sale',
        featured: false,
    },
];

// ============================================
// GENERIC FALLBACK PROPERTY
// ============================================

export const GENERIC_MOCK_PROPERTY: PropertyListItem = {
    id: '00000000-0000-0000-0000-000000000001',
    slug: 'featured-luxury-property',
    title: 'Featured Luxury Property - Demo Mode',
    location: { city: 'Cairo', country: 'Egypt' },
    price: { amount: 15000000, currency: 'EGP' },
    specs: { bedrooms: 4, bathrooms: 3, livingAreaSqm: 300 },
    images: [
        { id: 'generic-1', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&fit=crop&q=80', alt: 'Featured property', isPrimary: true, order: 0 },
        { id: 'generic-2', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&fit=crop&q=80', alt: 'Property pool', isPrimary: false, order: 1 },
        { id: 'generic-3', url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&fit=crop&q=80', alt: 'Property interior', isPrimary: false, order: 2 },
    ],
    type: 'villa',
    listingType: 'sale',
    featured: true,
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getAgentById(id: string): MockAgent | undefined {
    return MOCK_AGENTS.find(agent => agent.id === id);
}

export function getFeaturedAgents(): MockAgent[] {
    return MOCK_AGENTS.filter(agent => agent.featured);
}

export function getBlogBySlug(slug: string): MockBlogPost | undefined {
    return MOCK_BLOG_POSTS.find(post => post.slug === slug);
}

export function getFeaturedBlogPosts(): MockBlogPost[] {
    return MOCK_BLOG_POSTS.filter(post => post.featured);
}

export function getBlogsByCategory(category: string): MockBlogPost[] {
    return MOCK_BLOG_POSTS.filter(post => post.category.toLowerCase() === category.toLowerCase());
}

export function getPropertyBySlug(slug: string): PropertyListItem | undefined {
    return MOCK_PROPERTIES_EXTENDED.find(prop => prop.slug === slug);
}

export function getFeaturedProperties(): PropertyListItem[] {
    return MOCK_PROPERTIES_EXTENDED.filter(prop => prop.featured);
}

