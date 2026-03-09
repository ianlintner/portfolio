#!/usr/bin/env python3
"""
Combine the free_street per-animation sprite strips into one spritesheet per
animal for Phaser.  Each output image is a single-row horizontal strip of
equally-sized square frames.

Layout order: Idle | Walk | Hurt | Death | Attack (if present)

Outputs are written to public/assets/game/enemies/<slug>.png
A companion JSON manifest is printed so the game code knows the frame ranges.
"""
from PIL import Image
import json
import os
import sys

SRC = "public/assets/free_street"
DST = "public/assets/game/enemies"
os.makedirs(DST, exist_ok=True)

ANIMALS = [
    # (folder,  slug,   frame_px)
    ("1 Dog",   "dog1",  48),
    ("2 Dog 2", "dog2",  48),
    ("3 Cat",   "cat1",  48),
    ("4 Cat 2", "cat2",  48),
    ("5 Rat",   "rat1",  32),
    ("6 Rat 2", "rat2",  32),
    ("7 Bird",  "bird1", 32),
    ("8 Bird 2","bird2", 32),
]

# Animation strips to combine, in order.
ANIM_ORDER = ["Idle", "Walk", "Hurt", "Death", "Attack"]

manifest = {}

for folder, slug, px in ANIMALS:
    src_dir = os.path.join(SRC, folder)
    strips: list[tuple[str, Image.Image, int]] = []  # (name, img, num_frames)
    for anim_name in ANIM_ORDER:
        path = os.path.join(src_dir, f"{anim_name}.png")
        if not os.path.exists(path):
            continue
        im = Image.open(path).convert("RGBA")
        w, h = im.size
        n = w // h  # square frames
        strips.append((anim_name.lower(), im, n))

    total_frames = sum(n for _, _, n in strips)
    combo = Image.new("RGBA", (total_frames * px, px), (0, 0, 0, 0))

    offset = 0
    anim_ranges: dict[str, dict] = {}
    for anim_name, im, n in strips:
        for i in range(n):
            frame = im.crop((i * im.size[1], 0, (i + 1) * im.size[1], im.size[1]))
            combo.paste(frame, (offset * px, 0))
            offset += 1
        start = offset - n
        end = offset - 1
        anim_ranges[anim_name] = {"start": start, "end": end, "count": n}

    out_path = os.path.join(DST, f"{slug}.png")
    combo.save(out_path, "PNG")
    manifest[slug] = {
        "file": f"{slug}.png",
        "frameWidth": px,
        "frameHeight": px,
        "totalFrames": total_frames,
        "anims": anim_ranges,
    }
    print(f"  {slug}: {total_frames} frames @ {px}x{px} -> {out_path}")

# Print final manifest for easy copy-paste into TS code
print("\n=== ANIMATION MANIFEST ===")
print(json.dumps(manifest, indent=2))
