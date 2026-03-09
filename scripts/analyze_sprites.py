#!/usr/bin/env python3
"""Analyze the free_street sprite sheets to understand frame sizes and layouts."""
from PIL import Image
import os

base = "public/assets/free_street"
for folder in sorted(os.listdir(base)):
    full = os.path.join(base, folder)
    if not os.path.isdir(full):
        continue
    print(f"\n=== {folder} ===")
    for f in sorted(os.listdir(full)):
        if f.endswith(".png"):
            im = Image.open(os.path.join(full, f)).convert("RGBA")
            w, h = im.size
            # Try to figure out frame count by finding non-transparent bounding boxes
            # Check common frame widths: h (square), w/2, w/3, ...
            print(f"  {f}: {w}x{h}px  (aspect {w/h:.2f}:1)")
            # Count frames by scanning columns for alpha content
            # Assume frames are arranged horizontally in a single row
            # Try frame width = height (square frames)
            fw = h  # typical: square frames
            if w % fw == 0:
                num_frames = w // fw
                # Verify each frame has content
                filled = []
                for i in range(num_frames):
                    crop = im.crop((i * fw, 0, (i + 1) * fw, h))
                    alpha = crop.getchannel("A")
                    px_count = sum(1 for p in alpha.getdata() if p > 0)
                    if px_count > 0:
                        filled.append(i)
                print(f"    -> {num_frames} frames @ {fw}x{h}, filled: {filled}")
            else:
                print(f"    -> not evenly divisible by height ({h})")
                # Try common frame counts
                for n in [2, 3, 4, 5, 6, 7, 8, 10, 12]:
                    if w % n == 0:
                        fw2 = w // n
                        print(f"    -> could be {n} frames @ {fw2}x{h}")
                        break
