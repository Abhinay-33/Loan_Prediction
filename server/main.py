from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import os

app = FastAPI(title="Loan Prediction API")

# Enable CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoanData(BaseModel):
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

model_path = "loan_model.pkl"
if os.path.exists(model_path):
    model = joblib.load(model_path)
else:
    model = None
    print("⚠️ Warning: loan_model.pkl not found. Please run train.py first.")

@app.get("/")
def read_root():
    return {"message": "Loan Prediction API is running"}

@app.post("/predict")
async def predict_loan(data: LoanData):
    if model is None:
        return {"error": "Model not loaded on server"}

    # 3. Create the input array in the exact order the model was trained
    input_features = np.array([[
        data.no_of_dependents,
        data.education,
        data.self_employed,
        data.income_annum,
        data.loan_amount,
        data.loan_term,
        data.cibil_score,
        data.residential_assets_value,
        data.commercial_assets_value,
        data.luxury_assets_value,
        data.bank_asset_value
    ]])
    
    # 4. Generate prediction
    prediction = model.predict(input_features)
    
    # In most LabelEncoders for this dataset: 0 = Approved, 1 = Rejected
    # Verify this with your train.py output
    status = "Approved" if prediction[0] == 0 else "Rejected"
    
    return {
        "status": status,
        "prediction_code": int(prediction[0])
    }