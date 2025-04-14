from fastapi import FastAPI, Request
import joblib
import numpy as np

app = FastAPI()

model = joblib.load('credit_model.pkl')

@app.post("/predict")
async def predict(request: Request):
    data = await request.json()

    features = np.array([[
        data['externalScore'],
        data['repaymentHistory'],
        data['hospitalTrustScore'],
        data['loanFrequency'],
        data['billAmount']
    ]])

    prediction = model.predict(features)[0]

    return {"prediction": int(prediction)}
