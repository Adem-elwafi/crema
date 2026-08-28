import os
import io
from collections import deque
import numpy as np
from PIL import Image
import rembg

HERO_DIR = r"c:\Users\Adem\Desktop\Portfolio Projects\REACT\CREMA\src\assets\images\hero"

def extract_connected_components(img_cutout, min_area=800):
    """
    Finds isolated distinct items in an image (e.g. separate coffee beans)
    and returns a list of cropped individual PIL images.
    """
    w, h = img_cutout.size
    arr = np.array(img_cutout)
    alpha = arr[:, :, 3] > 30  # solid pixel mask
    
    visited = np.zeros((h, w), dtype=bool)
    components = []
    
    for y in range(h):
        for x in range(w):
            if alpha[y, x] and not visited[y, x]:
                queue = deque([(x, y)])
                visited[y, x] = True
                comp_pixels = []
                min_x, max_x = x, x
                min_y, max_y = y, y
                
                while queue:
                    cx, cy = queue.popleft()
                    comp_pixels.append((cx, cy))
                    min_x, max_x = min(min_x, cx), max(max_x, cx)
                    min_y, max_y = min(min_y, cy), max(max_y, cy)
                    
                    for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                        nx, ny = cx + dx, cy + dy
                        if 0 <= nx < w and 0 <= ny < h and alpha[ny, nx] and not visited[ny, nx]:
                            visited[ny, nx] = True
                            queue.append((nx, ny))
                            
                if len(comp_pixels) >= min_area:
                    cw = max_x - min_x + 1
                    ch = max_y - min_y + 1
                    comp_arr = np.zeros((ch, cw, 4), dtype=np.uint8)
                    
                    for px, py in comp_pixels:
                        comp_arr[py - min_y, px - min_x] = arr[py, px]
                        
                    comp_img = Image.fromarray(comp_arr, "RGBA")
                    bbox = comp_img.getbbox()
                    if bbox:
                        comp_img = comp_img.crop(bbox)
                    components.append((len(comp_pixels), comp_img))
                    
    components.sort(key=lambda c: c[0], reverse=True)
    return [c[1] for c in components]

