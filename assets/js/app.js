
let analyses = 0;

const allergenFlowState = {
  currentStep: 'categories',
  selectedAnalysis: null,
  selectedBiomaterial: null,
  selectedTab: 'dust',
  selectedItemId: null,
  selectedTurnaroundId: 'same-day',
  pendingAnalysis: null
};

const analysisCatalog = [
  { id: 'rinocytogram', label: 'Риноцитограмма', biomaterialRequired: false, defaultTab: 'dust' },
  { id: 'rsal', label: 'Аллергопроба (РСАЛ)', biomaterialRequired: true, defaultTab: 'dust' },
  { id: 'ifa', label: 'Аллергопроба (ИФА)', biomaterialRequired: true, defaultTab: 'dust' },
  { id: 'ifa-general', label: 'ИФА (Общий)', biomaterialRequired: true, defaultTab: 'dust' },
  { id: 'hormones', label: 'Гормоны', biomaterialRequired: false, defaultTab: 'hormones' },
  { id: 'procedural', label: 'Процедурный кабинет', biomaterialRequired: false, defaultTab: 'animals' }
];

const biomaterialOptionsData = [
  { id: 'capillary', label: 'Капиллярлық қан/Капиллярная кровь' },
  { id: 'venous', label: 'Веноздық қан/Венозная кровь' }
];

const turnaroundOptionsData = [
  { id: 'same-day', label: 'В день обращения' },
  { id: 'one-day', label: '1 рабочий день' },
  { id: 'two-days', label: '2 рабочих дня' },
  { id: 'exclusive', label: 'Эксклюзивный анализ' }
];

const allergenTabsData = [
  { id: 'dust', label: 'Пыль' },
  { id: 'food', label: 'Пищевые аллергены' },
  { id: 'meadow', label: 'Луговые травы' },
  { id: 'hormones', label: 'Гормоны' },
  { id: 'insects', label: 'Насекомые' },
  { id: 'mold', label: 'Грибковая плесень' },
  { id: 'helminths', label: 'Гельминты' },
  { id: 'plants', label: 'Растения' },
  { id: 'contrast', label: 'Рентгеноконтрастные исследования' },
  { id: 'trees', label: 'Деревья' },
  { id: 'dental', label: 'Стоматологические обезболивающие' },
  { id: 'animals', label: 'Животные' },
  { id: 'antibiotics', label: 'Аллергены (антибиотики, витамины)' }
];

const allergenItemsData = {
  dust: [
    { id: 'dust-home', title: 'Пыль домашняя (клещевые, грибковые, эпителиальные, инсектные, текстильные элементы), h2', subtitle: 'В день обращения' },
    { id: 'dust-library', title: 'Пыль книжная и бытовая смесь, h1', subtitle: '1 рабочий день' }
  ],
  food: [
    { id: 'food-milk', title: 'Пищевые аллергены: молоко, яйцо, пшеница', subtitle: '1 рабочий день' },
    { id: 'food-citrus', title: 'Пищевые аллергены: цитрусовые и ягоды', subtitle: '2 рабочих дня' }
  ],
  meadow: [
    { id: 'meadow-1', title: 'Луговые травы: тимофеевка, овсяница, мятлик', subtitle: '1 рабочий день' }
  ],
  hormones: [
    { id: 'hormone-thyroid', title: 'ТТГ, Т3, Т4, пролактин', subtitle: '1 рабочий день' },
    { id: 'hormone-repro', title: 'ФСГ, ЛГ, эстрадиол', subtitle: '2 рабочих дня' }
  ],
  insects: [
    { id: 'insect-1', title: 'Насекомые: пчела, оса, шершень', subtitle: '2 рабочих дня' }
  ],
  mold: [
    { id: 'mold-1', title: 'Грибковая плесень: Alternaria, Cladosporium', subtitle: '1 рабочий день' }
  ],
  helminths: [
    { id: 'helminth-1', title: 'Гельминты: аскарида, токсокара', subtitle: '2 рабочих дня' }
  ],
  plants: [
    { id: 'plant-1', title: 'Растения: амброзия, лебеда, подорожник', subtitle: '1 рабочий день' }
  ],
  contrast: [
    { id: 'contrast-1', title: 'Рентгеноконтрастные препараты', subtitle: 'Эксклюзивный анализ' }
  ],
  trees: [
    { id: 'tree-1', title: 'Деревья: берёза, ольха, тополь', subtitle: '1 рабочий день' }
  ],
  dental: [
    { id: 'dental-1', title: 'Стоматологические обезболивающие: лидокаин, артикаин', subtitle: '2 рабочих дня' }
  ],
  animals: [
    { id: 'animal-1', title: 'Животные: кошка, собака, шерсть, эпителий', subtitle: '1 рабочий день' }
  ],
  antibiotics: [
    { id: 'antibiotic-1', title: 'Аллергены: антибиотики, витамины, анестетики', subtitle: 'Эксклюзивный анализ' }
  ]
};

function openMenu() {
  document.getElementById('menuWrap').classList.add('visible');
}

function closeMenu() {
  document.getElementById('menuWrap').classList.remove('visible');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMenu();
    closeBiomaterialModal();
  }
});

