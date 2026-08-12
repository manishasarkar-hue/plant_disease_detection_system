# ============================================================
# PLANTGUARD AI
# 08_create_dataset_split.py
#
# Purpose:
# Create stratified Train / Validation / Test datasets
# from the cleaned PlantVillage dataset.
#
# Split:
#   Train      = 70%
#   Validation = 15%
#   Test       = 15%
#
# IMPORTANT:
# - Clean dataset is NEVER modified.
# - Images are COPIED, not moved.
# - Same image cannot appear in multiple splits.
# - Random seed guarantees reproducibility.
# ============================================================

from pathlib import Path
import shutil
import random
import hashlib
import json

import pandas as pd


# ============================================================
# 1. PATH CONFIGURATION
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

SOURCE_DATASET = (
    PROJECT_ROOT
    / "ml"
    / "datasets"
    / "processed"
    / "plantvillage_clean"
)

OUTPUT_DATASET = (
    PROJECT_ROOT
    / "ml"
    / "datasets"
    / "processed"
    / "plantvillage_split"
)

METADATA_DIR = (
    PROJECT_ROOT
    / "ml"
    / "datasets"
    / "metadata"
)

REPORT_DIR = (
    PROJECT_ROOT
    / "ml"
    / "reports"
    / "split"
)


# ============================================================
# 2. SPLIT CONFIGURATION
# ============================================================

TRAIN_RATIO = 0.70
VAL_RATIO = 0.15
TEST_RATIO = 0.15

RANDOM_SEED = 42

IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".bmp",
    ".webp"
}


# ============================================================
# 3. SHA256 FUNCTION
# ============================================================

def calculate_sha256(file_path):

    sha256 = hashlib.sha256()

    with open(file_path, "rb") as file:

        while True:

            chunk = file.read(1024 * 1024)

            if not chunk:
                break

            sha256.update(chunk)

    return sha256.hexdigest()


# ============================================================
# 4. VALIDATE SPLIT RATIOS
# ============================================================

def validate_split_ratios():

    total = (
        TRAIN_RATIO
        + VAL_RATIO
        + TEST_RATIO
    )

    if abs(total - 1.0) > 0.0001:

        raise ValueError(
            "Train, validation and test ratios "
            "must add up to 1.0"
        )


# ============================================================
# 5. COLLECT CLASS IMAGES
# ============================================================

def collect_images():

    class_images = {}

    class_directories = sorted(
        [
            directory
            for directory in SOURCE_DATASET.iterdir()
            if directory.is_dir()
        ]
    )

    for class_dir in class_directories:

        class_name = class_dir.name

        images = []

        for file in class_dir.rglob("*"):

            if (
                file.is_file()
                and file.suffix.lower()
                in IMAGE_EXTENSIONS
            ):

                images.append(file)

        class_images[class_name] = sorted(
            images
        )

    return class_images


# ============================================================
# 6. CREATE SPLIT
# ============================================================

def create_split(images):

    # Create a local random generator so the
    # global random state is not modified.

    rng = random.Random(
        RANDOM_SEED
    )

    shuffled_images = images.copy()

    rng.shuffle(
        shuffled_images
    )

    total = len(
        shuffled_images
    )

    train_count = int(
        total * TRAIN_RATIO
    )

    val_count = int(
        total * VAL_RATIO
    )

    train_images = (
        shuffled_images[
            :train_count
        ]
    )

    val_images = (
        shuffled_images[
            train_count:
            train_count + val_count
        ]
    )

    test_images = (
        shuffled_images[
            train_count + val_count:
        ]
    )

    return (
        train_images,
        val_images,
        test_images
    )


# ============================================================
# 7. COPY IMAGE
# ============================================================

def copy_image(
    source_path,
    destination_path
):

    destination_path.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    shutil.copy2(
        source_path,
        destination_path
    )


# ============================================================
# 8. MAIN FUNCTION
# ============================================================

