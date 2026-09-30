"""
PlantGuard AI - Centralized Class Names Definition
Single source of truth for the 15 PlantVillage disease classification classes.
The order MUST match the index order used during model training.
"""

CLASS_NAMES = [
    "Pepper__bell___Bacterial_spot",
    "Pepper__bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Tomato_Bacterial_spot",
    "Tomato_Early_blight",
    "Tomato_Late_blight",
    "Tomato_Leaf_Mold",
    "Tomato_Septoria_leaf_spot",
    "Tomato_Spider_mites_Two_spotted_spider_mite",
    "Tomato__Target_Spot",
    "Tomato__Tomato_YellowLeaf__Curl_Virus",
    "Tomato__Tomato_mosaic_virus",
    "Tomato_healthy"
]

NUM_CLASSES = len(CLASS_NAMES)


def format_class_name(raw_name: str) -> dict:
    """
    Format a raw dataset class name into user-friendly crop and disease names.
    Examples:
        - "Tomato_Early_blight" -> {"crop": "Tomato", "condition": "Early Blight", "formattedName": "Tomato Early Blight"}
        - "Pepper__bell___Bacterial_spot" -> {"crop": "Bell Pepper", "condition": "Bacterial Spot", "formattedName": "Pepper Bell — Bacterial Spot"}
        - "Tomato__Tomato_YellowLeaf__Curl_Virus" -> {"crop": "Tomato", "condition": "Yellow Leaf Curl Virus", "formattedName": "Tomato Yellow Leaf Curl Virus"}
        - "Tomato_healthy" -> {"crop": "Tomato", "condition": "Healthy Plant", "formattedName": "Tomato Healthy"}
    """
    is_healthy = "healthy" in raw_name.lower()
    
    # Custom mappings for known class names
    display_mapping = {
        "Pepper__bell___Bacterial_spot": ("Bell Pepper", "Bacterial Spot", "Pepper Bell - Bacterial Spot", "severe"),
        "Pepper__bell___healthy": ("Bell Pepper", "Healthy Plant", "Pepper Bell - Healthy", "healthy"),
        "Potato___Early_blight": ("Potato", "Early Blight", "Potato Early Blight", "moderate"),
        "Potato___Late_blight": ("Potato", "Late Blight", "Potato Late Blight", "severe"),
        "Potato___healthy": ("Potato", "Healthy Plant", "Potato Healthy", "healthy"),
        "Tomato_Bacterial_spot": ("Tomato", "Bacterial Spot", "Tomato Bacterial Spot", "severe"),
        "Tomato_Early_blight": ("Tomato", "Early Blight", "Tomato Early Blight", "moderate"),
        "Tomato_Late_blight": ("Tomato", "Late Blight", "Tomato Late Blight", "severe"),
        "Tomato_Leaf_Mold": ("Tomato", "Leaf Mold", "Tomato Leaf Mold", "mild"),
        "Tomato_Septoria_leaf_spot": ("Tomato", "Septoria Leaf Spot", "Tomato Septoria Leaf Spot", "moderate"),
        "Tomato_Spider_mites_Two_spotted_spider_mite": ("Tomato", "Two-Spotted Spider Mite", "Tomato Two-Spotted Spider Mite", "moderate"),
        "Tomato__Target_Spot": ("Tomato", "Target Spot", "Tomato Target Spot", "moderate"),
        "Tomato__Tomato_YellowLeaf__Curl_Virus": ("Tomato", "Yellow Leaf Curl Virus", "Tomato Yellow Leaf Curl Virus", "severe"),
        "Tomato__Tomato_mosaic_virus": ("Tomato", "Mosaic Virus", "Tomato Mosaic Virus", "moderate"),
        "Tomato_healthy": ("Tomato", "Healthy Plant", "Tomato Healthy", "healthy"),
    }

    if raw_name in display_mapping:
        crop, condition, formatted_name, default_severity = display_mapping[raw_name]
        return {
            "crop": crop,
            "condition": condition,
            "formattedName": formatted_name,
            "severity": default_severity,
            "isHealthy": is_healthy
        }

    # Fallback heuristic formatter
    cleaned = raw_name.replace("___", " - ").replace("__", " ").replace("_", " ").strip()
    return {
        "crop": cleaned.split()[0] if cleaned else "Plant",
        "condition": cleaned,
        "formattedName": cleaned,
        "severity": "healthy" if is_healthy else "moderate",
        "isHealthy": is_healthy
    }
