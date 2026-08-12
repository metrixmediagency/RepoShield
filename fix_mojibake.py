import os

path = 'sales.html'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    ('ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹', '₹'),
    ('ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ', '—'),
    ('ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢', '•')
]

changed = False
for bad, good in replacements:
    if bad in content:
        content = content.replace(bad, good)
        changed = True

if changed:
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed mojibake!")
else:
    print("No mojibake found.")
