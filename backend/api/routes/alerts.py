from fastapi import APIRouter, HTTPException
from services.anomaly_engine import get_anomalies

router = APIRouter()

@router.get("/")
async def get_alerts():
    try:
        data = get_anomalies()
        if "error" in data:
            raise HTTPException(status_code=404, detail=data["error"])
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
