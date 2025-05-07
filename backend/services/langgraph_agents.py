import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
import re

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("models/gemini-1.5-flash")  # ✅ updated model

def run_health_pipeline(text: str) -> dict:
    prompt = f"""
You are a medical AI assistant trained to analyze lab reports and generate comprehensive, helpful health insights for patients in India.

Based on the report below, generate a detailed analysis in this JSON format:

{{
  "summary": "One-paragraph summary of the overall health condition.",
  "diagnosis": ["Clear medical conditions or flags with explanation"],
  "warnings": ["Health risks or consequences if ignored"],
  "remedies": ["Indian natural remedies (e.g., spinach for iron, sunlight for Vitamin D)"],
  "lifestyle_changes": ["Diet, exercise, or sleep improvements"],
  "medicine_suggestions": ["Common OTC meds or supplements (if safe to mention)"],
  "explanation": {{
    "Hemoglobin": "Carries oxygen, low levels may cause fatigue.",
    "Vitamin D": "Essential for bone health, low levels can cause weakness.",
    ...
  }}
}}

Only output the JSON. Now analyze this report:

{text}
"""



    try:
        response = model.generate_content(prompt)
        result_text = response.text.strip()

        # Try to find JSON within the response using regex
        match = re.search(r'{.*}', result_text, re.DOTALL)
        if not match:
            raise ValueError("No JSON found in Gemini output")

        json_data = json.loads(match.group())
        return json_data

    except Exception as e:
        print("❌ Error parsing Gemini output:", e)
        return {
            "summary": "Could not analyze the report.",
            "flags": [],
            "remedies": [],
            "explanation": {}
        }
