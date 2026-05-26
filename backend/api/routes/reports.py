import os
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List
from services.report_generator import generate_report

router = APIRouter()

class ReportRequest(BaseModel):
    sections: List[str]

@router.post("/")
async def create_report(request: ReportRequest):
    print(f"Creating report for sections: {request.sections}")
    try:
        report_path = generate_report(request.sections)
        print(f"Report generated at: {report_path}")
        if not os.path.exists(report_path):
            raise HTTPException(status_code=500, detail="Failed to generate report.")
            
        return FileResponse(
            path=report_path,
            filename="HRIQ_Intelligence_Report.docx",
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
    except Exception as e:
        print(f"Error in create_report: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
