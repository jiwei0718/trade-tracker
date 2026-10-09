"""Draw the app icon (globe + trade route) and write every size the project needs.

    python desktop/make_icons.py

Outputs
- trade-tracker-mobile/assets/images/icon.png, favicon.png, splash-icon.png
- trade-tracker-mobile/assets/images/android-icon-{foreground,background,monochrome}.png
- desktop/app.ico (desktop shortcut)
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
IMAGES = ROOT / "trade-tracker-mobile" / "assets" / "images"
BLUE, DEEP, WHITE, ORANGE = (37, 99, 235), (29, 78, 216), (255, 255, 255), (249, 115, 22)
S = 1024  # master size; everything is drawn at 4x and scaled down for smooth edges


def globe(size: int, color, accent, line: float) -> Image.Image:
    """Transparent square with the globe and route centred in it."""
    k = 4
    n = size * k
    img = Image.new("RGBA", (n, n), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    w = max(1, int(line * k))
    c, r = n / 2, n * 0.34
    box = (c - r, c - r, c + r, c + r)
    d.ellipse(box, outline=color, width=w)
    for f in (0.42, 0.82):                       # meridians
        d.ellipse((c - r * f, c - r, c + r * f, c + r), outline=color, width=w)
    d.line((c, c - r, c, c + r), fill=color, width=w)
    for y in (-0.5, 0, 0.5):                     # parallels
        half = r * (1 - y * y) ** 0.5
        d.line((c - half, c + y * r, c + half, c + y * r), fill=color, width=w)
    if accent:                                   # trade route: a curve rising over the globe between two points
        a = (c - r * 0.62, c + r * 0.30)
        b = (c + r * 0.70, c - r * 0.42)
        ctl = (c - r * 0.10, c - r * 1.35)
        pts = [((1 - t) ** 2 * a[0] + 2 * (1 - t) * t * ctl[0] + t * t * b[0],
                (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * ctl[1] + t * t * b[1]) for t in (i / 60 for i in range(61))]
        d.line(pts, fill=accent, width=int(w * 1.6), joint="curve")
        for p in (a, b):
            pr = w * 1.9
            d.ellipse((p[0] - pr, p[1] - pr, p[0] + pr, p[1] + pr), fill=accent)
    return img.resize((size, size), Image.LANCZOS)


def tile(size: int, radius: float | None = 0.22) -> Image.Image:
    """Blue background (rounded square, or full bleed when radius is None)."""
    k = 4
    n = size * k
    bg = Image.new("RGBA", (n, n), (0, 0, 0, 0))
    d = ImageDraw.Draw(bg)
    if radius is None:
        d.rectangle((0, 0, n, n), fill=BLUE)
    else:
        d.rounded_rectangle((0, 0, n - 1, n - 1), radius=int(n * radius), fill=BLUE)
    # soft diagonal shade
    shade = Image.new("RGBA", (n, n), (0, 0, 0, 0))
    ImageDraw.Draw(shade).polygon([(n, n * 0.35), (n, n), (n * 0.35, n)], fill=DEEP + (90,))
    bg = Image.alpha_composite(bg, Image.composite(shade, Image.new("RGBA", (n, n), (0, 0, 0, 0)), bg.split()[3]))
    return bg.resize((size, size), Image.LANCZOS)


def icon(size: int, radius: float | None = 0.22) -> Image.Image:
    return Image.alpha_composite(tile(size, radius), globe(size, WHITE, ORANGE, size * 0.028))


def main() -> None:
    IMAGES.mkdir(parents=True, exist_ok=True)
    icon(S, radius=None).convert("RGB").save(IMAGES / "icon.png")          # stores mask it themselves
    icon(196).save(IMAGES / "favicon.png")
    globe(S, WHITE, ORANGE, S * 0.028).save(IMAGES / "splash-icon.png")
    # Android adaptive icon: 108dp canvas, keep artwork inside the central 66dp safe zone
    fg = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    inner = globe(int(S * 0.62), WHITE, ORANGE, S * 0.62 * 0.03)
    fg.paste(inner, ((S - inner.width) // 2, (S - inner.height) // 2), inner)
    fg.save(IMAGES / "android-icon-foreground.png")
    tile(S, radius=None).save(IMAGES / "android-icon-background.png")
    mono = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    inner_m = globe(int(S * 0.62), (0, 0, 0), (0, 0, 0), S * 0.62 * 0.03)
    mono.paste(inner_m, ((S - inner_m.width) // 2, (S - inner_m.height) // 2), inner_m)
    mono.save(IMAGES / "android-icon-monochrome.png")
    sizes = [16, 24, 32, 48, 64, 128, 256]
    icon(256).save(ROOT / "desktop" / "app.ico", sizes=[(s, s) for s in sizes])
    print("icons written")


if __name__ == "__main__":
    main()
