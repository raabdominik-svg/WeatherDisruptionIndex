// ════════════════════════════════════════
// WEATHER DISRUPTION INDEX - REGIONAL DATA
// WDS = (WSI * 0.6) + (TVI * 0.4)
// ════════════════════════════════════════

const REGIONS = {
  "north-america": {
    x: 180, y: 150,
    name: "North America",
    cluster: "Americas",
    sub: "United States · Canada · Mexico coasts",
    wsi: 62, tvi: 44,
    subindex: { intensityDelta: 68, duration: 65, predictability: 54, infraSensitivity: 40, resourceDependency: 38, peakSeasonality: 58 },
    anomaly: "A strengthened Pacific Jet Stream is producing above-average precipitation across the US Southwest and a persistent drought anomaly in the Southeast. California and the Pacific Northwest face competing signals: wet winters but accelerated spring snowmelt triggering early flooding, while summer monsoon season is extending further north than historical patterns.",
    flights: { level: "medium", desc: "Cross-continental hubs (LAX, ORD, MIA) face elevated convective delay risk. Southwest monsoon season extending further north creates turbulence windows. Trans-Pacific routes see minor tail wind benefits. Average disruption: 2.1 days/month." },
    accommodation: { level: "low", desc: "US and Canadian infrastructure is well-adapted. Some coastal properties in Florida and the Gulf face flash-flood advisories. Wildfire smoke events may force temporary air quality restrictions at some mountain properties in the West." },
    experiences: { level: "medium", desc: "National parks in the West face early wildfire season restrictions. Coastal whale watching and dive tours in Baja California are disrupted by warmer-than-usual water temperatures. Hiking conditions in the Rockies are favorable overall." },
    trend: "up"
  },

  "caribbean": {
    x: 260, y: 230,
    name: "Caribbean Basin",
    cluster: "Americas",
    sub: "Islands · Reef systems · Cruise corridors",
    wsi: 78, tvi: 82,
    subindex: { intensityDelta: 84, duration: 72, predictability: 78, infraSensitivity: 88, resourceDependency: 85, peakSeasonality: 74 },
    anomaly: "Sea surface temperatures across the Caribbean are running 2.1°C above the 1991–2020 average, triggering a mass coral bleaching event across the Mesoamerican Barrier Reef and affecting cruise-line operations. Hurricane season onset is tracking toward above-normal activity with 4–5 additional storms forecast.",
    flights: { level: "high", desc: "Hurricane season disruption is severe. San Juan (SJU), Nassau (NAS), and Montego Bay (MBJ) are reporting an average 4.2 significant disruption days per month. Island-hopper routes face frequent weather holds. Cancellation rate: 7.3%." },
    accommodation: { level: "high", desc: "Repeat storm events in June–August have already caused partial structural damage to properties across Turks & Caicos and the Leeward Islands. Power grid instability is forcing rolling outages. Insurance claims on the rise." },
    experiences: { level: "high", desc: "Coral bleaching has closed 60% of certified dive sites across the Cayman Islands and Belize. Reef tours are suspended or rerouted to deeper cooler-water sites. Beach conditions deteriorating due to sargassum bloom." },
    trend: "up"
  },

  "central-america": {
    x: 220, y: 250,
    name: "Central America",
    cluster: "Americas",
    sub: "Costa Rica · Panama · Guatemala · Honduras",
    wsi: 74, tvi: 78,
    subindex: { intensityDelta: 78, duration: 76, predictability: 68, infraSensitivity: 82, resourceDependency: 80, peakSeasonality: 72 },
    anomaly: "El Niño is producing a severe Pacific coast dry season extension and dramatically enhanced Caribbean slope rainfall. Costa Rica's Central Valley is experiencing the longest dry period since 1998, while the Atlantic side records 180% of normal precipitation, creating landslide risks.",
    flights: { level: "medium", desc: "Tocumen (PTY) and Juan Santamaría (SJO) face elevated convective delays in the afternoon hours throughout the rainy season. No major route suspensions but scheduled delays averaging 45 minutes. Domestic turbulence advisories frequent." },
    accommodation: { level: "high", desc: "Hydropower shortfalls are causing rolling outages across rural eco-lodges and some urban hotels. Pacific coast properties face unusual dry-season heat with water restrictions. Caribbean-side properties report flooding risks." },
    experiences: { level: "high", desc: "Rainforest canopy tours and river rafting operations are severely disrupted. Pacific surf breaks are unusually flat due to altered swell patterns. Cloud forest visibility reduced by atmospheric changes; bird-watching conditions degraded." },
    trend: "up"
  },

  "south-america": {
    x: 280, y: 350,
    name: "South America",
    cluster: "Americas",
    sub: "Amazon · Patagonia · Andes · Brazil coast",
    wsi: 70, tvi: 66,
    subindex: { intensityDelta: 74, duration: 72, predictability: 64, infraSensitivity: 62, resourceDependency: 72, peakSeasonality: 58 },
    anomaly: "The 2026 El Niño is producing severe Amazon drought conditions, with river levels on the Rio Negro at multi-decadal lows severely curtailing river cruise operations. Northern and Central Brazil face exceptional heat; southern regions experience unusual cold fronts due to polar vortex displacement.",
    flights: { level: "medium", desc: "Fog and convective activity around São Paulo (GRU) and Buenos Aires (EZE) are producing above-average delay rates. Amazonian regional routes face limited visibility windows. LATAM and TAM disruptions: 3.2 days/month average." },
    accommodation: { level: "medium", desc: "River cruise accommodations on the Amazon and Pantanal are severely constrained by low water levels. Buenos Aires and São Paulo city hotels are largely unaffected. Patagonian lodges see variable conditions." },
    experiences: { level: "high", desc: "Amazon river dolphin watching and jungle tours are suspended across the Manaus corridor due to record low water. Iguazu Falls is running at 220% normal volume creating safety concerns. Trekking in Patagonia affected by unseasonable weather." },
    trend: "up"
  },

  "northern-europe": {
    x: 480, y: 100,
    name: "Northern Europe",
    cluster: "Europe & Mediterranean",
    sub: "Scandinavia · UK · Netherlands · Baltics",
    wsi: 38, tvi: 30,
    subindex: { intensityDelta: 42, duration: 35, predictability: 38, infraSensitivity: 28, resourceDependency: 25, peakSeasonality: 38 },
    anomaly: "Northern Europe is experiencing a mildly positive El Niño teleconnection with drier, warmer summer conditions across Scandinavia and the UK. While this is a net positive for summer tourism, it represents a departure from historical norms and may affect high-altitude hiking routes.",
    flights: { level: "low", desc: "European hub performance at LHR, AMS, and CPH is close to historical norms. Summer convective activity slightly elevated but well within infrastructure tolerance. Transatlantic routings showing minor delay reductions." },
    accommodation: { level: "low", desc: "Infrastructure is broadly robust. Some urban hotels in London, Amsterdam, and Stockholm are activating heat emergency protocols during peak summer weeks. Overall resilience is excellent." },
    experiences: { level: "low", desc: "Scandinavian fjord cruising and hiking conditions are broadly positive. UK coastal tourism is benefiting from warmer temperatures. Scottish Highlands midges may intensify slightly due to warmth." },
    trend: "flat"
  },

  "mediterranean": {
    x: 500, y: 160,
    name: "Mediterranean Basin",
    cluster: "Europe & Mediterranean",
    sub: "Spain · Italy · Greece · Turkey · Morocco · Tunisia",
    wsi: 82, tvi: 76,
    subindex: { intensityDelta: 88, duration: 82, predictability: 76, infraSensitivity: 72, resourceDependency: 80, peakSeasonality: 76 },
    anomaly: "The Mediterranean is experiencing its most severe El Niño–amplified heat summer on record. Western Mediterranean SSTs are at +2.8°C anomaly, driving marine heatwave conditions that have triggered multiple health warnings and infrastructure stress across southern Europe.",
    flights: { level: "medium", desc: "Heat-related ground delays at Athens (ATH), Rome (FCO), and Palma (PMI) are occurring on peak heat days above 42°C. Aircraft performance limits require weight reductions. Delays averaging 1.8 hours on extreme days." },
    accommodation: { level: "high", desc: "Water rationing is in effect across Greek islands, southern Spain, and parts of Turkey. Air conditioning strain is causing grid instability in peak periods. Several properties implementing water conservation protocols." },
    experiences: { level: "high", desc: "Jellyfish blooms are affecting beach quality across Spain, Italy, and Greece. Underwater visibility on popular dive sites degraded by thermal stratification. Outdoor activities restricted during peak heat windows (11am–4pm)." },
    trend: "up"
  },

  "middle-east": {
    x: 580, y: 190,
    name: "Middle East & Gulf",
    cluster: "Europe & Mediterranean",
    sub: "UAE · Saudi Arabia · Jordan · Oman · Red Sea",
    wsi: 55, tvi: 72,
    subindex: { intensityDelta: 60, duration: 58, predictability: 47, infraSensitivity: 68, resourceDependency: 78, peakSeasonality: 70 },
    anomaly: "The Gulf region is experiencing an extreme heat summer with Dubai, Riyadh, and Doha posting wet bulb temperatures approaching physiological safety limits on several June days. Red Sea SSTs have reached 34.2°C causing unprecedented coral bleaching and reduced visibility.",
    flights: { level: "medium", desc: "Dubai (DXB), Abu Dhabi (AUH), and Doha (DOH) are performing well as transit hubs with climate-controlled infrastructure. Dust storm events causing temporary ground holds. Regional carriers adapting well to heat stress." },
    accommodation: { level: "low", desc: "Gulf city hotels and resorts have world-class cooling infrastructure performing at design limits. Outdoor pool and beach usage restricted during peak heat. No major operational disruptions expected." },
    experiences: { level: "medium", desc: "Red Sea diving is severely impacted by bleaching — Hurghada and Sharm el-Sheikh operators reporting 40% tour cancellations. Desert safari and outdoor experiences operating but with shortened durations and enhanced safety measures." },
    trend: "flat"
  },

  "east-africa": {
    x: 570, y: 280,
    name: "East Africa",
    cluster: "Africa & Indian Ocean",
    sub: "Kenya · Tanzania · Rwanda · Zanzibar · Mozambique",
    wsi: 72, tvi: 80,
    subindex: { intensityDelta: 76, duration: 74, predictability: 66, infraSensitivity: 82, resourceDependency: 84, peakSeasonality: 74 },
    anomaly: "East Africa's 2026 'long rains' season was exceptionally intense, driven by El Niño–enhanced Indian Ocean Dipole conditions. Kenya and Tanzania received 340% of normal March–May rainfall, causing severe flooding that has displaced thousands and damaged infrastructure across the Rift Valley.",
    flights: { level: "high", desc: "Domestic bush airstrips in Masai Mara, Serengeti, and Selous are severely compromised with multiple closures due to waterlogging. Nairobi (NBO) and Dar es Salaam (DAR) operating normally but facing regional connection challenges." },
    accommodation: { level: "high", desc: "Multiple luxury tented camps in Kenya and Tanzania have been evacuated or closed due to flooding. Several iconic lodges along the Mara River are inaccessible. Major infrastructure damage to access roads." },
    experiences: { level: "high", desc: "Classic safari game drive circuits are significantly impaired with most dirt track networks impassable by standard 4WD. Hot air balloon operations suspended over Serengeti. Gorilla trekking in Rwanda affected by trail conditions." },
    trend: "up"
  },

  "southern-africa": {
    x: 530, y: 380,
    name: "Southern Africa",
    cluster: "Africa & Indian Ocean",
    sub: "South Africa · Botswana · Zimbabwe · Zambia · Namibia",
    wsi: 58, tvi: 62,
    subindex: { intensityDelta: 62, duration: 56, predictability: 56, infraSensitivity: 58, resourceDependency: 68, peakSeasonality: 60 },
    anomaly: "Southern Africa is experiencing El Niño's signature dry anomaly with the Okavango Delta at its lowest recorded inflow level, compressing wildlife into smaller corridors around permanent water sources. This creates both concentration opportunities and stress on ecosystems.",
    flights: { level: "low", desc: "Johannesburg (JNB) and Cape Town (CPT) are performing normally. Regional connections to Maun (Okavango gateway) and Livingstone (Victoria Falls) are operating with slight delays. Overall disruption minimal." },
    accommodation: { level: "medium", desc: "Water scarcity is affecting rural lodges and camps in Botswana's drier zones. Several camps in the Kalahari have introduced water conservation protocols. Urban accommodations unaffected." },
    experiences: { level: "medium", desc: "Victoria Falls activities (white-water rafting, swimming in Devil's Pool) are operating but visually reduced — a double-edged experience. Okavango mokoro (canoe) tours concentrate game viewing but reduce overall ecosystem dispersal." },
    trend: "flat"
  },

  "indian-ocean": {
    x: 660, y: 290,
    name: "Indian Ocean Islands",
    cluster: "Africa & Indian Ocean",
    sub: "Maldives · Seychelles · Mauritius · Réunion",
    wsi: 44, tvi: 68,
    subindex: { intensityDelta: 50, duration: 40, predictability: 42, infraSensitivity: 72, resourceDependency: 70, peakSeasonality: 62 },
    anomaly: "The Indian Ocean Dipole is in a weakly negative phase complementing El Niño conditions, producing slightly elevated SSTs in the central and western Indian Ocean. Maldives reef systems are experiencing moderate thermal stress with patchy bleaching in deeper zones.",
    flights: { level: "low", desc: "Malé (MLE), Mahé (SEZ), and Mauritius (MRU) are operating with strong international connectivity. Some seasonal cyclone-track monitoring advisories remain active but no disruptions reported. Excellent operational stability." },
    accommodation: { level: "low", desc: "Maldives overwater villas and island resorts maintain high operational standards with strong infrastructure investment. Slight increase in generator reliance during peak demand. World-class disaster preparedness." },
    experiences: { level: "medium", desc: "Maldives reef diving is impacted by moderate bleaching — visibility and coral health reduced compared to 2023 baseline. Whale shark and manta ray aggregation patterns shifting. Alternative dive sites remain excellent." },
    trend: "down"
  },

  "south-asia": {
    x: 690, y: 210,
    name: "South Asia",
    cluster: "South & Central Asia",
    sub: "India · Nepal · Sri Lanka · Maldives monsoon belt",
    wsi: 76, tvi: 74,
    subindex: { intensityDelta: 80, duration: 78, predictability: 70, infraSensitivity: 70, resourceDependency: 76, peakSeasonality: 76 },
    anomaly: "The 2026 Indian monsoon arrived 18 days early and has been running at 148% of long-period average, creating devastating floods across Kerala, Mumbai, and the Gangetic plain. Nepal's pre-monsoon storms have triggered multiple GLOF (Glacier Lake Outburst Flood) events affecting mountain trails.",
    flights: { level: "high", desc: "Mumbai (BOM), Chennai (MAA), and Kolkata (CCU) are all experiencing significant monsoon-season disruption. Fog and convective events are producing average 90-minute delays. Cancellation rate: 8.1%." },
    accommodation: { level: "high", desc: "Flood disruption across Mumbai, Goa, and Kerala coastal areas has caused property closures and guest displacements. Heritage hotel properties in Rajasthan face water stress. Emergency protocols activated across the region." },
    experiences: { level: "high", desc: "Everest Base Camp trekking via traditional routes is closed due to GLOF damage to Lukla approach trails — alternate routing adds 4 days. Kerala backwater houseboat operations suspended due to flooding and poor visibility." },
    trend: "up"
  },

  "southeast-asia": {
    x: 780, y: 250,
    name: "Southeast Asia",
    cluster: "South & Central Asia",
    sub: "Thailand · Bali · Vietnam · Philippines · Malaysia",
    wsi: 68, tvi: 76,
    subindex: { intensityDelta: 72, duration: 70, predictability: 64, infraSensitivity: 74, resourceDependency: 80, peakSeasonality: 74 },
    anomaly: "Southeast Asia is experiencing one of the most intense El Niño–linked heat-and-drought cycles in the observational record. Thailand and Vietnam recorded temperatures above 44°C in April. Severe water stress across Bali with some areas under emergency rationing.",
    flights: { level: "medium", desc: "Bangkok (BKK/DMK), Bali (DPS), and Manila (MNL) are all experiencing elevated weather-related delays, particularly during afternoon convective events. Typhoon tracking remains active June–September. Average 1.5 delays/month." },
    accommodation: { level: "high", desc: "Water rationing is in effect across Bali's main tourist corridors. Several Ubud and Seminyak hotels are trucking in water at significantly increased costs. Some properties implementing conservation protocols." },
    experiences: { level: "high", desc: "Coral bleaching across the Coral Triangle is severe — dive operators in the Raja Ampat, Komodo, and Philippines are reporting 50–70% bleached coverage. Bali beach clubs closing mid-day due to extreme heat." },
    trend: "up"
  },

  "east-asia": {
    x: 820, y: 140,
    name: "East Asia",
    cluster: "East Asia & Pacific",
    sub: "Japan · South Korea · China · Taiwan · Hong Kong",
    wsi: 52, tvi: 48,
    subindex: { intensityDelta: 56, duration: 50, predictability: 50, infraSensitivity: 46, resourceDependency: 44, peakSeasonality: 54 },
    anomaly: "East Asia is experiencing a split El Niño signal with northern Japan and South Korea having a drier, warmer than normal spring, while southern Japan and eastern China face elevated typhoon-track activity. Late spring snow events in high elevations contrasting with record heat at sea level.",
    flights: { level: "medium", desc: "Tokyo (NRT/HND), Seoul (ICN), and Shanghai (PVG) are well-equipped to handle elevated weather stress. Typhoon tracking remains active June–September with average 1.2 disruptions/month. Infrastructure resilience excellent." },
    accommodation: { level: "low", desc: "East Asian tourism infrastructure is highly resilient with excellent climate control systems. Some ryokan and traditional guesthouse properties in flood-prone zones face seasonal restrictions." },
    experiences: { level: "medium", desc: "Yangtze River cruises from Chongqing to Three Gorges are disrupted by high water levels affecting gorge aesthetics and dock access. Japan summer festivals proceeding normally. Mountain hiking conditions variable by elevation." },
    trend: "flat"
  },

  "oceania": {
    x: 860, y: 390,
    name: "Oceania & Pacific",
    cluster: "East Asia & Pacific",
    sub: "Australia · New Zealand · Pacific Islands · Fiji",
    wsi: 48, tvi: 56,
    subindex: { intensityDelta: 52, duration: 48, predictability: 54, infraSensitivity: 52, resourceDependency: 60, peakSeasonality: 56 },
    anomaly: "Oceania is in the transition phase of El Niño impact. Eastern Australia experiences drier conditions and bushfire risk elevation, while New Zealand and western Pacific islands face elevated cyclone probabilities. SSTs remain 1.2–1.8°C above normal across the Coral Sea.",
    flights: { level: "low", desc: "Sydney (SYD), Melbourne (MEL), and Auckland (AKL) are operating with near-normal performance. Seasonal cyclone monitoring active but no major disruptions to trunk routes. Reliable regional connectivity." },
    accommodation: { level: "low", desc: "Australian and New Zealand resort infrastructure is highly resilient. Some Queensland coastal properties maintaining elevated hurricane preparedness. Overall operational stability strong." },
    experiences: { level: "medium", desc: "Great Barrier Reef tourism affected by moderate coral bleaching in northern sections. Cyclone season activity elevated requiring tour operator caution. New Zealand outdoor activities largely unaffected." },
    trend: "flat"
  }
};
