import os
import sys
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

HERO_DIR = r"c:\Users\Adem\Desktop\Portfolio Projects\REACT\CREMA\src\assets\images\hero"

def floodfill_cutout(img, bg_threshold=235, tolerance=25):
    """
    Intelligently removes white/off-white background starting ONLY from the outer edges.
    Leaves internal white items (like milk foam, white cups, sugar) intact!
    """
    img = img.convert("RGBA")
    w, h = img.size
    arr = np.array(img).astype(np.float32)
    
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
    whiteness = np.minimum(np.minimum(r, g), b)
    color_diff = np.maximum(np.maximum(np.abs(r - g), np.abs(r - b)), np.abs(g - b))
    
    # Pixel is background candidate if it's very bright and neutral in color
    is_bg_candidate = (whiteness >= bg_threshold) & (color_diff <= tolerance)
    
    # BFS flood fill from image perimeter
    visited = np.zeros((h, w), dtype=bool)
    is_bg = np.zeros((h, w), dtype=bool)
    
    queue = deque()
    
    # Add all border pixels that are bg candidates
    for x in range(w):
        for y in [0, h - 1]:
            if is_bg_candidate[y, x] and not visited[y, x]:
                visited[y, x] = True
                is_bg[y, x] = True
                queue.append((x, y))
                
    for y in range(h):
        for x in [0, w - 1]:
            if is_bg_candidate[y, x] and not visited[y, x]:
                visited[y, x] = True
                is_bg[y, x] = True
                queue.append((x, y))
                
    while queue:
        cx, cy = queue.popleft()
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < w and 0 <= ny < h and not visited[ny, nx]:
                visited[ny, nx] = True
                if is_bg_candidate[ny, nx]:
                    is_bg[ny, nx] = True
                    queue.append((nx, ny))
                    
    # Generate soft antialiased alpha channel
    alpha = np.ones((h, w), dtype=np.float32) * 255.0
    alpha[is_bg] = 0.0
    
    # Feather edge: find boundary between bg and non-bg for soft edge antialiasing
    # Blur the alpha mask slightly to remove hard pixel edges
    alpha_img = Image.fromarray(alpha.astype(np.uint8), mode="L")
    alpha_img = alpha_img.filter(ImageFilter.GaussianBlur(radius=1.0))
    
    # Combine back into RGBA
    arr[:, :, 3] = np.array(alpha_img)
    result = Image.fromarray(arr.astype(np.uint8), "RGBA")
    
    # Crop to non-transparent bounding box
    bbox = result.getbbox()
    if bbox:
        result = result.crop(bbox)
        
    return result

def extract_connected_components(img_cutout, min_area=1500):
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
                # BFS to collect this connected component
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
                    # Crop this component
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
                    
    # Sort largest to smallest
    components.sort(key=lambda c: c[0], reverse=True)
    return [c[1] for c in components]

def process_all():
    print("=== Processing Hero Centerpiece Cups ===")
    cups = ["espresso-cup.jpg", "cappuccino-cup.jpg", "latte-cup.jpg", "coldbrew-glass.jpg"]
    for cup in cups:
        in_path = os.path.join(HERO_DIR, cup)
        out_name = os.path.splitext(cup)[0] + ".png"
        out_path = os.path.join(HERO_DIR, out_name)
        if os.path.exists(in_path):
            img = Image.open(in_path)
            # Use threshold 230 for clean cup extraction
            cut = floodfill_cutout(img, bg_threshold=230, tolerance=25)
            cut.save(out_path, "PNG")
            print(f"Saved: {out_name} ({cut.size[0]}x{cut.size[1]})")

    print("\n=== Extracting Individual Floating Ingredients ===")
    
    # 1. Coffee Beans -> extract individual single beans
    beans_path = os.path.join(HERO_DIR, "coffee-beans.jpg")
    if os.path.exists(beans_path):
        cut = floodfill_cutout(Image.open(beans_path), bg_threshold=230, tolerance=30)
        items = extract_connected_components(cut, min_area=800)
        print(f"Extracted {len(items)} individual coffee beans")
        for i, item in enumerate(items[:6], 1):
            out_path = os.path.join(HERO_DIR, f"bean-single-{i}.png")
            item.save(out_path, "PNG")
            print(f"  Saved: bean-single-{i}.png ({item.size[0]}x{item.size[1]})")

    # 2. Sugar Cubes -> extract individual single sugar cubes
    sugar_path = os.path.join(HERO_DIR, "sugar-cubes.jpg")
    if os.path.exists(sugar_path):
        cut = floodfill_cutout(Image.open(sugar_path), bg_threshold=242, tolerance=15)
        items = extract_connected_components(cut, min_area=1000)
        print(f"Extracted {len(items)} individual sugar elements")
        for i, item in enumerate(items[:4], 1):
            out_path = os.path.join(HERO_DIR, f"sugar-single-{i}.png")
            item.save(out_path, "PNG")
            print(f"  Saved: sugar-single-{i}.png ({item.size[0]}x{item.size[1]})")

    # 3. Cinnamon Sticks
    cin_path = os.path.join(HERO_DIR, "cinnamon-sticks.jpg")
    if os.path.exists(cin_path):
        cut = floodfill_cutout(Image.open(cin_path), bg_threshold=230, tolerance=30)
        items = extract_connected_components(cut, min_area=1500)
        print(f"Extracted {len(items)} cinnamon elements")
        if items:
            for i, item in enumerate(items[:3], 1):
                item.save(os.path.join(HERO_DIR, f"cinnamon-single-{i}.png"), "PNG")
                print(f"  Saved: cinnamon-single-{i}.png")
        else:
            cut.save(os.path.join(HERO_DIR, "cinnamon-single-1.png"), "PNG")

    # 4. Green Leaves
    leaf_path = os.path.join(HERO_DIR, "green-leaves.jpg")
    if os.path.exists(leaf_path):
        cut = floodfill_cutout(Image.open(leaf_path), bg_threshold=235, tolerance=25)
        items = extract_connected_components(cut, min_area=1000)
        print(f"Extracted {len(items)} leaf elements")
        if items:
            for i, item in enumerate(items[:4], 1):
                item.save(os.path.join(HERO_DIR, f"leaf-single-{i}.png"), "PNG")
                print(f"  Saved: leaf-single-{i}.png")
        else:
            cut.save(os.path.join(HERO_DIR, "leaf-single-1.png"), "PNG")

    # 5. Cream Splash
    splash_path = os.path.join(HERO_DIR, "cream-splash.jpg")
    if os.path.exists(splash_path):
        cut = floodfill_cutout(Image.open(splash_path), bg_threshold=242, tolerance=15)
        cut.save(os.path.join(HERO_DIR, "splash-single-1.png"), "PNG")
        print("  Saved: splash-single-1.png")

if __name__ == "__main__":
    process_all()
