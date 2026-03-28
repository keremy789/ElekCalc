/**
 * app.js - Main Application Logic
 * Handles Authentication, UI switching, LocalStorage/IndexedDB state, and Calculations.
 */

// --- Global State ---
let currentUser = null;
let currentLang = 'tr';
let isDarkTheme = true;
let isLoginMode = true; // true = Login view, false = Register view
let isRegistering = false; // Guard: prevent onAuthStateChanged from resetting UI during registration

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
        kvar_title: "🔌 Kompanzasyon Panosu Ana Şalteri",
        kvar_total: "Toplam Pano / Kondansatör (kVAR)",
        kvar_calc: "Şalteri Hesapla",
        yd_motor_i_alt: "Motor Akımı (A) — Alternatif",
        vd_phase: "Sistem Tipi",
        vd_phase_3: "Trifaze (3Φ)",
        vd_phase_1: "Monofaze (1Φ)",
        vd_mat: "İletken Tipi",
        vd_mat_cu: "Bakır (Cu)",
        vd_mat_al: "Alüminyum (Al)",
        vd_len: "Kablo Uzunluğu (m)",
        vd_area: "Kablo Kesiti (mm²)",
        isc_uk: "Kısa Devre Empedansı Uk% (genellikle 4–6%)",
        tools_hpkw: "⚙️ HP ↔ kW Dönüştürücü",
        tools_hp: "HP (Beygir Gücü)",
        tools_kw: "kW",
        tools_ss: "🔁 Soft-Starter Devreye Alma Akımı",
        tools_ss_inom: "Motor Akımı I_nom (A)",
        tools_ss_mult: "Devreye Alma Çarpanı",
        tools_ss_mult_2: "2× (Hafif Yük)",
        tools_ss_mult_3: "3× (Normal)",
        tools_ss_mult_4: "4× (Ağır Yük)",
        tools_light: "💡 Aydınlatma Hesabı",
        tools_lt_area: "Alan (m²)",
        tools_lt_lux: "Hedef Lüks (lx)",
        tools_lt_lx_100: "100 lx — Depo/Koridor",
        tools_lt_lx_200: "200 lx — Merdiven",
        tools_lt_lx_300: "300 lx — Ofis/Atölye",
        tools_lt_lx_500: "500 lx — Teknik Ofis",
        tools_lt_lx_750: "750 lx — Hassas İşlem",
        tools_lt_pw: "Armatür Gücü (W)",
        tools_lt_eff: "Armatür Verimliliği (lm/W)",
        tools_ip: "🛡️ IP Koruma Sınıfı Rehberi",
        ip_solid: "Katı Koruma",
        ip_liquid: "Sıvı Koruma",
        ip_use: "Kullanım Yeri",
        ip_finger: "Parmak",
        ip_none: "Yok",
        ip_tool_25: "Alet > 2.5mm",
        ip_tool_1: "Tel > 1mm",
        ip_dust_part: "Toz kısmi",
        ip_dust_full: "Tam toz",
        ip_drop_v: "Düşey damlama",
        ip_splash: "Her yönden sıçrama",
        ip_jet: "Su jeti",
        ip_sub_1m: "1m suya dalmaya",
        ip_sub_cont: "Sürekli dalma",
        ip_loc_in: "Dahili pano",
        ip_loc_in_pan: "İç mekan pano",
        ip_loc_in_dist: "İç mekan dağıtım",
        ip_loc_in_ctrl: "İç mekan kontrol",
        ip_loc_in_term: "İç mekan terminal",
        ip_loc_gen: "Genel amaçlı",
        ip_loc_out_damp: "Açık / nemli",
        ip_loc_out_motor: "Dış ortam motor",
        ip_loc_ind_out: "Sanayi / dış",
        ip_loc_wash: "Yıkama alanları",
        ip_loc_under: "Sualtı pompa",
        tools_hp_to_kw: "HP → kW",
        tools_kw_to_hp: "kW → HP",
        
        err_kvar_fill: "Lütfen güç ve gerilim değerlerini girin.",
        res_kvar_q: "Pano/Kondansatör Gücü",
        res_kvar_in: "Nominal Akım (In)",
        res_kvar_id: "Tasarım Akımı (In × 1.5)",
        res_kvar_cb: "Önerilen Ana Şalter / TMŞ",
        tip_kvar_iec: "IEC standartlarına göre kapasitif yüklerde harmonikler ve deşarj akımları nedeniyle şalter ve kablo kesiti nominal akımın en az 1.35 - 1.5 katı olarak tasarlanmalıdır. Hesaplamada 1.5 çarpanı kullanılmıştır.",
        err_yd_v: "Gerilim giriniz.",
        err_yd_p_i: "Motor gücü (kW) veya akım (A) giriniz.",
        res_yd_inom: "Motor Nominal Akımı (I)",
        res_yd_fuse: "Motor Sigortası",
        res_yd_km: "KM — Ana Kontaktör  (I)",
        res_yd_ky: "KY — Yıldız Kontaktör  (I/√3)",
        res_yd_kd: "KΔ — Üçgen Kontaktör  (I)",
        res_yd_term: "Termik Röle Ayar Akımı",
        tip_yd_cont: "⚡ KM ve KΔ kontaktörleri aynı boyutta seçilir (tam hat akımı = I). Yalnızca KY daha küçük seçilir (I/√3 ≈ 0.578 × I).",
        err_fill_all: "Lütfen tüm alanları doldurun.",
        res_vd_v: "Gerilim Düşümü (ΔU)",
        res_vd_pct: "Düşüm Yüzdesi (ΔU%)",
        res_vd_arr: "Varış Gerilimi",
        res_vd_state: "Durum",
        res_isc_in: "Nominal Sekonder Akım (I_n)",
        res_isc_3ph: "Üç Faz K.D. Akımı (I_sc)",
        res_isc_1ph: "T.F. K.D. Akımı (yakl.)",
        res_isc_cb: "Ana Sigorta Önerisi",
        err_ss_i: "Motor nominal akımını giriniz.",
        res_ss_inom: "Nominal Motor Akımı",
        res_lt_flux: "Gerekli Toplam Işık Akısı",
        res_lt_fix: "Armatür Başına Işık Akısı",
        res_lt_num: "Gerekli Armatür Sayısı",
        res_lt_p: "Toplam Kurulu Güç",
        res_lt_i: "Tahmini Yük Akımı (230V)",
        tip_lt_maint: "Bakım faktörü 0.80 alınmıştır. Gerçek hesap için oda tipi ve reflektans değerlerini göz önünde bulundurun.",
        res_ss_demaraj: "Devreye Alma Akımı",
        res_ss_cb: "Önerilen Motor Sigortası",
        res_trafo_sec_cb: "Sekonder Ana Şalter",
        res_trafo_cab: "Örnek Ana Kablo",
                auth_login_progress: "Giriş yapılıyor, lütfen bekleyin...",
        auth_verify_email_err: "Lütfen e-postanızı doğrulayın! Kayıt olurken size bir link gönderdik.",
        auth_login_fail: "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.",
        auth_reg_progress: "Hesabınız oluşturuluyor, lütfen bekleyin...",
        auth_reg_send_verify: "Doğrulama e-postası gönderiliyor...",
        auth_reg_unverified: "Hesap oluşturuldu! E-posta gönderilemedi ama hesabınız aktif.",
        auth_reg_fail: "Kayıt başarısız: ",
        auth_unknown_err: "Bilinmeyen bir hata oluştu.",
        auth_verify_sent: "Gönderildi ✓",
        auth_verify_err: "Hata: ",
        auth_forgot_tgl_pw: "Şifremi Unuttum",
        auth_forgot_tgl_cncl: "Vazgeç",
        auth_forgot_err_email: "Lütfen e-posta adresinizi girin.",
        auth_forgot_sending: "Gönderiliyor...",
        auth_forgot_success: "şifre sıfırlama linki gönderildi! Mail kutunuzu kontrol edin.",
        auth_forgot_btn: "Link Gönder",
        res_badge_fuse: "Sigorta",
        res_badge_breaker: "Şalter",
        res_badge_tms: "TMŞ",
        res_badge_parallel: "(Muhtemel Paralel)",
        tip_yd_time: "AI Önerisi: Bu güç seviyesinde geçiş süresi (Y→Δ) 5–8 sn arası ayarlanmalıdır.",
        tip_yd_ss: "AI Önerisi: Devreye alma süreci kritik; alternatif olarak Soft-Starter değerlendirilebilir.",
        hist_del_prompt: "Tüm geçmişinizi silmek istediğinize emin misiniz?",
        hist_del_btn: "Sil",
        vd_status_norm: "✅ Normal (< 3%)",
        vd_status_high: "⚠️ Yüksek (3–5%)",
        vd_status_crit: "🔴 Kritik (> 5%) — Kesit Artırın!",
        tip_vd: "AI Önerisi: Gerilim düşümü IEC sınırını aşıyor. Kablo kesitini büyütün veya hattı kısaltın.",
        tip_isc_cap_1: "AI Önerisi: Uk=",
        tip_isc_cap_2: "% için kesici kesme kapasitesi en az ",
        tip_isc_cap_3: " kA olmalıdır.",
        tip_isc_cable: "Kablo ve şalter seçiminde kısa devre akımının etkileri göz önünde bulundurulmalıdır.",
        tip_ss_range: "Soft-Starter devreye alma akımını motor tipine ve yüke göre 2×–4× arasında ayarlayabilirsiniz.",
        unit_pcs: "adet",
        busbar_req_custom: "Özel Hesaplama Gerekli",
        busbar_ph: "Faz Barası (L1, L2, L3):",
        busbar_n: "Nötr Barası (N):",
        busbar_pe: "Toprak Barası (PE):",
        busbar_tip: "Nötr tercihinize göre (%100 veya %50), Toprak (PE) ise standart gereği %50 kesitinde hesaplanmıştır.",
        busbar_or: "veya",
        msg_saved: "Hesaplama Kaydedildi!",
        hist_import_success: "kayıt içe aktarıldı!",
        export_json: "JSON Dışa",
        import_json: "JSON İçe",
        busbar_err_i: "Lütfen akım değerini girin.",
        auth_sub: "Hesaplamalarına ulaşmak için giriş yap",
        verify_title: "E-postanı Doğrula",
        verify_link_sent: "Kayıt linkiniz",
        verify_mail_suffix: "mail adresinize gönderilmiştir.",
        btn_ok: "Tamam",
        btn_resend: "Tekrar gönder",
        remember_me: "Beni Hatırla",
        forgot_pw_sub: "E-posta adresinizi girin, şifre sıfırlama linki",
        btn_send_link: "Link Gönder",
        yd_help: "Motor akımına göre üç kontaktör ve termik röle akımlarını",
        busbar_help: "Akım değerini girin, Panelmaster standartlarına göre uygun",
        isc_help: "Trafo sekonder terminallerinde hesaplanır.",
        yd_min: "min.",
        yd_inom_eq: "I_nom",
                ph_username: "mühendis123",
        ph_email: "muhendis@sirket.com",
        ph_ex_1000: "Örn: 1000",
        ph_ex_100: "Örn: 100",
        ph_ex_15: "Örn: 15",
        ph_or_direct: "Veya doğrudan girin",
        ph_ex_1250: "Örn: 1250",
        ph_ex_10: "Örn: 10",
        ph_ex_7_5: "Örn: 7.5",
        ph_ex_20: "Örn: 20",
        ph_ex_50: "Örn: 50",
        ph_ex_60: "Örn: 60",
        ph_cat: "Örn: A Blok Pano",
        ph_notes: "Örn: 5. kat havalandırma motoru",
        title_theme: "Tema Değiştir",
        title_logout: "Çıkış Yap",
        default_username: "Kullanıcı",
        res_badge_req_parallel: "Paralel Bağlantı Gerekli",
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
        kvar_title: "🔌 Power Factor Panel Main Breaker",
        kvar_total: "Total Panel / Capacitor (kVAR)",
        kvar_calc: "Calculate Breaker",
        yd_motor_i_alt: "Motor Current (A) — Alternative",
        vd_phase: "System Type",
        vd_phase_3: "Three-Phase (3Φ)",
        vd_phase_1: "Single-Phase (1Φ)",
        vd_mat: "Conductor Type",
        vd_mat_cu: "Copper (Cu)",
        vd_mat_al: "Aluminum (Al)",
        vd_len: "Cable Length (m)",
        vd_area: "Cable Cross-Section (mm²)",
        isc_uk: "Short Circuit Impedance Uk% (typically 4-6%)",
        tools_hpkw: "⚙️ HP ↔ kW Converter",
        tools_hp: "HP (Horsepower)",
        tools_kw: "kW",
        tools_ss: "🔁 Soft-Starter Startup Current",
        tools_ss_inom: "Motor Current I_nom (A)",
        tools_ss_mult: "Startup Multiplier",
        tools_ss_mult_2: "2× (Light Load)",
        tools_ss_mult_3: "3× (Normal)",
        tools_ss_mult_4: "4× (Heavy Load)",
        tools_light: "💡 Lighting Calculator",
        tools_lt_area: "Area (m²)",
        tools_lt_lux: "Target Lux (lx)",
        tools_lt_lx_100: "100 lx — Storage/Corridor",
        tools_lt_lx_200: "200 lx — Stairs",
        tools_lt_lx_300: "300 lx — Office/Workshop",
        tools_lt_lx_500: "500 lx — Technical Office",
        tools_lt_lx_750: "750 lx — Precision Work",
        tools_lt_pw: "Fixture Power (W)",
        tools_lt_eff: "Fixture Efficiency (lm/W)",
        tools_ip: "🛡️ IP Protection Guide",
        ip_solid: "Solid Protection",
        ip_liquid: "Liquid Protection",
        ip_use: "Typical Use",
        ip_finger: "Fingers",
        ip_none: "None",
        ip_tool_25: "Tool > 2.5mm",
        ip_tool_1: "Wire > 1mm",
        ip_dust_part: "Dust protected",
        ip_dust_full: "Dust tight",
        ip_drop_v: "Vertical drops",
        ip_splash: "Splashing water",
        ip_jet: "Water jets",
        ip_sub_1m: "Immersion up to 1m",
        ip_sub_cont: "Continuous immersion",
        ip_loc_in: "Indoor panel",
        ip_loc_in_pan: "Indoor enclosure",
        ip_loc_in_dist: "Indoor distribution",
        ip_loc_in_ctrl: "Indoor control",
        ip_loc_in_term: "Indoor terminal",
        ip_loc_gen: "General purpose",
        ip_loc_out_damp: "Outdoor / damp",
        ip_loc_out_motor: "Outdoor motor",
        ip_loc_ind_out: "Industrial / outdoor",
        ip_loc_wash: "Washdown areas",
        ip_loc_under: "Underwater pump",
        tools_hp_to_kw: "HP → kW",
        tools_kw_to_hp: "kW → HP",
        
        err_kvar_fill: "Please enter power and voltage values.",
        res_kvar_q: "Panel/Capacitor Power",
        res_kvar_in: "Nominal Current (In)",
        res_kvar_id: "Design Current (In × 1.5)",
        res_kvar_cb: "Recommended Main Breaker / MCCB",
        tip_kvar_iec: "According to IEC standards, the breaker and cable cross-section should be designed as at least 1.35-1.5 times the nominal current due to harmonics and discharge currents in capacitive loads. A multiplier of 1.5 is used in the calculation.",
        err_yd_v: "Please enter voltage.",
        err_yd_p_i: "Please enter motor power (kW) or current (A).",
        res_yd_inom: "Motor Nominal Current (I)",
        res_yd_fuse: "Motor Breaker",
        res_yd_km: "KM — Main Contactor (I)",
        res_yd_ky: "KY — Star Contactor (I/√3)",
        res_yd_kd: "KΔ — Delta Contactor (I)",
        res_yd_term: "Thermal Relay Setting Current",
        tip_yd_cont: "⚡ KM and KΔ contactors are selected in the same size (full line current = I). Only KY is selected smaller (I/√3 ≈ 0.578 × I).",
        err_fill_all: "Please fill in all fields.",
        res_vd_v: "Voltage Drop (ΔU)",
        res_vd_pct: "Drop Percentage (ΔU%)",
        res_vd_arr: "Arrival Voltage",
        res_vd_state: "Status",
        res_isc_in: "Nominal Secondary Current (I_n)",
        res_isc_3ph: "3-Phase S.C. Current (I_sc)",
        res_isc_1ph: "1-Phase S.C. Current (approx.)",
        res_isc_cb: "Main Breaker Recommendation",
        err_ss_i: "Please enter motor nominal current.",
        res_ss_inom: "Nominal Motor Current",
        res_lt_flux: "Required Total Luminous Flux",
        res_lt_fix: "Luminous Flux per Fixture",
        res_lt_num: "Required Number of Fixtures",
        res_lt_p: "Total Installed Power",
        res_lt_i: "Estimated Load Current (230V)",
        tip_lt_maint: "Maintenance factor 0.80 is used. Consider room type and reflectance values for actual calculation.",
        res_ss_demaraj: "Startup Current",
        res_ss_cb: "Recommended Motor Breaker",
        res_trafo_sec_cb: "Secondary Main Breaker",
        res_trafo_cab: "Example Main Cable",
                auth_login_progress: "Logging in, please wait...",
        auth_verify_email_err: "Please verify your email! We sent a link during registration.",
        auth_login_fail: "Login failed. Please check your credentials.",
        auth_reg_progress: "Account is being created, please wait...",
        auth_reg_send_verify: "Sending verification email...",
        auth_reg_unverified: "Account created! Email sending failed but account is active.",
        auth_reg_fail: "Registration failed: ",
        auth_unknown_err: "Unknown error occurred.",
        auth_verify_sent: "Sent ✓",
        auth_verify_err: "Error: ",
        auth_forgot_tgl_pw: "Forgot Password",
        auth_forgot_tgl_cncl: "Cancel",
        auth_forgot_err_email: "Please enter your email address.",
        auth_forgot_sending: "Sending...",
        auth_forgot_success: "Password reset link sent! Check your inbox.",
        auth_forgot_btn: "Send Link",
        res_badge_fuse: "Breaker",
        res_badge_breaker: "Breaker",
        res_badge_tms: "MCCB",
        res_badge_parallel: "(Likely Parallel)",
        tip_yd_time: "AI Tip: At this power level, star-delta transition time should be set between 5-8 sec.",
        tip_yd_ss: "AI Tip: Startup process is critical; consider a Soft-Starter as an alternative.",
        hist_del_prompt: "Are you sure you want to delete all history?",
        hist_del_btn: "Delete",
        vd_status_norm: "✅ Normal (< 3%)",
        vd_status_high: "⚠️ High (3-5%)",
        vd_status_crit: "🔴 Critical (> 5%) — Increase cross-section!",
        tip_vd: "AI Tip: Voltage drop exceeds IEC limits. Increase cable cross-section or shorten the line.",
        tip_isc_cap_1: "AI Tip: For Uk=",
        tip_isc_cap_2: "%, breaker breaking capacity must be at least ",
        tip_isc_cap_3: " kA.",
        tip_isc_cable: "Consider the effects of short circuit current in cable and breaker selection.",
        tip_ss_range: "You can set Soft-Starter startup current between 2×-4× depending on motor type and load.",
        unit_pcs: "pcs",
        busbar_req_custom: "Custom Calc Required",
        busbar_ph: "Phase Busbar (L1, L2, L3):",
        busbar_n: "Neutral Busbar (N):",
        busbar_pe: "Earth Busbar (PE):",
        busbar_tip: "Based on your neutral preference (100% or 50%), Earth (PE) is calculated at 50% cross-section per standards.",
        busbar_or: "or",
        msg_saved: "Calculation Saved!",
        hist_import_success: "records imported!",
        export_json: "Export JSON",
        import_json: "Import JSON",
        busbar_err_i: "Please enter current value.",
        auth_sub: "Log in to access your calculations",
        verify_title: "Verify Your Email",
        verify_link_sent: "Your registration link has been sent to",
        verify_mail_suffix: ".",
        btn_ok: "OK",
        btn_resend: "Resend",
        remember_me: "Remember Me",
        forgot_pw_sub: "Enter your email address to receive a password reset link:",
        btn_send_link: "Send Link",
        yd_help: "Calculates the currents of three contactors and thermal relay based on motor current.",
        busbar_help: "Enter the current value to find the suitable busbar according to Panelmaster standards.",
        isc_help: "Calculated at transformer secondary terminals.",
        yd_min: "min.",
        yd_inom_eq: "I_nom",
                ph_username: "engineer123",
        ph_email: "engineer@company.com",
        ph_ex_1000: "e.g. 1000",
        ph_ex_100: "e.g. 100",
        ph_ex_15: "e.g. 15",
        ph_or_direct: "Or enter directly",
        ph_ex_1250: "e.g. 1250",
        ph_ex_10: "e.g. 10",
        ph_ex_7_5: "e.g. 7.5",
        ph_ex_20: "e.g. 20",
        ph_ex_50: "e.g. 50",
        ph_ex_60: "e.g. 60",
        ph_cat: "e.g. Block A Panel",
        ph_notes: "e.g. 5th floor vent motor",
        title_theme: "Toggle Theme",
        title_logout: "Logout",
        default_username: "User",
        res_badge_req_parallel: "Parallel Connection Required",
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
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = translate(el.getAttribute('data-i18n-placeholder'));
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        el.title = translate(el.getAttribute('data-i18n-title'));
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
    return { size: translate('res_badge_req_parallel'), color: 'red' };
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

