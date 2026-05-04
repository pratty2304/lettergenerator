/* ========================================================================
   Letter templates for KIMS MACS Letter Generator
   Each template:
     - meta: title shown in header, fields rendered in form
     - render(data): returns HTML string for the letter body (excluding logo
       header, which app.js prepends)
   ======================================================================== */

(function () {
  // ---------- shared field definitions ----------
  const F = {
    patientName:   { name: 'patientName',   label: 'Patient name',           type: 'text',     required: true },
    age:           { name: 'age',           label: 'Age (years)',            type: 'number',   required: true },
    sex:           { name: 'sex',           label: 'Sex',                    type: 'select',   options: ['Male', 'Female', 'Other'], required: true },
    mrn:           { name: 'mrn',           label: 'MRN / UHID',             type: 'text' },
    diagnosis:     { name: 'diagnosis',     label: 'Diagnosis',              type: 'textarea', required: true,
                     placeholder: 'e.g. Carcinoma of left breast — pT2N1M0, ER+/PR+/HER2-, Stage IIB' },
    consultant:    { name: 'consultantId',  label: 'Signing consultant',     type: 'doctor',   required: true },
    letterDate:    { name: 'letterDate',    label: 'Letter date',            type: 'date',     required: true, default: 'today' },
  };

  // ---------- helper renderers ----------
  function patientBlock(d) {
    return `
      <div class="patient-block">
        <div class="pt-row"><span>Patient</span><span>${esc(d.patientName)}</span></div>
        <div class="pt-row"><span>Age / Sex</span><span>${esc(d.age)} years / ${esc(d.sex)}</span></div>
        ${d.mrn ? `<div class="pt-row"><span>MRN / UHID</span><span>${esc(d.mrn)}</span></div>` : ''}
        <div class="pt-row"><span>Diagnosis</span><span>${esc(d.diagnosis)}</span></div>
      </div>`;
  }

  function meta(letterDate) {
    return `<div class="meta-row">
              <span><strong>Date:</strong> ${formatDate(letterDate)}</span>
            </div>`;
  }

  function signoff(doc) {
    return `<div class="signoff">
      <p>Regards,</p>
      <div class="sig-space"></div>
      <div class="doctor-name">${doc.name}</div>
      <div class="doctor-meta">
        ${doc.qualifications}<br/>
        ${doc.designation}<br/>
        ${doc.institute}<br/>
        KMC No: ${doc.kmc}
      </div>
    </div>`;
  }

  function heading(title) {
    return `<h1 class="letter-heading letter-heading-no-print">${title}</h1>`;
  }

  function esc(s) {
    if (s === undefined || s === null) return '';
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function formatDate(iso) {
    if (!iso) return '';
    const parts = parseIsoDate(iso);
    if (!parts) return iso;
    const d = new Date(parts.year, parts.month - 1, parts.day);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  function randomRef() {
    return Math.floor(1000 + Math.random() * 9000) + '/' + new Date().getFullYear();
  }

  function pronoun(sex, kind) {
    if (sex === 'Male') {
      if (kind === 'subj') return 'he';
      if (kind === 'subjC') return 'He';
      if (kind === 'obj') return 'him';
      if (kind === 'poss') return 'his';
      if (kind === 'possC') return 'His';
    }
    if (sex === 'Female') {
      if (kind === 'subj') return 'she';
      if (kind === 'subjC') return 'She';
      if (kind === 'obj') return 'her';
      if (kind === 'poss') return 'her';
      if (kind === 'possC') return 'Her';
    }
    if (sex === 'Other') {
      if (kind === 'subj') return 'they';
      if (kind === 'subjC') return 'They';
      if (kind === 'obj') return 'them';
      if (kind === 'poss') return 'their';
      if (kind === 'possC') return 'Their';
    }
    if (kind === 'subj') return 'he/she';
    if (kind === 'subjC') return 'He/She';
    if (kind === 'obj') return 'him/her';
    if (kind === 'poss') return 'his/her';
    if (kind === 'possC') return 'His/Her';
    return '';
  }

  // ============================================================
  // TEMPLATE: Medical Certificate
  // ============================================================
  const medicalCertificate = {
    title: 'Medical Certificate',
    fields: [
      F.patientName, F.age, F.sex, F.mrn, F.diagnosis,
      { name: 'treatmentDetails', label: 'Treatment / chemotherapy details', type: 'textarea', required: true,
        placeholder: 'e.g. On adjuvant chemotherapy with AC-T regimen — currently on cycle 4 of 8 (Doxorubicin 60 mg/m² + Cyclophosphamide 600 mg/m² q3w)' },
      { name: 'visitDate', label: 'Date of consultation', type: 'date', required: true, default: 'today' },
      { name: 'fitnessOpinion', label: 'Fitness opinion',
        type: 'select', required: true,
        options: [
          'Fit to resume duties from the date mentioned below',
          'Currently unfit for duty / school due to ongoing treatment',
          'Fit for sedentary / light duties only'
        ] },
      { name: 'resumeFromDate', label: 'Fit to resume from (if applicable)', type: 'date' },
      F.letterDate, F.consultant
    ],
    render(d, doc) {
      const opinion = d.fitnessOpinion || '';
      const resumeBit = d.resumeFromDate
        ? ` ${pronoun(d.sex, 'subjC')} is advised to resume routine activities from <strong>${formatDate(d.resumeFromDate)}</strong>.`
        : '';
      return `
        ${heading('Medical Certificate')}
        ${meta(d.letterDate)}
        <p class="salutation">To Whomsoever It May Concern,</p>
        ${patientBlock(d)}
        <div class="body">
          <p>This is to certify that the above-named patient was evaluated at the Department of Medical Oncology, KIMS MACS Onco Sciences, Bengaluru on <strong>${formatDate(d.visitDate)}</strong>.</p>
          <p>${pronoun(d.sex, 'subjC')} is presently under our care with a diagnosis of <strong>${esc(d.diagnosis)}</strong>, and is undergoing oncological evaluation and management as appropriate.</p>
          <p><strong>Current treatment:</strong> ${esc(d.treatmentDetails)}. The treatment is being administered under medical supervision at our oncology day-care, with periodic clinical review and laboratory monitoring as per protocol.</p>
          <p>Based on today’s clinical assessment, it is opined that <strong>${opinion.toLowerCase()}</strong>.${resumeBit}</p>
          <p>This certificate is issued on the patient’s request for record and official purposes.</p>
        </div>
        ${signoff(doc)}`;
    }
  };

  // ============================================================
  // TEMPLATE: Leave of Absence
  // ============================================================
  const leaveOfAbsence = {
    title: 'Letter for Leave of Absence',
    fields: [
      F.patientName, F.age, F.sex, F.mrn, F.diagnosis,
      { name: 'treatmentPhase', label: 'Treatment phase / regimen', type: 'textarea', required: true,
        placeholder: 'e.g. On adjuvant chemotherapy with AC-T regimen, currently on cycle 3 of 8' },
      { name: 'leaveFromDate', label: 'Leave from', type: 'date', required: true },
      { name: 'leaveToDate',   label: 'Leave until', type: 'date', required: true },
      { name: 'leaveReason',   label: 'Primary clinical reason',
        type: 'select',
        options: [
          'Active cytotoxic chemotherapy with anticipated myelosuppression and fatigue',
          'Recovery from major oncological surgery',
          'Post-radiotherapy with expected acute toxicities',
          'Cycle of immunotherapy with risk of immune-related adverse events',
          'Severe treatment-related fatigue / neutropenia / anaemia',
          'Targeted therapy with constitutional symptoms requiring rest',
          'Other (specify in additional notes)'
        ], required: true },
      { name: 'extraNotes', label: 'Additional clinical notes (optional)', type: 'textarea' },
      F.letterDate, F.consultant
    ],
    render(d, doc) {
      const fromTo = `<strong>${formatDate(d.leaveFromDate)}</strong> to <strong>${formatDate(d.leaveToDate)}</strong>`;
      const days = daysBetween(d.leaveFromDate, d.leaveToDate);
      const reason = (d.leaveReason || '').toLowerCase();

      const rationale = leaveRationale(d.leaveReason, d.sex);

      return `
        ${heading('Leave of Absence — Medical')}
        ${meta(d.letterDate)}
        <p class="salutation">To Whomsoever It May Concern,</p>
        ${patientBlock(d)}
        <div class="body">
          <p>This is to certify that the above-named patient is currently under the care of the Department of Medical Oncology at KIMS MACS Onco Sciences, Bengaluru, for management of the diagnosis stated above.</p>
          <p><strong>Current treatment status:</strong> ${esc(d.treatmentPhase)}.</p>
          <p>${rationale}</p>
          <p>In view of the ongoing oncological treatment and the anticipated treatment-related side effects, the patient requires medical leave from work / academic duties for a period of <strong>${days} day(s)</strong>, from ${fromTo} (both days inclusive). During this period, complete physical rest, adequate hydration, balanced nutrition and avoidance of crowded public spaces are strongly recommended in order to minimise the risk of intercurrent infection and to allow recovery of haematological and constitutional reserves before the next planned intervention.</p>
          ${d.extraNotes ? `<p><strong>Additional notes:</strong> ${esc(d.extraNotes)}</p>` : ''}
          <p>The patient will continue to be reviewed in our outpatient clinic at scheduled intervals. Kindly grant the requested leave on medical grounds and extend the necessary cooperation.</p>
        </div>
        ${signoff(doc)}`;
    }
  };

  function leaveRationale(reason, sex) {
    const subj = pronoun(sex, 'subj');
    const map = {
      'Active cytotoxic chemotherapy with anticipated myelosuppression and fatigue':
        `Cytotoxic chemotherapy is associated with predictable bone-marrow suppression — with the nadir of neutrophil and platelet counts typically occurring between days 7 and 14 of each cycle — placing the patient at substantial risk of febrile neutropenia, haemorrhage and opportunistic infection. In addition, ${subj} is expected to experience significant treatment-related fatigue, nausea, mucositis and reduced functional capacity that would render attendance at work or academic duties unsafe and potentially detrimental to ${pronoun(sex,'poss')} recovery.`,
      'Recovery from major oncological surgery':
        `${pronoun(sex,'subjC')} is in the early post-operative recovery phase following major oncological surgery. Adequate convalescence is essential for wound healing, restoration of physiological reserve, prevention of post-operative complications such as venous thromboembolism and surgical-site infection, and re-establishment of baseline functional status before resumption of normal activities.`,
      'Post-radiotherapy with expected acute toxicities':
        `Following completion of radiotherapy, acute toxicities such as radiation dermatitis, mucositis, oesophagitis, cystitis or fatigue are expected to peak in the immediate weeks following treatment. Continued rest and supportive care are required for these acute reactions to subside and for the patient to return to a baseline functional state.`,
      'Cycle of immunotherapy with risk of immune-related adverse events':
        `Immune checkpoint inhibitors are associated with a wide spectrum of immune-related adverse events — including pneumonitis, colitis, hepatitis, endocrinopathies and dermatitis — which can develop unpredictably during or shortly after each cycle. Close clinical observation, symptom monitoring and immediate access to medical care are warranted during this period.`,
      'Severe treatment-related fatigue / neutropenia / anaemia':
        `${pronoun(sex,'subjC')} is presently experiencing significant treatment-related cytopenias and constitutional symptoms — including fatigue, anaemia and neutropenia — which limit ${pronoun(sex,'poss')} ability to undertake routine occupational and physical activities and increase the risk of infection.`,
      'Targeted therapy with constitutional symptoms requiring rest':
        `Targeted therapy is associated with class-specific toxicities such as diarrhoea, hand–foot syndrome, hypertension, fatigue and dermatological reactions, which often require dose interruption, supportive care and a period of rest before normal duties can be resumed safely.`
    };
    return map[reason] || `${pronoun(sex,'subjC')} requires a period of medical rest in view of ongoing oncological treatment and its anticipated side-effect profile.`;
  }

  function daysBetween(a, b) {
    if (!a || !b) return '';
    const start = parseIsoDate(a);
    const end = parseIsoDate(b);
    if (!start || !end) return '';
    const ms = Date.UTC(end.year, end.month - 1, end.day) - Date.UTC(start.year, start.month - 1, start.day);
    if (isNaN(ms)) return '';
    return Math.round(ms / 86400000) + 1;
  }

  function parseIsoDate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return null;
    return {
      year: Number(match[1]),
      month: Number(match[2]),
      day: Number(match[3])
    };
  }

  // ============================================================
  // TEMPLATE: Referral Letter
  // ============================================================
  const referral = {
    title: 'Referral Letter',
    fields: [
      F.patientName, F.age, F.sex, F.mrn, F.diagnosis,
      { name: 'referredTo',     label: 'Referred to (specialist / hospital)', type: 'text', required: true },
      { name: 'reasonForReferral', label: 'Reason for referral', type: 'textarea', required: true,
        placeholder: 'e.g. Cardiology evaluation prior to anthracycline-based chemotherapy' },
      { name: 'currentTreatment', label: 'Current treatment / status', type: 'textarea', required: true },
      { name: 'specificQuestion', label: 'Specific question / opinion sought (optional)', type: 'textarea' },
      F.letterDate, F.consultant
    ],
    render(d, doc) {
      return `
        ${heading('Referral Letter')}
        ${meta(d.letterDate)}
        <p class="salutation">Respected ${esc(d.referredTo)},</p>
        ${patientBlock(d)}
        <div class="body">
          <p>I am referring the above-mentioned patient, who is presently under our care at the Department of Medical Oncology, KIMS MACS Onco Sciences, Bengaluru, for your kind opinion and further management.</p>
          <p><strong>Reason for referral:</strong> ${esc(d.reasonForReferral)}.</p>
          <p><strong>Current oncological status / treatment:</strong> ${esc(d.currentTreatment)}.</p>
          ${d.specificQuestion ? `<p><strong>Specific question:</strong> ${esc(d.specificQuestion)}</p>` : ''}
          <p>I would be grateful if you could review the patient at the earliest convenience and share your assessment, recommendations and any specific instructions regarding ongoing or planned oncological treatment. Relevant prior investigations and treatment records are being shared with the patient for your reference.</p>
          <p>Thank you for accommodating this referral. I remain available for any clinical clarification that may be required.</p>
        </div>
        ${signoff(doc)}`;
    }
  };

  // ============================================================
  // TEMPLATE: Drug Prescription (immunotherapy / PAP)
  // ============================================================
  const prescription = {
    title: 'Drug Prescription',
    fields: [
      F.patientName, F.age, F.sex,
      { name: 'umrNo', label: 'UMR No', type: 'text' },
      { name: 'diagnosisShort', label: 'Diagnosis (short)', type: 'text', required: true,
        placeholder: 'e.g. TNBC / NSCLC adenocarcinoma / HCC' },
      { name: 'drugId', label: 'Drug', type: 'drug', required: true },
      { name: 'brand', label: 'Brand', type: 'brand', required: true },
      { name: 'dose', label: 'Dose & schedule', type: 'doseSelect', required: true },
      { name: 'cyclesPlanned', label: 'Number of cycles', type: 'number', required: true,
        placeholder: 'e.g. 3' },
      { name: 'regimen', label: 'Backbone regimen / accompanying drugs (optional)', type: 'text',
        placeholder: 'e.g. Carboplatin + Paclitaxel' },
      F.letterDate, F.consultant
    ],
    render(d, doc) {
      const drug = (window.DRUGS || []).find(x => x.id === d.drugId);
      const generic = drug ? drug.generic : (d.drugId || '[Drug]');
      const brand = drug ? (d.brand || drug.brands[0]) : (d.brand || '[Brand]');
      const dose = drug ? (d.dose || drug.defaultDose) : (d.dose || '[Dose & schedule]');
      const doseMg = extractMg(dose);
      const vialBreak = doseMg && drug && drug.vialSizes ? splitIntoVials(doseMg, drug.vialSizes) : '';
      const prescriptionPrefix = drug && drug.prescriptionPrefix ? drug.prescriptionPrefix : 'Inj.';

      const title = d.sex === 'Female' ? 'Ms.' : (d.sex === 'Male' ? 'Mr.' : '');
      const sexWord = d.sex === 'Female' ? 'female' : (d.sex === 'Male' ? 'male' : 'patient');
      const fullName = (title ? title + ' ' : '') + (d.patientName || '');
      const isPembro = drug && drug.id === 'pembrolizumab';
      const cyclesLabel = (isPembro && d.cyclesPlanned)
        ? `This prescription valid for ${esc(d.cyclesPlanned)} cycle${Number(d.cyclesPlanned) === 1 ? '' : 's'}`
        : '';

      const regimenText = d.regimen
        ? `${esc(d.regimen)} + ${esc(generic)}`
        : `${esc(generic)}`;

      const fmtDate = formatDate(d.letterDate);

      return `
        <div class="rx-date-line"><strong>Date:</strong> ${fmtDate}</div>
        ${cyclesLabel ? `<h1 class="rx-title">${cyclesLabel}</h1>` : ''}

        <div class="rx-patient">
          <div class="rx-row"><span>Patient Name:</span><span>${esc(fullName)}</span></div>
          <div class="rx-row"><span>Age / Sex:</span><span>${esc(d.age)} Years / ${esc(d.sex)}</span></div>
          ${d.umrNo ? `<div class="rx-row"><span>UMR No:</span><span>${esc(d.umrNo)}</span></div>` : ''}
        </div>

        <hr class="rx-divider" />

        <p class="rx-summary">
          <strong>${esc(fullName)}</strong> is a ${esc(d.age)} year old ${sexWord} diagnosed with
          <strong>${esc(d.diagnosisShort)}</strong>, planned for treatment with
          <strong>${regimenText}</strong>. Prescription is for the stated number of cycles,
          subject to clinical review, routine pre-treatment assessment, and institutional
          administration protocols.
        </p>

        <div class="rx-big">Rx</div>

        <div class="rx-drug-line">${esc(prescriptionPrefix)} ${esc(generic.toUpperCase())} ( ${esc(brand)} ) ${doseMg && vialBreak ? doseMg + ' mg' : esc(dose)}</div>
        ${vialBreak ? `<div class="rx-vial-line">( ${vialBreak} )</div>` : ''}

        <div class="rx-spacer"></div>

        <div class="rx-signoff">
          <div class="rx-sig-line"></div>
          <div class="doctor-name">${doc.name}</div>
          <div class="doctor-meta">
            ${doc.qualifications}<br/>
            ${doc.designation}<br/>
            ${doc.institute}<br/>
            KMC No: ${doc.kmc}
          </div>
        </div>`;
    }
  };

  // Extract numeric mg from a dose string like "200 mg IV every 3 weeks" → 200
  function extractMg(s) {
    if (!s) return 0;
    const m = String(s).match(/(\d+(?:\.\d+)?)\s*mg/i);
    return m ? parseFloat(m[1]) : 0;
  }

  // Greedy split of a total dose into available vial sizes (largest first)
  function splitIntoVials(totalMg, vialSizes) {
    if (!totalMg || !vialSizes || !vialSizes.length) return '';
    const sizes = [...vialSizes].sort((a, b) => b - a);
    let remain = totalMg;
    const parts = [];
    for (const s of sizes) {
      while (remain >= s) { parts.push(s); remain -= s; }
    }
    if (remain > 0) parts.push(remain);
    return parts.join(' + ') + ' mg';
  }

  // ============================================================
  // TEMPLATE: Pre-Auth — Justification of medical necessity
  // ============================================================
  const preauthApproval = {
    title: 'Pre-Authorisation — Justification Letter',
    fields: [
      F.patientName, F.age, F.sex, F.mrn, F.diagnosis,
      { name: 'insurer', label: 'Insurer / TPA name', type: 'text', required: true },
      { name: 'policyNo', label: 'Policy / Claim number', type: 'text' },
      { name: 'stage', label: 'Stage / molecular profile', type: 'textarea',
        placeholder: 'e.g. Stage IV NSCLC, EGFR wild-type, ALK negative, PD-L1 TPS 60%' },
      { name: 'plannedTreatment', label: 'Planned treatment', type: 'textarea', required: true,
        placeholder: 'e.g. Pembrolizumab 200 mg IV q3w as 1st-line monotherapy' },
      { name: 'evidence', label: 'Supporting evidence / guideline', type: 'textarea',
        placeholder: 'e.g. NCCN Category 1; KEYNOTE-024 — improved OS vs chemotherapy' },
      { name: 'duration', label: 'Anticipated duration / cycles', type: 'text',
        placeholder: 'e.g. Up to 35 cycles or until progression' },
      F.letterDate, F.consultant
    ],
    render(d, doc) {
      return `
        ${heading('Pre-Authorisation Request — Medical Necessity')}
        ${meta(d.letterDate)}
        <p class="salutation">To,<br/>The Medical Officer,<br/>${esc(d.insurer)}${d.policyNo ? `<br/>Policy / Claim No: ${esc(d.policyNo)}` : ''}</p>
        ${patientBlock(d)}
        <div class="body">
          <p>This letter is being written to support the pre-authorisation request for the above-named patient, who is currently under the care of the Department of Medical Oncology at KIMS MACS Onco Sciences, Bengaluru.</p>
          ${d.stage ? `<p><strong>Disease characterisation:</strong> ${esc(d.stage)}.</p>` : ''}
          <p><strong>Planned treatment:</strong> ${esc(d.plannedTreatment)}.</p>
          <p><strong>Clinical justification:</strong> The proposed regimen represents the current standard of care for the patient’s disease setting, supported by international and national clinical practice guidelines as well as level-1 randomised evidence demonstrating meaningful improvements in disease-control and survival outcomes when compared with alternative treatment strategies. Selection of this regimen has been individualised after considering the patient’s histopathology, molecular profile, prior therapy, performance status, comorbidities and informed preference.</p>
          ${d.evidence ? `<p><strong>Supporting evidence:</strong> ${esc(d.evidence)}.</p>` : ''}
          ${d.duration ? `<p><strong>Anticipated treatment duration:</strong> ${esc(d.duration)}.</p>` : ''}
          <p>Withholding or delaying this treatment is likely to result in disease progression, deterioration of performance status and avoidable morbidity, and would deprive the patient of the most appropriate evidence-based intervention available for ${pronoun(d.sex,'poss')} clinical condition.</p>
          <p>I therefore request your kind office to approve cashless authorisation for the proposed treatment in keeping with the policy provisions. I remain available for any further clinical clarification or documentation that may be required.</p>
        </div>
        ${signoff(doc)}`;
    }
  };

  // ============================================================
  // TEMPLATE: Pre-Auth — Denial Rebuttal
  // ============================================================
  const preauthRebuttal = {
    title: 'Pre-Authorisation — Denial Rebuttal',
    fields: [
      F.patientName, F.age, F.sex, F.mrn, F.diagnosis,
      { name: 'insurer', label: 'Insurer / TPA name', type: 'text', required: true },
      { name: 'policyNo', label: 'Policy / Claim number', type: 'text' },
      { name: 'denialReason', label: 'Stated reason for denial', type: 'textarea', required: true,
        placeholder: 'e.g. "Treatment considered experimental / not as per policy"' },
      { name: 'plannedTreatment', label: 'Planned treatment under appeal', type: 'textarea', required: true },
      { name: 'rebuttalPoints', label: 'Approval rationale (rebuttal points)', type: 'textarea', required: true,
        placeholder: 'e.g. NCCN Category 1; FDA / CDSCO approved; KEYNOTE-024 OS HR 0.63' },
      F.letterDate, F.consultant
    ],
    render(d, doc) {
      return `
        ${heading('Appeal against Pre-Authorisation Denial')}
        ${meta(d.letterDate)}
        <p class="salutation">To,<br/>The Medical Officer,<br/>${esc(d.insurer)}${d.policyNo ? `<br/>Policy / Claim No: ${esc(d.policyNo)}` : ''}</p>
        ${patientBlock(d)}
        <div class="body">
          <p>I am writing in response to the pre-authorisation denial issued in respect of the above-named patient. After careful review of the communication received, I respectfully request reconsideration of the decision on the following clinical grounds.</p>
          <p><strong>Stated reason for denial:</strong> ${esc(d.denialReason)}.</p>
          <p><strong>Treatment under appeal:</strong> ${esc(d.plannedTreatment)}.</p>
          <p><strong>Clinical rationale supporting approval:</strong></p>
          <p>${esc(d.rebuttalPoints).replace(/\n+/g, '</p><p>')}</p>
          <p>The proposed therapy is neither experimental nor investigational. It is a regulator-approved (CDSCO / FDA / EMA) intervention, recognised by major national and international oncology guidelines (NCCN, ESMO, ICMR) as the standard of care for the patient’s disease setting, and is widely used in routine clinical practice across India. Denial of cover on the grounds cited would, in our considered medical opinion, deprive the patient of an essential and evidence-based treatment, with a real risk of disease progression and avoidable harm.</p>
          <p>I therefore respectfully request your office to revisit the decision and approve cashless authorisation in accordance with the policy provisions. I am happy to provide further documentation, peer-reviewed references, or to participate in a clinical discussion with your reviewing physician should that assist the process.</p>
        </div>
        ${signoff(doc)}`;
    }
  };

  // ============================================================
  // TEMPLATE: Fitness for Travel
  // ============================================================
  const fitnessTravel = {
    title: 'Fitness for Travel',
    fields: [
      F.patientName, F.age, F.sex, F.mrn, F.diagnosis,
      { name: 'travelMode', label: 'Mode of travel', type: 'select',
        options: ['Air travel (commercial)', 'Train', 'Road / private vehicle'], required: true },
      { name: 'travelFrom', label: 'Travel from', type: 'text' },
      { name: 'travelTo', label: 'Travel to', type: 'text' },
      { name: 'travelDate', label: 'Date of travel', type: 'date' },
      { name: 'specialNeeds', label: 'Special requirements', type: 'textarea',
        placeholder: 'e.g. Needs in-flight oxygen / wheelchair assistance / accompanying attendant' },
      F.letterDate, F.consultant
    ],
    render(d, doc) {
      return `
        ${heading('Fitness for Travel')}
        ${meta(d.letterDate)}
        <p class="salutation">To Whomsoever It May Concern,</p>
        ${patientBlock(d)}
        <div class="body">
          <p>This is to certify that the above-named patient, currently under the care of the Department of Medical Oncology at KIMS MACS Onco Sciences, Bengaluru, has been clinically assessed and is medically fit to undertake <strong>${esc(d.travelMode)}</strong>${d.travelFrom && d.travelTo ? ` from <strong>${esc(d.travelFrom)}</strong> to <strong>${esc(d.travelTo)}</strong>` : ''}${d.travelDate ? ` on <strong>${formatDate(d.travelDate)}</strong>` : ''}.</p>
          <p>At the time of assessment ${pronoun(d.sex, 'subj')} was haemodynamically stable, with adequate cardiopulmonary reserve and no active uncontrolled symptoms or infection that would contraindicate travel. ${pronoun(d.sex, 'possC')} general condition and performance status are considered adequate for the journey planned.</p>
          ${d.specialNeeds ? `<p><strong>Special requirements during travel:</strong> ${esc(d.specialNeeds)}. The relevant carrier is requested to extend appropriate assistance.</p>` : ''}
          <p>It is advisable that the patient carries ${pronoun(d.sex, 'poss')} medical records, current prescriptions and a contact number of the treating team, and avoids strenuous physical exertion, dehydration and exposure to crowded environments during transit. In the unlikely event of a medical concern during travel, ${pronoun(d.sex, 'subj')} is advised to seek the nearest medical facility without delay.</p>
          <p>This certificate is issued upon the patient’s request.</p>
        </div>
        ${signoff(doc)}`;
    }
  };

  // ============================================================
  // TEMPLATE: Treatment Completion / Survivorship summary
  // ============================================================
  const treatmentCompletion = {
    title: 'Treatment Completion Summary',
    fields: [
      F.patientName, F.age, F.sex, F.mrn, F.diagnosis,
      { name: 'treatmentReceived', label: 'Treatment received', type: 'textarea', required: true,
        placeholder: 'e.g. Modified radical mastectomy → 4 cycles AC → 12 cycles weekly Paclitaxel → adjuvant radiation 50Gy/25# → Tamoxifen ongoing' },
      { name: 'completionDate', label: 'Date of completion of active therapy', type: 'date' },
      { name: 'currentStatus', label: 'Current disease status', type: 'select',
        options: ['No evidence of disease (NED)', 'Stable disease on maintenance', 'Partial response — on follow-up', 'Other (specify in notes)'] },
      { name: 'followUpPlan', label: 'Follow-up plan', type: 'textarea',
        placeholder: 'e.g. Clinical review every 3 months for 2 years, then 6 monthly. Annual mammogram. CT chest/abdomen at year 1.' },
      F.letterDate, F.consultant
    ],
    render(d, doc) {
      return `
        ${heading('Treatment Completion Summary')}
        ${meta(d.letterDate)}
        <p class="salutation">To Whomsoever It May Concern,</p>
        ${patientBlock(d)}
        <div class="body">
          <p>This is to formally document that the above-named patient has completed the planned course of oncological treatment under our care at KIMS MACS Onco Sciences, Bengaluru.</p>
          <p><strong>Treatment received:</strong> ${esc(d.treatmentReceived)}.</p>
          ${d.completionDate ? `<p><strong>Date of completion of active therapy:</strong> ${formatDate(d.completionDate)}.</p>` : ''}
          ${d.currentStatus ? `<p><strong>Current disease status:</strong> ${esc(d.currentStatus)}.</p>` : ''}
          <p>${pronoun(d.sex, 'subjC')} has tolerated the treatment satisfactorily and is presently in a state of clinical stability. ${pronoun(d.sex, 'possC')} performance status is adequate to resume routine social, occupational and personal activities, while observing reasonable precautions appropriate to a cancer survivor.</p>
          ${d.followUpPlan ? `<p><strong>Recommended follow-up:</strong> ${esc(d.followUpPlan)}</p>` : ''}
          <p>The patient is advised to maintain a healthy lifestyle, balanced nutrition, age-appropriate physical activity, abstinence from tobacco and alcohol, and to report promptly should any new or unusual symptoms arise. Survivorship counselling regarding late effects, psychosocial wellbeing and screening for second primaries has also been provided.</p>
          <p>This summary is issued for the patient’s personal records and for any official or onward medical use.</p>
        </div>
        ${signoff(doc)}`;
    }
  };

  // ============================================================
  // TEMPLATE: To Whomsoever It May Concern (general)
  // ============================================================
  const twimc = {
    title: 'To Whomsoever It May Concern',
    fields: [
      F.patientName, F.age, F.sex, F.mrn, F.diagnosis,
      { name: 'purpose', label: 'Purpose of letter', type: 'text', required: true,
        placeholder: 'e.g. Submission to employer for medical reimbursement' },
      { name: 'bodyContent', label: 'Main content / context', type: 'textarea', required: true,
        placeholder: 'Free-text content describing what the letter should state' },
      F.letterDate, F.consultant
    ],
    render(d, doc) {
      const paragraphs = (d.bodyContent || '').split(/\n+/).filter(Boolean)
        .map(p => `<p>${esc(p)}</p>`).join('');
      return `
        ${heading('To Whomsoever It May Concern')}
        ${meta(d.letterDate)}
        <p class="salutation">To Whomsoever It May Concern,</p>
        ${patientBlock(d)}
        <div class="body">
          <p>This letter is being issued in connection with: <strong>${esc(d.purpose)}</strong>.</p>
          ${paragraphs}
          <p>This letter is issued at the patient’s request and may be used for the purpose mentioned above. I remain available for any clinical clarification that may be required.</p>
        </div>
        ${signoff(doc)}`;
    }
  };

  // ============================================================
  // TEMPLATE: Second Opinion Summary
  // ============================================================
  const secondOpinion = {
    title: 'Second Opinion Summary',
    fields: [
      F.patientName, F.age, F.sex, F.mrn, F.diagnosis,
      { name: 'referringDoctor', label: 'Primary treating doctor / hospital', type: 'text' },
      { name: 'recordsReviewed', label: 'Records / investigations reviewed', type: 'textarea',
        placeholder: 'e.g. Histopathology report dated…, PET-CT dated…, IHC for ER/PR/HER2 dated…' },
      { name: 'currentPlan', label: 'Existing treatment plan', type: 'textarea' },
      { name: 'opinion', label: 'Second opinion / recommendation', type: 'textarea', required: true,
        placeholder: 'Concur / suggest modification — with brief rationale' },
      F.letterDate, F.consultant
    ],
    render(d, doc) {
      return `
        ${heading('Second Opinion Summary')}
        ${meta(d.letterDate)}
        <p class="salutation">To Whomsoever It May Concern,</p>
        ${patientBlock(d)}
        <div class="body">
          <p>The above-named patient was reviewed at the Department of Medical Oncology, KIMS MACS Onco Sciences, Bengaluru, for a documented second opinion regarding the diagnosis and proposed management.</p>
          ${d.referringDoctor ? `<p><strong>Primary treating team:</strong> ${esc(d.referringDoctor)}.</p>` : ''}
          ${d.recordsReviewed ? `<p><strong>Records reviewed:</strong> ${esc(d.recordsReviewed)}.</p>` : ''}
          ${d.currentPlan ? `<p><strong>Existing treatment plan:</strong> ${esc(d.currentPlan)}.</p>` : ''}
          <p><strong>Opinion:</strong></p>
          <p>${esc(d.opinion).replace(/\n+/g, '</p><p>')}</p>
          <p>This opinion has been provided after a careful review of the available clinical, pathological and radiological information, and after a detailed discussion with the patient and family regarding goals of care, expected benefits, potential toxicities and alternative treatment strategies. The final treatment decision rests with the patient and the primary treating team.</p>
          <p>I am happy to be contacted for any further clinical discussion that may be helpful.</p>
        </div>
        ${signoff(doc)}`;
    }
  };

  // ============================================================
  // TEMPLATE: Continuing Care / Treatment Transfer
  // (For international / out-of-town patients returning to home centre)
  // ============================================================
  const continuingCare = {
    title: 'Continuing Care / Treatment Transfer Letter',
    fields: [
      F.patientName, F.age, F.sex, F.mrn,
      { name: 'nationality', label: 'Country / city of residence', type: 'text',
        placeholder: 'e.g. Lagos, Nigeria / Dhaka, Bangladesh / Hubli, India' },
      F.diagnosis,
      { name: 'stageMolecular', label: 'Stage & molecular profile', type: 'textarea',
        placeholder: 'e.g. Stage III, ER 90% / PR 80% / HER2 negative, Ki-67 35%, BRCA wild-type' },
      { name: 'treatmentReceived', label: 'Treatment received at our centre', type: 'textarea', required: true,
        placeholder: 'e.g. Completed 2 cycles of AC (Doxorubicin 60 mg/m² + Cyclophosphamide 600 mg/m²) on 04.04.2026 and 25.04.2026 — tolerated well, neutropenia grade 1, no febrile episodes.' },
      { name: 'planAhead', label: 'Treatment plan going forward', type: 'textarea', required: true,
        placeholder: 'e.g. To complete 2 more cycles of AC followed by 12 cycles of weekly Paclitaxel, then surgery, followed by adjuvant radiation and endocrine therapy with Tamoxifen.' },

      { name: 'cycleFrequency', label: 'Frequency of cycles', type: 'select', required: true,
        options: ['Weekly', 'Every 2 weeks (q2w)', 'Every 3 weeks (q3w)', 'Every 4 weeks (q4w)', 'Other (specify in regimen)'] },
      { name: 'infusionDrugs', label: 'Drug infusion sequence (per cycle)', type: 'drugList', required: true },

      // ----- Pre-medication preferences -----
      { type: 'groupHeader', label: 'Pre-medication Preferences (30 min before chemotherapy)' },
      { name: 'premedNK1', label: 'NK1 Antagonist', type: 'select',
        options: [
          { value: 'fosaprepitant', label: 'Inj. Fosaprepitant 150mg IV' },
          { value: 'aprepitant',    label: 'Cap. Aprepitant 125mg Oral (Day 1)' },
          { value: 'nepa',          label: 'Cap. NEPA (Netupitant + Palonosetron) 300/0.5mg Oral' }
        ] },
      { name: 'premedDex', label: 'Dexamethasone (IV)', type: 'select',
        options: [
          { value: '8',  label: 'Inj. Dexamethasone 8mg IV' },
          { value: '10', label: 'Inj. Dexamethasone 10mg IV' },
          { value: '12', label: 'Inj. Dexamethasone 12mg IV' },
          { value: '16', label: 'Inj. Dexamethasone 16mg IV' },
          { value: '20', label: 'Inj. Dexamethasone 20mg IV' }
        ] },
      { name: 'premed5HT3', label: '5-HT3 Antagonist', type: 'select',
        options: [
          { value: 'ondansetron',  label: 'Inj. Ondansetron 8mg IV' },
          { value: 'granisetron',  label: 'Inj. Granisetron 1mg IV' },
          { value: 'palonosetron', label: 'Inj. Palonosetron 0.25mg IV' }
        ] },
      { name: 'premedAntacid', label: 'Antacid / Gastroprotective (IV)', type: 'select',
        options: [
          { value: 'pantoprazole',  label: 'Inj. Pantoprazole 40mg IV' },
          { value: 'omeprazole',    label: 'Inj. Omeprazole 40mg IV' },
          { value: 'esomeprazole',  label: 'Inj. Esomeprazole 40mg IV' },
          { value: 'famotidine',    label: 'Inj. Famotidine 20mg IV' },
          { value: 'ranitidine',    label: 'Inj. Ranitidine 50mg IV' }
        ] },
      { name: 'premedAntiHist', label: 'H1 Antihistamine (HSR prophylaxis)', type: 'select',
        options: [
          { value: 'pheniramine',     label: 'Inj. Pheniramine Maleate 25mg IV' },
          { value: 'diphenhydramine', label: 'Inj. Diphenhydramine 50mg IV' }
        ] },

      // ----- Post-discharge medication preferences -----
      { type: 'groupHeader', label: 'Post-discharge Medication Preferences' },
      { name: 'postOralAntacid', label: 'Oral Antacid', type: 'selectWithDays',
        options: [
          { value: 'pantoprazole', label: 'Tab. Pantoprazole 40mg OD' },
          { value: 'omeprazole',   label: 'Tab. Omeprazole 20mg OD' },
          { value: 'esomeprazole', label: 'Tab. Esomeprazole 20mg OD' },
          { value: 'rabeprazole',  label: 'Tab. Rabeprazole 20mg OD' },
          { value: 'famotidine',   label: 'Tab. Famotidine 40mg OD' },
          { value: 'ranitidine',   label: 'Tab. Ranitidine 150mg BD' }
        ] },
      { name: 'postOndansetron', label: 'Antiemetic — Ondansetron', type: 'selectWithDays',
        options: [
          { value: '4mg BD', label: 'Tab. Ondansetron 4mg BD' },
          { value: '8mg BD', label: 'Tab. Ondansetron 8mg BD' }
        ] },
      { name: 'postDex', label: 'Antiemetic — Dexamethasone', type: 'selectWithDays',
        options: [
          { value: '2mg BD', label: 'Tab. Dexamethasone 2mg BD' },
          { value: '4mg BD', label: 'Tab. Dexamethasone 4mg BD' },
          { value: '8mg BD', label: 'Tab. Dexamethasone 8mg BD' }
        ] },
      { name: 'postOlanzapine', label: 'Antiemetic — Olanzapine', type: 'selectWithDays',
        options: [
          { value: '2.5mg HS', label: 'Tab. Olanzapine 2.5mg HS' },
          { value: '5mg HS',   label: 'Tab. Olanzapine 5mg HS' },
          { value: '10mg HS',  label: 'Tab. Olanzapine 10mg HS' }
        ] },
      { name: 'postGrowthFactor', label: 'Growth Factor', type: 'select',
        options: [
          { value: 'pegfilgrastim', label: 'Inj. Pegfilgrastim 6mg SC — 24h after chemotherapy completion' },
          { value: 'filgrastim5',   label: 'Inj. Filgrastim 5mcg/kg SC — Day 3 to Day 7 (5 days)' },
          { value: 'filgrastim7',   label: 'Inj. Filgrastim 5mcg/kg SC — Day 3 to Day 9 (7 days)' },
          { value: 'filgrastimANC', label: 'Inj. Filgrastim 5mcg/kg SC — until ANC recovery' }
        ] },

      { name: 'preCycleInvx', label: 'Pre-cycle investigations', type: 'textarea',
        placeholder: 'e.g.\n• CBC with differential\n• LFT, RFT, Serum electrolytes\n• ECHO every 3 cycles for anthracycline regimens\n• Urine routine if cyclophosphamide is used' },
      { name: 'reassessment', label: 'Response assessment imaging', type: 'textarea',
        placeholder: 'e.g. CECT chest, abdomen and pelvis after every 3 cycles. PET-CT at completion of planned chemotherapy. Tumour markers (CA 15-3) every 3 cycles.' },

      { name: 'completionPlan', label: 'Plan after treatment completion', type: 'textarea',
        placeholder: 'e.g. Surgery (modified radical mastectomy) within 4–6 weeks of last chemo cycle. Adjuvant radiation 50 Gy / 25 fractions to chest wall. Endocrine therapy with Tamoxifen 20 mg OD for 5–10 years.' },
      { name: 'surveillance', label: 'Surveillance schedule (if treatment completed)', type: 'textarea',
        placeholder: 'e.g.\n• Clinical review every 3 months for 2 years, then 6 monthly up to 5 years, annually thereafter\n• Annual mammography of opposite breast and chest-wall ultrasound\n• Annual gynaecology review on Tamoxifen\n• Bone health and DEXA scan every 2 years' },

      { name: 'redFlags', label: 'Red-flag symptoms (when to seek urgent care)', type: 'textarea',
        default: 'Fever ≥ 38°C, persistent vomiting or diarrhoea, breathlessness, chest pain, severe mucositis with inability to eat or drink, bleeding, severe abdominal pain, or any new neurological symptom — to attend the nearest emergency department immediately.' },
      { name: 'extraNotes', label: 'Additional notes (optional)', type: 'textarea' },
      F.letterDate, F.consultant
    ],
    render(d, doc) {
      const lines = (s) => esc(s || '').split(/\n+/).filter(Boolean)
        .map(p => `<p style="margin:0 0 4px;">${p}</p>`).join('');

      const sectionsBlock = (title, body) =>
        body ? `<h3 class="cc-section">${title}</h3><div class="cc-body">${body}</div>` : '';

      const redFlagText = d.redFlags || 'Fever ≥ 38°C, persistent vomiting or diarrhoea, breathlessness, chest pain, severe mucositis, bleeding, severe abdominal pain, or any new neurological symptom — to attend the nearest emergency department immediately.';

      // ---- Pre-medication table ----
      const preRows = buildPreMedRows(d);
      const preTable = preRows.length ? `
        <table class="cc-table">
          <thead><tr><th style="width:32px;">#</th><th>Drug</th><th>Dose</th><th>Route</th><th>Timing</th></tr></thead>
          <tbody>${preRows.map((r, i) => `<tr><td>${i + 1}</td><td><strong>${r.drug}</strong></td><td>${r.dose}</td><td>${r.route}</td><td>${r.timing}</td></tr>`).join('')}</tbody>
        </table>` : '<p>As clinically appropriate.</p>';

      // ---- Drug infusion sequence table ----
      const infRows = Array.isArray(d.infusionDrugs) ? d.infusionDrugs : [];
      const fmtVolume = (v) => {
        if (!v) return '—';
        const t = String(v).trim();
        if (/^\d+(\.\d+)?$/.test(t)) return t + ' mL';
        return esc(t);
      };
      const infTable = infRows.length ? `
        <table class="cc-table">
          <thead><tr><th style="width:32px;">#</th><th>Drug</th><th>Dose</th><th>Solvent</th><th>Volume</th><th>Duration</th></tr></thead>
          <tbody>${infRows.map((r, i) => `<tr>
            <td>${i + 1}</td>
            <td><strong>${esc(r.drug)}</strong>${r.note ? `<br/><span style="font-size:9.5pt; color:#4a5876; font-style:italic;">${esc(r.note)}</span>` : ''}</td>
            <td>${esc(r.dose) || '—'}</td>
            <td>${esc(r.solvent) || '—'}</td>
            <td>${fmtVolume(r.volume)}</td>
            <td>${esc(r.duration) || '—'}</td>
          </tr>`).join('')}</tbody>
        </table>` : '<p>To be determined per cycle.</p>';

      // ---- Post-discharge medication table ----
      const postRows = buildPostMedRows(d);
      const postTable = postRows.length ? `
        <table class="cc-table">
          <thead><tr><th style="width:32px;">#</th><th>Drug</th><th>Dose</th><th>Route</th><th>Frequency</th><th>Duration</th></tr></thead>
          <tbody>${postRows.map((r, i) => `<tr><td>${i + 1}</td><td><strong>${r.drug}</strong></td><td>${r.dose}</td><td>${r.route}</td><td>${r.frequency}</td><td>${r.duration}</td></tr>`).join('')}</tbody>
        </table>` : '<p>As clinically appropriate.</p>';

      // ---- Growth factor ----
      const gfMap = {
        pegfilgrastim: 'Inj. Pegfilgrastim 6 mg subcutaneously, 24 hours after completion of chemotherapy (single dose per cycle).',
        filgrastim5:   'Inj. Filgrastim 5 mcg/kg subcutaneously, from Day 3 to Day 7 of each cycle (5 days).',
        filgrastim7:   'Inj. Filgrastim 5 mcg/kg subcutaneously, from Day 3 to Day 9 of each cycle (7 days).',
        filgrastimANC: 'Inj. Filgrastim 5 mcg/kg subcutaneously, daily until ANC recovery (≥ 1000/µL post-nadir).'
      };
      const gfLine = d.postGrowthFactor ? gfMap[d.postGrowthFactor] : '';

      return `
        ${heading('Continuing Care / Treatment Transfer Letter')}
        ${meta(d.letterDate)}
        <p class="salutation">To Whomsoever It May Concern,</p>
        ${patientBlock(d)}
        ${d.nationality ? `<p style="font-family:var(--font-sans); font-size:11pt; margin-top:-8px;"><strong>Country / city of residence:</strong> ${esc(d.nationality)}</p>` : ''}
        <div class="body">
          <p>The above-named patient has been under our care at the Department of Medical Oncology, KIMS MACS Onco Sciences, Bengaluru. As ${pronoun(d.sex,'subj')} now wishes to continue further oncological treatment closer to ${pronoun(d.sex,'poss')} home, this letter is being issued to provide a structured handover of the diagnosis, treatment received so far and the recommended ongoing plan, so that the receiving treating physician may continue care seamlessly.</p>

          ${d.stageMolecular ? sectionsBlock('Disease characterisation', `<p>${esc(d.stageMolecular)}</p>`) : ''}

          ${sectionsBlock('Treatment received at our centre',
            `<p>${esc(d.treatmentReceived)}</p>`)}

          ${sectionsBlock('Recommended treatment plan going forward',
            `<p>${esc(d.planAhead)}</p>
             <p><strong>Frequency of cycles:</strong> ${esc(d.cycleFrequency)}.</p>`)}

          ${sectionsBlock('Pre-medications (administer 30 min before chemotherapy)', preTable)}

          ${sectionsBlock('Drug infusion sequence', infTable)}

          ${sectionsBlock('Post-discharge medications (oral, take-home)', postTable)}

          ${gfLine ? sectionsBlock('Growth factor support', `<p>${esc(gfLine)}</p>`) : ''}

          ${sectionsBlock('Pre-cycle investigations',
            d.preCycleInvx ? lines(d.preCycleInvx) :
              `<p>Complete blood count with differential, LFT, RFT and serum electrolytes prior to every cycle. Cycle to proceed only if ANC ≥ 1.5 × 10⁹/L and platelet count ≥ 100 × 10⁹/L. ECHO every 3 cycles where anthracycline-based regimens are used.</p>`)}

          ${sectionsBlock('Response assessment imaging',
            d.reassessment ? `<p>${esc(d.reassessment)}</p>` :
              `<p>Cross-sectional imaging (CECT or PET-CT as appropriate) at the mid-point and at completion of the planned chemotherapy course, with comparison to baseline scans.</p>`)}

          ${d.completionPlan ? sectionsBlock('Plan after completion of chemotherapy',
            `<p>${esc(d.completionPlan)}</p>`) : ''}

          ${d.surveillance ? sectionsBlock('Surveillance after treatment completion', lines(d.surveillance)) : ''}

          ${sectionsBlock('When to seek urgent medical attention',
            `<p>${esc(redFlagText)}</p>`)}

          <h3 class="cc-section">Continuing communication</h3>
          <div class="cc-body">
            <p>Our team remains available for any clinical clarification at any stage of ${pronoun(d.sex,'poss')} ongoing treatment. The patient and the receiving physician are most welcome to fix up a <strong>video consultation</strong> with us as and when needed — to review scans, discuss treatment modifications, or address any complication. The patient has been advised to keep us informed at major milestones of treatment and to share interim reports for our records.</p>
          </div>

          ${d.extraNotes ? sectionsBlock('Additional notes', `<p>${esc(d.extraNotes)}</p>`) : ''}

          <p>I would be grateful if the receiving oncology team could continue care for the patient as outlined above, with such individualised modifications as they deem clinically appropriate. We thank you in advance for your kind cooperation and for the continuity of care extended to our patient.</p>
        </div>
        ${signoff(doc)}`;
    }
  };

  // ----- Pre-medication row builder for Continuing Care letter -----
  function buildPreMedRows(d) {
    const rows = [];
    // 1. NK1 antagonist
    if (d.premedNK1 === 'fosaprepitant') rows.push({ drug: 'Inj. Fosaprepitant', dose: '150 mg', route: 'IV',   timing: '30 min before chemo' });
    if (d.premedNK1 === 'aprepitant')    rows.push({ drug: 'Cap. Aprepitant',    dose: '125 mg', route: 'Oral', timing: '60 min before chemo (Day 1)' });
    if (d.premedNK1 === 'nepa')          rows.push({ drug: 'Cap. NEPA (Netupitant + Palonosetron)', dose: '300/0.5 mg', route: 'Oral', timing: '60 min before chemo' });
    // 2. Dexamethasone IV
    if (d.premedDex) rows.push({ drug: 'Inj. Dexamethasone', dose: d.premedDex + ' mg', route: 'IV', timing: '30 min before chemo' });
    // 3. 5-HT3 antagonist (suppressed if NEPA chosen — palonosetron already included)
    if (d.premed5HT3 && d.premedNK1 !== 'nepa') {
      const map5 = {
        ondansetron:  { drug: 'Inj. Ondansetron',   dose: '8 mg' },
        granisetron:  { drug: 'Inj. Granisetron',   dose: '1 mg' },
        palonosetron: { drug: 'Inj. Palonosetron',  dose: '0.25 mg' }
      };
      const r = map5[d.premed5HT3];
      if (r) rows.push({ drug: r.drug, dose: r.dose, route: 'IV', timing: '30 min before chemo' });
    }
    // 4. Antacid IV
    if (d.premedAntacid) {
      const aMap = {
        pantoprazole: { drug: 'Inj. Pantoprazole', dose: '40 mg' },
        omeprazole:   { drug: 'Inj. Omeprazole',   dose: '40 mg' },
        esomeprazole: { drug: 'Inj. Esomeprazole', dose: '40 mg' },
        famotidine:   { drug: 'Inj. Famotidine',   dose: '20 mg' },
        ranitidine:   { drug: 'Inj. Ranitidine',   dose: '50 mg' }
      };
      const r = aMap[d.premedAntacid];
      if (r) rows.push({ drug: r.drug, dose: r.dose, route: 'IV', timing: '30 min before chemo' });
    }
    // 5. H1 antihistamine
    if (d.premedAntiHist) {
      const hMap = {
        pheniramine:     { drug: 'Inj. Pheniramine Maleate', dose: '25 mg' },
        diphenhydramine: { drug: 'Inj. Diphenhydramine',     dose: '50 mg' }
      };
      const r = hMap[d.premedAntiHist];
      if (r) rows.push({ drug: r.drug, dose: r.dose, route: 'IV', timing: '30 min before chemo' });
    }
    return rows;
  }

  // ----- Post-discharge medication row builder for Continuing Care letter -----
  function buildPostMedRows(d) {
    const rows = [];
    // Aprepitant Days 2 & 3 auto-added when NK1 = Cap. Aprepitant
    if (d.premedNK1 === 'aprepitant') {
      rows.push({ drug: 'Tab. Aprepitant', dose: '80 mg', route: 'Oral', frequency: 'OD', duration: 'Days 2 & 3' });
    }
    const days = (n, dflt) => (n && String(n).trim()) ? `× ${esc(n)} day${Number(n) === 1 ? '' : 's'}` : dflt;

    if (d.postOralAntacid) {
      const m = {
        pantoprazole: { drug: 'Tab. Pantoprazole', dose: '40 mg', frequency: 'OD' },
        omeprazole:   { drug: 'Tab. Omeprazole',   dose: '20 mg', frequency: 'OD' },
        esomeprazole: { drug: 'Tab. Esomeprazole', dose: '20 mg', frequency: 'OD' },
        rabeprazole:  { drug: 'Tab. Rabeprazole',  dose: '20 mg', frequency: 'OD' },
        famotidine:   { drug: 'Tab. Famotidine',   dose: '40 mg', frequency: 'OD' },
        ranitidine:   { drug: 'Tab. Ranitidine',   dose: '150 mg', frequency: 'BD' }
      };
      const r = m[d.postOralAntacid];
      if (r) rows.push({ drug: r.drug, dose: r.dose, route: 'Oral', frequency: r.frequency, duration: days(d.postOralAntacid_days, 'Days 2–5') });
    }
    if (d.postOndansetron) {
      const dose = d.postOndansetron.split(' ')[0];
      rows.push({ drug: 'Tab. Ondansetron', dose: dose, route: 'Oral', frequency: 'BD', duration: days(d.postOndansetron_days, 'Days 2–4') });
    }
    if (d.postDex) {
      const dose = d.postDex.split(' ')[0];
      rows.push({ drug: 'Tab. Dexamethasone', dose: dose, route: 'Oral', frequency: 'BD', duration: days(d.postDex_days, 'Days 2–4') });
    }
    if (d.postOlanzapine) {
      const dose = d.postOlanzapine.split(' ')[0];
      rows.push({ drug: 'Tab. Olanzapine', dose: dose, route: 'Oral', frequency: 'HS', duration: days(d.postOlanzapine_days, 'As needed (SOS)') });
    }
    return rows;
  }

  // ============================================================
  // TEMPLATE: Pathology Slides & Blocks Request
  // ============================================================
  const pathSlides = {
    title: 'Pathology Slides & Blocks Request',
    fields: [
      F.patientName, F.age, F.sex, F.mrn, F.diagnosis,
      { name: 'pathLab', label: 'Pathology lab / department addressed', type: 'text',
        placeholder: 'e.g. Department of Pathology, ABC Hospital' },
      { name: 'biopsyRef', label: 'Histopathology / biopsy reference no. (if known)', type: 'text',
        placeholder: 'e.g. HPE No: H/2026/01234, dated 12/03/2026' },
      { name: 'purpose', label: 'Purpose (optional)', type: 'select',
        options: [
          'For molecular / IHC testing',
          'For next-generation sequencing (NGS)',
          'For second-opinion pathology review',
          'For records / patient request',
          'Other (specify in additional notes)'
        ] },
      { name: 'extraNotes', label: 'Additional notes (optional)', type: 'textarea' },
      F.letterDate, F.consultant
    ],
    render(d, doc) {
      const addressee = d.pathLab ? esc(d.pathLab) : 'The Department of Pathology';
      const purposeLine = d.purpose
        ? `<p>The slides and blocks are required <strong>${esc(d.purpose).toLowerCase()}</strong>.</p>`
        : '';
      return `
        ${heading('Request for Release of Slides and Blocks')}
        ${meta(d.letterDate)}
        <p class="salutation">To,<br/>${addressee},</p>
        ${patientBlock(d)}
        <div class="body">
          <p>The above-named patient is currently under our care at the Department of Medical Oncology, KIMS MACS Onco Sciences, Bengaluru.</p>
          <p>I would be grateful if you could kindly <strong>issue the histopathology slides and paraffin-embedded tissue blocks</strong> pertaining to this patient${d.biopsyRef ? ` (<strong>${esc(d.biopsyRef)}</strong>)` : ''}.</p>
          ${purposeLine}
          ${d.extraNotes ? `<p><strong>Additional notes:</strong> ${esc(d.extraNotes)}</p>` : ''}
          <p>The patient / authorised attendant has been informed and will collect the material in person. Kindly ensure that all relevant blocks and representative stained slides are released and that an acknowledgement of receipt is obtained at the time of handover.</p>
          <p>Thank you for your kind cooperation.</p>
        </div>
        ${signoff(doc)}`;
    }
  };

  // ============================================================
  // TEMPLATE: Genomic / NGS / Germline Test Request
  // ============================================================
  const genomicTest = {
    title: 'Genomic / NGS Test Request',
    fields: [
      F.patientName, F.age, F.sex, F.mrn, F.diagnosis,
      { name: 'geneLab', label: 'Genomic lab addressed', type: 'text',
        placeholder: 'e.g. Strand Life Sciences / MedGenome / 4baseCare / Datar Genetics' },
      { name: 'testType', label: 'Test requested', type: 'select', required: true,
        options: [
          'Comprehensive solid tumour NGS panel (DNA + RNA)',
          'Liquid biopsy / cell-free DNA NGS',
          'Targeted somatic panel (specify in notes)',
          'Germline multigene panel (hereditary cancer)',
          'BRCA1 / BRCA2 germline testing',
          'Homologous Recombination Repair (HRR) panel',
          'Microsatellite instability (MSI) / MMR testing',
          'Tumour Mutational Burden (TMB)',
          'Single gene test (specify in notes)'
        ] },
      { name: 'specimenType', label: 'Specimen type', type: 'select',
        options: [
          'FFPE block + H&E slide',
          'Fresh tumour biopsy',
          'Peripheral blood (EDTA) — for germline / liquid biopsy',
          'Plasma — for circulating tumour DNA',
          'Bone marrow aspirate'
        ] },
      { name: 'specimenRef', label: 'Specimen reference (optional)', type: 'text',
        placeholder: 'e.g. HPE No: H/2026/01234, biopsy site: liver lesion' },
      { name: 'extraNotes', label: 'Additional clinical context (optional)', type: 'textarea',
        placeholder: 'e.g. Prior treatment received, specific genes of interest, family history' },
      F.letterDate, F.consultant
    ],
    render(d, doc) {
      const addressee = d.geneLab ? esc(d.geneLab) : 'The Molecular Diagnostics Laboratory';
      const test = d.testType || '';
      const isGermline = /germline|brca|hereditary/i.test(test);
      const indicationLine = isGermline
        ? 'The result will guide assessment of hereditary cancer predisposition, family counselling and personalised treatment decisions including consideration of PARP inhibitor therapy where indicated.'
        : 'The result will guide selection of targeted therapy, immunotherapy eligibility and overall personalised treatment planning for the patient.';
      return `
        ${heading('Request for Genomic / Molecular Testing')}
        ${meta(d.letterDate)}
        <p class="salutation">To,<br/>${addressee},</p>
        ${patientBlock(d)}
        <div class="body">
          <p>The above-named patient is currently under our care at the Department of Medical Oncology, KIMS MACS Onco Sciences, Bengaluru.</p>
          <p>Kindly process the sample submitted herewith for <strong>${esc(test)}</strong>${d.specimenType ? ` on the provided <strong>${esc(d.specimenType)}</strong>` : ''}${d.specimenRef ? ` (<strong>${esc(d.specimenRef)}</strong>)` : ''}.</p>
          <p>${indicationLine}</p>
          ${d.extraNotes ? `<p><strong>Additional clinical context:</strong> ${esc(d.extraNotes)}</p>` : ''}
          <p>The patient and / or family have been counselled regarding the rationale, scope and limitations of the test, the expected turnaround time and applicable charges, and have provided informed consent for sample processing and reporting. Kindly share the final report with our department at the earliest convenience.</p>
          <p>Thank you for your cooperation.</p>
        </div>
        ${signoff(doc)}`;
    }
  };

  // ============================================================
  window.TEMPLATES = {
    'medical-certificate':  medicalCertificate,
    'leave-of-absence':     leaveOfAbsence,
    'referral':             referral,
    'prescription':         prescription,
    'preauth-approval':     preauthApproval,
    'preauth-rebuttal':     preauthRebuttal,
    'fitness-travel':       fitnessTravel,
    'treatment-completion': treatmentCompletion,
    'twimc':                twimc,
    'second-opinion':       secondOpinion,
    'path-slides':          pathSlides,
    'genomic-test':         genomicTest,
    'continuing-care':      continuingCare,
  };
})();
