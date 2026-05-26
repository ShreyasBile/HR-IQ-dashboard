from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import upload
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="HRIQ Backend", version="1.0.0")

# Configure CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Default Vite port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api/upload", tags=["upload"])

from api.routes import analytics
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])

from api.routes import predictive
app.include_router(predictive.router, prefix="/api/predictive", tags=["predictive"])

from api.routes import alerts
app.include_router(alerts.router, prefix="/api/alerts", tags=["alerts"])

from api.routes import chat
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])

from api.routes import benchmarks
app.include_router(benchmarks.router, prefix="/api/benchmarks", tags=["benchmarks"])

from api.routes import reports
app.include_router(reports.router, prefix="/api/reports", tags=["reports"])

@app.get("/")
def read_root():
    return {"message": "HRIQ API is running"}
