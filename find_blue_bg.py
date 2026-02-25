from PIL import Image
import os
import glob

dir_path = "/home/david/Escritorio/fotoaleman/Fotos Politicas/"
files = glob.glob(os.path.join(dir_path, "*.jpg")) + glob.glob(os.path.join(dir_path, "*.png"))

for f in files:
    try:
        img = Image.open(f).convert('RGB')
        # Check top-left, top-right corners or just a strip at the top
        width, height = img.size
        # average color of the top 10%
        crop = img.crop((0, 0, width, int(height*0.1)))
        colors = crop.getcolors(width*int(height*0.1))
        
        # just calculate average RGB of top 10%
        pixels = list(crop.getdata())
        r = sum(p[0] for p in pixels) / len(pixels)
        g = sum(p[1] for p in pixels) / len(pixels)
        b = sum(p[2] for p in pixels) / len(pixels)
        
        # Light blue has high B, and G, like 100-200 R, 200-240 G, 220-255 B
        if r < 190 and b > 200 and g > 180 and b > r + 30:
            print(f"Potential match (blue bg): {os.path.basename(f)} - RGB: ({r:.1f}, {g:.1f}, {b:.1f})")
    except Exception as e:
        pass
