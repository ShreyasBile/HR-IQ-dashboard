from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.rag_chatbot import ask_question

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/")
async def chat(request: ChatRequest):
    try:
        data = ask_question(request.message)
        if "error" in data:
            raise HTTPException(status_code=500, detail=data["error"])
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
