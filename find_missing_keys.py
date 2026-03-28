import re

with open('www/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

keys = set()
for attr in ['data-i18n', 'data-i18n-placeholder', 'data-i18n-title']:
    matches = re.findall(rf'{attr}="([^"]+)"', html)
    for m in matches:
        keys.add(m)

with open('www/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

missing = []
for k in sorted(keys):
    if f' {k}:' not in app_js and f'\n        {k}:' not in app_js:
        # Check if it has a string value nearby
        missing.append(k)

print("MISSING KEYS:", missing)
