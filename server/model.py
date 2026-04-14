import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

# 1. Load the dataset (Use the exact name of your file)
df = pd.read_csv('loan_approval_dataset.csv')

# 2. Clean column names (Removes hidden spaces like ' education' -> 'education')
df.columns = df.columns.str.strip()

# 3. Encode Categorical Columns (Strings to Numbers)
le_edu = LabelEncoder()
le_emp = LabelEncoder()
le_status = LabelEncoder()

df['education'] = le_edu.fit_transform(df['education'].str.strip())
df['self_employed'] = le_emp.fit_transform(df['self_employed'].str.strip())
df['loan_status'] = le_status.fit_transform(df['loan_status'].str.strip())

# Save encoders if you want to use them later, or just remember the mapping:
# education: Graduate=0, Not Graduate=1 (usually)
# loan_status: Approved=0, Rejected=1

# 4. Define Features and Target
features = [
    'no_of_dependents', 'education', 'self_employed', 'income_annum', 
    'loan_amount', 'loan_term', 'cibil_score', 'residential_assets_value', 
    'commercial_assets_value', 'luxury_assets_value', 'bank_asset_value'
]
X = df[features]
y = df['loan_status']

# 5. Split and Train
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 6. Save the model
joblib.dump(model, 'loan_model.pkl')

print("✅ Model trained successfully!")
print(f"Accuracy: {model.score(X_test, y_test):.2%}")
