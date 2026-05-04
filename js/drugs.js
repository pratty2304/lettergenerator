// Immunotherapy drugs available for prescription generation
// Each drug includes brand options used for PAP submissions in India.
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
      '240 mg IV every 2 weeks',
      '480 mg IV every 4 weeks',
      '3 mg/kg IV every 2 weeks (weight-based)',
      '360 mg IV every 3 weeks (in combination regimens)'
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
  }
];
