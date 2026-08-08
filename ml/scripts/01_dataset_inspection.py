"""
PlantGuard AI - Dataset Inspection Script
===========================================
This script inspects the plant disease dataset directory, generates class distribution stats,
validates image files for corruption, and reports overall dataset metadata.
"""

import sys
from pathlib import Path
from collections import Counter
# pyrefly: ignore [missing-import]
from PIL import Image  # type: ignore

# Ensure stdout uses UTF-8 encoding on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")


def inspect_dataset(data_dir: Path):
    print("=" * 60)
    print("PLANTGUARD AI - DATASET INSPECTION")
    print("=" * 60)

    if not data_dir.exists():
        print(f"❌ Error: Dataset directory not found at '{data_dir.resolve()}'")
        return

    print(f"📁 Dataset Location: {data_dir.resolve()}")

    class_dirs = [d for d in data_dir.iterdir() if d.is_dir()]
    if not class_dirs:
        print("⚠️ No subdirectories found in the dataset path.")
        return

    print(f"📊 Total Plant / Disease Classes: {len(class_dirs)}")

    total_images = 0
    corrupt_images = 0
    class_distribution = {}
    image_resolutions = Counter()
    image_modes = Counter()

    for class_dir in sorted(class_dirs):
        image_files = list(class_dir.glob("*.JPG")) + list(class_dir.glob("*.jpg")) + list(class_dir.glob("*.png"))
        count = len(image_files)
        class_distribution[class_dir.name] = count
        total_images += count

        # Sample validation per class
        for img_path in image_files[:10]:
            try:
                with Image.open(img_path) as img:
                    image_resolutions[img.size] += 1
                    image_modes[img.mode] += 1
            except Exception as e:
                corrupt_images += 1
                print(f"❌ Corrupt image: {img_path.name} | Error: {e}")

    print("\n📈 Class Breakdown:")
    print("-" * 60)
    for class_name, count in class_distribution.items():
        percentage = (count / total_images) * 100 if total_images > 0 else 0
        print(f" - {class_name:<45}: {count:>5} images ({percentage:>5.1f}%)")

    print("-" * 60)
    print(f"📷 Total Dataset Images   : {total_images}")
    print(f"📐 Sample Image Sizes     : {dict(image_resolutions)}")
    print(f"🎨 Color Modes            : {dict(image_modes)}")
    print(f"🚨 Corrupt Images Detected: {corrupt_images}")
    print("=" * 60)
    print("✅ Dataset Inspection Completed Successfully.")


if __name__ == "__main__":
    # Default path inside ml module
    script_dir = Path(__file__).resolve().parent
    dataset_path = script_dir.parent / "datasets" / "raw" / "plantvillage"

    if len(sys.argv) > 1:
        dataset_path = Path(sys.argv[1])

    inspect_dataset(dataset_path)
