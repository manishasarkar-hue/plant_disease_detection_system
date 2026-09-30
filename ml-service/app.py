"""
PlantGuard AI - FastAPI ML Inference Microservice
Serves the EfficientNetB0 plant disease classification model.
"""

import sys
import logging
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, File, UploadFile, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging with safe formatting
logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("plantguard-ml")

from model_loader import load_model_instance, is_model_loaded, get_model_info_summary
from preprocessing import validate_image_bytes, preprocess_image
from inference import predict_disease


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Load the model once at server startup and warm it up in memory.
    """
    logger.info("[Startup] Initializing PlantGuard ML Inference Service...")
    try:
        load_model_instance()
        logger.info("[Startup] PlantGuard EfficientNetB0 model ready for inference.")
    except Exception as exc:
        logger.error(f"[Startup] Failed to load model: {exc}", exc_info=True)
    yield
    logger.info("[Shutdown] PlantGuard ML Inference Service stopped.")


app = FastAPI(
    title="PlantGuard ML Inference API",
    description="Real-time plant disease detection powered by EfficientNetB0 (15 classes)",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend and server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "service": "PlantGuard ML Inference Service",
        "version": "1.0.0",
        "status": "online",
        "modelLoaded": is_model_loaded(),
        "endpoints": {
            "predict": "POST /api/predict",
            "health": "GET /api/health",
            "modelInfo": "GET /api/model-info"
        }
    }


@app.get("/health")
@app.get("/api/health")
def health_check():
    """
    Health check verifying that the ML service and model are active.
    """
    loaded = is_model_loaded()
    return {
        "status": "ok" if loaded else "degraded",
        "modelLoaded": loaded
    }


@app.get("/model-info")
@app.get("/api/model-info")
def model_info():
    """
    Return high-level model metadata without exposing filesystem internals.
    """
    return get_model_info_summary()


@app.post("/predict")
@app.post("/api/predict")
async def predict_endpoint(image: Optional[UploadFile] = File(None)):
    """
    Predict plant disease from uploaded image.
    Expects multipart/form-data with field name 'image'.
    """
    if image is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No image file provided. Please attach a plant leaf image in the 'image' form field."
        )

    # Validate content type if provided
    content_type = (image.content_type or "").lower()
    if content_type and not (content_type.startswith("image/") or content_type == "application/octet-stream"):
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Invalid file type. Please upload a valid image file (JPG, PNG, WEBP)."
        )

    try:
        # Read image bytes
        image_bytes = await image.read()

        # Validate image format and dimensions
        pil_image = validate_image_bytes(image_bytes)

        # Preprocess image
        batch_tensor = preprocess_image(pil_image)

        # Run inference
        result = predict_disease(batch_tensor)

        return JSONResponse(status_code=status.HTTP_200_OK, content=result)

    except ValueError as ve:
        logger.warning(f"Validation error: {ve}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as exc:
        logger.error(f"Inference error: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong while analyzing your image. Please try again."
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=False)
