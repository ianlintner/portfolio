from pathlib import Path
from PIL import Image, ImageDraw

FRAME = 32
COLS = 5
ROWS = 5
W = FRAME * COLS
H = FRAME * ROWS


def draw_dog(frame_idx: int) -> Image.Image:
    img = Image.new("RGBA", (FRAME, FRAME), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    fur = (122, 85, 54, 255)
    fur_dark = (84, 56, 36, 255)
    ear = (61, 39, 26, 255)
    nose = (30, 24, 24, 255)
    eye = (12, 12, 12, 255)
    tongue = (214, 132, 146, 255)
    paw = (161, 120, 95, 255)

    body_y = 11 + (1 if frame_idx in (1, 3) else 0)
    head_x = 21 + (1 if frame_idx == 2 else 0)
    tail_y = 13 + (-1 if frame_idx in (0, 4) else 0)

    d.rectangle((3, tail_y + 4, 7, tail_y + 7), fill=fur_dark)
    d.rectangle((7, tail_y + 3, 11, tail_y + 6), fill=fur)
    d.rectangle((11, tail_y + 2, 14, tail_y + 5), fill=fur)
    d.rectangle((14, tail_y + 3, 17, tail_y + 6), fill=fur_dark)

    d.rectangle((10, body_y, 23, body_y + 9), fill=fur)
    d.rectangle((12, body_y - 2, 20, body_y), fill=fur)
    d.rectangle((13, body_y + 10, 21, body_y + 12), fill=fur_dark)

    leg_sets = [
        ((12, 22, 14, 27), (19, 21, 21, 27)),
        ((13, 21, 15, 27), (18, 22, 20, 27)),
        ((12, 22, 14, 27), (19, 20, 21, 27)),
        ((13, 21, 15, 27), (18, 22, 20, 27)),
        ((12, 23, 14, 27), (19, 23, 21, 27)),
    ]
    front_leg, back_leg = leg_sets[frame_idx]
    d.rectangle(front_leg, fill=paw)
    d.rectangle(back_leg, fill=paw)

    d.rectangle((head_x, body_y + 1, head_x + 6, body_y + 7), fill=fur_dark)
    d.rectangle((head_x + 1, body_y - 2, head_x + 3, body_y), fill=ear)
    d.rectangle((head_x + 4, body_y - 1, head_x + 6, body_y + 1), fill=ear)
    d.rectangle((head_x + 6, body_y + 4, head_x + 8, body_y + 6), fill=nose)
    d.rectangle((head_x + 4, body_y + 2, head_x + 5, body_y + 3), fill=eye)
    d.rectangle((18, body_y + 1, 20, body_y + 4), fill=fur_dark)

    if frame_idx in (1, 3):
        d.rectangle((head_x + 6, body_y + 6, head_x + 7, body_y + 8), fill=tongue)

    if frame_idx == 4:
        img = Image.new("RGBA", (FRAME, FRAME), (0, 0, 0, 0))
        d = ImageDraw.Draw(img)
        d.rectangle((6, 17, 23, 23), fill=fur)
        d.rectangle((22, 16, 27, 22), fill=fur_dark)
        d.rectangle((24, 18, 25, 19), fill=eye)
        d.rectangle((27, 19, 28, 20), fill=nose)
        d.rectangle((4, 18, 8, 21), fill=fur_dark)
        d.rectangle((9, 22, 12, 24), fill=paw)
        d.rectangle((18, 22, 21, 24), fill=paw)

    return img


def main() -> None:
    sheet = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    frames = [draw_dog(i) for i in range(5)]

    for row in range(ROWS):
        for col in range(COLS):
            frame = frames[min(col, 4)]
            sheet.alpha_composite(frame, (col * FRAME, row * FRAME))

    out = Path("public/assets/game/dog-enemy.png")
    out.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out)
    print(f"Wrote {out} ({W}x{H})")


if __name__ == "__main__":
    main()
