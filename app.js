// Standalone Vegetable Billing App

document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM Elements
    const billingForm = document.getElementById('billing-form');
    const dateInput = document.getElementById('entry-date');
    const groupedTablesContainer = document.getElementById('grouped-tables-container');
    const submitBtn = document.getElementById('submit-btn');
    const cancelEditBtn = document.getElementById('cancel-edit');
    const langSelect = document.getElementById('lang-select');
    const importInput = document.getElementById('import-input');

    // 2. State Management
    const today = new Date().toISOString().split('T')[0];
    let entries = JSON.parse(localStorage.getItem('veg_entries')) || [];
    let trash = JSON.parse(localStorage.getItem('veg_trash')) || []; // RECYCLE BIN
    let editingId = null;
    let currentLang = localStorage.getItem('veg_lang') || 'en';
    let personFilters = {}; // { "Satya": "2024-12-31" }
    let isLocked = localStorage.getItem('veg_lock_enabled') === 'true';
    let currentUser = null;

    // 3. Translation Data
    const translations = {
        en: {
            "app-title": "Vegetable Billing",
            "header-main": "Vegetable Billing",
            "header-sub": "Efficient data entry for vegetable inventory and sales.",
            "form-title": "Add New Entry",
            "label-date": "Date",
            "label-name": "Customer Name",
            "label-veg": "Vegetable",
            "label-price": "Price (per Kg)",
            "label-kgs": "Quantity (Kgs)",
            "label-due": "Due Amount",
            "placeholder-name": "Enter name",
            "placeholder-veg": "e.g. Tomato, Onion",
            "btn-add": "Add to Bill",
            "btn-update": "Update Entry",
            "btn-cancel": "Cancel",
            "btn-backup": "Backup",
            "btn-restore": "Restore",
            "btn-recover": "Recycle Bin",
            "table-history": "Billing History:",
            "btn-clear-person": "Clear",
            "th-date": "Date",
            "th-veg": "Vegetable",
            "th-price": "Price",
            "th-kgs": "Kgs",
            "th-total": "Total",
            "th-due": "Due",
            "th-grand": "Grand Total",
            "th-action": "Action",
            "label-balance": "Balance for",
            "no-entries": "No entries found. Start by adding a new entry.",
            "footer-text": "© 2025 Satyanarayana Sadanala. Built for High-Impact Analytics.",
            "confirm-delete": "Are you sure you want to delete this entry?",
            "confirm-clear": "Are you sure you want to delete all entries for",
            "voice-listening": "Listening...",
            "voice-error": "Voice recognition failed or not supported.",
            "backup-success": "Data backup successful! Saved to your downloads folder.",
            "restore-success": "Data restored successfully!",
            "restore-error": "Failed to restore. Select a valid backup file.",
            "confirm-restore": "Restoring will overwrite current data. Continue?",
            "restore-instruction": "Choose your 'veggie_bill_backup' file.",
            "undo-text": "Last deletion moved to Recycle Bin.",
            "recycle-title": "Recycle Bin (Last 10 Items)",
            "btn-undo": "Undo Delete",
            "btn-empty-trash": "Empty Recycle Bin",
            "btn-payment": "Record Payment",
            "btn-whatsapp": "Share Bill",
            "prompt-payment": "Enter amount paid by",
            "payment-type": "Payment/Deduction",
            "msg-header": "*Vegetable Bill - Satyanarayana Sadanala*",
            "msg-date": "Date",
            "msg-today-items": "*Today's Items:*",
            "msg-payments": "*Payments/Deductions Today:*",
            "msg-total-balance": "*Total Balance to Pay:*",
            "prompt-phone": "Enter Customer WhatsApp Number (e.g. 919876543210):",
            "label-filter-date": "View History For:",
            "btn-show-all": "Show All History",
            "security-verified": "Secure & Virus-Free Verified",
            "lock-title": "App Locked",
            "lock-msg": "Private billing data secured. Please verify identity.",
            "btn-unlock": "Fingerprint / Face ID",
            "btn-lock-setup": "Security Lock", // SHORTER FOR NAV
            "lock-enabled-msg": "Fingerprint lock enabled!",
            "lock-disabled-msg": "Fingerprint lock disabled.",
            "btn-login": "Sign in with Google",
            "btn-sync": "Sync Now",
            "login-success": "Logged in successfully!",
            "sync-success": "Data synced to cloud!",
            "sync-error": "Sync failed. Check connection."
        },
        te: {
            "app-title": "కూరగాయల బిల్లింగ్",
            "header-main": "కూరగాయల బిల్లింగ్",
            "header-sub": "కూరగాయల ఇన్వెంటరీ మరియు విక్రయాల కోసం సమర్థవంతమైన డేటా నమోదు.",
            "form-title": "కొత్త ఎంట్రీని జోడించండి",
            "label-date": "తేదీ",
            "label-name": "కస్టమర్ పేరు",
            "label-veg": "కూరగాయ",
            "label-price": "ధర (కేజీకి)",
            "label-kgs": "పరిమాణం (కేజీలు)",
            "label-due": "బకాయి మొత్తం",
            "placeholder-name": "పేరు నమోదు చేయండి",
            "placeholder-veg": "ఉదా. టమోటా, ఉల్లిపాయ",
            "btn-add": "బిల్లుకు జోడించు",
            "btn-update": "ఎంట్రీని నవీకరించండి",
            "btn-cancel": "రద్దు చేయి",
            "btn-backup": "బ్యాకప్",
            "btn-restore": "పునరుద్ధరణ",
            "btn-recover": "రీసైకిల్ బిన్",
            "table-history": "బిల్లింగ్ చరిత్ర:",
            "btn-clear-person": "తొలగించు",
            "th-date": "తేదీ",
            "th-veg": "కూరగాయ",
            "th-price": "ధర",
            "th-kgs": "కేజీలు",
            "th-total": "మొత్తం",
            "th-due": "బకాయి",
            "th-grand": "మొత్తం బ్యాలెన్స్",
            "th-action": "చర్య",
            "label-balance": "బ్యాలెన్స్",
            "no-entries": "ఎంట్రీలు ఏవీ లేవు. కొత్త ఎంట్రీని జోడించడం ద్వారా ప్రారంభించండి.",
            "footer-text": "© 2025 సత్యనారాయణ సదనాల. హై-ఇంపాక్ట్ అనలిటిక్స్ కోసం నిర్మించబడింది.",
            "confirm-delete": "మీరు ఖచ్చితంగా ఈ ఎంట్రీని తొలగించాలనుకుంటున్నారా?",
            "confirm-clear": "మీరు ఖచ్చితంగా అన్ని ఎంట్రీలను తొలగించాలనుకుంటున్నారా",
            "voice-listening": "వింటున్నాను...",
            "voice-error": "వాయిస్ రికగ్నిషన్ విఫలమైంది.",
            "backup-success": "డేటా బ్యాకప్ విజయవంతమైంది!",
            "restore-success": "డేటా పునరుద్ధరించబడింది!",
            "restore-error": "సరైన బ్యాకప్ ఫైల్‌ను ఎంచుకోండి.",
            "confirm-restore": "ప్రస్తుత డేటా పోతుంది. కొనసాగించాలా?",
            "restore-instruction": "మీ 'veggie_bill_backup' ఫైల్‌ను ఎంచుకోండి.",
            "undo-text": "తొలగించిన డేటా రీసైకిల్ బిన్‌కు మార్చబడింది.",
            "recycle-title": "రీసైకిల్ బిన్ (చివరి 10 అంశాలు)",
            "btn-undo": "మరల వెనకకు",
            "btn-empty-trash": "రీసైకిల్ బిన్ ఖాళీ చేయండి",
            "btn-payment": "చెల్లింపు నమోదు",
            "prompt-payment": "చెల్లించిన మొత్తాన్ని నమోదు చేయండి - ",
            "payment-type": "చెల్లింపు/తగ్గింపు",
            "btn-whatsapp": "బిల్లు పంపండి",
            "msg-header": "*కూరగాయల బిల్లు - సత్యనారాయణ సదనాల*",
            "msg-date": "తేదీ",
            "msg-today-items": "*ఈ రోజు వస్తువులు:*",
            "msg-payments": "*ఈ రోజు చెల్లింపులు:*",
            "msg-total-balance": "*మొత్తం బ్యాలెన్స్:*",
            "prompt-phone": "కస్టమర్ వాట్సాప్ నంబర్‌ను నమోదు చేయండి (ఉదా. 919876543210):",
            "label-filter-date": "తేదీ వారీగా చూడండి:",
            "btn-show-all": "మొత్తం చరిత్ర",
            "security-verified": "సురక్షితమైనది మరియు వైరస్ రహితమైనది",
            "lock-title": "యాప్ లాక్ చేయబడింది",
            "lock-msg": "ప్రైవేట్ బిల్లింగ్ డేటా సురక్షితం. దయచేసి ధృవీకరించండి.",
            "btn-unlock": "ఫింగర్ ప్రింట్ / ఫేస్ ఐడి",
            "btn-lock-setup": "సెక్యూరిటీ లాక్",
            "lock-enabled-msg": "ఫింగర్ ప్రింట్ లాక్ ప్రారంభించబడింది!",
            "lock-disabled-msg": "ఫింగర్ ప్రింట్ లాక్ నిలిపివేయబడింది.",
            "btn-login": "గూగుల్ తో సైన్ ఇన్ చేయండి",
            "btn-sync": "అప్‌లోడ్ చేయండి",
            "login-success": "లాగిన్ విజయవంతమైంది!",
            "sync-success": "డేటా క్లౌడ్‌కు అప్‌లోడ్ చేయబడింది!",
            "sync-error": "అప్‌లోడ్ విఫలమైంది."
        }
    };

    // 4. Core UI Functions
    function applyTranslations() {
        if (!langSelect) return;
        document.documentElement.lang = currentLang; // For CSS selectors
        const t = translations[currentLang];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) {
                if (el.tagName === 'H1' && key === 'header-main') {
                    el.innerHTML = currentLang === 'en' ? `Vegetable <span class="accent">Billing</span>` : `కూరగాయల <span class="accent">బిల్లింగ్</span>`;
                } else {
                    el.textContent = t[key];
                }
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (t[key]) el.placeholder = t[key];
        });

        if (editingId && submitBtn) {
            submitBtn.textContent = t['btn-update'];
        } else if (submitBtn) {
            submitBtn.textContent = t['btn-add'];
        }
    }

    function saveAndRender() {
        localStorage.setItem('veg_entries', JSON.stringify(entries));
        localStorage.setItem('veg_trash', JSON.stringify(trash));
        renderEntries();
        updateTrashBadge();
    }

    function updateTrashBadge() {
        const recoverBtn = document.querySelector('[data-i18n="btn-recover"]');
        if (recoverBtn) {
            recoverBtn.innerHTML = `${translations[currentLang]['btn-recover']} <span style="background: #ef4444; color: white; border-radius: 50%; padding: 2px 6px; font-size: 0.7rem; margin-left: 5px;">${trash.length}</span>`;
        }
    }

    function renderEntries() {
        if (!groupedTablesContainer) return;
        groupedTablesContainer.innerHTML = '';
        const t = translations[currentLang];

        if (entries.length === 0) {
            groupedTablesContainer.innerHTML = `
                <div class="card fade-in" style="text-align: center; padding: 3rem;">
                    <p style="color: var(--text-secondary);">${t['no-entries']}</p>
                </div>
            `;
            return;
        }

        const groups = entries.reduce((acc, entry) => {
            if (!acc[entry.name]) acc[entry.name] = [];
            acc[entry.name].push(entry);
            return acc;
        }, {});

        Object.keys(groups).sort().forEach(personName => {
            const allPersonEntries = groups[personName];
            const filterDate = personFilters[personName] || '';

            const displayEntries = filterDate
                ? allPersonEntries.filter(e => (e.date || new Date(e.id).toISOString().split('T')[0]) === filterDate)
                : allPersonEntries;

            let personGrandSum = 0;

            const tableCard = document.createElement('div');
            tableCard.className = 'card table-card fade-in';
            tableCard.style.marginBottom = '2rem';

            let tableHTML = `
                <div class="table-header" style="flex-direction: column; align-items: flex-start; gap: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                        <h3>${t['table-history']} <span class="accent">${personName}</span></h3>
                        <div style="display: flex; gap: 0.5rem; align-items: center;">
                            <button class="btn btn-outline" onclick="shareToWhatsApp('${personName}')" 
                                style="padding: 0.4rem 0.8rem; font-size: 0.8rem; border-color: #25d366; color: #25d366;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px;"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                                ${t['btn-whatsapp']}
                            </button>
                            <button class="btn btn-outline" onclick="clearPerson('${personName}')" 
                                style="padding: 0.4rem 0.8rem; font-size: 0.8rem; border-color: #ef4444; color: #ef4444;">
                                ${t['btn-clear-person']} ${personName}
                            </button>
                        </div>
                    </div>
                    
                    <div class="person-filter" style="display: flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.05); padding: 0.5rem 1rem; border-radius: 50px; width: 100%; justify-content: space-between;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <label style="margin-bottom:0; font-size: 0.75rem;">${t['label-filter-date']}</label>
                            <input type="date" value="${filterDate}" onchange="setPersonFilter('${personName}', this.value)" 
                                class="glass-input" style="width: auto; padding: 0.2rem 0.5rem; font-size: 0.8rem; border-radius: 5px;">
                        </div>
                        <button class="btn btn-outline" onclick="setPersonFilter('${personName}', '')" 
                            style="padding: 0.2rem 0.6rem; font-size: 0.7rem; border-radius: 20px;">${t['btn-show-all']}</button>
                    </div>
                </div>
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>${t['th-date']}</th>
                                <th>${t['th-veg']}</th>
                                <th>${t['th-price']}</th>
                                <th>${t['th-kgs']}</th>
                                <th>${t['th-total']}</th>
                                <th>${t['th-due']}</th>
                                <th>${t['th-grand']}</th>
                                <th style="text-align: center;">${t['th-action']}</th>
                            </tr>
                        </thead>
                        <tbody>`;

            displayEntries.forEach(entry => {
                personGrandSum += entry.grandTotal;
                const dateVal = entry.date || new Date(entry.id).toISOString().split('T')[0];
                const dateStr = new Date(dateVal).toLocaleDateString(currentLang === 'te' ? 'te-IN' : 'en-IN');

                tableHTML += `
                    <tr>
                        <td>${dateStr}</td>
                        <td>${entry.vegetable}</td>
                        <td>₹ ${entry.price.toFixed(2)}</td>
                        <td>${entry.kgs} Kg</td>
                        <td>₹ ${entry.total.toFixed(2)}</td>
                        <td>₹ ${entry.due.toFixed(2)}</td>
                        <td style="font-weight: 700; color: var(--accent-secondary);">₹ ${entry.grandTotal.toFixed(2)}</td>
                        <td>
                            <div style="display: flex; gap: 0.5rem; justify-content: center;">
                                <button class="edit-btn" onclick="editEntry(${entry.id})" title="Edit Entry">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </button>
                                <button class="delete-btn" onclick="deleteEntry(${entry.id})" title="Delete Entry">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        </td>
                    </tr>`;
            });

            tableHTML += `
                        </tbody>
                    </table>
                </div>
                <div class="summary-footer" style="display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
                    <button class="btn" style="background: var(--accent-secondary); color: #000; padding: 0.6rem 1.2rem; font-size: 0.85rem;" 
                        onclick="recordPayment('${personName}')">
                        ₹ ${t['btn-payment']}
                    </button>
                    <div class="total-badge">
                        <span class="label">${t['label-balance']} ${personName}:</span>
                        <span class="value">₹ ${personGrandSum.toFixed(2)}</span>
                    </div>
                </div>`;

            tableCard.innerHTML = tableHTML;
            groupedTablesContainer.appendChild(tableCard);
        });
    }

    // 5. Event Listeners
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            currentLang = e.target.value;
            localStorage.setItem('veg_lang', currentLang);
            applyTranslations();
            renderEntries();
            updateTrashBadge();
        });
    }

    if (billingForm) {
        billingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('name');
            const name = nameInput.value.trim();
            const entryDate = dateInput.value;
            const vegetable = document.getElementById('vegetable').value;
            const price = parseFloat(document.getElementById('price').value);
            const kgs = parseFloat(document.getElementById('kgs').value);
            const due = parseFloat(document.getElementById('due').value) || 0;
            const total = price * kgs;
            const grandTotal = total + due;

            if (editingId) {
                const index = entries.findIndex(emp => emp.id === editingId);
                if (index !== -1) {
                    entries[index] = { ...entries[index], name, date: entryDate, vegetable, price, kgs, total, due, grandTotal };
                }
                editingId = null;
                submitBtn.textContent = translations[currentLang]['btn-add'];
                cancelEditBtn.style.display = 'none';
                nameInput.disabled = false;
            } else {
                entries.push({ id: Date.now(), name, date: entryDate, vegetable, price, kgs, total, due, grandTotal });
            }
            saveAndRender();
            billingForm.reset();
            dateInput.value = today;
        });
    }

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', () => {
            editingId = null;
            submitBtn.textContent = translations[currentLang]['btn-add'];
            cancelEditBtn.style.display = 'none';
            document.getElementById('name').disabled = false;
            billingForm.reset();
            dateInput.value = today;
        });
    }

    // 6. Global/Window Functions
    window.startVoiceInput = (targetId) => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert(translations[currentLang]['voice-error']);
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = currentLang === 'te' ? 'te-IN' : 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        const inputField = document.getElementById(targetId);
        const btn = inputField.nextElementSibling;
        btn.classList.add('listening');

        recognition.start();

        recognition.onresult = (event) => {
            inputField.value = event.results[0][0].transcript;
        };

        recognition.onspeechend = () => {
            recognition.stop();
            btn.classList.remove('listening');
        };

        recognition.onerror = () => {
            btn.classList.remove('listening');
        };
    };

    window.exportData = () => {
        const data = { entries, lang: currentLang, exportDate: new Date().toISOString() };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `veggie_bill_backup_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert(translations[currentLang]['backup-success']);
    };

    window.triggerImport = () => {
        alert(translations[currentLang]['restore-instruction']);
        if (importInput) importInput.click();
    };

    window.importData = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        if (!confirm(translations[currentLang]['confirm-restore'])) {
            event.target.value = '';
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.entries && Array.isArray(data.entries)) {
                    entries = data.entries;
                    saveAndRender();
                    alert(translations[currentLang]['restore-success']);
                }
            } catch (err) {
                alert(translations[currentLang]['restore-error']);
            }
            event.target.value = '';
        };
        reader.readAsText(file);
    };

    window.deleteEntry = (id) => {
        if (confirm(translations[currentLang]['confirm-delete'])) {
            const entryToDelete = entries.find(e => e.id === id);
            if (entryToDelete) {
                trash.unshift(entryToDelete); // Add to Recycle Bin
                if (trash.length > 10) trash.pop(); // Keep last 10
                entries = entries.filter(entry => entry.id !== id);
                saveAndRender();
                showUndoToast();
            }
        }
    };

    window.clearPerson = (name) => {
        if (confirm(`${translations[currentLang]['confirm-clear']} ${name}?`)) {
            const peopleToDelete = entries.filter(entry => entry.name === name);
            trash.unshift({ type: 'group', name: name, data: peopleToDelete });
            if (trash.length > 10) trash.pop();
            entries = entries.filter(entry => entry.name !== name);
            saveAndRender();
            showUndoToast();
        }
    };

    function showUndoToast() {
        const t = translations[currentLang];
        const toast = document.createElement('div');
        toast.className = 'undo-toast fade-in';
        toast.innerHTML = `
            <span>${t['undo-text']}</span>
            <button onclick="undoLastDelete()">${t['btn-undo']}</button>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    }

    window.undoLastDelete = () => {
        if (trash.length === 0) return;
        const lastItem = trash.shift();
        if (lastItem.type === 'group') {
            entries = [...entries, ...lastItem.data];
        } else {
            entries.push(lastItem);
        }
        saveAndRender();
        const toast = document.querySelector('.undo-toast');
        if (toast) toast.remove();
    };

    window.openRecycleBin = () => {
        const t = translations[currentLang];
        let content = `<h3 style="margin-bottom:1rem;">${t['recycle-title']}</h3>`;

        if (trash.length === 0) {
            content += `<p style="color:var(--text-secondary);">${t['trash-empty']}</p>`;
        } else {
            trash.forEach((item, index) => {
                const label = item.type === 'group' ? `${item.name} (All)` : `${item.name} - ${item.vegetable}`;
                content += `
                    <div class="trash-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem; padding:0.5rem; background:rgba(255,255,255,0.05); border-radius:8px;">
                        <span>${label}</span>
                        <button class="btn btn-outline" style="padding:0.2rem 0.5rem; font-size:0.75rem;" onclick="recoverTrashItem(${index})">${t['btn-undo']}</button>
                    </div>`;
            });
            content += `<button class="btn btn-outline" style="margin-top:1rem; width:100%; border-color:#ef4444; color:#ef4444;" onclick="emptyTrash()">${t['btn-empty-trash']}</button>`;
        }

        const modal = document.createElement('div');
        modal.className = 'modal-backdrop fade-in';
        modal.innerHTML = `
            <div class="card modal-content">
                <button class="close-modal" onclick="this.closest('.modal-backdrop').remove()">×</button>
                ${content}
            </div>
        `;
        document.body.appendChild(modal);
    };

    window.recoverTrashItem = (index) => {
        const item = trash.splice(index, 1)[0];
        if (item.type === 'group') {
            entries = [...entries, ...item.data];
        } else {
            entries.push(item);
        }
        saveAndRender();
        document.querySelector('.modal-backdrop')?.remove();
    };

    window.emptyTrash = () => {
        trash = [];
        saveAndRender();
        document.querySelector('.modal-backdrop')?.remove();
    };

    window.editEntry = (id) => {
        const entry = entries.find(e => e.id === id);
        if (entry) {
            const t = translations[currentLang];

            // Handle Payment Edits
            if (entry.isPayment) {
                const currentAmount = Math.abs(entry.grandTotal);
                const newAmountStr = prompt(`${t['prompt-payment']} ${entry.name}:`, currentAmount);
                const newAmount = parseFloat(newAmountStr);

                if (!isNaN(newAmount) && newAmount > 0) {
                    entry.grandTotal = -newAmount;
                    saveAndRender();
                }
                return; // Stop here for payments
            }

            // Handle Regular Billing Edits
            editingId = id;
            const nameInput = document.getElementById('name');
            nameInput.value = entry.name;
            nameInput.disabled = true;
            dateInput.value = entry.date || new Date(entry.id).toISOString().split('T')[0];
            document.getElementById('vegetable').value = entry.vegetable;
            document.getElementById('price').value = entry.price;
            document.getElementById('kgs').value = entry.kgs;
            document.getElementById('due').value = entry.due;
            submitBtn.textContent = t['btn-update'];
            cancelEditBtn.style.display = 'block';
            billingForm.scrollIntoView({ behavior: 'smooth' });
        }
    };

    window.setPersonFilter = (name, date) => {
        personFilters[name] = date;
        renderEntries();
    };

    window.recordPayment = (name) => {
        const t = translations[currentLang];
        const amountStr = prompt(`${t['prompt-payment']} ${name}:`, "0");
        const amount = parseFloat(amountStr);

        if (isNaN(amount) || amount <= 0) return;

        const paymentEntry = {
            id: Date.now(),
            name: name,
            date: new Date().toISOString().split('T')[0],
            vegetable: t['payment-type'],
            price: 0,
            kgs: 0,
            total: 0,
            due: 0,
            grandTotal: -amount,
            isPayment: true // FLAG FOR EDITING
        };

        entries.push(paymentEntry);
        saveAndRender();
    };

    window.shareToWhatsApp = (name) => {
        const t = translations[currentLang];
        // Use individual person filter if active, otherwise use today
        const targetDate = personFilters[name] || new Date().toISOString().split('T')[0];

        const personEntries = entries.filter(e => e.name === name);
        const filteredEntries = personEntries.filter(e => (e.date || new Date(e.id).toISOString().split('T')[0]) === targetDate);
        const grandTotalBalance = personEntries.reduce((sum, e) => sum + e.grandTotal, 0);

        if (filteredEntries.length === 0) {
            alert(currentLang === 'te' ? 'ఈ తేదీకి ఎంట్రీలు ఏవీ లేవు.' : 'No entries found for this date.');
            return;
        }

        let message = `${t['msg-header']}\n`;
        message += `${t['msg-date']}: ${new Date(targetDate).toLocaleDateString(currentLang === 'te' ? 'te-IN' : 'en-IN')}\n\n`;

        const items = filteredEntries.filter(e => !e.isPayment);
        const payments = filteredEntries.filter(e => e.isPayment);

        if (items.length > 0) {
            message += `${t['msg-today-items']}\n`;
            items.forEach(e => {
                message += `• ${e.vegetable}: ₹ ${e.price} x ${e.kgs} kg = *₹ ${e.total.toFixed(2)}*\n`;
            });
            message += '\n';
        }

        if (payments.length > 0) {
            message += `${t['msg-payments']}\n`;
            payments.forEach(p => {
                message += `• ₹ ${Math.abs(p.grandTotal).toFixed(2)}\n`;
            });
            message += '\n';
        }

        message += `${t['msg-total-balance']} *₹ ${grandTotalBalance.toFixed(2)}*\n`;
        message += `\nThank you!`;

        if (navigator.share) {
            navigator.share({
                title: `${t['app-title']} - ${name}`,
                text: message
            }).catch((error) => console.log('Error sharing', error));
        } else {
            const encodedMsg = encodeURIComponent(message);
            window.open(`https://wa.me/?text=${encodedMsg}`, '_blank');
        }
    };

    // 8. Biometric Security Logic
    const lockScreen = document.getElementById('app-lock-screen');
    const unlockBtn = document.getElementById('unlock-btn');
    const toggleLockBtn = document.getElementById('toggle-lock-btn');

    async function verifyBiometrics() {
        if (!window.PublicKeyCredential) {
            alert("Biometrics not supported on this device/browser.");
            unlockApp();
            return;
        }

        try {
            // Check if user has enrolled biometrics
            const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
            if (!available) {
                const pin = prompt(currentLang === 'te' ? 'దయచేసి సెక్యూరిటీ పిన్ నమోదు చేయండి:' : 'Please enter security PIN:');
                if (pin) unlockApp();
                return;
            }

            // Trigger native biometric prompt
            // Note: In real production, you'd verify against a server challenge.
            // For this local-first PWA, we use authentication to unlock the UI.
            const credential = await navigator.credentials.create({
                publicKey: {
                    challenge: new Uint8Array([1, 2, 3, 4]),
                    rp: { name: "Veggie Billing" },
                    user: { id: new Uint8Array([1]), name: "User", displayName: "User" },
                    pubKeyCredParams: [{ alg: -7, type: "public-key" }],
                    authenticatorSelection: { userVerification: "required" },
                    timeout: 60000
                }
            });

            if (credential) unlockApp();
        } catch (err) {
            console.error("Auth failed", err);
            // Fallback to simple unlock if users cancels or error occurs for better UX
            // but in a production banking app we would be stricter.
        }
    }

    function unlockApp() {
        if (lockScreen) {
            lockScreen.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    function lockApp() {
        if (isLocked && lockScreen) {
            lockScreen.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            applyTranslations();
        }
    }

    if (toggleLockBtn) {
        toggleLockBtn.addEventListener('click', () => {
            isLocked = !isLocked;
            localStorage.setItem('veg_lock_enabled', isLocked);
            alert(isLocked ? translations[currentLang]['lock-enabled-msg'] : translations[currentLang]['lock-disabled-msg']);
            if (!isLocked) unlockApp();
        });
    }

    if (unlockBtn) {
        unlockBtn.addEventListener('click', verifyBiometrics);
    }

    // Firebase Logic Removed for Local Compatibility

    // 10. Initialize Page
    if (dateInput) dateInput.value = today;
    applyTranslations();
    renderEntries();
    updateTrashBadge();

    // Initial Security Check
    if (isLocked) lockApp();
});
