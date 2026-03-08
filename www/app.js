/**
 * app.js - Main Application Logic
 * Handles Authentication, UI switching, LocalStorage/IndexedDB state, and Calculations.
 */

// --- Global State ---
let currentUser = null;
let currentLang = 'tr';
let isDarkTheme = true;
let isLoginMode = true; // true = Login view, false = Register view

// --- Translation Dictionary ---
const i18n = {
    tr: {
        username: "Kullanıcı Adı",
        email: "E-posta",
        password: "Şifre",
        login: "Giriş Yap",
        register: "Kayıt Ol",
        no_account: "Hesabınız yok mu?",
        has_account: "Zaten hesabınız var mı?",
        hello: "Merhaba,",
        tab_1ph: "Monofaze Motor (1Φ)",
        tab_3ph: "Trifaze Motor (3Φ)",
        tab_trafo: "Trafo / Pano",
        tab_kvar: "kVAR / Kompanzasyon",
        tab_history: "Kayıtlı İşler",
        nav_trafo: "Trafo",
        nav_history: "Geçmiş",
        voltage: "Gerilim (V)",
        power_kw: "Güç (kW)",
        current_a: "Akım (A)",
        power_factor: "Güç Faktörü (cosφ)",
        efficiency: "Verim (η) %",
        fill_any_two: "En az iki değeri girerek diğerlerini hesaplayabilirsiniz.",
        calculate: "Hesapla",
        trafo_power: "Trafo Gücü (kVA)",
        primary_v: "Primer (kV)",
        secondary_v: "Sekonder (V)",
        active_power: "Aktif Güç (kW)",
        current_pf: "Mevcut cosφ₁",
        target_pf: "Hedef cosφ₂",
        clear_all: "Tümünü Sil",
        all: "Tümü",
        no_history: "Henüz kayıtlı hesaplama yok.",
        save_calc: "Hesaplamayı Kaydet",
        job_category: "İş / Proje Adı (Kategori)",
        notes: "Notlar (Opsiyonel)",
        cancel: "İptal",
        save: "Kaydet",
        res_power: "Hesaplanan Güç",
        res_current: "Çekilen Akım",
        res_kva: "Görünür Güç (kVA)",
        res_kvar: "Reaktif Güç (kVAR)",
        res_cable: "Önerilen Kablo",
        res_cb: "Önerilen Şalter",
        res_pri_i: "Primer Akım",
        res_sec_i: "Sekonder Akım",
        res_q_req: "Gerekli Kondansatör (Qc)",
        res_cap_i: "Kondansatör Akımı",
        err_fill_two: "Lütfen en az 2 değeri doldurun (Gerilim dahil).",
        err_auth: "Kullanıcı adı veya şifre hatalı",
        tip_vfd: "AI Önerisi: Sürücü (VFD) kullanılacaksa ekranlı (shielded) kablo tercih edin.",
        tip_star: "AI Önerisi: Güç 5.5kW üzerinde, Yıldız-Üçgen veya Soft-Starter ile yol verin.",
        tip_pf: "AI Önerisi: cosφ değeri çok düşük (<0.85). Lokal kompanzasyon yapılması tavsiye edilir.",
        tab_yd: "Yıldız-Üçgen Kontaktör Seçimi",
        nav_yd: "Y-Δ",
        tab_vdrop: "Gerilim Düşümü",
        nav_vdrop: "V-Düşüm",
        tab_isc: "Kısa Devre Akımı",
        nav_isc: "K.Devre",
        tab_tools: "Araçlar",
        nav_tools: "Araçlar",
        use_efficiency: "Verim Dahil Edilsin mi?",
        busbar_calc: "Bakır Bara Seçim Hesaplayıcı",
        neutral_half: "Nötr Kesiti Yarısı (%50) mı?",
        tab_busbar: "Bakır Bara Seçimi",
        nav_busbar: "Bara"
    },
    en: {
        username: "Username",
        email: "Email",
        password: "Password",
        login: "Log In",
        register: "Register",
        no_account: "Don't have an account?",
        has_account: "Already have an account?",
        hello: "Hello,",
        tab_1ph: "Single-Phase Motor (1Φ)",
        tab_3ph: "Three-Phase Motor (3Φ)",
        tab_trafo: "Transformer / Panel",
        tab_kvar: "kVAR / PF Correction",
        tab_history: "Saved Jobs",
        nav_trafo: "Trafo",
        nav_history: "History",
        voltage: "Voltage (V)",
        power_kw: "Power (kW)",
        current_a: "Current (A)",
        power_factor: "Power Factor (cosφ)",
        efficiency: "Efficiency (η) %",
        fill_any_two: "Fill at least two values to calculate the others.",
        calculate: "Calculate",
        trafo_power: "Trafo Power (kVA)",
        primary_v: "Primary (kV)",
        secondary_v: "Secondary (V)",
        active_power: "Active Power (kW)",
        current_pf: "Current cosφ₁",
        target_pf: "Target cosφ₂",
        clear_all: "Clear All",
        all: "All",
        no_history: "No saved calculations yet.",
        save_calc: "Save Calculation",
        job_category: "Job / Project Name (Category)",
        notes: "Notes (Optional)",
        cancel: "Cancel",
        save: "Save",
        res_power: "Calculated Power",
        res_current: "Line Current",
        res_kva: "Apparent Power (kVA)",
        res_kvar: "Reactive Power (kVAR)",
        res_cable: "Rec. Cable Size",
        res_cb: "Rec. Breaker",
        res_pri_i: "Primary Current",
        res_sec_i: "Secondary Current",
        res_q_req: "Required Capacitor (Qc)",
        res_cap_i: "Capacitor Current",
        err_fill_two: "Please fill at least 2 values (including Voltage).",
        err_auth: "Invalid username or password",
        tip_vfd: "AI Tip: If using a VFD, prefer shielded cables.",
        tip_star: "AI Tip: Power > 5.5kW. Consider Star-Delta or Soft-Starter.",
        tip_pf: "AI Tip: Power factor is very low (<0.85). Local compensation recommended.",
        tab_yd: "Star-Delta Contactor Selection",
        nav_yd: "Y-Δ",
        tab_vdrop: "Voltage Drop",
        nav_vdrop: "V-Drop",
        tab_isc: "Short Circuit",
        nav_isc: "S.Circuit",
        tab_tools: "Tools",
        nav_tools: "Tools",
        use_efficiency: "Include Efficiency?",
        busbar_calc: "Copper Busbar Selection Calculator",
        neutral_half: "Neutral Cross-section Half (%50)?",
        tab_busbar: "Copper Busbar Selection",
        nav_busbar: "Busbar"
    }
};

