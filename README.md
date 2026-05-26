# HRIQ (Quantify) — HR Intelligence Dashboard

Full‑stack app for **HR/workforce analytics** with a FastAPI backend and a React (Vite + TypeScript) frontend.

## What’s inside

- **Dataset upload** (CSV/XLSX) and cleaning
- **Dashboard analytics** (engagement, satisfaction, attrition + charts)
- **Predictive scores** (ML-based scoring endpoint)
- **Alerts / anomalies** (simple anomaly engine)
- **AI assistant (RAG)** powered by Gemini + embeddings + Chroma (falls back to mock mode if no key)
- **Industry benchmarks**
- **Report generation** (downloads a `.docx`)

## Tech stack

- **Backend**: FastAPI + Uvicorn, Pandas/Numpy, Scikit‑learn, LangChain + Chroma + SentenceTransformers, `google-generativeai`
- **Frontend**: React + TypeScript + Vite, Tailwind, Axios, Recharts/Plotly

## Repo layout

```
.
├─ backend/                  # FastAPI app + services
├─ frontend/                 # React UI (Vite)
```

## Prerequisites

- **Python 3.10+** (recommended) and `pip`
- **Node.js 18+** and `npm`

## Quick start (run both apps locally)

### 1) Backend (FastAPI) — `http://localhost:8000`

From the repo root:

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

Create your environment file:

```bash
copy .env.template .env
```

Set `GEMINI_API_KEY` in `backend/.env`.

Start the API:

```bash
uvicorn main:app --reload --port 8000
```

API docs:
- Swagger UI: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/`

### 2) Frontend (Vite) — `http://localhost:5173`

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The backend enables CORS for `http://localhost:5173` by default.

## Backend endpoints (used by the frontend)

All endpoints are under the base URL `http://localhost:8000/api`.

- **Upload dataset**: `POST /upload/` (multipart form field `file`, accepts `.csv` or `.xlsx`)
- **Dashboard analytics**: `GET /analytics/`
- **Predictive scores**: `GET /predictive/scores`
- **Alerts / anomalies**: `GET /alerts/`
- **Assistant chat**: `POST /chat/` with JSON `{ "message": "..." }`
- **Benchmarks**: `GET /benchmarks/?industry=Technology`
- **Report download**: `POST /reports/` with JSON `{ "sections": ["Executive Summary", "Anomalies", "Benchmarking"] }` (returns a `.docx` blob)

## How data flows

- Uploading a dataset triggers cleaning and a preview response.
- The cleaned dataset is stored at `backend/data/clean_data.csv`.
- The RAG assistant (if enabled) builds/persists a vector DB at `backend/data/chroma_db`.

## Notes & troubleshooting

- **Upload first**: analytics/predictive/alerts/chat may return “No data available…” until a dataset has been uploaded.
- **Assistant “mock mode”**: if `GEMINI_API_KEY` is missing or left as `your_api_key_here`, the chat endpoint responds with a mock answer. Add a valid key in `backend/.env` to enable RAG.
- **Secrets**: keep API keys in `.env` files and avoid committing them to version control.

## Frontend details

Frontend API calls are defined in `frontend/src/services/api.ts` (base URL `http://localhost:8000/api`).

