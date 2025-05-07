from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.langgraph_agents import run_health_pipeline

router = APIRouter()

class AnalyzeRequest(BaseModel):
    text: str

@router.post("/")
async def analyze_report(request: AnalyzeRequest):
    try:
        result = run_health_pipeline(request.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
