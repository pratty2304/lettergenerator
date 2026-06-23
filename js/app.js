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
  const saveBtn = document.getElementById('saveBtn');
  const printBtn = document.getElementById('printBtn');
  const resetBtn = document.getElementById('resetBtn');
  const savedLetterSelect = document.getElementById('savedLetterSelect');
  const loadSavedBtn = document.getElementById('loadSavedBtn');
  const deleteSavedBtn = document.getElementById('deleteSavedBtn');
  const savedCountEl = document.getElementById('savedCount');
  const archiveStatusEl = document.getElementById('archiveStatus');
  const MAX_SAVED_PER_TYPE = 50;
  const DB_NAME = 'kimsLetterGenerator';
  const DB_VERSION = 1;
  const STORE_NAME = 'letters';
  const LOCAL_STORAGE_KEY = 'kimsLetterGenerator.savedLetters.v1';
  let previewHasManualEdits = false;
  let savedLetters = [];
  let archiveReady = null;
  let archiveMode = 'indexeddb';

  if (!tmpl) {
    titleEl.textContent = 'Unknown letter';
    formEl.innerHTML = '<p style="color:#a14;">Letter type not found. <a href="index.html">Go back</a>.</p>';
    document.querySelector('.generator-shell')?.removeAttribute('aria-busy');
    document.body.classList.add('is-ready');
    return;
  }

  titleEl.textContent = tmpl.title;
  document.title = tmpl.title + ' — KIMS Renova';

  // ---------- Build form ----------
  buildForm(tmpl.fields);
  hookDrugChange();
  hookGenomicLabChange();
  hookLetterheadToggle();
  hookDrugList();
  hookArchive();

  // ---------- Buttons ----------
  generateBtn.addEventListener('click', generate);
  if (saveBtn) saveBtn.addEventListener('click', () => saveCurrentLetter({ silent: false }));
  printBtn.addEventListener('click', async () => {
    if (!prepareFinalPreview()) return;
    await saveCurrentLetter({ silent: true, prepared: true });
    printCurrentLetter();
  });
  resetBtn.addEventListener('click', () => {
    formEl.reset();
    previewHasManualEdits = false;
    setDefaults();
    refreshDrugFields();
    refreshGenomicFields();
    updateLivePreview();
  });
  formEl.addEventListener('input', updateLivePreview);
  formEl.addEventListener('change', updateLivePreview);
  previewEl.addEventListener('beforeinput', handleEditableRuleInput);
  previewEl.addEventListener('keydown', handleEditableRuleKeys);
  previewEl.addEventListener('input', markPreviewEdited);

  function markPreviewEdited() {
    previewHasManualEdits = true;
    previewEl.dataset.manualEdits = '1';
  }

  setDefaults();
  refreshDrugFields();
  refreshGenomicFields();
  updateLivePreview();
  initArchivePanel();
  document.querySelector('.generator-shell')?.removeAttribute('aria-busy');
  document.body.classList.add('is-ready');

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
    const datalists = fields
      .filter(canAutocompleteField)
      .map(f => `<datalist id="${autocompleteListId(f.name)}"></datalist>`)
      .join('');

    formEl.innerHTML = html
      + `<div class="field" style="margin-top:12px;">
           <label style="display:flex; align-items:center; gap:8px; font-size:12px;">
             <input type="checkbox" id="onLetterheadChk" />
             Print on hospital letterhead (hides logo &amp; title in print)
           </label>
         </div>`
      + datalists;
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
        input = `<textarea name="${f.name}" autocomplete="on"${req}${ph}></textarea>`;
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
        input = `<input type="number" min="0" step="any" name="${f.name}"${autocompleteAttr(f)}${req}${ph} />`;
        break;
      default:
        input = `<input type="text" name="${f.name}"${autocompleteAttr(f)}${req}${ph} />`;
    }
    return `<div class="field">
              <label for="${f.name}">${escapeAttr(f.label)}${f.required ? ' *' : ''}</label>
              ${input}
            </div>`;
  }

  function escapeAttr(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;');
  }

  function canAutocompleteField(f) {
    const fieldType = f.type || 'text';
    return fieldType === 'text' || fieldType === 'number';
  }

  function autocompleteAttr(f) {
    if (!canAutocompleteField(f)) return ' autocomplete="on"';
    return ` autocomplete="on" list="${autocompleteListId(f.name)}"`;
  }

  function autocompleteListId(name) {
    return `saved-values-${name}`;
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

  function hookGenomicLabChange() {
    const labSel = formEl.querySelector('select[name="geneLab"]');
    if (!labSel) return;
    labSel.addEventListener('change', refreshGenomicFields);
  }

  function refreshGenomicFields() {
    const labSel = formEl.querySelector('select[name="geneLab"]');
    if (!labSel) return;

    const lab = labSel.value;
    toggleField('geneLabOther', lab === 'others');

    const testSel = formEl.querySelector('select[name="testType"]');
    if (!testSel || !window.GENOMIC_TEST_OPTIONS) return;

    const options = lab === '4basecare'
      ? window.GENOMIC_TEST_OPTIONS.fourbasecare
      : window.GENOMIC_TEST_OPTIONS.default;
    if (!Array.isArray(options)) return;

    const current = testSel.value;
    testSel.innerHTML = '<option value="">— Select —</option>' + options.map(renderOption).join('');
    if (options.some(o => optionValue(o) === current)) testSel.value = current;
  }

  function toggleField(name, visible) {
    const input = formEl.querySelector(`[name="${name}"]`);
    if (!input) return;
    const field = input.closest('.field');
    if (field) field.hidden = !visible;
    input.disabled = !visible;
    if (!visible) input.value = '';
  }

  function renderOption(o) {
    if (typeof o === 'string') return `<option value="${escapeAttr(o)}">${escapeAttr(o)}</option>`;
    return `<option value="${escapeAttr(o.value)}">${escapeAttr(o.label)}</option>`;
  }

  function optionValue(o) {
    return typeof o === 'string' ? o : o.value;
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

  function hookArchive() {
    archiveReady = openArchive();
    if (loadSavedBtn) loadSavedBtn.addEventListener('click', loadSelectedLetter);
    if (deleteSavedBtn) deleteSavedBtn.addEventListener('click', deleteSelectedLetter);
    if (savedLetterSelect) savedLetterSelect.addEventListener('change', updateArchiveButtons);
    updateArchiveButtons();
  }

  async function initArchivePanel() {
    try {
      await refreshSavedLettersUI();
      setArchiveStatus('');
    } catch (err) {
      console.warn(err);
      setArchiveStatus('Local save is unavailable in this browser.');
    }
  }

  function openArchive() {
    if (!window.indexedDB) {
      archiveMode = 'localStorage';
      return Promise.resolve(null);
    }

    return new Promise(resolve => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('typeCreatedAt', 'typeCreatedAt', { unique: false });
          store.createIndex('type', 'type', { unique: false });
        }
      };
      request.onsuccess = () => {
        archiveMode = 'indexeddb';
        resolve(request.result);
      };
      request.onerror = () => {
        archiveMode = 'localStorage';
        resolve(null);
      };
      request.onblocked = () => {
        archiveMode = 'localStorage';
        resolve(null);
      };
    });
  }

  async function saveCurrentLetter(options = {}) {
    if (!options.prepared && !prepareFinalPreview()) return false;

    const data = readForm();
    const id = createLetterId();
    const createdAt = new Date().toISOString();
    const record = {
      id,
      type,
      typeCreatedAt: `${type}|${createdAt}|${id}`,
      title: tmpl.title,
      createdAt,
      patientName: (data.patientName || 'Patient').trim() || 'Patient',
      letterDate: data.letterDate || '',
      consultantId: data.consultantId || '',
      filename: buildFilename(data),
      data,
      html: previewEl.innerHTML,
      text: previewEl.innerText || '',
      onLetterhead: isOnLetterhead()
    };

    try {
      await putLetter(record);
      await trimLettersForType(type);
      await refreshSavedLettersUI(record.id);
      if (!options.silent) setArchiveStatus(`Saved: ${record.patientName}`);
      return true;
    } catch (err) {
      console.warn(err);
      setArchiveStatus('Could not save locally.');
      return false;
    }
  }

  function prepareFinalPreview() {
    if (!validateForFinalOutput()) return false;
    if (previewHasManualEdits) {
      previewEl.dataset.generated = '1';
      return true;
    }
    return renderPreview({ validate: true, scroll: false });
  }

  function printCurrentLetter() {
    const data = readForm();
    const filename = buildFilename(data);
    const originalTitle = document.title;
    document.title = filename;

    const restore = () => { document.title = originalTitle; };
    window.addEventListener('afterprint', restore, { once: true });
    setTimeout(restore, 4000);

    window.print();
  }

  function buildFilename(data) {
    const patient = (data.patientName || 'Patient').trim() || 'Patient';
    return `${safeFilenamePart(patient)} - ${safeFilenamePart(tmpl.title)}`;
  }

  function safeFilenamePart(s) {
    return String(s || '')
      .replace(/[\\/:*?"<>|]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function createLetterId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  async function refreshSavedLettersUI(selectedId = '') {
    savedLetters = await getLettersForType(type);
    renderSavedLetterSelect(selectedId);
    renderAutocompleteLists();
  }

  function renderSavedLetterSelect(selectedId) {
    if (!savedLetterSelect) return;

    if (!savedLetters.length) {
      savedLetterSelect.innerHTML = '<option value="">No saved letters</option>';
    } else {
      savedLetterSelect.innerHTML =
        '<option value="">Select saved letter</option>' +
        savedLetters.map(record =>
          `<option value="${escapeAttr(record.id)}">${escapeAttr(savedLetterLabel(record))}</option>`
        ).join('');
      if (selectedId && savedLetters.some(record => record.id === selectedId)) {
        savedLetterSelect.value = selectedId;
      }
    }

    if (savedCountEl) savedCountEl.textContent = `${savedLetters.length} / ${MAX_SAVED_PER_TYPE}`;
    updateArchiveButtons();
  }

  function savedLetterLabel(record) {
    const patient = record.patientName || 'Patient';
    const savedDate = formatSavedDate(record.createdAt);
    const letterDate = record.letterDate ? ` | ${formatDateForLabel(record.letterDate)}` : '';
    return `${patient} | ${savedDate}${letterDate}`;
  }

  function formatSavedDate(iso) {
    if (!iso) return '';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  function formatDateForLabel(isoDate) {
    const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
    if (!parts) return isoDate;
    return `${parts[3]}/${parts[2]}/${parts[1]}`;
  }

  function renderAutocompleteLists() {
    const values = {};
    savedLetters.forEach(record => {
      const data = record.data || {};
      (tmpl.fields || []).forEach(field => {
        if (!canAutocompleteField(field)) return;
        const value = String(data[field.name] == null ? '' : data[field.name]).trim();
        if (!value) return;
        if (!values[field.name]) values[field.name] = [];
        if (!values[field.name].includes(value)) values[field.name].push(value);
      });
    });

    (tmpl.fields || []).filter(canAutocompleteField).forEach(field => {
      const list = document.getElementById(autocompleteListId(field.name));
      if (!list) return;
      list.innerHTML = (values[field.name] || [])
        .slice(0, MAX_SAVED_PER_TYPE)
        .map(value => `<option value="${escapeAttr(value)}"></option>`)
        .join('');
    });
  }

  function updateArchiveButtons() {
    const hasSelection = !!(savedLetterSelect && savedLetterSelect.value);
    if (loadSavedBtn) loadSavedBtn.disabled = !hasSelection;
    if (deleteSavedBtn) deleteSavedBtn.disabled = !hasSelection;
  }

  function setArchiveStatus(message) {
    if (archiveStatusEl) archiveStatusEl.textContent = message || '';
  }

  async function loadSelectedLetter() {
    const record = selectedSavedLetter();
    if (!record) return;
    applySavedLetter(record);
    setArchiveStatus(`Loaded: ${record.patientName || 'Patient'}`);
  }

  async function deleteSelectedLetter() {
    const record = selectedSavedLetter();
    if (!record) return;
    if (!window.confirm(`Delete saved letter for ${record.patientName || 'Patient'}?`)) return;
    await deleteLetter(record.id);
    await refreshSavedLettersUI();
    setArchiveStatus('Deleted saved letter.');
  }

  function selectedSavedLetter() {
    if (!savedLetterSelect || !savedLetterSelect.value) return null;
    return savedLetters.find(record => record.id === savedLetterSelect.value) || null;
  }

  function applySavedLetter(record) {
    const data = record.data || {};
    formEl.reset();

    (tmpl.fields || []).forEach(field => {
      if (field.type === 'drugList') return;
      if (['drugId', 'brand', 'dose', 'geneLab', 'geneLabOther', 'testType'].includes(field.name)) return;
      setFormValue(field.name, data[field.name]);
      if (field.type === 'selectWithDays') setFormValue(`${field.name}_days`, data[`${field.name}_days`]);
    });

    setFormValue('drugId', data.drugId);
    refreshDrugFields();
    setFormValue('brand', data.brand);
    setFormValue('dose', data.dose);

    setFormValue('geneLab', data.geneLab);
    refreshGenomicFields();
    setFormValue('geneLabOther', data.geneLabOther);
    setFormValue('testType', data.testType);

    setDrugListValues(data);
    setOnLetterhead(!!record.onLetterhead);

    if (record.html) {
      previewEl.innerHTML = record.html;
      previewEl.contentEditable = 'true';
      previewEl.dataset.generated = '1';
      previewEl.dataset.manualEdits = '1';
      previewHasManualEdits = true;
    } else {
      previewHasManualEdits = false;
      renderPreview({ validate: false, scroll: false });
    }

    previewEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function setFormValue(name, value) {
    if (value === undefined || value === null) return;
    const field = formEl.elements[name];
    if (!field) return;
    field.value = value;
  }

  function setDrugListValues(data) {
    formEl.querySelectorAll('.drug-list').forEach(list => {
      const rowsEl = list.querySelector('.drug-list-rows');
      const rows = Array.isArray(data[list.dataset.name]) && data[list.dataset.name].length
        ? data[list.dataset.name]
        : [{}];

      rowsEl.innerHTML = '';
      rows.forEach(rowData => {
        const row = makeDrugRow();
        row.querySelector('.dl-drug').value = rowData.drug || '';
        row.querySelector('.dl-dose').value = rowData.dose || '';
        row.querySelector('.dl-solvent').value = rowData.solvent || '';
        row.querySelector('.dl-volume').value = rowData.volume || '';
        row.querySelector('.dl-duration').value = rowData.duration || '';
        row.querySelector('.dl-note').value = rowData.note || '';
        rowsEl.appendChild(row);
      });
    });
  }

  function setOnLetterhead(enabled) {
    const checkbox = document.getElementById('onLetterheadChk');
    if (checkbox) checkbox.checked = enabled;
    previewEl.classList.toggle('on-letterhead', enabled);
  }

  function isOnLetterhead() {
    const checkbox = document.getElementById('onLetterheadChk');
    return !!(checkbox && checkbox.checked);
  }

  async function putLetter(record) {
    await archiveReady;
    if (archiveMode !== 'indexeddb') return putLetterLocal(record);

    const db = await archiveReady;
    if (!db) return putLetterLocal(record);

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(record);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  }

  async function getLettersForType(letterType) {
    await archiveReady;
    if (archiveMode !== 'indexeddb') return getLettersForTypeLocal(letterType);

    const db = await archiveReady;
    if (!db) return getLettersForTypeLocal(letterType);

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const index = tx.objectStore(STORE_NAME).index('typeCreatedAt');
      const range = IDBKeyRange.bound(`${letterType}|`, `${letterType}|\uffff`);
      const records = [];
      const cursorRequest = index.openCursor(range, 'prev');

      cursorRequest.onsuccess = () => {
        const cursor = cursorRequest.result;
        if (!cursor) return;
        records.push(cursor.value);
        cursor.continue();
      };
      tx.oncomplete = () => resolve(records);
      tx.onerror = () => reject(tx.error);
    });
  }

  async function deleteLetter(id) {
    await archiveReady;
    if (archiveMode !== 'indexeddb') return deleteLetterLocal(id);

    const db = await archiveReady;
    if (!db) return deleteLetterLocal(id);

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(id);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  }

  async function trimLettersForType(letterType) {
    const records = await getLettersForType(letterType);
    const extras = records.slice(MAX_SAVED_PER_TYPE);
    for (const record of extras) {
      await deleteLetter(record.id);
    }
  }

  function getLocalStore() {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
    } catch (_err) {
      return {};
    }
  }

  function setLocalStore(store) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store));
  }

  function putLetterLocal(record) {
    const store = getLocalStore();
    const records = (store[record.type] || []).filter(item => item.id !== record.id);
    records.unshift(record);
    store[record.type] = records
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      .slice(0, MAX_SAVED_PER_TYPE);
    setLocalStore(store);
  }

  function getLettersForTypeLocal(letterType) {
    const store = getLocalStore();
    return (store[letterType] || [])
      .slice()
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  }

  function deleteLetterLocal(id) {
    const store = getLocalStore();
    Object.keys(store).forEach(letterType => {
      store[letterType] = (store[letterType] || []).filter(record => record.id !== id);
    });
    setLocalStore(store);
  }

  function handleEditableRuleInput(e) {
    const rule = selectedEditableRule();
    if (!rule) return;

    const inputType = e.inputType || '';
    if (inputType === 'insertParagraph') {
      e.preventDefault();
      adjustEditableRuleSpace(rule, 1);
      return;
    }
    if (inputType === 'deleteContentBackward') {
      e.preventDefault();
      adjustEditableRuleSpace(rule, -1);
      return;
    }

    if (
      inputType === 'deleteContentForward' ||
      inputType === 'deleteByCut' ||
      inputType.startsWith('insert') ||
      inputType.startsWith('format')
    ) {
      e.preventDefault();
    }
  }

  function handleEditableRuleKeys(e) {
    const rule = selectedEditableRule();
    if (!rule) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      adjustEditableRuleSpace(rule, 1);
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      adjustEditableRuleSpace(rule, -1);
    } else if (e.key === 'Delete') {
      e.preventDefault();
    }
  }

  function selectedEditableRule() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;

    const directRule = closestEditableRule(sel.anchorNode) || closestEditableRule(sel.focusNode);
    if (directRule && previewEl.contains(directRule)) return directRule;

    if (!sel.isCollapsed) {
      const range = sel.getRangeAt(0);
      const rules = Array.from(previewEl.querySelectorAll('.editable-rule'));
      return rules.find(rule => {
        try {
          return range.intersectsNode(rule);
        } catch (_err) {
          return false;
        }
      }) || null;
    }

    return null;
  }

  function closestEditableRule(node) {
    if (!node) return null;
    const el = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    return el && el.closest ? el.closest('.editable-rule') : null;
  }

  function adjustEditableRuleSpace(rule, delta) {
    const space = findEditableSpaceBefore(rule);
    if (space) {
      if (delta > 0) space.appendChild(document.createElement('br'));
      else removeTrailingLineBreak(space);
    }

    keepRuleEditable(rule);
    placeCaretInRule(rule);
    markPreviewEdited();
  }

  function findEditableSpaceBefore(el) {
    let current = el;
    while (current && current !== previewEl) {
      let prev = current.previousElementSibling;
      while (prev) {
        if (prev.matches && prev.matches('.editable-space')) return prev;
        const nested = lastEditableSpace(prev);
        if (nested) return nested;
        prev = prev.previousElementSibling;
      }
      current = current.parentElement;
    }
    return null;
  }

  function lastEditableSpace(el) {
    if (!el.querySelectorAll) return null;
    const spaces = el.querySelectorAll('.editable-space');
    return spaces.length ? spaces[spaces.length - 1] : null;
  }

  function removeTrailingLineBreak(space) {
    const nodes = Array.from(space.childNodes);
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      if (node.nodeName === 'BR') {
        node.remove();
        return;
      }
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '') {
        node.remove();
      }
    }
  }

  function keepRuleEditable(rule) {
    if (!rule.textContent.trim()) rule.innerHTML = '&nbsp;';
  }

  function placeCaretInRule(rule) {
    const sel = window.getSelection();
    if (!sel) return;
    const range = document.createRange();
    range.selectNodeContents(rule);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  // ============================================================
  function readForm() {
    const data = {};
    new FormData(formEl).forEach((v, k) => { data[k] = v; });
    readDrugLists(data);
    return data;
  }

  function updateLivePreview() {
    if (previewHasManualEdits) return true;
    return renderPreview({ validate: false, scroll: false });
  }

  function generate() {
    const ok = renderPreview({ validate: true, scroll: true });
    if (ok) previewHasManualEdits = false;
    return ok;
  }

  function renderPreview(options) {
    const rawData = readForm();
    const data = options.validate ? rawData : makeDraftData(rawData);

    // Basic validation
    if (options.validate && !validateRequiredFields(rawData)) return false;

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
      <img src="assets/kims-renova-logo.png" alt="KIMS Renova Oncology Institute" class="letter-logo" />
      ${body}
    `;
    previewEl.innerHTML = html;
    previewEl.contentEditable = 'true';
    previewEl.removeAttribute('data-manual-edits');
    if (options.validate) previewEl.dataset.generated = '1';
    else previewEl.removeAttribute('data-generated');
    if (options.scroll) previewEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }

  function validateForFinalOutput() {
    const data = readForm();
    if (!validateRequiredFields(data)) return false;
    if (!getDoctor(data.consultantId, true)) {
      alert('Please select a signing consultant.');
      return false;
    }
    return true;
  }

  function validateRequiredFields(data) {
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
      institute: 'KIMS Renova Oncology Institute, Bengaluru',
      kmc: '[KMC No]'
    };
  }
})();
