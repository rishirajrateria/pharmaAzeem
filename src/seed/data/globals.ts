/** Site-wide settings and page copy. Everything here is editable in the admin panel. */

export const siteSettings = {
  siteName: 'Azeem Pharmaceuticals',
  legalName: 'Azeem Pharmaceuticals Pvt. Ltd.',
  tagline: 'Quality medicines, worldwide',
  shortDescription:
    'Azeem Pharmaceuticals is a WHO-GMP certified manufacturer and exporter of high-quality generic medicines – antibiotics, cardiovascular, diabetes, pain, gastrointestinal, respiratory, dermatology, CNS and injectable products – supplying distributors, hospitals and tenders in more than 50 countries across Africa, the Middle East, Asia, the CIS and Latin America.',
  foundingYear: 2009,
  employeeCount: '450+',
  announcement: { enabled: true, text: 'Now registering products in 6 new markets – partner with us for 2026', url: '/global-presence' },
  contact: {
    email: 'exports@azeempharma.com',
    inquiryEmail: 'exports@azeempharma.com',
    phone: '+91 79 4000 1234',
    whatsapp: '919876543210',
    address: { street: 'Plot 12, Pharma Industrial Estate', city: 'Ahmedabad', state: 'Gujarat', postalCode: '382445', country: 'India' },
    businessHours: 'Monday – Saturday, 09:00 – 18:00 IST',
    socials: [
      { platform: 'linkedin', url: 'https://www.linkedin.com/company/azeem-pharmaceuticals' },
      { platform: 'facebook', url: 'https://www.facebook.com/azeempharma' },
      { platform: 'youtube', url: 'https://www.youtube.com/@azeempharma' },
    ],
  },
  commerce: {
    mode: 'inquiry',
    showPrices: false,
    currency: 'USD',
    priceFallbackLabel: 'Inquire for pricing',
    listName: 'Inquiry list',
    addLabel: 'Add to inquiry list',
    ctaLabel: 'Inquire now',
  },
  seo: {
    titleTemplate: '%s | Azeem Pharmaceuticals',
    defaultTitle: 'Azeem Pharmaceuticals – WHO-GMP Certified Pharmaceutical Manufacturer & Exporter',
    defaultDescription:
      'WHO-GMP certified pharmaceutical manufacturer and exporter of generic medicines – tablets, capsules, syrups, injectables and creams – supplying 50+ countries. Request a quotation today.',
    twitterHandle: '@azeempharma',
    sameAs: [{ url: 'https://www.linkedin.com/company/azeem-pharmaceuticals' }, { url: 'https://www.facebook.com/azeempharma' }],
    knowsAbout: [
      { topic: 'Generic pharmaceutical manufacturing' },
      { topic: 'Pharmaceutical export and product registration' },
      { topic: 'WHO-GMP compliance' },
      { topic: 'Contract and third-party manufacturing' },
      { topic: 'Sterile injectable manufacturing' },
      { topic: 'Antibiotics and anti-infectives' },
    ],
  },
}

