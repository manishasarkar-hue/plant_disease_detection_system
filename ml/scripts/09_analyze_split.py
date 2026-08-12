# ============================================================
# PLANTGUARD AI
# 09_analyze_split.py
#
# Purpose:
# Analyze Train / Validation / Test dataset distribution.
#
# Checks:
#   1. Split directories
#   2. Expected classes
#   3. Class distribution
#   4. Split percentages
#   5. Class imbalance
#   6. Missing classes
#
# Outputs:
#   ml/reports/split/
#       split_analysis.csv
#       split_analysis.json
#       class_distribution.png
#       split_distribution.png
#
# IMPORTANT:
# This script DOES NOT modify the dataset.
# ============================================================

from pathlib import Path
import json

import pandas as pd
# pyrefly: ignore [missing-import]
import matplotlib.pyplot as plt


# ============================================================
# 1. PATH CONFIGURATION
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

SPLIT_DATASET_DIR = (
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
    / "split"
)

REPORT_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ============================================================
# 2. CONFIGURATION
# ============================================================

SPLITS = [
    "train",
    "val",
    "test"
]

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

IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".bmp",
    ".webp"
}


# ============================================================
# 3. COUNT IMAGES
# ============================================================

def count_images(class_directory):

    count = 0

    for file in class_directory.rglob("*"):

        if (
            file.is_file()
            and file.suffix.lower()
            in IMAGE_EXTENSIONS
        ):
            count += 1

    return count


# ============================================================
# 4. ANALYZE SPLIT
# ============================================================

def analyze_split(split_name):

    split_directory = (
        SPLIT_DATASET_DIR
        / split_name
    )

    if not split_directory.exists():

        raise FileNotFoundError(
            f"Split directory not found: "
            f"{split_directory}"
        )

    results = {}

    for class_name in EXPECTED_CLASSES:

        class_directory = (
            split_directory
            / class_name
        )

        if class_directory.exists():

            count = count_images(
                class_directory
            )

        else:

            count = 0

        results[class_name] = count

    return results


# ============================================================
# 5. MAIN FUNCTION
# ============================================================

