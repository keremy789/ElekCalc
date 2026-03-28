import sys

with open('www/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

replacements_html = [
    (
        '<p id="auth-subtitle" class="text-muted">Hesaplamalarına ulaşmak için giriş yap</p>',
        '<p id="auth-subtitle" class="text-muted" data-i18n="auth_sub">Hesaplamalarına ulaşmak için giriş yap</p>'
    ),
    (
        '<h2 style="margin:1rem 0 0.5rem">E-postanı Doğrula</h2>',
        '<h2 style="margin:1rem 0 0.5rem" data-i18n="verify_title">E-postanı Doğrula</h2>'
    ),
    (
        '<p class="text-muted" id="verify-text">Kayıt linkiniz <strong id="verify-email-display"></strong> mail',
        '<p class="text-muted" id="verify-text"><span data-i18n="verify_link_sent">Kayıt linkiniz</span> <strong id="verify-email-display"></strong> <span data-i18n="verify_mail_suffix">mail'
    ),
    (
        'adresinize gönderilmiştir.</p>',
        'adresinize gönderilmiştir.</span></p>'
    ),
    (
        '<button class="btn btn-primary btn-block" style="margin-top:1.5rem" id="btn-back-to-login">Tamam</button>',
        '<button class="btn btn-primary btn-block" style="margin-top:1.5rem" id="btn-back-to-login" data-i18n="btn_ok">Tamam</button>'
    ),
    (
        '<button class="btn-text" style="margin-top:0.8rem; display:block; width:100%" id="btn-resend-verify">Tekrar',
        '<button class="btn-text" style="margin-top:0.8rem; display:block; width:100%" id="btn-resend-verify" data-i18n="btn_resend">Tekrar'
    ),
    (
        '<p style="margin-top:1.2rem;font-size:0.9rem;">Zaten hesabınız var mı?',
        '<p style="margin-top:1.2rem;font-size:0.9rem;"><span data-i18n="has_account">Zaten hesabınız var mı?</span>'
    ),
    (
        '<button type="button" class="btn-text" id="btn-verify-go-login">Giriş Yap</button>',
        '<button type="button" class="btn-text" id="btn-verify-go-login" data-i18n="login">Giriş Yap</button>'
    ),
    (
        'Beni Hatırla',
        '<span data-i18n="remember_me">Beni Hatırla</span>'
    ),
    (
        '<button type="button" class="btn-text" id="btn-forgot-pw" style="font-size:0.85rem;">Şifremi Unuttum</button>',
        '<button type="button" class="btn-text" id="btn-forgot-pw" style="font-size:0.85rem;" data-i18n="auth_forgot_tgl_pw">Şifremi Unuttum</button>'
    ),
    (
        '<p style="font-size:0.85rem; margin-bottom:0.6rem;">E-posta adresinizi girin, şifre sıfırlama linki',
        '<p style="font-size:0.85rem; margin-bottom:0.6rem;" data-i18n="forgot_pw_sub">E-posta adresinizi girin, şifre sıfırlama linki'
    ),
    (
        '<button type="button" class="btn btn-secondary btn-block" id="btn-send-reset">Link Gönder</button>',
        '<button type="button" class="btn btn-secondary btn-block" id="btn-send-reset" data-i18n="auth_forgot_btn">Link Gönder</button>'
    ),
    (
        '<p class="help-text" style="margin-bottom:1rem;">Motor akımına göre üç kontaktör ve termik röle akımlarını',
        '<p class="help-text" style="margin-bottom:1rem;" data-i18n="yd_help">Motor akımına göre üç kontaktör ve termik röle akımlarını'
    ),
    (
        '<p class="help-text" style="margin-bottom:1rem;">Akım değerini girin, Panelmaster standartlarına göre uygun',
        '<p class="help-text" style="margin-bottom:1rem;" data-i18n="busbar_help">Akım değerini girin, Panelmaster standartlarına göre uygun'
    ),
    (
        '<p class="help-text" style="margin-bottom:1rem;">Trafo sekonder terminallerinde hesaplanır.</p>',
        '<p class="help-text" style="margin-bottom:1rem;" data-i18n="isc_help">Trafo sekonder terminallerinde hesaplanır.</p>'
    )
]

for old, new in replacements_html:
    if old not in html:
        print("MISSING HTML:", old[:40])
    html = html.replace(old, new)

with open('www/index.html', 'w', encoding='utf-8') as f:
    f.write(html)


with open('www/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

new_keys = {
    "auth_login_progress": {"tr": "Giriş yapılıyor, lütfen bekleyin...", "en": "Logging in, please wait..."},
    "auth_verify_email_err": {"tr": "Lütfen e-postanızı doğrulayın! Kayıt olurken size bir link gönderdik.", "en": "Please verify your email! We sent a link during registration."},
    "auth_login_fail": {"tr": "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.", "en": "Login failed. Please check your credentials."},
    "auth_reg_progress": {"tr": "Hesabınız oluşturuluyor, lütfen bekleyin...", "en": "Account is being created, please wait..."},
    "auth_reg_send_verify": {"tr": "Doğrulama e-postası gönderiliyor...", "en": "Sending verification email..."},
    "auth_reg_unverified": {"tr": "Hesap oluşturuldu! E-posta gönderilemedi ama hesabınız aktif.", "en": "Account created! Email sending failed but account is active."},
    "auth_reg_fail": {"tr": "Kayıt başarısız: ", "en": "Registration failed: "},
    "auth_unknown_err": {"tr": "Bilinmeyen bir hata oluştu.", "en": "Unknown error occurred."},
    "auth_verify_sent": {"tr": "Gönderildi ✓", "en": "Sent ✓"},
    "auth_verify_err": {"tr": "Hata: ", "en": "Error: "},
    "auth_forgot_tgl_pw": {"tr": "Şifremi Unuttum", "en": "Forgot Password"},
    "auth_forgot_tgl_cncl": {"tr": "Vazgeç", "en": "Cancel"},
    "auth_forgot_err_email": {"tr": "Lütfen e-posta adresinizi girin.", "en": "Please enter your email address."},
    "auth_forgot_sending": {"tr": "Gönderiliyor...", "en": "Sending..."},
    "auth_forgot_success": {"tr": "şifre sıfırlama linki gönderildi! Mail kutunuzu kontrol edin.", "en": "Password reset link sent! Check your inbox."},
    "auth_forgot_btn": {"tr": "Link Gönder", "en": "Send Link"},
    "res_badge_fuse": {"tr": "Sigorta", "en": "Breaker"},
    "res_badge_breaker": {"tr": "Şalter", "en": "Breaker"},
    "res_badge_tms": {"tr": "TMŞ", "en": "MCCB"},
    "res_badge_parallel": {"tr": "(Muhtemel Paralel)", "en": "(Likely Parallel)"},
    "tip_yd_time": {"tr": "AI Önerisi: Bu güç seviyesinde geçiş süresi (Y→Δ) 5–8 sn arası ayarlanmalıdır.", "en": "AI Tip: At this power level, star-delta transition time should be set between 5-8 sec."},
    "tip_yd_ss": {"tr": "AI Önerisi: Devreye alma süreci kritik; alternatif olarak Soft-Starter değerlendirilebilir.", "en": "AI Tip: Startup process is critical; consider a Soft-Starter as an alternative."},
    "hist_del_prompt": {"tr": "Tüm geçmişinizi silmek istediğinize emin misiniz?", "en": "Are you sure you want to delete all history?"},
    "hist_del_btn": {"tr": "Sil", "en": "Delete"},
    "vd_status_norm": {"tr": "✅ Normal (< 3%)", "en": "✅ Normal (< 3%)"},
    "vd_status_high": {"tr": "⚠️ Yüksek (3–5%)", "en": "⚠️ High (3-5%)"},
    "vd_status_crit": {"tr": "🔴 Kritik (> 5%) — Kesit Artırın!", "en": "🔴 Critical (> 5%) — Increase cross-section!"},
    "tip_vd": {"tr": "AI Önerisi: Gerilim düşümü IEC sınırını aşıyor. Kablo kesitini büyütün veya hattı kısaltın.", "en": "AI Tip: Voltage drop exceeds IEC limits. Increase cable cross-section or shorten the line."},
    "tip_isc_cap_1": {"tr": "AI Önerisi: Uk=", "en": "AI Tip: For Uk="},
    "tip_isc_cap_2": {"tr": "% için kesici kesme kapasitesi en az ", "en": "%, breaker breaking capacity must be at least "},
    "tip_isc_cap_3": {"tr": " kA olmalıdır.", "en": " kA."},
    "tip_isc_cable": {"tr": "Kablo ve şalter seçiminde kısa devre akımının etkileri göz önünde bulundurulmalıdır.", "en": "Consider the effects of short circuit current in cable and breaker selection."},
    "tip_ss_range": {"tr": "Soft-Starter devreye alma akımını motor tipine ve yüke göre 2×–4× arasında ayarlayabilirsiniz.", "en": "You can set Soft-Starter startup current between 2×-4× depending on motor type and load."},
    "unit_pcs": {"tr": "adet", "en": "pcs"},
    "busbar_req_custom": {"tr": "Özel Hesaplama Gerekli", "en": "Custom Calc Required"},
    "busbar_ph": {"tr": "Faz Barası (L1, L2, L3):", "en": "Phase Busbar (L1, L2, L3):"},
    "busbar_n": {"tr": "Nötr Barası (N):", "en": "Neutral Busbar (N):"},
    "busbar_pe": {"tr": "Toprak Barası (PE):", "en": "Earth Busbar (PE):"},
    "busbar_tip": {"tr": "Nötr tercihinize göre (%100 veya %50), Toprak (PE) ise standart gereği %50 kesitinde hesaplanmıştır.", "en": "Based on your neutral preference (100% or 50%), Earth (PE) is calculated at 50% cross-section per standards."},
    "busbar_or": {"tr": "veya", "en": "or"},
    "msg_saved": {"tr": "Hesaplama Kaydedildi!", "en": "Calculation Saved!"},
    "hist_import_success": {"tr": "kayıt içe aktarıldı!", "en": "records imported!"},
    "export_json": {"tr": "JSON Dışa", "en": "Export JSON"},
    "import_json": {"tr": "JSON İçe", "en": "Import JSON"},
    "busbar_err_i": {"tr": "Lütfen akım değerini girin.", "en": "Please enter current value."},
    "auth_sub": {"tr": "Hesaplamalarına ulaşmak için giriş yap", "en": "Log in to access your calculations"},
    "verify_title": {"tr": "E-postanı Doğrula", "en": "Verify Your Email"},
    "verify_link_sent": {"tr": "Kayıt linkiniz", "en": "Your registration link has been sent to"},
    "verify_mail_suffix": {"tr": "mail adresinize gönderilmiştir.", "en": "."},
    "btn_ok": {"tr": "Tamam", "en": "OK"},
    "btn_resend": {"tr": "Tekrar gönder", "en": "Resend"},
    "remember_me": {"tr": "Beni Hatırla", "en": "Remember Me"},
    "forgot_pw_sub": {"tr": "E-posta adresinizi girin, şifre sıfırlama linki", "en": "Enter your email address to receive a password reset link:"},
    "btn_send_link": {"tr": "Link Gönder", "en": "Send Link"},
    "yd_help": {"tr": "Motor akımına göre üç kontaktör ve termik röle akımlarını", "en": "Calculates the currents of three contactors and thermal relay based on motor current."},
    "busbar_help": {"tr": "Akım değerini girin, Panelmaster standartlarına göre uygun", "en": "Enter the current value to find the suitable busbar according to Panelmaster standards."},
    "isc_help": {"tr": "Trafo sekonder terminallerinde hesaplanır.", "en": "Calculated at transformer secondary terminals."},
    "yd_min": {"tr": "min.", "en": "min."},
    "yd_inom_eq": {"tr": "I_nom", "en": "I_nom"}
}

tr_additions = "\n".join([f'        {k}: "{v["tr"]}",' for k,v in new_keys.items()])
en_additions = "\n".join([f'        {k}: "{v["en"]}",' for k,v in new_keys.items()])

app_js = app_js.replace('nav_busbar: "Bara"', tr_additions + '\n        nav_busbar: "Bara"')
app_js = app_js.replace('nav_busbar: "Busbar"', en_additions + '\n        nav_busbar: "Busbar"')

replacements_app_js = [
    ('errEl.innerText = "Giriş yapılıyor, lütfen bekleyin...";', "errEl.innerText = translate('auth_login_progress');"),
    ('errEl.innerText = "Lütfen e-postanızı doğrulayın! Kayıt olurken size bir link gönderdik.";', "errEl.innerText = translate('auth_verify_email_err');"),
    ('errEl.innerText = "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.";', "errEl.innerText = translate('auth_login_fail');"),
    ('errEl.innerText = "Hesabınız oluşturuluyor, lütfen bekleyin...";', "errEl.innerText = translate('auth_reg_progress');"),
    ('errEl.innerText = "Doğrulama e-postası gönderiliyor...";', "errEl.innerText = translate('auth_reg_send_verify');"),
    ('errEl.innerText = "Hesap oluşturuldu! E-posta gönderilemedi ama hesabınız aktif.";', "errEl.innerText = translate('auth_reg_unverified');"),
    ('errEl.innerText = "Kayıt başarısız: " + (err.message || "Bilinmeyen bir hata oluştu.");', "errEl.innerText = translate('auth_reg_fail') + (err.message || translate('auth_unknown_err'));"),
    
    ("resendBtn.innerText = 'Gönderildi ✓';", "resendBtn.innerText = translate('auth_verify_sent');"),
    ("resendBtn.innerText = 'Hata: ' + err.message;", "resendBtn.innerText = translate('auth_verify_err') + err.message;"),
    
    ("forgotPwBtn.innerText = isOpen ? 'Şifremi Unuttum' : 'Vazgeç';", "forgotPwBtn.innerText = isOpen ? translate('auth_forgot_tgl_pw') : translate('auth_forgot_tgl_cncl');"),
    ("msg.innerText = 'Lütfen e-posta adresinizi girin.';", "msg.innerText = translate('auth_forgot_err_email');"),
    ("sendResetBtn.innerText = 'Gönderiliyor...';", "sendResetBtn.innerText = translate('auth_forgot_sending');"),
    ("msg.innerText = 'şifre sıfırlama linki gönderildi! Mail kutunuzu kontrol edin.';", "msg.innerText = translate('auth_forgot_success');"),
    ("sendResetBtn.innerText = 'Gönderildi ✓';", "sendResetBtn.innerText = translate('auth_verify_sent');"),
    ("msg.innerText = 'Hata: ' + err.message;", "msg.innerText = translate('auth_verify_err') + err.message;"),
    ("sendResetBtn.innerText = 'Link Gönder';", "sendResetBtn.innerText = translate('auth_forgot_btn');"),
    
    ("badge(`${cb} A Sigorta`, 'green')", "badge(`${cb} A ` + translate('res_badge_fuse'), 'green')"),
    ("badge(`${cb} A Şalter`, 'green')", "badge(`${cb} A ` + translate('res_badge_breaker'), 'green')"),
    ("badge(`${cb} A TMŞ`, 'green')", "badge(`${cb} A ` + translate('res_badge_tms'), 'green')"),
    ("badge(`${cab.size} mm² (Muhtemel Paralel)`, 'yellow')", "badge(`${cab.size} mm² ` + translate('res_badge_parallel'), 'yellow')"),
    ('alert("Hesaplama Kaydedildi!");', "alert(translate('msg_saved'));"),
    
    ("badge(`min. ${km} A   (${I_km.toFixed(2)} A)`, 'green')", "badge(`${translate('yd_min')} ${km} A   (${I_km.toFixed(2)} A)`, 'green')"),
    ("badge(`min. ${ky} A   (${I_ky.toFixed(2)} A)`, 'blue')", "badge(`${translate('yd_min')} ${ky} A   (${I_ky.toFixed(2)} A)`, 'blue')"),
    ("badge(`min. ${kd} A   (${I_kdel.toFixed(2)} A)`, 'green')", "badge(`${translate('yd_min')} ${kd} A   (${I_kdel.toFixed(2)} A)`, 'green')"),
    ("badge(`${I_term.toFixed(2)} A (= I_nom)`, 'yellow')", "badge(`${I_term.toFixed(2)} A (= ${translate('yd_inom_eq')})`, 'yellow')"),
    
    ("I > 30 ? 'AI Önerisi: Bu güç seviyesinde geçiş süresi (Y→Δ) 5–8 sn arası ayarlanmalıdır.' : ''", "I > 30 ? translate('tip_yd_time') : ''"),
    ("p > 18.5 ? 'AI Önerisi: Devreye alma süreci kritik; alternatif olarak Soft-Starter değerlendirilebilir.' : ''", "p > 18.5 ? translate('tip_yd_ss') : ''"),
    
    ("alert('Lütfen akım değerini girin.');", "alert(translate('busbar_err_i'));"),
    ("if (confirm(\"Tüm geçmişinizi silmek istediğinize emin misiniz?\")) {", "if (confirm(translate('hist_del_prompt'))) {"),
    ('<i class="ph ph-trash"></i> Sil', '<i class="ph ph-trash"></i> " + translate(\'hist_del_btn\') + "'),
    
    ("col = 'green', status = '✅ Normal (< 3%)';", "col = 'green', status = translate('vd_status_norm');"),
    ("col = 'yellow'; status = '⚠️ Yüksek (3–5%)';", "col = 'yellow'; status = translate('vd_status_high');"),
    ("col = 'red'; status = '🔴 Kritik (> 5%) — Kesit Artırın!';", "col = 'red'; status = translate('vd_status_crit');"),
    ("['AI Önerisi: Gerilim düşümü IEC sınırını aşıyor. Kablo kesitini büyütün veya hattı kısaltın.']", "[translate('tip_vd')]"),
    
    ("`AI Önerisi: Uk=${uk}% için kesici kesme kapasitesi en az ${(I_sc / 1000).toFixed(1)} kA olmalıdır.`", "`${translate('tip_isc_cap_1')}${uk}${translate('tip_isc_cap_2')}${(I_sc / 1000).toFixed(1)}${translate('tip_isc_cap_3')}`"),
    ("'Kablo ve şalter seçiminde kısa devre akımının etkileri göz önünde bulundurulmalıdır.'", "translate('tip_isc_cable')"),
    ("['Soft-Starter devreye alma akımını motor tipine ve yüke göre 2×–4× arasında ayarlayabilirsiniz.']", "[translate('tip_ss_range')]"),
    ("badge(`${numFix} adet`, 'green')", "badge(`${numFix} ` + translate('unit_pcs'), 'green')"),
    
    ('barra = "Özel Hesaplama Gerekli";', "barra = translate('busbar_req_custom');"),
    ('barraPE = "20 x 3 veya 15x5";', 'barraPE = "20 x 3 " + translate(\'busbar_or\') + " 15x5";'),
    ('<span class="res-label">Faz Barası (L1, L2, L3):</span>', '<span class="res-label">" + translate(\'busbar_ph\') + "</span>'),
    ('<span class="res-label">Nötr Barası (N):</span>', '<span class="res-label">" + translate(\'busbar_n\') + "</span>'),
    ('<span class="res-label">Toprak Barası (PE):</span>', '<span class="res-label">" + translate(\'busbar_pe\') + "</span>'),
    ('<span>Nötr tercihinize göre (%100 veya %50), Toprak (PE) ise standart gereği %50 kesitinde hesaplanmıştır.</span>', '<span>" + translate(\'busbar_tip\') + "</span>'),
    
    ('alert(`${items.length} kayıt içe aktarıldı!`);', "alert(`${items.length} ` + translate('hist_import_success'));"),
    ('<i class="ph ph-download-simple"></i> JSON Dışa', '<i class="ph ph-download-simple"></i> " + translate(\'export_json\')'),
    ('<i class="ph ph-upload-simple"></i> JSON İçe', '<i class="ph ph-upload-simple"></i> " + translate(\'import_json\')')
]

for old, new in replacements_app_js:
    if old not in app_js:
        print("MISSING JS:", old[:50])
    app_js = app_js.replace(old, new)

with open('www/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)

print("Translations fixed!")
