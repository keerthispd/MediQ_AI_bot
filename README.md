# AI Medical Assistant Bot

Project scaffold for the AI Medical Assistant (React frontend + FastAPI backend + SQLite).

Structure

medical-assistant/
├── frontend/        # React
│   ├── src/
│   └── components/
├── backend/         # FastAPI
│   ├── routes/
│   ├── models/
│   ├── services/
│   └── utils/
├── database/
├── uploads/
├── docs/
└── README.md

Quick start (backend)

1. Create a venv and install requirements:

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

Frontend: open `frontend/` and run your preferred React bootstrap (e.g. create-react-app).

Frontend quick start

1. From `frontend/` install dependencies and start:

```bash
cd frontend
npm install
npm start
```

The frontend includes a proxy to `http://localhost:8000` so API calls to `/api/*` will be forwarded to the backend during development.

Demo & deployment

See `docs/DEPLOYMENT.md` for detailed local demo and Docker Compose deployment instructions.

AI integration

1. Set `OPENAI_API_KEY` in your environment before starting the backend.
2. The backend will call the OpenAI Chat Completions endpoint for non-blocked messages.

Provider selection

- To use OpenAI (default): set `AI_PROVIDER=openai` and `OPENAI_API_KEY`.
- To use Gemini (or another provider): set `AI_PROVIDER=gemini`, and provide `GEMINI_API_URL` and `GEMINI_API_KEY`.

The Gemini integration expects a POST endpoint at `GEMINI_API_URL` that accepts a JSON body containing the prompt. The response parsing is best-effort — adjust `backend/services/ai_provider.py` if your provider uses a different schema.

Retry and backoff

The AI provider implements retry and exponential backoff for transient errors and HTTP 429/5xx responses. Configure via environment variables:

- `AI_MAX_RETRIES` (default `3`)
- `AI_BASE_BACKOFF` (seconds, default `0.5`)
- `AI_MAX_BACKOFF` (seconds, default `10`)

The provider will also honor a `Retry-After` header when present.

