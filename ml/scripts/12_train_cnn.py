# ============================================================
# 🌱 PLANTGUARD AI - CNN TRAINING
# ============================================================

from pathlib import Path
import json
import tensorflow as tf

from tensorflow.keras import layers, models
from tensorflow.keras.callbacks import (
    EarlyStopping,
    ModelCheckpoint,
    ReduceLROnPlateau
)
from tensorflow.keras.optimizers import Adam


# ============================================================
# 1. PROJECT PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

DATASET_DIR = (
    PROJECT_ROOT
    / "ml"
    / "datasets"
    / "processed"
    / "plantvillage_split"
)

TRAIN_DIR = DATASET_DIR / "train"
VAL_DIR = DATASET_DIR / "val"
TEST_DIR = DATASET_DIR / "test"

MODEL_DIR = (
    PROJECT_ROOT
    / "ml"
    / "models"
)

REPORT_DIR = (
    PROJECT_ROOT
    / "ml"
    / "reports"
    / "training"
)

MODEL_DIR.mkdir(
    parents=True,
    exist_ok=True
)

REPORT_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ============================================================
# 2. TRAINING CONFIGURATION
# ============================================================

IMAGE_HEIGHT = 224
IMAGE_WIDTH = 224

IMAGE_SIZE = (
    IMAGE_HEIGHT,
    IMAGE_WIDTH
)

CHANNELS = 3

BATCH_SIZE = 32

EPOCHS = 30

LEARNING_RATE = 0.001

SEED = 42


# ============================================================
# 3. REPRODUCIBILITY
# ============================================================

tf.keras.utils.set_random_seed(SEED)


# ============================================================
# 4. VERIFY DATASET PATHS
# ============================================================

print("\n" + "=" * 70)
print("🌱 PLANTGUARD AI - CNN TRAINING")
print("=" * 70)

print("\n📂 Checking dataset directories...\n")

for name, path in [
    ("Train", TRAIN_DIR),
    ("Validation", VAL_DIR),
    ("Test", TEST_DIR)
]:

    if not path.exists():

        raise FileNotFoundError(
            f"❌ {name} dataset not found:\n{path}"
        )

    print(
        f"✅ {name}: {path}"
    )


# ============================================================
# 5. LOAD TRAIN DATASET
# ============================================================

print("\n📥 Loading training dataset...")

train_dataset = (
    tf.keras.utils.image_dataset_from_directory(
        TRAIN_DIR,
        labels="inferred",
        label_mode="int",
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        shuffle=True,
        seed=SEED
    )
)


# ============================================================
# 6. LOAD VALIDATION DATASET
# ============================================================

print("\n📥 Loading validation dataset...")

val_dataset = (
    tf.keras.utils.image_dataset_from_directory(
        VAL_DIR,
        labels="inferred",
        label_mode="int",
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        shuffle=False
    )
)


# ============================================================
# 7. LOAD TEST DATASET
# ============================================================

print("\n📥 Loading test dataset...")

test_dataset = (
    tf.keras.utils.image_dataset_from_directory(
        TEST_DIR,
        labels="inferred",
        label_mode="int",
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        shuffle=False
    )
)


# ============================================================
# 8. CLASS INFORMATION
# ============================================================

CLASS_NAMES = train_dataset.class_names

NUM_CLASSES = len(
    CLASS_NAMES
)

print("\n" + "=" * 70)
print("📊 DATASET INFORMATION")
print("=" * 70)

print(
    f"\nNumber of classes: {NUM_CLASSES}"
)

print("\nClasses:\n")

for index, class_name in enumerate(
    CLASS_NAMES
):

    print(
        f"{index}: {class_name}"
    )


# ============================================================
# 9. VERIFY CLASS CONSISTENCY
# ============================================================

if val_dataset.class_names != CLASS_NAMES:

    raise ValueError(
        "❌ Validation class names do not match training classes."
    )


if test_dataset.class_names != CLASS_NAMES:

    raise ValueError(
        "❌ Test class names do not match training classes."
    )


print(
    "\n✅ Train, validation and test classes match."
)


# ============================================================
# 10. DATA NORMALIZATION
# ============================================================

normalization_layer = layers.Rescaling(
    1.0 / 255.0
)


# ============================================================
# 11. DATA PIPELINE OPTIMIZATION
# ============================================================

AUTOTUNE = tf.data.AUTOTUNE


train_dataset = (
    train_dataset
    .cache()
    .shuffle(
        buffer_size=1000,
        seed=SEED
    )
    .prefetch(
        buffer_size=AUTOTUNE
    )
)


val_dataset = (
    val_dataset
    .cache()
    .prefetch(
        buffer_size=AUTOTUNE
    )
)


test_dataset = (
    test_dataset
    .cache()
    .prefetch(
        buffer_size=AUTOTUNE
    )
)


# ============================================================
# 12. BUILD CNN MODEL
# ============================================================

print("\n" + "=" * 70)
print("🧠 BUILDING CNN MODEL")
print("=" * 70)


