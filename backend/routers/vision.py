# from fastapi import APIRouter, File, UploadFile, HTTPException
# from fastapi.responses import JSONResponse
# from google.generativeai import GenerativeModel
# import google.generativeai as genai
# import base64
# import os
# from dotenv import load_dotenv
# import traceback
# import logging

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# load_dotenv()  # ✅ Load .env

# router = APIRouter()

# # Check if API key is available
# api_key = os.getenv("GEMINI_API_KEY")
# if not api_key:
#     logger.error("GEMINI_API_KEY not found in environment variables")
# else:
#     logger.info("GEMINI_API_KEY found in environment")

# try:
#     genai.configure(api_key=api_key)
#     # Use the model name that worked in the test
#     # model = GenerativeModel("gemini-pro-vision")
#     model = genai.GenerativeModel("models/gemini-pro-vision")
#     logger.info("Gemini model initialized successfully")
# except Exception as e:
#     logger.error(f"Failed to initialize Gemini model: {e}")
#     model = None


# @router.post("/analyze")
# async def analyze_image(file: UploadFile = File(...)):
#     if not file:
#         raise HTTPException(status_code=400, detail="No file provided")
    
#     logger.info(f"Received file: {file.filename}, content type: {file.content_type}")
    
#     try:
#         # Check if API key is available
#         if not api_key:
#             raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")
        
#         contents = await file.read()
        
#         if not contents:
#             raise HTTPException(status_code=400, detail="Empty file uploaded")
            
#         logger.info(f"File size: {len(contents)} bytes")
        
#         mime_type = file.content_type
        
#         if not mime_type.startswith('image/'):
#             raise HTTPException(status_code=400, detail=f"Unsupported file type: {mime_type}")
        
#         # Check if we have a valid model
#         if not model:
#             raise HTTPException(status_code=500, detail="Gemini model not initialized")
        
#         image_base64 = base64.b64encode(contents).decode("utf-8")
#         image_parts = [{"mime_type": mime_type, "data": image_base64}]
        
#         logger.info("Sending request to Gemini API")
        
#         response = model.generate_content([
#             "Analyze this medical image and explain if there's any diagnosis, abnormality, or possible suggestion:",
#             image_parts
#         ])
        
#         logger.info("Received response from Gemini API")
        
#         return JSONResponse(content={"response": response.text})
#     except Exception as e:
#         error_msg = str(e)
#         stack_trace = traceback.format_exc()
#         logger.error(f"Error processing image: {error_msg}")
#         logger.error(f"Stack trace: {stack_trace}")
#         raise HTTPException(status_code=500, detail=f"Error processing image: {error_msg}")
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from google.generativeai import GenerativeModel
import google.generativeai as genai
from PIL import Image
import io
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# 🔑 Configure Gemini Vision model
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("models/gemini-2.0-flash")


@router.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    try:
        # Read file content and convert to PIL Image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))

        # Run Gemini Vision
        response = model.generate_content([
            "You are a highly experienced medical expert. Analyze this medical image and provide a clear, accurate, and detailed diagnosis.",
            {
                "mime_type": file.content_type,
                "data": contents,
            },
           "always have one section for summary for layman languages.",
            "Be concise and clear in your explanations.",
            "Use simple language that a layperson can understand.",
            "give the response may it be a little inaccurate but not too much inaccurate.",
            "Structure the output with proper section titles using UPPERCASE or indentation instead of formatting.",
            
            image
        ])


        return JSONResponse(content={"response": response.text})

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
