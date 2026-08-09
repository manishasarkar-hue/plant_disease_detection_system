from pathlib import Path
from collections import defaultdict
# pyrefly: ignore [missing-import]
from PIL import Image  # type: ignore
# pyrefly: ignore [missing-import]
import imagehash  # type: ignore
import json


# ============================================================
# CONFIGURATION
# ============================================================

ROOT_DIR = Path("ml/datasets/raw/plantvillage")

OUTER_DIR = ROOT_DIR
INNER_DIR = ROOT_DIR / "PlantVillage"

REPORT_DIR = Path("ml/reports")

REPORT_FILE = REPORT_DIR / "near_duplicate_report.json"

IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".bmp",
    ".webp",
}

# pHash Hamming distance threshold
HASH_DISTANCE_THRESHOLD = 5


# ============================================================
# CREATE REPORT DIRECTORY
# ============================================================

REPORT_DIR.mkdir(parents=True, exist_ok=True)


# ============================================================
# COLLECT IMAGES
# ============================================================

def collect_images(folder, exclude_folder=None):

    images = []

    for path in folder.rglob("*"):

        if not path.is_file():
            continue

        if path.suffix.lower() not in IMAGE_EXTENSIONS:
            continue

        if exclude_folder and exclude_folder in path.parents:
            continue

        images.append(path)

    return images


# ============================================================
# CALCULATE PERCEPTUAL HASH
# ============================================================

def calculate_phash(image_path):

    try:

        with Image.open(image_path) as image:

            image = image.convert("RGB")

            return imagehash.phash(image)

    except Exception as error:

        print(f"⚠️ Could not process:")
        print(image_path)
        print(f"Error: {error}")

        return None


# ============================================================
# BUILD HASH INDEX
# ============================================================

def build_hash_index(images):

    hash_index = defaultdict(list)

    failed_images = []

    for index, image_path in enumerate(images, start=1):

        image_hash = calculate_phash(image_path)

        if image_hash is None:

            failed_images.append(str(image_path))

            continue

        hash_index[str(image_hash)].append(
            image_path
        )

        if index % 1000 == 0:

            print(
                f"Processed "
                f"{index}/{len(images)} images..."
            )

    return hash_index, failed_images


# ============================================================
# FIND CROSS-DATASET NEAR DUPLICATES
# ============================================================

def find_near_duplicates(
    outer_index,
    inner_index
):

    print(
        "\n🔎 Finding exact pHash matches first..."
    )

    outer_hashes = set(outer_index.keys())
    inner_hashes = set(inner_index.keys())

    exact_phash_matches = (
        outer_hashes & inner_hashes
    )

    # --------------------------------------------------------
    # Only hashes that DON'T have an exact pHash match
    # need further investigation.
    # --------------------------------------------------------

    unmatched_outer_hashes = (
        outer_hashes - inner_hashes
    )

    unmatched_inner_hashes = (
        inner_hashes - outer_hashes
    )

    print(
        f"Exact pHash hash groups : "
        f"{len(exact_phash_matches)}"
    )

    print(
        f"Unmatched outer hashes  : "
        f"{len(unmatched_outer_hashes)}"
    )

    print(
        f"Unmatched inner hashes  : "
        f"{len(unmatched_inner_hashes)}"
    )

    print(
        "\n🔍 Comparing ONLY unmatched hashes..."
    )

    near_duplicates = []

    # --------------------------------------------------------
    # Compare only the small unmatched sets
    # --------------------------------------------------------

    for outer_hash_string in unmatched_outer_hashes:

        outer_hash = imagehash.hex_to_hash(
            outer_hash_string
        )

        for inner_hash_string in unmatched_inner_hashes:

            inner_hash = imagehash.hex_to_hash(
                inner_hash_string
            )

            distance = outer_hash - inner_hash

            if distance <= HASH_DISTANCE_THRESHOLD:

                for outer_image in outer_index[
                    outer_hash_string
                ]:

                    for inner_image in inner_index[
                        inner_hash_string
                    ]:

                        near_duplicates.append({

                            "outer_image": str(
                                outer_image
                            ),

                            "inner_image": str(
                                inner_image
                            ),

                            "hash_distance": distance,

                        })

    return (
        near_duplicates,
        exact_phash_matches,
        unmatched_outer_hashes,
        unmatched_inner_hashes,
    )


# ============================================================
# MAIN
# ============================================================