function navigate(where) {
  closeMenu();
  for (const id of ['application', 'profile', 'companion', 'registry', 'allergenFlow']) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (id === 'profile') {
      el.classList.toggle('on', where === 'profile');
      if (where !== 'profile') el.classList.remove('hidden');
    } else {
      el.classList.toggle('hidden', where !== id);
    }
  }
  document.getElementById('profile')?.classList.toggle('hidden', where !== 'profile');
  if (where === 'profile') setTab('history');
  window.scrollTo(0, 0);
}

function setTab(tab) {
  for (const el of document.querySelectorAll('.tab-content')) el.hidden = el.id !== tab;
  for (const btn of document.querySelectorAll('.side button')) btn.classList.toggle('active', btn.dataset.tab === tab);
}

function stub(name) {
  closeMenu();
  alert('Экран «' + name + '» пока не добавлен в HTML-макет.');
}

function resetForm() {
  for (const el of document.querySelectorAll('#application input')) {
    if (el.type === 'checkbox') el.checked = el.id === 'showPrice';
    else el.value = el.id === 'price' ? '0' : '';
  }
  document.getElementById('gender').value = '';
  document.getElementById('analysisList').innerHTML = '';
  analyses = 0;
  document.getElementById('requestFeedback').textContent = '';
}

function addAnalysis() {
  openAllergenFlow();
}

function saveRequest() {
  document.getElementById('requestFeedback').textContent = 'Демонстрационный макет: отправка заявки на сервер не подключена.';
}

function changePassword() {
  const a = document.getElementById('newPassword').value;
  const b = document.getElementById('repeatPassword').value;
  document.getElementById('passFeedback').textContent = !a ? 'Введите новый пароль' : a !== b ? 'Пароли не совпадают' : 'Демонстрационный макет: смена пароля на сервере не подключена.';
}

function saveBloodPrice() {
  const price = document.getElementById('bloodPrice').value;
  try { localStorage.setItem('demoBloodPrice', price); } catch (e) {}
  document.getElementById('bloodFeedback').textContent = 'Цена сохранена локально в браузере (демо).';
}

let saved = null;
try { saved = localStorage.getItem('demoBloodPrice'); } catch (e) {}
if (saved !== null) document.getElementById('bloodPrice').value = saved;
document.getElementById('foreign').addEventListener('change', e => {
  const i = document.getElementById('iin');
  i.disabled = e.target.checked;
  if (e.target.checked) i.value = '';
});

function openAllergenFlow() {
  navigate('allergenFlow');
  allergenFlowState.currentStep = 'categories';
  allergenFlowState.selectedAnalysis = null;
  allergenFlowState.selectedBiomaterial = null;
  allergenFlowState.selectedTab = 'dust';
  allergenFlowState.selectedItemId = null;
  allergenFlowState.selectedTurnaroundId = 'same-day';
  allergenFlowState.pendingAnalysis = null;
  renderAllergenFlow();
}

function closeAllergenFlowToRequest() {
  closeBiomaterialModal();
  navigate('application');
}

function backToAnalysisSelection() {
  allergenFlowState.currentStep = 'categories';
  allergenFlowState.selectedItemId = null;
  document.getElementById('allergenFlowFeedback').textContent = '';
  renderAllergenFlow();
}

function renderAllergenFlow() {
  renderAnalysisCards();
  renderTabs();
  renderAllergenItems();
  renderTurnaroundOptions();
  document.getElementById('allergenStepCategories').classList.toggle('hidden', allergenFlowState.currentStep !== 'categories');
  document.getElementById('allergenStepList').classList.toggle('hidden', allergenFlowState.currentStep !== 'list');
  const backLink = document.getElementById('backToAnalysisSelect');
  backLink.classList.toggle('visible', allergenFlowState.currentStep === 'list');
  if (window.i18n?.refresh) window.i18n.refresh();
}

function renderAnalysisCards() {
  const wrap = document.getElementById('analysisCards');
  if (!wrap) return;
  wrap.innerHTML = '';
  analysisCatalog.forEach(item => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'analysis-card';
    btn.innerHTML = `<span>${item.label}</span>`;
    btn.addEventListener('click', () => selectAnalysis(item.id));
    wrap.appendChild(btn);
  });
}

function renderTabs() {
  const wrap = document.getElementById('allergenTabs');
  if (!wrap) return;
  wrap.innerHTML = '';
  allergenTabsData.forEach(tab => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'allergen-tab' + (tab.id === allergenFlowState.selectedTab ? ' active' : '');
    btn.textContent = tab.label;
    btn.addEventListener('click', () => {
      allergenFlowState.selectedTab = tab.id;
      allergenFlowState.selectedItemId = null;
      renderAllergenItems();
      if (window.i18n?.refresh) window.i18n.refresh();
    });
    wrap.appendChild(btn);
  });
}

