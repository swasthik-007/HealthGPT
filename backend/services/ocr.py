import fitz  # PyMuPDF
import pytesseract
from PIL import Image
import io

def extract_text_from_file(filename: str, content: bytes) -> str:
    text = ""

    if filename.endswith(".pdf"):
        doc = fitz.open(stream=content, filetype="pdf")
        for page in doc:
            page_text = page.get_text()
            if page_text.strip():
                text += page_text
            else:
                # OCR fallback if page is image
                pix = page.get_pixmap()
                img_bytes = pix.tobytes("png")
                image = Image.open(io.BytesIO(img_bytes))
                text += pytesseract.image_to_string(image)

    elif filename.lower().endswith((".png", ".jpg", ".jpeg")):
        image = Image.open(io.BytesIO(content))
        text = pytesseract.image_to_string(image)

    return text.strip()