const translate = (key) => i18n[currentLang][key] || key;

const applyTranslations = () => {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const k = el.getAttribute('data-i18n');
        if (el.tagName === 'INPUT' && el.type === 'button') {
            el.value = translate(k);
        } else {
            el.innerText = translate(k);
        }
    });
};

// --- Utils & Engineering Logic ---

// Standard Breaker Sizes (A) - Expanded for Transformers/Panels
const CB_SIZES = [2, 4, 6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 630, 800, 1000, 1250, 1600, 2000, 2500, 3200];

// Simplified IEC Cable Capacity (Cu, PVC)
const CABLES = [
    { size: '1.5', amps: 15 },
    { size: '2.5', amps: 21 },
    { size: '4', amps: 28 },
    { size: '6', amps: 36 },
    { size: '10', amps: 50 },
    { size: '16', amps: 68 },
    { size: '25', amps: 89 },
    { size: '35', amps: 110 },
    { size: '50', amps: 134 },
    { size: '70', amps: 171 },
    { size: '95', amps: 207 },
    { size: '120', amps: 239 },
    { size: '150', amps: 262 },
    { size: '185', amps: 296 },
    { size: '240', amps: 346 },
    { size: '300', amps: 394 }
];

const getBreaker = (current) => {
    const req = current * 1.25; // 25% safety margin
    for (let b of CB_SIZES) {
        if (b >= req) return b;
    }
    return '>630';
};

const getCable = (current) => {
    const req = current * 1.1; // 10% safety margin for continuous
    for (let c of CABLES) {
        if (c.amps >= req) {
            // Return size and loading %
            const loading = (req / c.amps) * 100;
            let color = 'green';
            if (loading > 80) color = 'yellow';
            if (loading > 95) color = 'red';
            return { size: c.size, color };
        }
    }
    return { size: 'Paralel Bağlantı Gerekli', color: 'red' };
};

// Badge helper
const badge = (text, color) => `<span class="badge badge-${color}">${text}</span>`;


// --- UI Controllers ---

const showScreen = (id) => {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'flex';
};

const switchTab = (targetId) => {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    document.getElementById(targetId).classList.add('active');
    document.querySelector(`.nav-item[data-target="${targetId}"]`).classList.add('active');
};


// --- Auth Logic ---

document.getElementById('btn-toggle-auth').addEventListener('click', () => {
    isLoginMode = !isLoginMode;
    document.getElementById('auth-title').innerText = isLoginMode ? translate('login') : translate('register');
    document.getElementById('btn-auth-submit').innerText = isLoginMode ? translate('login') : translate('register');
    document.getElementById('auth-toggle-text').innerHTML = isLoginMode
        ? `<span data-i18n="no_account">${translate('no_account')}</span> <button type="button" class="btn-text" id="btn-toggle-auth-inner"><span data-i18n="register">${translate('register')}</span></button>`
        : `<span data-i18n="has_account">${translate('has_account')}</span> <button type="button" class="btn-text" id="btn-toggle-auth-inner"><span data-i18n="login">${translate('login')}</span></button>`;

    document.getElementById('group-username').style.display = isLoginMode ? 'none' : 'flex';
    document.getElementById('auth-username').required = !isLoginMode;

    // Re-bind dynamic button
    document.getElementById('btn-toggle-auth-inner').addEventListener('click', () => {
        document.getElementById('btn-toggle-auth').click();
    });
});

document.getElementById('auth-form').addEventListener('submit', async (e) => {
    const email = document.getElementById('auth-email').value.trim();
    const pass = document.getElementById('auth-password').value.trim();
    const username = document.getElementById('auth-username').value.trim();
    const errEl = document.getElementById('auth-error');
    errEl.style.display = 'none';

    const { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, updateProfile } = window.firebaseAuth;

    if (isLoginMode) {
        // Login
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, pass);
            const user = userCredential.user;

            if (!user.emailVerified) {
                errEl.innerText = "Lütfen e-postanızı doğrulayın! Size bir doğrulama linki gönderdik.";
                errEl.style.display = 'block';
                await auth.signOut();
                return;
            }

            currentUser = user.displayName || user.email;
            loginSuccess();
        } catch (err) {
            console.error(err);
            errEl.innerText = "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.";
            errEl.style.display = 'block';
        }
    } else {
        // Register
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            const user = userCredential.user;

            // Set display name (username)
            await updateProfile(user, { displayName: username });

            // Send verification email
            try {
                await sendEmailVerification(user);
            } catch (emailErr) {
                console.error("Verification email failed:", emailErr);
                alert("Doğrulama e-postası gönderilemedi, lütfen e-posta adresinizi kontrol edin veya daha sonra tekrar deneyin.");
            }

            // Show verification notice
            document.getElementById('auth-form').style.display = 'none';
            document.getElementById('verify-notice').style.display = 'block';
            document.getElementById('verify-email-display').innerText = email;

        } catch (err) {
            console.error(err);
            errEl.innerText = "Kayıt başarısız: " + (err.message || "Bilinmeyen bir hata oluştu.");
            errEl.style.display = 'block';
        }
    }
});

