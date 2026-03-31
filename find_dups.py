import os
import sys
from PIL import Image
import imagehash

DIR = "public/fotos-celebridades/"
files = [f for f in os.listdir(DIR) if f.endswith('.webp')]
hashes = {}
duplicates = []

for f in files:
    try:
        path = os.path.join(DIR, f)
        img = Image.open(path)
        h = str(imagehash.phash(img))
        if h in hashes:
            duplicates.append((f, hashes[h]))
        else:
            hashes[h] = f
    except Exception as e:
        print(f"Error on {f}: {e}")

print("Exact PHash duplicates found:")
for d in duplicates:
    print(f" - {d[0]} is a duplicate of {d[1]}")

