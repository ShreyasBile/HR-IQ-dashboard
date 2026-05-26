import os
import pandas as pd
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from langchain_core.prompts import PromptTemplate
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_classic.chains import create_retrieval_chain

DATA_FILE = "data/clean_data.csv"
VECTOR_DB_DIR = "data/chroma_db"

vector_store = None
rag_chain = None

def init_rag_system():
    global vector_store, rag_chain
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key or api_key == "your_api_key_here":
        print("Warning: Valid GEMINI_API_KEY not found. RAG will operate in mock mode.")
        return

    if not os.path.exists(DATA_FILE):
        return
        
    try:
        df = pd.read_csv(DATA_FILE)
        
        # Create narrative descriptions of the dataset for embedding
        documents = []
        
        # Overall Summary
        summary = f"The dataset contains {len(df)} employee records. "
        if 'Department' in df.columns:
            summary += f"Departments include: {', '.join(df['Department'].unique())}. "
        documents.append(Document(page_content=summary, metadata={"source": "overview"}))
        
        # Dept summaries and Attrition
        if 'Department' in df.columns and 'Employee_Resignation_Status' in df.columns:
            df['Resigned'] = df['Employee_Resignation_Status'].apply(lambda x: 1 if str(x).lower().strip() in ['yes', '1', 'true'] else 0)
            dept_attrition = df.groupby('Department')['Resigned'].mean() * 100
            for dept, rate in dept_attrition.items():
                documents.append(Document(page_content=f"The {dept} department has an attrition/turnover rate of {rate:.1f}%.", metadata={"source": "department_attrition"}))

        # Rich Statistical Context
        try:
            # 1. Statistical Describe
            stats = df.describe().to_string()
            documents.append(Document(page_content=f"Statistical summary (mean, min, max, percentiles) of all numerical columns in the dataset:\n{stats}", metadata={"source": "statistics"}))
            
            # 2. Correlation Matrix
            numeric_df = df.select_dtypes(include=['number'])
            corr = numeric_df.corr().to_string()
            documents.append(Document(page_content=f"Correlation matrix showing the relationship between all numerical columns (e.g., Performance, Engagement, Salary):\n{corr}", metadata={"source": "correlation"}))
            
            # 3. Departmental Averages
            if 'Department' in df.columns:
                dept_stats = df.groupby('Department').mean(numeric_only=True).to_string()
                documents.append(Document(page_content=f"Average metric values grouped by Department:\n{dept_stats}", metadata={"source": "department_stats"}))
                
            # 4. Job Title Averages
            if 'Job_Title' in df.columns:
                job_stats = df.groupby('Job_Title').mean(numeric_only=True).to_string()
                documents.append(Document(page_content=f"Average metric values grouped by Job Title/Role:\n{job_stats}", metadata={"source": "job_stats"}))
        except Exception as data_e:
            print(f"Warning: Could not generate some statistical context: {data_e}")
        
        embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        
        # Chroma DB
        vector_store = Chroma.from_documents(documents, embeddings, persist_directory=VECTOR_DB_DIR)
        
        llm = ChatGoogleGenerativeAI(model="gemini-flash-latest", temperature=0)
        
        prompt = PromptTemplate.from_template(
            """You are the HRIQ AI Assistant, an expert HR analyst. Use the following retrieved context about the company's workforce dataset to answer the user's question. 
            If you don't know the answer based on the context, say so, but you can also provide general HR best practices if relevant.
            
            Context:
            {context}
            
            Question:
            {input}
            
            Answer:"""
        )
        
        document_chain = create_stuff_documents_chain(llm, prompt)
        retriever = vector_store.as_retriever(search_kwargs={"k": 6})
        rag_chain = create_retrieval_chain(retriever, document_chain)
        print("RAG system initialized successfully.")
        
    except Exception as e:
        print(f"Failed to initialize RAG: {e}")

# Initialize on import
init_rag_system()

def ask_question(question: str):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your_api_key_here":
        # Mock mode
        return {
            "answer": f"[Mock Mode] I am the HRIQ Assistant. You asked: '{question}'. Please configure the GEMINI_API_KEY in the backend .env file to enable live RAG analysis.",
            "sources": []
        }
        
    if not rag_chain:
        # Try re-init
        init_rag_system()
        if not rag_chain:
            return {"answer": "The RAG system is not initialized. Please ensure the dataset is uploaded.", "sources": []}
            
    try:
        response = rag_chain.invoke({"input": question})
        
        sources = []
        if 'context' in response:
            for doc in response['context']:
                src = doc.metadata.get('source', 'Unknown')
                if src not in sources:
                    sources.append(src)
                    
        return {
            "answer": response["answer"],
            "sources": sources
        }
    except Exception as e:
        return {"error": str(e)}
