from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("loan_model.pkl")

class LoanRequest(BaseModel):
    no_of_dependents: int
    education: int
    self_employed: int
    income_annum: int
    loan_amount: int
    loan_term: int
    cibil_score: int
    residential_assets_value: int
    commercial_assets_value: int
    luxury_assets_value: int
    bank_asset_value: int

@app.post("/predict")
async def predict(data: LoanRequest):
    features = np.array([[
        data.no_of_dependents, data.education, data.self_employed,
        data.income_annum, data.loan_amount, data.loan_term,
        data.cibil_score, data.residential_assets_value,
        data.commercial_assets_value, data.luxury_assets_value,
        data.bank_asset_value
    ]])
    
    prediction = model.predict(features)
    result = "Approved" if prediction[0] == 0 else "Rejected"
    return {"status": result}