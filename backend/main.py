from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from datetime import datetime
from models import SearchRequest, SearchResponse
from utils import process_pst_ost_file

app = FastAPI(title="Email Search App", version="1.0.0")

# CORS for React dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/search", response_model=SearchResponse)
async def search_emails(
    file: UploadFile = File(...),
    start_time: datetime = None,
    end_time: datetime = None
):
    """Upload .pst/.ost file and search emails by date range."""
    
    # Validate file type
    if not file.filename.lower().endswith(('.pst', '.ost')):
        raise HTTPException(status_code=400, detail="Please upload a .pst or .ost file")
    
    # Default date range (last 30 days) if not provided
    if not start_time or not end_time:
        end_time = datetime.now()
        start_time = end_time.replace(day=1)  # First day of current month
    
    temp_path = f"temp_{file.filename}"
    
    try:
        # Save uploaded file
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Process file
        results = process_pst_ost_file(temp_path, start_time, end_time)
        
        return SearchResponse(results=results, total=len(results))
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")
    
    finally:
        # Clean up temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.get("/")
def root():
    return {"message": "Email Search API - Ready!"}