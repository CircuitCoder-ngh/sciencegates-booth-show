/* Science Gates booth showcase: hand-written content.
   Company facts come from sciencegates.com (Home, About Us, Contact Us), November 2026.
   The product catalogue itself (37 brands, 390 products, photos, product sheets) is generated into catalog.js.
   Edit freely: the show reads this file and catalog.js. */

window.SG = (function () {
  "use strict";
  const C = window.CATALOG;

  /* ---------- Event ----------
     Shown top right. Leave name empty to show the "Partners in science" tagline instead.
     Example: { name: "CEM Asia 2026", place: "Kuala Lumpur, Malaysia", dates: "17 to 19 November 2026", booth: "Booth 12" } */
  const event = { name: "", place: "", dates: "", booth: "" };

  /* ---------- Company (About Us and Contact Us pages) ---------- */
  const company = {
    name: "SCIENCEGATES SDN BHD",
    short: "Science Gates",
    reg: "200401015601 (654104-V)",
    tagline: "Partners in science",
    founded: "2004",
    phone: "+603-5191 8828",
    mobile: "+6016 2111 788",
    whatsapp: "60162111788",
    email: "inquiry@sciencegates.com",
    web: "www.sciencegates.com",
    url: "https://www.sciencegates.com/",
    facebook: "facebook.com/mysciencegates",
    address: ["27 & 27-1, Jalan Putra Mahkota 7/8D,", "Seksyen 7, Putra Heights,", "47650 Subang Jaya,", "Selangor, Malaysia."],
    hours: [["Monday to Friday", "8:30 AM to 5:30 PM"], ["Saturday and Sunday", "Closed"], ["Public holidays", "Closed"]],
    about: [
      "Brainchild and founded in year 2004, SCIENCEGATES SDN BHD has been a dynamic company, well respected and trusted by our local and regional customers/partners, and overseas principals alike.",
      "Our headquarter is situated in Subang Jaya, Selangor, Malaysia, which houses a centralized and synergistic facility with sales and service centres, warehouse, demo room, and training centre. We also have an extensive sales network, covering Northern, Eastern, Central and Southern regions of Peninsular Malaysia, which includes East Malaysia as well.",
      "We are proud to have established long-standing relationships with many leading scientific equipment and instrument manufacturers from USA, Europe, and Asia throughout the years."
    ],
    clients: "SCIENCEGATES SDN BHD's clienteles come from all fields in scientific & medical industry, including hospitals, clinics, food & beverages, pharmaceuticals, material research, universities, QA/QC laboratories, petrochemicals, polymers, and environmental monitoring.",
    leadership: "Our leadership team has over 50 years of experience in the scientific equipment & instruments business and delivers high level operational and distribution experience developed through hands on corporate leadership.",
    vision: "Be a trustworthy partner in delivering exemplary solutions, supports, and services to our customers.",
    mission: [
      "To be customer focus oriented to strive to exceed customer expectations via strong leadership, engagement of people in the organization, and continual improvement.",
      "To have sustainability management in reaping benefits to all stakeholders."
    ],
    values: [
      ["Integrity", "Is vital for corporate ethics without compromising in accounting practices, truth-in-selling, management practices, customer service, personal, and products."],
      ["Commitment", "Is dedicated and committed in fulfilling to our customers, our business partners, and corporate with adhering to the excellence quality management."],
      ["Teamwork", "Is essential to involve our people, our business partners, and our customers to maximise efficiency, greater flexibility, improved morale, and increase innovation to weather all upcoming challenges."],
      ["Determination", "Is to be resolved, resolute, and never give up in accomplishing to our Vision and Mission."],
      ["Competition", "Is bold, decisive, and aggressive in increasing profits, market share, and sales volume to our shareholders."],
      ["Change", "Is always adaptable, agile, innovate, and entrepreneurial to offer exceptional solutions to our customers."],
      ["Results", "Is to create values, effectiveness, productivity, performance, and profitability to our stakeholders."]
    ],
    facility: [
      ["sales", "Sales centre", "Talk to our sales team about your application."],
      ["service", "Service centre", "Support from our own service team."],
      ["warehouse", "Warehouse", "Products stored at our headquarters."],
      ["demo", "Demo room", "See instruments at our headquarters."],
      ["training", "Training centre", "Training at our headquarters."]
    ],
    regions: [
      { id: "north", name: "Northern", sub: "Perlis, Kedah, Penang, Perak" },
      { id: "central", name: "Central", sub: "Selangor, Kuala Lumpur, Putrajaya, Negeri Sembilan" },
      { id: "south", name: "Southern", sub: "Melaka, Johor" },
      { id: "east", name: "Eastern", sub: "Kelantan, Terengganu, Pahang" },
      { id: "borneo", name: "East Malaysia", sub: "Sabah, Sarawak, Labuan" }
    ]
  };

  /* ---------- Industries (About Us: "We are scientific solutions provider for the following industries")
     The brand lists are suggestions of where to start in the catalogue; edit them freely. */
  const industries = [
    { id: "food", name: "Food & Beverage Analysis", icon: "food", brands: ["bs", "behr", "alphamos", "ohaus", "kinematica", "advantec", "poleko", "buerkle"] },
    { id: "chem", name: "Chemistry & Physics", icon: "flask", brands: ["schneider", "wiggens", "labtech", "specac", "bandelin", "2mag", "nickel", "shenchen"] },
    { id: "air", name: "Air Monitoring", icon: "air", brands: ["apex", "ams", "shinagawa", "advantec", "airscience"] },
    { id: "pharma", name: "Medical & Pharmaceuticals", icon: "pill", brands: ["labindia", "rodwell", "biobase", "airscience", "sicco", "rephile", "bs"] },
    { id: "soil", name: "Soil & Agriculture", icon: "leaf", brands: ["buerkle", "behr", "glenammer", "bante", "rocklabs", "poleko"] },
    { id: "material", name: "Material Science", icon: "atom", brands: ["elite", "kejia", "lac", "specac", "rocklabs", "glenammer", "screeneagle"] },
    { id: "petro", name: "Petroleum & Petrochemical", icon: "drop", brands: ["ckic", "bs", "schneider", "elite", "shinagawa"] },
    { id: "polymer", name: "Polymer, Plastic & Rubber", icon: "chain", brands: ["screeneagle", "specac", "kinematica", "ohaus", "labplant"] },
    { id: "life", name: "Life Sciences & Forensics", icon: "dna", brands: ["wanox", "biobase", "poleko", "optika", "airscience", "rephile", "persee"] },
    { id: "custom", name: "Custom Design & Fabrication", icon: "tool", brands: ["elite", "lac", "kejia", "sicco", "airscience"] },
    { id: "furniture", name: "Laboratory Furniture", icon: "bench", brands: ["airscience", "sicco", "biobase"] }
  ];

  /* ---------- Chapters (the bottom line) and product areas ----------
     Each product belongs to its brand's area unless listed in `override`. */
  const families = [
    { id: "water", name: "Lab water", title: "Lab water purification", blurb: "RephiLe Type I, II and III water systems, from benchtop to central supply.", open: { tab: "products" } },
    { id: "filtration", name: "Filtration", title: "Filtration and labware", blurb: "Advantec filter papers and membranes, RephiQuik syringe filters and Wanox cell culture plastics.", open: { tab: "products" } },
    { id: "elemental", name: "Elemental", title: "Calorimeters and elemental analysers", blurb: "CKIC calorific value, sulfur, carbon, nitrogen, halogen and mercury analysis.", open: { tab: "products" } },
    { id: "climate", name: "Climate", title: "Climatic chambers, incubators and cold storage", blurb: "Pol-Eko climatic chambers, incubators, drying ovens, refrigerators and ultra-low freezers.", open: { tab: "products" } },
    { id: "prep", name: "Sample prep", title: "Sample preparation", blurb: "Presses, crushers, pulverisers, homogenisers, sieves, rotary evaporators, spray dryers and pumps.", open: { tab: "products" } },
    { id: "heat", name: "Heat", title: "Furnaces and baths", blurb: "Laboratory, tube, vacuum and CVD furnaces up to 1,850 °C, and water baths from ambient to boiling.", open: { tab: "products" } },
    { id: "analysis", name: "Analysis", title: "Analytical and quality control", blurb: "Refractometers, polarimeters, Kjeldahl, tablet testing, electronic noses, balances, microscopes and gloss meters.", open: { tab: "products" } },
    { id: "air", name: "Air & stack", title: "Air quality and stack emissions", blurb: "Apex isokinetic source sampling, Apex AIR monitors, high-volume samplers and gas meters.", open: { tab: "products" } },
    { id: "safety", name: "Lab safety", title: "Containment, storage and sterilisation", blurb: "Ductless fume hoods, safety cabinets, desiccators, glove boxes and autoclaves.", open: { tab: "products" } },
    { id: "sampling", name: "Sampling", title: "Samplers and pumps", blurb: "Bürkle samplers for powders, liquids and soil, and drum and container pumps.", open: { tab: "products" } },
    { id: "brands", name: "Principals", title: "Our principals", blurb: "37 manufacturers from the USA, Europe and Asia.", open: { tab: "brands" } },
    { id: "about", name: "About us", title: "About Science Gates", blurb: "Founded in 2004, headquartered in Subang Jaya, serving all of Malaysia.", open: { tab: "company" } }
  ];
  const brandFamily = {
    rephile: "water", advantec: "filtration", wanox: "filtration", ckic: "elemental", poleko: "climate",
    specac: "prep", rocklabs: "prep", kinematica: "prep", glenammer: "prep", labplant: "prep", wiggens: "prep", labtech: "prep", bandelin: "prep", "2mag": "prep", shenchen: "prep",
    elite: "heat", kejia: "heat", lac: "heat", nickel: "heat",
    bs: "analysis", behr: "analysis", labindia: "analysis", alphamos: "analysis", ohaus: "analysis", optika: "analysis", persee: "analysis", screeneagle: "analysis", schneider: "analysis", bante: "analysis",
    apex: "air", ams: "air", shinagawa: "air",
    airscience: "safety", sicco: "safety", rodwell: "safety", biobase: "safety",
    buerkle: "sampling"
  };
  const override = {
    "4701764": "filtration",                                     // RephiQuik PTFE syringe filter
    "4752018": "analysis",                                       // LabTech UV/Vis spectrophotometer
    "4756532": "heat", "4756531": "heat",                        // Biobase muffle furnaces
    "4756653": "climate", "4756641": "climate",                  // Biobase -86 °C freezers
    "4756597": "prep", "4756505": "prep", "4756503": "prep"      // Biobase stirrer and vortex mixers
  };
  Object.values(C.products).forEach(p => { p.family = override[p.id] || brandFamily[p.brand]; });

  /* Country of each principal (shown on brand tiles) */
  const brandInfo = {
    "2mag": ["Germany", "Inductive magnetic stirrers"], advantec: ["Japan", "Filter papers and membranes since 1916"], airscience: ["USA", "Ductless fume hoods and enclosures"],
    alphamos: ["France", "Electronic nose, tongue and eye"], ams: ["Italy", "Air and emission samplers"], apex: ["USA", "Isokinetic source sampling"],
    bandelin: ["Germany", "Ultrasound since 1955"], bante: ["China", "Water quality meters"], behr: ["Germany", "Kjeldahl, extraction and fibre"],
    bs: ["United Kingdom", "Refractometers and polarimeters"], biobase: ["China", "Biosafety and cold storage"], buerkle: ["Germany", "Samplers and pumps"],
    ckic: ["China", "Calorimeters and elemental analysers"], elite: ["United Kingdom", "Laboratory and industrial furnaces"], glenammer: ["United Kingdom", "Laboratory test sieves"],
    kejia: ["China", "CVD and PECVD furnace systems"], kinematica: ["Switzerland", "POLYTRON homogenisers since 1962"], labindia: ["India", "Tablet testing instruments"],
    labplant: ["United Kingdom", "Laboratory spray dryers"], labtech: ["USA", "Evaporation, digestion and chillers"], lac: ["Czech Republic", "Laboratory furnaces"],
    schneider: ["Germany", "Thermometers and hydrometers since 1910"], nickel: ["United Kingdom", "Clifton water baths"], ohaus: ["USA", "Balances and moisture analysers"],
    optika: ["Italy", "Microscopes and cameras"], persee: ["China", "UV-Vis spectrophotometers"], poleko: ["Poland", "Climatic chambers and incubators"],
    rephile: ["China", "Lab water purification"], rocklabs: ["New Zealand", "Crushers, pulverisers and CRMs"], rodwell: ["United Kingdom", "Laboratory autoclaves"],
    screeneagle: ["Switzerland", "Zehntner and Proceq coating test"], shenchen: ["China", "Peristaltic pumps"], shinagawa: ["Japan", "Wet and dry gas meters"],
    sicco: ["Germany", "Desiccators and glove boxes"], specac: ["United Kingdom", "Hydraulic presses and pellet dies"], wanox: ["Singapore", "Cell culture and PCR plastics"],
    wiggens: ["Germany", "Rotary evaporators and vacuum pumps"]
  };
  C.brands.forEach(b => { const i = brandInfo[b.id] || ["", ""]; b.country = i[0]; b.line = i[1]; b.family = brandFamily[b.id]; });

  /* ---------- Featured product details ----------
     Product photos, names and categories come from catalog.js; these add a tagline, a summary,
     features, specifications and feature callouts (x, y in % of the main photo) for products in the film. */
  const featured = {
    "4615292": {
      tagline: "Calorific value in 8 minutes.",
      summary: "5E-C5808 is CKIC's new generation calorimeter for the calorific value of solid and liquid combustibles including oil, coal, coke, foodstuffs and biomass products. Calorific value is the key point in pricing coal, so it directly affects the economic benefits of customers. Widely applied in power plants, coal mines, metallurgy, the chemical industry, commercial inspection and scientific research.",
      features: [
        "Patented laser ignition: no ignition wire or cotton thread needed (5E-C5808J)",
        "8 minutes fast analysis for one sample",
        "Automatic oxygen vessel lifting",
        "Automatic oxygen charging and venting",
        "Intelligent temperature control of jacket and water tank; jacket stability 0.02 °C",
        "Small footprint with compact design",
        "Intelligent diagnosis and safety protection"
      ],
      specs: [["Models", "5E-C5808 (ignition wire), 5E-C5808J (laser ignition)"], ["Analysis time", "8 minutes per sample"], ["Jacket temperature stability", "0.02 °C"], ["Samples", "Oil, coal, coke, foodstuffs, biomass"]]
    },
    "4766638": {
      tagline: "Class I balance enclosure for powders.",
      summary: "Purair RX Class I Balance Enclosure meets USP 800 and USP 795 requirements for non-sterile compounding processes, protecting the user and the environment from hazardous powders and particulates generated on the work surface.",
      features: ["High efficiency EC blower", "Energy saving LED lighting", "Protects the operator from powder and particle hazards", "Improved filter clamping eliminates bypass leakage",
        "Exhaust canopy allows thimble ducting to the facility exhaust", "Filter blockage alarm", "Complies with USP 800 and USP 795 guidelines"],
      specs: [["Power", "22 to 50 W (single EC blower)"], ["Applications", "Balance enclosures, compounding, powder mixing, powder weighing"], ["Filtration", "Carbon filters in 14+ configurations; HEPA/ULPA optional"], ["Origin", "Made in Fort Myers, Florida, USA"]]
    },
    "4782327": {
      tagline: "Stackable desiccator with four shelves.",
      summary: "Aluminium frame with panels made of acrylic glass, including four shelves made of polycarbonate, tray, hygrometer and desiccant; usable with up to 26 shelves, stackable.",
      specs: [["Cat. No.", "V 1871-07"], ["Panels / material", "Clear PMMA"], ["Temperature resistance", "-20 °C to +70 °C"], ["Overall dimensions (W × H × D)", "310 × 525 × 375 mm"], ["Usable interior", "260 × 480 × 330 mm"], ["Capacity", "51 litres"], ["Weight", "About 7 kg"], ["Load", "10 kg per shelf, 30 kg total"]]
    }
  };
  Object.keys(featured).forEach(id => { if (C.products[id]) Object.assign(C.products[id], featured[id]); });

  /* ---------- Learn more: a self-running deep dive per chapter ----------
     Slide layouts (see scenes.js): callouts, features, specs, gallery, compare, products, brands, sheet, steps,
     facts, cards, map, values, contact. Product slides take names, photos and features from the catalogue. */
  const deep = {
    intro: { title: "Partners in science", slides: [
      { type: "facts", kicker: "About Science Gates", title: "Your partner for laboratory and scientific instruments since 2004.", img: "about" },
      { type: "brands", kicker: "37 principals", title: "Leading manufacturers from the USA, Europe and Asia.", lede: "Tap a brand for its products." },
      { type: "cards", kicker: "Our facility in Subang Jaya", title: "Everything under one roof.", cols: 5, items: "facility" }
    ] },
    water: { title: "Lab water purification", slides: [
      { type: "brand", b: "rephile", kicker: "RephiLe", title: "Laboratory water purification systems." },
      { type: "features", p: "4612131", kicker: "Genie G Water System" },
      { type: "products", kicker: "The RephiLe range", title: "A water system for every laboratory.", ids: ["4612131", "4612134", "4612132", "4612133", "4701520", "4701500", "4701354", "4701600", "4702377", "4701584"] },
      { type: "specs", p: "4612131", kicker: "Genie G Water System", title: "Type I and Type II water from tap water." },
      { type: "cards", kicker: "Main applications (Genie G)", title: "Ultrapure water for critical work, EDI water for routine work.", cols: 2, items: [
        ["Ultrapure water: critical applications", "HPLC mobile phase preparation; reagent blank solutions; sample diluents for GC, HPLC, UPLC, AA, ICP-MS; buffer and culture media for mammalian cell culture; molecular biology reagents."],
        ["EDI pure water: routine applications", "Chemical bio-reagents and culture media; solutions for HPLC and ICP; feed water to ultrapure systems and clinical analysers; serum and blood fractionation."]] }
    ] },
    filtration: { title: "Filtration and labware", slides: [
      { type: "brand", b: "advantec", kicker: "Advantec", title: "Japan's first laboratory filter paper, since 1916." },
      { type: "products", kicker: "Advantec filtration media", title: "Papers, fibres, membranes and thimbles.", ids: ["4709749", "4709832", "4725737", "4725753", "4725790", "4725720", "4711840", "4701764"] },
      { type: "products", kicker: "Wanox labware", title: "Cell culture, centrifuge and PCR plastics.", ids: ["5046359", "5046384", "5046389", "5046390", "5046407", "5046410", "5046414", "5046423", "5046427", "5046439"] }
    ] },
    elemental: { title: "Calorimeters and elemental analysers", slides: [
      { type: "features", p: "4615292" },
      { type: "specs", p: "4615292" },
      { type: "docs", kicker: "CKIC brochures", title: "Datasheets for every analyser.", ids: ["4615292", "4615294", "4612127", "4612123", "4612124", "4612126", "4615300", "4615302"] },
      { type: "products", kicker: "CKIC elemental analysers", title: "Sulfur, carbon, nitrogen, halogens and mercury.", ids: ["4615292", "4615294", "4612127", "4612123", "4612124", "4612126", "4615309", "4615306", "4615300", "4615298", "4615312", "4615302"] },
      { type: "brand", b: "ckic", kicker: "About CKIC", title: "Samplers, sample preparation and analysers since 1992." }
    ] },
    climate: { title: "Climatic chambers and incubators", slides: [
      { type: "brand", b: "poleko", kicker: "Pol-Eko", title: "Thermostatic equipment from Poland." },
      { type: "sheet", p: "4752186", kicker: "Pol-Eko climatic chambers", title: "KK and KKS climatic chambers." },
      { type: "products", kicker: "The Pol-Eko range", title: "Chambers, incubators, ovens and cold storage.", ids: ["4752144", "4752186", "4752194", "4752112", "4752218", "4752229", "4752240", "4752248", "4752271", "4752768", "4752844", "4752826"] }
    ] },
    specac: { title: "Pellet presses", slides: [
      { type: "features", p: "4612139", kicker: "Specac APEX 400" },
      { type: "specs", p: "4612139", kicker: "Specac APEX 400" },
      { type: "brand", b: "specac", kicker: "Specac", title: "FTIR and XRF sample preparation since 1971." },
      { type: "products", kicker: "Specac presses and dies", title: "From mini presses to automatic presses.", ids: ["4612139", "4612140", "4612141", "4612143", "4612142", "4612144"] }
    ] },
    prep: { title: "Sample preparation", slides: [
      { type: "steps", kicker: "Rocklabs", title: "From rock to representative sample.", img: "p:4741594", steps: [
        ["Crush", "BOYD jaw crushers reduce rock samples to a few millimetres."], ["Divide", "Rotary sample dividers take a representative split."],
        ["Pulverise", "Ring mills grind the split to a fine powder for analysis."], ["Check", "Certified reference materials confirm the results."]] },
      { type: "docs", kicker: "Rocklabs brochures", title: "Crushers, mills and dividers.", ids: ["4741594", "4741776", "4741806", "4741939", "4728292", "4741316", "4741352", "4741483"] },
      { type: "products", kicker: "Rocklabs", title: "Crushers, pulverisers and dividers.", ids: ["4741594", "4741776", "4741806", "4741939", "4742283", "4728292", "4741316", "4741352", "4741483", "4742286", "4742287", "4742288"] },
      { type: "products", kicker: "In the prep lab", title: "Homogenise, sieve, evaporate and dry.", ids: ["4732105", "4756353", "4732060", "4755433", "5278358", "5278361", "4751914", "4816885", "4731685", "4753535", "4731126", "4733654"] }
    ] },
    heat: { title: "Furnaces and baths", slides: [
      { type: "brand", b: "elite", kicker: "Elite Thermal Systems", title: "Furnaces made in the UK, standard and custom." },
      { type: "products", kicker: "Furnaces", title: "Chamber, tube, vacuum and CVD.", ids: ["4730899", "4751616", "4751647", "4751649", "4751674", "4751681", "4751687", "4751688", "6298641", "6298499", "4732191", "4763587"] },
      { type: "products", kicker: "Clifton water baths by Nickel-Electro", title: "Unstirred, stirred, shaking and boiling baths.", ids: ["4758092", "4758303", "4758378", "4758404", "4758406", "4758611", "4758663", "4758716", "4758693", "4758730"] }
    ] },
    qc: { title: "Food, pharma and QC", slides: [
      { type: "brand", b: "bs", kicker: "Bellingham + Stanley", title: "Experts in refractometry and polarimetry." },
      { type: "products", kicker: "Bellingham + Stanley", title: "Refractometers, polarimeters, saccharimeters, density meters.", ids: ["4735355", "4735395", "4735759", "4736902", "4736451", "4736339", "4736742", "4736471", "4736680", "4736951"] },
      { type: "products", kicker: "behr Labor-Technik", title: "Kjeldahl nitrogen, extraction and fibre.", ids: ["4738479", "4738304", "4737849", "4737821", "4738210", "4738294", "4740844", "4740825", "4741018", "4741141"] },
      { type: "docs", kicker: "Bellingham + Stanley and behr brochures", title: "Datasheets to take away.", ids: ["4735355", "4735759", "4736451", "4736471", "4738479", "4740844", "4741018", "4741141"] },
      { type: "products", kicker: "Pharmacopoeia testing", title: "Labindia tablet testers.", ids: ["4754937", "4754918", "4754353", "4754885", "4754887", "4754943", "4754894"] }
    ] },
    measure: { title: "Measurement and optics", slides: [
      { type: "products", kicker: "Measure and inspect", title: "Microscopes, spectrophotometers, balances and meters.", ids: ["4759498", "4761783", "4761778", "4996697", "4752018", "4753032", "4753462", "4733503", "4762320", "4731365", "4743491", "4743512"] },
      { type: "products", kicker: "Screen Eagle: Zehntner and Proceq", title: "Gloss, film application and coating tests.", ids: ["4756795", "4733371", "4756820", "4756816", "4757052", "4756953", "4757053", "4757131", "4757163", "4757199"] }
    ] },
    stack: { title: "Stack emission sampling", slides: [
      { type: "brand", b: "apex", kicker: "Apex Instruments", title: "Isokinetic source sampling to MS 1596:2003 and US EPA methods." },
      { type: "steps", kicker: "How isokinetic sampling works", title: "A representative sample from the stack.", img: "p:4735041", steps: [
        ["Traverse", "A probe and nozzle visit points across the stack, following the flue gas velocity measured by the pitot tube."],
        ["Match the velocity", "Gas enters the nozzle at the same speed as the stack gas: isokinetic, so particles are not over- or under-sampled."],
        ["Collect", "Particulate is caught on a heated filter; impingers in an ice bath collect condensable and gaseous compounds."],
        ["Measure", "The control console meters the dry gas volume, so the lab can report concentration and mass flow."]] },
      { type: "products", kicker: "Apex systems by method", title: "A sampling train for every method.", ids: ["4726422", "4735041", "4735053", "4735115", "4735151", "4735179", "4735212", "4735242"] },
      { type: "docs", kicker: "Apex brochures", title: "Sampling train datasheets.", ids: ["4735041", "4735179", "4735212", "4735242"] }
    ] },
    airq: { title: "Air quality monitoring", slides: [
      { type: "products", kicker: "Ambient and workplace air", title: "Monitors, high-volume samplers and gas meters.", ids: ["6337437", "4754004", "4731624", "4753962", "4754125", "4751559", "4751560", "4750445", "4750609"] },
      { type: "sheet", p: "6337437", kicker: "Apex AIR series", title: "Accurately measure multiple pollutants." }
    ] },
    safety: { title: "Containment, storage and sterilisation", slides: [
      { type: "features", p: "4766638" },
      { type: "products", kicker: "Air Science", title: "Ductless fume hoods, laminar flow and PCR cabinets.", ids: ["4766462", "4756754", "4766638", "4766639", "4766591", "4766541", "4766673", "4766690", "4766764", "4766838"] },
      { type: "products", kicker: "SICCO, Rodwell and Biobase", title: "Desiccators, glove boxes, autoclaves and safety cabinets.", ids: ["4782327", "4782405", "4782680", "4782693", "4782643", "4733311", "4755277", "4755138", "4756672", "4731803"] }
    ] },
    sampling: { title: "Samplers and pumps", slides: [
      { type: "brand", b: "buerkle", kicker: "Bürkle", title: "Samplers, pumps and containers from Germany." },
      { type: "products", kicker: "Samplers", title: "Powders, granules, liquids, pastes and soil.", ids: ["4789671", "4784746", "4784710", "4783588", "4783313", "4783186", "4784490", "4784488", "4790871", "4784376", "4790410", "4783705"] },
      { type: "products", kicker: "Pumps", title: "Drum, container and solvent pumps.", ids: ["4782918", "4782932", "4782941", "4783038", "4782714", "4782900", "4782904", "4782999", "4783027", "4783109"] }
    ] },
    brands: { title: "Our principals", slides: [
      { type: "brands", kicker: "37 principals", title: "Long-standing relationships with leading manufacturers.", lede: "Tap a brand for its products." }
    ] },
    industries: { title: "Industries we serve", slides: [
      { type: "industries", kicker: "Scientific solutions provider", title: "For all fields of the scientific and medical industry.", lede: "Tap an industry for the brands to start with." }
    ] },
    network: { title: "Service across Malaysia", slides: [
      { type: "map", kicker: "Sales network", title: "Covering all of Malaysia.", lede: "Northern, Eastern, Central and Southern regions of Peninsular Malaysia, and East Malaysia." },
      { type: "cards", kicker: "Our facility in Subang Jaya", title: "Sales, service, stock, demo and training.", cols: 5, items: "facility" },
      { type: "values", kicker: "Vision, mission and values", title: "A trustworthy partner." },
      { type: "contact", kicker: "Contact us", title: "We would like to hear from you." }
    ] }
  };

  return { event, company, industries, families, brandFamily, featured, deep };
})();
