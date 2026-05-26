from fastapi import APIRouter, HTTPException
from services.ml_models import get_predictive_scores

router = APIRouter()

@router.get("/scores")
async def get_scores():
    try:
        data = get_predictive_scores()
        if "error" in data:
            raise HTTPException(status_code=404, detail=data["error"])
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
