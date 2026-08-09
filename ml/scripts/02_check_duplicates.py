from pathlib import Path
from collections import defaultdict
import hashlib


# ============================================================
# Configuration
# ============================================================

ROOT = Path("ml/datasets/raw/plantvillage")

OUTER_DIR = ROOT

INNER_DIR = ROOT / "PlantVillage"

IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".bmp",
    ".webp",
}


# ============================================================
# File Hash
# ============================================================

def calculate_hash(file_path: Path) -> str:
    """
    Generate SHA-256 hash for an image file.
    """

    sha256 = hashlib.sha256()

    with file_path.open("rb") as file:

        while chunk := file.read(1024 * 1024):
            sha256.update(chunk)

    return sha256.hexdigest()


# ============================================================
# Collect Images
# ============================================================

def collect_images(folder: Path):

    return [
        path
        for path in folder.rglob("*")
        if path.is_file()
        and path.suffix.lower() in IMAGE_EXTENSIONS
    ]


# ============================================================
# Main
# ============================================================

def main():

    print("=" * 60)
    print("PlantGuard AI - Duplicate Dataset Analysis")
    print("=" * 60)

    print("\nScanning outer dataset...")

    outer_images = [
        path
        for path in collect_images(OUTER_DIR)
        if INNER_DIR not in path.parents
    ]

    print(f"Outer images: {len(outer_images)}")

    print("\nScanning inner PlantVillage dataset...")

    inner_images = collect_images(INNER_DIR)

    print(f"Inner images: {len(inner_images)}")

    print("\nCalculating hashes...")

    outer_hashes = defaultdict(list)
    inner_hashes = defaultdict(list)

    for image in outer_images:

        try:
            file_hash = calculate_hash(image)
            outer_hashes[file_hash].append(image)

        except Exception as error:
            print(f"Could not process: {image}")
            print(error)

    for image in inner_images:

        try:
            file_hash = calculate_hash(image)
            inner_hashes[file_hash].append(image)

        except Exception as error:
            print(f"Could not process: {image}")
            print(error)

    # ========================================================
    # Find duplicates
    # ========================================================

    common_hashes = set(outer_hashes) & set(inner_hashes)

    duplicate_count = sum(
        len(outer_hashes[file_hash])
        for file_hash in common_hashes
    )

    print("\n" + "=" * 60)
    print("RESULT")
    print("=" * 60)

    print(f"Outer images        : {len(outer_images)}")
    print(f"Inner images        : {len(inner_images)}")
    print(f"Matching image hashes: {len(common_hashes)}")
    print(f"Duplicate outer images: {duplicate_count}")

    if common_hashes:

        print("\n⚠️ DUPLICATES FOUND")

        print("\nSample duplicates:")

        shown = 0

        for file_hash in common_hashes:

            outer_file = outer_hashes[file_hash][0]
            inner_file = inner_hashes[file_hash][0]

            print("\nOuter:")
            print(outer_file)

            print("Inner:")
            print(inner_file)

            shown += 1

            if shown >= 10:
                break

    else:

        print("\n✅ No exact duplicates found.")

    print("\n" + "=" * 60)


if __name__ == "__main__":
    main()