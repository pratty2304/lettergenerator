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
      '1500 mg IV every 3 weeks (with chemotherapy in NSCLC / biliary tract / endometrial)',
      '10 mg/kg IV every 2 weeks (legacy weight-based dosing)',
      '1120 mg IV every 3 weeks (extensive-stage SCLC with chemotherapy)'
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
  }
];
