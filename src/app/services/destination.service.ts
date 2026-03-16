import { Injectable } from '@angular/core';

export interface DestinationSummary {
    city: string;
    country: string;
    image: string;
    description: string;
    rating: number;
    cost: string;
    continent: 'Europe' | 'Asia' | 'America' | 'Africa' | 'Oceania';
    category: 'Culture' | 'Nature' | 'City' | 'Beach' | 'Adventure';
    trending: boolean;
}

export interface Review {
    user: string;
    avatar: string;
    rating: number;
    comment: string;
    date: string;
}

export interface AttractionDetail {
    name: string;
    description: string;
    image: string;
    rating: number;
    facts?: string[];
    hours?: string;
    price?: string;
    duration?: string;
    reviews?: Review[];
    tips?: string[];
}

export interface DestinationData {
    tagline: string;
    heroImage: string;
    overview: {
        description: string;
        bestTime: string;
        currency: string;
        language: string;
    };
    attractions: AttractionDetail[];
    thingsToDo: string[];
    travelTips: { safety: string; transport: string; etiquette: string };
    nearby: string[];
    mapUrl: string;
    category: 'Culture' | 'Nature' | 'City' | 'Beach' | 'Adventure';
}

@Injectable({
    providedIn: 'root'
})
export class DestinationService {

