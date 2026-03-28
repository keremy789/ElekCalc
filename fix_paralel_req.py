import sys

files_to_update = ['www/app.js', 'app.js']

for js_path in files_to_update:
    try:
        with open(js_path, 'r', encoding='utf-8') as f:
            app_js = f.read()

        # Step 1: Add new key to TR
        if 'res_badge_req_parallel:' not in app_js:
            app_js = app_js.replace('nav_busbar: "Bara"', 'res_badge_req_parallel: "Paralel Bağlantı Gerekli",\n        nav_busbar: "Bara"')
            app_js = app_js.replace('nav_busbar: "Busbar"', 'res_badge_req_parallel: "Parallel Connection Required",\n        nav_busbar: "Busbar"')

        # Step 2: Replace hardcoded string in getCable
        app_js = app_js.replace(
            "return { size: 'Paralel Bağlantı Gerekli', color: 'red' };",
            "return { size: translate('res_badge_req_parallel'), color: 'red' };"
        )
        
        # Step 3: Replace it in case it was ANSI
        app_js = app_js.replace(
            "return { size: 'Paralel Ba\ufffdlant\ufffd Gerekli', color: 'red' };",
            "return { size: translate('res_badge_req_parallel'), color: 'red' };"
        )
        app_js = app_js.replace(
            "return { size: 'Paralel Ba\xf0lant\xfd Gerekli', color: 'red' };",
            "return { size: translate('res_badge_req_parallel'), color: 'red' };"
        )
        
        # NOTE: If we want to hide " mm² " when it's just text:
        # In renderResult: 
        # badge(`${cab.size} mm² ` + translate('res_badge_parallel'), 'yellow')
        # If cab.size is long text, adding mm^2 is ugly! But fixing the text is enough.
        
        old_render = "badge(`${cab.size} mm² ` + translate('res_badge_parallel'), 'yellow')"
        new_render = "cab.size.includes(translate('res_badge_req_parallel')) ? badge(cab.size + ' ' + translate('res_badge_parallel'), 'red') : badge(`${cab.size} mm² ` + translate('res_badge_parallel'), 'yellow')"
        
        app_js = app_js.replace(old_render, new_render)

        with open(js_path, 'w', encoding='utf-8') as f:
            f.write(app_js)
        print(f"Fixed {js_path}")
    except Exception as e:
        print(f"Error reading {js_path}: {e}")