export const homepage = {
  hero: {
    eyebrow: 'WHO-GMP certified manufacturer & exporter',
    title: 'Trusted medicines for a healthier world',
    highlight: 'healthier world',
    subtitle:
      'From our WHO-GMP certified plants to pharmacies and hospitals in 50+ countries – 300+ generic formulations, full regulatory support and dependable supply.',
    primaryCta: { label: 'Explore products', url: '/products' },
    secondaryCta: { label: 'Request a quotation', url: '/inquiry' },
  },
  stats: [
    { value: '50', suffix: '+', label: 'Countries served' },
    { value: '300', suffix: '+', label: 'Formulations' },
    { value: '15', suffix: '+', label: 'Years of excellence' },
    { value: '1200', suffix: '+', label: 'Product registrations' },
  ],
  intro: {
    eyebrow: 'Who we are',
    heading: 'A partner built for the long term',
    body:
      'Since 2009 we have grown from a single tablet plant into an integrated pharmaceutical group with five facilities, an in-house R&D centre and a regulatory team that has completed over 1,200 product registrations worldwide. Our promise is simple: consistent quality, transparent pricing and on-time delivery, every time.',
  },
  whyUs: [
    { title: 'WHO-GMP certified plants', icon: 'shield-check', description: 'Five manufacturing units audited to WHO-GMP, ISO 9001, ISO 14001 and ISO 45001 standards with dedicated β-lactam and sterile blocks.' },
    { title: 'Regulatory expertise', icon: 'file-check', description: 'CTD dossiers, stability data for every climatic zone and CoPPs – our regulatory team handles registrations end to end in 50+ markets.' },
    { title: 'Full dosage-form range', icon: 'pill', description: 'Tablets, capsules, dry syrups, liquids, creams, ointments, sachets, inhalers, vials, ampoules and IV fluids under one roof.' },
    { title: 'Reliable export logistics', icon: 'truck', description: 'Temperature-mapped warehousing, consolidated FCL/LCL and air shipments, and complete export documentation from our in-house team.' },
    { title: 'Private label & contract manufacturing', icon: 'package', description: 'Launch your own brand with our formulations, artwork support and flexible minimum order quantities.' },
    { title: 'Transparent partnership', icon: 'handshake', description: 'A dedicated account manager, clear lead times and responsive after-sales support for every partner.' },
  ],
  globalSection: {
    eyebrow: 'Worldwide operations',
    heading: 'Delivering quality medicines to 50+ countries',
    body: 'Our products are registered and distributed across Africa, the Middle East, South & South-East Asia, the CIS and Latin America – with dedicated country pages covering local regulatory requirements and market focus.',
  },
  manufacturingSection: {
    eyebrow: 'Manufacturing',
    heading: 'Infrastructure engineered for quality and scale',
    body: 'Three formulation plants, a sterile injectables unit and a modern R&D and QC laboratory give us the capacity to manufacture more than 2.4 billion tablets, 60 million vials and 30 million bottles every year.',
    bullets: [{ text: 'Dedicated β-lactam, general and sterile blocks' }, { text: 'Automated blister, bottle and tube packaging lines' }, { text: 'ICH stability chambers for Zone II, IVa and IVb' }, { text: 'Serialisation-ready packaging for track and trace' }],
  },
  testimonials: [
    { quote: 'Azeem has been our primary antibiotics supplier for six years. Registration support, documentation and lead times are consistently excellent.', author: 'Procurement Director', role: 'Pharmaceutical distributor, Nairobi' },
    { quote: 'Their regulatory team prepared complete CTD dossiers for twelve products and guided us through the Kimadia tender process from start to finish.', author: 'Managing Partner', role: 'Import company, Baghdad' },
    { quote: 'We launched our own private-label vitamin range with Azeem. Artwork, halal certification and stability data were all handled in-house.', author: 'Brand Manager', role: 'Healthcare marketer, Manila' },
  ],
  cta: {
    heading: 'Looking for a reliable pharmaceutical partner?',
    body: 'Send us your product list and target markets – we will reply within one business day with availability, documentation and indicative lead times.',
    primaryCta: { label: 'Request a quotation', url: '/inquiry' },
    secondaryCta: { label: 'Contact our export team', url: '/contact' },
  },
  faqs: [
    { question: 'Which countries does Azeem Pharmaceuticals export to?', answer: 'We currently export to more than 50 countries across Africa, the Middle East, South and South-East Asia, Central Asia / CIS, Latin America and the Pacific. Visit the Global Presence page for a country-by-country overview.' },
    { question: 'What is the minimum order quantity?', answer: 'MOQs depend on the product and presentation – typically one batch for private-label products and a mixed pallet for our registered brands. Share your requirement and we will confirm the MOQ and lead time.' },
    { question: 'Do you support product registration in my country?', answer: 'Yes. Our regulatory affairs team prepares CTD/eCTD dossiers, provides stability data for your climatic zone, CoPPs, GMP certificates and samples, and supports queries from your regulator until approval.' },
    { question: 'Can you manufacture under my brand name?', answer: 'Absolutely. We offer private-label and contract manufacturing across all dosage forms, including artwork design and packaging development.' },
    { question: 'How do I get a price quotation?', answer: 'Add products to your inquiry list and click "Inquire now", or use the contact form. We respond with a quotation, MOQ and lead time within one business day.' },
  ],
  meta: {
    title: 'Azeem Pharmaceuticals – WHO-GMP Certified Pharmaceutical Manufacturer & Exporter',
    description: 'WHO-GMP certified manufacturer & exporter of 300+ generic medicines to 50+ countries. Antibiotics, cardiovascular, diabetes, injectables & more. Request a quote.',
    keywords: 'pharmaceutical manufacturer, pharmaceutical exporter, WHO GMP certified pharmaceutical company, generic medicines supplier, third party pharma manufacturing, pharma export company',
  },
}

