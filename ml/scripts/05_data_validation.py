# ============================================================
# PLANTGUARD AI
# 05_data_validation.py
#
# Purpose:
# Validate dataset metadata before creating train/validation/test
# splits.
#
# IMPORTANT:
# This script DOES NOT modify, move, or delete any image.
# ============================================================

from pathlib import Path
import json
import hashlib

import pandas as pd


# ============================================================
# 1. PATH CONFIGURATION
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

RAW_DATASET_DIR = (
    PROJECT_ROOT
    / "ml"
    / "datasets"
    / "raw"
    / "plantvillage"
    / "PlantVillage"
)

METADATA_DIR = (
    PROJECT_ROOT
    / "ml"
    / "datasets"
    / "metadata"
)

IMAGE_METADATA_FILE = (
    METADATA_DIR
    / "image_metadata.csv"
)

SUMMARY_FILE = (
    METADATA_DIR
    / "dataset_summary.json"
)


# ============================================================
# 2. EXPECTED CLASSES
# ============================================================

EXPECTED_CLASSES = {
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
}


# ============================================================
# 3. REQUIRED METADATA COLUMNS
# ============================================================

REQUIRED_COLUMNS = {
    "Image_ID",
    "Class",
    "File_Name",
    "Relative_Path",
    "File_Extension",
    "Image_Format",
    "Width",
    "Height",
    "Aspect_Ratio",
    "Color_Mode",
    "File_Size_Bytes",
    "SHA256",
    "Readable",
}


# ============================================================
# 4. VALIDATION HELPERS
# ============================================================

def print_result(check_name, passed, details=""):
    """
    Print a consistent PASS/FAIL validation result.
    """

    status = "✅ PASS" if passed else "❌ FAIL"

    print(f"{status} | {check_name}")

    if details:
        print(f"       {details}")


# ============================================================
# 5. MAIN VALIDATION
# ============================================================

