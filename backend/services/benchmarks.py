import pandas as pd
import os

DATA_FILE = "data/clean_data.csv"

# Static Benchmark Database
BENCHMARKS = {
    "Technology": {
        "Attrition_Rate": {"median": 15.2, "top": 8.5},
        "Engagement_Score": {"median": 72, "top": 85},
        "Salary_Increase": {"median": 5.5, "top": 8.0},
        "Performance_Rating": {"median": 3.4, "top": 4.1},
        "Time_to_Hire": {"median": 42, "top": 28}
    },
    "Finance": {
        "Attrition_Rate": {"median": 12.0, "top": 7.0},
        "Engagement_Score": {"median": 68, "top": 80},
        "Salary_Increase": {"median": 4.5, "top": 6.5},
        "Performance_Rating": {"median": 3.2, "top": 3.9},
        "Time_to_Hire": {"median": 35, "top": 24}
    },
    "Healthcare": {
        "Attrition_Rate": {"median": 18.5, "top": 12.0},
        "Engagement_Score": {"median": 65, "top": 78},
        "Salary_Increase": {"median": 3.5, "top": 5.0},
        "Performance_Rating": {"median": 3.5, "top": 4.2},
        "Time_to_Hire": {"median": 45, "top": 30}
    },
    "Retail": {
        "Attrition_Rate": {"median": 35.0, "top": 20.0},
        "Engagement_Score": {"median": 60, "top": 75},
        "Salary_Increase": {"median": 3.0, "top": 4.5},
        "Performance_Rating": {"median": 3.0, "top": 3.8},
        "Time_to_Hire": {"median": 20, "top": 14}
    },
    "Manufacturing": {
        "Attrition_Rate": {"median": 14.0, "top": 9.0},
        "Engagement_Score": {"median": 62, "top": 74},
        "Salary_Increase": {"median": 4.0, "top": 5.5},
        "Performance_Rating": {"median": 3.1, "top": 3.7},
        "Time_to_Hire": {"median": 38, "top": 25}
    }
}

def get_benchmarks(industry: str = "Technology"):
    if industry not in BENCHMARKS:
        industry = "Technology"
        
    industry_data = BENCHMARKS[industry]
    
    # Calculate company metrics
    metrics = {
        "Attrition_Rate": {"value": 0, "name": "Attrition Rate (%)", "invert": True},
        "Engagement_Score": {"value": 0, "name": "Engagement Score (/100)", "invert": False},
        "Salary_Increase": {"value": 0, "name": "Salary Increase (%)", "invert": False},
        "Performance_Rating": {"value": 0, "name": "Avg Performance (/5)", "invert": False},
        "Time_to_Hire": {"value": 0, "name": "Time to Hire (Days)", "invert": True}
    }
    
    if os.path.exists(DATA_FILE):
        df = pd.read_csv(DATA_FILE)
        
        if 'Employee_Resignation_Status' in df.columns:
            resigned = df['Employee_Resignation_Status'].apply(lambda x: 1 if str(x).lower().strip() in ['yes', '1', 'true'] else 0)
            metrics["Attrition_Rate"]["value"] = round(resigned.mean() * 100, 1)
            
        if 'Employee_Engagement_Score' in df.columns:
            metrics["Engagement_Score"]["value"] = round(df['Employee_Engagement_Score'].mean(), 1)
            
        if 'Annual_Salary_Increase_Percentage' in df.columns:
            metrics["Salary_Increase"]["value"] = round(df['Annual_Salary_Increase_Percentage'].mean(), 1)
            
        if 'Performance_Rating' in df.columns:
            metrics["Performance_Rating"]["value"] = round(df['Performance_Rating'].mean(), 2)
            
        if 'Time_to_Hire' in df.columns:
            metrics["Time_to_Hire"]["value"] = round(df['Time_to_Hire'].mean(), 1)
            
    # Calculate Gap and Status
    results = []
    for key, data in industry_data.items():
        comp_val = metrics[key]["value"]
        median = data["median"]
        top = data["top"]
        invert = metrics[key]["invert"] # True if lower is better
        
        # Calculate status
        if invert:
            if comp_val <= top:
                status = "Green"
            elif comp_val <= median:
                status = "Amber"
            else:
                status = "Red"
        else:
            if comp_val >= top:
                status = "Green"
            elif comp_val >= median:
                status = "Amber"
            else:
                status = "Red"
                
        gap = round(comp_val - median, 2)
        
        results.append({
            "metric": metrics[key]["name"],
            "company": comp_val,
            "median": median,
            "topQuartile": top,
            "gap": gap,
            "status": status
        })
        
    return {"status": "success", "industry": industry, "data": results}
