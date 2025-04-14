from sklearn.ensemble import RandomForestClassifier
import joblib
import numpy as np

X = np.array([
    [650, 100, 90, 2, 50000],  
    [480, 30, 50, 5, 100000],  
    [720, 95, 90, 1, 30000],   
])


y = np.array([1, 0, 1])

model = RandomForestClassifier()

model.fit(X, y)

joblib.dump(model, 'credit_model.pkl')

print("✅ Model saved as credit_model.pkl")