model = models.Sequential(
    [
        # ----------------------------------------------------
        # Input + Normalization
        # ----------------------------------------------------

        layers.Input(
            shape=(
                IMAGE_HEIGHT,
                IMAGE_WIDTH,
                CHANNELS
            )
        ),

        normalization_layer,


        # ----------------------------------------------------
        # CNN BLOCK 1
        # ----------------------------------------------------

        layers.Conv2D(
            filters=32,
            kernel_size=(3, 3),
            padding="same",
            activation="relu",
            name="conv_block_1"
        ),

        layers.BatchNormalization(
            name="batch_norm_1"
        ),

        layers.MaxPooling2D(
            pool_size=(2, 2),
            name="max_pool_1"
        ),


        # ----------------------------------------------------
        # CNN BLOCK 2
        # ----------------------------------------------------

        layers.Conv2D(
            filters=64,
            kernel_size=(3, 3),
            padding="same",
            activation="relu",
            name="conv_block_2"
        ),

        layers.BatchNormalization(
            name="batch_norm_2"
        ),

        layers.MaxPooling2D(
            pool_size=(2, 2),
            name="max_pool_2"
        ),


        # ----------------------------------------------------
        # CNN BLOCK 3
        # ----------------------------------------------------

        layers.Conv2D(
            filters=128,
            kernel_size=(3, 3),
            padding="same",
            activation="relu",
            name="conv_block_3"
        ),

        layers.BatchNormalization(
            name="batch_norm_3"
        ),

        layers.MaxPooling2D(
            pool_size=(2, 2),
            name="max_pool_3"
        ),


        # ----------------------------------------------------
        # CNN BLOCK 4
        # ----------------------------------------------------

        layers.Conv2D(
            filters=256,
            kernel_size=(3, 3),
            padding="same",
            activation="relu",
            name="conv_block_4"
        ),

        layers.BatchNormalization(
            name="batch_norm_4"
        ),

        layers.MaxPooling2D(
            pool_size=(2, 2),
            name="max_pool_4"
        ),


        # ----------------------------------------------------
        # FEATURE EXTRACTION
        # ----------------------------------------------------

        layers.GlobalAveragePooling2D(
            name="global_average_pooling"
        ),


        # ----------------------------------------------------
        # CLASSIFIER
        # ----------------------------------------------------

        layers.Dense(
            256,
            activation="relu",
            name="dense_1"
        ),

        layers.Dropout(
            0.4,
            name="dropout"
        ),


        # ----------------------------------------------------
        # OUTPUT
        # ----------------------------------------------------

        layers.Dense(
            NUM_CLASSES,
            activation="softmax",
            name="predictions"
        )
    ],

    name="PlantGuard_CNN"
)


# ============================================================
# 13. COMPILE MODEL
# ============================================================

model.compile(

    optimizer=Adam(
        learning_rate=LEARNING_RATE
    ),

    loss="sparse_categorical_crossentropy",

    metrics=[
        "accuracy"
    ]
)


print(
    "\n✅ Model compiled successfully."
)


# ============================================================
# 14. MODEL SUMMARY
# ============================================================

print("\n" + "=" * 70)
print("🧠 MODEL SUMMARY")
print("=" * 70)

model.summary()


# ============================================================
# 15. CALLBACKS
# ============================================================

BEST_MODEL_PATH = (
    MODEL_DIR
    / "plantguard_cnn_best.keras"
)


callbacks = [

    # Save best validation model
    ModelCheckpoint(
        filepath=BEST_MODEL_PATH,
        monitor="val_accuracy",
        mode="max",
        save_best_only=True,
        verbose=1
    ),


    # Stop if validation loss stops improving
    EarlyStopping(
        monitor="val_loss",
        patience=7,
        restore_best_weights=True,
        verbose=1
    ),


    # Reduce learning rate if validation loss stops improving
    ReduceLROnPlateau(
        monitor="val_loss",
        factor=0.5,
        patience=3,
        min_lr=1e-6,
        verbose=1
    )
]


# ============================================================
# 16. START TRAINING
# ============================================================

print("\n" + "=" * 70)
print("🚀 STARTING CNN TRAINING")
print("=" * 70)

print(
    f"\nEpochs: {EPOCHS}"
)

print(
    f"Batch Size: {BATCH_SIZE}"
)

print(
    f"Learning Rate: {LEARNING_RATE}"
)

print("\n")


history = model.fit(

    train_dataset,

    validation_data=val_dataset,

    epochs=EPOCHS,

    callbacks=callbacks,

    verbose=1
)


# ============================================================
# 17. SAVE FINAL MODEL
# ============================================================

FINAL_MODEL_PATH = (
    MODEL_DIR
    / "plantguard_cnn_final.keras"
)


model.save(
    FINAL_MODEL_PATH
)


print("\n" + "=" * 70)
print("💾 MODEL SAVED")
print("=" * 70)

print(
    f"\nBest Model:\n{BEST_MODEL_PATH}"
)

print(
    f"\nFinal Model:\n{FINAL_MODEL_PATH}"
)


# ============================================================
# 18. SAVE TRAINING HISTORY
# ============================================================

HISTORY_PATH = (
    REPORT_DIR
    / "training_history.json"
)


history_data = {
    key: [
        float(value)
        for value in values
    ]
    for key, values
    in history.history.items()
}


with open(
    HISTORY_PATH,
    "w",
    encoding="utf-8"
) as file:

    json.dump(
        history_data,
        file,
        indent=4
    )


print("\n" + "=" * 70)
print("📊 TRAINING HISTORY SAVED")
print("=" * 70)

print(
    f"\nHistory:\n{HISTORY_PATH}"
)


# ============================================================
# 19. TRAINING COMPLETE
# ============================================================

print("\n" + "=" * 70)
print("🎉 PLANTGUARD CNN TRAINING COMPLETED")
print("=" * 70)