# ============================================================
# PLANTGUARD AI
# 04_build_metadata.py
#
# Purpose:
# Build production-level metadata from the raw PlantVillage
# dataset without modifying the original images.
# ============================================================


# ============================================================
# 1. IMPORT REQUIRED LIBRARIES
# ============================================================

from pathlib import Path
import json
import hashlib
from collections import Counter

import pandas as pd
# pyrefly: ignore [missing-import]
from PIL import Image


# ============================================================
# 2. PROJECT PATH CONFIGURATION
# ============================================================

# Project root directory
PROJECT_ROOT = Path(__file__).resolve().parents[2]

# Raw PlantVillage dataset
DATASET_DIR = (
    PROJECT_ROOT
    / "ml"
    / "datasets"
    / "raw"
    / "plantvillage"
    / "PlantVillage"
)

# Metadata output directory
METADATA_DIR = (
    PROJECT_ROOT
    / "ml"
    / "datasets"
    / "metadata"
)


# Create metadata directory if it doesn't exist
METADATA_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ============================================================
# 3. SUPPORTED IMAGE FORMATS
# ============================================================

IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".bmp",
    ".webp",
    ".tif",
    ".tiff"
}


# ============================================================
# 4. HASH FUNCTION
# ============================================================

def calculate_sha256(file_path, chunk_size=1024 * 1024):
    """
    Calculate SHA-256 hash of an image file.

    SHA-256 allows us to uniquely identify identical files
    and helps with duplicate detection.
    """

    sha256 = hashlib.sha256()

    try:

        with open(file_path, "rb") as file:

            while True:

                chunk = file.read(chunk_size)

                if not chunk:
                    break

                sha256.update(chunk)

        return sha256.hexdigest()

    except Exception:
        return None


# ============================================================
# 5. MAIN FUNCTION
# ============================================================

