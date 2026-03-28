import sys

files_to_update = [
    'www/app.js',
    'app.js'
]

hardcoded_tip = "'💡 IEC standartlarına göre kapasitif yüklerde harmonikler ve deşarj akımları nedeniyle şalter ve kablo kesiti nominal akımın en az 1.35 - 1.5 katı olarak tasarlanmalıdır. Hesaplamada 1.5 çarpanı kullanılmıştır.'"
replaced_tip = "'💡 ' + translate('tip_kvar_iec')"

for js_path in files_to_update:
    try:
        with open(js_path, 'r', encoding='utf-8') as f:
            app_js = f.read()

        if hardcoded_tip in app_js:
            app_js = app_js.replace(hardcoded_tip, replaced_tip)
            with open(js_path, 'w', encoding='utf-8') as f:
                f.write(app_js)
            print(f"Fixed {js_path}")
        else:
            print(f"Not found in {js_path}")
    except Exception as e:
        print(f"Error reading {js_path}: {e}")