// Resend verification
const resendBtn = document.getElementById('btn-resend-verify');
if (resendBtn) {
    resendBtn.addEventListener('click', async () => {
        const { auth, sendEmailVerification } = window.firebaseAuth;
        if (auth.currentUser) {
            try {
                await sendEmailVerification(auth.currentUser);
                alert("Doğrulama e-postası tekrar gönderildi.");
            } catch (err) {
                alert("Hata: " + err.message);
            }
        }
    });
}

// Back to login after registration
const backToLoginBtn = document.getElementById('btn-back-to-login');
if (backToLoginBtn) {
    backToLoginBtn.addEventListener('click', () => {
        document.getElementById('verify-notice').style.display = 'none';
        const authForm = document.getElementById('auth-form');
        if (authForm) authForm.style.display = 'flex';
        isLoginMode = true;
        const toggleBtn = document.getElementById('btn-toggle-auth');
        if (toggleBtn) toggleBtn.click(); // Sync UI state
    });
}

document.getElementById('btn-logout').addEventListener('click', async () => {
    const { auth, signOut } = window.firebaseAuth;
    await signOut(auth);
    currentUser = null;
    document.getElementById('auth-form').reset();
    showScreen('auth-screen');
});

const loginSuccess = () => {
    document.getElementById('display-username').innerText = currentUser;
    showScreen('app-screen');
    switchTab('tab-1ph');
    loadHistoryCategories();
    loadHistory();
    initEfficiencyToggles();
};

const initEfficiencyToggles = () => {
    const handleToggle = (toggleId, containerId) => {
        const toggle = document.getElementById(toggleId);
        const container = document.getElementById(containerId);
        if (toggle && container) {
            toggle.addEventListener('change', () => {
                if (toggle.checked) {
                    container.classList.remove('hidden');
                } else {
                    container.classList.add('hidden');
                }
            });
            // Init state
            if (!toggle.checked) container.classList.add('hidden');
        }
    };
    handleToggle('tog-1ph-eta', 'cont-1ph-eta');
    handleToggle('tog-3ph-eta', 'cont-3ph-eta');
};

// Check session on load with Firebase Listener
window.addEventListener('load', () => {
    // Wait for firebaseAuth to be available
    const checkAuth = setInterval(() => {
        if (window.firebaseAuth) {
            clearInterval(checkAuth);
            const { auth, onAuthStateChanged } = window.firebaseAuth;
            onAuthStateChanged(auth, (user) => {
                if (user && user.emailVerified) {
                    currentUser = user.displayName || user.email;
                    loginSuccess();
                } else {
                    showScreen('auth-screen');
                }
            });
        }
    }, 100);
});


// --- Top Header Logic ---
document.getElementById('btn-lang').addEventListener('click', (e) => {
    currentLang = currentLang === 'tr' ? 'en' : 'tr';
    e.target.innerText = currentLang.toUpperCase();
    applyTranslations();
});

document.getElementById('btn-theme').addEventListener('click', (e) => {
    isDarkTheme = !isDarkTheme;
    document.body.className = isDarkTheme ? 'theme-dark' : 'theme-light';
    e.currentTarget.innerHTML = isDarkTheme ? '<i class="ph ph-moon"></i>' : '<i class="ph ph-sun"></i>';
});


// --- Navigation ---
document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        switchTab(target);
        if (target === 'tab-history') {
            loadHistory();
            loadHistoryCategories();
        }
    });
});


// --- Calculators ---

let lastCalcResult = null; // Stores data for saving

// UI Helper for rendering results
const renderResult = (containerId, rows, tips = []) => {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    rows.forEach(r => {
        container.innerHTML += `
      <div class="res-row">
        <span class="res-label">${r.label}</span>
        <span class="res-value">${r.value}</span>
      </div>
    `;
    });

    tips.forEach(t => {
        container.innerHTML += `
      <div class="ai-tip">
        <i class="ph-fill ph-lightbulb"></i>
        <span>${t}</span>
      </div>
    `;
    });

    container.innerHTML += `
    <button class="btn btn-secondary btn-block mt-3" onclick="openSaveModal()">
      <i class="ph ph-floppy-disk"></i> ${translate('save_calc')}
    </button>
  `;
    container.classList.remove('hidden');
};

const openSaveModal = () => {
    if (!lastCalcResult) return;
    document.getElementById('save-modal').classList.remove('hidden');
};
document.getElementById('btn-modal-cancel').addEventListener('click', () => {
    document.getElementById('save-modal').classList.add('hidden');
});
document.getElementById('btn-modal-save').addEventListener('click', async () => {
    const category = document.getElementById('modal-cat').value.trim() || 'Genel Hesap.';
    const notes = document.getElementById('modal-notes').value.trim();

    lastCalcResult.username = currentUser;
    lastCalcResult.category = category;
    lastCalcResult.notes = notes;

    await window.dbAPI.saveCalculation(lastCalcResult);
    document.getElementById('save-modal').classList.add('hidden');
    alert("Hesaplama Kaydedildi!");
});


// 1. One-Phase Motor
document.getElementById('inp-1ph-p').addEventListener('input', () => document.getElementById('inp-1ph-i').value = '');
document.getElementById('inp-1ph-i').addEventListener('input', () => document.getElementById('inp-1ph-p').value = '');

