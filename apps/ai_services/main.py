from fastapi import FastAPI

app = FastAPI(title="AI Services")

@app.get("/")
def read_root():
    return {"message": "AI Services API is running"}
