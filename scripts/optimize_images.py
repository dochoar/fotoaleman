import os
import subprocess
from pathlib import Path

def convert_to_webp(root_dir):
    image_extensions = {'.png', '.jpg', '.jpeg', '.JPG', '.PNG'}
    
    # Walk through directory
    for path in Path(root_dir).rglob('*'):
        if path.suffix in image_extensions:
            # Skip if webp already exists (optional, but good for re-running)
            webp_path = path.with_suffix('.webp')
            if webp_path.exists():
                print(f"Skipping {path.name}, already converted.")
                continue
                
            print(f"Converting {path.name} to WebP...")
            
            # Construct cwebp command
            # -q 80 for 80% quality, usually good balance
            cmd = ['cwebp', '-q', '80', str(path), '-o', str(webp_path)]
            
            try:
                subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                print(f"Success: {webp_path.name}")
            except subprocess.CalledProcessError:
                print(f"Error converting {path.name}")
            except FileNotFoundError:
                print("Error: cwebp not found. Please install webp tool.")
                return

if __name__ == "__main__":
    # Assuming script is run from project root or scripts folder
    # Adjust path to project root
    project_root = Path.cwd()
    if project_root.name == 'scripts':
        project_root = project_root.parent
        
    print(f"Scanning for images in {project_root}...")
    convert_to_webp(project_root)