def main():

    print("=" * 70)
    print("🌱 PLANTGUARD AI — SPLIT DATASET ANALYSIS")
    print("=" * 70)


    # ========================================================
    # CHECK DATASET
    # ========================================================

    print("\n📂 Dataset:")

    print(
        SPLIT_DATASET_DIR
    )

    if not SPLIT_DATASET_DIR.exists():

        print(
            "\n❌ ERROR:"
        )

        print(
            "plantvillage_split does not exist."
        )

        print(
            "\nRun first:"
        )

        print(
            "python ml/scripts/08_create_dataset_split.py"
        )

        return


    # ========================================================
    # ANALYZE ALL SPLITS
    # ========================================================

    all_results = {}

    for split_name in SPLITS:

        print(
            f"\n🔎 Analyzing "
            f"{split_name.upper()}..."
        )

        try:

            all_results[split_name] = (
                analyze_split(split_name)
            )

        except FileNotFoundError as error:

            print(
                f"❌ {error}"
            )

            return


    # ========================================================
    # CREATE DATAFRAME
    # ========================================================

    distribution_df = pd.DataFrame(
        all_results
    )

    distribution_df.index.name = "Class"

    distribution_df["Total"] = (
        distribution_df[
            SPLITS
        ].sum(axis=1)
    )


    # ========================================================
    # TOTALS
    # ========================================================

    train_total = int(
        distribution_df["train"].sum()
    )

    val_total = int(
        distribution_df["val"].sum()
    )

    test_total = int(
        distribution_df["test"].sum()
    )

    total_images = (
        train_total
        + val_total
        + test_total
    )


    # ========================================================
    # PRINT CLASS DISTRIBUTION
    # ========================================================

    print("\n")
    print("=" * 70)
    print("📊 CLASS DISTRIBUTION")
    print("=" * 70)

    for class_name, row in (
        distribution_df.iterrows()
    ):

        print(
            f"\n{class_name}"
        )

        print(
            f"  Train : "
            f"{int(row['train']):,}"
        )

        print(
            f"  Val   : "
            f"{int(row['val']):,}"
        )

        print(
            f"  Test  : "
            f"{int(row['test']):,}"
        )

        print(
            f"  Total : "
            f"{int(row['Total']):,}"
        )


    # ========================================================
    # SPLIT PERCENTAGES
    # ========================================================

    train_percentage = (
        train_total
        / total_images
        * 100
    )

    val_percentage = (
        val_total
        / total_images
        * 100
    )

    test_percentage = (
        test_total
        / total_images
        * 100
    )


    print("\n")
    print("=" * 70)
    print("📈 OVERALL SPLIT")
    print("=" * 70)

    print(
        f"\nTotal images      : "
        f"{total_images:,}"
    )

    print(
        f"Train             : "
        f"{train_total:,} "
        f"({train_percentage:.2f}%)"
    )

    print(
        f"Validation        : "
        f"{val_total:,} "
        f"({val_percentage:.2f}%)"
    )

    print(
        f"Test              : "
        f"{test_total:,} "
        f"({test_percentage:.2f}%)"
    )


    # ========================================================
    # CHECK MISSING CLASSES
    # ========================================================

    print("\n")
    print("=" * 70)
    print("🔎 MISSING CLASS CHECK")
    print("=" * 70)

    missing_classes = {}

    for split_name in SPLITS:

        missing = (
            distribution_df[
                distribution_df[
                    split_name
                ] == 0
            ]
            .index
            .tolist()
        )

        missing_classes[
            split_name
        ] = missing

        if not missing:

            print(
                f"✅ {split_name.upper()} "
                f"contains all 15 classes"
            )

        else:

            print(
                f"❌ {split_name.upper()} "
                f"is missing:"
            )

            for class_name in missing:

                print(
                    f"   - {class_name}"
                )


    # ========================================================
    # CLASS IMBALANCE ANALYSIS
    # ========================================================

    print("\n")
    print("=" * 70)
    print("⚖️ CLASS BALANCE ANALYSIS")
    print("=" * 70)


    min_count = int(
        distribution_df[
            "Total"
        ].min()
    )

    max_count = int(
        distribution_df[
            "Total"
        ].max()
    )


    min_class = (
        distribution_df[
            "Total"
        ]
        .idxmin()
    )

    max_class = (
        distribution_df[
            "Total"
        ]
        .idxmax()
    )


    imbalance_ratio = (
        max_count
        / min_count
    )


    print(
        f"\nSmallest class : "
        f"{min_class}"
    )

    print(
        f"Images         : "
        f"{min_count:,}"
    )

    print(
        f"\nLargest class  : "
        f"{max_class}"
    )

    print(
        f"Images         : "
        f"{max_count:,}"
    )

    print(
        f"\nImbalance ratio: "
        f"{imbalance_ratio:.2f}x"
    )


    # ========================================================
    # SAVE CSV REPORT
    # ========================================================

    csv_path = (
        REPORT_DIR
        / "split_analysis.csv"
    )

    distribution_df.to_csv(
        csv_path
    )


    # ========================================================
    # SAVE JSON REPORT
    # ========================================================

    json_data = {

        "total_images": total_images,

        "train": {
            "images": train_total,
            "percentage": round(
                train_percentage,
                2
            )
        },

        "validation": {
            "images": val_total,
            "percentage": round(
                val_percentage,
                2
            )
        },

        "test": {
            "images": test_total,
            "percentage": round(
                test_percentage,
                2
            )
        },

        "classes": len(
            EXPECTED_CLASSES
        ),

        "smallest_class": {
            "name": min_class,
            "images": min_count
        },

        "largest_class": {
            "name": max_class,
            "images": max_count
        },

        "imbalance_ratio": round(
            imbalance_ratio,
            4
        ),

        "missing_classes": missing_classes
    }


    json_path = (
        REPORT_DIR
        / "split_analysis.json"
    )


    with open(
        json_path,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            json_data,
            file,
            indent=4
        )


    # ========================================================
    # GRAPH 1 — CLASS DISTRIBUTION
    # ========================================================

    print(
        "\n📊 Creating class distribution graph..."
    )

    distribution_df[
        SPLITS
    ].plot(
        kind="bar",
        figsize=(16, 8)
    )

    plt.title(
        "PlantGuard AI — Class Distribution"
    )

    plt.xlabel(
        "Plant Disease Class"
    )

    plt.ylabel(
        "Number of Images"
    )

    plt.xticks(
        rotation=75,
        ha="right"
    )

    plt.tight_layout()


    class_graph_path = (
        REPORT_DIR
        / "class_distribution.png"
    )

    plt.savefig(
        class_graph_path,
        dpi=200
    )

    plt.close()


    # ========================================================
    # GRAPH 2 — OVERALL SPLIT
    # ========================================================

    print(
        "📊 Creating split distribution graph..."
    )

    split_values = [
        train_total,
        val_total,
        test_total
    ]

    split_labels = [
        "Train",
        "Validation",
        "Test"
    ]


    plt.figure(
        figsize=(8, 6)
    )

    plt.bar(
        split_labels,
        split_values
    )

    plt.title(
        "PlantGuard AI — Dataset Split"
    )

    plt.xlabel(
        "Dataset Split"
    )

    plt.ylabel(
        "Number of Images"
    )

    plt.tight_layout()


    split_graph_path = (
        REPORT_DIR
        / "split_distribution.png"
    )

    plt.savefig(
        split_graph_path,
        dpi=200
    )

    plt.close()


    # ========================================================
    # FINAL STATUS
    # ========================================================

    all_classes_present = all(
        len(classes) == 0
        for classes
        in missing_classes.values()
    )


    print("\n")
    print("=" * 70)


    if all_classes_present:

        print(
            "🎉 SPLIT ANALYSIS COMPLETED"
        )

        print(
            "\n✅ All 15 classes are present "
            "in train, validation and test."
        )

    else:

        print(
            "⚠️ SPLIT ANALYSIS FOUND ISSUES"
        )

        print(
            "\nSome classes are missing "
            "from one or more splits."
        )


    print(
        "\n📁 Reports:"
    )

    print(
        f"   {csv_path}"
    )

    print(
        f"   {json_path}"
    )

    print(
        f"   {class_graph_path}"
    )

    print(
        f"   {split_graph_path}"
    )

    print("=" * 70)


# ============================================================
# SCRIPT ENTRY POINT
# ============================================================

if __name__ == "__main__":
    main()