// Merkezi mod switchleme fonksiyonu
const setAuthMode = (loginMode) => {
    isLoginMode = loginMode;
    document.getElementById('auth-title').innerText = loginMode ? translate('login') : translate('register');
    document.getElementById('btn-auth-submit').innerText = loginMode ? translate('login') : translate('register');
    document.getElementById('group-username').style.display = loginMode ? 'none' : 'flex';
    document.getElementById('auth-username').required = !loginMode;
    document.getElementById('login-extras-row').style.display = loginMode ? 'flex' : 'none';
    document.getElementById('footer-login-mode').style.display = loginMode ? 'block' : 'none';
    document.getElementById('footer-register-mode').style.display = loginMode ? 'none' : 'block';
    const fpp = document.getElementById('forgot-pw-panel');
    if (fpp) fpp.style.display = 'none';
    const fbtn = document.getElementById('btn-forgot-pw');
    if (fbtn) fbtn.innerText = 'Şifremi Unuttum';
    const errEl = document.getElementById('auth-error');
    if (errEl) errEl.style.display = 'none';
};

document.getElementById('btn-toggle-auth').addEventListener('click', () => setAuthMode(false));
document.getElementById('btn-toggle-auth-register').addEventListener('click', () => setAuthMode(true));



document.getElementById('auth-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // CRITICAL: prevent page reload on async form submit
    const email = document.getElementById('auth-email').value.trim();
    const pass = document.getElementById('auth-password').value.trim();
    const username = document.getElementById('auth-username').value.trim();
    const errEl = document.getElementById('auth-error');
    errEl.style.display = 'none';

    const { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, updateProfile } = window.firebaseAuth;

    if (isLoginMode) {
        // Login
        try {
            errEl.style.color = '#3b82f6';
            errEl.innerText = translate('auth_login_progress');
            errEl.style.display = 'block';

            const userCredential = await signInWithEmailAndPassword(auth, email, pass);
            const user = userCredential.user;

            if (!user.emailVerified) {
                errEl.style.color = '#ef4444';
                errEl.innerText = translate('auth_verify_email_err');
                errEl.style.display = 'block';
                await auth.signOut();
                return;
            }

            currentUser = user.displayName || user.email;
            // Beni Hatırla işaretliyse emaili kaydet
            const remChk = document.getElementById('chk-remember');
            if (remChk && remChk.checked) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
            loginSuccess();
        } catch (err) {
            console.error(err);
            errEl.style.color = '#ef4444';
            errEl.innerText = translate('auth_login_fail');
            errEl.style.display = 'block';
        }
    } else {
        // Register
        try {
            isRegistering = true; // Prevent onAuthStateChanged from resetting UI
            errEl.style.color = '#3b82f6';
            errEl.innerText = translate('auth_reg_progress');
            errEl.style.display = 'block';

            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            const user = userCredential.user;

            // Set display name (username)
            if (username) {
                await updateProfile(user, { displayName: username });
            }

            // Send verification email
            errEl.innerText = translate('auth_reg_send_verify');
            try {
                await sendEmailVerification(user);
            } catch (emailErr) {
                console.error("Verification email failed:", emailErr);
                // Still sign out and show notice even if email fails
                errEl.style.color = '#ef8c44';
                errEl.innerText = translate('auth_reg_unverified');
            }

            // Sign out immediately - user must verify email before logging in
            try {
                await auth.signOut();
            } catch (so) { /* ignore signout errors */ }

            // Show verification notice
            errEl.style.display = 'none';
            isRegistering = false; // Reset flag BEFORE showing notice
            const authForm = document.getElementById('auth-form');
            const verifyNotice = document.getElementById('verify-notice');
            const authFooter = document.getElementById('auth-footer-container');
            if (authForm) authForm.style.display = 'none';
            if (authFooter) authFooter.style.display = 'none';
            if (verifyNotice) verifyNotice.style.display = 'block';
            const emailDisplay = document.getElementById('verify-email-display');
            if (emailDisplay) emailDisplay.innerText = email;

        } catch (err) {
            console.error(err);
            errEl.style.color = '#ef4444';
            errEl.innerText = translate('auth_reg_fail') + (err.message || translate('auth_unknown_err'));
            errEl.style.display = 'block';
        } finally {
            if (isRegistering) isRegistering = false; // Only reset if not already done
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
                resendBtn.innerText = translate('auth_verify_sent');
                resendBtn.disabled = true;
            } catch (err) {
                resendBtn.innerText = translate('auth_verify_err') + err.message;
            }
        }
    });
}

