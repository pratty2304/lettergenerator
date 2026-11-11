// Oncology drugs available for prescription generation.
// Each drug includes brand options used for PAP / treatment prescriptions in India.
window.DRUGS = [
  {
    id: 'pembrolizumab',
    generic: 'Pembrolizumab',
    brands: ['Keytruda'],
    class: 'Anti–PD-1 monoclonal antibody',
    vialSizes: [100],
    standardDoses: [
      '200 mg IV every 3 weeks',
      '400 mg IV every 6 weeks',
      '2 mg/kg (max 200 mg) IV every 3 weeks (paediatric / weight-based)'
    ],
    defaultDose: '200 mg IV every 3 weeks',
    infusionTime: 'over 30 minutes',
    premedication: 'No routine premedication required. Paracetamol / antihistamine may be used at clinician’s discretion.',
    storage: 'Refrigerate at 2–8°C. Do not freeze. Protect from light.',
    indications: [
      'Non–small cell lung carcinoma (PD-L1 positive / combination)',
      'Head & neck squamous cell carcinoma',
      'Triple-negative breast cancer (PD-L1 CPS ≥ 10)',
      'MSI-H / dMMR solid tumours',
      'Hodgkin lymphoma, urothelial, renal cell, hepatocellular, gastric, cervical and endometrial carcinoma'
    ],
    monitoring: 'Baseline and pre-cycle CBC, LFT, RFT, TFT, blood glucose; clinical assessment for immune-related adverse events (irAEs) including pneumonitis, colitis, hepatitis, endocrinopathies and dermatitis.'
  },
  {
    id: 'nivolumab',
    generic: 'Nivolumab',
    brands: ['Opdyta', 'Tishtha', 'Opdivo'],
    class: 'Anti–PD-1 monoclonal antibody',
    vialSizes: [240, 100, 40],
    standardDoses: [
      '40 mg IV every 2 weeks',
      '240 mg IV every 2 weeks',
      '360 mg IV every 3 weeks',
      '480 mg IV every 4 weeks',
      '3 mg/kg IV every 2 weeks (weight-based)'
    ],
    defaultDose: '240 mg IV every 2 weeks',
    infusionTime: 'over 30 minutes',
    premedication: 'No routine premedication. Supportive antiemetics / antihistamines as required.',
    storage: 'Refrigerate at 2–8°C. Do not freeze. Protect from light.',
    indications: [
      'Non–small cell lung carcinoma (post-platinum / combination first-line)',
      'Renal cell carcinoma',
      'Melanoma (adjuvant and metastatic)',
      'Hodgkin lymphoma',
      'Squamous head & neck cancer, urothelial, hepatocellular, gastric / GE-junction, oesophageal and MSI-H colorectal carcinoma'
    ],
    monitoring: 'Baseline and pre-cycle CBC, LFT, RFT, TFT, cortisol, blood glucose; surveillance for irAEs including pneumonitis, colitis, hepatitis, endocrinopathies, nephritis and dermatitis.'
  },
  {
    id: 'durvalumab',
    generic: 'Durvalumab',
    brands: ['Imfinzi'],
    class: 'Anti–PD-L1 monoclonal antibody',
    vialSizes: [500, 120],
    standardDoses: [
      '1500 mg IV every 4 weeks (consolidation / maintenance)',
      '1500 mg IV every 3 weeks (with chemotherapy in NSCLC / biliary tract / extensive-stage SCLC)',
      '1120 mg IV every 3 weeks (with carboplatin–paclitaxel in endometrial carcinoma, DUO-E)',
      '10 mg/kg IV every 2 weeks (legacy weight-based dosing)'
    ],
    defaultDose: '1500 mg IV every 4 weeks',
    infusionTime: 'over 60 minutes',
    premedication: 'No routine premedication required.',
    storage: 'Refrigerate at 2–8°C. Do not freeze or shake. Protect from light.',
    indications: [
      'Stage III unresectable NSCLC — consolidation post chemoradiation (PACIFIC)',
      'Extensive-stage small-cell lung cancer (CASPIAN)',
      'Locally advanced / metastatic biliary tract carcinoma (TOPAZ-1)',
      'Hepatocellular carcinoma (HIMALAYA, with tremelimumab)',
      'Mismatch repair deficient endometrial carcinoma'
    ],
    monitoring: 'Baseline and pre-cycle CBC, LFT, RFT, TFT, cortisol; pulmonary review for pneumonitis especially in post-radiation setting. Standard irAE surveillance.'
  },
  {
    id: 'atezolizumab',
    generic: 'Atezolizumab',
    brands: ['Tecentriq'],
    class: 'Anti–PD-L1 monoclonal antibody',
    vialSizes: [1200, 840],
    standardDoses: [
      '840 mg IV every 2 weeks',
      '1200 mg IV every 3 weeks',
      '1680 mg IV every 4 weeks'
    ],
    defaultDose: '1200 mg IV every 3 weeks',
    infusionTime: 'over 60 minutes for the first infusion; 30 minutes for subsequent infusions if tolerated',
    premedication: 'No routine premedication required. Manage infusion reactions as per institutional protocol.',
    storage: 'Refrigerate at 2–8°C. Do not freeze. Protect from light.',
    indications: [
      'Non–small cell lung carcinoma',
      'Small-cell lung cancer',
      'Triple-negative breast cancer where indicated',
      'Hepatocellular carcinoma and urothelial carcinoma as per approved protocols'
    ],
    monitoring: 'Baseline and pre-cycle CBC, LFT, RFT, TFT, blood glucose; clinical surveillance for immune-related adverse events including pneumonitis, colitis, hepatitis, endocrinopathies and dermatitis.'
  },
  {
    id: 'tislelizumab',
    generic: 'Tislelizumab',
    brands: ['Tevimbra'],
    class: 'Anti–PD-1 monoclonal antibody (Fc-engineered)',
    vialSizes: [100],
    standardDoses: [
      '200 mg IV every 3 weeks'
    ],
    defaultDose: '200 mg IV every 3 weeks',
    infusionTime: 'over 60 minutes (first dose); 30 minutes for subsequent doses if tolerated',
    premedication: 'No routine premedication. Antihistamine / paracetamol prior to first infusion may be considered.',
    storage: 'Refrigerate at 2–8°C. Do not freeze. Protect from light.',
    indications: [
      'Oesophageal squamous cell carcinoma (RATIONALE-302 / 306)',
      'Gastric / gastro-oesophageal junction adenocarcinoma (RATIONALE-305)',
      'Non–small cell lung carcinoma (RATIONALE-303 / 304 / 307)',
      'Hepatocellular carcinoma'
    ],
    monitoring: 'Pre-cycle CBC, LFT, RFT, TFT and blood glucose. Surveillance for irAEs and infusion-related reactions, particularly during the first cycle.'
  },
  {
    id: 'phesgo',
    generic: 'Pertuzumab + Trastuzumab',
    brands: ['Phesgo'],
    class: 'HER2-directed fixed-dose subcutaneous combination',
    standardDoses: [
      'Loading dose (1200mg + 600mg)',
      'Maintenance dose (600mg + 600mg)'
    ],
    defaultDose: 'Loading dose (1200mg + 600mg)',
    infusionTime: 'Subcutaneous injection in the thigh: approximately 8 minutes for initial dose; approximately 5 minutes for maintenance dose.',
    premedication: 'No routine premedication specified. Keep emergency medicines and equipment available for hypersensitivity or administration-related reactions.',
    storage: 'Refrigerate at 2–8°C in the original carton. Do not freeze. Do not shake. Protect from light.',
    indications: [
      'HER2-positive early breast cancer as part of neoadjuvant / adjuvant therapy where pertuzumab + trastuzumab is indicated',
      'HER2-positive metastatic breast cancer in combination with chemotherapy where pertuzumab + trastuzumab is indicated'
    ],
    monitoring: 'Confirm HER2-positive status before treatment. Assess baseline and periodic LVEF as per protocol; monitor for administration-related reactions, hypersensitivity, cardiomyopathy and chemotherapy-related toxicity when used in combination.'
  },
  {
    id: 'osimertinib',
    generic: 'Osimertinib',
    brands: ['Tagrisso'],
    class: 'EGFR tyrosine kinase inhibitor',
    prescriptionPrefix: 'Tab.',
    standardDoses: [
      '80 mg oral once daily',
      '40 mg oral once daily (dose reduction)'
    ],
    defaultDose: '80 mg oral once daily',
    infusionTime: 'Oral therapy; no infusion required.',
    premedication: 'No routine premedication required.',
    storage: 'Store at room temperature as per manufacturer guidance. Protect from moisture.',
    indications: [
      'EGFR-mutated non–small cell lung carcinoma',
      'Adjuvant therapy after resection in EGFR-mutated NSCLC where indicated',
      'EGFR T790M-positive disease after prior EGFR TKI therapy'
    ],
    monitoring: 'Baseline and periodic CBC, LFT, ECG/QTc assessment where clinically indicated, and monitoring for diarrhoea, rash, pneumonitis / ILD symptoms and cardiac dysfunction.'
  },
  {
    id: 'daratumumab',
    generic: 'Daratumumab',
    brands: ['Darzalex'],
    class: 'Anti-CD38 monoclonal antibody (intravenous)',
    vialSizes: [400, 100],
    standardDoses: [
      '16 mg/kg IV weekly (weeks 1–8)',
      '16 mg/kg IV every 2 weeks (weeks 9–24)',
      '16 mg/kg IV every 4 weeks (week 25 onwards)',
      '16 mg/kg IV every 3 weeks (with bortezomib-based regimens)',
      '8 mg/kg IV on Day 1 and Day 2 (split first dose)'
    ],
    defaultDose: '16 mg/kg IV weekly (weeks 1–8)',
    infusionTime: 'First infusion approximately 7 hours with rate escalation; second approximately 4.5 hours; subsequent approximately 3.5 hours (90-minute rapid infusion from cycle 3 if tolerated).',
    premedication: 'Corticosteroid (dexamethasone 20 mg or methylprednisolone 100 mg), paracetamol and antihistamine 1–3 hours before each infusion; montelukast may be considered before the first infusion. Post-infusion oral corticosteroid as per protocol.',
    storage: 'Refrigerate at 2–8°C. Do not freeze or shake. Protect from light.',
    indications: [
      'Multiple myeloma — newly diagnosed (transplant-eligible and ineligible) and relapsed / refractory, in combination regimens or as monotherapy'
    ],
    monitoring: 'Blood group, antibody screen and indirect antiglobulin test before the first dose (daratumumab interferes with cross-matching). CBC, RFT, LFT, HBV serology; monitor for infusion-related reactions and infections.'
  },
  {
    id: 'daratumumab-sc',
    generic: 'Daratumumab S/C',
    brands: ['Darzalex Faspro'],
    class: 'Anti-CD38 monoclonal antibody with hyaluronidase (subcutaneous)',
    standardDoses: [
      '1800 mg SC weekly (weeks 1–8)',
      '1800 mg SC every 2 weeks (weeks 9–24)',
      '1800 mg SC every 4 weeks (week 25 onwards)',
      '1800 mg SC every 3 weeks (with bortezomib-based regimens)'
    ],
    defaultDose: '1800 mg SC weekly (weeks 1–8)',
    infusionTime: 'Subcutaneous injection into the abdomen over approximately 3–5 minutes.',
    premedication: 'Corticosteroid, paracetamol and antihistamine 1–3 hours before each dose. Post-dose oral corticosteroid as per protocol.',
    storage: 'Refrigerate at 2–8°C. Do not freeze or shake. Protect from light.',
    indications: [
      'Multiple myeloma — newly diagnosed and relapsed / refractory, in combination regimens or as monotherapy',
      'Light-chain (AL) amyloidosis with bortezomib, cyclophosphamide and dexamethasone (ANDROMEDA)'
    ],
    monitoring: 'Blood group, antibody screen and indirect antiglobulin test before the first dose. CBC, RFT, LFT, HBV serology; monitor for injection-site and systemic administration reactions and infections.'
  },
  {
    id: 'amivantamab',
    generic: 'Amivantamab',
    brands: ['Rybrevant'],
    class: 'EGFR–MET bispecific monoclonal antibody',
    vialSizes: [350],
    standardDoses: [
      '1050 mg IV weekly × 4, then every 2 weeks (body weight < 80 kg)',
      '1400 mg IV weekly × 4, then every 2 weeks (body weight ≥ 80 kg)',
      '1400 mg IV weekly × 4 (with carboplatin–pemetrexed, body weight < 80 kg)',
      '1750 mg IV every 3 weeks from week 7 (with carboplatin–pemetrexed, body weight < 80 kg)',
      '1750 mg IV weekly × 4 (with carboplatin–pemetrexed, body weight ≥ 80 kg)',
      '2100 mg IV every 3 weeks from week 7 (with carboplatin–pemetrexed, body weight ≥ 80 kg)'
    ],
    defaultDose: '1050 mg IV weekly × 4, then every 2 weeks (body weight < 80 kg)',
    infusionTime: 'First dose split over Day 1 and Day 2 with slow initial rate; subsequent infusions approximately 2 hours, via peripheral line on cycle 1.',
    premedication: 'Antihistamine and paracetamol before every dose; glucocorticoid (dexamethasone 20 mg or methylprednisolone 100 mg) before the first doses. Prophylactic anticoagulation for the first 4 months when given with lazertinib.',
    storage: 'Refrigerate at 2–8°C. Do not freeze. Protect from light.',
    indications: [
      'EGFR exon 19 deletion / L858R NSCLC — first line with lazertinib (MARIPOSA)',
      'EGFR-mutated NSCLC after osimertinib, with carboplatin–pemetrexed (MARIPOSA-2)',
      'EGFR exon 20 insertion NSCLC — with carboplatin–pemetrexed (PAPILLON) or after platinum'
    ],
    monitoring: 'CBC, LFT, RFT, electrolytes including magnesium; monitor for infusion-related reactions, rash / paronychia, ILD / pneumonitis, ocular toxicity and venous thromboembolism.'
  },
  {
    id: 'serplulimab',
    generic: 'Serplulimab',
    brands: ['Hetronifly'],
    class: 'Anti–PD-1 monoclonal antibody',
    vialSizes: [100],
    standardDoses: [
      '4.5 mg/kg IV every 3 weeks',
      '3 mg/kg IV every 2 weeks'
    ],
    defaultDose: '4.5 mg/kg IV every 3 weeks',
    infusionTime: 'over 30–60 minutes',
    premedication: 'No routine premedication required.',
    storage: 'Refrigerate at 2–8°C. Do not freeze. Protect from light.',
    indications: [
      'Extensive-stage small-cell lung cancer with carboplatin–etoposide (ASTRUM-005)',
      'Squamous NSCLC with chemotherapy (ASTRUM-004)',
      'Oesophageal squamous cell carcinoma with chemotherapy (ASTRUM-007)'
    ],
    monitoring: 'Baseline and pre-cycle CBC, LFT, RFT, TFT, cortisol, blood glucose; surveillance for immune-related adverse events.'
  },
  {
    id: 'dostarlimab',
    generic: 'Dostarlimab',
    brands: ['Jemperli'],
    class: 'Anti–PD-1 monoclonal antibody',
    vialSizes: [500],
    standardDoses: [
      '500 mg IV every 3 weeks',
      '1000 mg IV every 6 weeks'
    ],
    defaultDose: '500 mg IV every 3 weeks',
    infusionTime: 'over 30 minutes',
    premedication: 'No routine premedication required.',
    storage: 'Refrigerate at 2–8°C. Do not freeze or shake. Protect from light.',
    indications: [
      'Primary advanced / recurrent endometrial carcinoma with carboplatin–paclitaxel (RUBY)',
      'dMMR / MSI-H recurrent endometrial carcinoma and solid tumours after prior therapy',
      'dMMR locally advanced rectal cancer'
    ],
    monitoring: 'Baseline and pre-cycle CBC, LFT, RFT, TFT, cortisol, blood glucose; surveillance for immune-related adverse events.'
  },
  {
    id: 'polatuzumab',
    generic: 'Polatuzumab vedotin',
    brands: ['Polivy'],
    class: 'Anti-CD79b antibody–drug conjugate',
    vialSizes: [140, 30],
    standardDoses: [
      '1.8 mg/kg IV every 3 weeks × 6 cycles (with R-CHP)',
      '1.8 mg/kg IV every 3 weeks × 6 cycles (with bendamustine–rituximab)'
    ],
    defaultDose: '1.8 mg/kg IV every 3 weeks × 6 cycles (with R-CHP)',
    infusionTime: 'First infusion over 90 minutes; subsequent infusions over 30 minutes if tolerated.',
    premedication: 'Antihistamine and paracetamol before each dose. G-CSF prophylaxis, PJP and antiviral prophylaxis as per protocol.',
    storage: 'Refrigerate at 2–8°C. Do not freeze or shake. Protect from light.',
    indications: [
      'Previously untreated DLBCL with R-CHP (POLARIX)',
      'Relapsed / refractory DLBCL with bendamustine–rituximab'
    ],
    monitoring: 'CBC before each cycle, LFT, HBV serology; monitor for peripheral neuropathy, infections, myelosuppression and infusion reactions.'
  },
  {
    id: 'abemaciclib',
    generic: 'Abemaciclib',
    brands: ['Ramiven'],
    class: 'CDK4/6 inhibitor',
    prescriptionPrefix: 'Tab.',
    standardDoses: [
      '150 mg oral twice daily',
      '100 mg oral twice daily (dose reduction)',
      '50 mg oral twice daily (dose reduction)',
      '200 mg oral twice daily (monotherapy)'
    ],
    defaultDose: '150 mg oral twice daily',
    infusionTime: 'Oral therapy; no infusion required.',
    premedication: 'No premedication. Keep loperamide available for diarrhoea.',
    storage: 'Store at room temperature as per manufacturer guidance.',
    indications: [
      'HR-positive, HER2-negative high-risk early breast cancer with endocrine therapy for 2 years (monarchE)',
      'HR-positive, HER2-negative advanced / metastatic breast cancer with an aromatase inhibitor or fulvestrant'
    ],
    monitoring: 'CBC and LFT every 2 weeks for the first 2 months, monthly for the next 2 months, then as indicated; monitor for diarrhoea, venous thromboembolism and ILD / pneumonitis.'
  },
  {
    id: 'ribociclib',
    generic: 'Ribociclib',
    brands: ['Kisqali'],
    class: 'CDK4/6 inhibitor',
    prescriptionPrefix: 'Tab.',
    standardDoses: [
      '600 mg oral once daily, Days 1–21 every 28 days',
      '400 mg oral once daily, Days 1–21 every 28 days',
      '200 mg oral once daily, Days 1–21 every 28 days (dose reduction)'
    ],
    defaultDose: '600 mg oral once daily, Days 1–21 every 28 days',
    infusionTime: 'Oral therapy; no infusion required.',
    premedication: 'No routine premedication required.',
    storage: 'Store at room temperature as per manufacturer guidance.',
    indications: [
      'HR-positive, HER2-negative advanced / metastatic breast cancer with an aromatase inhibitor or fulvestrant',
      'HR-positive, HER2-negative stage II–III early breast cancer with an aromatase inhibitor for 3 years at 400 mg (NATALEE)'
    ],
    monitoring: 'ECG at baseline, Day 14 of cycle 1 and start of cycle 2 (QTc); CBC and LFT every 2 weeks for the first 2 cycles, then as indicated; electrolytes; review interacting drugs.'
  },
  {
    id: 'trastuzumab',
    generic: 'Trastuzumab',
    brands: ['Herceptin', 'Hertraz', 'Vivitra', 'Canmab'],
    class: 'Anti-HER2 monoclonal antibody (intravenous)',
    vialSizes: [440, 150],
    standardDoses: [
      '8 mg/kg IV loading dose, then 6 mg/kg every 3 weeks',
      '6 mg/kg IV every 3 weeks (maintenance)',
      '4 mg/kg IV loading dose, then 2 mg/kg weekly',
      '2 mg/kg IV weekly (maintenance)'
    ],
    defaultDose: '8 mg/kg IV loading dose, then 6 mg/kg every 3 weeks',
    infusionTime: 'Loading dose over 90 minutes; subsequent doses over 30 minutes if tolerated.',
    premedication: 'No routine premedication. Paracetamol / antihistamine for infusion reactions as required.',
    storage: 'Refrigerate at 2–8°C. Do not freeze.',
    indications: [
      'HER2-positive early and metastatic breast cancer',
      'HER2-positive metastatic gastric / gastro-oesophageal junction adenocarcinoma'
    ],
    monitoring: 'Baseline and 3-monthly LVEF (ECHO / MUGA); monitor for infusion reactions and cardiac dysfunction.'
  },
  {
    id: 'trastuzumab-deruxtecan',
    generic: 'Trastuzumab deruxtecan',
    brands: ['Enhertu'],
    class: 'Anti-HER2 antibody–drug conjugate',
    vialSizes: [100],
    standardDoses: [
      '5.4 mg/kg IV every 3 weeks (breast cancer / other HER2-expressing solid tumours)',
      '6.4 mg/kg IV every 3 weeks (gastric / GE-junction adenocarcinoma)'
    ],
    defaultDose: '5.4 mg/kg IV every 3 weeks (breast cancer / other HER2-expressing solid tumours)',
    infusionTime: 'First infusion over 90 minutes; subsequent infusions over 30 minutes if tolerated.',
    premedication: 'Antiemetic prophylaxis for moderate–high emetic risk (5-HT3 antagonist + dexamethasone ± NK1 antagonist).',
    storage: 'Refrigerate at 2–8°C. Do not freeze. Protect from light.',
    indications: [
      'HER2-positive metastatic breast cancer',
      'HER2-low / HER2-ultralow metastatic breast cancer',
      'HER2-positive gastric / GE-junction adenocarcinoma',
      'HER2-mutant NSCLC and HER2-expressing (IHC 3+) solid tumours'
    ],
    monitoring: 'CBC before each dose; baseline and periodic LVEF; vigilant monitoring for ILD / pneumonitis (consider baseline and periodic CT chest).'
  },
  {
    id: 'bevacizumab',
    generic: 'Bevacizumab',
    brands: ['Avastin', 'Bevatas', 'Krabeva'],
    class: 'Anti-VEGF monoclonal antibody',
    vialSizes: [400, 100],
    standardDoses: [
      '5 mg/kg IV every 2 weeks',
      '10 mg/kg IV every 2 weeks',
      '7.5 mg/kg IV every 3 weeks',
      '15 mg/kg IV every 3 weeks'
    ],
    defaultDose: '15 mg/kg IV every 3 weeks',
    infusionTime: 'First infusion over 90 minutes, second over 60 minutes, subsequent over 30 minutes if tolerated.',
    premedication: 'No routine premedication required.',
    storage: 'Refrigerate at 2–8°C. Do not freeze or shake. Protect from light.',
    indications: [
      'Metastatic colorectal carcinoma',
      'Non-squamous NSCLC',
      'Ovarian, fallopian tube and primary peritoneal carcinoma',
      'Cervical carcinoma, glioblastoma, and hepatocellular carcinoma with atezolizumab'
    ],
    monitoring: 'Blood pressure and urine protein before each dose; monitor for bleeding, wound-healing complications, GI perforation and thromboembolism. Withhold around surgery.'
  },
  {
    id: 'cemiplimab',
    generic: 'Cemiplimab',
    brands: ['Libtayo'],
    class: 'Anti–PD-1 monoclonal antibody',
    vialSizes: [350],
    standardDoses: [
      '350 mg IV every 3 weeks'
    ],
    defaultDose: '350 mg IV every 3 weeks',
    infusionTime: 'over 30 minutes',
    premedication: 'No routine premedication required.',
    storage: 'Refrigerate at 2–8°C. Do not freeze or shake. Protect from light.',
    indications: [
      'Advanced cutaneous squamous cell carcinoma',
      'Advanced basal cell carcinoma after hedgehog-pathway inhibitor',
      'NSCLC (PD-L1 ≥ 50% monotherapy, or with chemotherapy)',
      'Recurrent / metastatic cervical carcinoma after platinum'
    ],
    monitoring: 'Baseline and pre-cycle CBC, LFT, RFT, TFT, cortisol, blood glucose; surveillance for immune-related adverse events.'
  }
];
