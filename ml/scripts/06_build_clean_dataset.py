# ============================================================
# PLANTGUARD AI
# 06_build_clean_dataset.py
#
# Purpose:
# Create a clean dataset by removing exact duplicate images
# using SHA256 hashes.
#
# IMPORTANT:
# - RAW DATASET IS NEVER MODIFIED
# - No files are deleted
# - No files are moved from raw
# - Only unique images are copied
# ============================================================

from pathlib import Path
import shutil

import pandas as pd


# ============================================================
# 1. PATH CONFIGURATION
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

# Original dataset - NEVER MODIFY THIS
RAW_DATASET_DIR = (
    PROJECT_ROOT
    / "ml"
    / "datasets"
    / "raw"
    / "plantvillage"
    / "PlantVillage"
)

# Metadata generated earlier
METADATA_FILE = (
    PROJECT_ROOT
    / "ml"
    / "datasets"
    / "metadata"
    / "image_metadata.csv"
)

# Clean dataset destination
CLEAN_DATASET_DIR = (
    PROJECT_ROOT
    / "ml"
    / "datasets"
    / "processed"
    / "plantvillage_clean"
)

# Clean metadata destination
CLEAN_METADATA_DIR = (
    PROJECT_ROOT
    / "ml"
    / "datasets"
    / "metadata"
)


# ============================================================
# 2. CREATE OUTPUT DIRECTORY
# ============================================================

CLEAN_DATASET_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ============================================================
# 3. MAIN FUNCTION
# ============================================================

def main():

    print("=" * 70)
    print("🌱 PLANTGUARD AI — CLEAN DATASET CREATION")
    print("=" * 70)

    # --------------------------------------------------------
    # Check raw dataset
    # --------------------------------------------------------

    if not RAW_DATASET_DIR.exists():

        print("\n❌ Raw dataset not found:")
        print(RAW_DATASET_DIR)

        return

    # --------------------------------------------------------
    # Check metadata
    # --------------------------------------------------------

    if not METADATA_FILE.exists():

        print("\n❌ Metadata file not found:")
        print(METADATA_FILE)

        return

    print("\n📂 Raw dataset:")
    print(RAW_DATASET_DIR)

    print("\n📄 Metadata:")
    print(METADATA_FILE)

    print("\n📁 Clean dataset:")
    print(CLEAN_DATASET_DIR)


    # ========================================================
    # 4. LOAD METADATA
    # ========================================================

    print("\n🔄 Loading metadata...")

    df = pd.read_csv(
        METADATA_FILE
    )

    print(
        f"Metadata records: {len(df):,}"
    )


    # ========================================================
    # 5. REMOVE EXACT DUPLICATES USING SHA256
    # ========================================================

    print("\n🔍 Finding exact duplicates...")

    # Keep the first occurrence of each SHA256.
    #
    # Example:
    #
    # SHA256 ABC
    #     image1.jpg  ← KEEP
    #     image2.jpg  ← REMOVE FROM CLEAN DATASET
    #
    # Raw files remain untouched.

    unique_df = (
        df.drop_duplicates(
            subset="SHA256",
            keep="first"
        )
        .copy()
    )


    duplicate_count = (
        len(df) - len(unique_df)
    )


    print(
        f"Original records : {len(df):,}"
    )

    print(
        f"Unique records   : {len(unique_df):,}"
    )

    print(
        f"Duplicates removed: {duplicate_count:,}"
    )


    # ========================================================
    # 6. COPY UNIQUE IMAGES
    # ========================================================

    print("\n📦 Copying unique images...")
    print("-" * 70)

    copied = 0
    failed = 0

    total = len(unique_df)


    for index, row in unique_df.iterrows():

        relative_path = Path(
            row["Relative_Path"]
        )

        source_path = (
            PROJECT_ROOT
            / relative_path
        )

        class_name = row["Class"]

        destination_class_dir = (
            CLEAN_DATASET_DIR
            / class_name
        )

        destination_class_dir.mkdir(
            parents=True,
            exist_ok=True
        )


        destination_path = (
            destination_class_dir
            / row["File_Name"]
        )


        try:

            if not source_path.exists():

                print(
                    f"\n❌ Source missing:"
                    f"\n   {source_path}"
                )

                failed += 1

                continue


            shutil.copy2(
                source_path,
                destination_path
            )

            copied += 1


            # Progress every 500 images

            if copied % 500 == 0:

                print(
                    f"Processed "
                    f"{copied:,}/{total:,} images..."
                )


        except Exception as error:

            failed += 1

            print(
                f"\n❌ Failed to copy:"
                f"\n   {source_path}"
                f"\n   Error: {error}"
            )


    # ========================================================
    # 7. SAVE CLEAN METADATA
    # ========================================================

    print("\n📄 Creating clean metadata...")

    clean_metadata_file = (
        CLEAN_METADATA_DIR
        / "clean_image_metadata.csv"
    )

    # Store only records that were successfully copied.
    #
    # If everything worked:
    #
    # 20,624 records
    #
    # will be saved.

    successful_paths = []

    for _, row in unique_df.iterrows():

        destination_path = (
            CLEAN_DATASET_DIR
            / row["Class"]
            / row["File_Name"]
        )

        if destination_path.exists():

            successful_paths.append(
                row
            )


    if successful_paths:

        clean_df = pd.DataFrame(
            successful_paths
        )

        clean_df.to_csv(
            clean_metadata_file,
            index=False
        )

    else:

        clean_df = pd.DataFrame()

        print(
            "⚠️ No successfully copied images found."
        )


    # ========================================================
    # 8. VERIFY CLEAN DATASET
    # ========================================================

    print("\n🔎 Verifying clean dataset...")

    actual_clean_images = 0

    for class_dir in CLEAN_DATASET_DIR.iterdir():

        if class_dir.is_dir():

            actual_clean_images += len(
                [
                    file
                    for file in class_dir.rglob("*")
                    if file.is_file()
                ]
            )


    print(
        f"Expected unique images : "
        f"{len(unique_df):,}"
    )

    print(
        f"Actually copied images  : "
        f"{actual_clean_images:,}"
    )

    print(
        f"Copy failures           : "
        f"{failed:,}"
    )


    # ========================================================
    # 9. FINAL STATUS
    # ========================================================

    print("\n")
    print("=" * 70)

    if (
        actual_clean_images
        == len(unique_df)
        and failed == 0
    ):

        print(
            "🎉 CLEAN DATASET CREATED SUCCESSFULLY"
        )

        print(
            "\nOriginal images : "
            f"{len(df):,}"
        )

        print(
            "Duplicate copies removed : "
            f"{duplicate_count:,}"
        )

        print(
            "Clean images : "
            f"{actual_clean_images:,}"
        )

        print(
            "\n✅ RAW DATASET REMAINS UNTOUCHED"
        )

    else:

        print(
            "⚠️ CLEAN DATASET CREATION "
            "COMPLETED WITH ISSUES"
        )

        print(
            f"\nExpected : {len(unique_df):,}"
        )

        print(
            f"Copied   : {actual_clean_images:,}"
        )

        print(
            f"Failed   : {failed:,}"
        )

    print("=" * 70)


# ============================================================
# SCRIPT ENTRY POINT
# ============================================================

if __name__ == "__main__":
    main()