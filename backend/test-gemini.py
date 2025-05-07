from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from google.generativeai import GenerativeModel
import google.generativeai as genai
import base64
import os
from dotenv import load_dotenv
import traceback
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()  # ✅ Load .env

router = APIRouter()

# Check if API key is available
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    logger.error("GEMINI_API_KEY not found in environment variables")
else:
    logger.info("GEMINI_API_KEY found in environment")

try:
    genai.configure(api_key=api_key)
    
    # List available models
    logger.info("Listing available models:")
    available_models = []
    try:
        for model_info in genai.list_models():
            available_models.append(model_info.name)
            logger.info(f"- {model_info.name}")
    except Exception as e:
        logger.error(f"Error listing models: {e}")
    
    # Try different possible model names for vision capability
    vision_model_names = [
        "gemini-pro-vision",
        "gemini-1.5-pro-vision",
        "models/gemini-pro-vision",
        "models/gemini-1.5-pro-vision"
    ]
    
    model = None
    for vision_name in vision_model_names:
        try:
            logger.info(f"Trying vision model: {vision_name}")
            model = GenerativeModel(vision_name)
            logger.info(f"✅ Successfully initialized vision model: {vision_name}")
            break
        except Exception as e:
            logger.error(f"Failed with {vision_name}: {e}")
    
    if model is None:
        logger.error("No working vision model found")
        raise Exception("Could not initialize any Gemini vision model")
    
    logger.info("Gemini model initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize Gemini model: {e}")
    model = None


@router.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")
    
    logger.info(f"Received file: {file.filename}, content type: {file.content_type}")
    
    try:
        # Check if API key is available
        if not api_key:
            raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")
        
        contents = await file.read()
        
        if not contents:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
            
        logger.info(f"File size: {len(contents)} bytes")
        
        mime_type = file.content_type
        
        if not mime_type.startswith('image/'):
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {mime_type}")
        
        # Check if we have a valid model
        if not model:
            raise HTTPException(status_code=500, detail="Gemini model not initialized")
        
        image_base64 = base64.b64encode(contents).decode("utf-8")
        image_parts = [{"mime_type": mime_type, "data": image_base64}]
        
        logger.info("Sending request to Gemini API")
        
        response = model.generate_content([
            "Analyze this medical image and explain if there's any diagnosis, abnormality, or possible suggestion:",
            image_parts
        ])
        
        logger.info("Received response from Gemini API")
        
        return JSONResponse(content={"response": response.text})
    except Exception as e:
        error_msg = str(e)
        stack_trace = traceback.format_exc()
        logger.error(f"Error processing image: {error_msg}")
        logger.error(f"Stack trace: {stack_trace}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {error_msg}")