document.getElementById('form-1ph').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = parseFloat(document.getElementById('inp-1ph-v').value);
    let p = parseFloat(document.getElementById('inp-1ph-p').value);
    let i = parseFloat(document.getElementById('inp-1ph-i').value);
    let pf = parseFloat(document.getElementById('inp-1ph-pf').value) || 0;
    const useEta = document.getElementById('tog-1ph-eta').checked;
    const eta = useEta ? (parseFloat(document.getElementById('inp-1ph-eta').value) || 85) / 100 : 1; // Efficiency

    if (isNaN(v)) return alert(translate('err_fill_two'));
    if (isNaN(p) && isNaN(i)) return alert(translate('err_fill_two'));
    if (pf === 0) pf = 1;

    // Bidirectional Solve
    if (!isNaN(p) && isNaN(i)) {
        i = (p * 1000) / (v * pf * eta); // Added efficiency to formula
        document.getElementById('inp-1ph-i').value = i.toFixed(2);
    } else if (!isNaN(i) && isNaN(p)) {
        p = (v * i * pf * eta) / 1000;
        document.getElementById('inp-1ph-p').value = p.toFixed(2);
    }

    const s = (v * i) / 1000; // kVA - True apparent power
    const pIn = p / eta; // Active power taken from grid
    let q = 0;
    if (s >= pIn) q = Math.sqrt(Math.pow(s, 2) - Math.pow(pIn, 2)); // kVAR

    const cab = getCable(i);
    const cb = getBreaker(i);

    let tips = [];
    if (pf < 0.85) tips.push(translate('tip_pf'));

    lastCalcResult = { type: '1PH_MOTOR', inputs: { v, p, i, pf }, results: { s, q, cab, cb } };

    renderResult('res-1ph', [
        { label: translate('res_current'), value: `${i.toFixed(2)} A` },
        { label: translate('res_power'), value: `${p.toFixed(2)} kW` },
        { label: translate('res_kva'), value: `${s.toFixed(2)} kVA` },
        { label: translate('res_kvar'), value: `${q.toFixed(2)} kVAR` },
        { label: translate('res_cb'), value: badge(`${cb} A Sigorta`, 'green') },
        { label: translate('res_cable'), value: badge(`${cab.size} mm² Cu`, cab.color) }
    ], tips);
});


// 2. Three-Phase Motor
document.getElementById('inp-3ph-p').addEventListener('input', () => document.getElementById('inp-3ph-i').value = '');
document.getElementById('inp-3ph-i').addEventListener('input', () => document.getElementById('inp-3ph-p').value = '');

document.getElementById('form-3ph').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = parseFloat(document.getElementById('inp-3ph-v').value);
    let p = parseFloat(document.getElementById('inp-3ph-p').value);
    let i = parseFloat(document.getElementById('inp-3ph-i').value);
    let pf = parseFloat(document.getElementById('inp-3ph-pf').value) || 0;
    const useEta = document.getElementById('tog-3ph-eta').checked;
    const eta = useEta ? (parseFloat(document.getElementById('inp-3ph-eta').value) || 90) / 100 : 1; // Efficiency

    if (isNaN(v)) return alert(translate('err_fill_two'));
    if (isNaN(p) && isNaN(i)) return alert(translate('err_fill_two'));
    if (pf === 0) pf = 1;

    // Bidirectional Solve
    const root3 = Math.sqrt(3);
    if (!isNaN(p) && isNaN(i)) {
        i = (p * 1000) / (root3 * v * pf * eta);
        document.getElementById('inp-3ph-i').value = i.toFixed(2);
    } else if (!isNaN(i) && isNaN(p)) {
        p = (root3 * v * i * pf * eta) / 1000;
        document.getElementById('inp-3ph-p').value = p.toFixed(2);
    }

    const s = (root3 * v * i) / 1000; // kVA Apparent Power
    const pInput = p / eta; // Active power taken from grid
    let q = 0;
    if (s >= pInput) q = Math.sqrt(Math.pow(s, 2) - Math.pow(pInput, 2));

    const cab = getCable(i);
    const cb = getBreaker(i);

    let tips = [];
    if (p > 5.5) tips.push(translate('tip_star'));
    if (pf < 0.85) tips.push(translate('tip_pf'));
    tips.push(translate('tip_vfd'));

    lastCalcResult = { type: '3PH_MOTOR', inputs: { v, p, i, pf }, results: { s, q, cab, cb } };

    renderResult('res-3ph', [
        { label: translate('res_current'), value: `${i.toFixed(2)} A` },
        { label: translate('res_power'), value: `${p.toFixed(2)} kW` },
        { label: translate('res_kva'), value: `${s.toFixed(2)} kVA` },
        { label: translate('res_kvar'), value: `${q.toFixed(2)} kVAR` },
        { label: translate('res_cb'), value: badge(`${cb} A Şalter`, 'green') },
        { label: translate('res_cable'), value: badge(`${cab.size} mm² Cu`, cab.color) }
    ], tips);
});


// 3. Trafo
document.getElementById('form-trafo').addEventListener('submit', (e) => {
    e.preventDefault();
    const kva = parseFloat(document.getElementById('inp-tr-s').value);
    const vp = parseFloat(document.getElementById('inp-tr-vp').value) * 1000; // kV to V
    const vs = parseFloat(document.getElementById('inp-tr-vs').value);

    const pI = (kva * 1000) / (Math.sqrt(3) * vp);
    const sI = (kva * 1000) / (Math.sqrt(3) * vs);

    const cab = getCable(sI);
    const cb = getBreaker(sI);

    lastCalcResult = { type: 'TRAFO', inputs: { kva, vp, vs }, results: { pI, sI, cb, cab } };

    renderResult('res-trafo', [
        { label: translate('res_pri_i'), value: `${pI.toFixed(2)} A` },
        { label: translate('res_sec_i'), value: `${sI.toFixed(2)} A` },
        { label: 'Sekonder Ana Şalter', value: badge(`${cb} A TMŞ`, 'green') },
        { label: 'Örnek Ana Kablo', value: badge(`${cab.size} mm² (Muhtemel Paralel)`, 'yellow') }
    ]);
});


