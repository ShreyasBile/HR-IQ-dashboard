from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import io
from services.preprocessing import clean_dataset

router = APIRouter()

@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith(('.csv', '.xlsx')):
        raise HTTPException(status_code=400, detail="Only CSV and Excel files are supported")
        
    try:
        contents = await file.read()
        df, log, schema = clean_dataset(contents, file.filename)
        
        # Convert clean dataframe to dict for preview (first 100 rows)
        preview = df.head(100).to_dict(orient='records')
        
        return {
            "filename": file.filename,
            "status": "success",
            "log": log,
            "schema": schema,
            "preview": preview,
            "total_rows": df.shape[0],
            "total_columns": df.shape[1]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
