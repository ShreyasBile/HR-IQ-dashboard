from fastapi import APIRouter, HTTPException
from services.benchmarks import get_benchmarks

router = APIRouter()

@router.get("/")
async def get_industry_benchmarks(industry: str = "Technology"):
    try:
        data = get_benchmarks(industry)
        if "error" in data:
            raise HTTPException(status_code=404, detail=data["error"])
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
