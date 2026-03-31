import sys
import os
try:
    from PIL import Image
    import imagehash
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pillow", "ImageHash"])
    from PIL import Image
    import imagehash

DIR = "public/fotos-celebridades/"
target_name = "a600ef5e-c0dc-44ab-9aad-21c5b8411879_0.webp"
target_path = os.path.join(DIR, target_name)
if not os.path.exists(target_path):
    target_path = target_path.replace(".webp", ".jpg")

target_img = Image.open(target_path)
target_hash = imagehash.phash(target_img)
target_w, target_h = target_img.size

print(f"Target hash: {target_hash} ({target_w}x{target_h})")

files = [f for f in os.listdir(DIR) if f.endswith(('.webp', '.jpg', '.png')) and f != target_name and f != target_name.replace(".webp", ".jpg")]

for f in files:
    try:
        path = os.path.join(DIR, f)
        img = Image.open(path)
        h = imagehash.phash(img)
        diff = target_hash - h
        if diff < 20: 
            img_w, img_h = img.size
            print(f"POSSIBLE MATCH: {f} (diff: {diff}) | Match size: {img_w}x{img_h}")
    except Exception as e:
        pass
