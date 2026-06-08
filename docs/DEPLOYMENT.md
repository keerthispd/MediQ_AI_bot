# Demo & Deployment

This document covers running a local demo and basic containerized deployment for the AI Medical Assistant project.

Prerequisites

- Docker & Docker Compose (for container deployment)
- Node.js + npm (for local frontend dev)
- Python 3.11 and a virtualenv (for local backend dev)

Local demo (development)

1. Backend (Python)

```bash
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

The backend will create the SQLite DB at `database/backend.db` on startup.

2. Frontend (React)

```bash
cd frontend
npm install
npm start
```

The frontend uses a proxy to forward `/api/*` to `http://localhost:8000` during development.

Containerized demo (recommended for demos)

1. Copy `.env.example` to `.env` and populate API keys and provider:

```bash
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY or GEMINI credentials
```

2. Build and run with Docker Compose:

```bash
docker compose up --build
```

This will start the backend on port `8000` and the frontend on port `3000`.

Deploying to production

- Use a production-grade ASGI server (e.g., `uvicorn` with process manager or `gunicorn` + `uvicorn` workers).
- In production, prefer serving the frontend as static files via a CDN or a web server (Nginx). The `frontend/Dockerfile` builds the static files and serves them with `serve` for convenience.
- Store sensitive keys in a secrets manager or environment variables — do not check them into source control.
- Consider using managed container services (ECS, GKE, App Service) or a vendor's PaaS and configure environment variables there.

Security & Safety

- The assistant includes a safety layer that blocks self-harm content and a red-flag detector that returns emergency guidance. Review `backend/services/safety.py` and `backend/services/redflag.py` before deploying.
- Ensure uploaded files in `uploads/` are stored securely and access-controlled.
- Limit access to the backend APIs and consider adding authentication if the app will be public.

Monitoring & Reliability

- The AI provider uses retry/backoff and honors `Retry-After`. Configure `AI_MAX_RETRIES`, `AI_BASE_BACKOFF`, and `AI_MAX_BACKOFF` via environment variables.
- Add logging and metrics for model latency, errors, and red-flag counts in production.

Further work

- Add CI (GitHub Actions) for tests and builds.
- Add infrastructure IaC templates (Terraform) for full deployments.
