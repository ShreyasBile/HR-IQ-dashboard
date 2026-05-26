from fastapi import APIRouter, HTTPException
from services.analytics import get_analytics

router = APIRouter()

@router.get("/")
async def get_dashboard_analytics():
    try:
        data = get_analytics()
        if "error" in data:
            raise HTTPException(status_code=404, detail=data["error"])
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