export const aboutPage = {
  hero: { eyebrow: 'About us', title: 'Fifteen years of making medicines the right way', subtitle: 'Azeem Pharmaceuticals is an integrated, WHO-GMP certified pharmaceutical company manufacturing and exporting quality generic medicines to healthcare partners on five continents.' },
  intro: `Founded in 2009 in Ahmedabad – one of the world's largest pharmaceutical manufacturing hubs – Azeem Pharmaceuticals began with a single oral solid dosage plant and a conviction that affordable medicines should never compromise on quality. Today we operate five facilities, employ more than 450 people and supply over 300 formulations to distributors, hospitals and government tenders in 50+ countries.

Every product we ship carries the same commitment: manufactured under WHO-GMP, tested batch by batch, documented for your regulator and delivered on time.`,
  stats: [
    { value: '2009', label: 'Founded' },
    { value: '450', suffix: '+', label: 'Team members' },
    { value: '5', label: 'Facilities' },
    { value: '50', suffix: '+', label: 'Export markets' },
  ],
  mission: {
    mission: 'To improve access to safe, effective and affordable medicines by manufacturing to the highest global quality standards and partnering transparently with healthcare providers worldwide.',
    vision: 'To be the most trusted generic pharmaceutical partner in emerging markets – recognised for quality, reliability and regulatory excellence.',
  },
  values: [
    { title: 'Quality without compromise', icon: 'shield-check', description: 'Quality is designed into every process, not inspected in at the end.' },
    { title: 'Integrity', icon: 'badge-check', description: 'Accurate data, honest timelines and documentation you can rely on.' },
    { title: 'Partnership', icon: 'handshake', description: 'We grow when our distributors grow – long-term relationships over short-term wins.' },
    { title: 'Innovation', icon: 'flask-conical', description: 'Continuous investment in formulation science, automation and digital quality systems.' },
    { title: 'Responsibility', icon: 'leaf', description: 'Zero-liquid-discharge plants, safe workplaces and support for community health programmes.' },
    { title: 'Agility', icon: 'zap', description: 'Fast responses, flexible MOQs and quick turnaround on registrations.' },
  ],
  milestones: [
    { year: '2009', title: 'Company founded', description: 'Unit I oral solid dosage plant commissioned in Ahmedabad.' },
    { year: '2011', title: 'First exports', description: 'First shipments to Sri Lanka and Nepal; export division established.' },
    { year: '2013', title: 'Unit II & WHO-GMP', description: 'Oral liquids and externals plant opened; WHO-GMP certification achieved.' },
    { year: '2016', title: 'Logistics hub', description: 'Central warehouse and export documentation centre commissioned.' },
    { year: '2018', title: 'Sterile injectables', description: 'Unit III sterile injectables plant with isolator-protected filling lines.' },
    { year: '2021', title: '1,000 registrations', description: 'Crossed 1,000 product registrations across 40 countries.' },
    { year: '2025', title: 'Revised Schedule M', description: 'All plants upgraded to revised Schedule M, aligned with WHO GMP.' },
  ],
  leadership: [
    { name: 'Dr. Azeem Khan', role: 'Founder & Managing Director', bio: 'Pharmacist and entrepreneur with 25 years in generic manufacturing and international trade.' },
    { name: 'Meera Patel', role: 'Director – Quality & Regulatory Affairs', bio: 'Leads QA/QC and regulatory teams; former inspector with 18 years in GMP compliance.' },
    { name: 'Rahul Desai', role: 'Head of International Business', bio: 'Builds distributor partnerships across Africa, the Middle East and Asia.' },
    { name: 'Dr. Sana Ahmed', role: 'Head of R&D', bio: 'Formulation scientist specialising in modified-release and pediatric dosage forms.' },
  ],
  faqs: [
    { question: 'Where is Azeem Pharmaceuticals located?', answer: 'Our headquarters and all five facilities are located in the Pharma Industrial Estate, Ahmedabad, Gujarat, India.' },
    { question: 'Is Azeem Pharmaceuticals WHO-GMP certified?', answer: 'Yes – all manufacturing units hold WHO-GMP certification and are additionally certified to ISO 9001, ISO 14001 and ISO 45001.' },
    { question: 'Do you manufacture your own products or trade?', answer: 'We manufacture every product in our own facilities, giving us full control over quality, documentation and lead times.' },
  ],
  meta: { title: 'About Azeem Pharmaceuticals – WHO-GMP Certified Pharma Company', description: 'Learn about Azeem Pharmaceuticals: a WHO-GMP certified manufacturer and exporter founded in 2009, with five facilities, 450+ people and partners in 50+ countries.', keywords: 'about azeem pharmaceuticals, pharmaceutical company profile, WHO GMP pharma company India' },
}

