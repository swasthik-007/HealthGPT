from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import report, analyze, email, chat, vision  # 👈 added vision

import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("ANALYZE ROUTE LOADED ✅")

app.include_router(report.router, prefix="/report")
app.include_router(analyze.router, prefix="/analyze", tags=["analyze"])
app.include_router(email.router, prefix="", tags=["email"])
app.include_router(chat.router, prefix="/chat")
app.include_router(vision.router, prefix="/vision", tags=["vision"])  # 👈 added

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
