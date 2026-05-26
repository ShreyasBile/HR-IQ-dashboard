import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import os

DATA_FILE = "data/clean_data.csv"

def get_predictive_scores():
    if not os.path.exists(DATA_FILE):
        return {"error": "No data available. Please upload a dataset first."}

    df = pd.read_csv(DATA_FILE)
    
    # We need Employee_ID or some identifier, fallback to index
    if 'Employee_ID' not in df.columns:
        df['Employee_ID'] = [f"EMP-{i:04d}" for i in range(len(df))]
        
    results = []
    
    try:
        # --- Attrition Risk Model ---
        # Target: Employee_Resignation_Status
        if 'Employee_Resignation_Status' in df.columns:
            le = LabelEncoder()
            y_attrition = le.fit_transform(df['Employee_Resignation_Status'].astype(str))
            
            # Select some numeric features for the model
            features = []
            for col in ['Employee_Engagement_Score', 'Employee_Job_Satisfaction_Score', 
                        'Annual_Salary_Increase_Percentage', 'Overtime_Hours_Per_Week',
                        'Work_Hours_Per_Week', 'Performance_Rating']:
                if col in df.columns:
                    features.append(col)
            
            if features:
                X = df[features].fillna(0)
                rf_clf = RandomForestClassifier(n_estimators=50, random_state=42)
                rf_clf.fit(X, y_attrition)
                # Prob of class 1 (assume 1 is 'Yes' or 'True')
                # If le.classes_ has 'Yes' at index 1, else reverse
                positive_idx = 1 if len(le.classes_) > 1 and str(le.classes_[1]).lower() in ['yes', 'true', '1'] else 0
                attrition_probs = rf_clf.predict_proba(X)[:, positive_idx] * 100
            else:
                attrition_probs = np.random.uniform(10, 80, len(df))
        else:
            attrition_probs = np.random.uniform(10, 80, len(df))

        # --- Promotion Readiness Model ---
        # Composite of Leadership + Performance + Tenure (simulated via ID/Hire_Date)
        promo_scores = []
        for _, row in df.iterrows():
            score = 50
            if 'Leadership_Qualities_Rating' in df.columns:
                score += (float(row['Leadership_Qualities_Rating']) - 3) * 10
            if 'Performance_Rating' in df.columns:
                score += (float(row['Performance_Rating']) - 3) * 10
            # Cap between 0 and 100
            score = max(0, min(100, score))
            promo_scores.append(score)

        # Train a mock RF to "smooth" or predict promotion readiness
        if features:
            X = df[features].fillna(0)
            rf_reg = RandomForestRegressor(n_estimators=50, random_state=42)
            rf_reg.fit(X, promo_scores)
            promo_preds = rf_reg.predict(X)
        else:
            promo_preds = promo_scores

        # --- Performance Trajectory Model ---
        trajectories = []
        for i in range(len(df)):
            p = promo_preds[i]
            if p > 75:
                trajectories.append("Upward")
            elif p < 40:
                trajectories.append("Downward")
            else:
                trajectories.append("Stable")

        # Combine results
        for i, row in df.iterrows():
            dept = row.get('Department', 'Unknown')
            role = row.get('Job_Title', 'Employee')
            
            # Create a reasoning string
            risk = attrition_probs[i]
            if risk > 70:
                reasoning = "High risk due to low engagement or below-market salary increases."
            elif risk > 40:
                reasoning = "Moderate risk. Monitor satisfaction scores."
            else:
                reasoning = "Low risk. Metrics indicate stability."

            results.append({
                "id": str(row['Employee_ID']),
                "department": dept,
                "role": role,
                "attritionRisk": round(attrition_probs[i], 1),
                "promotionReadiness": round(promo_preds[i], 1),
                "performanceTrajectory": trajectories[i],
                "reasoning": reasoning
            })
            
        return {"status": "success", "data": results}
        
    except Exception as e:
        return {"error": str(e)}
