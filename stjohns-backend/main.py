from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "St John's Church API Running"}

@app.get("/api/sermons")
def get_sermons():
    return [
        {"title": "Faith in God", "date": "2026-04-01"},
        {"title": "Love and Hope", "date": "2026-03-25"}
    ]