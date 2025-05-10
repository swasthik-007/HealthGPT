from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
import os
import google.generativeai as genai
from typing import List, Dict, Any, Optional
import asyncio

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

router = APIRouter()

# Keep your existing ChatRequest model for the original endpoint
class ChatRequest(BaseModel):
    prompt: str

# Add a new model for the report chat endpoint
class ReportChatRequest(BaseModel):
    message: str
    report_data: Optional[Dict[str, Any]] = None
    chat_history: Optional[List[Dict[str, str]]] = []

# Cache for storing model instances to reuse
model_cache = {}

# Keep your original chat endpoint
@router.post("/")
async def chat_with_ai(request: ChatRequest):
    model = genai.GenerativeModel("models/gemini-1.5-flash")

    query = f"""A user says: {request.prompt}
You are a friendly medical assistant. Reply with:
1. Possible causes
2. Simple advice
3. When to see a doctor."""

    response = model.generate_content(query)
    return {"reply": response.text}

# Add a new endpoint specifically for report-related chat
@router.post("/report")
async def chat_about_report(request: ReportChatRequest, background_tasks: BackgroundTasks):
    try:
        # Get or create model instance
        if "gemini_model" not in model_cache:
            model_cache["gemini_model"] = genai.GenerativeModel("models/gemini-1.5-flash")
        
        model = model_cache["gemini_model"]
        
        # Build a simplified system prompt with essential context only
        system_prompt = "You are HealthGPT, a medical assistant. "
        
        if request.report_data:
            system_prompt += f"Report summary: {request.report_data.get('summary', '')}"
            
            # Add critical warnings or diagnosis if available, but keep it brief
            if request.report_data.get('diagnosis'):
                system_prompt += f" Diagnosis: {', '.join(request.report_data['diagnosis'][:2])}"
                
            if request.report_data.get('warnings'):
                system_prompt += f" Warnings: {', '.join(request.report_data['warnings'][:2])}"
        
        # Generate response with optimized parameters
        prompt = f"""
You are HealthGPT, a friendly and professional AI medical assistant.

Context:
{system_prompt}

The user has asked: "{request.message}"

Your response should be:
- Structured clearly using short headings or line breaks.
- Empathetic and friendly in tone.
- Use emojis for clarity and emotional support (e.g., 😊, 🧠, ❤️).
- Important medical terms or advice should be written in **bold** (no asterisks or markdown).
- Do NOT use stars, asterisks, or bullet points.
- Avoid complex medical jargon; use simple language.
- Avoid disclaimers or unnecessary explanations.
- Avoid repeating the user's question or context.
-use emotes and numbering and bold 
- Use new lines to separate sections.
- Keep it to the point and easy to understand for a non-medical user.

Example format:

Possible Cause:
[Text]

Suggested Advice:
[Text with emojis]

When to See a Doctor:
[Text with bold terms and warning emojis if needed]

Now answer the user's question in this format.
"""

        
        # Set generation parameters for faster response
        generation_config = {
            "temperature": 0.7,      # Lower temperature for more focused responses
            "top_p": 0.8,            # Lower top_p for faster generation
            "top_k": 40,             # Recommended default
            "max_output_tokens": 800 # Limit response length
        }
        
        response = model.generate_content(
            prompt,
            generation_config=generation_config
        )
        
        # Format the response to keep only the relevant content
        response_text = response.text.strip()
        
        # Remove any system instruction portions if they appear in the response
        if "User question:" in response_text:
            response_text = response_text.split("User question:")[0].strip()
            
        return {"response": response_text}
    
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")