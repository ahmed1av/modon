const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// DiscoverX Search Logic (Mocked for port 556)
app.get('/api/search', (req, res) => {
    const { q } = req.query;
    console.log(`[DiscoverX] Searching for: ${q}`);

    const suggestions = [
        { id: 'l1', type: 'location', text: 'Marbella', subtext: 'Malaga, Spain' },
        { id: 'l2', type: 'location', text: 'Dubai Marina', subtext: 'Dubai, UAE' },
        { id: 'p1', type: 'property', text: 'Modern Villa in Amsterdam', subtext: '€4,500,000' }
    ].filter(s => s.text.toLowerCase().includes((q || '').toLowerCase()));

    res.json(suggestions);
});

// CoreX Listing Data
app.get('/api/listings', (req, res) => {
    const properties = [
        {
            id: 1,
            title: "Groesbeekseweg 50",
            location: "Malden, Netherlands",
            price: "€ 1,295,000 k.k.",
            specs: "381m² living • 1.500m² plot • 3 beds",
            image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800",
            slug: "malden-groesbeekseweg-50"
        },
        {
            id: 2,
            title: "Luxury Waterfront Villa",
            location: "Šolta, Croatia",
            price: "€ 800,000",
            specs: "366m² living • 714m² plot • 4 beds",
            image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
            slug: "solta-croatia-waterfront"
        },
        {
            id: 3,
            title: "Modern Seaview Estate",
            location: "Primošten, Croatia",
            price: "€ 1,900,000",
            specs: "176m² living • 591m² plot • 3 beds",
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
            slug: "primosten-croatia-seaview"
        },
        {
            id: 4,
            title: "Penthouse at Palm Jumeirah",
            location: "Dubai, UAE",
            price: "AED 4,000,000",
            specs: "160m² living • 3 beds",
            image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
            slug: "dubai-palm-jumeirah-penthouse"
        },
        {
            id: 5,
            title: "Beachfront Gem",
            location: "Sukošan, Croatia",
            price: "€ 850,000",
            specs: "412m² living • 909m² plot • 4 beds",
            image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=800",
            slug: "sukosan-croatia-beachfront"
        },
        {
            id: 6,
            title: "Grand Estate Marbella",
            location: "Marbella, Spain",
            price: "On Request",
            specs: "958m² living • 3.631m² plot • 8 beds",
            image: "https://images.unsplash.com/photo-1512918766675-ed20ccaefcf1?auto=format&fit=crop&q=80&w=800",
            slug: "marbella-grand-estate"
        }
    ];
    res.json(properties);
});

app.listen(PORT, () => {
    console.log(`[Nuclear-Speed Backend] Running on http://localhost:${PORT}`);
});
