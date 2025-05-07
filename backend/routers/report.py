from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from services.ocr import extract_text_from_file
import os
from fastapi.responses import StreamingResponse
from io import BytesIO
from pydantic import BaseModel
from services.pdf_generator import generate_pdf

router = APIRouter()

@router.post("/upload")
async def upload_report(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        text = extract_text_from_file(file.filename, contents)

        if not text:
            raise HTTPException(status_code=400, detail="No text extracted.")

        return JSONResponse(content={"text": text})

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

class DownloadRequest(BaseModel):
    report_data: dict

@router.post("/download")
async def download_pdf(req: DownloadRequest):
    try:
        if not req.report_data or not isinstance(req.report_data, dict):
            raise HTTPException(status_code=400, detail="Invalid or missing report data.")
        
        pdf_bytes = generate_pdf(req.report_data)
        return StreamingResponse(
            BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=HealthGPT_Report.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")