// 4. kVAR
document.getElementById('form-kvar').addEventListener('submit', (e) => {
    e.preventDefault();
    const p = parseFloat(document.getElementById('inp-kv-p').value);
    const v = parseFloat(document.getElementById('inp-kv-v').value) || 400;
    const pf1 = parseFloat(document.getElementById('inp-kv-pf1').value);
    const pf2 = parseFloat(document.getElementById('inp-kv-pf2').value);

    const tan1 = Math.tan(Math.acos(pf1));
    const tan2 = Math.tan(Math.acos(pf2));

    const qc = p * (tan1 - tan2);
    const ic = (qc * 1000) / (Math.sqrt(3) * v); // Now uses dynamic voltage

    lastCalcResult = { type: 'KVAR', inputs: { p, v, pf1, pf2 }, results: { qc, ic } };

    renderResult('res-kvar', [
        { label: translate('res_q_req'), value: badge(`${qc.toFixed(2)} kVAR`, 'green') },
        { label: translate('res_cap_i'), value: `${ic.toFixed(2)} A (${v}V için)` }
    ]);
});

// 4.1. kVAR to Current (New Feature)
document.getElementById('form-kvar-current').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = parseFloat(document.getElementById('inp-kvc-q').value);
    const v = parseFloat(document.getElementById('inp-kvc-v').value);

    if (isNaN(q) || isNaN(v)) return alert('Lütfen güç ve gerilim değerlerini girin.');

    // Ic = (Qc * 1000) / (√3 × V)
    const ic = (q * 1000) / (Math.sqrt(3) * v);

    lastCalcResult = { type: 'KVAR_CURRENT', inputs: { q, v }, results: { ic } };

    renderResult('res-kvar-current', [
        { label: 'Girilen Kondansatör (kVAR)', value: `${q} kVAR` },
        { label: 'Sistem Gerilimi (V)', value: `${v} V` },
        { label: 'Kondansatör Akımı (Ic)', value: badge(`${ic.toFixed(2)} A`, 'blue') },
        { label: 'Sigorta (Kapasitif Karakterli)', value: badge(`${getBreaker(ic)} A (min)`, 'green') }
    ]);
});

// 5. Star-Delta (Yıldız-Üçgen) Contactor Sizing
// Standard contactor sizes (A)
const CONTACTOR_SIZES = [9, 12, 16, 18, 25, 32, 38, 40, 50, 65, 80, 95, 115, 150, 185, 225, 265, 300, 400, 500, 630];
const getContactor = (i) => { for (let s of CONTACTOR_SIZES) if (s >= i) return s; return '>630'; };

document.getElementById('inp-yd-p').addEventListener('input', () => document.getElementById('inp-yd-i').value = '');
document.getElementById('inp-yd-i').addEventListener('input', () => document.getElementById('inp-yd-p').value = '');

document.getElementById('form-yd').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = parseFloat(document.getElementById('inp-yd-v').value);
    const pf = parseFloat(document.getElementById('inp-yd-pf').value) || 0.80;
    let p = parseFloat(document.getElementById('inp-yd-p').value);
    let I = parseFloat(document.getElementById('inp-yd-i').value);
    const rt3 = Math.sqrt(3);

    if (isNaN(v)) return alert('Gerilim giriniz.');
    if (isNaN(p) && isNaN(I)) return alert('Motor gücü (kW) veya akım (A) giriniz.');

    // Derive missing value
    if (!isNaN(p) && isNaN(I)) {
        I = (p * 1000) / (rt3 * v * pf);
        document.getElementById('inp-yd-i').value = I.toFixed(2);
    } else if (!isNaN(I) && isNaN(p)) {
        p = (rt3 * v * I * pf) / 1000;
        document.getElementById('inp-yd-p').value = p.toFixed(2);
    }

    // === Yıldız-Üçgen Kontaktör Akım Formülleri (IEC 60947-4-1) ===
    // KM  (Ana kontaktör)   : Hat akımının tamamını taşır → I_KM = I
    // KY  (Yıldız kontaktör): Yıldız bağlantısında faz akımı → I_KY = I / √3 ≈ 0.578 × I
    // KΔ  (Üçgen kontaktör) : Üçgen bağlantısında hat akımının tamamını taşır → I_KΔ = I
    // Termik röle           : Motor nominal akımına (I) göre ayarlanır
    const I_km = I;           // Ana kontaktör — tam hat akımı
    const I_ky = I / rt3;     // Yıldız kontaktör — I / √3
    const I_kdel = I;           // Üçgen kontaktör — tam hat akımı (DÜZELTME: I/√3 değil, I!)
    const I_term = I;           // Termik röle motor nominal akımına göre ayarlanır

    const cb = getBreaker(I);            // Motor koruma sigortası
    const km = getContactor(I_km * 1.25); // Ana kontaktör: %125 güvenlik payı
    const ky = getContactor(I_ky * 1.25); // Yıldız kontaktör: %125 güvenlik payı
    const kd = getContactor(I_kdel * 1.25); // Üçgen kontaktör: %125 güvenlik payı

    lastCalcResult = { type: 'STAR_DELTA', inputs: { v, p, I, pf }, results: { I_km, I_ky, I_kdel, I_term } };

    renderResult('res-yd', [
        { label: 'Motor Nominal Akımı (I)', value: `${I.toFixed(2)} A` },
        { label: 'Motor Sigortası', value: badge(`${cb} A`, 'green') },
        { label: 'KM — Ana Kontaktör  (I)', value: badge(`min. ${km} A   (${I_km.toFixed(2)} A)`, 'green') },
        { label: 'KY — Yıldız Kontaktör  (I/√3)', value: badge(`min. ${ky} A   (${I_ky.toFixed(2)} A)`, 'blue') },
        { label: 'KΔ — Üçgen Kontaktör  (I)', value: badge(`min. ${kd} A   (${I_kdel.toFixed(2)} A)`, 'green') },
        { label: 'Termik Röle Ayar Akımı', value: badge(`${I_term.toFixed(2)} A (= I_nom)`, 'yellow') },
    ], [
        '⚡ KM ve KΔ kontaktörleri aynı boyutta seçilir (tam hat akımı = I). Yalnızca KY daha küçük seçilir (I/√3 ≈ 0.578 × I).',
        I > 30 ? 'AI Önerisi: Bu güç seviyesinde geçiş süresi (Y→Δ) 5–8 sn arası ayarlanmalıdır.' : '',
        p > 18.5 ? 'AI Önerisi: Devreye alma süreci kritik; alternatif olarak Soft-Starter değerlendirilebilir.' : ''
    ].filter(Boolean));
});