export const qualityPage = {
  hero: { eyebrow: 'Quality assurance', title: 'Quality is designed into every batch', subtitle: 'A pharmaceutical quality system aligned with WHO-GMP, ICH Q8–Q10 and revised Schedule M – covering every step from raw material to release.' },
  intro: `Our quality organisation operates independently of production and reports directly to the Managing Director. More than 90 quality professionals oversee vendor qualification, in-process controls, analytical testing, stability studies, deviation management and continuous improvement across all facilities.`,
  stats: [
    { value: '90', suffix: '+', label: 'Quality professionals' },
    { value: '100', suffix: '%', label: 'Batches tested before release' },
    { value: '9', label: 'ICH stability chambers' },
    { value: '0', label: 'Critical audit observations (last 3 years)' },
  ],
  pillars: [
    { title: 'Pharmaceutical quality system', icon: 'shield-check', description: 'ICH Q10-based PQS with management review, CAPA, change control and quality risk management.' },
    { title: 'Qualified suppliers', icon: 'search-check', description: 'APIs and excipients sourced only from audited, approved vendors with full CoA verification.' },
    { title: 'In-process control', icon: 'gauge', description: 'Real-time monitoring of weight, hardness, thickness, friability, fill volume and pH at every stage.' },
    { title: 'Analytical excellence', icon: 'microscope', description: 'HPLC, GC, UV, dissolution and microbiology labs with validated methods and data-integrity controls.' },
    { title: 'Stability programme', icon: 'thermometer', description: 'Long-term and accelerated studies at Zone II, IVa and IVb conditions for every registered product.' },
    { title: 'Data integrity', icon: 'lock', description: 'ALCOA+ principles, audit trails, electronic batch records and restricted system access.' },
  ],
  process: [
    { title: 'Raw material quarantine & testing', description: 'Every incoming API and excipient is quarantined, sampled and tested for identity, purity and microbial quality before release to production.' },
    { title: 'Validated manufacturing', description: 'Processes are validated across three consecutive batches; critical parameters are monitored and recorded in electronic batch records.' },
    { title: 'In-process checks', description: 'Operators and QA verify physical parameters at defined intervals; deviations trigger immediate investigation.' },
    { title: 'Finished-product analysis', description: 'Assay, dissolution, content uniformity, impurities, microbial limits and sterility (where applicable) against pharmacopoeial or in-house specifications.' },
    { title: 'Batch release', description: 'Quality Assurance reviews the complete batch record and analytical data before releasing the batch with a Certificate of Analysis.' },
    { title: 'Post-market surveillance', description: 'Ongoing stability, complaint handling and pharmacovigilance ensure quality throughout the product life cycle.' },
  ],
  standards: [
    { name: 'WHO-GMP (TRS 986)', description: 'Good manufacturing practices for pharmaceutical products' },
    { name: 'Revised Schedule M', description: 'Indian GMP aligned with WHO standards' },
    { name: 'ICH Q8 / Q9 / Q10', description: 'Pharmaceutical development, risk management and quality system' },
    { name: 'ICH Q1A(R2)', description: 'Stability testing of new drug substances and products' },
    { name: 'ISO 9001:2015', description: 'Quality management systems' },
    { name: 'USP / BP / Ph. Eur.', description: 'Pharmacopoeial testing standards' },
    { name: 'PIC/S guidance', description: 'Annex 1 principles for sterile manufacturing' },
    { name: 'ALCOA+', description: 'Data integrity principles' },
  ],
  faqs: [
    { question: 'Do you provide a Certificate of Analysis with every batch?', answer: 'Yes. Every shipment includes batch-specific CoAs, and full analytical data packages are available on request for regulatory submissions.' },
    { question: 'Can we audit your facilities?', answer: 'We welcome customer and regulatory audits. Contact us to schedule an on-site or virtual audit.' },
    { question: 'Which climatic zones do your stability studies cover?', answer: 'Long-term studies are run at 25°C/60% RH (Zone II), 30°C/65% RH (Zone IVa) and 30°C/75% RH (Zone IVb), plus accelerated 40°C/75% RH.' },
  ],
  meta: { title: 'Quality Assurance & GMP Compliance', description: 'Azeem Pharmaceuticals quality system: WHO-GMP, ICH Q10, ICH stability chambers, HPLC/GC labs, data integrity and 100% batch testing before release.', keywords: 'pharmaceutical quality assurance, GMP compliance, pharma quality control laboratory, ICH stability testing' },
}