// "Giriş Yap" button inside verify-notice (direct link)
const verifyGoLoginBtn = document.getElementById('btn-verify-go-login');
if (verifyGoLoginBtn) {
    verifyGoLoginBtn.addEventListener('click', () => {
        document.getElementById('btn-back-to-login').click();
    });
}

// Şifremi Unuttum toggle
const forgotPwBtn = document.getElementById('btn-forgot-pw');
const forgotPwPanel = document.getElementById('forgot-pw-panel');
if (forgotPwBtn && forgotPwPanel) {
    forgotPwBtn.addEventListener('click', () => {
        const isOpen = forgotPwPanel.style.display !== 'none';
        forgotPwPanel.style.display = isOpen ? 'none' : 'block';
        forgotPwBtn.innerText = isOpen ? translate('auth_forgot_tgl_pw') : translate('auth_forgot_tgl_cncl');
    });
}

// Şifremi Unuttum - Link Gönder
const sendResetBtn = document.getElementById('btn-send-reset');
if (sendResetBtn) {
    sendResetBtn.addEventListener('click', async () => {
        const email = document.getElementById('forgot-pw-email').value.trim();
        const msg = document.getElementById('forgot-pw-msg');
        if (!email) {
            msg.style.color = '#ef4444';
            msg.innerText = translate('auth_forgot_err_email');
            return;
        }
        try {
            sendResetBtn.disabled = true;
            sendResetBtn.innerText = translate('auth_forgot_sending');
            const { auth, sendPasswordResetEmail } = window.firebaseAuth;
            await sendPasswordResetEmail(auth, email);
            msg.style.color = '#22c55e';
            msg.innerText = translate('auth_forgot_success');
            sendResetBtn.innerText = translate('auth_verify_sent');
        } catch (err) {
            msg.style.color = '#ef4444';
            msg.innerText = translate('auth_verify_err') + err.message;
            sendResetBtn.disabled = false;
            sendResetBtn.innerText = translate('auth_forgot_btn');
        }
    });
}

