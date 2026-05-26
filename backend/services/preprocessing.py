import pandas as pd
import numpy as np
import io

import google.generativeai as genai
import os
import json

def detect_schema_gemini(df: pd.DataFrame) -> dict:
    """Use Gemini API to identify column roles."""
    api_key = os.getenv("GEMINI_API_KEY")
    
    # Fallback to mock if key is missing or invalid placeholder
    if not api_key or api_key == "your_api_key_here":
        print("Warning: Valid GEMINI_API_KEY not found. Falling back to mock schema detection.")
        return _detect_schema_mock(df)
        
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Take a small sample of the dataframe
        sample_df = df.head(5)
        csv_sample = sample_df.to_csv(index=False)
        
        prompt = f"""
        Analyze the following CSV sample of HR data and classify each column into one of the following roles:
        - Junk (e.g., Unnamed, index columns)
        - Identifier (e.g., Employee ID, Name)
        - Outcome (e.g., Status, Performance Rating, Churn)
        - Feature (e.g., Age, Department, Salary)

        Return the classification as a pure JSON object where the keys are the column names and the values are the assigned roles. Do not wrap the JSON in markdown code blocks.

        CSV Data:
        {csv_sample}
        """
        
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(response_mime_type="application/json")
        )
        
        schema = json.loads(response.text)
        return schema
    except Exception as e:
        print(f"Error calling Gemini API: {e}. Falling back to mock detection.")
        return _detect_schema_mock(df)

def _detect_schema_mock(df: pd.DataFrame) -> dict:
    """Mock LLM schema detection to identify column roles (Fallback)."""
    schema = {}
    for col in df.columns:
        dtype = str(df[col].dtype)
        if 'Unnamed' in col:
            schema[col] = 'Junk'
        elif 'ID' in col.upper():
            schema[col] = 'Identifier'
        elif 'Status' in col or 'Outcome' in col or 'Performance' in col:
            schema[col] = 'Outcome'
        else:
            schema[col] = 'Feature'
    return schema

def clean_dataset(file_bytes: bytes, filename: str):
    """
    Reads the file, runs schema detection, preprocessing, and returns the 
    clean DataFrame along with an audit log.
    """
    log = []
    log.append(f"Received file: {filename}")
    
    if filename.endswith('.csv'):
        df = pd.read_csv(io.BytesIO(file_bytes))
    else:
        df = pd.read_excel(io.BytesIO(file_bytes))
        
    initial_shape = df.shape
    log.append(f"Initial shape: {initial_shape[0]} rows, {initial_shape[1]} columns")
    
    schema = detect_schema_gemini(df)
    log.append("Schema detection completed.")
    
    # Drop junk
    junk_cols = [c for c, role in schema.items() if role == 'Junk']
    if junk_cols:
        df.drop(columns=junk_cols, inplace=True)
        log.append(f"Dropped {len(junk_cols)} junk columns: {junk_cols}")
        
    # Impute missing values
    missing_before = df.isnull().sum().sum()
    if missing_before > 0:
        for col in df.columns:
            if df[col].isnull().sum() > 0:
                if pd.api.types.is_numeric_dtype(df[col]):
                    median_val = df[col].median()
                    df[col] = df[col].fillna(median_val)
                    log.append(f"Imputed missing values in '{col}' with median: {median_val}")
                else:
                    mode_val = df[col].mode()[0]
                    df[col] = df[col].fillna(mode_val)
                    log.append(f"Imputed missing values in '{col}' with mode: {mode_val}")
    else:
        log.append("No missing values detected.")
        
    log.append(f"Final shape: {df.shape[0]} rows, {df.shape[1]} columns")
    
    # Save the cleaned dataset for analytics
    import os
    os.makedirs("data", exist_ok=True)
    df.to_csv("data/clean_data.csv", index=False)
    log.append("Saved cleaned dataset for analytics.")
    
    return df, log, schema
