"""
PlantGuard AI - Backend API v1 Prediction Router
Delegates prediction to the ML inference engine.
"""

import sys
from pathlib import Path
from typing import Optional
from fastapi import APIRouter, File, UploadFile, HTTPException, status
from fastapi.responses import JSONResponse

# Add ml-service to path if accessible
ml_service_dir = Path(__file__).resolve().parents[4] / "ml-service"
if ml_service_dir.exists() and str(ml_service_dir) not in sys.path:
    sys.path.insert(0, str(ml_service_dir))

router = APIRouter()

try:
    from model_loader import is_model_loaded, get_model_info_summary
    from preprocessing import validate_image_bytes, preprocess_image
    from inference import predict_disease
    ML_AVAILABLE = True
except ImportError:
    ML_AVAILABLE = False


@router.get("/health")
def prediction_health():
    if not ML_AVAILABLE:
        return {"status": "degraded", "modelLoaded": False, "message": "ML modules not found"}
    return {"status": "ok", "modelLoaded": is_model_loaded()}


@router.get("/model-info")
def prediction_model_info():
    if not ML_AVAILABLE:
        return {"error": "ML modules not available"}
    return get_model_info_summary()


@router.post("")
@router.post("/")
async def run_prediction(image: Optional[UploadFile] = File(None)):
    if not ML_AVAILABLE:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ML inference engine is not available."
        )

    if image is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No image provided. Please upload an image in the 'image' field."
        )

    try:
        image_bytes = await image.read()
        pil_image = validate_image_bytes(image_bytes)
        batch_tensor = preprocess_image(pil_image)
        result = predict_disease(batch_tensor)
        return JSONResponse(status_code=200, content=result)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Error during image inference.")
