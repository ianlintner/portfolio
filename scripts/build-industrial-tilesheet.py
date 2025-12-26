#!/usr/bin/env python3
"""Build a single industrial tilesheet PNG from individual tile PNGs.

Why:
- Loading 81 separate tile images is slow and makes the Phaser preloader appear stuck.
- A single tilesheet reduces network requests to 1.

Output:
- public/assets/game/tilesheets/industrialTiles.png

Layout:
- 32x32 tiles
- 16 columns
- Slot 0 is a transparent (blank) tile
- Tile N (1..81) is placed at slot index N, matching runtime behavior.
"""

from __future__ import annotations

import os
from pathlib import Path


def main() -> int:
    try:
        from PIL import Image  # type: ignore
    except Exception as e:
        print("ERROR: Pillow (PIL) is required to build the tilesheet.")
        print("Install it with: python3 -m pip install pillow")
        print(f"Details: {e}")
        return 2

    repo_root = Path(__file__).resolve().parent.parent

    tiles_dir = repo_root / "public" / "assets" / "game" / "1 Tiles"
    # Also allow the canonical alias path.
    tiles_dir_alias = repo_root / "public" / "assets" / "game" / "1-Tiles"
    if tiles_dir_alias.exists():
        tiles_dir = tiles_dir_alias

    out_dir = repo_root / "public" / "assets" / "game" / "tilesheets"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "industrialTiles.png"

    tile_size = 32
    columns = 16
    tile_numbers = list(range(1, 82))

    slots = max(tile_numbers) + 1  # include slot 0
    rows = (slots + columns - 1) // columns

    width = columns * tile_size
    height = rows * tile_size

    sheet = Image.new("RGBA", (width, height), (0, 0, 0, 0))

    # Slot 0 stays transparent.
    for n in tile_numbers:
        fn = f"IndustrialTile_{n:02d}.png"
        src_path = tiles_dir / fn
        if not src_path.exists():
            raise FileNotFoundError(f"Missing tile file: {src_path}")

        tile = Image.open(src_path).convert("RGBA")
        if tile.size != (tile_size, tile_size):
            tile = tile.resize((tile_size, tile_size), Image.NEAREST)

        slot = n
        col = slot % columns
        row = slot // columns
        x = col * tile_size
        y = row * tile_size
        sheet.paste(tile, (x, y))

    # Ensure deterministic output.
    if out_path.exists():
        out_path.unlink()

    sheet.save(out_path, format="PNG", optimize=True)
    print(f"Wrote tilesheet: {out_path} ({width}x{height})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