export const manufacturingPage = {
  hero: { eyebrow: 'Manufacturing', title: 'Infrastructure engineered for quality and scale', subtitle: 'Five purpose-built facilities covering oral solids, liquids, externals, sterile injectables, R&D and export logistics – all WHO-GMP certified.' },
  intro: `Our manufacturing campus in Ahmedabad brings every dosage form under one management system. Dedicated blocks for β-lactam and general products, isolator-protected sterile filling, closed-system liquid processing and automated packaging lines deliver consistent quality at export scale – with capacity to grow alongside our partners.`,
  stats: [
    { value: '2.4', suffix: 'B', label: 'Tablets per year' },
    { value: '60', suffix: 'M', label: 'Vials per year' },
    { value: '30', suffix: 'M', label: 'Bottles per year' },
    { value: '39,000', suffix: ' m²', label: 'Built-up area' },
  ],
  capabilities: [
    { title: 'Oral solid dosage', icon: 'pill', description: 'Tablets (IR, ER, bilayer, ODT, dispersible), hard-gelatin and pellet capsules, sachets.' },
    { title: 'Oral liquids', icon: 'droplets', description: 'Syrups, suspensions, dry syrups, drops and oral solutions – sugar-free and pediatric variants.' },
    { title: 'Externals', icon: 'sun', description: 'Creams, ointments and gels in laminated tubes from 5 g to 50 g.' },
    { title: 'Sterile injectables', icon: 'syringe', description: 'Dry-powder and liquid vials, ampoules, and large-volume parenterals with terminal sterilisation.' },
    { title: 'β-lactam segregation', icon: 'shield-plus', description: 'Independent penicillin and cephalosporin blocks with dedicated HVAC and personnel flows.' },
    { title: 'Packaging & serialisation', icon: 'package', description: 'Blister, strip, bottle and tube lines with serialisation-ready coding for track-and-trace markets.' },
  ],
  process: [
    { title: 'Dispensing', description: 'Approved materials are dispensed under laminar airflow with double verification and electronic reconciliation.' },
    { title: 'Granulation & blending', description: 'Rapid mixer granulators, fluid-bed processors and bin blenders with validated end-points.' },
    { title: 'Compression / filling', description: 'High-speed rotary presses, capsule fillers, liquid fillers and aseptic vial/ampoule lines.' },
    { title: 'Coating & finishing', description: 'Perforated auto-coaters for film and enteric coating; inspection and polishing.' },
    { title: 'Primary & secondary packaging', description: 'Alu-Alu / Alu-PVC blisters, bottles with induction sealing, tubes and cartons with batch coding.' },
    { title: 'QA release & dispatch', description: 'Batch review, CoA issue and dispatch from the temperature-mapped central warehouse.' },
  ],
  contractManufacturing: {
    heading: 'Contract & third-party manufacturing',
    body: 'Launch or expand your own brand using our facilities, formulations and regulatory support. We handle development, artwork, stability, dossiers and production so you can focus on the market.',
    bullets: [{ text: 'Private-label manufacturing across all dosage forms' }, { text: 'Formulation development and technology transfer' }, { text: 'Artwork, packaging development and regulatory dossiers' }, { text: 'Flexible MOQs and dedicated project management' }],
  },
  faqs: [
    { question: 'Do you have separate facilities for penicillins and cephalosporins?', answer: 'Yes – both are manufactured in dedicated β-lactam blocks with independent air handling, gowning and material flows, fully segregated from general products.' },
    { question: 'What is your typical lead time?', answer: 'Registered products ship in 30–45 days from order confirmation; new private-label products typically take 60–90 days including artwork approval.' },
    { question: 'Can you manufacture my formulation?', answer: 'Our R&D team evaluates technology transfers and develops new formulations. Share your product profile and we will assess feasibility within a week.' },
  ],
  meta: { title: 'Pharmaceutical Manufacturing Facilities – WHO-GMP Plants', description: 'Explore Azeem Pharmaceuticals\' WHO-GMP manufacturing: oral solids, liquids, externals, sterile injectables, R&D and contract manufacturing capacity in Ahmedabad, India.', keywords: 'pharmaceutical manufacturing facility, WHO GMP plant, contract manufacturing pharma, third party manufacturing, injectable manufacturing plant' },
}