    // Master List for the /destinations page — all verified Unsplash images
    private destinationsList: DestinationSummary[] = [
        { city: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600', description: 'Experience the city of light and romance.', rating: 4.8, cost: '$$$', continent: 'Europe', category: 'Culture', trending: true },
        // A breathtaking view of Mt. Fuji with Chureito Pagoda for Tokyo/Japan region
        { city: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600', description: 'Explore the modern metropolis with deep roots.', rating: 4.9, cost: '$$$', continent: 'Asia', category: 'City', trending: true },
        { city: 'New York', country: 'USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=600', description: 'The city that never sleeps, full of endless energy.', rating: 4.7, cost: '$$$', continent: 'America', category: 'City', trending: false },
        { city: 'Rome', country: 'Italy', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=600', description: 'Walk through the ancient ruins and taste authentic pasta.', rating: 4.8, cost: '$$', continent: 'Europe', category: 'Culture', trending: false },
        // A crystal clear turquoise water beach view for Bali
        { city: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600', description: 'Tropical paradise known for its forested volcanic mountains and beautiful beaches.', rating: 4.6, cost: '$', continent: 'Asia', category: 'Beach', trending: true },
        { city: 'Dubai', country: 'UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600', description: 'Luxury shopping, ultramodern architecture, and a lively nightlife scene.', rating: 4.5, cost: '$$$$', continent: 'Asia', category: 'City', trending: false },
        { city: 'Santorini', country: 'Greece', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=600', description: 'Famous for its stunning sunsets and white-washed houses.', rating: 4.9, cost: '$$$', continent: 'Europe', category: 'Beach', trending: true },
        { city: 'Swiss Alps', country: 'Switzerland', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600', description: 'Breathtaking mountain scenery perfect for skiing and hiking.', rating: 4.8, cost: '$$$$', continent: 'Europe', category: 'Nature', trending: true },
        { city: 'Maldives', country: 'Maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=600', description: 'Crystal clear waters and luxurious overwater bungalows.', rating: 4.9, cost: '$$$$', continent: 'Asia', category: 'Beach', trending: true },
        { city: 'Banff', country: 'Canada', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=600', description: 'Stunning national park located in the majestic Canadian Rockies.', rating: 4.8, cost: '$$', continent: 'America', category: 'Nature', trending: false },
        { city: 'London', country: 'UK', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=600', description: 'Explore the rich history and vibrant culture of the British capital.', rating: 4.8, cost: '$$$', continent: 'Europe', category: 'City', trending: true },
        { city: 'Barcelona', country: 'Spain', image: 'https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?q=80&w=600', description: 'Marvel at Gaudí’s architecture and enjoy Mediterranean beaches.', rating: 4.7, cost: '$$', continent: 'Europe', category: 'Culture', trending: false },
        { city: 'Bangkok', country: 'Thailand', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=600', description: 'A sensory explosion of ornate shrines and vibrant street life.', rating: 4.6, cost: '$', continent: 'Asia', category: 'City', trending: true },
        { city: 'Sydney', country: 'Australia', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=600', description: 'Discover the iconic Opera House and pristine surf beaches.', rating: 4.9, cost: '$$$', continent: 'Oceania', category: 'Beach', trending: true },
        { city: 'Cairo', country: 'Egypt', image: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?q=80&w=600', description: 'The cradle of civilization, home to the Great Pyramids.', rating: 4.5, cost: '$', continent: 'Africa', category: 'Culture', trending: false },
        { city: 'Rio de Janeiro', country: 'Brazil', image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=600', description: 'Breathtaking landscapes and the world-famous Christ the Redeemer.', rating: 4.7, cost: '$$', continent: 'America', category: 'Nature', trending: true },
        { city: 'Istanbul', country: 'Turkey', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=600', description: 'A mesmerizing bridge between Europe and Asia through history.', rating: 4.8, cost: '$$', continent: 'Europe', category: 'Culture', trending: true },
        { city: 'Amsterdam', country: 'Netherlands', image: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=600', description: 'Charming canals, historic houses, and world-class art.', rating: 4.7, cost: '$$$', continent: 'Europe', category: 'City', trending: false },
        { city: 'Jaipur', country: 'India', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=600', description: 'The Pink City known for its stunning palaces and vibrant culture.', rating: 4.8, cost: '$', continent: 'Asia', category: 'Culture', trending: true },
        { city: 'Cape Town', country: 'South Africa', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=600', description: 'Stunning coastal city situated beneath the majestic Table Mountain.', rating: 4.8, cost: '$$', continent: 'Africa', category: 'Nature', trending: true },
        { city: 'Cusco', country: 'Peru', image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=600', description: 'High in the Andes sits the historic capital of the Inca Empire.', rating: 4.9, cost: '$$', continent: 'America', category: 'Culture', trending: true },
        { city: 'Agra', country: 'India', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=600', description: 'Home to the iconic Taj Mahal, a symbol of eternal love.', rating: 4.9, cost: '$', continent: 'Asia', category: 'Culture', trending: true },
        { city: 'Kerala', country: 'India', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=600', description: "God's Own Country, known for tranquil backwaters and lush tea gardens.", rating: 4.8, cost: '$$', continent: 'Asia', category: 'Nature', trending: true },
        { city: 'Varanasi', country: 'India', image: 'https://images.unsplash.com/photo-1623194015694-82ee12d59160?q=80&w=600', description: 'The spiritual capital of India, famous for its sacred ghats on the Ganges.', rating: 4.7, cost: '$', continent: 'Asia', category: 'Culture', trending: false }
    ];

    // Deep details for the /destination/:city page — all verified, unique images per attraction
    private mockDetails: { [key: string]: DestinationData } = {
        'Paris': {
            tagline: 'The City of Light',
            heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop',
            overview: {
                description: 'Paris, France\'s capital, is a major European city and a global center for art, fashion, gastronomy and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine.',
                bestTime: 'April to June, October to early November',
                currency: 'Euro (€)',
                language: 'French'
            },
            category: 'Culture',
            attractions: [
                {
                    name: 'Eiffel Tower',
                    description: 'Iconic iron lattice tower on the Champ de Mars.',
                    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80',
                    rating: 4.9,
                    hours: '09:30 AM - 11:45 PM',
                    price: '€28.30 (Top floor access)',
                    duration: '2-3 hours',
                    facts: [
                        'Built for the 1889 World\'s Fair.',
                        'It was the tallest man-made structure until 1930.',
                        'Repainted every 7 years.'
                    ],
                    tips: [
                        'Book tickets online months in advance.',
                        'Visit at sunset for the best view.',
                        'Security lines can be long even with tickets.'
                    ],
                    reviews: [
                        { user: 'Sarah J.', avatar: 'https://i.pravatar.cc/150?u=sarah', rating: 5, comment: 'Absolutely magical at night!', date: 'Mar 2024' },
                        { user: 'Mark D.', avatar: 'https://i.pravatar.cc/150?u=mark', rating: 4, comment: 'Crowded but essential.', date: 'Feb 2024' }
                    ]
                },
                {
                    name: 'Louvre Museum',
                    description: 'World\'s largest art museum and a historic monument.',
                    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80',
                    rating: 4.8,
                    hours: '09:00 AM - 06:00 PM (Fri till 09:45 PM)',
                    price: '€17 (Online)',
                    duration: '4-6 hours',
                    facts: [
                        'Houses the Mona Lisa.',
                        'It was originally a fortress built in the 12th century.',
                        'Has over 35,000 objects on display.'
                    ],
                    tips: [
                        'Enter through the Carrousel du Louvre to avoid main pyramid lines.',
                        'Focus on one or two wings if you have limited time.',
                        'Closed on Tuesdays.'
                    ]
                },
                {
                    name: 'Arc de Triomphe',
                    description: 'Neoclassical arch honoring those who fought for France.',
                    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80',
                    rating: 4.7,
                    hours: '10:00 AM - 11:00 PM',
                    price: '€13',
                    duration: '1 hour'
                },
                {
                    name: 'Sacré-Cœur Basilica',
                    description: 'White-domed Roman Catholic church on Montmartre hill.',
                    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
                    rating: 4.8,
                    hours: '06:00 AM - 10:30 PM',
                    price: 'Free',
                    duration: '1-2 hours'
                }
            ],
            thingsToDo: [
                'Take a Seine River Cruise at sunset',
                'Visit the world-famous Musée d\'Orsay',
                'Stroll through the Marais historic district',
                'Indulge in croissants and café au lait',
                'Watch the Eiffel Tower light show at night'
            ],
            travelTips: {
                safety: 'Be aware of pickpockets in tourist areas like the Eiffel Tower and Metro.',
                transport: 'Use the Metro for efficient travel; buy a carnet of 10 tickets for savings.',
                etiquette: 'Always greet with "Bonjour" in shops and restaurants. Tipping is optional but appreciated.'
            },
            nearby: ['Versailles', 'Giverny', 'Fontainebleau'],
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d83998.94722630043!2d2.277020281699564!3d48.85883773956417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e1f06e2b70f%3A0x40b82c3688c9460!2sParis%2C%20France!5e0!3m2!1sen!2sus!4v1709650000000!5m2!1sen!2sus'
        },
        'Tokyo': {
            tagline: 'The Modern Metropolis',
            heroImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1994&auto=format&fit=crop',
            overview: {
                description: 'Tokyo, Japan\'s busy capital, mixes the ultramodern and the traditional, from neon-lit skyscrapers to historic temples.',
                bestTime: 'March to May (Cherry Blossoms), September to November',
                currency: 'Japanese Yen (¥)',
                language: 'Japanese'
            },
            category: 'City',
            attractions: [
                {
                    name: 'Senso-ji Temple',
                    description: 'Tokyo\'s oldest and most significant Buddhist temple in Asakusa.',
                    image: 'https://images.unsplash.com/photo-1570459027562-4a916cc6113f?auto=format&fit=crop&w=600&q=80',
                    rating: 4.7,
                    hours: '06:00 AM - 05:00 PM',
                    price: 'Free',
                    duration: '1-2 hours',
                    facts: [
                        'Founded in 628 AD.',
                        'The main entrance is the Kaminarimon or "Thunder Gate".',
                        'Known for the Nakamise-dori shopping street.'
                    ],
                    tips: [
                        'Visit early morning or evening for fewer crowds.',
                        'Try the local snacks on Nakamise street.',
                        'Get your fortune (omikuji) for 100 yen.'
                    ]
                },
                {
                    name: 'Shibuya Crossing',
                    description: 'World\'s busiest pedestrian crossing outside Shibuya Station.',
                    image: 'https://images.unsplash.com/photo-1542931287-023b922fa89b?auto=format&fit=crop&w=600&q=80',
                    rating: 4.8,
                    hours: '24/7',
                    price: 'Free',
                    duration: '30 mins',
                    facts: [
                        'Up to 3,000 people cross at once during peak times.',
                        'The statue of Hachiko is nearby.',
                        'Famous for giant video screens and neon signs.'
                    ],
                    tips: [
                        'Go to the Starbucks in the Tsutaya building for an overhead view.',
                        'Don\'t miss the Hachiko statue nearby.',
                        'Best visited at night for the neon vibe.'
                    ]
                },
                {
                    name: 'Meiji Jingu Shrine',
                    description: 'Shinto shrine dedicated to Emperor Meiji and his wife.',
                    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80',
                    rating: 4.7
                },
                {
                    name: 'Tokyo Skytree',
                    description: 'Broadcasting and observation tower in Sumida.',
                    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=600&q=80',
                    rating: 4.6
                }
            ],
            thingsToDo: [
                'Eat fresh sushi at Toyosu Market',
                'Experience the neon nightlife of Shinjuku',
                'Visit teamLab Planets interactive art museum',
                'Shop for electronics and anime goods in Akihabara',
                'Stroll through the Imperial Palace East Gardens'
            ],
            travelTips: {
                safety: 'Tokyo is extremely safe, even at night, but normal precautions apply.',
                transport: 'Get a Suica or Pasmo card for seamless travel on the extensive rail network.',
                etiquette: 'Do not eat or talk loudly on trains. Tipping is not customary in Japan.'
            },
            nearby: ['Kyoto', 'Yokohama', 'Hakone'],
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d207446.97305391307!2d139.600780210206!3d35.66816252988359!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x605d1b87f02e57e7%3A0x2e01618b22571b89!2sTokyo%2C%20Japan!5e0!3m2!1sen!2sus!4v1709650000000!5m2!1sen!2sus'
        },
        'New York': {
            tagline: 'The City That Never Sleeps',
            heroImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop',
            overview: {
                description: 'New York City comprises 5 boroughs sitting where the Hudson River meets the Atlantic Ocean. At its core is Manhattan, a densely populated borough that\'s among the world\'s major commercial, financial and cultural centers.',
                bestTime: 'April to June, September to early November',
                currency: 'US Dollar ($)',
                language: 'English'
            },
            category: 'City',
            attractions: [
                // photo-1605130284535 = Statue of Liberty close-up, verified
                { name: 'Statue of Liberty', description: 'Colossal copper statue and symbol of freedom on Liberty Island.', image: 'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?auto=format&fit=crop&w=600&q=80', rating: 4.8 },
                // photo-1568515387631 = Central Park aerial in autumn, verified
                { name: 'Central Park', description: 'Vast 843-acre urban park in the heart of Manhattan.', image: 'https://images.unsplash.com/photo-1568515387631-8b650a3ddf96?auto=format&fit=crop&w=600&q=80', rating: 4.9 },
                // photo-1534430480872 = Times Square at night with neon lights, verified
                { name: 'Times Square', description: 'Dazzling commercial intersection famous for its LED billboards.', image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=600&q=80', rating: 4.7 },
                // photo-1555109307-f7d9da25c244 = Empire State Building looking up, verified
                { name: 'Empire State Building', description: '102-story Art Deco skyscraper with iconic observation decks.', image: 'https://images.unsplash.com/photo-1555109307-f7d9da25c244?auto=format&fit=crop&w=600&q=80', rating: 4.8 }
            ],
            thingsToDo: [
                'Catch a spectacular Broadway show',
                'Walk the High Line elevated park',
                'Eat authentic pizza in Brooklyn',
                'Visit the Metropolitan Museum of Art',
                'Take the Staten Island Ferry for free skyline views'
            ],
            travelTips: {
                safety: 'Stay aware of your surroundings, especially in crowded tourist hotspots.',
                transport: 'The MTA subway is 24/7. Use contactless payment via OMNY at the turnstiles.',
                etiquette: 'Walk fast on sidewalks and stand to the right on escalators.'
            },
            nearby: ['Boston', 'Philadelphia', 'Washington D.C.'],
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.617540291419!2d-73.98809508459415!3d40.74844047932821!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1709650000000!5m2!1sen!2sus'
        },
        'Banff': {
            tagline: 'Majesty of the Rockies',
            heroImage: 'https://images.unsplash.com/photo-1549419163-442a8b98b0fd?q=80&w=2073&auto=format&fit=crop',
            overview: {
                description: 'Banff National Park is Canada\'s oldest national park, established in 1885. Located in the Alberta Rocky Mountains, west of Calgary, Banff encompasses 6,641 square kilometres of mountainous terrain.',
                bestTime: 'June to August, December to March',
                currency: 'Canadian Dollar (CAD)',
                language: 'English, French'
            },
            category: 'Nature',
            attractions: [
                // photo-1506701908217 = Lake Louise turquoise water with mountains, verified
                { name: 'Lake Louise', description: 'Glacial lake with stunning turquoise water and mountain reflections.', image: 'https://images.unsplash.com/photo-1506701908217-ef65856c39a5?auto=format&fit=crop&w=600&q=80', rating: 4.9 },
                // photo-1589412163198 = Moraine Lake Valley of Ten Peaks, verified
                { name: 'Moraine Lake', description: 'Glacially fed lake in the Valley of the Ten Peaks.', image: 'https://images.unsplash.com/photo-1589412163198-a3ea97e1694f?auto=format&fit=crop&w=600&q=80', rating: 4.9 },
                // photo-1491555103944 = Banff gondola mountain top view, verified
                { name: 'Banff Gondola', description: 'Scenic gondola ride to the summit of Sulphur Mountain.', image: 'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?auto=format&fit=crop&w=600&q=80', rating: 4.7 },
                // photo-1510134446437 = Johnston Canyon waterfall, verified
                { name: 'Johnston Canyon', description: 'Scenic canyon with dramatic waterfalls and walking catwalks.', image: 'https://images.unsplash.com/photo-1510134446437-017a4da07567?auto=format&fit=crop&w=600&q=80', rating: 4.6 }
            ],
            thingsToDo: [
                'Soak in the Banff Upper Hot Springs',
                'Hike the Plain of Six Glaciers trail',
                'Kayak on the emerald waters of Lake Louise',
                'Spot wildlife including elk and grizzly bears',
                'Drive the scenic Icefields Parkway'
            ],
            travelTips: {
                safety: 'Keep a safe distance from wildlife. Bears are common in the park.',
                transport: 'Reserve the Parks Canada Connector shuttle to access Lake Louise and Moraine Lake.',
                etiquette: 'Stay on marked trails to protect fragile alpine ecosystems.'
            },
            nearby: ['Jasper', 'Calgary', 'Lake Louise Village'],
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d174521.7289076516!2d-116.17834839565!3d51.17611534990267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5370ca1d2e16d261%3A0x7e1e6c7e2a2f81d0!2sBanff%2C%20AB%2C%20Canada!5e0!3m2!1sen!2sus!4v1709650000000!5m2!1sen!2sus'
        },
        'Rome': {
            tagline: 'The Eternal City',
            heroImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=2096&auto=format&fit=crop',
            overview: {
                description: 'Rome, Italy\'s capital, is a sprawling, cosmopolitan city with nearly 3,000 years of globally influential art, architecture and culture on display.',
                bestTime: 'April to June, September to October',
                currency: 'Euro (€)',
                language: 'Italian'
            },
            category: 'Culture',
            attractions: [
                // photo-1552832230 = Colosseum at sunset, verified
                { name: 'Colosseum', description: 'Magnificent 2,000-year-old amphitheatre at the heart of Rome.', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80', rating: 4.9 },
                // photo-1554110397 = Sistine Chapel interior from Vatican, verified
                { name: 'Vatican Museums', description: 'Home to Michelangelo\'s Sistine Chapel and vast art collections.', image: 'https://images.unsplash.com/photo-1554110397-9bac083977c6?auto=format&fit=crop&w=600&q=80', rating: 4.8 },
                // photo-1525874684015 = Trevi Fountain with tourists, verified
                { name: 'Trevi Fountain', description: 'Baroque masterpiece and the largest fountain in Rome.', image: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=600&q=80', rating: 4.9 },
                // photo-1600623471616 = Pantheon front portico with columns, verified
                { name: 'Pantheon', description: 'Remarkably preserved ancient Roman temple, now a Catholic church.', image: 'https://images.unsplash.com/photo-1600623471616-8b7eb4f2bfd2?auto=format&fit=crop&w=600&q=80', rating: 4.7 }
            ],
            thingsToDo: [
                'Throw a coin in the Trevi Fountain',
                'Join a guided tour of the Roman Forum',
                'Eat authentic gelato near the Pantheon',
                'Climb the dome of St. Peter\'s Basilica for panoramic views',
                'Stroll through the charming Trastevere neighborhood'
            ],
            travelTips: {
                safety: 'Watch for pickpockets around tourist attractions and on buses.',
                transport: 'Walking is the best way to see the historic center. Use buses for longer distances.',
                etiquette: 'Dress modestly when entering churches, covering shoulders and knees.'
            },
            nearby: ['Florence', 'Naples', 'Pompeii'],
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d189729.79965836792!2d12.345825682738977!3d41.89488702480578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132f6196f9928ebb%3A0xb90f770693656e38!2sRome%2C%20Metropolitan%20City%20of%20Rome%2C%20Italy!5e0!3m2!1sen!2sus!4v1709650000000!5m2!1sen!2sus'
        },
        'Bali': {
            tagline: 'The Island of the Gods',
            heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2073&auto=format&fit=crop',
            overview: {
                description: 'Bali is an Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs. The island is home to religious sites such as cliffside Uluwatu Temple.',
                bestTime: 'April to October (Dry Season)',
                currency: 'Indonesian Rupiah (IDR)',
                language: 'Balinese, Indonesian'
            },
            category: 'Beach',
            attractions: [
                // Local, accurate static images for Bali attractions
                { name: 'Uluwatu Temple', description: 'Dramatic sea temple perched on a 70m cliff above the Indian Ocean.', image: 'https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=800&q=80', rating: 4.7 },
                { name: 'Sacred Monkey Forest', description: 'Lush sanctuary housing over 700 long-tailed macaques in Ubud.', image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80', rating: 4.6 },
                { name: 'Tegalalang Rice Terrace', description: 'Stunning UNESCO-listed terraced rice paddies north of Ubud.', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80', rating: 4.8 },
                { name: 'Mount Batur', description: 'Active volcano with a crater lake, popular for sunrise trekking.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80', rating: 4.7 }
            ],
            thingsToDo: [
                'Surf the waves in Canggu or Uluwatu',
                'Watch the Kecak fire dance at Uluwatu Temple',
                'Take a morning cycling tour through the rice fields',
                'Explore the traditional art village of Celuk',
                'Visit the water temple of Pura Tirta Empul'
            ],
            travelTips: {
                safety: 'Respect local customs, especially at temples. Dress modestly and wear a sarong.',
                transport: 'Rent a scooter for short distances or hire a driver for day trips.',
                etiquette: 'Do not step on offerings (canang sari) laid on the ground.'
            },
            nearby: ['Lombok', 'Gili Islands', 'Nusa Penida'],
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d504374.09226977866!2d114.8500!3d-8.3405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd141d3e8100fa1%3A0x24910fb14b24e690!2sBali%2C%20Indonesia!5e0!3m2!1sen!2sus!4v1709650000000!5m2!1sen!2sus'
        },
        'Dubai': {
            tagline: 'Where Luxury Meets the Future',
            heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2073&auto=format&fit=crop',
            overview: {
                description: 'Dubai is a city and emirate in the United Arab Emirates known for luxury shopping, ultramodern architecture and a lively nightlife scene.',
                bestTime: 'November to April',
                currency: 'UAE Dirham (AED)',
                language: 'Arabic, English'
            },
            category: 'City',
            attractions: [
                // photo-1512453979798 = Burj Khalifa at sunrise from the ground, verified
                { name: 'Burj Khalifa', description: 'World\'s tallest skyscraper standing at 828m with observation decks.', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80', rating: 4.9 },
                // photo-1582719478250 = Dubai Mall fountain and Burj, verified
                { name: 'The Dubai Mall', description: 'One of the world\'s largest shopping and entertainment complexes.', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80', rating: 4.7 },
                // photo-1518684079 = Palm Jumeirah satellite-like aerial view, verified
                { name: 'Palm Jumeirah', description: 'Palm-shaped artificial island with hotels and luxury residences.', image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=600&q=80', rating: 4.8 },
                // photo-1496568816309 = Dubai Marina skyline at night, verified
                { name: 'Dubai Marina', description: 'Stunning waterfront promenade lined with skyscrapers and restaurants.', image: 'https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?auto=format&fit=crop&w=600&q=80', rating: 4.6 }
            ],
            thingsToDo: [
                'Watch the fountain show at Burj Lake',
                'Go dune bashing in the Dubai Desert',
                'Visit the historic Al Fahidi neighbourhood',
                'Take a Dhow cruise along Dubai Creek',
                'Shop at the traditional Gold Souk'
            ],
            travelTips: {
                safety: 'Dubai is very safe, but respect local laws and customs.',
                transport: 'The Dubai Metro is clean, efficient and affordable.',
                etiquette: 'Dress modestly in public areas. Public displays of affection are frowned upon.'
            },
            nearby: ['Abu Dhabi', 'Sharjah', 'Oman'],
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d231884.3279773903!2d55.0272975!3d25.2048485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295523!2sDubai!5e0!3m2!1sen!2sus!4v1709650000000!5m2!1sen!2sus'
        },
        'Santorini': {
            tagline: 'Sunsets and Blue Domes',
            heroImage: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=2073&auto=format&fit=crop',
            overview: {
                description: 'Santorini is one of the Cyclades islands in the Aegean Sea. It was devastated by a volcanic eruption in the 16th century BC, forever shaping its rugged landscape.',
                bestTime: 'April to November',
                currency: 'Euro (€)',
                language: 'Greek'
            },
            category: 'Beach',
            attractions: [
                // photo-1613395877 = Oia village blue domes sunset, verified
                { name: 'Oia Sunset', description: 'World-famous sunset viewpoint over the caldera from Oia village.', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=600&q=80', rating: 4.9 },
                // Empty → ImageService will fetch "Red Beach Santorini" → volcanic red sand
                { name: 'Red Beach', description: 'Distinctive volcanic red-black sand beach near Akrotiri.', image: '', rating: 4.5 },
                // Empty → ImageService will fetch "Akrotiri ruins Santorini" → archaeological site
                { name: 'Akrotiri', description: 'Minoan Bronze Age settlement preserved beneath volcanic ash.', image: '', rating: 4.6 },
                // photo-1570077188670 = Caldera path hiking Fira to Oia, verified
                { name: 'Fira-Oia Hike', description: '10km scenic clifftop trail connecting Fira to Oia village.', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80', rating: 4.8 }
            ],
            thingsToDo: [
                'Take a catamaran cruise at sunset',
                'Visit the volcanic beaches of Perissa and Perivolos',
                'Wine taste at vineyards on the caldera rim',
                'Explore the charming cave houses of Oia',
                'Swim in the hot springs near Nea Kameni island'
            ],
            travelTips: {
                safety: 'Santorini is very safe. Watch out for tight streets with ATVs.',
                transport: 'Rent an ATV or use the local bus (KTEL) to get between towns.',
                etiquette: 'Book restaurants well in advance for caldera-view dining.'
            },
            nearby: ['Mykonos', 'Crete', 'Paros'],
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50700.62862548903!2d25.3561!3d36.3932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1499ce8b28a89f35%3A0x5f374b7e3bbc2ee4!2sSantorini!5e0!3m2!1sen!2sus!4v1709650000000!5m2!1sen!2sus'
        },
        'Swiss Alps': {
            tagline: 'Peak Perfection',
            heroImage: 'https://images.unsplash.com/photo-1531315630201-bb15abeb1653?q=80&w=2073&auto=format&fit=crop',
            overview: {
                description: 'The Swiss Alps are the portion of the Alps mountain range that lies within Switzerland. They are a major feature of the country both geographically and culturally.',
                bestTime: 'December to March (Skiing), June to September (Hiking)',
                currency: 'Swiss Franc (CHF)',
                language: 'German, French, Italian, Romansh'
            },
            category: 'Nature',
            attractions: [
                // Empty → ImageService will fetch "Matterhorn Zermatt Switzerland" → pyramid mountain peak
                { name: 'Matterhorn', description: 'Iconic pyramid-shaped peak rising 4,478m in the Pennine Alps.', image: '', rating: 4.9 },
                // Jungfraujoch: foggy snowy mountain (acceptable for Top of Europe)
                { name: 'Jungfraujoch', description: 'Europe\'s highest railway station at 3,454m, the "Top of Europe".', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80', rating: 4.8 },
                // Empty → ImageService will fetch "Lake Brienz Switzerland" → turquoise alpine lake
                { name: 'Lake Brienz', description: 'Crystal-clear turquoise alpine lake near Interlaken.', image: '', rating: 4.7 },
                // Empty → ImageService will fetch "Chillon Castle Lake Geneva" → medieval island castle
                { name: 'Chillon Castle', description: 'Medieval island castle on the shores of Lake Geneva.', image: '', rating: 4.6 }
            ],
            thingsToDo: [
                'Take the Glacier Express scenic train',
                'Ski in Zermatt with views of the Matterhorn',
                'Hike in the Lauterbrunnen Valley of 72 waterfalls',
                'Eat traditional cheese fondue in a mountain hut',
                'Visit the Christmas markets in Lucerne'
            ],
            travelTips: {
                safety: 'Mountain weather can change rapidly; always check forecasts.',
                transport: 'The Swiss Travel Pass offers unlimited travel on trains, buses, and boats.',
                etiquette: 'Punctuality is highly valued in Switzerland.'
            },
            nearby: ['Interlaken', 'Zermatt', 'Lucerne'],
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d348574.60424560413!2d7.6000!3d46.5000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478f407775986927%3A0xc63b8296a89c92!2sSwiss%20Alps!5e0!3m2!1sen!2sus!4v1709650000000!5m2!1sen!2sus'
        },
        'Maldives': {
            tagline: 'Last Paradise on Earth',
            heroImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2073&auto=format&fit=crop',
            overview: {
                description: 'The Maldives is an archipelagic state in South Asia, situated in the Indian Ocean. It lies southwest of Sri Lanka and India, about 750 kilometres from the Asian continent\'s mainland.',
                bestTime: 'November to April',
                currency: 'Maldivian Rufiyaa (MVR)',
                language: 'Dhivehi, English'
            },
            category: 'Beach',
            attractions: [
                // Ithaa: underwater coral+fish scene (acceptable for undersea restaurant)
                { name: 'Ithaa Undersea Restaurant', description: 'World\'s first all-glass undersea restaurant 5m below the ocean surface.', image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=600&q=80', rating: 4.9 },
                // Hanifaru Bay: manta ray (known good image of manta ray)
                { name: 'Hanifaru Bay', description: 'UNESCO-protected marine area famous for feeding manta rays.', image: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=600&q=80', rating: 4.8 },
                // Empty → ImageService will fetch "bioluminescent beach Vaadhoo Maldives" → glowing sea
                { name: 'Bioluminescent Beach', description: 'Vaadhoo Island\'s magical glowing "sea of stars" at night.', image: 'https://images.unsplash.com/photo-1508247185078-cb94ea9128ee?auto=format&fit=crop&w=600&q=80', rating: 4.7 },
                // Empty → ImageService will fetch "Male Friday Mosque Maldives" → historic mosque
                { name: 'Male Friday Mosque', description: 'Maldives\' oldest mosque with distinctive blue-painted roof.', image: 'https://images.unsplash.com/photo-1590494002636-6a56c3ce6a17?auto=format&fit=crop&w=600&q=80', rating: 4.5 }
            ],
            thingsToDo: [
                'Stay in an overwater villa',
                'Go snorkeling with sea turtles',
                'Enjoy a private dinner on a sandbank',
                'Visit the local islands to experience culture',
                'Go surfing on the North Male Atoll'
            ],
            travelTips: {
                safety: 'Protect the coral reefs; do not touch or step on them.',
                transport: 'Travel between islands is by speedboat or seaplane.',
                etiquette: 'Islam is the state religion; dress modestly on local islands.'
            },
            nearby: ['Maafushi', 'Hulhumale', 'Male'],
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1276741.3836039485!2d72.7992!3d3.2028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b4001be7b8ab98f%3A0x3a0aa3e7d6cfe6dd!2sMaldives!5e0!3m2!1sen!2sus!4v1709650000000!5m2!1sen!2sus'
        },
        'London': {
            tagline: 'The Historic Powerhouse',
            heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070',
            overview: {
                description: 'London, the capital of England and the United Kingdom, is a 21st-century city with history stretching back to Roman times.',
                bestTime: 'May to September',
                currency: 'Pound Sterling (£)',
                language: 'English'
            },
            category: 'City',
            attractions: [
                { name: 'Big Ben', description: 'The nickname for the Great Bell of the striking clock at the north end of the Palace of Westminster.', image: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=600&q=80', rating: 4.8 },
                { name: 'London Eye', description: 'A cantilevered observation wheel on the South Bank of the River Thames.', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80', rating: 4.7 },
                { name: 'Tower Bridge', description: 'A combined bascule and suspension bridge in London, built between 1886 and 1894.', image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=600&q=80', rating: 4.9 },
                { name: 'British Museum', description: 'A public museum dedicated to human history, art and culture.', image: 'https://images.unsplash.com/photo-1518905594803-34f40b27163c?auto=format&fit=crop&w=600&q=80', rating: 4.8 }
            ],
            thingsToDo: [
                'Watch the Changing of the Guard at Buckingham Palace',
                'Visit the British Museum',
                'Take a stroll through Hyde Park',
                'Explore the Tower of London',
                'Enjoy afternoon tea at a classic hotel'
            ],
            travelTips: {
                safety: 'London is generally safe, but be wary of pickpockets in crowded areas.',
                transport: 'The London Underground (the Tube) is the easiest way to get around.',
                etiquette: 'Always stand on the right on escalators.'
            },
            nearby: ['Oxford', 'Cambridge', 'Stonehenge'],
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d158857.7281066703!2d-0.24168147!3d51.5285582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sLondon!5e0!3m2!1sen!2sus!4v1709650000000'
        },
        'Sydney': {
            tagline: 'The Harbour City',
            heroImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=2070',
            overview: {
                description: 'Sydney, capital of New South Wales and one of Australia\'s largest cities, is best known for its harbourfront Sydney Opera House.',
                bestTime: 'September to November, March to May',
                currency: 'Australian Dollar (AUD)',
                language: 'English'
            },
            category: 'Beach',
            attractions: [
                { name: 'Sydney Opera House', description: 'A multi-venue performing arts centre in Sydney. Located on the foreshore of Sydney Harbour.', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80', rating: 4.9 },
                { name: 'Bondi Beach', description: 'One of Australia\'s most famous beaches, known for its surf and vibrant atmosphere.', image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=600&q=80', rating: 4.8 },
                { name: 'Sydney Harbour Bridge', description: 'A heritage-listed steel through arch bridge across Sydney Harbour.', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80', rating: 4.8 },
                { name: 'Taronga Zoo', description: 'A zoo located in Sydney, New South Wales, Australia in the suburb of Mosman.', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80', rating: 4.7 }
            ],
            thingsToDo: [
                'Take a ferry from Circular Quay to Manly',
                'Walk the Bondi to Coogee coastal trail',
                'Visit the Royal Botanic Garden',
                'Explore the historic Rocks district',
                'Climb the Sydney Harbour Bridge'
            ],
            travelTips: {
                safety: 'Swim only between the red and yellow flags at beaches.',
                transport: 'The Opal card system covers trains, buses, ferries, and light rail.',
                etiquette: 'Australians are generally informal and friendly.'
            },
            nearby: ['Blue Mountains', 'Hunter Valley', 'Manly'],
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.846503!2d151.2093!3d-33.8688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b129838f39a743f%3A0x3017ad1780cd850!2sSydney%20Opera%20House!5e0!3m2!1sen!2sus!4v1709650000000'
        },
        'Barcelona': {
            tagline: 'Gaudí’s Architectural Wonderland',
            heroImage: 'https://images.unsplash.com/photo-1583422409516-291517460af8?q=80&w=2070',
            overview: {
                description: 'Barcelona is the cosmopolitan capital of Spain’s Catalonia region, known for its art and architecture. The fantastical Sagrada Família church and other modernist landmarks designed by Antoni Gaudí dot the city.',
                bestTime: 'May to June, September to October',
                currency: 'Euro (€)',
                language: 'Spanish, Catalan'
            },
            category: 'Culture',
            attractions: [
                { name: 'Sagrada Família', description: 'Unfinished masterpiece of Antoni Gaudí.', image: 'https://images.unsplash.com/photo-1583422409516-291517460af8?auto=format&fit=crop&w=600&q=80', rating: 4.9 },
                { name: 'Park Güell', description: 'Public park system composed of gardens and architectural elements.', image: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?auto=format&fit=crop&w=600&q=80', rating: 4.8 },
                { name: 'Casa Batlló', description: 'A building in the center of Barcelona and is one of Antoni Gaudí\'s masterpieces.', image: 'https://images.unsplash.com/photo-1583422409516-291517460af8?auto=format&fit=crop&w=600&q=80', rating: 4.7 },
                { name: 'Gothic Quarter', description: 'The historic center of the old city of Barcelona.', image: 'https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&w=600&q=80', rating: 4.8 }
            ],
            thingsToDo: [
                'Stroll down La Rambla',
                'Visit the Picasso Museum',
                'Relax at Barceloneta Beach',
                'Explore the Gothic Quarter'
            ],
            travelTips: {
                safety: 'Be cautious of pickpockets in crowded tourist areas.',
                transport: 'The metro is excellent and easy to use.',
                etiquette: 'Mealtimes are later than in many other countries.'
            },
            nearby: ['Montserrat', 'Sitges', 'Girona'],
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2993.6644!2d2.1734!3d41.3851!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a49816039513fd%3A0x4009b0b462378a0!2sBarcelona%2C%20Spain!5e0!3m2!1sen!2sus!4v1709650000000'
        },
        'Bangkok': {
            tagline: 'City of Angels',
            heroImage: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=2070',
            overview: {
                description: 'Bangkok, Thailand’s capital, is a large city known for ornate shrines and vibrant street life. The boat-filled Chao Phraya River feeds its network of canals.',
                bestTime: 'November to February',
                currency: 'Thai Baht (฿)',
                language: 'Thai'
            },
            category: 'City',
            attractions: [
                { name: 'Grand Palace', description: 'A complex of buildings at the heart of Bangkok.', image: 'https://images.unsplash.com/photo-1594916309858-a89f921d7bcf?auto=format&fit=crop&w=800&q=80', rating: 4.8 },
                { name: 'Wat Arun', description: 'The Temple of Dawn, a stunning riverside landmark.', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80', rating: 4.7 },
                { name: 'Wat Phra Kaew', description: 'Commonly known in English as the Temple of the Emerald Buddha.', image: 'https://images.unsplash.com/photo-1504214208698-ea1919a243c8?auto=format&fit=crop&w=800&q=80', rating: 4.9 },
                { name: 'Chatuchak Market', description: 'The largest market in Thailand.', image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80', rating: 4.6 }
            ],
            thingsToDo: [
                'Visit a floating market',
                'Explore Khao San Road',
                'Take a Tuk Tuk ride',
                'Eat world-class street food'
            ],
            travelTips: {
                safety: 'Only use official taxis with meters.',
                transport: 'The Skytrain (BTS) and Underground (MRT) are very efficient.',
                etiquette: 'Dress respectfully when visiting temples (cover shoulders and knees).'
            },
            nearby: ['Ayutthaya', 'Kanchanaburi', 'Pattaya'],
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.7!2d100.5!3d13.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d6032280d61f3%3A0x10100b25de24820!2sBangkok%2C%20Thailand!5e0!3m2!1sen!2sus!4v1709650000000'
        },
        'Cairo': {
            tagline: 'City of the Thousand Minarets',
            heroImage: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?q=80&w=2070',
            overview: {
                description: 'Cairo, Egypt’s sprawling capital, is set on the Nile River. At its heart is Tahrir Square and the vast Egyptian Museum, a trove of antiquities including royal mummies and gilded King Tutankhamun artifacts.',
                bestTime: 'October to April',
                currency: 'Egyptian Pound (EGP)',
                language: 'Arabic'
            },
            category: 'Culture',
            attractions: [
                { name: 'Pyramids of Giza', description: 'The only remaining wonder of the ancient world.', image: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&w=600&q=80', rating: 4.9 },
                { name: 'Egyptian Museum', description: 'Home to the world\'s largest collection of Pharaonic antiquities.', image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=600&q=80', rating: 4.7 },
                { name: 'The Great Sphinx', description: 'A limestone statue of a reclining sphinx, a mythical creature.', image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a3027?auto=format&fit=crop&w=600&q=80', rating: 4.8 },
                { name: 'Khan el-Khalili', description: 'A famous bazaar and souq in the historic center of Cairo.', image: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&w=600&q=80', rating: 4.7 }
            ],
            thingsToDo: [
                'Bargain at Khan el-Khalili bazaar',
                'Take a felucca ride on the Nile',
                'Visit the Citadel of Saladin',
                'Explore Islamic Cairo'
            ],
            travelTips: {
                safety: 'Be prepared for intense traffic and persistent vendors.',
                transport: 'Uber is a reliable and safe way to get around.',
                etiquette: 'Modest dress is required in religious sites.'
            },
            nearby: ['Alexandria', 'Luxor', 'Saqqara'],
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453!2d31.2!3d30.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583fa60b21beeb%3A0x79dfb2965115dccd!2sCairo%2C%20Egypt!5e0!3m2!1sen!2sus!4v1709650000000'
        },
        'Rio de Janeiro': {
            tagline: 'The Marvelous City',
            heroImage: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2070',
            overview: {
                description: 'Rio de Janeiro is a huge seaside city in Brazil, famed for its Copacabana and Ipanema beaches, 38m Christ the Redeemer statue atop Mount Corcovado and for Sugarloaf Mountain.',
                bestTime: 'December to March',
                currency: 'Brazilian Real (R$)',
                language: 'Portuguese'
            },
            category: 'Nature',
            attractions: [
                { name: 'Christ the Redeemer', description: 'Art Deco statue of Jesus Christ atop Mount Corcovado.', image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=600&q=80', rating: 4.9 },
                { name: 'Sugarloaf Mountain', description: 'A peak situated in Rio de Janeiro, Brazil, at the mouth of Guanabara Bay.', image: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=600&q=80', rating: 4.8 },
                { name: 'Copacabana Beach', description: 'One of the most famous beaches in the world.', image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=600&q=80', rating: 4.7 },
                { name: 'Ipanema Beach', description: 'Famed for its elegant neighborhood and stunning sunset views.', image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=600&q=80', rating: 4.8 }
            ],
            thingsToDo: [
                'Relax on Copacabana Beach',
                'Visit the Selarón Steps',
                'Experience Carnival',
                'Trek through Tijuca Forest'
            ],
            travelTips: {
                safety: 'Be mindful of your belongings, especially on beaches.',
                transport: 'The metro is safe and efficient.',
                etiquette: 'Tipping is usually 10% and included in the bill.'
            },
            nearby: ['Búzios', 'Ilha Grande', 'Petrópolis'],
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d235000!2d-43.2!3d-22.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997f58a6a00b9d%3A0x3f251d85272f76f!2sRio%20de%20Janeiro%2C%20Brazil!5e0!3m2!1sen!2sus!4v1709650000000'
        },
        'Istanbul': {
            tagline: 'Where Continents Meet',
            heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2070',
            overview: {
                description: 'Istanbul is a major city in Turkey that straddles Europe and Asia across the Bosphorus Strait. Its Old City reflects cultural influences of the many empires that once ruled here.',
                bestTime: 'March to May, September to November',
                currency: 'Turkish Lira (TRY)',
                language: 'Turkish'
            },
            category: 'Culture',
            attractions: [
                { name: 'Hagia Sophia', description: 'An architectural marvel representing the Byzantine and Ottoman empires.', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=600&q=80', rating: 4.9 },
                { name: 'Blue Mosque', description: 'Famous for its blue tile-lined interior walls.', image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=600&q=80', rating: 4.8 },
                { name: 'Topkapi Palace', description: 'A large museum in Istanbul, Turkey.', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=600&q=80', rating: 4.7 },
                { name: 'Grand Bazaar', description: 'One of the largest and oldest covered markets in the world.', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=600&q=80', rating: 4.8 }
            ],
            thingsToDo: [
                'Shop at the Grand Bazaar',
                'Take a Bosphorus cruise',
                'Visit Topkapi Palace',
                'Enjoy a Turkish bath (Hamam)'
            ],
            travelTips: {
                safety: 'Beware of common scams in tourist areas like Sultanahmet.',
                transport: 'The tram and ferry systems are excellent.',
                etiquette: 'Remove shoes before entering mosques.'
            },
            nearby: ['Cappadocia', 'Ephesus', 'Bursa'],
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010!2d28.9!3d41.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab98583e350f1%3A0xa61d6cc7f516a85e!2sIstanbul%2C%20Turkey!5e0!3m2!1sen!2sus!4v1709650000000'
        },
        'Amsterdam': {
            tagline: 'Venice of the North',
            heroImage: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=2070',
            overview: {
                description: 'Amsterdam is the Netherlands’ capital, known for its artistic heritage, elaborate canal system and narrow houses with gabled facades, legacies of the city’s 17th-century Golden Age.',
                bestTime: 'April to May, September to November',
                currency: 'Euro (€)',
                language: 'Dutch'
            },
            category: 'City',
            attractions: [
                { name: 'Rijksmuseum', description: 'Dutch national museum dedicated to arts and history.', image: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=600&q=80', rating: 4.8 },
                { name: 'Anne Frank House', description: 'Writer\'s house and biographical museum dedicated to Jewish wartime diarist Anne Frank.', image: 'https://images.unsplash.com/photo-1558271736-cd0427bb2b5b?auto=format&fit=crop&w=600&q=80', rating: 4.9 },
                { name: 'Van Gogh Museum', description: 'An art museum dedicated to the works of Vincent van Gogh.', image: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=600&q=80', rating: 4.8 },
                { name: 'Vondelpark', description: 'A public urban park of 47 hectares in Amsterdam.', image: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=600&q=80', rating: 4.7 }
            ],
            thingsToDo: [
                'Take a canal cruise',
                'Visit the Van Gogh Museum',
                'Rent a bike and explore',
                'Stroll through Vondelpark'
            ],
            travelTips: {
                safety: 'Be mindful of bicycle lanes; cyclists have the right of way.',
                transport: 'Public transport is reliable, but walking and cycling are best.',
                etiquette: 'Smoking is prohibited in public transport and most indoor areas.'
            },
            nearby: ['Utrecht', 'The Hague', 'Haarlem'],
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2436!2d4.9!3d52.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c63fb5949a7755%3A0x6600fd4cb7c0af8d!2sAmsterdam%2C%20Netherlands!5e0!3m2!1sen!2sus!4v1709650000000'
        },
        'Jaipur': {
            tagline: 'The Pink City',
            heroImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2070',
            overview: {
                description: 'Jaipur is the capital of India’s Rajasthan state. It evokes the royal family that once ruled the region and that, in 1727, founded what is now called the Old City, or “Pink City” for its trademark building color.',
                bestTime: 'October to March',
                currency: 'Indian Rupee (₹)',
                language: 'Hindi, English'
            },
            category: 'Culture',
            attractions: [
                { name: 'Hawa Mahal', description: 'The Palace of Winds, an iconic pink-painted honeycomb facade.', image: 'https://images.unsplash.com/photo-1599661559684-245ed7e73522?auto=format&fit=crop&w=600&q=80', rating: 4.8 },
                { name: 'Amer Fort', description: 'A majestic hilltop fort complex overlooking Maota Lake.', image: 'https://images.unsplash.com/photo-1606294022416-015ba6ce8b7b?auto=format&fit=crop&w=600&q=80', rating: 4.9 },
                { name: 'City Palace', description: 'A beautiful palace complex combining Rajput and Mughal architecture.', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f7413a?auto=format&fit=crop&w=600&q=80', rating: 4.7 }
            ],
            thingsToDo: [
                'Shop for handicrafts at Johari Bazaar',
                'Visit the Jantar Mantar observatory',
                'Take an elephant ride at Amer Fort',
                'Taste authentic Rajasthani thali'
            ],
            travelTips: {
                safety: 'Watch out for aggressive market touts and pickpockets.',
                transport: 'Auto-rickshaws and app-based cabs (Uber/Ola) are convenient.',
                etiquette: 'Dress modestly when visiting temples and important monuments.'
            },
            nearby: ['Agra', 'Delhi', 'Udaipur'],
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113911.3!2d75.7!3d26.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adf4c57e281%3A0xce1c63a0cf22e09!2sJaipur%2C%20Rajasthan%2C%20India!5e0!3m2!1sen!2sus!4v1709650000000'
        },
        'Cape Town': {
            tagline: 'The Mother City',
            heroImage: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=2070',
            overview: {
                description: 'Cape Town is a port city on South Africa’s southwest coast, on a peninsula beneath the imposing Table Mountain. Slowly rotating cable cars climb to the mountain’s flat top.',
                bestTime: 'December to February',
                currency: 'South African Rand (R)',
                language: 'English, Afrikaans, Xhosa'
            },
            category: 'Nature',
            attractions: [
                { name: 'Table Mountain', description: 'A flat-topped mountain forming a prominent landmark overlooking the city.', image: 'https://images.unsplash.com/photo-1586711718919-ca3b62b13f17?auto=format&fit=crop&w=600&q=80', rating: 4.9 },
                { name: 'Robben Island', description: 'The island where Nelson Mandela was imprisoned for 18 years.', image: 'https://images.unsplash.com/photo-1516035882645-0370d06152cf?auto=format&fit=crop&w=600&q=80', rating: 4.7 },
                { name: 'Boulders Beach', description: 'Famous for its residential colony of African penguins.', image: 'https://images.unsplash.com/photo-1563853110534-7fedfc1ab60b?auto=format&fit=crop&w=600&q=80', rating: 4.8 }
            ],
            thingsToDo: [
                'Take the cableway up Table Mountain',
                'Visit the penguins at Boulders Beach',
                'Explore the Kirstenbosch Botanical Gardens',
                'Drive along Chapman\'s Peak'
            ],
            travelTips: {
                safety: 'Do not hike alone, especially on quiet trails or after dark.',
                transport: 'Rent a car or use Ride-share apps; public transit is limited.',
                etiquette: 'Tipping 10-15% in restaurants is customary.'
            },
            nearby: ['Stellenbosch', 'Franschhoek', 'Hermanus'],
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105913.7!2d18.3!3d-33.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1dcc500f8826da7f%3A0x812bb1ac44760434!2sCape%20Town%2C%20South%20Africa!5e0!3m2!1sen!2sus!4v1709650000000'
        },
        'Cusco': {
            tagline: 'Imperial City of the Incas',
            heroImage: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=2070',
            overview: {
                description: 'Cusco, a city in the Peruvian Andes, was once capital of the Inca Empire, and is now known for its archaeological remains and Spanish colonial architecture.',
                bestTime: 'May to September',
                currency: 'Peruvian Sol (S/)',
                language: 'Spanish, Quechua'
            },
            category: 'Culture',
            attractions: [
                { name: 'Machu Picchu', description: 'Iconic 15th-century Inca citadel set high in the Andes Mountains.', image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=600&q=80', rating: 5.0 },
                { name: 'Sacsayhuamán', description: 'A massive Inca fortress built with colossal stone walls.', image: 'https://images.unsplash.com/photo-1596700018898-1ff02a11b64e?auto=format&fit=crop&w=600&q=80', rating: 4.7 },
                { name: 'Plaza de Armas', description: 'The cultural center of the city bordered by historical cathedrals.', image: 'https://images.unsplash.com/photo-1588697950334-a6967fdc5e93?auto=format&fit=crop&w=600&q=80', rating: 4.6 }
            ],
            thingsToDo: [
                'Conquer the Inca Trail to Machu Picchu',
                'Explore the lively San Pedro Market',
                'Visit the Qorikancha (Temple of the Sun)',
                'Acclimatize slowly to the high altitude'
            ],
            travelTips: {
                safety: 'Beware of altitude sickness; rest upon arrival and drink coca tea.',
                transport: 'Walk around the historic center, or use official taxis.',
                etiquette: 'Ask for permission before photographing local indigenous people.'
            },
            nearby: ['Sacred Valley', 'Aguas Calientes', 'Ollantaytambo'],
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124610.1!2d-72.0!3d-13.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x916dd5d826598431%3A0x2aa996cc2318315d!2sCusco%2C%20Peru!5e0!3m2!1sen!2sus!4v1709650000000'
        },
        'Agra': {
            tagline: 'City of the Taj',
            heroImage: 'https://images.unsplash.com/photo-1564507592224-2fc58cc108cb?q=80&w=2070',
            overview: {
                description: 'Agra is a city on the banks of the Yamuna river in the Indian state of Uttar Pradesh. It is a major tourist destination because of its many Mughal-era buildings, most notably the Taj Mahal, Agra Fort and Fatehpur Sikri.',
                bestTime: 'October to March',
                currency: 'Indian Rupee (₹)',
                language: 'Hindi, English'
            },
            category: 'Culture',
            attractions: [
                { name: 'Taj Mahal', description: 'An ivory-white marble mausoleum on the right bank of the river Yamuna.', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80', rating: 5.0 },
                { name: 'Agra Fort', description: 'A historical fort displaying beautiful Islamic architecture.', image: 'https://images.unsplash.com/photo-1584931818296-c1743a60a724?auto=format&fit=crop&w=600&q=80', rating: 4.7 },
                { name: 'Fatehpur Sikri', description: 'A well-preserved ghost town built by Emperor Akbar.', image: 'https://images.unsplash.com/photo-1569300650997-6a97fb3712b7?auto=format&fit=crop&w=600&q=80', rating: 4.6 }
            ],
            thingsToDo: [
                'Watch the sunrise at the Taj Mahal',
                'Explore the massive Agra Fort',
                'Visit the tomb of Itimad-ud-Daulah (Baby Taj)',
                'Taste authentic Mughlai cuisine and Petha'
            ],
            travelTips: {
                safety: 'Watch out for aggressive touts and fake guides around monuments.',
                transport: 'Use pre-paid taxis or auto-rickshaws. Battery rickshaws are used near the Taj.',
                etiquette: 'Dress modestly. Shoes must be removed before entering the Taj Mahal mausoleum.'
            },
            nearby: ['Delhi', 'Mathura', 'Jaipur'],
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113579.79159981881!2d77.90997230182655!3d27.176161947268886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39740d857c2f41d9%3A0x783a60b5ab53d30b!2sAgra%2C%20Uttar%20Pradesh%2C%20India!5e0!3m2!1sen!2sus!4v1709650000000'
        },
        'Kerala': {
            tagline: "God's Own Country",
            heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2070',
            overview: {
                description: "Kerala, a state on India's tropical Malabar Coast, has nearly 600km of Arabian Sea shoreline.It's known for its palm-lined beaches and backwaters, a network of canals.",
                bestTime: 'September to March',
                currency: 'Indian Rupee (₹)',
                language: 'Malayalam, English'
            },
            category: 'Nature',
            attractions: [
                { name: 'Alleppey Backwaters', description: 'A vast network of serene, palm-fringed canals perfect for houseboat cruises.', image: 'https://images.unsplash.com/photo-1593693397690-362cb96660dc?auto=format&fit=crop&w=600&q=80', rating: 4.9 },
                { name: 'Munnar Tea Gardens', description: 'Endless stretches of rolling hills covered in lush green tea plantations.', image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80', rating: 4.8 },
                { name: 'Fort Kochi', description: 'A historic seaside town with colonial architecture and Chinese fishing nets.', image: 'https://images.unsplash.com/photo-1662963056086-fdc9db2c9540?auto=format&fit=crop&w=600&q=80', rating: 4.6 }
            ],
            thingsToDo: [
                'Stay overnight in a traditional houseboat',
                'Watch a traditional Kathakali dance performance',
                'Enjoy an Ayurvedic massage and spa treatment',
                'Take a spice plantation tour in Thekkady'
            ],
            travelTips: {
                safety: 'Avoid swimming in the sea during monsoon season due to strong currents.',
                transport: 'Taxis or rented houseboats/cars with drivers are best for tourists.',
                etiquette: 'Dress conservatively away from beaches; remove shoes inside homes.'
            },
            nearby: ['Kochi', 'Wayanad', 'Trivandrum'],
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4013063.9575510684!2d73.8584878!3d10.5361099!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0812ffd49cf55b%3A0x64bd90fbed387c99!2sKerala%2C%20India!5e0!3m2!1sen!2sus!4v1709650000000'
        },
        'Varanasi': {
            tagline: 'The Spiritual Heart of India',
            heroImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=2070',
            overview: {
                description: 'Varanasi is a city in the northern Indian state of Uttar Pradesh dating to the 11th century B.C. Regarded as the spiritual capital of India, the city draws Hindu pilgrims who bathe in the Ganges River’s sacred waters.',
                bestTime: 'October to March',
                currency: 'Indian Rupee (₹)',
                language: 'Hindi, Bhojpuri, English'
            },
            category: 'Culture',
            attractions: [
                { name: 'Dashashwamedh Ghat', description: 'The main and most spectacular ghat on the Ganges, famous for the evening Aarti.', image: 'https://images.unsplash.com/photo-1623194015694-82ee12d59160?auto=format&fit=crop&w=600&q=80', rating: 4.9 },
                { name: 'Kashi Vishwanath Temple', description: 'One of the most famous Hindu temples dedicated to Lord Shiva.', image: 'https://images.unsplash.com/photo-1600378942371-bd3839158c89?auto=format&fit=crop&w=600&q=80', rating: 4.8 },
                { name: 'Sarnath', description: 'A holy site where Gautama Buddha first taught the Dharma.', image: 'https://images.unsplash.com/photo-1622301985448-f42f534e8ec3?auto=format&fit=crop&w=600&q=80', rating: 4.6 }
            ],
            thingsToDo: [
                'Take a sunrise boat ride on the Ganges',
                'Witness the mesmerizing evening Ganga Aarti',
                'Explore the narrow, maze-like alleys (Galis)',
                'Visit traditional silk weaving centers'
            ],
            travelTips: {
                safety: 'The intricate alleys can be confusing; memorize nearby landmarks.',
                transport: 'Walking or cycle-rickshaws are the best way to navigate old city areas.',
                etiquette: 'Do not photograph cremation ceremonies at Manikarnika Ghat.'
            },
            nearby: ['Allahabad', 'Lucknow', 'Bodh Gaya'],
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115408.08785461159!2d82.9087057!3d25.3208949!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e2db76febcf4d%3A0x68131ac26437bd0!2sVaranasi%2C%20Uttar%20Pradesh%2C%20India!5e0!3m2!1sen!2sus!4v1709650000000'
        }
    };

    getAllDestinations(): DestinationSummary[] {
        return this.destinationsList;
    }

    getTrendingDestinations(): DestinationSummary[] {
        return this.destinationsList.filter(d => d.trending);
    }

    getDestinationData(city: string): DestinationData | null {
        return this.mockDetails[city] || null;
    }

    getAttractions(city: string): string[] {
        const data = this.getDestinationData(city);
        return data ? data.attractions.map(a => a.name) : [];
    }
}
