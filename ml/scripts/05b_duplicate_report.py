# ============================================================
# PLANTGUARD AI
# 05b_duplicate_report.py
#
# Purpose:
# Identify and report exact duplicate images using SHA256.
#
# IMPORTANT:
# This script DOES NOT delete or modify any image.
# ============================================================

from pathlib import Path
import json

import pandas as pd


# ============================================================
# 1. PATH CONFIGURATION
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

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

REPORT_DIR = (
    PROJECT_ROOT
    / "ml"
    / "reports"
    / "duplicates"
)

REPORT_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ============================================================
# 2. MAIN FUNCTION
# ============================================================

def main():

    print("=" * 70)
    print("🌱 PLANTGUARD AI — EXACT DUPLICATE REPORT")
    print("=" * 70)


    # ========================================================
    # CHECK METADATA FILE
    # ========================================================

    if not IMAGE_METADATA_FILE.exists():

        print("\n❌ image_metadata.csv not found.")

        print(
            f"Expected location:\n"
            f"{IMAGE_METADATA_FILE}"
        )

        return


    # ========================================================
    # LOAD METADATA
    # ========================================================

    df = pd.read_csv(
        IMAGE_METADATA_FILE
    )

    print(
        f"\n📊 Metadata records: "
        f"{len(df):,}"
    )


    # ========================================================
    # FIND DUPLICATE SHA256
    # ========================================================

    duplicate_mask = (
        df["SHA256"]
        .duplicated(keep=False)
    )

    duplicate_df = (
        df[duplicate_mask]
        .copy()
    )


    if duplicate_df.empty:

        print(
            "\n✅ No exact duplicate images found."
        )

        return


    # ========================================================
    # GROUP DUPLICATES
    # ========================================================

    duplicate_groups = (
        duplicate_df
        .groupby("SHA256")
    )


    print(
        f"\n⚠️ Duplicate hash groups: "
        f"{duplicate_df['SHA256'].nunique()}"
    )

    print(
        f"⚠️ Duplicate image records: "
        f"{len(duplicate_df)}"
    )


    # ========================================================
    # CREATE REPORT RECORDS
    # ========================================================

    report_records = []

    group_number = 1


    for sha256, group in duplicate_groups:

        classes = sorted(
            group["Class"]
            .dropna()
            .unique()
            .tolist()
        )

        paths = (
            group["Relative_Path"]
            .tolist()
        )

        filenames = (
            group["File_Name"]
            .tolist()
        )


        # ----------------------------------------------------
        # Determine duplicate type
        # ----------------------------------------------------

        if len(classes) == 1:

            duplicate_type = (
                "SAME_CLASS_DUPLICATE"
            )

        else:

            duplicate_type = (
                "CROSS_CLASS_DUPLICATE"
            )


        # ----------------------------------------------------
        # Add report record
        # ----------------------------------------------------

        report_records.append(
            {
                "Duplicate_Group": group_number,
                "SHA256": sha256,
                "Duplicate_Type": duplicate_type,
                "Class_Count": len(classes),
                "Classes": " | ".join(classes),
                "Image_Count": len(group),
                "Files": " | ".join(filenames),
                "Paths": " | ".join(paths)
            }
        )


        group_number += 1


    # ========================================================
    # CREATE DATAFRAME
    # ========================================================

    report_df = pd.DataFrame(
        report_records
    )


    # ========================================================
    # SAVE CSV REPORT
    # ========================================================

    csv_path = (
        REPORT_DIR
        / "exact_duplicate_report.csv"
    )

    report_df.to_csv(
        csv_path,
        index=False
    )


    # ========================================================
    # CREATE JSON REPORT
    # ========================================================

    json_records = []


    for _, row in report_df.iterrows():

        json_records.append(
            {
                "duplicate_group": int(
                    row["Duplicate_Group"]
                ),

                "sha256": row["SHA256"],

                "duplicate_type": (
                    row["Duplicate_Type"]
                ),

                "classes": (
                    row["Classes"]
                    .split(" | ")
                ),

                "image_count": int(
                    row["Image_Count"]
                ),

                "files": (
                    row["Files"]
                    .split(" | ")
                ),

                "paths": (
                    row["Paths"]
                    .split(" | ")
                )
            }
        )


    json_path = (
        REPORT_DIR
        / "exact_duplicate_report.json"
    )


    with open(
        json_path,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            json_records,
            file,
            indent=4,
            ensure_ascii=False
        )


    # ========================================================
    # PRINT DETAILED REPORT
    # ========================================================

    print("\n")
    print("=" * 70)
    print("🔎 DUPLICATE GROUP DETAILS")
    print("=" * 70)


    for _, row in report_df.iterrows():

        print(
            f"\n🔹 Duplicate Group "
            f"{row['Duplicate_Group']}"
        )

        print(
            f"   Type      : "
            f"{row['Duplicate_Type']}"
        )

        print(
            f"   SHA256    : "
            f"{row['SHA256']}"
        )

        print(
            f"   Classes   : "
            f"{row['Classes']}"
        )

        print(
            f"   Images    : "
            f"{row['Image_Count']}"
        )

        print("   Files:")

        for filename in (
            row["Files"].split(" | ")
        ):

            print(
                f"      - {filename}"
            )

        print("   Paths:")

        for path in (
            row["Paths"].split(" | ")
        ):

            print(
                f"      - {path}"
            )


    # ========================================================
    # SUMMARY
    # ========================================================

    same_class_count = int(
        (
            report_df["Duplicate_Type"]
            == "SAME_CLASS_DUPLICATE"
        ).sum()
    )

    cross_class_count = int(
        (
            report_df["Duplicate_Type"]
            == "CROSS_CLASS_DUPLICATE"
        ).sum()
    )


    print("\n")
    print("=" * 70)
    print("📊 DUPLICATE ANALYSIS SUMMARY")
    print("=" * 70)

    print(
        f"\nTotal duplicate groups : "
        f"{len(report_df)}"
    )

    print(
        f"Same-class groups      : "
        f"{same_class_count}"
    )

    print(
        f"Cross-class groups     : "
        f"{cross_class_count}"
    )

    print(
        f"Duplicate image records: "
        f"{len(duplicate_df)}"
    )


    print("\n📁 Reports generated:")

    print(
        f"   ✓ {csv_path}"
    )

    print(
        f"   ✓ {json_path}"
    )


    print("\n" + "=" * 70)


# ============================================================
# SCRIPT ENTRY POINT
# ============================================================

if __name__ == "__main__":
    main()