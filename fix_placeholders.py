import sys

files_to_update = [
    ('www/index.html', 'www/app.js'),
    ('index.html', 'app.js')
]

for html_path, js_path in files_to_update:
    try:
        with open(html_path, 'r', encoding='utf-8') as f:
            html = f.read()

        html_reps = [
            ('placeholder="mühendis123"', 'placeholder="mühendis123" data-i18n-placeholder="ph_username"'),
            ('placeholder="muhendis@sirket.com"', 'placeholder="muhendis@sirket.com" data-i18n-placeholder="ph_email"'),
            ('placeholder="Örn: 1000"', 'placeholder="Örn: 1000" data-i18n-placeholder="ph_ex_1000"'),
            ('placeholder="Örn: 100"', 'placeholder="Örn: 100" data-i18n-placeholder="ph_ex_100"'),
            ('placeholder="Örn: 15"', 'placeholder="Örn: 15" data-i18n-placeholder="ph_ex_15"'),
            ('placeholder="Veya doğrudan girin"', 'placeholder="Veya doğrudan girin" data-i18n-placeholder="ph_or_direct"'),
            ('placeholder="Örn: 1250"', 'placeholder="Örn: 1250" data-i18n-placeholder="ph_ex_1250"'),
            ('placeholder="Örn: 10"', 'placeholder="Örn: 10" data-i18n-placeholder="ph_ex_10"'),
            ('placeholder="Örn: 7.5"', 'placeholder="Örn: 7.5" data-i18n-placeholder="ph_ex_7_5"'),
            ('placeholder="Örn: 20"', 'placeholder="Örn: 20" data-i18n-placeholder="ph_ex_20"'),
            ('placeholder="Örn: 50"', 'placeholder="Örn: 50" data-i18n-placeholder="ph_ex_50"'),
            ('placeholder="Örn: 60"', 'placeholder="Örn: 60" data-i18n-placeholder="ph_ex_60"'),
            ('placeholder="Örn: A Blok Pano"', 'placeholder="Örn: A Blok Pano" data-i18n-placeholder="ph_cat"'),
            ('placeholder="Örn: 5. kat havalandırma motoru"', 'placeholder="Örn: 5. kat havalandırma motoru" data-i18n-placeholder="ph_notes"'),
            ('title="Tema Değiştir"', 'title="Tema Değiştir" data-i18n-title="title_theme"'),
            ('title="Çıkış Yap"', 'title="Çıkış Yap" data-i18n-title="title_logout"')
        ]

        for old, new in html_reps:
            html = html.replace(old, new)
        
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Updated {html_path}")
    except Exception as e:
        print(e)
        
    try:
        with open(js_path, 'r', encoding='utf-8') as f:
            app_js = f.read()
            
        # Add new keys
        new_keys = {
            "ph_username": {"tr": "mühendis123", "en": "engineer123"},
            "ph_email": {"tr": "muhendis@sirket.com", "en": "engineer@company.com"},
            "ph_ex_1000": {"tr": "Örn: 1000", "en": "e.g. 1000"},
            "ph_ex_100": {"tr": "Örn: 100", "en": "e.g. 100"},
            "ph_ex_15": {"tr": "Örn: 15", "en": "e.g. 15"},
            "ph_or_direct": {"tr": "Veya doğrudan girin", "en": "Or enter directly"},
            "ph_ex_1250": {"tr": "Örn: 1250", "en": "e.g. 1250"},
            "ph_ex_10": {"tr": "Örn: 10", "en": "e.g. 10"},
            "ph_ex_7_5": {"tr": "Örn: 7.5", "en": "e.g. 7.5"},
            "ph_ex_20": {"tr": "Örn: 20", "en": "e.g. 20"},
            "ph_ex_50": {"tr": "Örn: 50", "en": "e.g. 50"},
            "ph_ex_60": {"tr": "Örn: 60", "en": "e.g. 60"},
            "ph_cat": {"tr": "Örn: A Blok Pano", "en": "e.g. Block A Panel"},
            "ph_notes": {"tr": "Örn: 5. kat havalandırma motoru", "en": "e.g. 5th floor vent motor"},
            "title_theme": {"tr": "Tema Değiştir", "en": "Toggle Theme"},
            "title_logout": {"tr": "Çıkış Yap", "en": "Logout"}
        }

        tr_additions = "\n".join([f'        {k}: "{v["tr"]}",' for k,v in new_keys.items()])
        en_additions = "\n".join([f'        {k}: "{v["en"]}",' for k,v in new_keys.items()])

        app_js = app_js.replace('nav_busbar: "Bara"', tr_additions + '\n        nav_busbar: "Bara"')
        app_js = app_js.replace('nav_busbar: "Busbar"', en_additions + '\n        nav_busbar: "Busbar"')

        # Add data-i18n-placeholder and data-i18n-title to applyTranslations
        old_func = """const applyTranslations = () => {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const k = el.getAttribute('data-i18n');
        if (el.tagName === 'INPUT' && el.type === 'button') {
            el.value = translate(k);
        } else {
            el.innerText = translate(k);
        }
    });
};"""
        new_func = """const applyTranslations = () => {
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
};"""
        app_js = app_js.replace(old_func, new_func)

        with open(js_path, 'w', encoding='utf-8') as f:
            f.write(app_js)
        print(f"Updated {js_path}")
    except Exception as e:
        print(e)