// --- History Logic ---

const loadHistoryCategories = async () => {
    if (!window.dbAPI || !currentUser) return;
    const items = await window.dbAPI.getHistoryByUser(currentUser);
    const cats = new Set(items.map(i => i.category));

    // Datalist update
    const dl = document.getElementById('cat-suggestions');
    dl.innerHTML = '';
    cats.forEach(c => {
        dl.innerHTML += `<option value="${c}">`;
    });

    // Filter pill update
    const cDiv = document.getElementById('dynamic-categories');
    cDiv.innerHTML = '';
    cats.forEach(c => {
        cDiv.innerHTML += `<button class="cat-pill" data-cat="${c}">${c}</button>`;
    });

    // Re-bind pill links
    document.querySelectorAll('.cat-pill').forEach(el => {
        el.addEventListener('click', (ev) => {
            document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
            ev.target.classList.add('active');
            const cat = ev.target.getAttribute('data-cat');
            renderHistoryList(items, cat);
        });
    });
};

const loadHistory = async () => {
    if (!window.dbAPI || !currentUser) return;
    const items = await window.dbAPI.getHistoryByUser(currentUser);

    // Assume 'all' is active
    document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
    document.querySelector('.cat-pill[data-cat="all"]').classList.add('active');

    renderHistoryList(items, 'all');
};

const renderHistoryList = (items, filterCat) => {
    const container = document.getElementById('history-list');
    container.innerHTML = '';

    const filtered = filterCat === 'all' ? items : items.filter(i => i.category === filterCat);

    if (filtered.length === 0) {
        container.innerHTML = `
      <div class="empty-state">
        <i class="ph ph-folder-open"></i>
        <p>${translate('no_history')}</p>
      </div>`;
        return;
    }

    filtered.forEach(item => {
        const d = new Date(item.date).toLocaleDateString();

        // Build brief preview string based on type
        let sum = '';
        if (item.type.includes('MOTOR')) sum = `${item.inputs.p} kW -> ${item.results.cb}A Sigorta`;
        if (item.type === 'TRAFO') sum = `${item.inputs.kva} kVA Trafo`;
        if (item.type === 'KVAR') sum = `${item.results.qc.toFixed(1)} kVAR Kondansatör`;

        container.innerHTML += `
      <div class="history-item glass-card">
        <div class="history-item-top">
          <span><i class="ph ph-tag"></i> ${item.category}</span>
          <span>${d}</span>
        </div>
        <div class="history-item-title">${item.notes || item.type.replace('_', ' ')}</div>
        <div class="text-muted"><i class="ph ph-lightning"></i> ${sum}</div>
        <div class="history-actions">
          <button class="btn btn-secondary" style="flex:1;font-size:0.8rem" onclick="deleteHistory(${item.id})">
            <i class="ph ph-trash"></i> Sil
          </button>
        </div>
      </div>
    `;
    });
};

document.getElementById('btn-clear-history').addEventListener('click', async () => {
    if (confirm("Tüm geçmişinizi silmek istediğinize emin misiniz?")) {
        await window.dbAPI.clearUserHistory(currentUser);
        loadHistory();
        loadHistoryCategories();
    }
});

window.deleteHistory = async (id) => {
    await window.dbAPI.deleteHistoryItem(id);
    loadHistory();
    loadHistoryCategories();
};


// Register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker Registered'));
}

// ===== 6. Voltage Drop =====
document.getElementById('form-vdrop').addEventListener('submit', (e) => {
    e.preventDefault();
    const phase = parseInt(document.getElementById('inp-vd-phase').value);
    const rho = parseFloat(document.getElementById('inp-vd-mat').value); // Ω·mm²/m
    const v = parseFloat(document.getElementById('inp-vd-v').value);
    const I = parseFloat(document.getElementById('inp-vd-i').value);
    const L = parseFloat(document.getElementById('inp-vd-len').value);
    const A = parseFloat(document.getElementById('inp-vd-area').value);

    if ([v, I, L, A].some(isNaN)) return alert('Lütfen tüm alanları doldurun.');

    // ΔU = (k × ρ × L × I) / A   where k=2 for 1-ph, √3 for 3-ph
    const k = phase === 1 ? 2 : Math.sqrt(3);
    const dU = (k * rho * L * I) / A;       // Volts
    const pct = (dU / v) * 100;

    let col = 'green', status = '✅ Normal (< 3%)';
    if (pct > 3 && pct <= 5) { col = 'yellow'; status = '⚠️ Yüksek (3–5%)'; }
    if (pct > 5) { col = 'red'; status = '🔴 Kritik (> 5%) — Kesit Artırın!'; }

    lastCalcResult = { type: 'VDROP', inputs: { v, I, L, A, phase }, results: { dU, pct } };

    renderResult('res-vdrop', [
        { label: 'Gerilim Düşümü (ΔU)', value: badge(`${dU.toFixed(2)} V`, col) },
        { label: 'Düşüm Yüzdesi (ΔU%)', value: badge(`${pct.toFixed(2)} %`, col) },
        { label: 'Varış Gerilimi', value: `${(v - dU).toFixed(1)} V` },
        { label: 'Durum', value: badge(status, col) },
    ], pct > 3 ? ['AI Önerisi: Gerilim düşümü IEC sınırını aşıyor. Kablo kesitini büyütün veya hattı kısaltın.'] : []);
});

