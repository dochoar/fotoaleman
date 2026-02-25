import os
import glob
from PIL import Image
import imagehash

target_img = "/home/david/.gemini/antigravity/brain/e834a374-c36d-45b9-94da-f28e94b14225/media__1772050834179.png"
target_hash = imagehash.phash(Image.open(target_img))

dir_path = "/home/david/Escritorio/fotoaleman/Fotos Politicas/"
files = glob.glob(os.path.join(dir_path, "*.jpg")) + glob.glob(os.path.join(dir_path, "*.png"))

min_diff = float('inf')
most_similar = None

for f in files:
    try:
        h = imagehash.phash(Image.open(f))
        diff = target_hash - h
        if diff < min_diff:
            min_diff = diff
            most_similar = f
    except Exception as e:
        pass

print(f"Most similar image: {os.path.basename(most_similar)} with difference {min_diff}")
