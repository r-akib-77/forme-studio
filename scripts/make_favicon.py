"""Generates public/favicon.ico from the FORME disc mark."""
import os

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "favicon.ico")
os.makedirs(os.path.dirname(OUT), exist_ok=True)

INK = (18, 18, 18)
LIME = (200, 240, 0)
PAPER = (255, 255, 255)


def render(size: int) -> Image.Image:
    ss = 8
    n = size * ss
    img = Image.new("RGBA", (n, n), PAPER + (255,))
    d = ImageDraw.Draw(img)
    pad = int(n * 0.1)
    d.ellipse([pad, pad, n - pad, n - pad], fill=INK + (255,))
    # lime quarter, lower-left
    d.pieslice([pad, pad, n - pad, n - pad], 90, 180, fill=LIME + (255,))
    return img.resize((size, size), Image.LANCZOS)


sizes = [16, 32, 48]
frames = [render(s) for s in sizes]
frames[0].save(OUT, format="ICO", sizes=[(s, s) for s in sizes], append_images=frames[1:])
print("wrote", OUT, os.path.getsize(OUT), "bytes")
