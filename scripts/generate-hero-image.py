#!/usr/bin/env python3
"""Generate a PNG hero image for the Space Tycoon blog post."""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import random
import math
import os

# Create 1200x630 image
W, H = 1200, 630
img = Image.new("RGB", (W, H), "#0f172a")
draw = ImageDraw.Draw(img)

# Draw subtle grid
for x in range(0, W, 40):
    draw.line([(x, 0), (x, H)], fill="#1a2236", width=1)
for y in range(0, H, 40):
    draw.line([(0, y), (W, y)], fill="#1a2236", width=1)

# Background stars
random.seed(42)
for _ in range(200):
    x = random.randint(0, W)
    y = random.randint(0, H)
    r = random.uniform(0.5, 2.0)
    brightness = random.randint(100, 220)
    color = (brightness, brightness, min(255, brightness + 30))
    draw.ellipse([x - r, y - r, x + r, y + r], fill=color)

# Draw a large glowing star (central)
cx, cy = 880, 200
for radius in range(80, 0, -2):
    brightness = int(40 + 60 * (1 - radius / 80))
    draw.ellipse(
        [cx - radius, cy - radius, cx + radius, cy + radius],
        fill=(brightness, int(brightness * 0.7), 0),
    )

# Bright star core
draw.ellipse([cx - 14, cy - 14, cx + 14, cy + 14], fill=(255, 222, 120))
draw.ellipse([cx - 8, cy - 8, cx + 8, cy + 8], fill=(255, 248, 200))

# Orbital rings (dashed effect)
for rx, ry in [(100, 50), (160, 80)]:
    for angle in range(0, 360, 4):
        rad = math.radians(angle)
        x = cx + rx * math.cos(rad)
        y = cy + ry * math.sin(rad)
        if angle % 8 < 4:
            draw.ellipse([x - 0.5, y - 0.5, x + 0.5, y + 0.5], fill="#334155")

# Planet 1 (blue)
px1, py1 = 780, 220
draw.ellipse([px1 - 12, py1 - 12, px1 + 12, py1 + 12], fill="#3b82f6")
draw.ellipse([px1 - 8, py1 - 8, px1 + 8, py1 + 8], fill="#60a5fa")

# Planet 2 (green)
px2, py2 = 1020, 175
draw.ellipse([px2 - 9, py2 - 9, px2 + 9, py2 + 9], fill="#10b981")
draw.ellipse([px2 - 6, py2 - 6, px2 + 6, py2 + 6], fill="#34d399")

# Trade route lines (dashed gold)
for i in range(0, 100, 6):
    t = i / 100
    x = px1 + t * (px2 - px1)
    y = py1 + t * (py2 - py1)
    if i % 12 < 6:
        draw.ellipse([x - 1, y - 1, x + 1, y + 1], fill="#ffd178")

# Distant stars with color
for sx, sy, sc in [
    (640, 140, "#8b5cf6"),
    (490, 270, "#f97316"),
    (710, 300, "#0ea5e9"),
]:
    draw.ellipse([sx - 5, sy - 5, sx + 5, sy + 5], fill=sc)

# Hyperlane lines
for x1, y1, x2, y2, c in [
    (880, 200, 640, 140, "#6dc8ff"),
    (640, 140, 490, 270, "#6dc8ff"),
]:
    for i in range(0, 100, 5):
        t = i / 100
        x = x1 + t * (x2 - x1)
        y = y1 + t * (y2 - y1)
        if i % 10 < 5:
            draw.ellipse([x - 0.5, y - 0.5, x + 0.5, y + 0.5], fill=c)

# UI panel wireframe (top-left)
draw.rounded_rectangle(
    [70, 70, 360, 260], radius=8, fill="#1e293b", outline="#334155", width=2
)
draw.rounded_rectangle([85, 85, 345, 110], radius=4, fill="#334155")

# Load fonts
try:
    font_sm = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 12)
    font_md = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 10)
    font_title = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 48)
    font_subtitle = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 32)
    font_author = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 20)
    font_badge = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 16)
except Exception:
    font_sm = ImageFont.load_default()
    font_md = font_sm
    font_title = font_sm
    font_subtitle = font_sm
    font_author = font_sm
    font_badge = font_sm

draw.text((100, 90), "Panel Component", fill="#94a3b8", font=font_sm)
draw.rounded_rectangle([85, 120, 210, 142], radius=4, fill="#3b82f6")
draw.text((105, 125), "Button", fill="white", font=font_md)
draw.rounded_rectangle([220, 120, 345, 142], radius=4, fill="#334155", outline="#475569")
draw.text((240, 125), "Dropdown", fill="#94a3b8", font=font_md)

# Progress bar
draw.rounded_rectangle([85, 152, 345, 162], radius=4, fill="#334155")
draw.rounded_rectangle([85, 152, 250, 162], radius=4, fill="#10b981")

# Data table
draw.rounded_rectangle([85, 172, 345, 245], radius=4, fill="#0f172a", outline="#334155")
for i, row_y in enumerate([185, 200, 215, 230]):
    draw.text((100, row_y - 5), f"DataTable Row {i+1}", fill="#64748b", font=font_md)
    if i < 3:
        draw.line([(85, row_y + 8), (345, row_y + 8)], fill="#334155", width=1)

# 3D cube wireframe (representing Three.js)
cube_x, cube_y = 430, 80
pts = [
    (0, 40),
    (60, 10),
    (120, 40),
    (60, 70),
]
for i in range(4):
    x1 = cube_x + pts[i][0]
    y1 = cube_y + pts[i][1]
    x2 = cube_x + pts[(i + 1) % 4][0]
    y2 = cube_y + pts[(i + 1) % 4][1]
    draw.line([(x1, y1), (x2, y2)], fill="#8b5cf6", width=2)

# Vertical edges
draw.line([(cube_x, cube_y + 40), (cube_x, cube_y + 100)], fill="#6d4dab", width=1)
draw.line(
    [(cube_x + 120, cube_y + 40), (cube_x + 120, cube_y + 100)],
    fill="#8b5cf6",
    width=2,
)
draw.line(
    [(cube_x + 60, cube_y + 70), (cube_x + 60, cube_y + 130)],
    fill="#8b5cf6",
    width=2,
)

# Bottom edges
draw.line(
    [(cube_x, cube_y + 100), (cube_x + 60, cube_y + 130)], fill="#6d4dab", width=1
)
draw.line(
    [(cube_x + 60, cube_y + 130), (cube_x + 120, cube_y + 100)],
    fill="#8b5cf6",
    width=2,
)
draw.text((cube_x + 25, cube_y + 145), "Three.js", fill="#a78bfa", font=font_sm)

# Phaser 4 badge
draw.rounded_rectangle(
    [70, 285, 220, 330], radius=6, fill="#0c3a5e", outline="#0ea5e9", width=2
)
draw.text((95, 295), "Phaser 4", fill="#0ea5e9", font=font_badge)

# Title text
draw.text((70, 400), "Star Freight Tycoon", fill="white", font=font_title)
draw.text((70, 465), "Phaser 4, 3D Galaxies &", fill="#94a3b8", font=font_subtitle)
draw.text((70, 505), "a Canvas UI Library", fill="#94a3b8", font=font_subtitle)

# Author
draw.text((980, 565), "by Ian Lintner", fill="#64748b", font=font_author)

# Save
out_path = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "public",
    "images",
    "space-tycoon-phaser4-upgrade-social.png",
)
img.save(out_path, "PNG", quality=95)
print(f"Generated: {out_path}")
print(f"Size: {img.size}")
