"""
PlantGuard AI - Image Preprocessing Module
Responsible for validating and preparing images for EfficientNetB0 inference.
Input: 224 x 224 RGB image, raw pixel range [0, 255] as expected by the model backbone.
"""

import io
from typing import Tuple
import numpy as np
from PIL import Image

TARGET_IMAGE_SIZE: Tuple[int, int] = (224, 224)
ALLOWED_FORMATS = {"JPEG", "JPG", "PNG", "WEBP", "BMP"}
MAX_IMAGE_SIZE_BYTES = 25 * 1024 * 1024  # 25 MB


def validate_image_bytes(image_bytes: bytes) -> Image.Image:
    """
    Validate that bytes represent a readable, valid image within allowed formats and sizes.
    Raises ValueError with client-safe message if invalid.
    """
    if not image_bytes or len(image_bytes) == 0:
        raise ValueError("Image file is empty. Please upload a valid image.")

    if len(image_bytes) > MAX_IMAGE_SIZE_BYTES:
        raise ValueError("Image file is too large (maximum allowed size is 25MB).")

    try:
        image = Image.open(io.BytesIO(image_bytes))
        image.verify()  # Verify integrity
    except Exception as e:
        raise ValueError("The uploaded file is not a valid or readable image.") from e

    # Re-open after verify() since verify() can close or alter image state
    try:
        image = Image.open(io.BytesIO(image_bytes))
        image_format = (image.format or "").upper()
        if image_format and image_format not in ALLOWED_FORMATS:
            raise ValueError(
                f"Unsupported image format: {image_format}. Supported formats are JPG, PNG, WEBP, and BMP."
            )
        return image
    except ValueError:
        raise
    except Exception as e:
        raise ValueError("Failed to decode uploaded image.") from e


def preprocess_image(image: Image.Image) -> np.ndarray:
    """
    Preprocess PIL Image into the exact numerical format expected by the PlantGuard model:
    1. Convert to RGB (handles RGBA, grayscale, CMYK)
    2. Resize to 224x224 using high-quality Lanczos resampling
    3. Convert to float32 numpy array with values in [0, 255]
    4. Expand batch dimension -> (1, 224, 224, 3)

    NOTE: Do NOT divide by 255 or apply external ImageNet normalization here!
    The PlantGuard EfficientNetB0 model has its own internal Rescaling and Normalization layers.
    """
    # 1. Convert to RGB
    if image.mode != "RGB":
        image = image.convert("RGB")

    # 2. Resize to 224x224
    if image.size != TARGET_IMAGE_SIZE:
        image = image.resize(TARGET_IMAGE_SIZE, resample=Image.Resampling.LANCZOS)

    # 3. Convert to float32 array
    img_array = np.array(image, dtype=np.float32)

    # 4. Add batch dimension -> (1, 224, 224, 3)
    batch_tensor = np.expand_dims(img_array, axis=0)

    return batch_tensor
