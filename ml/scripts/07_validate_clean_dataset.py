# ============================================================
# PLANTGUARD AI
# 07_validate_clean_dataset.py
#
# Purpose:
# Validate the cleaned dataset before train/validation/test split.
#
# Checks:
# 1. Dataset exists
# 2. Expected classes
# 3. Image count
# 4. Image readability
# 5. Image dimensions
# 6. File sizes
# 7. Duplicate SHA256 hashes
# 8. Metadata consistency
# ============================================================

from pathlib import Path
import hashlib

import pandas as pd
# pyrefly: ignore [missing-import]
from PIL import Image


# ============================================================
# 1. PATH CONFIGURATION
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

CLEAN_DATASET_DIR = (
    PROJECT_ROOT
    / "ml"
    / "datasets"
    / "processed"
    / "plantvillage_clean"
)

CLEAN_METADATA_FILE = (
    PROJECT_ROOT
    / "ml"
    / "datasets"
    / "metadata"
    / "clean_image_metadata.csv"
)


# ============================================================
# 2. EXPECTED CLASSES
# ============================================================

EXPECTED_CLASSES = [
    "Pepper__bell___Bacterial_spot",
    "Pepper__bell___healthy",

    "Potato___Early_blight",
    "Potato___healthy",
    "Potato___Late_blight",

    "Tomato_Bacterial_spot",
    "Tomato_Early_blight",
    "Tomato_healthy",
    "Tomato_Late_blight",
    "Tomato_Leaf_Mold",
    "Tomato_Septoria_leaf_spot",
    "Tomato_Spider_mites_Two_spotted_spider_mite",

    "Tomato__Target_Spot",
    "Tomato__Tomato_mosaic_virus",
    "Tomato__Tomato_YellowLeaf__Curl_Virus",
]


# ============================================================
# 3. SHA256 FUNCTION
# ============================================================

def calculate_sha256(file_path):

    sha256 = hashlib.sha256()

    with open(file_path, "rb") as file:

        while True:

            data = file.read(1024 * 1024)

            if not data:
                break

            sha256.update(data)

    return sha256.hexdigest()


# ============================================================
# 4. MAIN FUNCTION
# ============================================================