def main():

    print("=" * 70)

    print(
        "PLANTGUARD AI - OPTIMIZED "
        "NEAR DUPLICATE ANALYSIS"
    )

    print("=" * 70)

    # --------------------------------------------------------
    # Validate dataset
    # --------------------------------------------------------

    if not ROOT_DIR.exists():

        print("❌ Dataset directory not found:")
        print(ROOT_DIR)

        return

    if not INNER_DIR.exists():

        print(
            "❌ Inner PlantVillage directory "
            "not found:"
        )

        print(INNER_DIR)

        return

    # --------------------------------------------------------
    # Scan outer dataset
    # --------------------------------------------------------

    print("\n📂 Scanning outer dataset...")

    outer_images = collect_images(
        OUTER_DIR,
        exclude_folder=INNER_DIR
    )

    print(
        f"Outer images: {len(outer_images)}"
    )

    # --------------------------------------------------------
    # Scan inner dataset
    # --------------------------------------------------------

    print(
        "\n📂 Scanning inner PlantVillage dataset..."
    )

    inner_images = collect_images(
        INNER_DIR
    )

    print(
        f"Inner images: {len(inner_images)}"
    )

    # --------------------------------------------------------
    # Hash outer dataset
    # --------------------------------------------------------

    print(
        "\n🔍 Generating pHash "
        "for OUTER dataset..."
    )

    outer_index, outer_failed = (
        build_hash_index(outer_images)
    )

    # --------------------------------------------------------
    # Hash inner dataset
    # --------------------------------------------------------

    print(
        "\n🔍 Generating pHash "
        "for INNER dataset..."
    )

    inner_index, inner_failed = (
        build_hash_index(inner_images)
    )

    # --------------------------------------------------------
    # Compare efficiently
    # --------------------------------------------------------

    (
        near_duplicates,
        exact_phash_matches,
        unmatched_outer,
        unmatched_inner,

    ) = find_near_duplicates(
        outer_index,
        inner_index
    )

    # --------------------------------------------------------
    # Build report
    # --------------------------------------------------------

    report = {

        "dataset":
            "PlantGuard AI - PlantVillage",

        "outer_image_count":
            len(outer_images),

        "inner_image_count":
            len(inner_images),

        "exact_phash_match_groups":
            len(exact_phash_matches),

        "unmatched_outer_hash_groups":
            len(unmatched_outer),

        "unmatched_inner_hash_groups":
            len(unmatched_inner),

        "hash_distance_threshold":
            HASH_DISTANCE_THRESHOLD,

        "near_duplicate_pairs":
            len(near_duplicates),

        "failed_outer_images":
            outer_failed,

        "failed_inner_images":
            inner_failed,

        "near_duplicates":
            near_duplicates,
    }

    # --------------------------------------------------------
    # Save report
    # --------------------------------------------------------

    with REPORT_FILE.open(
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            report,
            file,
            indent=4
        )

    # --------------------------------------------------------
    # Print results
    # --------------------------------------------------------

    print("\n" + "=" * 70)

    print("RESULT")

    print("=" * 70)

    print(
        f"Outer images              : "
        f"{len(outer_images)}"
    )

    print(
        f"Inner images              : "
        f"{len(inner_images)}"
    )

    print(
        f"Exact pHash groups        : "
        f"{len(exact_phash_matches)}"
    )

    print(
        f"Unmatched outer groups    : "
        f"{len(unmatched_outer)}"
    )

    print(
        f"Unmatched inner groups    : "
        f"{len(unmatched_inner)}"
    )

    print(
        f"Near duplicate pairs      : "
        f"{len(near_duplicates)}"
    )

    print(
        f"Failed outer images       : "
        f"{len(outer_failed)}"
    )

    print(
        f"Failed inner images       : "
        f"{len(inner_failed)}"
    )

    print(
        f"\n📄 Report:"
    )

    print(REPORT_FILE)

    # --------------------------------------------------------
    # Show near duplicates
    # --------------------------------------------------------

    if near_duplicates:

        print(
            "\n⚠️ NEAR DUPLICATE CANDIDATES:"
        )

        for item in near_duplicates[:20]:

            print("\nOuter:")
            print(
                item["outer_image"]
            )

            print("Inner:")

            print(
                item["inner_image"]
            )

            print(
                "Hash distance:",
                item["hash_distance"]
            )

    else:

        print(
            "\n✅ No near duplicate "
            "candidates found."
        )

    print("\n" + "=" * 70)

    print(
        "Near duplicate analysis completed."
    )

    print("=" * 70)


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":

    main()