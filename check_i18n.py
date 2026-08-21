import os
import re

with open('src/context/LanguageContext.tsx', 'r', encoding='utf-8') as f:
    lang_content = f.read()

# Parse dicts
def get_dict(lang_code):
    match = re.search(r'\n  ' + lang_code + r':\s*\{(.*?)\n  \},', lang_content, re.DOTALL)
    if not match:
        return {}
    # find lines with 'key': 'val'
    pairs = re.findall(r"'([^']+)'\s*:\s*'(.*?[^\\])'", match.group(1))
    return dict(pairs)

en = get_dict('en')
fr = get_dict('fr')
de = get_dict('de')
es = get_dict('es')

print(f"Total keys in EN: {len(en)}")
print(f"Total keys in FR: {len(fr)}")
print(f"Total keys in DE: {len(de)}")
print(f"Total keys in ES: {len(es)}")

# Scan all TSX/TS files
all_used_keys = []
for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.tsx', '.ts')) and file != 'LanguageContext.tsx':
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                matches = re.findall(r"t\(\s*['\"]([^'\"]+)['\"]\s*\)", content)
                for m in matches:
                    all_used_keys.append((m, path))

distinct_used_keys = sorted(list(set(k for k, p in all_used_keys)))
print(f"Distinct t() keys in code: {len(distinct_used_keys)}")

missing_in_en = [k for k in distinct_used_keys if k not in en]
missing_in_fr = [k for k in distinct_used_keys if k not in fr]

print(f"\nKeys used in code but missing from EN dict ({len(missing_in_en)}):")
for k in missing_in_en:
    usages = [p for m, p in all_used_keys if m == k]
    print(f"  {k} -> {usages[0]}")

print(f"\nKeys used in code but missing from FR dict ({len(missing_in_fr)}):")
for k in missing_in_fr:
    usages = [p for m, p in all_used_keys if m == k]
    print(f"  {k} -> {usages[0]}")

# Also check for all keys in EN that are missing in FR, DE, ES
missing_en_to_fr = [k for k in en if k not in fr]
print(f"\nEN keys missing in FR ({len(missing_en_to_fr)}):")
for k in missing_en_to_fr:
    print(f"  {k}: '{en[k]}'")