def main():

    print("=" * 70)
    print("🌱 PLANTGUARD AI — METADATA GENERATION")
    print("=" * 70)

    # --------------------------------------------------------
    # Check dataset directory
    # --------------------------------------------------------

    if not DATASET_DIR.exists():

        print("\n❌ Dataset directory not found:")
        print(DATASET_DIR)
        return

    print(f"\n📂 Dataset:")
    print(DATASET_DIR)

    print(f"\n📁 Metadata output:")
    print(METADATA_DIR)


    # --------------------------------------------------------
    # Find class directories
    # --------------------------------------------------------

    class_dirs = sorted(
        [
            directory
            for directory in DATASET_DIR.iterdir()
            if directory.is_dir()
        ]
    )

    print(
        f"\n🌿 Classes found: "
        f"{len(class_dirs)}"
    )


    # --------------------------------------------------------
    # Storage for metadata
    # --------------------------------------------------------

    records = []

    corrupted_images = []

    class_counts = Counter()


    # ========================================================
    # 6. SCAN EVERY CLASS
    # ========================================================

    total_processed = 0

    for class_index, class_dir in enumerate(
        class_dirs,
        start=1
    ):

        class_name = class_dir.name

        print(
            f"\n[{class_index}/{len(class_dirs)}] "
            f"Scanning: {class_name}"
        )


        # Find images recursively
        image_files = sorted(
            [
                path
                for path in class_dir.rglob("*")
                if (
                    path.is_file()
                    and path.suffix.lower()
                    in IMAGE_EXTENSIONS
                )
            ]
        )


        # ----------------------------------------------------
        # Process each image
        # ----------------------------------------------------

        for image_path in image_files:

            total_processed += 1

            relative_path = image_path.relative_to(
                PROJECT_ROOT
            )

            # Basic file information
            file_size_bytes = image_path.stat().st_size

            file_extension = (
                image_path.suffix
                .lower()
                .replace(".", "")
            )


            # ------------------------------------------------
            # Calculate file hash
            # ------------------------------------------------

            file_hash = calculate_sha256(
                image_path
            )


            # ------------------------------------------------
            # Read image metadata
            # ------------------------------------------------

            try:

                with Image.open(image_path) as image:

                    width, height = image.size

                    color_mode = image.mode

                    image_format = image.format

                    # Force loading of image data.
                    # This helps detect corrupted files
                    # that may pass basic header checks.
                    image.verify()


                # Re-open after verify() because verify()
                # invalidates the image object.

                with Image.open(image_path) as image:

                    image.load()


                readable = True


            except Exception as error:

                width = None
                height = None
                color_mode = None
                image_format = None
                readable = False

                corrupted_images.append(
                    {
                        "path": str(relative_path),
                        "error": str(error)
                    }
                )


            # ------------------------------------------------
            # Calculate aspect ratio
            # ------------------------------------------------

            if (
                readable
                and width
                and height
            ):

                aspect_ratio = (
                    width / height
                )

            else:

                aspect_ratio = None


            # ------------------------------------------------
            # Store metadata record
            # ------------------------------------------------

            records.append(
                {
                    "Image_ID": total_processed,
                    "Class": class_name,
                    "File_Name": image_path.name,
                    "Relative_Path": str(relative_path),
                    "File_Extension": file_extension,
                    "Image_Format": image_format,
                    "Width": width,
                    "Height": height,
                    "Aspect_Ratio": aspect_ratio,
                    "Color_Mode": color_mode,
                    "File_Size_Bytes": file_size_bytes,
                    "SHA256": file_hash,
                    "Readable": readable
                }
            )


            # Update class count
            if readable:

                class_counts[class_name] += 1


            # Progress display
            if total_processed % 1000 == 0:

                print(
                    f"   Processed "
                    f"{total_processed:,} images..."
                )


    # ========================================================
    # 7. CREATE DATAFRAME
    # ========================================================

    metadata_df = pd.DataFrame(records)


    # ========================================================
    # 8. SAVE IMAGE METADATA
    # ========================================================

    image_metadata_path = (
        METADATA_DIR
        / "image_metadata.csv"
    )

    metadata_df.to_csv(
        image_metadata_path,
        index=False
    )


    # ========================================================
    # 9. CREATE CLASS DISTRIBUTION
    # ========================================================

    class_distribution = (
        metadata_df[
            metadata_df["Readable"] == True
        ]
        .groupby("Class")
        .size()
        .reset_index(
            name="Image_Count"
        )
        .sort_values(
            "Image_Count",
            ascending=False
        )
    )


    # Add percentage
    total_valid_images = (
        class_distribution["Image_Count"]
        .sum()
    )

    class_distribution["Percentage"] = (
        class_distribution["Image_Count"]
        / total_valid_images
        * 100
    )


    # Save class distribution
    class_distribution_path = (
        METADATA_DIR
        / "class_distribution.csv"
    )

    class_distribution.to_csv(
        class_distribution_path,
        index=False
    )


    # ========================================================
    # 10. DATASET SUMMARY
    # ========================================================

    total_images = len(metadata_df)

    valid_images = int(
        metadata_df["Readable"].sum()
    )

    invalid_images = (
        total_images - valid_images
    )


    summary = {

        "dataset_name": "PlantVillage",

        "total_classes": len(class_dirs),

        "total_images": total_images,

        "valid_images": valid_images,

        "invalid_images": invalid_images,

        "class_counts": {
            class_name: int(count)
            for class_name, count
            in class_counts.items()
        },

        "supported_extensions": sorted(
            IMAGE_EXTENSIONS
        ),

        "metadata_files": [
            "image_metadata.csv",
            "class_distribution.csv",
            "dataset_summary.json"
        ]
    }


    # ========================================================
    # 11. SAVE SUMMARY JSON
    # ========================================================

    summary_path = (
        METADATA_DIR
        / "dataset_summary.json"
    )

    with open(
        summary_path,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            summary,
            file,
            indent=4
        )


    # ========================================================
    # 12. FINAL REPORT
    # ========================================================

    print("\n")
    print("=" * 70)
    print("📊 METADATA GENERATION COMPLETED")
    print("=" * 70)

    print(
        f"\nTotal classes       : "
        f"{len(class_dirs)}"
    )

    print(
        f"Total images        : "
        f"{total_images:,}"
    )

    print(
        f"Valid images        : "
        f"{valid_images:,}"
    )

    print(
        f"Invalid images      : "
        f"{invalid_images:,}"
    )

    print("\n📁 Generated files:")

    print(
        f"   ✓ {image_metadata_path}"
    )

    print(
        f"   ✓ {class_distribution_path}"
    )

    print(
        f"   ✓ {summary_path}"
    )

    if corrupted_images:

        print(
            "\n⚠️ WARNING:"
            f" {len(corrupted_images)} "
            "corrupted/unreadable images found."
        )

    else:

        print(
            "\n✅ No corrupted images detected."
        )

    print("\n" + "=" * 70)


# ============================================================
# 13. SCRIPT ENTRY POINT
# ============================================================

if __name__ == "__main__":
    main()