export const globalPresencePage = {
  hero: { eyebrow: 'Global presence', title: 'Serving healthcare partners in 50+ countries', subtitle: 'Registered products, local regulatory know-how and dependable logistics across Africa, the Middle East, Asia, the CIS and Latin America.' },
  intro: `Exporting medicines is about more than shipping boxes. Each market has its own regulator, dossier format, labelling language and distribution model. Over fifteen years we have built the registrations, partnerships and logistics to serve more than 50 countries – and we add new markets every year. Select a country below to see how we work there.`,
  stats: [
    { value: '50', suffix: '+', label: 'Countries' },
    { value: '1200', suffix: '+', label: 'Product registrations' },
    { value: '9', label: 'Regions' },
    { value: '40', suffix: '+', label: 'Containers per month' },
  ],
  exportServices: [
    { title: 'Product registration', icon: 'file-check', description: 'CTD / eCTD dossiers, stability data, CoPPs, samples and regulator query responses.' },
    { title: 'Tender supply', icon: 'clipboard-list', description: 'Government and institutional tenders with pre-shipment inspection and full documentation.' },
    { title: 'Private label', icon: 'package', description: 'Your brand, our formulations – artwork in local languages and market-specific packs.' },
    { title: 'Logistics', icon: 'ship', description: 'FCL, LCL and air freight with cold-chain options and Incoterms of your choice.' },
    { title: 'Local language support', icon: 'globe', description: 'English, French, Spanish, Portuguese, Arabic and Russian artwork and documentation.' },
    { title: 'After-sales', icon: 'headset', description: 'Dedicated account managers, pharmacovigilance support and complaint handling.' },
  ],
  process: [
    { title: 'Market assessment', description: 'We review your product list against local registration requirements and our existing approvals.' },
    { title: 'Dossier & samples', description: 'Regulatory affairs prepares dossiers, CoPPs and samples for submission by your licence holder.' },
    { title: 'Registration & artwork', description: 'We respond to regulator queries and finalise market-specific artwork in your language.' },
    { title: 'First shipment', description: 'Pre-shipment inspection, export documentation and dispatch – typically within 30–45 days of order.' },
  ],
  faqs: [
    { question: 'Can you register products in a country where you are not yet present?', answer: 'Yes. We regularly open new markets with our partners – our regulatory team assesses requirements and prepares dossiers for any regulator.' },
    { question: 'Do you sell directly to hospitals and pharmacies abroad?', answer: 'We supply through licensed importers and distributors in each country. If you are a hospital or pharmacy, we will connect you with our local partner or discuss a direct distribution agreement.' },
    { question: 'Which Incoterms do you offer?', answer: 'EXW, FOB, CIF and CFR are standard; DAP/DDP can be arranged for selected markets.' },
  ],
  meta: { title: 'Global Presence – Pharmaceutical Exporter to 50+ Countries', description: 'Azeem Pharmaceuticals exports WHO-GMP medicines to 50+ countries in Africa, the Middle East, Asia, CIS and Latin America. Country-by-country regulatory and market overview.', keywords: 'pharmaceutical exporter, pharma export countries, medicine supplier Africa, pharmaceutical supplier Middle East, pharma exporter Latin America' },
}