// Beni Hatırla - Firebase persistence
const rememberChk = document.getElementById('chk-remember');
if (rememberChk) {
    rememberChk.addEventListener('change', async () => {
        // Wait for firebase to load
        if (!window.firebaseAuth) return;
        const authInstance = window.firebaseAuth.auth;
        // LOCAL = persist even after browser close; SESSION = clear on close
        const persistenceType = rememberChk.checked ? 'local' : 'session';
        try {
            await authInstance.setPersistence(persistenceType === 'local'
                ? firebase.auth.Auth.Persistence.LOCAL
                : firebase.auth.Auth.Persistence.SESSION);
        } catch (e) { /* ignore */ }
    });
}

// Back to login after registration
const backToLoginBtn = document.getElementById('btn-back-to-login');
if (backToLoginBtn) {
    backToLoginBtn.addEventListener('click', () => {
        document.getElementById('verify-notice').style.display = 'none';
        const authForm = document.getElementById('auth-form');
        if (authForm) {
            authForm.style.display = 'flex';
            authForm.reset();
        }
        const authFooter = document.getElementById('auth-footer-container');
        if (authFooter) authFooter.style.display = 'block';
        setAuthMode(true);
    });
}


document.getElementById('btn-logout').addEventListener('click', async () => {
    const { auth, signOut } = window.firebaseAuth;
    await signOut(auth);
    currentUser = null;
    document.getElementById('auth-form').reset();
    // Beni Hatırla aktifse emaili geri yaz
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        document.getElementById('auth-email').value = rememberedEmail;
        document.getElementById('chk-remember').checked = true;
    }
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
    // Beni Hatırla: kayıtlı email varsa forma yaz
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        document.getElementById('auth-email').value = rememberedEmail;
        document.getElementById('chk-remember').checked = true;
    }
    // Wait for firebaseAuth to be available
    const checkAuth = setInterval(() => {
        if (window.firebaseAuth) {
            clearInterval(checkAuth);
            const { auth, onAuthStateChanged } = window.firebaseAuth;
            onAuthStateChanged(auth, (user) => {
                if (user && user.emailVerified) {
                    currentUser = user.displayName || user.email;
                    loginSuccess();
                }
                // Auth screen is the default state in HTML - no need to reset here
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
    alert(translate('msg_saved'));
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
        { label: translate('res_cb'), value: badge(`${cb} A ` + translate('res_badge_fuse'), 'green') },
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
        { label: translate('res_cb'), value: badge(`${cb} A ` + translate('res_badge_breaker'), 'green') },
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
        { label: translate('res_trafo_sec_cb'), value: badge(`${cb} A ` + translate('res_badge_tms'), 'green') },
        { label: translate('res_trafo_cab'), value: cab.size.includes(translate('res_badge_req_parallel')) ? badge(cab.size + ' ' + translate('res_badge_parallel'), 'red') : badge(`${cab.size} mm² ` + translate('res_badge_parallel'), 'yellow') }
    ]);
});



// 4.1. kVAR to Current (New Feature)
document.getElementById('form-kvar-current').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = parseFloat(document.getElementById('inp-kvc-q').value);
    const v = parseFloat(document.getElementById('inp-kvc-v').value);

    if (isNaN(q) || isNaN(v)) return alert(translate('err_kvar_fill'));

    // Ic = (Qc * 1000) / (√3 × V)
    const ic = (q * 1000) / (Math.sqrt(3) * v);

    // IEC Endüstriyel standart: Kompanzasyon panosu ana şalteri ve kablosu In * 1.5 olarak seçilir.
    const ic_safe = ic * 1.5;
    const breaker = getBreaker(ic_safe);

    lastCalcResult = { type: 'KVAR_CURRENT', inputs: { q, v }, results: { ic, breaker } };

    renderResult('res-kvar-current', [
        { label: translate('res_kvar_q'), value: `${q} kVAR` },
        { label: translate('res_kvar_in'), value: `${ic.toFixed(2)} A` },
        { label: translate('res_kvar_id'), value: `${ic_safe.toFixed(2)} A` },
        { label: translate('res_kvar_cb'), value: badge(`${breaker} A`, 'green') }
    ], [
        '💡 ' + translate('tip_kvar_iec')
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

    if (isNaN(v)) return alert(translate('err_yd_v'));
    if (isNaN(p) && isNaN(I)) return alert(translate('err_yd_p_i'));

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
        { label: translate('res_yd_inom'), value: `${I.toFixed(2)} A` },
        { label: translate('res_yd_fuse'), value: badge(`${cb} A`, 'green') },
        { label: translate('res_yd_km'), value: badge(`${translate('yd_min')} ${km} A   (${I_km.toFixed(2)} A)`, 'green') },
        { label: translate('res_yd_ky'), value: badge(`${translate('yd_min')} ${ky} A   (${I_ky.toFixed(2)} A)`, 'blue') },
        { label: translate('res_yd_kd'), value: badge(`${translate('yd_min')} ${kd} A   (${I_kdel.toFixed(2)} A)`, 'green') },
        { label: translate('res_yd_term'), value: badge(`${I_term.toFixed(2)} A (= ${translate('yd_inom_eq')})`, 'yellow') },
    ], [
        translate('tip_yd_cont'),
        I > 30 ? translate('tip_yd_time') : '',
        p > 18.5 ? translate('tip_yd_ss') : ''
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
            <i class="ph ph-trash"></i> ${translate('hist_del_btn')}
          </button>
        </div>
      </div>
    `;
    });
};

document.getElementById('btn-clear-history').addEventListener('click', async () => {
    if (confirm(translate('hist_del_prompt'))) {
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

    if ([v, I, L, A].some(isNaN)) return alert(translate('err_fill_all'));

    // ΔU = (k × ρ × L × I) / A   where k=2 for 1-ph, √3 for 3-ph
    const k = phase === 1 ? 2 : Math.sqrt(3);
    const dU = (k * rho * L * I) / A;       // Volts
    const pct = (dU / v) * 100;

    let col = 'green', status = translate('vd_status_norm');
    if (pct > 3 && pct <= 5) { col = 'yellow'; status = translate('vd_status_high'); }
    if (pct > 5) { col = 'red'; status = translate('vd_status_crit'); }

    lastCalcResult = { type: 'VDROP', inputs: { v, I, L, A, phase }, results: { dU, pct } };

    renderResult('res-vdrop', [
        { label: translate('res_vd_v'), value: badge(`${dU.toFixed(2)} V`, col) },
        { label: translate('res_vd_pct'), value: badge(`${pct.toFixed(2)} %`, col) },
        { label: translate('res_vd_arr'), value: `${(v - dU).toFixed(1)} V` },
        { label: translate('res_vd_state'), value: badge(status, col) },
    ], pct > 3 ? [translate('tip_vd')] : []);
});

// ===== 7. Short Circuit Current =====
document.getElementById('form-isc').addEventListener('submit', (e) => {
    e.preventDefault();
    const kva = parseFloat(document.getElementById('inp-isc-kva').value);
    const v = parseFloat(document.getElementById('inp-isc-v').value);
    const uk = parseFloat(document.getElementById('inp-isc-uk').value);
    const rt3 = Math.sqrt(3);

    if ([kva, v, uk].some(isNaN)) return alert(translate('err_fill_all'));

    // Isc = S / (√3 × V × Uk)
    const I_nom = (kva * 1000) / (rt3 * v);        // Nominal secondary current
    const I_sc = (kva * 1000) / (rt3 * v * (uk / 100)); // Short circuit current
    const I_sc1ph = (kva * 1000) / (v * (uk / 100));    // Approx single-phase fault

    const cb_main = getBreaker(I_nom);

    lastCalcResult = { type: 'ISC', inputs: { kva, v, uk }, results: { I_nom, I_sc } };

    renderResult('res-isc', [
        { label: translate('res_isc_in'), value: `${I_nom.toFixed(1)} A` },
        { label: translate('res_isc_3ph'), value: badge(`${(I_sc / 1000).toFixed(2)} kA`, 'red') },
        { label: translate('res_isc_1ph'), value: badge(`${(I_sc1ph / 1000).toFixed(2)} kA`, 'yellow') },
        { label: translate('res_isc_cb'), value: badge(`${cb_main} A`, 'green') },
    ], [
        `${translate('tip_isc_cap_1')}${uk}${translate('tip_isc_cap_2')}${(I_sc / 1000).toFixed(1)}${translate('tip_isc_cap_3')}`,
        translate('tip_isc_cable')
    ]);
});

// ===== 8. Soft-Starter =====
document.getElementById('form-ss').addEventListener('submit', (e) => {
    e.preventDefault();
    const I = parseFloat(document.getElementById('inp-ss-i').value);
    const mult = parseFloat(document.getElementById('inp-ss-mult').value);

    if (isNaN(I)) return alert(translate('err_ss_i'));

    const I_start = I * mult;
    const cb = getBreaker(I * 1.25);

    renderResult('res-ss', [
        { label: translate('res_ss_inom'), value: `${I.toFixed(2)} A` },
        { label: `${translate('res_ss_demaraj')} (×${mult})`, value: badge(`${I_start.toFixed(2)} A`, 'yellow') },
        { label: translate('res_ss_cb'), value: badge(`${cb} A`, 'green') },
    ], [translate('tip_ss_range')]);
});

// ===== 9. Lighting =====
document.getElementById('form-light').addEventListener('submit', (e) => {
    e.preventDefault();
    const area = parseFloat(document.getElementById('inp-lt-area').value);
    const lux = parseFloat(document.getElementById('inp-lt-lux').value);
    const w = parseFloat(document.getElementById('inp-lt-w').value);
    const lumW = parseFloat(document.getElementById('inp-lt-eff').value);

    if ([area, lux, w, lumW].some(isNaN)) return alert(translate('err_fill_all'));

    // Required total lumens (maintenance factor 0.80)
    const totalLm = (area * lux) / 0.80;
    const lumPerFix = w * lumW;
    const numFix = Math.ceil(totalLm / lumPerFix);
    const totalW = numFix * w;
    const I_load = (totalW / 1000) / (0.23 * 0.9); // Assume 230V, cosφ=0.9, 1-phase

    renderResult('res-light', [
        { label: translate('res_lt_flux'), value: `${Math.round(totalLm).toLocaleString()} lm` },
        { label: translate('res_lt_fix'), value: `${Math.round(lumPerFix)} lm` },
        { label: translate('res_lt_num'), value: badge(`${numFix} ` + translate('unit_pcs'), 'green') },
        { label: translate('res_lt_p'), value: `${totalW} W` },
        { label: translate('res_lt_i'), value: `${I_load.toFixed(2)} A` },
    ], [translate('tip_lt_maint')]);
});

// ===== 10. HP <-> kW Converter =====
// (Existing converter functions if any)

// ===== 11. Busbar Calculator =====
document.getElementById('form-busbar').addEventListener('submit', (e) => {
    e.preventDefault();
    const I = parseFloat(document.getElementById('inp-bus-i').value);
    const nIsHalf = document.getElementById('tog-bus-n-half').checked;
    if (isNaN(I)) return alert(translate('busbar_err_i'));

    let barra = "";
    let barraN = "";
    let barraPE = "";
    let count = "1";
    let color = "green";

    if (I <= 250) {
        barra = "20 x 5";
        barraN = "20 x 5";
        barraPE = "20 x 3 " + translate('busbar_or') + " 15x5"; // ~50-60mm2 (1/2 of 100mm2)
    }
    else if (I <= 400) {
        barra = "30 x 5";
        barraN = nIsHalf ? "20 x 5" : "30 x 5";
        barraPE = "15 x 5";
    }
    else if (I <= 630) {
        barra = "40 x 10";
        barraN = nIsHalf ? "40 x 5" : "40 x 10";
        barraPE = "40 x 5";
    }
    else if (I <= 800) {
        barra = "50 x 10";
        barraN = nIsHalf ? "50 x 5" : "50 x 10";
        barraPE = "50 x 5";
    }
    else if (I <= 1000) {
        barra = "60 x 10";
        barraN = nIsHalf ? "30 x 10" : "60 x 10";
        barraPE = "30 x 10";
    }
    else if (I <= 1250) {
        barra = "80 x 10";
        barraN = nIsHalf ? "40 x 10" : "80 x 10";
        barraPE = "40 x 10";
    }
    else if (I <= 1600) {
        barra = "100 x 10";
        barraN = nIsHalf ? "50 x 10" : "100 x 10";
        barraPE = "50 x 10";
    }
    else if (I <= 2000) {
        barra = "2 x (60 x 10)";
        barraN = nIsHalf ? "1 x (60 x 10)" : "2 x (60 x 10)";
        barraPE = "1 x (60 x 10)";
        count = "2";
    }
    else if (I <= 2500) {
        barra = "2 x (80 x 10)";
        barraN = nIsHalf ? "1 x (80 x 10)" : "2 x (80 x 10)";
        barraPE = "1 x (80 x 10)";
        count = "2";
    }
    else if (I <= 3200) {
        barra = "2 x (100 x 10)";
        barraN = nIsHalf ? "1 x (100 x 10)" : "2 x (100 x 10)";
        barraPE = "1 x (100 x 10)";
        count = "2";
    }
    else { barra = translate('busbar_req_custom'); barraN = "-"; barraPE = "-"; count = "-"; color = "red"; }

    const container = document.getElementById('res-busbar');
    container.innerHTML = `
        <div class="res-row">
            <span class="res-label">${translate('busbar_ph')}</span>
            <span class="res-value">${barra} mm</span>
        </div>
        <div class="res-row">
            <span class="res-label">${translate('busbar_n')}</span>
            <span class="res-value" style="color:var(--primary)">${barraN} mm</span>
        </div>
        <div class="res-row">
            <span class="res-label">${translate('busbar_pe')}</span>
            <span class="res-value" style="color:var(--status-green)">${barraPE} mm</span>
        </div>
        <div class="ai-tip">
            <i class="ph-fill ph-info"></i>
            <span>${translate('busbar_tip')}</span>
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
exportBtn.innerHTML = '<i class="ph ph-download-simple"></i> ' + translate('export_json');
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
    alert(`${items.length} ` + translate('hist_import_success'));
    loadHistory(); loadHistoryCategories();
};

const importBtn = document.createElement('button');
importBtn.className = 'btn-text';
importBtn.style.fontSize = '0.8rem';
importBtn.innerHTML = '<i class="ph ph-upload-simple"></i> ' + translate('import_json');
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
