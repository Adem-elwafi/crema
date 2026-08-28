import os
import numpy as np
from PIL import Image, ImageFilter

HERO_DIR = r"c:\Users\Adem\Desktop\Portfolio Projects\REACT\CREMA\src\assets\images\hero"

def remove_white_background(img_path, threshold=240, feather=2.0):
    img = Image.open(img_path).convert("RGBA")
    arr = np.array(img).astype(np.float32)
    
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
    
    # Calculate brightness and whiteness
    # A pixel is background if all R, G, B are above threshold and relatively close to each other
    whiteness = np.minimum(np.minimum(r, g), b)
    color_diff = np.maximum(np.maximum(np.abs(r - g), np.abs(r - b)), np.abs(g - b))
    
    # Background mask: very bright and very low color difference (neutral white/off-white)
    # Smooth transition between threshold - 25 and threshold
    low = threshold - 25.0
    high = threshold
    
    # alpha: 0 for pure white background, 255 for foreground
    alpha_mask = np.clip((high - whiteness) / (high - low), 0.0, 1.0) * 255.0
    
    # If there's noticeable color (e.g. slight warm or coffee hue), keep it more opaque
    color_boost = np.clip(color_diff / 15.0, 0.0, 1.0)
    final_alpha = np.maximum(alpha_mask, color_boost * 255.0)
    
    # For pixels where whiteness < low, keep full opacity 255
    final_alpha[whiteness < low] = 255.0
    
    # Create RGBA image
    result_arr = arr.copy()
    result_arr[:, :, 3] = final_alpha
    
    out_img = Image.fromarray(result_arr.astype(np.uint8), "RGBA")
    
    # Flood-fill transparency from image borders so internal white parts (like latte foam or sugar) are NOT made transparent!
    # Let's do connected component from borders:
    from PIL import ImageDraw
    # Create binary mask of outer transparent region
    bin_mask = (final_alpha < 128).astype(np.uint8) * 255
    mask_img = Image.fromarray(bin_mask, mode="L")
    
    # Flood fill from (0,0), (0,H-1), (W-1,0), (W-1,H-1)
    w, h = mask_img.size
    # To be very accurate, we can use a connected floodfill on the mask
    return out_img

print("Testing cutout function...")