def main():

    print("=" * 70)
    print(
        "🌱 PLANTGUARD AI — DATASET SPLITTING"
    )
    print("=" * 70)


    # ========================================================
    # VALIDATE RATIOS
    # ========================================================

    validate_split_ratios()


    # ========================================================
    # CHECK SOURCE DATASET
    # ========================================================

    print(
        "\n📂 Source dataset:"
    )

    print(
        SOURCE_DATASET
    )

    if not SOURCE_DATASET.exists():

        print(
            "\n❌ Source clean dataset not found."
        )

        print(
            "Run 06_build_clean_dataset.py first."
        )

        return


    # ========================================================
    # PREVENT ACCIDENTAL OVERWRITE
    # ========================================================

    if OUTPUT_DATASET.exists():

        existing_files = list(
            OUTPUT_DATASET.rglob("*")
        )

        if existing_files:

            print(
                "\n⚠️ Existing split dataset detected:"
            )

            print(
                OUTPUT_DATASET
            )

            print(
                "\nDelete the old split manually "
                "if you want to recreate it."
            )

            print(
                "The script will NOT overwrite it."
            )

            return


    # ========================================================
    # CREATE OUTPUT DIRECTORIES
    # ========================================================

    for split_name in [
        "train",
        "val",
        "test"
    ]:

        (
            OUTPUT_DATASET
            / split_name
        ).mkdir(
            parents=True,
            exist_ok=True
        )


    REPORT_DIR.mkdir(
        parents=True,
        exist_ok=True
    )


    # ========================================================
    # COLLECT IMAGES
    # ========================================================

    print(
        "\n🔍 Scanning clean dataset..."
    )

    class_images = collect_images()


    print(
        f"\n🏷️ Classes found: "
        f"{len(class_images)}"
    )


    # ========================================================
    # SPLIT DATA
    # ========================================================

    split_records = []

    class_summary = []

    total_train = 0
    total_val = 0
    total_test = 0


    print(
        "\n✂️ Creating stratified splits..."
    )


    for class_name in sorted(
        class_images.keys()
    ):

        images = class_images[
            class_name
        ]

        total = len(images)


        if total == 0:

            print(
                f"\n⚠️ {class_name}: "
                f"0 images"
            )

            continue


        (
            train_images,
            val_images,
            test_images
        ) = create_split(
            images
        )


        print(
            f"\n{class_name}"
        )

        print(
            f"  Total : {total}"
        )

        print(
            f"  Train : {len(train_images)}"
        )

        print(
            f"  Val   : {len(val_images)}"
        )

        print(
            f"  Test  : {len(test_images)}"
        )


        split_data = [
            (
                "train",
                train_images
            ),
            (
                "val",
                val_images
            ),
            (
                "test",
                test_images
            )
        ]


        # ====================================================
        # COPY EACH SPLIT
        # ====================================================

        for split_name, split_images in split_data:

            for image_path in split_images:

                destination = (
                    OUTPUT_DATASET
                    / split_name
                    / class_name
                    / image_path.name
                )


                copy_image(
                    image_path,
                    destination
                )


                # --------------------------------------------
                # Metadata
                # --------------------------------------------

                split_records.append(
                    {
                        "Image_ID": image_path.stem,
                        "Class": class_name,
                        "Split": split_name,
                        "File_Name": image_path.name,
                        "Source_Path": str(
                            image_path
                        ),
                        "Split_Path": str(
                            destination
                        ),
                        "SHA256": calculate_sha256(
                            image_path
                        )
                    }
                )


        # ====================================================
        # CLASS SUMMARY
        # ====================================================

        class_summary.append(
            {
                "Class": class_name,
                "Total": total,
                "Train": len(train_images),
                "Validation": len(val_images),
                "Test": len(test_images)
            }
        )


        total_train += len(
            train_images
        )

        total_val += len(
            val_images
        )

        total_test += len(
            test_images
        )


    # ========================================================
    # SAVE SPLIT METADATA
    # ========================================================

    print(
        "\n📄 Saving split metadata..."
    )


    split_metadata_df = pd.DataFrame(
        split_records
    )


    split_metadata_file = (
        METADATA_DIR
        / "split_metadata.csv"
    )


    split_metadata_df.to_csv(
        split_metadata_file,
        index=False
    )


    # ========================================================
    # SAVE CLASS SUMMARY
    # ========================================================

    class_summary_df = pd.DataFrame(
        class_summary
    )


    class_summary_file = (
        REPORT_DIR
        / "split_class_distribution.csv"
    )


    class_summary_df.to_csv(
        class_summary_file,
        index=False
    )


    # ========================================================
    # SAVE SPLIT SUMMARY JSON
    # ========================================================

    total_images = (
        total_train
        + total_val
        + total_test
    )


    summary = {

        "dataset": "PlantGuard AI",

        "source_dataset": str(
            SOURCE_DATASET
        ),

        "output_dataset": str(
            OUTPUT_DATASET
        ),

        "random_seed": RANDOM_SEED,

        "ratios": {
            "train": TRAIN_RATIO,
            "validation": VAL_RATIO,
            "test": TEST_RATIO
        },

        "classes": len(
            class_images
        ),

        "total_images": total_images,

        "train_images": total_train,

        "validation_images": total_val,

        "test_images": total_test
    }


    summary_file = (
        REPORT_DIR
        / "split_summary.json"
    )


    with open(
        summary_file,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            summary,
            file,
            indent=4
        )


    # ========================================================
    # FINAL VERIFICATION — SPLIT LEAKAGE
    # ========================================================

    print(
        "\n🔎 Checking train/val/test leakage..."
    )


    train_hashes = set(
        split_metadata_df.loc[
            split_metadata_df["Split"]
            == "train",
            "SHA256"
        ]
    )

    val_hashes = set(
        split_metadata_df.loc[
            split_metadata_df["Split"]
            == "val",
            "SHA256"
        ]
    )

    test_hashes = set(
        split_metadata_df.loc[
            split_metadata_df["Split"]
            == "test",
            "SHA256"
        ]
    )


    train_val_overlap = (
        train_hashes
        & val_hashes
    )

    train_test_overlap = (
        train_hashes
        & test_hashes
    )

    val_test_overlap = (
        val_hashes
        & test_hashes
    )


    if (
        not train_val_overlap
        and not train_test_overlap
        and not val_test_overlap
    ):

        print(
            "✅ PASS | No image leakage detected"
        )

    else:

        print(
            "❌ FAIL | Data leakage detected"
        )

        print(
            f"Train ↔ Val  : "
            f"{len(train_val_overlap)}"
        )

        print(
            f"Train ↔ Test : "
            f"{len(train_test_overlap)}"
        )

        print(
            f"Val ↔ Test   : "
            f"{len(val_test_overlap)}"
        )


    # ========================================================
    # FINAL SUMMARY
    # ========================================================

    print("\n")
    print("=" * 70)

    print(
        "🎉 DATASET SPLIT COMPLETED"
    )

    print(
        f"\nTotal images      : "
        f"{total_images:,}"
    )

    print(
        f"Train images      : "
        f"{total_train:,}"
    )

    print(
        f"Validation images : "
        f"{total_val:,}"
    )

    print(
        f"Test images       : "
        f"{total_test:,}"
    )

    print(
        f"\nTrain ratio       : "
        f"{total_train / total_images:.2%}"
    )

    print(
        f"Validation ratio  : "
        f"{total_val / total_images:.2%}"
    )

    print(
        f"Test ratio        : "
        f"{total_test / total_images:.2%}"
    )


    print(
        "\n📁 Dataset:"
    )

    print(
        OUTPUT_DATASET
    )


    print(
        "\n📄 Metadata:"
    )

    print(
        split_metadata_file
    )


    print(
        "\n📊 Reports:"
    )

    print(
        class_summary_file
    )

    print(
        summary_file
    )

    print(
        "\n⚠️ Original clean dataset remains untouched."
    )

    print("=" * 70)


# ============================================================
# SCRIPT ENTRY POINT
# ============================================================

if __name__ == "__main__":
    main()