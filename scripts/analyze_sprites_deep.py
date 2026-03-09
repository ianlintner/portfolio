#!/usr/bin/env python3
"""Deeper analysis of the free_street sprites - content bounding boxes."""
from PIL import Image
import os

base = "public/assets/free_street"
animals = [
    ("1 Dog",   "dog1",  48),
    ("2 Dog 2", "dog2",  48),
    ("3 Cat",   "cat1",  48),
    ("4 Cat 2", "cat2",  48),
    ("5 Rat",   "rat1",  32),
    ("6 Rat 2", "rat2",  32),
    ("7 Bird",  "bird1", 32),
    ("8 Bird 2","bird2", 32),
]

for folder, slug, expected_px in animals:
    path = os.path.join(base, folder)
    print(f"\n=== {folder} ({slug}) expected {expected_px}px ===")
    for f in ["Idle.png", "Walk.png", "Death.png", "Hurt.png", "Attack.png"]:
        fp = os.path.join(path, f)
        if not os.path.exists(fp):
            print(f"  {f}: MISSING")
            continue
        im = Image.open(fp).convert("RGBA")
        w, h = im.size
        fw = h  # square frames
        n_frames = w // fw
        
        # For each frame, get bounding box of non-transparent pixels
        for i in range(n_frames):
            crop = im.crop((i * fw, 0, (i+1) * fw, h))
            bbox = crop.getbbox()
            if bbox:
                bx, by, bw, bh = bbox
                print(f"  {f} frame {i}: content at ({bx},{by})-({bw},{bh}) = {bw-bx}x{bh-by}px")
            else:
                print(f"  {f} frame {i}: EMPTY")
