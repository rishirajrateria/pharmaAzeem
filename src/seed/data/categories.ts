export type SeedCategory = {
  title: string
  slug: string
  icon: string
  shortDescription: string
  description: string
  highlights?: string[]
  faqs?: { question: string; answer: string }[]
  meta: { title: string; description: string; keywords: string }
  children?: SeedCategory[]
}

export const categories: SeedCategory[] = [
  {
    title: 'Antibiotics & Anti-infectives',
    slug: 'antibiotics-anti-infectives',
    icon: 'bug',
    shortDescription:
      'WHO-GMP certified antibiotics, antifungals and antimalarials in tablet, capsule, suspension and injectable forms.',
    description: `## Broad-spectrum anti-infective range for global markets

Our anti-infective portfolio covers the most prescribed antibiotic classes – cephalosporins, macrolides, penicillins and fluoroquinolones – alongside antifungal and antimalarial therapies. Every batch is manufactured in WHO-GMP certified facilities with validated dissolution and assay testing, and is supported with Certificates of Analysis, stability data and dossiers in CTD format for registration in your market.

## Why partners source anti-infectives from us

- Dedicated β-lactam block with independent air-handling to prevent cross-contamination
- Pediatric-friendly dry syrups and dispersible tablets
- Bulk export packs and private-label options available`,
    highlights: [
      'Dedicated β-lactam facility',
      'Dry syrups & dispersible tablets',
      'CTD dossiers available',
    ],
    faqs: [
      {
        question: 'Do you supply antibiotics for tender business?',
        answer:
          'Yes. We regularly supply institutional and government tenders with WHO-GMP certified antibiotics, complete with CoA, CoPP and stability data.',
      },
      {
        question: 'Can antibiotics be private-labelled?',
        answer:
          'Most products in this category are available for third-party / private-label manufacturing subject to minimum order quantities.',
      },
    ],
    meta: {
      title: 'Antibiotics & Anti-infectives Manufacturer & Exporter',
      description:
        'WHO-GMP certified antibiotic, antifungal and antimalarial medicines – cephalosporins, macrolides, penicillins, fluoroquinolones – for import, tenders and private label.',
      keywords:
        'antibiotics manufacturer, antibiotic exporter, cephalosporin supplier, azithromycin manufacturer, WHO GMP antibiotics',
    },
    children: [
      {
        title: 'Cephalosporins',
        slug: 'cephalosporins',
        icon: 'shield-plus',
        shortDescription:
          'Cefixime, cefuroxime, cefpodoxime and ceftriaxone in oral and injectable forms.',
        description: `## Cephalosporin antibiotics\n\nFirst to third generation cephalosporins manufactured in a dedicated cephalosporin block. Available as tablets, dispersible tablets, dry syrups and sterile injections.`,
        meta: {
          title: 'Cephalosporin Antibiotics Manufacturer',
          description:
            'Cefixime, cefuroxime, cefpodoxime, ceftriaxone – oral and injectable cephalosporins from a WHO-GMP certified dedicated facility.',
          keywords: 'cephalosporin manufacturer, cefixime supplier, ceftriaxone injection exporter',
        },
      },
      {
        title: 'Macrolides',
        slug: 'macrolides',
        icon: 'pill',
        shortDescription: 'Azithromycin, clarithromycin and erythromycin tablets and suspensions.',
        description: `## Macrolide antibiotics\n\nMacrolides for respiratory, skin and sexually transmitted infections, offered in film-coated tablets and reconstitutable oral suspensions.`,
        meta: {
          title: 'Macrolide Antibiotics – Azithromycin & Clarithromycin Manufacturer',
          description:
            'Azithromycin and clarithromycin tablets and oral suspensions from a WHO-GMP certified manufacturer and exporter.',
          keywords:
            'azithromycin manufacturer, clarithromycin supplier, macrolide antibiotics exporter',
        },
      },
      {
        title: 'Penicillins',
        slug: 'penicillins',
        icon: 'capsule',
        shortDescription:
          'Amoxicillin and amoxicillin-clavulanate in capsules, tablets and dry syrups.',
        description: `## Penicillin antibiotics\n\nAmoxicillin and co-amoxiclav combinations manufactured in a dedicated penicillin block with validated cleaning procedures.`,
        meta: {
          title: 'Amoxicillin & Co-amoxiclav Manufacturer',
          description:
            'Penicillin antibiotics – amoxicillin capsules, amoxicillin-clavulanate tablets and dry syrups – for export and private label.',
          keywords: 'amoxicillin manufacturer, co-amoxiclav supplier, penicillin exporter',
        },
      },
      {
        title: 'Fluoroquinolones',
        slug: 'fluoroquinolones',
        icon: 'activity',
        shortDescription: 'Ciprofloxacin, levofloxacin and ofloxacin tablets and infusions.',
        description: `## Fluoroquinolone antibiotics\n\nBroad-spectrum fluoroquinolones for urinary, respiratory and gastrointestinal infections in tablet and IV infusion presentations.`,
        meta: {
          title: 'Fluoroquinolone Antibiotics Manufacturer',
          description:
            'Ciprofloxacin, levofloxacin and ofloxacin tablets and infusions from a WHO-GMP certified pharmaceutical exporter.',
          keywords: 'ciprofloxacin manufacturer, levofloxacin supplier, fluoroquinolone exporter',
        },
      },
      {
        title: 'Antifungals',
        slug: 'antifungals',
        icon: 'leaf',
        shortDescription: 'Fluconazole, itraconazole and terbinafine oral therapies.',
        description: `## Antifungal medicines\n\nSystemic antifungal therapies for candidiasis, dermatophytosis and onychomycosis in capsules and tablets.`,
        meta: {
          title: 'Antifungal Medicines Manufacturer',
          description:
            'Fluconazole, itraconazole and terbinafine antifungal tablets and capsules for global export.',
          keywords: 'fluconazole manufacturer, itraconazole supplier, antifungal exporter',
        },
      },
      {
        title: 'Antimalarials',
        slug: 'antimalarials',
        icon: 'thermometer',
        shortDescription: 'Artemether-lumefantrine and artesunate for malaria-endemic markets.',
        description: `## Antimalarial medicines\n\nArtemisinin-based combination therapies (ACTs) and artesunate injections for uncomplicated and severe malaria.`,
        meta: {
          title: 'Antimalarial Medicines Manufacturer & Exporter',
          description:
            'Artemether-lumefantrine tablets and artesunate injections from a WHO-GMP certified antimalarial manufacturer for Africa and Asia.',
          keywords:
            'antimalarial manufacturer, artemether lumefantrine supplier, artesunate exporter',
        },
      },
      {
        title: 'Antiprotozoals & Anthelmintics',
        slug: 'antiprotozoals-anthelmintics',
        icon: 'microscope',
        shortDescription: 'Metronidazole, ornidazole, secnidazole, nitazoxanide and albendazole.',
        description: `## Antiprotozoal and anthelmintic medicines\n\nNitroimidazole antiprotozoals and anthelmintics for amoebiasis, giardiasis, trichomoniasis and intestinal worm infections, in tablet, chewable tablet and suspension forms.`,
        meta: {
          title: 'Antiprotozoal & Anthelmintic Medicines Supplier',
          description:
            'Metronidazole, ornidazole, secnidazole, nitazoxanide and albendazole tablets and suspensions for export.',
          keywords:
            'metronidazole supplier, albendazole exporter, secnidazole tablets, nitazoxanide, antiprotozoal medicines',
        },
      },
      {
        title: 'Other Anti-infectives',
        slug: 'other-anti-infectives',
        icon: 'shield-check',
        shortDescription:
          'Doxycycline, tetracycline, chloramphenicol, co-trimoxazole, aciclovir and combination kits.',
        description: `## Other anti-infective medicines\n\nTetracyclines, chloramphenicol, sulfonamide combinations, aciclovir and anti-infective combination kits that sit outside the main antibiotic classes.`,
        meta: {
          title: 'Doxycycline, Co-trimoxazole & Anti-infective Kits Supplier',
          description:
            'Doxycycline, tetracycline, chloramphenicol, co-trimoxazole, aciclovir and combination kits for export.',
          keywords:
            'doxycycline supplier, co-trimoxazole exporter, chloramphenicol capsules, aciclovir tablets',
        },
      },
    ],
  },
  {
    title: 'Cardiovascular',
    slug: 'cardiovascular',
    icon: 'heart-pulse',
    shortDescription:
      'Antihypertensives, statins and antiplatelet therapies for chronic cardiac care.',
    description: `## Cardiovascular medicines built for adherence

Hypertension, dyslipidaemia and thrombotic disease are lifelong conditions – our cardiovascular range focuses on consistent bioavailability, patient-friendly film-coated tablets and cost-effective combination therapies.

- Bioequivalence-backed generics of leading molecules
- Fixed-dose combinations to simplify regimens
- Blister and bottle packs for retail and institutional supply`,
    highlights: [
      'Fixed-dose combinations',
      'Bioequivalence data available',
      'Retail & institutional packs',
    ],
    meta: {
      title: 'Cardiovascular Medicines Manufacturer & Exporter',
      description:
        'Antihypertensive, statin, anticoagulant and antiplatelet generics from a WHO-GMP certified cardiovascular medicines manufacturer.',
      keywords:
        'cardiovascular drugs manufacturer, antihypertensive exporter, statin supplier, amlodipine manufacturer',
    },
    children: [
      {
        title: 'Antihypertensives',
        slug: 'antihypertensives',
        icon: 'activity',
        shortDescription: 'Amlodipine, telmisartan, losartan and combinations.',
        description: `## Antihypertensive medicines\n\nCalcium channel blockers, ARBs, beta blockers and diuretics – single and fixed-dose combinations.`,
        meta: {
          title: 'Antihypertensive Medicines Manufacturer',
          description:
            'Amlodipine, telmisartan and losartan tablets and combinations for blood pressure management – export quality.',
          keywords: 'amlodipine manufacturer, telmisartan supplier, antihypertensive exporter',
        },
      },
      {
        title: 'Lipid-lowering (Statins)',
        slug: 'statins',
        icon: 'droplets',
        shortDescription: 'Atorvastatin and rosuvastatin film-coated tablets.',
        description: `## Statins\n\nHMG-CoA reductase inhibitors for cholesterol management, available in multiple strengths.`,
        meta: {
          title: 'Statin Tablets Manufacturer – Atorvastatin & Rosuvastatin',
          description:
            'Atorvastatin and rosuvastatin film-coated tablets in 10–40 mg strengths from a WHO-GMP certified manufacturer.',
          keywords: 'atorvastatin manufacturer, rosuvastatin supplier, statin exporter',
        },
      },
      {
        title: 'Anticoagulants & Antiplatelets',
        slug: 'anticoagulants-antiplatelets',
        icon: 'shield-check',
        shortDescription: 'Clopidogrel, aspirin combinations and anticoagulant therapies.',
        description: `## Anticoagulant and antiplatelet medicines\n\nSecondary prevention therapies for cardiovascular and cerebrovascular events.`,
        meta: {
          title: 'Antiplatelet & Anticoagulant Medicines Manufacturer',
          description:
            'Clopidogrel and aspirin-based antiplatelet tablets for cardiovascular prevention from a certified exporter.',
          keywords: 'clopidogrel manufacturer, antiplatelet supplier, anticoagulant exporter',
        },
      },
      {
        title: 'Venous & Vascular Health',
        slug: 'vasoprotectives',
        icon: 'activity',
        shortDescription: 'Diosmin and diosmin–hesperidin for chronic venous insufficiency.',
        description: `## Vasoprotective medicines\n\nFlavonoid venotonics used in chronic venous insufficiency, haemorrhoids and leg heaviness.`,
        meta: {
          title: 'Diosmin & Hesperidin Tablets Supplier',
          description: 'Diosmin 600 mg and diosmin–hesperidin 450/50 mg tablets for export.',
          keywords:
            'diosmin tablets supplier, diosmin hesperidin exporter, venous insufficiency tablets',
        },
      },
    ],
  },
  {
    title: 'Diabetes & Endocrine',
    slug: 'diabetes-endocrine',
    icon: 'droplets',
    shortDescription: 'Oral antidiabetics and thyroid therapies for metabolic health.',
    description: `## Metabolic and endocrine care

From metformin to modern DPP-4 and SGLT2 inhibitor generics, our diabetes range supports affordable long-term glycaemic control. Thyroid hormone replacement tablets complete the endocrine portfolio.`,
    highlights: [
      'Extended-release metformin',
      'DPP-4 & SGLT2 generics',
      'Precision-dosed thyroid tablets',
    ],
    meta: {
      title: 'Diabetes & Endocrine Medicines Manufacturer',
      description:
        'Metformin, glimepiride, sitagliptin, dapagliflozin and levothyroxine generics from a WHO-GMP certified diabetes medicines manufacturer.',
      keywords:
        'antidiabetic manufacturer, metformin exporter, sitagliptin supplier, levothyroxine manufacturer',
    },
    children: [
      {
        title: 'Oral Antidiabetics',
        slug: 'oral-antidiabetics',
        icon: 'pill',
        shortDescription: 'Metformin, glimepiride, sitagliptin, dapagliflozin and combinations.',
        description: `## Oral antidiabetic medicines\n\nBiguanides, sulfonylureas, DPP-4 inhibitors and SGLT2 inhibitors in mono and combination tablets.`,
        meta: {
          title: 'Oral Antidiabetic Tablets Manufacturer',
          description:
            'Metformin, glimepiride, sitagliptin and dapagliflozin tablets for type 2 diabetes from an export-focused manufacturer.',
          keywords: 'metformin manufacturer, glimepiride supplier, dapagliflozin exporter',
        },
      },
      {
        title: 'Thyroid',
        slug: 'thyroid',
        icon: 'activity',
        shortDescription: 'Levothyroxine sodium tablets in precise strengths.',
        description: `## Thyroid medicines\n\nLevothyroxine tablets manufactured with tight content-uniformity controls across 25–150 mcg strengths.`,
        meta: {
          title: 'Levothyroxine Tablets Manufacturer',
          description:
            'Levothyroxine sodium tablets 25–150 mcg from a WHO-GMP certified manufacturer with tight content-uniformity controls.',
          keywords: 'levothyroxine manufacturer, thyroid tablets exporter',
        },
      },
      {
        title: 'Oral Corticosteroids',
        slug: 'systemic-corticosteroids',
        icon: 'pill',
        shortDescription:
          'Dexamethasone, prednisolone, methylprednisolone and deflazacort tablets.',
        description: `## Oral corticosteroids\n\nSystemic corticosteroid tablets for inflammatory, allergic and immune conditions.`,
        meta: {
          title: 'Oral Corticosteroid Tablets Supplier',
          description:
            'Dexamethasone, prednisolone, methylprednisolone and deflazacort tablets for export.',
          keywords:
            'dexamethasone tablets supplier, prednisolone exporter, deflazacort tablets, methylprednisolone',
        },
      },
    ],
  },
  {
    title: 'Pain & Inflammation',
    slug: 'pain-inflammation',
    icon: 'bone',
    shortDescription:
      'NSAIDs, analgesics, antipyretics and muscle relaxants for acute and chronic pain.',
    description: `## Pain management essentials

High-volume analgesic and anti-inflammatory products including paracetamol, ibuprofen, diclofenac and aceclofenac – produced on high-speed compression lines with excellent batch-to-batch consistency.`,
    highlights: ['High-speed OSD lines', 'Retail & hospital packs', 'Pediatric drops & syrups'],
    meta: {
      title: 'Analgesic & Anti-inflammatory Medicines Manufacturer',
      description:
        'Paracetamol, ibuprofen, diclofenac and aceclofenac tablets, suspensions and gels from a WHO-GMP certified pain medicines manufacturer.',
      keywords:
        'paracetamol manufacturer, NSAID exporter, diclofenac supplier, analgesic manufacturer',
    },
    children: [
      {
        title: 'NSAIDs',
        slug: 'nsaids',
        icon: 'flask-conical',
        shortDescription: 'Ibuprofen, diclofenac, aceclofenac and combinations.',
        description: `## Non-steroidal anti-inflammatory drugs\n\nTablets, suspensions and topical gels for musculoskeletal pain and inflammation.`,
        meta: {
          title: 'NSAID Manufacturer – Ibuprofen, Diclofenac, Aceclofenac',
          description:
            'NSAID tablets, suspensions and gels from a certified manufacturer and exporter.',
          keywords: 'ibuprofen manufacturer, diclofenac exporter, aceclofenac supplier',
        },
      },
      {
        title: 'Analgesics & Antipyretics',
        slug: 'analgesics-antipyretics',
        icon: 'thermometer',
        shortDescription: 'Paracetamol tablets, syrups and pediatric drops.',
        description: `## Analgesic and antipyretic medicines\n\nParacetamol in every presentation – 500 mg and 650 mg tablets, 120/125/250 mg per 5 ml suspensions and 100 mg/ml pediatric drops.`,
        meta: {
          title: 'Paracetamol Manufacturer – Tablets, Syrup & Drops',
          description:
            'Paracetamol 500/650 mg tablets, pediatric suspensions and drops from a high-volume WHO-GMP manufacturer.',
          keywords: 'paracetamol manufacturer, paracetamol syrup exporter, antipyretic supplier',
        },
      },
      {
        title: 'Muscle Relaxants',
        slug: 'muscle-relaxants',
        icon: 'bone',
        shortDescription: 'Thiocolchicoside and chlorzoxazone combinations.',
        description: `## Muscle relaxants\n\nSkeletal muscle relaxant combinations with NSAIDs for back pain and spasm.`,
        meta: {
          title: 'Muscle Relaxant Tablets Manufacturer',
          description:
            'Thiocolchicoside and chlorzoxazone combination tablets from an export-quality manufacturer.',
          keywords: 'muscle relaxant manufacturer, thiocolchicoside supplier',
        },
      },
      {
        title: 'Opioid Analgesics',
        slug: 'opioid-analgesics',
        icon: 'pill-bottle',
        shortDescription:
          'Tramadol and tapentadol-based analgesics (prescription only; permits required).',
        description: `## Opioid analgesics\n\nPrescription-only opioid analgesics for moderate to severe pain. These are controlled products: supply is subject to the importing country’s licence and permit requirements.`,
        meta: {
          title: 'Opioid Analgesics Supplier – Licensed Importers',
          description:
            'Tramadol and tapentadol-based analgesics supplied against valid import authorisation.',
          keywords:
            'tramadol supplier, tapentadol exporter, opioid analgesic export, controlled medicines export',
        },
      },
      {
        title: 'Topical Pain Relief',
        slug: 'topical-pain-relief',
        icon: 'flask-conical',
        shortDescription:
          'Menthol, diclofenac and methyl salicylate gels for muscle and joint pain.',
        description: `## Topical pain relief\n\nCooling and anti-inflammatory gels for localised muscle and joint pain.`,
        meta: {
          title: 'Topical Pain Relief Gels Supplier',
          description: 'Menthol, diclofenac, linseed oil and methyl salicylate gels for export.',
          keywords: 'pain relief gel supplier, menthol gel exporter, diclofenac gel',
        },
      },
    ],
  },
  {
    title: 'Gastrointestinal',
    slug: 'gastrointestinal',
    icon: 'stethoscope',
    shortDescription: 'PPIs, antiemetics, antacids and laxatives for digestive health.',
    description: `## Gastrointestinal therapies

Proton pump inhibitors, antiemetics and antiulcer medicines manufactured with enteric-coating expertise and validated pellet technology for delayed-release capsules.`,
    highlights: ['Enteric-coated pellets', 'ODT & MUPS technology', 'Combination PPI + prokinetic'],
    meta: {
      title: 'Gastrointestinal Medicines Manufacturer & Exporter',
      description:
        'Pantoprazole, omeprazole, esomeprazole, ondansetron and domperidone generics from a WHO-GMP certified GI medicines manufacturer.',
      keywords:
        'PPI manufacturer, pantoprazole exporter, ondansetron supplier, gastrointestinal drugs manufacturer',
    },
    children: [
      {
        title: 'Proton Pump Inhibitors',
        slug: 'proton-pump-inhibitors',
        icon: 'capsule',
        shortDescription: 'Pantoprazole, omeprazole, esomeprazole and rabeprazole.',
        description: `## Proton pump inhibitors\n\nDelayed-release tablets and capsules, plus IV injections for hospital use.`,
        meta: {
          title: 'Proton Pump Inhibitor Manufacturer',
          description:
            'Pantoprazole, omeprazole, esomeprazole and rabeprazole tablets, capsules and injections from a certified exporter.',
          keywords: 'pantoprazole manufacturer, omeprazole exporter, esomeprazole supplier',
        },
      },
      {
        title: 'Antiemetics',
        slug: 'antiemetics',
        icon: 'pill',
        shortDescription: 'Ondansetron and domperidone tablets, syrups and injections.',
        description: `## Antiemetic medicines\n\n5-HT3 antagonists and dopamine antagonists for nausea and vomiting.`,
        meta: {
          title: 'Antiemetic Medicines Manufacturer',
          description:
            'Ondansetron and domperidone tablets, oral solutions and injections for nausea from a certified manufacturer.',
          keywords: 'ondansetron manufacturer, domperidone supplier, antiemetic exporter',
        },
      },
      {
        title: 'Antacids & Antiulcer',
        slug: 'antacids-antiulcer',
        icon: 'droplets',
        shortDescription: 'Antacid suspensions, sucralfate and H2 blockers.',
        description: `## Antacids and antiulcer medicines\n\nLiquid antacids, sucralfate suspensions and famotidine tablets.`,
        meta: {
          title: 'Antacid & Antiulcer Medicines Manufacturer',
          description:
            'Antacid suspensions, sucralfate and famotidine from a WHO-GMP certified manufacturer and exporter.',
          keywords: 'antacid manufacturer, sucralfate supplier, famotidine exporter',
        },
      },
      {
        title: 'Laxatives',
        slug: 'laxatives',
        icon: 'leaf',
        shortDescription: 'Lactulose solution and bulk-forming laxatives.',
        description: `## Laxatives\n\nOsmotic and bulk-forming laxatives for constipation management.`,
        meta: {
          title: 'Laxative Medicines Manufacturer',
          description:
            'Lactulose solution and other laxatives from a certified pharmaceutical exporter.',
          keywords: 'lactulose manufacturer, laxative supplier',
        },
      },
      {
        title: 'Antispasmodics & Antidiarrhoeals',
        slug: 'antispasmodics-antidiarrhoeals',
        icon: 'activity',
        shortDescription: 'Hyoscine, dicyclomine and mebeverine combinations and loperamide.',
        description: `## Antispasmodics and antidiarrhoeals\n\nMedicines for abdominal cramps, spasm and acute diarrhoea.`,
        meta: {
          title: 'Antispasmodic & Antidiarrhoeal Medicines Supplier',
          description:
            'Hyoscine butylbromide, dicyclomine and mebeverine combinations and loperamide for export.',
          keywords:
            'hyoscine butylbromide supplier, loperamide capsules, mebeverine combination, dicyclomine',
        },
      },
    ],
  },
  {
    title: 'Respiratory & Allergy',
    slug: 'respiratory-allergy',
    icon: 'wind',
    shortDescription: 'Antihistamines, bronchodilators, cough and cold preparations.',
    description: `## Respiratory and allergy care

Seasonal and chronic respiratory conditions demand reliable supply. Our range spans second-generation antihistamines, montelukast, salbutamol and cough formulations for adults and children.`,
    highlights: ['Sugar-free syrups', 'Chewable pediatric tablets', 'Inhalation therapies'],
    meta: {
      title: 'Respiratory & Allergy Medicines Manufacturer',
      description:
        'Cetirizine, levocetirizine, montelukast, salbutamol and cough syrups from a WHO-GMP certified respiratory medicines manufacturer.',
      keywords:
        'antihistamine manufacturer, montelukast exporter, cough syrup manufacturer, salbutamol supplier',
    },
    children: [
      {
        title: 'Antihistamines',
        slug: 'antihistamines',
        icon: 'sun',
        shortDescription: 'Cetirizine, levocetirizine, fexofenadine and montelukast combinations.',
        description: `## Antihistamines\n\nNon-sedating antihistamines in tablets and syrups, including montelukast combinations.`,
        meta: {
          title: 'Antihistamine Tablets & Syrups Manufacturer',
          description:
            'Cetirizine, levocetirizine and fexofenadine antihistamines from a certified manufacturer and exporter.',
          keywords: 'cetirizine manufacturer, levocetirizine supplier, antihistamine exporter',
        },
      },
      {
        title: 'Bronchodilators',
        slug: 'bronchodilators',
        icon: 'wind',
        shortDescription: 'Salbutamol tablets, syrups and inhalers.',
        description: `## Bronchodilators\n\nShort-acting beta agonists for asthma and COPD in oral and inhalation forms.`,
        meta: {
          title: 'Bronchodilator Medicines Manufacturer',
          description:
            'Salbutamol tablets, syrups and metered-dose inhalers from a WHO-GMP certified manufacturer.',
          keywords: 'salbutamol manufacturer, inhaler exporter, bronchodilator supplier',
        },
      },
      {
        title: 'Cough & Cold',
        slug: 'cough-cold',
        icon: 'thermometer',
        shortDescription: 'Expectorant and antitussive syrups, cold combinations.',
        description: `## Cough and cold preparations\n\nAmbroxol, dextromethorphan and guaifenesin syrups plus multi-symptom cold tablets.`,
        meta: {
          title: 'Cough Syrup & Cold Medicines Manufacturer',
          description:
            'Ambroxol, dextromethorphan and guaifenesin cough syrups and cold tablets from a certified exporter.',
          keywords: 'cough syrup manufacturer, ambroxol exporter, cold tablets supplier',
        },
      },
    ],
  },
  {
    title: 'Vitamins & Nutraceuticals',
    slug: 'vitamins-nutraceuticals',
    icon: 'sparkles',
    shortDescription: 'Multivitamins, minerals, iron, calcium and pediatric nutrition.',
    description: `## Nutritional health products

Softgels, tablets, syrups and sachets covering daily multivitamins, iron and folic acid, calcium with vitamin D3 and pediatric drops – formulated for stability in hot and humid climates.`,
    highlights: ['Climate-stable formulations', 'Softgel capability', 'Private label friendly'],
    meta: {
      title: 'Vitamins & Nutraceuticals Manufacturer & Exporter',
      description:
        'Multivitamin tablets, iron-folic acid, calcium-vitamin D3, vitamin D3 softgels and pediatric drops from a certified nutraceutical manufacturer.',
      keywords:
        'multivitamin manufacturer, nutraceutical exporter, vitamin D3 supplier, calcium tablets manufacturer',
    },
    children: [
      {
        title: 'Multivitamins',
        slug: 'multivitamins',
        icon: 'sparkles',
        shortDescription: 'Daily multivitamin and multimineral tablets, capsules and syrups.',
        description: `## Multivitamins\n\nComprehensive daily formulas for adults, seniors and women.`,
        meta: {
          title: 'Multivitamin Tablets & Syrups Manufacturer',
          description:
            'Multivitamin and multimineral tablets, capsules and syrups from a WHO-GMP certified manufacturer.',
          keywords: 'multivitamin manufacturer, multivitamin syrup exporter',
        },
      },
      {
        title: 'Minerals & Supplements',
        slug: 'minerals-supplements',
        icon: 'leaf',
        shortDescription: 'Iron, calcium, zinc and vitamin D3 supplements.',
        description: `## Mineral supplements\n\nIron-folic acid, calcium-D3, zinc and vitamin D3 in tablets, softgels and sachets.`,
        meta: {
          title: 'Mineral Supplements Manufacturer – Iron, Calcium, Zinc, D3',
          description:
            'Iron-folic acid, calcium-vitamin D3 and zinc supplements from a certified exporter.',
          keywords: 'iron folic acid manufacturer, calcium d3 supplier, zinc tablets exporter',
        },
      },
      {
        title: 'Pediatric Nutrition',
        slug: 'pediatric-nutrition',
        icon: 'baby',
        shortDescription: 'Multivitamin drops, zinc syrups and ORS.',
        description: `## Pediatric nutrition\n\nDrops, syrups and oral rehydration salts designed for infants and children.`,
        meta: {
          title: 'Pediatric Nutrition Products Manufacturer',
          description:
            'Pediatric multivitamin drops, zinc syrup and ORS sachets from a WHO-GMP certified manufacturer.',
          keywords: 'pediatric drops manufacturer, ORS exporter, zinc syrup supplier',
        },
      },
      {
        title: 'Iron & Haematinics',
        slug: 'haematinics',
        icon: 'droplets',
        shortDescription:
          'Iron, folic acid, vitamin B12 and zinc tablets, capsules, syrups and drops.',
        description: `## Iron and haematinic products\n\nIron preparations – ferrous fumarate, ferrous ascorbate, iron polymaltose complex and choline citrate – with folic acid, vitamin B12 and zinc for the prevention and treatment of iron-deficiency anaemia.`,
        meta: {
          title: 'Iron, Folic Acid & Haematinic Supplements Supplier',
          description:
            'Iron polymaltose, ferrous ascorbate and ferrous fumarate with folic acid and B12 in tablets, capsules and syrups.',
          keywords:
            'iron syrup supplier, ferrous ascorbate exporter, iron polymaltose, folic acid tablets, haematinic',
        },
      },
    ],
  },
  {
    title: 'Dermatology',
    slug: 'dermatology',
    icon: 'sun',
    shortDescription:
      'Topical antibiotics, antifungals and corticosteroid creams, gels and ointments.',
    description: `## Topical dermatology range

Creams, ointments and gels manufactured in a dedicated externals block with homogenised bases for consistent texture and stability.`,
    highlights: ['Dedicated externals plant', 'Lami tubes 5 g – 50 g', 'Combination topicals'],
    meta: {
      title: 'Dermatology Creams & Ointments Manufacturer',
      description:
        'Topical antibiotic, antifungal and corticosteroid creams, gels and ointments from a WHO-GMP certified dermatology manufacturer.',
      keywords:
        'dermatology products manufacturer, cream exporter, antifungal cream supplier, topical steroid manufacturer',
    },
    children: [
      {
        title: 'Topical Antibiotics',
        slug: 'topical-antibiotics',
        icon: 'shield-plus',
        shortDescription: 'Mupirocin and fusidic acid creams.',
        description: `## Topical antibiotics\n\nMupirocin and fusidic acid for skin infections.`,
        meta: {
          title: 'Topical Antibiotic Cream Manufacturer',
          description: 'Mupirocin and fusidic acid creams from a certified manufacturer.',
          keywords: 'mupirocin manufacturer, fusidic acid cream exporter',
        },
      },
      {
        title: 'Antifungal Creams',
        slug: 'antifungal-creams',
        icon: 'leaf',
        shortDescription: 'Clotrimazole, terbinafine and luliconazole creams.',
        description: `## Antifungal creams\n\nTopical azoles and allylamines for dermatophyte and yeast infections.`,
        meta: {
          title: 'Antifungal Cream Manufacturer',
          description:
            'Clotrimazole, terbinafine and luliconazole creams from a WHO-GMP certified exporter.',
          keywords: 'clotrimazole cream manufacturer, terbinafine cream supplier',
        },
      },
      {
        title: 'Corticosteroids',
        slug: 'topical-corticosteroids',
        icon: 'sun',
        shortDescription: 'Betamethasone, clobetasol and combination creams.',
        description: `## Topical corticosteroids\n\nLow to very-high potency corticosteroids and combinations with antifungals and antibiotics.`,
        meta: {
          title: 'Topical Corticosteroid Cream Manufacturer',
          description:
            'Betamethasone and clobetasol creams and combinations from a certified manufacturer.',
          keywords: 'betamethasone cream manufacturer, clobetasol exporter',
        },
      },
      {
        title: 'Antiseptics & Hygiene',
        slug: 'antiseptics-hygiene',
        icon: 'shield-check',
        shortDescription: 'Povidone-iodine, chlorhexidine gel and alcohol hand rubs.',
        description: `## Antiseptics and hygiene\n\nSkin and hand antiseptics including povidone-iodine solution, chlorhexidine gel and hand rub.`,
        meta: {
          title: 'Antiseptic Solutions & Hand Rub Supplier',
          description: 'Povidone-iodine solution, chlorhexidine gel and hand rub for export.',
          keywords:
            'povidone iodine supplier, chlorhexidine gel exporter, hand rub supplier, antiseptic solution',
        },
      },
    ],
  },
  {
    title: 'Central Nervous System',
    slug: 'central-nervous-system',
    icon: 'brain',
    shortDescription: 'Antiepileptics, antidepressants and anxiolytics.',
    description: `## Neuro-psychiatric medicines

Consistent quality is critical for CNS therapies with narrow therapeutic windows. Our range is manufactured with validated content-uniformity controls and full stability profiles.`,
    highlights: [
      'Narrow-therapeutic-index expertise',
      'Extended-release formats',
      'Controlled-substance compliance',
    ],
    meta: {
      title: 'CNS Medicines Manufacturer – Antiepileptics & Antidepressants',
      description:
        'Carbamazepine, sodium valproate, phenobarbital, fluoxetine, amitriptyline and benzodiazepine generics for export.',
      keywords:
        'antiepileptic manufacturer, antidepressant exporter, levetiracetam supplier, olanzapine manufacturer',
    },
    children: [
      {
        title: 'Antiepileptics',
        slug: 'antiepileptics',
        icon: 'activity',
        shortDescription: 'Levetiracetam, sodium valproate and carbamazepine.',
        description: `## Antiepileptic medicines\n\nTablets, extended-release tablets and oral solutions for seizure control.`,
        meta: {
          title: 'Antiepileptic Medicines Manufacturer',
          description:
            'Levetiracetam, sodium valproate and carbamazepine tablets and solutions from a certified exporter.',
          keywords: 'levetiracetam manufacturer, valproate supplier, antiepileptic exporter',
        },
      },
      {
        title: 'Antidepressants & Anxiolytics',
        slug: 'antidepressants-anxiolytics',
        icon: 'brain',
        shortDescription: 'Escitalopram, sertraline and related therapies.',
        description: `## Antidepressants and anxiolytics\n\nSSRIs and related therapies in film-coated tablets.`,
        meta: {
          title: 'Antidepressant Tablets Manufacturer',
          description:
            'Escitalopram and sertraline film-coated tablets from a WHO-GMP certified manufacturer.',
          keywords: 'escitalopram manufacturer, sertraline supplier, antidepressant exporter',
        },
      },
    ],
  },
  {
    title: 'Dental & Oral Care',
    slug: 'dental-oral-care',
    icon: 'shield-plus',
    shortDescription: 'Desensitising toothpastes, dental gels and antiseptic mouthwashes.',
    description: `## Dental and oral care range

Potassium nitrate and fluoride toothpastes for sensitive teeth, children's fluoride gels, gum paints and chlorhexidine mouthwashes, offered in several flavours.

## Why importers choose this range

- Several flavours of the same formula (original, lemon, mint)
- Toothpastes, gels and mouthwashes from one supplier
- Private-label options on request`,
    highlights: ['Potassium nitrate + fluoride formulas', 'Mouthwashes & gels', 'Flavour variants'],
    faqs: [
      {
        question: 'Can I order dental products in private-label packs?',
        answer:
          'Yes – tell us the product, flavour and pack size you need in your inquiry and we will confirm minimum order quantities and artwork requirements.',
      },
      {
        question: 'Which flavours are available?',
        answer:
          'Toothpastes and mouthwashes are listed in original, lemon and mint variants; other flavours can be discussed on request.',
      },
    ],
    meta: {
      title: 'Dental & Oral Care Products Supplier – Toothpaste, Mouthwash',
      description:
        'Potassium nitrate and fluoride toothpastes, dental gels and chlorhexidine mouthwash for export. Request a quotation.',
      keywords:
        'toothpaste supplier, potassium nitrate toothpaste, mouthwash exporter, dental gel, oral care export',
    },
    children: [
      {
        title: 'Toothpastes & Dental Gels',
        slug: 'toothpastes-gels',
        icon: 'sparkles',
        shortDescription: 'Desensitising and fluoride toothpastes, dental gels and gum paints.',
        description: `## Toothpastes and dental gels\n\nPotassium nitrate + sodium fluoride desensitising toothpastes, children's fluoride gel and gum paint.`,
        meta: {
          title: 'Toothpaste & Dental Gel Supplier',
          description:
            'Potassium nitrate and sodium fluoride toothpastes, fluoride gels and gum paints for export.',
          keywords: 'desensitising toothpaste supplier, potassium nitrate toothpaste, fluoride gel',
        },
      },
      {
        title: 'Mouthwashes & Oral Rinses',
        slug: 'mouthwashes-rinses',
        icon: 'droplets',
        shortDescription: 'Antiseptic and fluoride mouthwashes.',
        description: `## Mouthwashes and oral rinses\n\nChlorhexidine antiseptic mouthwash and potassium nitrate + fluoride mouthwash.`,
        meta: {
          title: 'Mouthwash & Oral Rinse Supplier',
          description:
            'Chlorhexidine and potassium nitrate + sodium fluoride mouthwashes for export.',
          keywords: 'mouthwash supplier, chlorhexidine mouthwash, fluoride mouthwash exporter',
        },
      },
    ],
  },
  {
    title: 'Sexual & Reproductive Health',
    slug: 'sexual-reproductive-health',
    icon: 'heart-handshake',
    shortDescription: 'Erectile dysfunction treatments, women’s health kits and urinary health.',
    description: `## Sexual and reproductive health

Prescription-only products in this range are supplied to licensed importers, wholesalers and institutions in line with the regulations of the destination country.

## Included product groups

- PDE-5 inhibitors for erectile dysfunction
- Women's health kits and lactation support
- Urinary antispasmodics`,
    highlights: ['Prescription-only range', 'Licensed importers', 'Kits and tablets'],
    faqs: [
      {
        question: 'Are these products available to private individuals?',
        answer:
          'No. Prescription-only products are supplied to licensed importers, distributors and institutions that can provide the permits required in the destination country.',
      },
      {
        question: 'Which documents are needed to quote?',
        answer:
          'Please include your company details, import licence and the products and quantities you require.',
      },
    ],
    meta: {
      title: 'Sexual & Reproductive Health Medicines Supplier',
      description:
        'Sildenafil, tadalafil, women’s health kits and urinary antispasmodics supplied to licensed importers.',
      keywords:
        'sildenafil supplier, tadalafil exporter, womens health kits, flavoxate tablets, licensed importer medicines',
    },
    children: [
      {
        title: 'Erectile Dysfunction',
        slug: 'erectile-dysfunction',
        icon: 'pill',
        shortDescription: 'Sildenafil, tadalafil and sildenafil–dapoxetine tablets.',
        description: `## Erectile dysfunction treatments\n\nPDE-5 inhibitor tablets and combinations, prescription only.`,
        meta: {
          title: 'Sildenafil & Tadalafil Tablets Supplier',
          description:
            'Sildenafil, tadalafil and sildenafil–dapoxetine tablets supplied to licensed importers.',
          keywords: 'sildenafil tablets supplier, tadalafil exporter, dapoxetine combination',
        },
      },
      {
        title: 'Women’s Health',
        slug: 'womens-health',
        icon: 'heart-handshake',
        shortDescription: 'Mifepristone–misoprostol kits and lactation support.',
        description: `## Women's health\n\nRegulated kits supplied only against valid import authorisation, and nutritional support for breastfeeding mothers.`,
        meta: {
          title: 'Women’s Health Products Supplier',
          description:
            'Mifepristone–misoprostol kits and lactation support products supplied to licensed importers.',
          keywords: 'mifepristone misoprostol kit supplier, womens health medicines export',
        },
      },
      {
        title: 'Urinary Health',
        slug: 'urinary-health',
        icon: 'activity',
        shortDescription: 'Flavoxate and other urinary tract antispasmodics.',
        description: `## Urinary health\n\nUrinary antispasmodic tablets for bladder spasm and urinary frequency.`,
        meta: {
          title: 'Urinary Antispasmodic Tablets Supplier',
          description: 'Flavoxate hydrochloride tablets for export.',
          keywords: 'flavoxate tablets supplier, urinary antispasmodic exporter',
        },
      },
    ],
  },
]