def main():

    print("=" * 70)
    print("🌱 PLANTGUARD AI — CLEAN DATASET VALIDATION")
    print("=" * 70)


    # ========================================================
    # CHECK 1 — DATASET EXISTS
    # ========================================================

    print("\n🔎 CHECK 1 — Clean dataset")

    if not CLEAN_DATASET_DIR.exists():

        print("❌ FAIL | Clean dataset does not exist")

        print(
            f"Expected:\n{CLEAN_DATASET_DIR}"
        )

        return

    print("✅ PASS | Clean dataset exists")


    # ========================================================
    # CHECK 2 — METADATA EXISTS
    # ========================================================

    print("\n🔎 CHECK 2 — Clean metadata")

    if not CLEAN_METADATA_FILE.exists():

        print("❌ FAIL | Clean metadata not found")

        return

    print("✅ PASS | clean_image_metadata.csv exists")


    # ========================================================
    # LOAD METADATA
    # ========================================================

    metadata_df = pd.read_csv(
        CLEAN_METADATA_FILE
    )

    print(
        f"\n📊 Metadata records: "
        f"{len(metadata_df):,}"
    )


    # ========================================================
    # CHECK 3 — CLASS VALIDATION
    # ========================================================

    print("\n🔎 CHECK 3 — Class validation")

    actual_classes = sorted(
        metadata_df["Class"]
        .dropna()
        .unique()
        .tolist()
    )

    expected_classes = sorted(
        EXPECTED_CLASSES
    )

    missing_classes = (
        set(expected_classes)
        - set(actual_classes)
    )

    extra_classes = (
        set(actual_classes)
        - set(expected_classes)
    )


    if not missing_classes and not extra_classes:

        print(
            f"✅ PASS | Exactly "
            f"{len(actual_classes)} expected classes found"
        )

    else:

        print("❌ FAIL | Class mismatch")

        if missing_classes:

            print(
                "Missing classes:",
                missing_classes
            )

        if extra_classes:

            print(
                "Unexpected classes:",
                extra_classes
            )


    # ========================================================
    # CHECK 4 — IMAGE COUNT
    # ========================================================

    print("\n🔎 CHECK 4 — Image count")

    image_files = []

    for class_dir in CLEAN_DATASET_DIR.iterdir():

        if class_dir.is_dir():

            for file in class_dir.rglob("*"):

                if file.is_file():

                    image_files.append(file)


    actual_image_count = len(
        image_files
    )

    metadata_count = len(
        metadata_df
    )


    print(
        f"Dataset images : "
        f"{actual_image_count:,}"
    )

    print(
        f"Metadata images: "
        f"{metadata_count:,}"
    )


    if actual_image_count == metadata_count:

        print(
            "✅ PASS | Image count matches metadata"
        )

    else:

        print(
            "❌ FAIL | Image count mismatch"
        )


    # ========================================================
    # CHECK 5 — IMAGE READABILITY
    # ========================================================

    print("\n🔎 CHECK 5 — Image readability")

    unreadable = []

    for index, image_path in enumerate(
        image_files,
        start=1
    ):

        try:

            with Image.open(image_path) as image:

                image.verify()

        except Exception:

            unreadable.append(
                str(image_path)
            )


        if index % 1000 == 0:

            print(
                f"Checked "
                f"{index:,}/{actual_image_count:,}"
            )


    if not unreadable:

        print(
            "✅ PASS | All images are readable"
        )

    else:

        print(
            f"❌ FAIL | "
            f"{len(unreadable)} unreadable images"
        )


    # ========================================================
    # CHECK 6 — IMAGE DIMENSIONS
    # ========================================================

    print("\n🔎 CHECK 6 — Image dimensions")

    invalid_dimensions = []

    for image_path in image_files:

        try:

            with Image.open(image_path) as image:

                width, height = image.size

                if width <= 0 or height <= 0:

                    invalid_dimensions.append(
                        str(image_path)
                    )

        except Exception:

            invalid_dimensions.append(
                str(image_path)
            )


    if not invalid_dimensions:

        print(
            "✅ PASS | All image dimensions are valid"
        )

    else:

        print(
            f"❌ FAIL | "
            f"{len(invalid_dimensions)} invalid dimensions"
        )


    # ========================================================
    # CHECK 7 — FILE SIZE
    # ========================================================

    print("\n🔎 CHECK 7 — File sizes")

    invalid_sizes = []

    for image_path in image_files:

        try:

            if image_path.stat().st_size <= 0:

                invalid_sizes.append(
                    str(image_path)
                )

        except Exception:

            invalid_sizes.append(
                str(image_path)
            )


    if not invalid_sizes:

        print(
            "✅ PASS | All file sizes are valid"
        )

    else:

        print(
            f"❌ FAIL | "
            f"{len(invalid_sizes)} invalid files"
        )


    # ========================================================
    # CHECK 8 — DUPLICATE SHA256
    # ========================================================

    print("\n🔎 CHECK 8 — Exact duplicate detection")

    hashes = {}

    duplicate_groups = 0
    duplicate_records = 0

    for index, image_path in enumerate(
        image_files,
        start=1
    ):

        try:

            file_hash = calculate_sha256(
                image_path
            )

            if file_hash in hashes:

                if hashes[file_hash] == 1:

                    duplicate_groups += 1

                duplicate_records += 1

                hashes[file_hash] += 1

            else:

                hashes[file_hash] = 1

        except Exception:

            pass


        if index % 1000 == 0:

            print(
                f"Hashed "
                f"{index:,}/{actual_image_count:,}"
            )


    if duplicate_records == 0:

        print(
            "✅ PASS | No exact duplicate images found"
        )

    else:

        print(
            "❌ FAIL | Duplicate images detected"
        )

        print(
            f"Duplicate groups : "
            f"{duplicate_groups}"
        )

        print(
            f"Duplicate records: "
            f"{duplicate_records}"
        )


    # ========================================================
    # CHECK 9 — CLASS DISTRIBUTION
    # ========================================================

    print("\n🔎 CHECK 9 — Class distribution")

    class_counts = (
        metadata_df["Class"]
        .value_counts()
        .sort_index()
    )


    print("\nClass counts:")

    for class_name, count in class_counts.items():

        print(
            f"{class_name:<55} : {count:,}"
        )


    # ========================================================
    # CHECK 10 — METADATA PATHS
    # ========================================================

    print("\n🔎 CHECK 10 — Metadata path validation")

    missing_paths = []

    for _, row in metadata_df.iterrows():

        path = (
            CLEAN_DATASET_DIR
            / row["Class"]
            / row["File_Name"]
        )

        if not path.exists():

            missing_paths.append(
                str(path)
            )


    if not missing_paths:

        print(
            "✅ PASS | All metadata images exist"
        )

    else:

        print(
            f"❌ FAIL | "
            f"{len(missing_paths)} metadata paths missing"
        )


    # ========================================================
    # FINAL RESULT
    # ========================================================

    print("\n")
    print("=" * 70)

    all_passed = (
        not missing_classes
        and not extra_classes
        and actual_image_count == metadata_count
        and not unreadable
        and not invalid_dimensions
        and not invalid_sizes
        and duplicate_records == 0
        and not missing_paths
    )


    if all_passed:

        print(
            "🎉 DATASET VALIDATION PASSED"
        )

        print(
            "\nThe cleaned dataset is ready "
            "for train/validation/test splitting."
        )

        print(
            f"\n🌱 Total clean images: "
            f"{actual_image_count:,}"
        )

        print(
            f"🏷️ Total classes: "
            f"{len(actual_classes)}"
        )

    else:

        print(
            "⚠️ DATASET VALIDATION FAILED"
        )

        print(
            "\nFix the failed checks before "
            "creating train/validation/test splits."
        )

    print("=" * 70)


# ============================================================
# SCRIPT ENTRY POINT
# ============================================================

if __name__ == "__main__":
    main()