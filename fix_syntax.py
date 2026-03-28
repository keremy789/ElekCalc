import sys
import re

files_to_update = [
    ('www/index.html', 'www/app.js'),
    ('index.html', 'app.js')
]

for html_path, js_path in files_to_update:
    try:
        with open(html_path, 'r', encoding='utf-8') as f:
            html = f.read()
            
        html_reps = [
            ('<strong id="display-username">Kullanıcı</strong>', '<strong id="display-username" data-i18n="default_username">Kullanıcı</strong>')
        ]
        
        for old, new in html_reps:
            html = html.replace(old, new)
            
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Fixed HTML: {html_path}")
    except Exception as e:
        print(f"Error HTML {html_path}: {e}")

    try:
        with open(js_path, 'r', encoding='utf-8') as f:
            app_js = f.read()

        js_reps = [
            # Fix string injections within template literals
            ('" + translate(\'hist_del_btn\') + "', "${translate('hist_del_btn')}"),
            ('" + translate(\'busbar_ph\') + "', "${translate('busbar_ph')}"),
            ('" + translate(\'busbar_n\') + "', "${translate('busbar_n')}"),
            ('" + translate(\'busbar_pe\') + "', "${translate('busbar_pe')}"),
            ('" + translate(\'busbar_tip\') + "', "${translate('busbar_tip')}"),
            
            # Fix string concatenations that missed quotes
            ('exportBtn.innerHTML = \'<i class="ph ph-download-simple"></i> " + translate(\'export_json\')\';', 
             'exportBtn.innerHTML = \'<i class="ph ph-download-simple"></i> \' + translate(\'export_json\');'),
            
            ('importBtn.innerHTML = \'<i class="ph ph-upload-simple"></i> " + translate(\'import_json\')\';',
             'importBtn.innerHTML = \'<i class="ph ph-upload-simple"></i> \' + translate(\'import_json\');'),
        ]
        
        for old, new in js_reps:
            app_js = app_js.replace(old, new)

        # Add single missing key to i18n
        key_str = '        default_username: "Kullanıcı",\n'
        if 'default_username' not in app_js:
            # We insert it right before nav_busbar just to be easy
            app_js = app_js.replace('nav_busbar: "Bara"', 'default_username: "Kullanıcı",\n        nav_busbar: "Bara"')
            app_js = app_js.replace('nav_busbar: "Busbar"', 'default_username: "User",\n        nav_busbar: "Busbar"')

        with open(js_path, 'w', encoding='utf-8') as f:
            f.write(app_js)
        print(f"Fixed JS: {js_path}")
    except Exception as e:
        print(f"Error JS {js_path}: {e}")
