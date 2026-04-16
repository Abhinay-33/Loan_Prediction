import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib


df = pd.read_csv('loan_approval_dataset.csv')


df.columns = df.columns.str.strip()

le_edu = LabelEncoder()
le_emp = LabelEncoder()
le_status = LabelEncoder()

df['education'] = le_edu.fit_transform(df['education'].str.strip())
df['self_employed'] = le_emp.fit_transform(df['self_employed'].str.strip())
df['loan_status'] = le_status.fit_transform(df['loan_status'].str.strip())


features = [
    'no_of_dependents', 'education', 'self_employed', 'income_annum', 
    'loan_amount', 'loan_term', 'cibil_score', 'residential_assets_value', 
    'commercial_assets_value', 'luxury_assets_value', 'bank_asset_value'
]
X = df[features]
y = df['loan_status']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)


joblib.dump(model, 'loan_model.pkl')

print("✅ Model trained successfully!")
print(f"Accuracy: {model.score(X_test, y_test):.2%}")