// ===== 7. Short Circuit Current =====
document.getElementById('form-isc').addEventListener('submit', (e) => {
    e.preventDefault();
    const kva = parseFloat(document.getElementById('inp-isc-kva').value);
    const v = parseFloat(document.getElementById('inp-isc-v').value);
    const uk = parseFloat(document.getElementById('inp-isc-uk').value);
    const rt3 = Math.sqrt(3);

    if ([kva, v, uk].some(isNaN)) return alert('Lütfen tüm alanları doldurun.');

    // Isc = S / (√3 × V × Uk)
    const I_nom = (kva * 1000) / (rt3 * v);        // Nominal secondary current
    const I_sc = (kva * 1000) / (rt3 * v * (uk / 100)); // Short circuit current
    const I_sc1ph = (kva * 1000) / (v * (uk / 100));    // Approx single-phase fault

    const cb_main = getBreaker(I_nom);

    lastCalcResult = { type: 'ISC', inputs: { kva, v, uk }, results: { I_nom, I_sc } };

    renderResult('res-isc', [
        { label: 'Nominal Sekonder Akım (I_n)', value: `${I_nom.toFixed(1)} A` },
        { label: 'Üç Faz K.D. Akımı (I_sc)', value: badge(`${(I_sc / 1000).toFixed(2)} kA`, 'red') },
        { label: 'T.F. K.D. Akımı (yakl.)', value: badge(`${(I_sc1ph / 1000).toFixed(2)} kA`, 'yellow') },
        { label: 'Ana Sigorta Önerisi', value: badge(`${cb_main} A`, 'green') },
    ], [
        `AI Önerisi: Uk=${uk}% için kesici kesme kapasitesi en az ${(I_sc / 1000).toFixed(1)} kA olmalıdır.`,
        'Kablo ve şalter seçiminde kısa devre akımının etkileri göz önünde bulundurulmalıdır.'
    ]);
});

// ===== 8. Soft-Starter =====
document.getElementById('form-ss').addEventListener('submit', (e) => {
    e.preventDefault();
    const I = parseFloat(document.getElementById('inp-ss-i').value);
    const mult = parseFloat(document.getElementById('inp-ss-mult').value);

    if (isNaN(I)) return alert('Motor nominal akımını giriniz.');

    const I_start = I * mult;
    const cb = getBreaker(I * 1.25);

    renderResult('res-ss', [
        { label: 'Nominal Motor Akımı', value: `${I.toFixed(2)} A` },
        { label: `Devreye Alma Akımı (×${mult})`, value: badge(`${I_start.toFixed(2)} A`, 'yellow') },
        { label: 'Önerilen Motor Sigortası', value: badge(`${cb} A`, 'green') },
    ], ['Soft-Starter devreye alma akımını motor tipine ve yüke göre 2×–4× arasında ayarlayabilirsiniz.']);
});

// ===== 9. Lighting =====
document.getElementById('form-light').addEventListener('submit', (e) => {
    e.preventDefault();
    const area = parseFloat(document.getElementById('inp-lt-area').value);
    const lux = parseFloat(document.getElementById('inp-lt-lux').value);
    const w = parseFloat(document.getElementById('inp-lt-w').value);
    const lumW = parseFloat(document.getElementById('inp-lt-eff').value);

    if ([area, lux, w, lumW].some(isNaN)) return alert('Lütfen tüm alanları doldurun.');

    // Required total lumens (maintenance factor 0.80)
    const totalLm = (area * lux) / 0.80;
    const lumPerFix = w * lumW;
    const numFix = Math.ceil(totalLm / lumPerFix);
    const totalW = numFix * w;
    const I_load = (totalW / 1000) / (0.23 * 0.9); // Assume 230V, cosφ=0.9, 1-phase

    renderResult('res-light', [
        { label: 'Gerekli Toplam Işık Akısı', value: `${Math.round(totalLm).toLocaleString()} lm` },
        { label: 'Armatür Başına Işık Akısı', value: `${Math.round(lumPerFix)} lm` },
        { label: 'Gerekli Armatür Sayısı', value: badge(`${numFix} adet`, 'green') },
        { label: 'Toplam Kurulu Güç', value: `${totalW} W` },
        { label: 'Tahmini Yük Akımı (230V)', value: `${I_load.toFixed(2)} A` },
    ], [`Bakım faktörü 0.80 alınmıştır. Gerçek hesap için oda tipi ve reflektans değerlerini göz önünde bulundurun.`]);
});

// ===== 10. HP <-> kW Converter =====
// (Existing converter functions if any)

