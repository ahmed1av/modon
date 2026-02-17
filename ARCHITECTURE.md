# 🏛️ MODON Platform Architecture

## CoreX + DiscoverX + Antigravity Integration

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architectural Layers](#architectural-layers)
3. [Folder Structure](#folder-structure)
4. [CoreX - Clean Architecture](#corex---clean-architecture)
5. [DiscoverX - Microservices](#discoverx---microservices)
6. [Antigravity - Frontend Framework](#antigravity---frontend-framework)
7. [Security Architecture](#security-architecture)
8. [Data Flow](#data-flow)
9. [Technology Stack](#technology-stack)

---

## Overview

MODON Platform is a luxury real estate platform built as a pixel-perfect clone of Baerz.com. It combines three powerful architectural patterns:

- **CoreX**: Clean Architecture for business logic isolation
- **DiscoverX**: Microservices orchestration and service discovery
- **Antigravity**: Premium frontend with Next.js and Baerz aesthetics

```
┌─────────────────────────────────────────────────────────────────┐
│                    MODON PLATFORM ARCHITECTURE                   │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   ANTIGRAVITY LAYER                      │    │
│  │   (Next.js App Router, React Components, CSS Modules)   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              ↓                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   DISCOVERX GATEWAY                      │    │
│  │   (API Gateway, Rate Limiting, DDoS, Auth, Routing)     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              ↓                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                     COREX LAYERS                         │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐    │    │
│  │  │  Contracts  │ │ Application │ │   Core/Domain   │    │    │
│  │  │  (DTOs,API) │ │ (Use Cases) │ │   (Entities)    │    │    │
│  │  └─────────────┘ └─────────────┘ └─────────────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              ↓                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  DATA ACCESS LAYER                       │    │
│  │   (Repositories, Supabase, MongoDB, External APIs)      │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Architectural Layers

### 1. Presentation Layer (Antigravity)

- Next.js 14+ App Router
- React Server Components
- CSS Modules with Baerz Design System
- Responsive, RTL-ready UI

### 2. API Gateway Layer (DiscoverX)

- Request routing and load balancing
- Rate limiting (Token Bucket + Sliding Window)
- DDoS protection with auto-blocking
- JWT authentication
- Security headers (CSP, HSTS, etc.)

### 3. Application Layer (CoreX)

- Use Cases / Interactors
- Input validation (Zod schemas)
- Business workflow orchestration
- DTO transformations

### 4. Domain Layer (CoreX)

- Pure business entities
- Business rules and validation
- No external dependencies
- Domain events

### 5. Data Access Layer

- Repository interfaces
- Database implementations
- External API integrations
- Caching strategies

---

## Folder Structure

```
MODON DEVELOPMENT/
├── ARCHITECTURE.md              # This file
├── SECURITY.md                  # Security manifest
├── package.json
├── next.config.js
├── tailwind.config.js
│
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── page.tsx             # Homepage
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.module.css      # Page styles
│   │   │
│   │   ├── components/          # React Components
│   │   │   ├── navigation/
│   │   │   │   ├── Header.tsx
│   │   │   │   └── header.module.css
│   │   │   ├── Hero.tsx
│   │   │   ├── hero.module.css
│   │   │   ├── Footer.tsx
│   │   │   ├── footer.module.css
│   │   │   └── property/
│   │   │       ├── PropertyCard.tsx
│   │   │       ├── property.module.css
│   │   │       ├── FilterBar.tsx
│   │   │       └── filterbar.module.css
│   │   │
│   │   └── api/                 # API Routes
│   │       └── handlers/        # Route handlers
│   │
│   ├── core/                    # CoreX Domain Layer
│   │   ├── entities/
│   │   │   ├── Property.ts      # Property entity
│   │   │   └── User.ts          # User entity
│   │   ├── services/
│   │   │   └── ValuationService.ts
│   │   └── validators/
│   │       └── PropertyValidator.ts
│   │
│   ├── application/             # CoreX Application Layer
│   │   ├── properties/
│   │   │   ├── GetPropertiesUseCase.ts
│   │   │   ├── CreatePropertyUseCase.ts
│   │   │   └── UpdatePropertyUseCase.ts
│   │   ├── users/
│   │   │   └── GetUserUseCase.ts
│   │   └── auth/
│   │       └── AuthenticateUseCase.ts
│   │
│   ├── contracts/               # Shared Contracts
│   │   ├── schemas/
│   │   │   └── index.ts         # Zod validation schemas
│   │   └── dto/
│   │       └── PropertyDTO.ts
│   │
│   ├── dal/                     # Data Access Layer
│   │   ├── interfaces/
│   │   │   └── index.ts         # Repository interfaces
│   │   └── repositories/
│   │       ├── PropertyRepository.ts
│   │       └── UserRepository.ts
│   │
│   ├── discoverx/               # DiscoverX Architecture
│   │   ├── registry/
│   │   │   └── ServiceRegistry.ts  # Service discovery
│   │   ├── gateway/
│   │   │   ├── APIGateway.ts       # API Gateway
│   │   │   └── rateLimit.ts        # Rate limiting
│   │   └── monitoring/
│   │       └── logging.ts          # Security logging
│   │
│   ├── server/                  # Server-side utilities
│   │   ├── auth/
│   │   │   ├── jwt.ts           # JWT authentication
│   │   │   └── session.ts       # Session management
│   │   └── security/
│   │       ├── headers.ts       # Security headers
│   │       ├── sanitizer.ts     # Input sanitization
│   │       └── encryption.ts    # Data encryption
│   │
│   ├── lib/                     # Shared utilities
│   │   ├── i18n/
│   │   │   └── index.ts         # Internationalization
│   │   ├── currency/
│   │   │   └── index.ts         # Currency formatting
│   │   ├── seo/
│   │   │   └── index.ts         # SEO utilities
│   │   └── maps/
│   │       └── index.ts         # Map integrations
│   │
│   └── styles/                  # Global styles
│       ├── globals.css          # CSS variables & resets
│       └── baerzTheme.ts        # Design tokens
│
└── public/                      # Static assets
    ├── images/
    ├── videos/
    └── fonts/
```

---

## CoreX - Clean Architecture

### Domain Entities

Pure TypeScript classes with no external dependencies:

```typescript
// src/core/entities/Property.ts
export interface Property {
    id: string;
    slug: string;
    title: string;
    description: string;
    type: PropertyType;
    listingType: ListingType;
    status: PropertyStatus;
    location: PropertyLocation;
    specs: PropertySpecs;
    price: PropertyPrice;
    images: PropertyImage[];
    features: PropertyFeature[];
    agentId: string;
    // ... timestamps and analytics
}

// Business rules as pure functions
export function canPublish(property: Property): boolean {
    return (
        property.status === 'draft' &&
        property.title.length > 0 &&
        property.description.length >= 100 &&
        property.images.length >= 3 &&
        property.price.amount > 0
    );
}
```

### Use Cases

Orchestrate business logic:

```typescript
// src/application/properties/GetPropertiesUseCase.ts
export class GetPropertiesUseCase {
    constructor(private readonly propertyRepository: IPropertyRepository) {}
    
    async execute(input: GetPropertiesInput): Promise<GetPropertiesOutput> {
        // 1. Validate input using Zod schema
        const validatedInput = PropertySearchSchema.parse(input);
        
        // 2. Build search criteria
        const criteria = buildSearchCriteria(validatedInput);
        
        // 3. Execute repository query
        const result = await this.propertyRepository.findAll(criteria);
        
        // 4. Return formatted output
        return formatOutput(result);
    }
}
```

### Repository Interfaces

Contracts for data access:

```typescript
// src/dal/interfaces/index.ts
export interface IPropertyRepository {
    findById(id: string): Promise<Property | null>;
    findBySlug(slug: string): Promise<Property | null>;
    findAll(criteria?: PropertySearchCriteria): Promise<PaginatedResult<Property>>;
    create(property: CreateProperty): Promise<Property>;
    update(id: string, data: Partial<Property>): Promise<Property>;
    delete(id: string): Promise<void>;
    // ... specialized queries
}
```

---

## DiscoverX - Microservices

### Service Registry

```typescript
// src/discoverx/registry/ServiceRegistry.ts
class ServiceRegistry {
    register(config: ServiceConfig): ServiceInstance;
    deregister(serviceId: string): boolean;
    discover(serviceName: string): ServiceInstance[];
    getInstance(serviceName: string): ServiceInstance | null;
    getServiceUrl(serviceName: string, path: string): string | null;
}

// Pre-configured clients
export const propertyService = new ServiceClient({ serviceName: 'property-service' });
export const userService = new ServiceClient({ serviceName: 'user-service' });
```

### API Gateway

```typescript
// src/discoverx/gateway/APIGateway.ts
export class APIGateway {
    async handle(request: NextRequest): Promise<NextResponse> {
        // 1. DDoS Protection
        // 2. Route matching
        // 3. Rate limiting
        // 4. Authentication
        // 5. Authorization
        // 6. Route to service or local handler
        // 7. Apply security headers
    }
}
```

### Rate Limiting

- Token Bucket algorithm for burst protection
- Sliding Window for sustained rate limiting
- Configurable per endpoint type (api, auth, search)
- Auto-blocking for DDoS patterns

---

## Antigravity - Frontend Framework

### Design System (Baerz Replication)

```typescript
// src/styles/baerzTheme.ts
export const baerzTheme = {
    colors: {
        luxuryGold: '#BE9C7E',
        charcoal: '#212529',
        offWhite: '#F2F2F2',
        dark: '#1A1A1A',
        textLight: '#6C757D',
    },
    typography: {
        heading: "'Playfair Display', Georgia, serif",
        body: "'Montserrat', -apple-system, sans-serif",
    },
    spacing: {
        sectionPadding: '120px',
        containerMax: '1400px',
    },
};
```

### Component Structure

- **Header**: Two-tier navigation with scroll effects
- **Hero**: Full-screen video with search bar
- **PropertyCard**: Pixel-perfect property cards
- **FilterBar**: Sticky filter with dropdowns
- **Footer**: Dark footer with gold accents

### CSS Approach

- CSS Modules for component isolation
- CSS Custom Properties for theming
- Responsive with mobile-first
- RTL support for Arabic

---

## Security Architecture

### OWASP Top 10 Protections

| Vulnerability | Protection |
|--------------|------------|
| A01 Broken Access Control | RBAC + Resource ownership |
| A02 Cryptographic Failures | AES-256-GCM + Argon2 |
| A03 Injection | Parameterized queries + Zod |
| A04 Insecure Design | Clean Architecture |
| A05 Security Misconfiguration | CSP + HSTS + Headers |
| A06 Vulnerable Components | npm audit + Snyk |
| A07 Auth Failures | JWT + Secure sessions |
| A08 Data Integrity | HMAC verification |
| A09 Logging | Security event logging |
| A10 SSRF | URL whitelisting |

### Authentication Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────▶│ Gateway  │────▶│   Auth   │────▶│    DB    │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                      │                │
                      │ Rate Limit     │ JWT Generation
                      │ DDoS Check     │ Password Verify
                      │                │ Session Create
```

---

## Data Flow

### Property Search Flow

```
1. User → FilterBar component → Search params
2. Search params → API Gateway → Rate limit check
3. Gateway → GetPropertiesUseCase → Validate input
4. Use Case → PropertyRepository → Database query
5. Repository → Paginated results → Use Case
6. Use Case → DTO transformation → Gateway
7. Gateway → Security headers → Client
8. Client → PropertyCard rendering
```

### Property Creation Flow

```
1. Agent → PropertyForm → Validation
2. Form → API Gateway → Auth check
3. Gateway → RBAC check → Permission verify
4. CreatePropertyUseCase → Business rules
5. Use Case → Repository → Database insert
6. Repository → Created entity → Use Case
7. Use Case → Search index update → Notification
```

---

## Technology Stack

### Frontend

- Next.js 14+ (App Router)
- React 18+ (Server Components)
- TypeScript 5+
- CSS Modules
- Lucide React (Icons)

### Backend

- Node.js runtime
- Next.js API Routes
- Zod (Validation)
- JWT (Authentication)

### Database

- Supabase (Primary)
- PostgreSQL (RLS enabled)
- Redis (Caching, Rate limiting)

### Security

- HTTPS/TLS 1.3
- CSP Headers
- Rate Limiting
- DDoS Protection

### DevOps

- Docker containers
- GitHub Actions
- Vercel/Cloud Run
- Cloudflare CDN

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Security audit
npm run security:audit
```

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...

# Authentication
JWT_SECRET=...
JWT_REFRESH_SECRET=...
ENCRYPTION_KEY=...

# Services
REDIS_URL=...
GOOGLE_MAPS_API_KEY=...

# Analytics
GOOGLE_ANALYTICS_ID=...
```

---

*Last Updated: 2026-02-03*
*Version: 1.0.0*
