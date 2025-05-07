from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.pdf_generator import generate_pdf
from services.email_sender import send_email_with_pdf

router = APIRouter()

class EmailRequest(BaseModel):
    email: str
    report_data: dict  # contains summary, flags, etc.

@router.post("/send-email")
async def email_report(req: EmailRequest):
    try:
        print("📩 Incoming email request for:", req.email)
        print("📄 Report data received:", req.report_data)

        pdf_bytes = generate_pdf(req.report_data)
        print("✅ PDF generated successfully.")

        send_email_with_pdf(req.email, pdf_bytes)
        print("✅ Email sent successfully.")
        return {"status": "✅ Email sent successfully!"}

    except Exception as e:
        print("❌ Email send failed:", e)
        raise HTTPException(status_code=500, detail=str(e))
