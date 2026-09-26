export type SeedFacility = {
  name: string
  slug: string
  type: 'formulation' | 'api' | 'rnd' | 'qc-lab' | 'warehouse'
  city: string
  country: string
  address: string
  summary: string
  description: string
  dosageForms: string[]
  capabilities: string[]
  capacity: { label: string; value: string }[]
  areaSqm: number
  establishedYear: number
  image: 'facility' | 'lab' | 'warehouse' | 'quality'
}

export const facilities: SeedFacility[] = [
  {
    name: 'Unit I – Oral Solid Dosage Plant',
    slug: 'unit-1-oral-solid-dosage-plant',
    type: 'formulation',
    city: 'Ahmedabad',
    country: 'India',
    address: 'Plot 12, Pharma Industrial Estate, Ahmedabad, Gujarat',
    summary: 'WHO-GMP certified tablet and capsule plant with dedicated β-lactam and general blocks, high-speed compression and film-coating lines.',
    description: `## Tablets & capsules at scale

Unit I houses separate general and β-lactam (penicillin & cephalosporin) blocks, each with independent air-handling units, gowning and material airlocks. Granulation is performed in rapid mixer granulators and fluid-bed processors; compression on 45-station double-rotary presses with in-process weight, hardness and thickness monitoring; and coating in perforated auto-coaters.

## Packaging flexibility

Alu-Alu and Alu-PVC blister lines, strip packaging, HDPE bottle lines with induction sealing and bulk export packs allow us to match any market's presentation requirements.`,
    dosageForms: ['Tablet', 'Capsule', 'Sachet / Powder'],
    capabilities: ['Dedicated β-lactam block', 'Film & enteric coating', 'Bi-layer tablets', 'Dispersible & ODT tablets', 'Pellet-filled capsules', 'Serialisation-ready packaging'],
    capacity: [
      { label: 'Tablets', value: '2.4 billion / year' },
      { label: 'Capsules', value: '600 million / year' },
      { label: 'Sachets', value: '40 million / year' },
    ],
    areaSqm: 12500,
    establishedYear: 2009,
    image: 'facility',
  },
  {
    name: 'Unit II – Oral Liquids & Externals Plant',
    slug: 'unit-2-oral-liquids-externals-plant',
    type: 'formulation',
    city: 'Ahmedabad',
    country: 'India',
    address: 'Plot 14, Pharma Industrial Estate, Ahmedabad, Gujarat',
    summary: 'Syrups, suspensions, dry syrups, drops, creams, ointments and gels manufactured in closed-system processing vessels with automated filling.',
    description: `## Liquids, dry syrups and topicals

Closed-system manufacturing vessels with in-line homogenisers, purified-water loops validated to pharmacopoeial standards and automatic bottle filling with ROPP / CRC capping. A separate externals block produces creams, ointments and gels filled into laminated tubes from 5 g to 50 g.`,
    dosageForms: ['Oral Suspension / Syrup', 'Oral Solution / Drops', 'Ointment / Cream / Gel', 'Sachet / Powder'],
    capabilities: ['Dry syrup filling', 'Sugar-free formulations', 'Pediatric drops with dosing droppers', 'Lami-tube filling', 'Homogenised emulsion bases'],
    capacity: [
      { label: 'Oral liquids', value: '30 million bottles / year' },
      { label: 'Dry syrups', value: '12 million bottles / year' },
      { label: 'Tubes', value: '18 million / year' },
    ],
    areaSqm: 8200,
    establishedYear: 2013,
    image: 'facility',
  },
  {
    name: 'Unit III – Sterile Injectables Plant',
    slug: 'unit-3-sterile-injectables-plant',
    type: 'formulation',
    city: 'Ahmedabad',
    country: 'India',
    address: 'Plot 21, Pharma Industrial Estate, Ahmedabad, Gujarat',
    summary: 'Grade A/B aseptic areas for dry-powder vials, liquid vials and ampoules, plus a large-volume parenteral line with terminal sterilisation.',
    description: `## Sterile manufacturing

The injectables plant operates isolator-protected filling lines for dry-powder cephalosporin vials, liquid vials and ampoules, supported by a validated HVAC system, environmental monitoring programme and 100% automated visual inspection. A separate LVP line produces IV fluids in 100–1000 ml bottles with terminal sterilisation.`,
    dosageForms: ['Injection', 'Infusion'],
    capabilities: ['Dry powder vial filling', 'Ampoule filling & sealing', 'LVP with terminal sterilisation', 'Lyophilisation (pilot scale)', 'Automated visual inspection', 'Media-fill validated'],
    capacity: [
      { label: 'Vials', value: '60 million / year' },
      { label: 'Ampoules', value: '80 million / year' },
      { label: 'IV fluids', value: '25 million bottles / year' },
    ],
    areaSqm: 9800,
    establishedYear: 2018,
    image: 'lab',
  },
  {
    name: 'R&D Centre & Quality Control Laboratory',
    slug: 'rd-centre-quality-control-laboratory',
    type: 'rnd',
    city: 'Ahmedabad',
    country: 'India',
    address: 'Plot 12A, Pharma Industrial Estate, Ahmedabad, Gujarat',
    summary: 'Formulation development, analytical method validation, ICH stability chambers and microbiology laboratory.',
    description: `## Science behind every batch

Our R&D centre develops bioequivalent generics and value-added formulations, supported by an analytical laboratory equipped with HPLC, GC, UV, dissolution and Karl Fischer systems. ICH-compliant stability chambers (Zone II, IVa and IVb) generate the data required for registration in tropical and sub-tropical markets.`,
    dosageForms: [],
    capabilities: ['Formulation development', 'Analytical method validation', 'ICH stability studies (Zone II / IVa / IVb)', 'Microbiology & sterility testing', 'CTD / eCTD dossier preparation', 'Bioequivalence study coordination'],
    capacity: [
      { label: 'HPLC systems', value: '14' },
      { label: 'Stability chambers', value: '9' },
      { label: 'New dossiers', value: '25+ / year' },
    ],
    areaSqm: 2600,
    establishedYear: 2012,
    image: 'lab',
  },
  {
    name: 'Central Warehouse & Export Logistics Hub',
    slug: 'central-warehouse-export-logistics-hub',
    type: 'warehouse',
    city: 'Ahmedabad',
    country: 'India',
    address: 'Plot 30, Pharma Industrial Estate, Ahmedabad, Gujarat',
    summary: 'Temperature-mapped finished-goods warehouse with cold-chain capability and in-house export documentation.',
    description: `## From warehouse to your port

Finished goods are stored in temperature-mapped racking with 2–8 °C cold rooms for sensitive products. Our export team prepares commercial invoices, packing lists, CoAs, CoPPs and certificates of origin, and coordinates FCL/LCL and air shipments through Mundra, Nhava Sheva and Ahmedabad airport.`,
    dosageForms: [],
    capabilities: ['Temperature-mapped storage', '2–8 °C cold rooms', 'Consolidated FCL / LCL shipments', 'Export documentation & pre-shipment inspection', 'Third-party logistics coordination'],
    capacity: [
      { label: 'Pallet positions', value: '4,000' },
      { label: 'Containers / month', value: '40+' },
    ],
    areaSqm: 6000,
    establishedYear: 2016,
    image: 'warehouse',
  },
]
