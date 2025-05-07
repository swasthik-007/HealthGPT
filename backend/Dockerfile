# Use a slim Python image
FROM python:3.10-slim

# Install system dependencies for Tesseract and PDF handling
RUN apt-get update && \
    apt-get install -y tesseract-ocr libtesseract-dev poppler-utils && \
    apt-get clean

# Set the working directory
WORKDIR /app

# Copy all project files
COPY . .
COPY .env .  

# Install Python dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt

# Expose port (FastAPI default)
EXPOSE 8000

# Run FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

