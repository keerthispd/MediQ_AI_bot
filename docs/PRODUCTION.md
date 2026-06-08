# Production deployment notes

This file expands on production best practices for deploying the AI Medical Assistant.

CI and Docker images

- A sample CI workflow is included at `.github/workflows/ci.yml`. It installs backend dependencies and runs `pytest`, then builds Docker images for backend and frontend. Images are built locally in the Actions runner and not pushed by default.
- To push images, add registry credentials as repository secrets and update the workflow to use `docker/login-action` and set `push: true` in `docker/build-push-action` steps.

Nginx reverse proxy

- Example config: `deploy/nginx/app.conf`. It proxies `/api/` to the backend service and serves frontend static files via `try_files`.
- In production, run Nginx in front of the backend and frontend. Configure TLS (Let's Encrypt or managed certificates) and redirect HTTP to HTTPS.
- Example Docker pattern: Nginx serves static files and proxies `/api` to the backend container. Mount `uploads/` as a volume if serving uploaded files.

Secrets management

- Never store API keys in the repository. Use environment variables injected by your deployment platform or a secrets manager.
- GitHub Actions: store secrets under `Settings → Secrets and variables → Actions` and reference them as `${{ secrets.NAME }}`.
- Cloud providers: use GCP Secret Manager, AWS Secrets Manager, or Azure Key Vault for production secrets.

Observability and monitoring

- Add structured logging and export logs to a centralized system (Cloud Logging, ELK, Datadog).
- Export basic metrics: request latency, model latency, rate-limit hits, red-flag counts.
- Configure alerting for model failures, high error rates, or repeated red-flag detections.

Security

- Review the safety layer in `backend/services/safety.py` and `backend/services/redflag.py` before production.
- Limit public access to the backend APIs; add authentication or IP allowlists where appropriate.
- Secure uploaded files (don't serve sensitive uploads publicly without access controls).
