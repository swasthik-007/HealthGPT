import google.generativeai as genai
import base64
from dotenv import load_dotenv

import os
# load_dotenv()
# Load your Gemini Pro Vision API Key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("models/gemini-pro-vision")

def analyze_medical_image(image_bytes: bytes) -> str:
    try:
        response = model.generate_content(
            [
                "This is a medical image. Please explain any possible observations or findings.",
                {
                    "mime_type": "image/jpeg",
                    "data": image_bytes,
                },
            ]
        )
        return response.text
    except Exception as e:
        raise Exception(f"Failed to analyze image: {e}")
