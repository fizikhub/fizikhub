import os

def replace_in_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    if 'https://fizikhub.com' in content:
        content = content.replace('https://fizikhub.com', 'https://www.fizikhub.com')
        # However, if it became https://www.www.fizikhub.com, fix it:
        content = content.replace('www.www.', 'www.')
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk('app'):
    for file in files:
        if file.endswith('.ts') or file.endswith('.tsx'):
            replace_in_file(os.path.join(root, file))

for root, dirs, files in os.walk('lib'):
    for file in files:
        if file.endswith('.ts') or file.endswith('.tsx'):
            replace_in_file(os.path.join(root, file))
