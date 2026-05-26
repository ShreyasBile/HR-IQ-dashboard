import pandas as pd
import os

DATA_FILE = "data/clean_data.csv"

def get_analytics():
    if not os.path.exists(DATA_FILE):
        return {"error": "No data available. Please upload a dataset first."}

    df = pd.read_csv(DATA_FILE)

    # 1. Overview Stats
    total_employees = len(df)
    
    # Engagement and Satisfaction
    avg_engagement = 0
    if 'Employee_Engagement_Score' in df.columns:
        avg_engagement = round(df['Employee_Engagement_Score'].mean(), 2)
        
    avg_satisfaction = 0
    if 'Employee_Job_Satisfaction_Score' in df.columns:
        avg_satisfaction = round(df['Employee_Job_Satisfaction_Score'].mean(), 2)

    # Resignation Rate
    resignation_rate = 0
    if 'Employee_Resignation_Status' in df.columns:
        # Convert Yes/No to boolean
        resignations = df['Employee_Resignation_Status'].apply(lambda x: 1 if str(x).lower().strip() == 'yes' else 0).sum()
        resignation_rate = round((resignations / total_employees) * 100, 2) if total_employees > 0 else 0

    # 2. Demographics - Department Distribution
    department_distribution = {}
    if 'Department' in df.columns:
        dept_counts = df['Department'].value_counts()
        department_distribution = {
            "labels": dept_counts.index.tolist(),
            "values": dept_counts.values.tolist()
        }

    # 3. Demographics - Education Level
    education_distribution = {}
    if 'Highest_Education_Level' in df.columns:
        edu_counts = df['Highest_Education_Level'].value_counts()
        education_distribution = {
            "labels": edu_counts.index.tolist(),
            "values": edu_counts.values.tolist()
        }

    # 4. Performance vs Engagement (Sample 1000 for performance reasons)
    performance_engagement = {}
    if 'Performance_Rating' in df.columns and 'Employee_Engagement_Score' in df.columns:
        sample_df = df.dropna(subset=['Performance_Rating', 'Employee_Engagement_Score'])
        if len(sample_df) > 1000:
            sample_df = sample_df.sample(1000)
        performance_engagement = {
            "performance": sample_df['Performance_Rating'].tolist(),
            "engagement": sample_df['Employee_Engagement_Score'].tolist()
        }
        
    # 5. Job Title Distribution
    job_title_distribution = {}
    if 'Job_Title' in df.columns:
        title_counts = df['Job_Title'].value_counts()
        job_title_distribution = {
            "labels": title_counts.index.tolist(),
            "values": title_counts.values.tolist()
        }

    # Generating a mock "Intelligence Summary"
    insights = [
        f"The current workforce consists of {total_employees} employees.",
        f"Overall employee engagement is at {avg_engagement}/100.",
        f"The attrition rate is {resignation_rate}%, which requires attention if it exceeds industry benchmarks.",
    ]
    if department_distribution and len(department_distribution["labels"]) > 0:
        top_dept = department_distribution["labels"][0]
        insights.append(f"The largest department is {top_dept}.")

    return {
        "status": "success",
        "overview": {
            "totalEmployees": total_employees,
            "avgEngagement": avg_engagement,
            "avgSatisfaction": avg_satisfaction,
            "resignationRate": resignation_rate
        },
        "charts": {
            "departmentDistribution": department_distribution,
            "educationDistribution": education_distribution,
            "performanceEngagement": performance_engagement,
            "jobTitleDistribution": job_title_distribution
        },
        "insights": insights
    }
