from fastapi import APIRouter

api_router = APIRouter(prefix="/api/v1")

@api_router.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "PlantGuard AI API is healthy"}
