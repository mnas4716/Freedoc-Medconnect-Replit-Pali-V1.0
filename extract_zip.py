#!/usr/bin/env python3
import zipfile
import os
import shutil

# Extract the zip file
zip_path = "attached_assets/telehealth-website (3) fxntional_1754552220008.zip"
extract_path = "attached_assets/functional_reference"

try:
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_path)
        print("Files extracted successfully")
        
        # List all files
        for root, dirs, files in os.walk(extract_path):
            level = root.replace(extract_path, '').count(os.sep)
            indent = ' ' * 2 * level
            print(f'{indent}{os.path.basename(root)}/')
            subindent = ' ' * 2 * (level + 1)
            for file in files[:5]:  # Show first 5 files per directory
                print(f'{subindent}{file}')
            if len(files) > 5:
                print(f'{subindent}... and {len(files) - 5} more files')
except Exception as e:
    print(f"Error: {e}")