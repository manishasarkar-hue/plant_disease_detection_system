# ============================================================
# PLANTGUARD AI
# 11_data_pipeline.py
#
# Purpose:
# Create TensorFlow data pipeline with:
# - Image resizing
# - Training augmentation
# - Validation/Test preprocessing
# - Batch loading
# - Performance optimization
# ============================================================

from pathlib import Path
import json

import tensorflow as tf


# ============================================================
# 1. PATH CONFIGURATION
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

DATASET_DIR = (
    PROJECT_ROOT
    / "ml"
    / "datasets"
    / "processed"
    / "plantvillage_split"
)

REPORT_DIR = (
    PROJECT_ROOT
    / "ml"
    / "reports"
    / "pipeline"
)

REPORT_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ============================================================
# 2. CONFIGURATION
# ============================================================

IMAGE_SIZE = (
    224,
    224
)

BATCH_SIZE = 32

SEED = 42

AUTOTUNE = tf.data.AUTOTUNE


# ============================================================
# 3. DATA AUGMENTATION
# ============================================================

data_augmentation = tf.keras.Sequential(
    [

        tf.keras.layers.RandomFlip(
            "horizontal"
        ),

        tf.keras.layers.RandomRotation(
            0.15
        ),

        tf.keras.layers.RandomZoom(
            0.15
        ),

        tf.keras.layers.RandomTranslation(
            height_factor=0.1,
            width_factor=0.1
        ),

    ],
    name="plantguard_augmentation"
)


# ============================================================
# 4. LOAD DATASET FUNCTION
# ============================================================

def load_dataset(
    split_name,
    shuffle
):

    split_directory = (
        DATASET_DIR
        / split_name
    )

    print(
        f"\n📂 Loading {split_name.upper()} dataset..."
    )

    dataset = tf.keras.utils.image_dataset_from_directory(

        split_directory,

        labels="inferred",

        label_mode="int",

        image_size=IMAGE_SIZE,

        batch_size=BATCH_SIZE,

        shuffle=shuffle,

        seed=SEED,

    )

    return dataset


# ============================================================
# 5. CREATE DATASETS
# ============================================================

def main():

    print("=" * 70)

    print(
        "🌱 PLANTGUARD AI — DATA PIPELINE"
    )

    print("=" * 70)


    # --------------------------------------------------------
    # Check dataset
    # --------------------------------------------------------

    if not DATASET_DIR.exists():

        print(
            "\n❌ Dataset directory not found:"
        )

        print(
            DATASET_DIR
        )

        return


    # --------------------------------------------------------
    # Train dataset
    # --------------------------------------------------------

    train_dataset = load_dataset(
        "train",
        shuffle=True
    )


    # --------------------------------------------------------
    # Validation dataset
    # --------------------------------------------------------

    val_dataset = load_dataset(
        "val",
        shuffle=False
    )


    # --------------------------------------------------------
    # Test dataset
    # --------------------------------------------------------

    test_dataset = load_dataset(
        "test",
        shuffle=False
    )


    # ========================================================
    # 6. GET CLASS NAMES
    # ========================================================

    class_names = (
        train_dataset.class_names
    )

    num_classes = len(
        class_names
    )


    print("\n")
    print("=" * 70)

    print(
        "🏷️ CLASS INFORMATION"
    )

    print("=" * 70)

    print(
        f"\nNumber of classes: "
        f"{num_classes}"
    )

    for index, class_name in enumerate(
        class_names
    ):

        print(
            f"{index:2d} → {class_name}"
        )


    # ========================================================
    # 7. NORMALIZATION
    # ========================================================

    normalization = (
        tf.keras.layers.Rescaling(
            1.0 / 255
        )
    )


    # ========================================================
    # 8. TRAIN PIPELINE
    # ========================================================

    train_dataset = train_dataset.map(

        lambda images, labels: (
            normalization(
                data_augmentation(images)
            ),
            labels
        ),

        num_parallel_calls=AUTOTUNE

    )


    # ========================================================
    # 9. VALIDATION PIPELINE
    # ========================================================

    val_dataset = val_dataset.map(

        lambda images, labels: (
            normalization(images),
            labels
        ),

        num_parallel_calls=AUTOTUNE

    )


    # ========================================================
    # 10. TEST PIPELINE
    # ========================================================

    test_dataset = test_dataset.map(

        lambda images, labels: (
            normalization(images),
            labels
        ),

        num_parallel_calls=AUTOTUNE

    )


    # ========================================================
    # 11. PERFORMANCE OPTIMIZATION
    # ========================================================

    train_dataset = (
        train_dataset
        .prefetch(AUTOTUNE)
    )

    val_dataset = (
        val_dataset
        .prefetch(AUTOTUNE)
    )

    test_dataset = (
        test_dataset
        .prefetch(AUTOTUNE)
    )


    # ========================================================
    # 12. CHECK ONE BATCH
    # ========================================================

    print("\n")
    print("=" * 70)

    print(
        "🧪 PIPELINE TEST"
    )

    print("=" * 70)


    images, labels = next(
        iter(train_dataset)
    )


    print(
        f"\nImage batch shape : "
        f"{images.shape}"
    )

    print(
        f"Label batch shape : "
        f"{labels.shape}"
    )

    print(
        f"Pixel minimum     : "
        f"{tf.reduce_min(images).numpy():.4f}"
    )

    print(
        f"Pixel maximum     : "
        f"{tf.reduce_max(images).numpy():.4f}"
    )


    # ========================================================
    # 13. SAVE PIPELINE CONFIGURATION
    # ========================================================

    pipeline_config = {

        "image_size": list(
            IMAGE_SIZE
        ),

        "batch_size": BATCH_SIZE,

        "num_classes": num_classes,

        "classes": class_names,

        "normalization": "1/255",

        "augmentation": {

            "horizontal_flip": True,

            "rotation": 0.15,

            "zoom": 0.15,

            "translation": 0.1

        },

        "validation_augmentation": False,

        "test_augmentation": False,

        "seed": SEED

    }


    config_path = (
        REPORT_DIR
        / "pipeline_config.json"
    )


    with open(
        config_path,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            pipeline_config,
            file,
            indent=4
        )


    # ========================================================
    # 14. FINAL OUTPUT
    # ========================================================

    print("\n")
    print("=" * 70)

    print(
        "✅ DATA PIPELINE READY"
    )

    print("=" * 70)

    print(
        "\nTrain:"
    )

    print(
        "  Resize + Augmentation + Normalization"
    )

    print(
        "\nValidation:"
    )

    print(
        "  Resize + Normalization"
    )

    print(
        "\nTest:"
    )

    print(
        "  Resize + Normalization"
    )

    print(
        "\n📄 Configuration saved:"
    )

    print(
        config_path
    )

    print("=" * 70)


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":

    main()