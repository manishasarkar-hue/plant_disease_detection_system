"""
PlantGuard AI - Inference Engine
Runs EfficientNetB0 prediction on preprocessed image batches and computes
top predictions, confidence thresholds, and user-friendly labels.
"""

import os
from typing import Dict, Any, List
import numpy as np
from class_names import CLASS_NAMES, format_class_name
from model_loader import get_model

# Configurable confidence threshold (default 0.60)
DEFAULT_THRESHOLD = 0.60


def get_confidence_threshold() -> float:
    """Read confidence threshold from env var or default to 0.60."""
    raw = os.getenv("MODEL_CONFIDENCE_THRESHOLD", os.getenv("CONFIDENCE_THRESHOLD", str(DEFAULT_THRESHOLD)))
    try:
        val = float(raw)
        return max(0.0, min(1.0, val))
    except ValueError:
        return DEFAULT_THRESHOLD


def predict_disease(batch_tensor: np.ndarray) -> Dict[str, Any]:
    """
    Run model inference on the preprocessed batch tensor.
    batch_tensor: shape (1, 224, 224, 3), float32, range [0, 255]

    Returns structured inference result:
    - prediction: { className, confidence, ... }
    - topPredictions: [ { className, confidence }, ... ]
    - threshold: float
    - isConfident: bool
    """
    model = get_model()

    # Fast forward pass
    preds = model(batch_tensor, training=False).numpy()[0]

    # Convert to pure Python floats
    probabilities = [float(p) for p in preds]

    # Top-1 prediction
    top_idx = int(np.argmax(probabilities))
    raw_class_name = CLASS_NAMES[top_idx]
    confidence = float(probabilities[top_idx])

    # Compute Top 3 predictions
    sorted_indices = np.argsort(probabilities)[::-1][:3]
    top_predictions: List[Dict[str, Any]] = []
    for idx in sorted_indices:
        c_name = CLASS_NAMES[int(idx)]
        conf_val = float(probabilities[int(idx)])
        formatted_info = format_class_name(c_name)
        top_predictions.append({
            "className": c_name,
            "formattedName": formatted_info["formattedName"],
            "crop": formatted_info["crop"],
            "condition": formatted_info["condition"],
            "confidence": round(conf_val, 4),
            "confidencePercentage": round(conf_val * 100, 2),
            "isHealthy": formatted_info["isHealthy"]
        })

    # Class details and formatting
    main_details = format_class_name(raw_class_name)
    threshold = get_confidence_threshold()
    is_confident = confidence >= threshold

    return {
        "success": True,
        "prediction": {
            "className": raw_class_name,
            "formattedName": main_details["formattedName"],
            "crop": main_details["crop"],
            "condition": main_details["condition"],
            "severity": main_details["severity"],
            "isHealthy": main_details["isHealthy"],
            "confidence": round(confidence, 4),
            "confidencePercentage": round(confidence * 100, 2)
        },
        "topPredictions": top_predictions,
        "threshold": threshold,
        "isConfident": is_confident
    }
