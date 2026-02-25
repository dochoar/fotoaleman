from PIL import Image
import os
import glob

files = [
    "/home/david/.gemini/antigravity/brain/e834a374-c36d-45b9-94da-f28e94b14225/media__1772051227752.jpg",
    "/home/david/.gemini/antigravity/brain/e834a374-c36d-45b9-94da-f28e94b14225/media__1772051249507.png"
]

for f in files:
    try:
        img = Image.open(f).convert('RGB')
        pixels = list(img.getdata())
        r = sum(p[0] for p in pixels) / len(pixels)
        g = sum(p[1] for p in pixels) / len(pixels)
        b = sum(p[2] for p in pixels) / len(pixels)
        print(f"{os.path.basename(f)} - RGB: ({r:.1f}, {g:.1f}, {b:.1f})")
    except Exception as e:
        pass
