"""
PlantGuard AI - Model Loader Module
Loads the trained .keras model once upon startup and keeps it in memory.
Provides thread-safe access to the singleton model instance.
"""

import os
from pathlib import Path
from typing import Optional
import tensorflow as tf

_model: Optional[tf.keras.Model] = None
_loaded_model_path: Optional[str] = None


def resolve_model_path() -> Path:
    """
    Resolve model path by checking:
    1. MODEL_PATH environment variable
    2. ml-service/models/plantguard_model.keras
    3. ml/models/plantguard_model.keras
    4. models/plantguard_model.keras
    5. User Downloads fallback
    """
    env_path = os.getenv("MODEL_PATH")
    if env_path:
        p = Path(env_path)
        if p.exists():
            return p.resolve()

    # Candidate paths relative to ml-service directory
    current_dir = Path(__file__).resolve().parent
    workspace_root = current_dir.parent

    candidates = [
        current_dir / "models" / "plantguard_model.keras",
        workspace_root / "ml" / "models" / "plantguard_model.keras",
        workspace_root / "models" / "plantguard_model.keras",
        Path("C:/Users/SUMIT ADAK/Downloads/plantguard_efficientnet_best.keras"),
    ]

    for cand in candidates:
        if cand.exists():
            return cand.resolve()

    return (current_dir / "models" / "plantguard_model.keras").resolve()


def load_model_instance(custom_path: Optional[str] = None) -> tf.keras.Model:
    """
    Load the PlantGuard Keras model into memory once.
    """
    global _model, _loaded_model_path

    if _model is not None:
        return _model

    model_path = Path(custom_path).resolve() if custom_path else resolve_model_path()

    if not model_path.exists():
        raise FileNotFoundError(
            f"PlantGuard model file not found at: {model_path}. "
            f"Please set the MODEL_PATH environment variable or place the model at {model_path}."
        )

    print(f"[Model Loader] Loading PlantGuard model from: {model_path.name}...")
    
    # Load model
    _model = tf.keras.models.load_model(str(model_path))
    _loaded_model_path = str(model_path)

    # Warm up inference with a dummy input
    dummy_input = tf.zeros((1, 224, 224, 3), dtype=tf.float32)
    _ = _model(dummy_input, training=False)

    print("[Model Loader] PlantGuard model loaded and ready in memory.")
    return _model


def get_model() -> tf.keras.Model:
    """
    Return the singleton loaded model. If not yet loaded, load it.
    """
    if _model is None:
        return load_model_instance()
    return _model


def is_model_loaded() -> bool:
    """Check if the model is currently loaded in memory."""
    return _model is not None


def get_model_info_summary() -> dict:
    """
    Return high-level metadata about the model without exposing sensitive server filesystem paths.
    """
    return {
        "model": "PlantGuard EfficientNetB0",
        "inputSize": "224x224",
        "numClasses": 15,
        "framework": "TensorFlow/Keras",
        "loaded": is_model_loaded()
    }