export const licensesPage = {
  hero: { eyebrow: 'Compliance', title: 'Licenses, certifications & accreditations', subtitle: 'The approvals behind every product we make – from manufacturing licences and WHO-GMP to ISO systems and export registrations.' },
  intro: `Transparency builds trust. Below is the current list of licences and certifications held by Azeem Pharmaceuticals. Copies of certificates, product-specific CoPPs and free sale certificates are available to partners and regulators on request.`,
  faqs: [
    { question: 'Can I get copies of your certificates for my registration file?', answer: 'Yes – send us a request through the contact form specifying the products and country, and we will share notarised or apostilled copies as required.' },
    { question: 'Are your certificates verifiable?', answer: 'All licences and certificates are issued by statutory regulators or accredited certification bodies and can be verified with the issuing authority using the certificate number.' },
  ],
  meta: { title: 'Licenses & Certifications – WHO-GMP, ISO, CoPP', description: 'View Azeem Pharmaceuticals\' manufacturing licences, WHO-GMP certificate, ISO 9001/14001/45001 certifications, CoPP, halal and other accreditations.', keywords: 'pharmaceutical licenses, WHO GMP certificate, ISO 9001 pharma, certificate of pharmaceutical product, pharma company certifications' },
}

export const contactPage = {
  hero: { eyebrow: 'Contact', title: 'Talk to our export team', subtitle: 'Product inquiries, registrations, private label projects or a facility audit – we reply within one business day.' },
  intro: `Whether you need a quotation for a single product or want to discuss a long-term distribution partnership, our international business team is ready to help. Use the form, email us directly or reach us on WhatsApp during business hours.`,
  departments: [
    { name: 'Export sales', email: 'exports@azeempharma.com', phone: '+91 79 4000 1234' },
    { name: 'Regulatory affairs', email: 'regulatory@azeempharma.com', phone: '+91 79 4000 1235' },
    { name: 'Contract manufacturing', email: 'cmo@azeempharma.com', phone: '+91 79 4000 1236' },
    { name: 'Quality & audits', email: 'quality@azeempharma.com' },
  ],
  formSuccessMessage: 'Thank you for contacting Azeem Pharmaceuticals. Our export team will respond within one business day.',
  faqs: [
    { question: 'What information should I include in my inquiry?', answer: 'Product names and strengths, quantities, target country and whether you need registration support or private labelling. This helps us reply with an accurate quotation.' },
    { question: 'Do you offer samples?', answer: 'Yes, samples are available for registration and evaluation purposes; courier charges may apply.' },
  ],
  meta: { title: 'Contact Azeem Pharmaceuticals – Export Inquiries', description: 'Contact Azeem Pharmaceuticals for product quotations, registrations, private label and contract manufacturing. Email, phone, WhatsApp and inquiry form.', keywords: 'contact pharmaceutical exporter, pharma export inquiry, pharmaceutical supplier contact' },
}

export const productsPage = {
  hero: { eyebrow: 'Products', title: 'Pharmaceutical product catalogue', subtitle: '300+ WHO-GMP certified generic formulations across ten therapeutic categories. Filter by category, dosage form or prescription status and add products to your inquiry list.' },
  intro: `Browse our complete range of tablets, capsules, syrups, injectables, creams and nutraceuticals. Every product page includes composition, indications, pack sizes, storage conditions and downloadable documentation. Add the products you need to your inquiry list and request a single quotation for everything.`,
  faqs: [
    { question: 'Are all listed products available for export?', answer: 'Yes – every product in the catalogue is manufactured in our WHO-GMP facilities and available for export, subject to registration in the destination country.' },
    { question: 'Can I request a product that is not listed?', answer: 'Our portfolio exceeds 300 formulations, not all of which are online. Tell us what you need and we will confirm availability or evaluate development.' },
  ],
  meta: { title: 'Pharmaceutical Products – Generic Medicines Catalogue', description: 'Browse 300+ WHO-GMP certified generic medicines: antibiotics, cardiovascular, diabetes, pain, GI, respiratory, dermatology, CNS, vitamins and injectables. Inquire for pricing.', keywords: 'pharmaceutical products list, generic medicines catalogue, pharma products exporter, medicine manufacturer product list' },
}

export const inquiryPage = {
  hero: { eyebrow: 'Inquiry', title: 'Request a quotation', subtitle: 'Review your inquiry list, add your details and send – our export team replies with pricing, MOQs and lead times within one business day.' },
  intro: `No payment is taken on this website. Your inquiry list is sent to our export team, who will confirm availability and pricing for your market.`,
  formSuccessMessage: 'Your inquiry has been received. A member of our export team will send you a quotation within one business day.',
  meta: { title: 'Request a Quotation – Pharmaceutical Inquiry', description: 'Send your pharmaceutical product inquiry to Azeem Pharmaceuticals and receive a quotation with MOQs and lead times within one business day.', keywords: 'pharmaceutical quotation request, medicine price inquiry, pharma bulk order inquiry' },
}