def run():
    print("=== 1. Processing Hero Centerpiece Cups with AI Background Removal ===")
    cups = ["espresso-cup.jpg", "cappuccino-cup.jpg", "latte-cup.jpg", "coldbrew-glass.jpg"]
    for cup in cups:
        in_path = os.path.join(HERO_DIR, cup)
        out_name = os.path.splitext(cup)[0] + ".png"
        out_path = os.path.join(HERO_DIR, out_name)
        if os.path.exists(in_path):
            with open(in_path, "rb") as f:
                raw_bytes = f.read()
            out_bytes = rembg.remove(raw_bytes)
            im = Image.open(io.BytesIO(out_bytes))
            bbox = im.getbbox()
            if bbox:
                im = im.crop(bbox)
            im.save(out_path, "PNG")
            print(f"✓ Cup saved: {out_name} ({im.size[0]}x{im.size[1]})")

    print("\n=== 2. Extracting Individual Floating Coffee Beans ===")
    beans_path = os.path.join(HERO_DIR, "coffee-beans.jpg")
    if os.path.exists(beans_path):
        with open(beans_path, "rb") as f:
            out_bytes = rembg.remove(f.read())
        beans_im = Image.open(io.BytesIO(out_bytes))
        beans = extract_connected_components(beans_im, min_area=500)
        print(f"Found {len(beans)} individual coffee beans")
        for i, bean in enumerate(beans[:6], 1):
            out_path = os.path.join(HERO_DIR, f"bean-single-{i}.png")
            bean.save(out_path, "PNG")
            print(f"✓ Saved single bean: bean-single-{i}.png ({bean.size[0]}x{bean.size[1]})")

    print("\n=== 3. Extracting Individual Sugar Cubes ===")
    sugar_path = os.path.join(HERO_DIR, "sugar-cubes.jpg")
    if os.path.exists(sugar_path):
        with open(sugar_path, "rb") as f:
            out_bytes = rembg.remove(f.read())
        sugar_im = Image.open(io.BytesIO(out_bytes))
        bbox = sugar_im.getbbox()
        if bbox:
            sugar_im = sugar_im.crop(bbox)
        # Sugar cubes image has 3 cubes: top tilted one, bottom left, bottom right
        w, h = sugar_im.size
        # Crop individual cubes from the cluster:
        # Top cube
        top_cube = sugar_im.crop((int(w * 0.2), 0, int(w * 0.8), int(h * 0.55)))
        t_box = top_cube.getbbox()
        if t_box:
            top_cube = top_cube.crop(t_box)
            top_cube.save(os.path.join(HERO_DIR, "sugar-single-1.png"), "PNG")
            print("✓ Saved: sugar-single-1.png")
            
        # Left cube
        left_cube = sugar_im.crop((0, int(h * 0.35), int(w * 0.55), h))
        l_box = left_cube.getbbox()
        if l_box:
            left_cube = left_cube.crop(l_box)
            left_cube.save(os.path.join(HERO_DIR, "sugar-single-2.png"), "PNG")
            print("✓ Saved: sugar-single-2.png")
            
        # Right cube
        right_cube = sugar_im.crop((int(w * 0.45), int(h * 0.35), w, h))
        r_box = right_cube.getbbox()
        if r_box:
            right_cube = right_cube.crop(r_box)
            right_cube.save(os.path.join(HERO_DIR, "sugar-single-3.png"), "PNG")
            print("✓ Saved: sugar-single-3.png")

    print("\n=== 4. Extracting Cinnamon Sticks ===")
    cin_path = os.path.join(HERO_DIR, "cinnamon-sticks.jpg")
    if os.path.exists(cin_path):
        with open(cin_path, "rb") as f:
            out_bytes = rembg.remove(f.read())
        cin_im = Image.open(io.BytesIO(out_bytes))
        bbox = cin_im.getbbox()
        if bbox:
            cin_im = cin_im.crop(bbox)
        cin_im.save(os.path.join(HERO_DIR, "cinnamon-single-1.png"), "PNG")
        print("✓ Saved: cinnamon-single-1.png")

    print("\n=== 5. Extracting Green Leaves ===")
    leaf_path = os.path.join(HERO_DIR, "green-leaves.jpg")
    if os.path.exists(leaf_path):
        with open(leaf_path, "rb") as f:
            out_bytes = rembg.remove(f.read())
        leaf_im = Image.open(io.BytesIO(out_bytes))
        leaves = extract_connected_components(leaf_im, min_area=600)
        if len(leaves) >= 2:
            leaves[0].save(os.path.join(HERO_DIR, "leaf-single-1.png"), "PNG")
            leaves[1].save(os.path.join(HERO_DIR, "leaf-single-2.png"), "PNG")
            print("✓ Saved: leaf-single-1.png and leaf-single-2.png")
        else:
            bbox = leaf_im.getbbox()
            if bbox:
                leaf_im = leaf_im.crop(bbox)
            leaf_im.save(os.path.join(HERO_DIR, "leaf-single-1.png"), "PNG")
            print("✓ Saved: leaf-single-1.png")

    print("\n=== 6. Extracting Cream Splash ===")
    splash_path = os.path.join(HERO_DIR, "cream-splash.jpg")
    if os.path.exists(splash_path):
        with open(splash_path, "rb") as f:
            out_bytes = rembg.remove(f.read())
        splash_im = Image.open(io.BytesIO(out_bytes))
        bbox = splash_im.getbbox()
        if bbox:
            splash_im = splash_im.crop(bbox)
        splash_im.save(os.path.join(HERO_DIR, "splash-single-1.png"), "PNG")
        print("✓ Saved: splash-single-1.png")

    print("\nALL ASSETS PROCESSED WITH CLEAN TRANSPARENCY!")

if __name__ == "__main__":
    run()
