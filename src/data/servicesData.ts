import { ServiceItem } from "@/types/services";

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "service-shirdi-local-taxi",
    slug: "shirdi-local-taxi",
    title: "Shirdi Local Taxi & Cab Service",
    shortDescription: "Temple pickups, Sai Ashram transfers, hotel drops, and point-to-point local cab travel within Shirdi.",
    fullOverview:
      "Our Shirdi Local Taxi service is built for devotees, families, and visitors who need punctual, clean, and reliable local transportation in the holy town of Shirdi. Whether you require a quick transfer from Sai Ashram (Bhakta Niwas) to the Sai Baba Samadhi Mandir, a hotel pickup, or an errand cab around town, our owned Ertiga and local cabs are available around the clock.",
    category: "local",
    iconName: "Car",
    suitableFor: ["Pilgrims & Devotees", "Families with Elderly & Children", "Solo Travellers", "Hotel Guests"],
    recommendedVehicleCategorySlugs: ["suv-muv-ertiga", "muv-tavera", "sedan"],
    keyHighlights: [
      "Doorstep pickup from Sai Ashram (1000 Rooms), hotels & railway station",
      "Air-conditioned, clean, and sanitized vehicles",
      "Drivers with complete knowledge of temple entry gates and timings",
      "Flexible hourly packages & point-to-point local transfers",
    ],
    coverageAreas: [
      "Shirdi Sai Baba Samadhi Mandir & Dwarakamai",
      "Sai Ashram (Bhakta Niwas 1000 Rooms) & 500 Rooms",
      "Sainagar Shirdi Railway Station",
      "All Shirdi Hotels, Lodges & Resorts on Pimpalwadi / Nagar-Manmad Road",
      "Khandoba Mandir & Gurusthan Area",
    ],
    howItWorks: [
      {
        stepNumber: 1,
        title: "Share Your Pickup Location",
        description: "Tell us where you are staying in Shirdi (hotel, ashram, or railway station) and your preferred pickup time.",
      },
      {
        stepNumber: 2,
        title: "Select Vehicle Type",
        description: "Choose between our owned Ertiga (6-seater), Tavera (7-8 seater), or a compact sedan based on your family size.",
      },
      {
        stepNumber: 3,
        title: "Receive Upfront Fare Quote",
        description: "We provide an exact, transparent quote with zero hidden charges or surge pricing.",
      },
      {
        stepNumber: 4,
        title: "Prompt Doorstep Cab",
        description: "Your driver arrives punctually at your location for a peaceful, stress-free temple visit.",
      },
    ],
    faqs: [
      {
        question: "Can I book a local taxi for early morning Kakad Aarti?",
        answer: "Yes, our local cabs operate 24 hours. We recommend letting us know the previous evening so your cab is waiting outside your hotel or ashram on time.",
      },
      {
        question: "Do you provide pickup from Sainagar Shirdi Railway Station?",
        answer: "Yes, we provide direct railway station pickups and drop-offs to all hotels and ashrams in Shirdi.",
      },
      {
        question: "Are your vehicles air-conditioned?",
        answer: "Yes, all our owned Ertiga, Tavera, and network vehicles are fully air-conditioned.",
      },
    ],
    seoTitle: "Shirdi Local Taxi & Cab Service | Sai Baba Temple & Hotel Transfers",
    seoDescription: "Book local taxi in Shirdi with Sai Shraddha Tours & Travels. Clean Ertiga & Tavera cabs for Sai Baba temple visits, Sai Ashram transfers, and hotel pickups.",
    ctaLabel: "Book a Local Taxi",
  },
  {
    id: "service-shirdi-sightseeing",
    slug: "shirdi-sightseeing",
    title: "Shirdi Local Sightseeing & Temple Tour",
    shortDescription: "Half-day and full-day guided temple sightseeing covering Dwarkamai, Chavadi, Khandoba Temple, Gurusthan, and Lendi Baug.",
    fullOverview:
      "Explore the sacred footsteps of Shri Sai Baba with our comprehensive Shirdi sightseeing cab service. Designed for families wishing to visit all sacred historical places associated with Baba's life in Shirdi without rushing, our experienced drivers navigate parking and temple vicinity traffic with ease.",
    category: "local",
    iconName: "Compass",
    suitableFor: ["Devotees on First Shirdi Visit", "Families & Senior Citizens", "Spiritual Yatra Groups"],
    recommendedVehicleCategorySlugs: ["suv-muv-ertiga", "muv-tavera", "tempo-traveller"],
    keyHighlights: [
      "Covers all primary Sai heritage locations in Shirdi",
      "Unhurried pacing allowing peaceful meditation and prayer",
      "Door-to-door cab waiting service throughout the tour",
      "Knowledgeable local driver guiding temple surroundings",
    ],
    coverageAreas: [
      "Shri Sai Baba Samadhi Mandir Complex",
      "Dwarkamai (Sacred Dhuni & Baba's residence)",
      "Chavadi (Where Baba slept on alternate nights)",
      "Gurusthan (Neem tree under which Baba first appeared)",
      "Lendi Baug (Sacred garden & Nanda Deep)",
      "Khandoba Mandir (Where Mhalsapati first addressed Baba)",
      "Upasani Maharaj Ashram & Sakori (on request)",
    ],
    howItWorks: [
      {
        stepNumber: 1,
        title: "Choose Half-Day or Full-Day",
        description: "Select whether you want a concise 3-4 hour temple tour or a relaxed full-day sightseeing itinerary.",
      },
      {
        stepNumber: 2,
        title: "Pick Your Family Vehicle",
        description: "Choose an Ertiga, Tavera, or Tempo Traveller to keep your entire family comfortably together.",
      },
      {
        stepNumber: 3,
        title: "Convenient Doorstep Pickup",
        description: "The driver picks you up from your hotel or ashram and remains with you across all temple stops.",
      },
      {
        stepNumber: 4,
        title: "Return Drop at Hotel",
        description: "After completing your sightseeing and shopping, the cab drops you back at your stay.",
      },
    ],
    faqs: [
      {
        question: "How long does the complete Shirdi local sightseeing tour take?",
        answer: "A standard local sightseeing tour takes approximately 3 to 4 hours, depending on darshan queue times.",
      },
      {
        question: "Can we include Sakori Ashram or nearby temples in the tour?",
        answer: "Yes, you can easily customize the sightseeing itinerary to include Sakori Ashram, Khandoba temple, or nearby spiritual spots.",
      },
    ],
    seoTitle: "Shirdi Sightseeing Cab Service | Dwarkamai, Chavadi & Temple Tour",
    seoDescription: "Explore Shirdi holy places with Sai Shraddha Tours & Travels. Half-day and full-day sightseeing cabs for Dwarkamai, Chavadi, Gurusthan, and Khandoba Temple.",
    ctaLabel: "Plan Sightseeing Tour",
  },
  {
    id: "service-outstation-taxi",
    slug: "outstation-taxi",
    title: "Outstation Taxi & Cab Service",
    shortDescription: "Dependable one-way and roundtrip highway cab service connecting Shirdi to Nashik, Mumbai, Pune, Aurangabad, and beyond.",
    fullOverview:
      "Sai Shraddha Tours & Travels provides professional outstation cab services from Shirdi across Maharashtra. Operating continuously since 2014, our highway drivers are experienced, polite, and familiar with the best routes, including the new Samruddhi Mahamarg expressway for fast and safe connectivity to Mumbai, Nagpur, and Aurangabad.",
    category: "outstation",
    iconName: "Navigation",
    suitableFor: ["Families Travelling Inter-City", "Airport Connections", "Pilgrims on Multi-City Tours", "Corporate Travel"],
    recommendedVehicleCategorySlugs: ["suv-muv-ertiga", "muv-tavera", "sedan", "tempo-traveller"],
    keyHighlights: [
      "One-way drops and multi-day round-trip options",
      "Smooth highway travel via Samruddhi Mahamarg & national highways",
      "Regularly maintained owned Ertiga & Tavera fleet",
      "Transparent upfront quotes with no surprise driver charges",
    ],
    coverageAreas: [
      "Shirdi to Nashik & Trimbakeshwar (115 km)",
      "Shirdi to Mumbai / Thane / Navi Mumbai (240 km)",
      "Shirdi to Pune / Chakan / Hinjawadi (200 km)",
      "Shirdi to Aurangabad / Chhatrapati Sambhajinagar (110 km)",
      "Shirdi to Shani Shingnapur (72 km)",
      "Shirdi to Manmad Junction Railway Station (60 km)",
      "Shirdi to Bhimashankar, Pandharpur, and Western Maharashtra",
    ],
    howItWorks: [
      {
        stepNumber: 1,
        title: "Tell Us Your Destination",
        description: "Specify your drop city, intermediate temple halts, and whether you require a one-way or round-trip cab.",
      },
      {
        stepNumber: 2,
        title: "Select Travel Date & Passengers",
        description: "Share your travel date and group size so we allocate the best suited air-conditioned vehicle.",
      },
      {
        stepNumber: 3,
        title: "Get Fixed Transparent Quotation",
        description: "We provide an all-inclusive or per-km quotation with clear toll and parking terms.",
      },
      {
        stepNumber: 4,
        title: "Safe Highway Journey",
        description: "Travel comfortably with an experienced highway driver who prioritizes your safety and comfort.",
      },
    ],
    faqs: [
      {
        question: "Can I book a one-way cab from Shirdi to Mumbai or Pune?",
        answer: "Yes, we provide dedicated one-way drops from Shirdi to Mumbai, Pune, Nashik, Aurangabad, and other major cities.",
      },
      {
        question: "Are toll taxes and parking charges included in the quote?",
        answer: "We explain toll and parking terms clearly in your quote so there are no unexpected costs at the end of your trip.",
      },
      {
        question: "Can we take rest stops on long highway journeys?",
        answer: "Yes, our drivers are courteous and will stop at clean, hygienic restaurants and restrooms along the highway as requested.",
      },
    ],
    seoTitle: "Outstation Taxi From Shirdi | Cabs to Nashik, Mumbai, Pune, Aurangabad",
    seoDescription: "Book reliable outstation cabs from Shirdi with Sai Shraddha Tours & Travels. Clean Ertiga, Tavera, and Sedan taxis for one-way and round trips across Maharashtra.",
    ctaLabel: "Get an Outstation Quote",
  },
  {
    id: "service-airport-transfer",
    slug: "airport-transfer",
    title: "Airport Pickup & Drop Taxi Service",
    shortDescription: "Punctual airport transfer services for Shirdi Airport (SAG Kakadi), Mumbai (BOM), Pune (PNQ), and Nashik (ISK) airports.",
    fullOverview:
      "Never miss a flight or wait endlessly at the arrival terminal. Our Airport Transfer service provides timely, pre-booked airport cabs from Shirdi directly to Shirdi Airport (SAG), Mumbai International Airport (CSMIA BOM), Pune Airport (PNQ), and Nashik Airport (ISK). We track flight arrivals to ensure your driver is on-ground when you touch down.",
    category: "airport",
    iconName: "Plane",
    suitableFor: ["Air Travellers", "Weekend Pilgrims", "Business Guests", "NRI & Out-of-State Devotees"],
    recommendedVehicleCategorySlugs: ["suv-muv-ertiga", "sedan", "luxury-cars"],
    keyHighlights: [
      "24/7 dedicated cabs for early morning & late night flights",
      "Shirdi Airport (Kakadi - 14 km) transfers in under 25 minutes",
      "Doorstep hotel / ashram pickup and airport drop",
      "Luggage loading and flight arrival coordination",
    ],
    coverageAreas: [
      "Shirdi Airport (SAG - Kakadi)",
      "Mumbai Chhatrapati Shivaji Maharaj International Airport (BOM - Terminal 1 & 2)",
      "Pune International Airport (PNQ - Lohegaon)",
      "Nashik Airport (ISK - Ozar)",
    ],
    howItWorks: [
      {
        stepNumber: 1,
        title: "Share Flight Schedule",
        description: "Provide your flight departure/arrival time and airline details for precise timing.",
      },
      {
        stepNumber: 2,
        title: "Choose Luggage-Appropriate Cab",
        description: "Select an Ertiga or Tavera for family luggage or a sedan for light travel.",
      },
      {
        stepNumber: 3,
        title: "Driver Details Shared in Advance",
        description: "You receive driver contact and vehicle information well ahead of your travel.",
      },
      {
        stepNumber: 4,
        title: "On-Time Arrival Guarantee",
        description: "Your cab arrives with ample buffer time to ensure a relaxed check-in at the airport.",
      },
    ],
    faqs: [
      {
        question: "How far is Shirdi Airport (Kakadi) from Shirdi Sai Baba Temple?",
        answer: "Shirdi Airport is approximately 14 km from the town center and takes around 20 to 25 minutes by cab.",
      },
      {
        question: "What if my arrival flight is delayed?",
        answer: "We monitor flight status where flight details are shared with us, and your driver will adjust arrival timing accordingly.",
      },
    ],
    seoTitle: "Shirdi Airport Taxi Service | Cab Pickup & Drop at Shirdi, Mumbai, Pune Airports",
    seoDescription: "Book punctual Shirdi Airport taxi transfers with Sai Shraddha Tours & Travels. 24/7 airport drops and pickups for Shirdi (SAG), Mumbai (BOM), and Pune (PNQ).",
    ctaLabel: "Book Airport Transfer",
  },
  {
    id: "service-pilgrimage-tours",
    slug: "pilgrimage-tours",
    title: "Pilgrimage & Sacred Darshan Tours",
    shortDescription: "Curated spiritual yatra packages covering Shani Shingnapur, Trimbakeshwar Jyotirlinga, Grishneshwar, and 5 Maharashtra Jyotirlingas.",
    fullOverview:
      "For over a decade since 2014, pilgrimage travel has been the spiritual heart of Sai Shraddha Tours & Travels. We specialize in organized holy darshan tours originating from Shirdi. From same-day darshans at Shani Shingnapur to multi-day yatra circuits covering the 5 Jyotirlingas in Maharashtra, our service is tailored for devotees seeking a peaceful, unhurried, and blessed experience.",
    category: "pilgrimage",
    iconName: "Compass",
    suitableFor: ["Family Pilgrims", "Senior Citizens & Parents", "Devotee Groups & Sanghas", "Spiritual Yatris"],
    recommendedVehicleCategorySlugs: ["suv-muv-ertiga", "muv-tavera", "tempo-traveller", "mini-bus-coach"],
    keyHighlights: [
      "Experienced drivers with full knowledge of temple rituals, aarti, and darshan rules",
      "Gentle driving and ample rest breaks suited for elderly parents",
      "Pre-planned holy itineraries saving valuable travel time",
      "Doorstep pickup and return drop to Shirdi stays",
    ],
    coverageAreas: [
      "Shani Shingnapur (Holy Shani Dev Temple - 72 km)",
      "Trimbakeshwar Jyotirlinga & Kushavarta Tirtha (Nashik - 115 km)",
      "Grishneshwar Jyotirlinga (12th Jyotirlinga near Ellora - 110 km)",
      "Bhimashankar Jyotirlinga (Sahyadri Hills - 185 km)",
      "Aundha Nagnath & Parli Vaijnath Jyotirlingas (Marathwada)",
      "Vani Saptashrungi Mata Shaktipeeth (140 km)",
      "Pandharpur Vitthal Rukmini Mandir (340 km)",
    ],
    howItWorks: [
      {
        stepNumber: 1,
        title: "Select Your Pilgrimage Circuit",
        description: "Choose one of our popular day circuits (e.g. Shani Shingnapur or Trimbakeshwar) or request a custom multi-day yatra.",
      },
      {
        stepNumber: 2,
        title: "Discuss Dates & Special Needs",
        description: "Tell Ramesh Shep (Owner) if you have elderly devotees, wheelchair needs, or specific temple aarti timings.",
      },
      {
        stepNumber: 3,
        title: "Receive Customized Yatra Plan",
        description: "We provide an organized day-by-day travel schedule with estimated driving times and clear fares.",
      },
      {
        stepNumber: 4,
        title: "Embark on a Peaceful Pilgrimage",
        description: "Travel with an experienced local driver devoted to making your family's darshan smooth and blessed.",
      },
    ],
    faqs: [
      {
        question: "Can we complete Shirdi, Shani Shingnapur, and Trimbakeshwar in 2 days?",
        answer: "Yes, this is our most popular 2-day pilgrimage itinerary. Day 1 covers Shirdi and Shani Shingnapur, while Day 2 covers Nashik and Trimbakeshwar Jyotirlinga.",
      },
      {
        question: "Do your drivers assist senior citizens during the trip?",
        answer: "Yes, our drivers are known for their polite demeanor, patience, and assistance with luggage and boarding for elderly devotees.",
      },
    ],
    seoTitle: "Pilgrimage Tours From Shirdi | Shani Shingnapur, Trimbakeshwar & Jyotirlinga Cabs",
    seoDescription: "Book Shirdi pilgrimage tour cabs with Sai Shraddha Tours & Travels. Dedicated darshan packages for Shani Shingnapur, Trimbakeshwar, Grishneshwar, and Maharashtra Jyotirlingas.",
    ctaLabel: "Plan a Pilgrimage",
  },
  {
    id: "service-group-transportation",
    slug: "group-transportation",
    title: "Group Transportation & Tempo Travellers",
    shortDescription: "Spacious 13, 17, 20 & 26-seater Tempo Travellers, mini-buses, and tour coaches for yatra sanghas, wedding groups, and family tours.",
    fullOverview:
      "When travelling with large joint families, bhajan mandals, community groups, or wedding parties, keeping everyone together in a single spacious vehicle makes the journey joyous and economical. We arrange high-quality AC Tempo Travellers (13 to 26 seaters) and 22 to 53 seater buses through our verified network, driven by experienced heavy-vehicle commercial drivers.",
    category: "group",
    iconName: "Users",
    suitableFor: ["Large Joint Families", "Pilgrim Groups & Yatri Sanghas", "School & College Excursions", "Wedding Guests"],
    recommendedVehicleCategorySlugs: ["tempo-traveller", "mini-bus-coach"],
    keyHighlights: [
      "Push-back luxury reclining seats with ample leg space",
      "High-power dual air conditioning throughout the passenger cabin",
      "Dedicated overhead racks and rear luggage storage",
      "Music systems, PA mic, and mobile phone charging sockets",
    ],
    coverageAreas: [
      "All Shirdi temple circuits and sightseeing",
      "Maharashtra 5 Jyotirlinga Group Yatras",
      "Ashtavinayak & Pandharpur Group Tours",
      "Mumbai & Pune Group Pickups and Drops",
      "Shirdi Wedding & Event Shuttles",
    ],
    howItWorks: [
      {
        stepNumber: 1,
        title: "Specify Group Size & Luggage",
        description: "Let us know the number of passengers and luggage count so we recommend the ideal seating layout (13, 17, 20, 26, or 32+).",
      },
      {
        stepNumber: 2,
        title: "Share Route Itinerary",
        description: "Tell us your planned stops, overnight stay points, and duration.",
      },
      {
        stepNumber: 3,
        title: "Receive Group Quote",
        description: "We give a comprehensive quotation covering vehicle hire, driver allowance, and route permits.",
      },
      {
        stepNumber: 4,
        title: "Coordinated Group Departure",
        description: "Your sanitized Tempo Traveller or Bus arrives punctually at your Shirdi pickup point for an enjoyable group trip.",
      },
    ],
    faqs: [
      {
        question: "What Tempo Traveller seating capacities are available?",
        answer: "We arrange 13-seater, 17-seater, 20-seater, and 26-seater luxury Tempo Travellers with push-back seats and AC.",
      },
      {
        question: "How far in advance should we book a Tempo Traveller?",
        answer: "We recommend booking at least 3 to 7 days in advance, especially during peak pilgrimage seasons (Diwali, Gurupurnima, Year-End, long weekends).",
      },
    ],
    seoTitle: "Tempo Traveller in Shirdi | 13, 17, 20 Seater AC Vans & Bus Hire",
    seoDescription: "Hire AC Tempo Travellers and mini buses in Shirdi with Sai Shraddha Tours & Travels. 13-26 seater luxury vans for family groups, yatra sanghas, and wedding travel.",
    ctaLabel: "Arrange Group Travel",
  },
  {
    id: "service-corporate-event-travel",
    slug: "corporate-event-travel",
    title: "Corporate, Wedding & Event Travel",
    shortDescription: "Multi-vehicle fleet coordination for Shirdi destination weddings, corporate pilgrimages, executive conferences, and VIP transit.",
    fullOverview:
      "Shirdi is a prominent destination for religious weddings, family celebrations, and corporate executive retreats. Sai Shraddha Tours & Travels manages end-to-end multi-vehicle ground transportation for corporate teams, wedding parties, and event attendees, providing dedicated on-ground coordination from our Shirdi office.",
    category: "event",
    iconName: "Briefcase",
    suitableFor: ["Wedding Families & Event Planners", "Corporate Teams & Executives", "Conference Delegations", "VIP Guests"],
    recommendedVehicleCategorySlugs: ["suv-muv-ertiga", "luxury-cars", "tempo-traveller", "mini-bus-coach"],
    keyHighlights: [
      "Multi-vehicle fleet dispatch (Sedans, Ertigas, Innovas, Tempo Travellers)",
      "Coordinated guest airport / railway station shuttles",
      "Dedicated Shirdi transport coordinator on-call 24/7",
      "Proper invoicing, GST billing, and transparent corporate payment support",
    ],
    coverageAreas: [
      "All Shirdi Wedding Lawns, Banquet Halls & Resorts",
      "Shirdi Airport & Sainagar Railway Station Guest Shuttles",
      "Executive transfers between Mumbai / Pune IT Hubs and Shirdi",
      "Industrial visits to Kopargaon, Sangamner, Nashik, and Supa MIDC",
    ],
    howItWorks: [
      {
        stepNumber: 1,
        title: "Submit Event Details",
        description: "Share the event dates, estimated guest count, arrival schedules, and vehicle preferences.",
      },
      {
        stepNumber: 2,
        title: "Fleet Allocation Plan",
        description: "We prepare a structured vehicle plan combining executive SUVs, family MUVs, and guest shuttles.",
      },
      {
        stepNumber: 3,
        title: "Transparent Event Quote",
        description: "Receive a consolidated multi-vehicle proposal with clear daily and mileage rates.",
      },
      {
        stepNumber: 4,
        title: "Seamless On-Ground Dispatch",
        description: "Our team coordinates all drivers and timing to ensure your guests travel in comfort without delays.",
      },
    ],
    faqs: [
      {
        question: "Can you provide multiple cabs for a 2-day wedding in Shirdi?",
        answer: "Yes, we regularly coordinate multi-vehicle fleet arrangements for weddings, managing airport shuttles, local guest transfers, and outstation drops.",
      },
      {
        question: "Do you offer GST billing for corporate bookings?",
        answer: "Yes, official invoices and GST receipts are provided for all corporate and event transportation.",
      },
    ],
    seoTitle: "Corporate & Wedding Transportation in Shirdi | Fleet Hire & Event Cabs",
    seoDescription: "Book corporate car rentals and wedding transportation in Shirdi with Sai Shraddha Tours & Travels. Multi-vehicle dispatch, executive SUVs, and guest shuttles.",
    ctaLabel: "Discuss Event Requirements",
  },
  {
    id: "service-customized-tours",
    slug: "customized-tours",
    title: "Customized & Tailored Tours",
    shortDescription: "Personalized holiday and pilgrimage itineraries crafted around your family's exact destinations, dates, and pacing.",
    fullOverview:
      "Don't want a rigid predefined tour package? Our Customized Tours service gives you total freedom to design your own journey from Shirdi. Tell us the destinations you want to visit, the days you have available, and your group size. Ramesh Shep (Owner) will help plan the most practical driving route, recommend comfortable overnight stops, and allocate the right vehicle.",
    category: "custom",
    iconName: "Compass",
    suitableFor: ["Families Wanting Unique Itineraries", "Multi-Destination Holidays", "Travellers with Special Route Plans"],
    recommendedVehicleCategorySlugs: ["suv-muv-ertiga", "muv-tavera", "sedan", "tempo-traveller"],
    keyHighlights: [
      "100% flexibility in route, stops, and duration",
      "Expert local advice on road conditions and driving times",
      "Combine spiritual darshan with scenic hill stations (e.g. Shirdi + Bhandardara / Mahabaleshwar)",
      "Direct consultation with business owners",
    ],
    coverageAreas: [
      "Custom Maharashtra Pilgrimage & Heritage Circuits",
      "Shirdi + Ajanta & Ellora + Lonar Crater Tours",
      "Shirdi + Lonavala, Khandala & Mahabaleshwar Holiday Circuits",
      "Any custom inter-district route across Maharashtra",
    ],
    howItWorks: [
      {
        stepNumber: 1,
        title: "Tell Us Your Dream Route",
        description: "Share the places you wish to visit, your arrival date in Shirdi, and total trip days.",
      },
      {
        stepNumber: 2,
        title: "Route & Pacing Consultation",
        description: "We optimize your itinerary to minimize tiring highway hours and maximize darshan / sightseeing time.",
      },
      {
        stepNumber: 3,
        title: "Customized All-Inclusive Quote",
        description: "Receive a clear quote tailored specifically to your custom itinerary.",
      },
      {
        stepNumber: 4,
        title: "Travel on Your Own Schedule",
        description: "Enjoy complete freedom on the road with a dedicated vehicle and patient driver at your service.",
      },
    ],
    faqs: [
      {
        question: "Can we change our intermediate stops during the journey?",
        answer: "Yes, within reasonable route limits, our drivers will accommodate your family's stop requests and sightseeing preferences.",
      },
      {
        question: "Can you help plan where to take overnight halts?",
        answer: "Yes, based on over a decade of highway experience, we can guide you on the most comfortable towns and hotel locations to halt overnight.",
      },
    ],
    seoTitle: "Customized Tour Packages From Shirdi | Tailor-Made Maharashtra Cab Tours",
    seoDescription: "Plan your personalized holiday and pilgrimage tour from Shirdi with Sai Shraddha Tours & Travels. Flexible custom routes, clean AC vehicles, and honest quotes.",
    ctaLabel: "Plan My Custom Trip",
  },
];
