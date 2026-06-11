from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "public" / "yupoo-products"
OUTPUT_DIR = ROOT / "public" / "optimized-products"
MANIFEST_PATH = ROOT / "public" / "cms" / "image-manifest.json"

SIZES = {
    "thumb": (320, 68),
    "card": (640, 74),
    "detail": (1200, 82),
}


def public_path(path: Path) -> str:
    return "/" + path.relative_to(ROOT / "public").as_posix()


def convert_one(source: Path) -> dict[str, dict[str, str]]:
    rel = source.relative_to(SOURCE_DIR)
    stem_dir = OUTPUT_DIR / rel.parent
    stem = rel.stem
    stem_dir.mkdir(parents=True, exist_ok=True)

    result: dict[str, dict[str, str]] = {}
    with Image.open(source) as raw:
        image = ImageOps.exif_transpose(raw).convert("RGB")
        for size_name, (width, quality) in SIZES.items():
            resized = image.copy()
            resized.thumbnail((width, width), Image.Resampling.LANCZOS)
            avif_path = stem_dir / f"{stem}-{size_name}.avif"
            webp_path = stem_dir / f"{stem}-{size_name}.webp"
            if not avif_path.exists():
                resized.save(avif_path, "AVIF", quality=quality, speed=6)
            if not webp_path.exists():
                resized.save(webp_path, "WEBP", quality=quality, method=6)
            result[size_name] = {
                "avif": public_path(avif_path),
                "webp": public_path(webp_path),
                "jpg": public_path(source),
            }
    return result


def main() -> None:
    manifest: dict[str, dict[str, dict[str, str]]] = {}
    images = sorted(SOURCE_DIR.rglob("*.jpg"))
    for index, source in enumerate(images, 1):
        key = public_path(source)
        manifest[key] = convert_one(source)
        if index % 25 == 0:
            print(f"optimized {index}/{len(images)}")

    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"optimized {len(images)} images")


if __name__ == "__main__":
    main()
