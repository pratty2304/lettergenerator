/* ========================================================================
   App controller — renders form, generates letter preview, handles print.
   ======================================================================== */

(function () {
  const LETTER_TIME_ZONE = 'Asia/Kolkata';
  const params = new URLSearchParams(location.search);
  const type = params.get('type');
  const tmpl = window.TEMPLATES && window.TEMPLATES[type];
  const titleEl = document.getElementById('letterTitle');
  const formEl = document.getElementById('letterForm');
  const previewEl = document.getElementById('letterPreview');
  const generateBtn = document.getElementById('generateBtn');
  const printBtn = document.getElementById('printBtn');
  const resetBtn = document.getElementById('resetBtn');

  if (!tmpl) {
    titleEl.textContent = 'Unknown letter';
    formEl.innerHTML = '<p style="color:#a14;">Letter type not found. <a href="index.html">Go back</a>.</p>';
    return;
  }

  titleEl.textContent = tmpl.title;
  document.title = tmpl.title + ' — KIMS MACS';

  // ---------- Build form ----------
  buildForm(tmpl.fields);
  hookDrugChange();
  hookLetterheadToggle();
  hookDrugList();

  // ---------- Buttons ----------
  generateBtn.addEventListener('click', generate);
  printBtn.addEventListener('click', () => {
    // ensure preview is up-to-date if user hasn't generated yet
    if (!previewEl.dataset.generated && !generate()) return;

    // Set document.title so the browser's "Save as PDF" suggests
    // "<Patient name> - <Letter type>.pdf" as the filename.
    const data = readForm();
    const patient = (data.patientName || 'Patient').trim();
    const safe = (s) => s.replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, ' ').trim();
    const filename = `${safe(patient)} - ${safe(tmpl.title)}`;
    const originalTitle = document.title;
    document.title = filename;

    const restore = () => { document.title = originalTitle; };
    window.addEventListener('afterprint', restore, { once: true });
    // Fallback in case afterprint doesn't fire (some browsers / cancelled dialogs)
    setTimeout(restore, 4000);

    window.print();
  });
  resetBtn.addEventListener('click', () => {
    formEl.reset();
    setDefaults();
    refreshDrugFields();
    updateLivePreview();
  });
  formEl.addEventListener('input', updateLivePreview);
  formEl.addEventListener('change', updateLivePreview);

  setDefaults();
  refreshDrugFields();
  updateLivePreview();

  // ============================================================
  function buildForm(fields) {
    let html = '';
    let groupOpen = false;
    fields.forEach((f, i) => {
      // section heading before consultant / before drug to group form
      if (f.name === 'drugId' && !groupOpen) {
        html += `<div class="field-group-title">Drug</div>`;
      }
      if (f.name === 'consultantId') {
        html += `<div class="field-group-title">Signing</div>`;
      }
      if (i === 0) {
        html += `<div class="field-group-title">Patient</div>`;
      }
      html += renderField(f);
    });
    formEl.innerHTML = html
      + `<div class="field" style="margin-top:12px;">
           <label style="display:flex; align-items:center; gap:8px; font-size:12px;">
             <input type="checkbox" id="onLetterheadChk" />
             Print on hospital letterhead (hides logo &amp; title in print)
           </label>
         </div>`;
  }

  function renderField(f) {
    if (f.type === 'groupHeader') {
      return `<div class="form-group-card-title">${escapeAttr(f.label)}</div>`;
    }
    const req = f.required ? ' required' : '';
    const ph = f.placeholder ? ` placeholder="${escapeAttr(f.placeholder)}"` : '';
    const renderOption = (o) => {
      if (typeof o === 'string') return `<option value="${escapeAttr(o)}">${escapeAttr(o)}</option>`;
      return `<option value="${escapeAttr(o.value)}">${escapeAttr(o.label)}</option>`;
    };
    let input;

    switch (f.type) {
      case 'textarea':
        input = `<textarea name="${f.name}"${req}${ph}></textarea>`;
        break;
      case 'select':
        input = `<select name="${f.name}"${req}>
          <option value="">${f.required ? '— Select —' : '— None —'}</option>
          ${(f.options || []).map(renderOption).join('')}
        </select>`;
        break;
      case 'selectWithDays':
        input = `<div class="select-days">
          <select name="${f.name}">
            <option value="">— None —</option>
            ${(f.options || []).map(renderOption).join('')}
          </select>
          <input type="number" name="${f.name}_days" min="1" max="30" placeholder="Days" />
        </div>`;
        break;
      case 'doctor':
        input = `<select name="${f.name}"${req}>
          <option value="">— Select consultant —</option>
          ${(window.DOCTORS || []).map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
        </select>`;
        break;
      case 'drug':
        input = `<select name="${f.name}"${req}>
          <option value="">— Select drug —</option>
          ${(window.DRUGS || []).map(d => `<option value="${d.id}">${d.generic}</option>`).join('')}
        </select>`;
        break;
      case 'brand':
        input = `<select name="${f.name}"${req}>
          <option value="">— Pick drug first —</option>
        </select>`;
        break;
      case 'doseSelect':
        input = `<select name="${f.name}"${req}>
          <option value="">— Pick drug first —</option>
        </select>`;
        break;
      case 'date':
        input = `<input type="date" name="${f.name}"${req} />`;
        break;
      case 'drugList':
        input = `<div class="drug-list" data-name="${escapeAttr(f.name)}" data-required="${f.required ? '1' : ''}">
          <div class="drug-list-rows"></div>
          <button type="button" class="btn ghost btn-add-drug">+ Add drug</button>
        </div>`;
        break;
      case 'number':
        input = `<input type="number" min="0" step="any" name="${f.name}"${req}${ph} />`;
        break;
      default:
        input = `<input type="text" name="${f.name}"${req}${ph} />`;
    }
    return `<div class="field">
              <label for="${f.name}">${escapeAttr(f.label)}${f.required ? ' *' : ''}</label>
              ${input}
            </div>`;
  }

  function escapeAttr(s) {
    return String(s == null ? '' : s).replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function setDefaults() {
    const today = todayIso(LETTER_TIME_ZONE);
    formEl.querySelectorAll('input[type="date"]').forEach(inp => {
      if (!inp.value) inp.value = today;
    });
  }

  function todayIso(timeZone) {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(new Date());

    const byType = Object.fromEntries(parts.map(part => [part.type, part.value]));
    return `${byType.year}-${byType.month}-${byType.day}`;
  }

  function hookDrugChange() {
    const drugSel = formEl.querySelector('select[name="drugId"]');
    if (!drugSel) return;
    drugSel.addEventListener('change', () => {
      refreshDrugFields();
      updateLivePreview();
    });
  }

  function refreshDrugFields() {
    const drugSel = formEl.querySelector('select[name="drugId"]');
    if (!drugSel) return;
    const brandSel = formEl.querySelector('select[name="brand"]');
    const doseSel  = formEl.querySelector('select[name="dose"]');
    const drug = (window.DRUGS || []).find(d => d.id === drugSel.value);
    if (!drug) {
      if (brandSel) brandSel.innerHTML = '<option value="">— Pick drug first —</option>';
      if (doseSel)  doseSel.innerHTML  = '<option value="">— Pick drug first —</option>';
      return;
    }
    if (brandSel) {
      brandSel.innerHTML = drug.brands.map(b => `<option>${b}</option>`).join('');
    }
    if (doseSel) {
      doseSel.innerHTML = drug.standardDoses.map(d =>
        `<option ${d === drug.defaultDose ? 'selected' : ''}>${d}</option>`).join('');
    }
  }

  function hookDrugList() {
    formEl.querySelectorAll('.drug-list').forEach(list => {
      const rowsEl = list.querySelector('.drug-list-rows');
      const addBtn = list.querySelector('.btn-add-drug');
      // Seed with one empty row
      rowsEl.appendChild(makeDrugRow());
      addBtn.addEventListener('click', () => {
        rowsEl.appendChild(makeDrugRow());
        updateLivePreview();
      });
      rowsEl.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('dl-remove')) {
          const row = e.target.closest('.drug-list-row');
          if (row && rowsEl.children.length > 1) {
            row.remove();
            updateLivePreview();
          }
        }
      });
    });
  }

  function makeDrugRow() {
    const wrap = document.createElement('div');
    wrap.className = 'drug-list-row';
    wrap.innerHTML = `
      <input class="dl-drug" placeholder="Drug name" />
      <input class="dl-dose" placeholder="Dose (e.g. 200 mg)" />
      <select class="dl-solvent">
        <option value="">Solvent</option>
        <option>NS</option>
        <option>D5W</option>
        <option>NS or D5W</option>
        <option>LR</option>
      </select>
      <input class="dl-volume" placeholder="Volume in mL (e.g. 250)" inputmode="decimal" />
      <input class="dl-duration" placeholder="Duration (e.g. 30 min)" />
      <input class="dl-note" placeholder="Note (e.g. 0.2µm in-line filter)" />
      <button type="button" class="dl-remove" title="Remove">×</button>`;
    return wrap;
  }

  function readDrugLists(data) {
    formEl.querySelectorAll('.drug-list').forEach(list => {
      const name = list.dataset.name;
      const rows = [];
      list.querySelectorAll('.drug-list-row').forEach(r => {
        const drug = r.querySelector('.dl-drug').value.trim();
        if (!drug) return;
        rows.push({
          drug,
          dose:     r.querySelector('.dl-dose').value.trim(),
          solvent:  r.querySelector('.dl-solvent').value.trim(),
          volume:   r.querySelector('.dl-volume').value.trim(),
          duration: r.querySelector('.dl-duration').value.trim(),
          note:     r.querySelector('.dl-note').value.trim()
        });
      });
      data[name] = rows;
    });
  }

  function hookLetterheadToggle() {
    document.addEventListener('change', (e) => {
      if (e.target && e.target.id === 'onLetterheadChk') {
        if (e.target.checked) previewEl.classList.add('on-letterhead');
        else previewEl.classList.remove('on-letterhead');
      }
    });
  }

  // ============================================================
  function readForm() {
    const data = {};
    new FormData(formEl).forEach((v, k) => { data[k] = v; });
    readDrugLists(data);
    return data;
  }

  function updateLivePreview() {
    renderPreview({ validate: false, editable: false, scroll: false });
  }

  function generate() {
    return renderPreview({ validate: true, editable: true, scroll: true });
  }

  function renderPreview(options) {
    const data = options.validate ? readForm() : makeDraftData(readForm());

    // Basic validation
    if (options.validate) {
      const missing = (tmpl.fields || []).filter(f => {
        if (!f.required) return false;
        const v = data[f.name];
        if (Array.isArray(v)) return v.length === 0;
        return !v;
      });
      if (missing.length) {
        alert('Please complete: ' + missing.map(f => f.label).join(', '));
        return false;
      }
    }

    const doc = getDoctor(data.consultantId, options.validate);
    if (!doc) {
      alert('Please select a signing consultant.');
      return false;
    }

    let body;
    try {
      body = tmpl.render(data, doc);
    } catch (err) {
      console.error(err);
      alert('Could not generate letter: ' + err.message);
      return;
    }

    const html = `
      <img src="assets/kims-logo.png" alt="KIMS MACS Onco Sciences" class="letter-logo" />
      ${body}
    `;
    previewEl.innerHTML = html;
    previewEl.contentEditable = options.editable ? 'true' : 'false';
    if (options.editable) previewEl.dataset.generated = '1';
    else previewEl.removeAttribute('data-generated');
    if (options.scroll) previewEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }

  function makeDraftData(data) {
    const draft = { ...data };
    (tmpl.fields || []).forEach(f => {
      const current = draft[f.name];
      if (Array.isArray(current)) return;
      if (current) return;
      if (f.type === 'date') draft[f.name] = todayIso(LETTER_TIME_ZONE);
      else if (f.required) draft[f.name] = placeholderFor(f);
    });
    return draft;
  }

  function placeholderFor(field) {
    if (field.name === 'sex') return '';
    if (field.name === 'age') return '__';
    return `[${field.label.replace(/\s*\*$/, '')}]`;
  }

  function getDoctor(consultantId, validate) {
    const doctor = (window.DOCTORS || []).find(d => d.id === consultantId);
    if (doctor || validate) return doctor;
    return {
      name: '[Signing consultant]',
      qualifications: '[Qualifications]',
      designation: '[Designation]',
      institute: 'KIMS Hospitals, Bengaluru',
      kmc: '[KMC No]'
    };
  }
})();
