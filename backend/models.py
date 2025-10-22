from datetime import datetime
from pydantic import BaseModel
from typing import List

class EmailResult(BaseModel):
    date: str
    sender: str
    subject: str

class SearchRequest(BaseModel):
    start_time: datetime
    end_time: datetime

class SearchResponse(BaseModel):
    results: List[EmailResult]
    total: int