def main():

    print("=" * 70)
    print("🌱 PLANTGUARD AI — DATASET VALIDATION")
    print("=" * 70)


    # ========================================================
    # CHECK 1 — Required files exist
    # ========================================================

    print("\n🔎 CHECK 1 — Required metadata files")

    metadata_exists = IMAGE_METADATA_FILE.exists()
    summary_exists = SUMMARY_FILE.exists()

    print_result(
        "image_metadata.csv exists",
        metadata_exists
    )

    print_result(
        "dataset_summary.json exists",
        summary_exists
    )

    if not metadata_exists:

        print("\n❌ Cannot continue.")
        print(f"Missing: {IMAGE_METADATA_FILE}")
        return


    # ========================================================
    # LOAD METADATA
    # ========================================================

    df = pd.read_csv(
        IMAGE_METADATA_FILE
    )

    print(
        f"\n📊 Metadata records loaded: "
        f"{len(df):,}"
    )


    # ========================================================
    # CHECK 2 — Required columns
    # ========================================================

    print("\n🔎 CHECK 2 — Required metadata columns")

    actual_columns = set(df.columns)

    missing_columns = (
        REQUIRED_COLUMNS - actual_columns
    )

    print_result(
        "All required columns present",
        len(missing_columns) == 0,
        (
            "Missing: "
            + ", ".join(sorted(missing_columns))
            if missing_columns
            else ""
        )
    )


    # ========================================================
    # CHECK 3 — Dataset class count
    # ========================================================

    print("\n🔎 CHECK 3 — Class validation")

    actual_classes = set(
        df["Class"].dropna().unique()
    )

    missing_classes = (
        EXPECTED_CLASSES - actual_classes
    )

    unexpected_classes = (
        actual_classes - EXPECTED_CLASSES
    )

    classes_valid = (
        len(missing_classes) == 0
        and len(unexpected_classes) == 0
    )

    details = (
        f"Found {len(actual_classes)} classes."
    )

    if missing_classes:

        details += (
            f" Missing: {sorted(missing_classes)}."
        )

    if unexpected_classes:

        details += (
            f" Unexpected: {sorted(unexpected_classes)}."
        )

    print_result(
        "Exactly 15 expected classes found",
        classes_valid,
        details
    )


    # ========================================================
    # CHECK 4 — Missing values
    # ========================================================

    print("\n🔎 CHECK 4 — Missing metadata values")

    missing_values = (
        df.isnull()
        .sum()
    )

    total_missing = int(
        missing_values.sum()
    )

    print_result(
        "No missing metadata values",
        total_missing == 0,
        f"Total missing values: {total_missing}"
    )

    if total_missing > 0:

        print("\nColumns containing missing values:")

        print(
            missing_values[
                missing_values > 0
            ]
        )


    # ========================================================
    # CHECK 5 — Readable images
    # ========================================================

    print("\n🔎 CHECK 5 — Image readability")

    unreadable_count = int(
        (~df["Readable"])
        .sum()
    )

    print_result(
        "All images are readable",
        unreadable_count == 0,
        f"Unreadable images: {unreadable_count:,}"
    )


    # ========================================================
    # CHECK 6 — Image dimensions
    # ========================================================

    print("\n🔎 CHECK 6 — Image dimensions")

    invalid_dimensions = df[
        (df["Width"] <= 0)
        | (df["Height"] <= 0)
    ]

    print_result(
        "All image dimensions are valid",
        len(invalid_dimensions) == 0,
        f"Invalid dimension records: {len(invalid_dimensions):,}"
    )


    # ========================================================
    # CHECK 7 — File sizes
    # ========================================================

    print("\n🔎 CHECK 7 — File sizes")

    invalid_sizes = df[
        df["File_Size_Bytes"] <= 0
    ]

    print_result(
        "All file sizes are valid",
        len(invalid_sizes) == 0,
        f"Invalid files: {len(invalid_sizes):,}"
    )


    # ========================================================
    # CHECK 8 — File paths
    # ========================================================

    print("\n🔎 CHECK 8 — File path validation")

    missing_files = []

    for relative_path in df[
        "Relative_Path"
    ]:

        full_path = (
            PROJECT_ROOT
            / relative_path
        )

        if not full_path.exists():

            missing_files.append(
                str(relative_path)
            )

    print_result(
        "All metadata paths exist",
        len(missing_files) == 0,
        f"Missing files: {len(missing_files):,}"
    )


    # ========================================================
    # CHECK 9 — SHA256 duplicates
    # ========================================================

    print("\n🔎 CHECK 9 — Exact duplicate detection")

    duplicate_hash_mask = (
        df["SHA256"]
        .duplicated(keep=False)
    )

    duplicate_hash_count = int(
        duplicate_hash_mask.sum()
    )

    duplicate_hash_groups = int(
        df.loc[
            duplicate_hash_mask,
            "SHA256"
        ].nunique()
    )

    print_result(
        "No duplicate SHA256 files",
        duplicate_hash_count == 0,
        (
            f"Duplicate image records: "
            f"{duplicate_hash_count:,}; "
            f"duplicate hash groups: "
            f"{duplicate_hash_groups:,}"
        )
    )


    # ========================================================
    # CHECK 10 — Duplicate paths
    # ========================================================

    print("\n🔎 CHECK 10 — Duplicate metadata paths")

    duplicate_paths = int(
        df["Relative_Path"]
        .duplicated()
        .sum()
    )

    print_result(
        "No duplicate image paths",
        duplicate_paths == 0,
        f"Duplicate paths: {duplicate_paths:,}"
    )


    # ========================================================
    # CHECK 11 — Image ID uniqueness
    # ========================================================

    print("\n🔎 CHECK 11 — Image ID uniqueness")

    duplicate_ids = int(
        df["Image_ID"]
        .duplicated()
        .sum()
    )

    print_result(
        "Image IDs are unique",
        duplicate_ids == 0,
        f"Duplicate IDs: {duplicate_ids:,}"
    )


    # ========================================================
    # CHECK 12 — Class distribution
    # ========================================================

    print("\n🔎 CHECK 12 — Class distribution")

    class_counts = (
        df["Class"]
        .value_counts()
        .sort_index()
    )

    print("\nClass counts:")

    print(
        class_counts.to_string()
    )


    # ========================================================
    # CHECK 13 — Metadata vs summary
    # ========================================================

    print("\n🔎 CHECK 13 — Summary consistency")

    summary_consistent = True

    if SUMMARY_FILE.exists():

        try:

            with open(
                SUMMARY_FILE,
                "r",
                encoding="utf-8"
            ) as file:

                summary = json.load(file)


            summary_total = summary.get(
                "total_images"
            )

            summary_classes = summary.get(
                "total_classes"
            )


            total_matches = (
                summary_total == len(df)
            )

            class_matches = (
                summary_classes
                == len(actual_classes)
            )

            summary_consistent = (
                total_matches
                and class_matches
            )


            details = (
                f"Metadata images: {len(df):,}, "
                f"Summary images: {summary_total:,}; "
                f"Metadata classes: {len(actual_classes)}, "
                f"Summary classes: {summary_classes}"
            )

        except Exception as error:

            summary_consistent = False

            details = str(error)

    else:

        summary_consistent = False
        details = "dataset_summary.json not found."


    print_result(
        "Metadata and summary are consistent",
        summary_consistent,
        details
    )


    # ========================================================
    # FINAL VALIDATION STATUS
    # ========================================================

    checks = [

        metadata_exists,
        summary_exists,
        len(missing_columns) == 0,
        classes_valid,
        total_missing == 0,
        unreadable_count == 0,
        len(invalid_dimensions) == 0,
        len(invalid_sizes) == 0,
        len(missing_files) == 0,
        duplicate_hash_count == 0,
        duplicate_paths == 0,
        duplicate_ids == 0,
        summary_consistent,
    ]

    all_passed = all(checks)


    print("\n")
    print("=" * 70)

    if all_passed:

        print(
            "🎉 DATASET VALIDATION PASSED"
        )

        print(
            "\nThe dataset is ready for the "
            "next processing stage."
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