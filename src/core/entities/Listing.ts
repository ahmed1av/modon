export interface Listing {
    id: string;
    title: string;
    description: string;
    price: string;
    location: {
        city: string;
        country: string;
        flag: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    specs: {
        beds: number;
        baths: number;
        area: string;
        plotSize?: string;
    };
    images: string[];
    features: string[];
    agentId: string;
    type: 'sale' | 'rent';
    status: 'active' | 'sold' | 'reserved';
    createdAt: Date;
}