// ===== 11. Busbar Calculator =====
document.getElementById('form-busbar').addEventListener('submit', (e) => {
    e.preventDefault();
    const I = parseFloat(document.getElementById('inp-bus-i').value);
    const nIsHalf = document.getElementById('tog-bus-n-half').checked;
    if (isNaN(I)) return alert('Lütfen akım değerini girin.');

    let barra = "";
    let barraN = "";
    let barraPE = "";
    let count = "1";
    let color = "green";

    if (I <= 250) {
        barra = "20 x 5";
        barraN = "20 x 5";
        barraPE = "20 x 3 veya 12x5";
    }
    else if (I <= 400) {
        barra = "30 x 5";
        barraN = nIsHalf ? "20 x 5" : "30 x 5";
        barraPE = nIsHalf ? "20 x 3" : "15 x 5";
    }
    else if (I <= 630) {
        barra = "40 x 10";
        barraN = nIsHalf ? "40 x 5" : "40 x 10";
        barraPE = nIsHalf ? "20 x 5" : "40 x 5";
    }
    else if (I <= 800) {
        barra = "50 x 10";
        barraN = nIsHalf ? "50 x 5" : "50 x 10";
        barraPE = nIsHalf ? "25 x 5" : "50 x 5";
    }
    else if (I <= 1000) {
        barra = "60 x 10";
        barraN = nIsHalf ? "30 x 10" : "60 x 10";
        barraPE = nIsHalf ? "30 x 5" : "30 x 10";
    }
    else if (I <= 1250) {
        barra = "80 x 10";
        barraN = nIsHalf ? "40 x 10" : "80 x 10";
        barraPE = nIsHalf ? "40 x 5" : "40 x 10";
    }
    else if (I <= 1600) {
        barra = "100 x 10";
        barraN = nIsHalf ? "50 x 10" : "100 x 10";
        barraPE = nIsHalf ? "50 x 5" : "50 x 10";
    }
    else if (I <= 2000) {
        barra = "2 x (60 x 10)";
        barraN = nIsHalf ? "1 x (60 x 10)" : "2 x (60 x 10)";
        barraPE = nIsHalf ? "1 x (30 x 10)" : "1 x (60 x 10)";
        count = "2";
    }
    else if (I <= 2500) {
        barra = "2 x (80 x 10)";
        barraN = nIsHalf ? "1 x (80 x 10)" : "2 x (80 x 10)";
        barraPE = nIsHalf ? "1 x (40 x 10)" : "1 x (80 x 10)";
        count = "2";
    }
    else if (I <= 3200) {
        barra = "2 x (100 x 10)";
        barraN = nIsHalf ? "1 x (100 x 10)" : "2 x (100 x 10)";
        barraPE = nIsHalf ? "1 x (50 x 10)" : "1 x (100 x 10)";
        count = "2";
    }
    else { barra = "Özel Hesaplama Gerekli"; barraN = "-"; barraPE = "-"; count = "-"; color = "red"; }

    const container = document.getElementById('res-busbar');
    container.innerHTML = `
        <div class="res-row">
            <span class="res-label">Faz Barası (L1, L2, L3):</span>
            <span class="res-value">${barra} mm</span>
        </div>
        <div class="res-row">
            <span class="res-label">Nötr Barası (N):</span>
            <span class="res-value" style="color:var(--primary)">${barraN} mm</span>
        </div>
        <div class="res-row">
            <span class="res-label">Toprak Barası (PE):</span>
            <span class="res-value" style="color:var(--status-green)">${barraPE} mm</span>
        </div>
        <div class="ai-tip">
            <i class="ph-fill ph-info"></i>
            <span>Nötr tercihinize göre (%100 veya %50), Toprak (PE) ise standart gereği %50 kesitinde hesaplanmıştır.</span>
        </div>
    `;
    container.classList.remove('hidden');
});
window.convertHPtoKW = () => {
    const hp = parseFloat(document.getElementById('inp-hp').value);
    if (isNaN(hp)) return;
    const kw = hp * 0.7457;
    document.getElementById('inp-kw-conv').value = kw.toFixed(3);
    document.getElementById('res-hp').innerText = `${hp} HP  =  ${kw.toFixed(3)} kW`;
};
window.convertKWtoHP = () => {
    const kw = parseFloat(document.getElementById('inp-kw-conv').value);
    if (isNaN(kw)) return;
    const hp = kw / 0.7457;
    document.getElementById('inp-hp').value = hp.toFixed(3);
    document.getElementById('res-hp').innerText = `${kw} kW  =  ${hp.toFixed(3)} HP`;
};

// ===== 11. JSON History Export / Import =====
// Export: add button dynamically in history tab header area
const exportBtn = document.createElement('button');
exportBtn.className = 'btn-text';
exportBtn.style.fontSize = '0.8rem';
exportBtn.innerHTML = '<i class="ph ph-download-simple"></i> JSON Dışa';
exportBtn.onclick = async () => {
    const items = await window.dbAPI.getHistoryByUser(currentUser);
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `elec-calc-backup-${currentUser}-${Date.now()}.json`;
    a.click();
};

const importInput = document.createElement('input');
importInput.type = 'file';
importInput.accept = '.json';
importInput.style.display = 'none';
importInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    const items = JSON.parse(text);
    for (const item of items) {
        const copy = { ...item };
        delete copy.id;
        copy.username = currentUser;
        await window.dbAPI.saveCalculation(copy);
    }
    alert(`${items.length} kayıt içe aktarıldı!`);
    loadHistory(); loadHistoryCategories();
};

const importBtn = document.createElement('button');
importBtn.className = 'btn-text';
importBtn.style.fontSize = '0.8rem';
importBtn.innerHTML = '<i class="ph ph-upload-simple"></i> JSON İçe';
importBtn.onclick = () => importInput.click();

const histHdr = document.querySelector('.history-header');
if (histHdr) {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;';
    const clearBtn = document.getElementById('btn-clear-history');
    histHdr.appendChild(wrapper);
    wrapper.appendChild(clearBtn);
    wrapper.appendChild(exportBtn);
    wrapper.appendChild(importBtn);
    wrapper.appendChild(importInput);
}

// Initial Lang Set
applyTranslations();