function renderAllergenItems() {
  const wrap = document.getElementById('allergenItems');
  if (!wrap) return;
  wrap.innerHTML = '';
  const items = allergenItemsData[allergenFlowState.selectedTab] || [];
  items.forEach(item => {
    const row = document.createElement('label');
    row.className = 'allergen-row' + (item.id === allergenFlowState.selectedItemId ? ' active' : '');
    row.innerHTML = `
      <input type="checkbox" ${item.id === allergenFlowState.selectedItemId ? 'checked' : ''} />
      <div>
        <div class="allergen-row-title">${item.title}</div>
        <div class="allergen-row-sub">${item.subtitle}</div>
      </div>`;
    row.addEventListener('click', (event) => {
      event.preventDefault();
      allergenFlowState.selectedItemId = item.id;
      renderAllergenItems();
      if (window.i18n?.refresh) window.i18n.refresh();
    });
    wrap.appendChild(row);
  });
}

function renderTurnaroundOptions() {
  const wrap = document.getElementById('turnaroundList');
  if (!wrap) return;
  wrap.innerHTML = '';
  turnaroundOptionsData.forEach(option => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'turnaround-option' + (option.id === allergenFlowState.selectedTurnaroundId ? ' active' : '');
    btn.textContent = option.label;
    btn.addEventListener('click', () => {
      allergenFlowState.selectedTurnaroundId = option.id;
      renderTurnaroundOptions();
      if (window.i18n?.refresh) window.i18n.refresh();
    });
    wrap.appendChild(btn);
  });
}

function selectAnalysis(analysisId) {
  const analysis = analysisCatalog.find(item => item.id === analysisId);
  if (!analysis) return;
  allergenFlowState.selectedAnalysis = analysisId;
  allergenFlowState.selectedTab = analysis.defaultTab || 'dust';
  allergenFlowState.selectedItemId = null;
  document.getElementById('allergenFlowFeedback').textContent = '';
  if (analysis.biomaterialRequired) {
    allergenFlowState.pendingAnalysis = analysisId;
    openBiomaterialModal();
  } else {
    allergenFlowState.selectedBiomaterial = null;
    allergenFlowState.currentStep = 'list';
    renderAllergenFlow();
  }
}

function openBiomaterialModal() {
  const optionsWrap = document.getElementById('biomaterialOptions');
  optionsWrap.innerHTML = '';
  biomaterialOptionsData.forEach((option, index) => {
    const label = document.createElement('label');
    label.className = 'biomaterial-option';
    label.innerHTML = `<input type="radio" name="biomaterialChoice" value="${option.id}" ${index === 0 ? 'checked' : ''}><span>${option.label}</span>`;
    optionsWrap.appendChild(label);
  });
  document.getElementById('biomaterialModal').classList.remove('hidden');
  if (window.i18n?.refresh) window.i18n.refresh();
}

function closeBiomaterialModal() {
  document.getElementById('biomaterialModal')?.classList.add('hidden');
}

function confirmBiomaterialSelection() {
  const selected = document.querySelector('input[name="biomaterialChoice"]:checked');
  if (!selected) return;
  allergenFlowState.selectedBiomaterial = selected.value;
  allergenFlowState.currentStep = 'list';
  closeBiomaterialModal();
  renderAllergenFlow();
}

function getSelectedData() {
  const analysis = analysisCatalog.find(item => item.id === allergenFlowState.selectedAnalysis);
  const biomaterial = biomaterialOptionsData.find(item => item.id === allergenFlowState.selectedBiomaterial);
  const turnaround = turnaroundOptionsData.find(item => item.id === allergenFlowState.selectedTurnaroundId);
  const selectedItem = (allergenItemsData[allergenFlowState.selectedTab] || []).find(item => item.id === allergenFlowState.selectedItemId);
  return { analysis, biomaterial, turnaround, selectedItem };
}

function addSelectedAllergenToRequest() {
  const { analysis, biomaterial, turnaround, selectedItem } = getSelectedData();
  const feedback = document.getElementById('allergenFlowFeedback');
  if (!selectedItem) {
    feedback.textContent = 'Сначала выберите аллерген из списка.';
    if (window.i18n?.refresh) window.i18n.refresh();
    return;
  }
  analyses += 1;
  const chip = document.createElement('span');
  chip.className = 'analysis-chip';
  const parts = [selectedItem.title, analysis?.label, turnaround?.label, biomaterial?.label].filter(Boolean);
  chip.textContent = parts.join(' · ') + ' ×';
  chip.title = 'Нажмите, чтобы удалить';
  chip.onclick = () => chip.remove();
  document.getElementById('analysisList').append(chip);
  feedback.textContent = 'Аллерген добавлен в заявку.';
  closeAllergenFlowToRequest();
  document.getElementById('requestFeedback').textContent = 'Аллерген добавлен в заявку (демо).';
  if (window.i18n?.refresh) window.i18n.refresh();
}

document.getElementById('confirmBiomaterialButton')?.addEventListener('click', confirmBiomaterialSelection);
document.getElementById('cancelBiomaterialButton')?.addEventListener('click', closeBiomaterialModal);
document.getElementById('addSelectedAllergenButton')?.addEventListener('click', addSelectedAllergenToRequest);

document.getElementById('biomaterialModal')?.addEventListener('click', (event) => {
  if (event.target.id === 'biomaterialModal') closeBiomaterialModal();
});
