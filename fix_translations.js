const fs = require('fs');
let code = fs.readFileSync('www/app.js', 'utf8');

const replacements = [
    { tr: 'Lütfen güç ve gerilim değerlerini girin.', en: 'Please enter power and voltage values.', key: 'err_kvar_fill' },
    { tr: 'Pano/Kondansatör Gücü', en: 'Panel/Capacitor Power', key: 'res_kvar_q' },
    { tr: 'Nominal Akım (In)', en: 'Nominal Current (In)', key: 'res_kvar_in' },
    { tr: 'Tasarım Akımı (In × 1.5)', en: 'Design Current (In × 1.5)', key: 'res_kvar_id' },
    { tr: 'Önerilen Ana Şalter / TMŞ', en: 'Recommended Main Breaker / MCCB', key: 'res_kvar_cb' },
    { tr: 'IEC standartlarına göre kapasitif yüklerde harmonikler ve deşarj akımları nedeniyle şalter ve kablo kesiti nominal akımın en az 1.35 - 1.5 katı olarak tasarlanmalıdır. Hesaplamada 1.5 çarpanı kullanılmıştır.', en: 'According to IEC standards, the breaker and cable cross-section should be designed as at least 1.35-1.5 times the nominal current due to harmonics and discharge currents in capacitive loads. A multiplier of 1.5 is used in the calculation.', key: 'tip_kvar_iec' },

    { tr: 'Gerilim giriniz.', en: 'Please enter voltage.', key: 'err_yd_v' },
    { tr: 'Motor gücü (kW) veya akım (A) giriniz.', en: 'Please enter motor power (kW) or current (A).', key: 'err_yd_p_i' },
    { tr: 'Motor Nominal Akımı (I)', en: 'Motor Nominal Current (I)', key: 'res_yd_inom' },
    { tr: 'Motor Sigortası', en: 'Motor Breaker', key: 'res_yd_fuse' },
    { tr: 'KM — Ana Kontaktör  (I)', en: 'KM — Main Contactor (I)', key: 'res_yd_km' },
    { tr: 'KY — Yıldız Kontaktör  (I/√3)', en: 'KY — Star Contactor (I/√3)', key: 'res_yd_ky' },
    { tr: 'KΔ — Üçgen Kontaktör  (I)', en: 'KΔ — Delta Contactor (I)', key: 'res_yd_kd' },
    { tr: 'Termik Röle Ayar Akımı', en: 'Thermal Relay Setting Current', key: 'res_yd_term' },
    { tr: '⚡ KM ve KΔ kontaktörleri aynı boyutta seçilir (tam hat akımı = I). Yalnızca KY daha küçük seçilir (I/√3 ≈ 0.578 × I).', en: '⚡ KM and KΔ contactors are selected in the same size (full line current = I). Only KY is selected smaller (I/√3 ≈ 0.578 × I).', key: 'tip_yd_cont' },

    { tr: 'Lütfen tüm alanları doldurun.', en: 'Please fill in all fields.', key: 'err_fill_all' },
    { tr: 'Gerilim Düşümü (ΔU)', en: 'Voltage Drop (ΔU)', key: 'res_vd_v' },
    { tr: 'Düşüm Yüzdesi (ΔU%)', en: 'Drop Percentage (ΔU%)', key: 'res_vd_pct' },
    { tr: 'Varış Gerilimi', en: 'Arrival Voltage', key: 'res_vd_arr' },
    { tr: 'Durum', en: 'Status', key: 'res_vd_state' },

    { tr: 'Nominal Sekonder Akım (I_n)', en: 'Nominal Secondary Current (I_n)', key: 'res_isc_in' },
    { tr: 'Üç Faz K.D. Akımı (I_sc)', en: '3-Phase S.C. Current (I_sc)', key: 'res_isc_3ph' },
    { tr: 'T.F. K.D. Akımı (yakl.)', en: '1-Phase S.C. Current (approx.)', key: 'res_isc_1ph' },
    { tr: 'Ana Sigorta Önerisi', en: 'Main Breaker Recommendation', key: 'res_isc_cb' },

    { tr: 'Motor nominal akımını giriniz.', en: 'Please enter motor nominal current.', key: 'err_ss_i' },
    { tr: 'Nominal Motor Akımı', en: 'Nominal Motor Current', key: 'res_ss_inom' },

    { tr: 'Gerekli Toplam Işık Akısı', en: 'Required Total Luminous Flux', key: 'res_lt_flux' },
    { tr: 'Armatür Başına Işık Akısı', en: 'Luminous Flux per Fixture', key: 'res_lt_fix' },
    { tr: 'Gerekli Armatür Sayısı', en: 'Required Number of Fixtures', key: 'res_lt_num' },
    { tr: 'Toplam Kurulu Güç', en: 'Total Installed Power', key: 'res_lt_p' },
    { tr: 'Tahmini Yük Akımı (230V)', en: 'Estimated Load Current (230V)', key: 'res_lt_i' },
    { tr: 'Bakım faktörü 0.80 alınmıştır. Gerçek hesap için oda tipi ve reflektans değerlerini göz önünde bulundurun.', en: 'Maintenance factor 0.80 is used. Consider room type and reflectance values for actual calculation.', key: 'tip_lt_maint' }
];

let trMap = '';
let enMap = '';

for (const r of replacements) {
    trMap += `\n        ${r.key}: "${r.tr.replace(/"/g, '\\"')}",`;
    enMap += `\n        ${r.key}: "${r.en.replace(/"/g, '\\"')}",`;

    // Replace in code
    code = code.split(`'${r.tr}'`).join(`translate('${r.key}')`);
    code = code.split(`"${r.tr}"`).join(`translate('${r.key}')`);
    code = code.split(`\`${r.tr}\``).join(`translate('${r.key}')`);
}

// Add specifically for Devreye Alma Akımı -> res_ss_demaraj where mult is dynamic
code = code.split(`'Devreye Alma Akımı (×\${mult})'`).join(`\`\${translate('res_ss_demaraj')} (×\${mult})\``);
code = code.split(`\`Devreye Alma Akımı (×\${mult})\``).join(`\`\${translate('res_ss_demaraj')} (×\${mult})\``);
trMap += `\n        res_ss_demaraj: "Devreye Alma Akımı",`;
enMap += `\n        res_ss_demaraj: "Startup Current",`;

// Add specifically for Önerilen Motor Sigortası
code = code.split(`'Önerilen Motor Sigortası'`).join(`translate('res_ss_cb')`);
trMap += `\n        res_ss_cb: "Önerilen Motor Sigortası",`;
enMap += `\n        res_ss_cb: "Recommended Motor Breaker",`;

// Replace 'Sekonder Ana Şalter' and 'Örnek Ana Kablo'
code = code.split(`'Sekonder Ana Şalter'`).join(`translate('res_trafo_sec_cb')`);
code = code.split(`'Örnek Ana Kablo'`).join(`translate('res_trafo_cab')`);
trMap += `\n        res_trafo_sec_cb: "Sekonder Ana Şalter",`;
trMap += `\n        res_trafo_cab: "Örnek Ana Kablo",`;
enMap += `\n        res_trafo_sec_cb: "Secondary Main Breaker",`;
enMap += `\n        res_trafo_cab: "Example Main Cable",`;

code = code.replace('nav_busbar: "Bara"', trMap + '\n        nav_busbar: "Bara"');
code = code.replace('nav_busbar: "Busbar"', enMap + '\n        nav_busbar: "Busbar"');

fs.writeFileSync('www/app.js', code);
console.log('Translations successfully injected.');
