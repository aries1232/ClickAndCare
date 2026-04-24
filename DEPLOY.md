# Deployment

Three **manual-only** release workflows (trigger from GitHub Actions → Run workflow). No auto-deploy on push.

| Target | Where | Workflow |
|---|---|---|
| `frontend/` | Vercel | `.github/workflows/release-frontend.yml` |
| `admin/` | Vercel (separate project) | `.github/workflows/release-admin.yml` |
| `backend/` REST API | AWS Lambda + API Gateway (Serverless Framework) | `.github/workflows/release-backend.yml` |
| `backend/` Socket.IO | **Stays on an always-on host** (Render/Fly/EC2) | not in this repo's CI |

## Env files: local vs production

Each app has three env layers. The `.env.example` file in each folder lists the variables — copy it to `.env` locally and fill in real values.

| App | Local dev (gitignored) | Production source |
|---|---|---|
| `frontend/` | `frontend/.env` | Vercel project env vars |
| `admin/` | `admin/.env` | Vercel project env vars |
| `backend/` | `backend/.env` | GitHub repo secrets → forwarded into Lambda by the deploy workflow |

Vite-specific note: the frontend and admin use `import.meta.env.DEV` to force `/api/*` and `/socket.io/*` through the **Vite proxy in dev**, regardless of what `.env` contains. So setting `VITE_BACKEND_URL` locally is a no-op — it only matters in the production build.

## Why the Socket.IO split

AWS Lambda cannot hold persistent WebSocket connections. The REST API ships to Lambda; the Socket.IO server has to run somewhere always-on. The frontend and admin connect to the two origins via two env vars:

- `VITE_BACKEND_URL` — the Lambda API Gateway URL (for `/api/*`)
- `VITE_SOCKET_URL` — the Socket.IO host (for `/socket.io/*`)

Both are ignored in dev (Vite proxy handles everything).

---

## First-time setup

### 1. Vercel projects (one each for `frontend/` and `admin/`)

In each project's Vercel dashboard:

- **Root Directory** → `frontend` / `admin`
- **Framework Preset** → Vite
- **Environment Variables** (Production):
  - `VITE_BACKEND_URL` = `https://<your-api-id>.execute-api.<region>.amazonaws.com`
  - `VITE_SOCKET_URL` = `https://<your-socket-host>` (e.g. your existing Render URL)
  - `VITE_GOOGLE_CLIENT_ID` = …
  - `VITE_STRIPE_KEY_ID` = …

Then run once locally to link the project and grab the IDs:

```
cd frontend && vercel link
# .vercel/project.json is created; its projectId + orgId are the values you
# need for GitHub secrets below.
```

Repeat for `admin/`.

### 2. AWS IAM user for Serverless

Create an IAM user with programmatic access and either `AdministratorAccess` (easiest) or the scoped Serverless permissions doc. Capture the **access key ID** and **secret access key**.

### 3. Socket.IO host

Keep your current Render deployment (or Fly.io / EC2 / whatever). No CI for it here — just let it follow `main` from Render's own Git integration. It only needs to serve `/socket.io/*`; the REST routes on it become dormant.

---

## GitHub repository secrets

Settings → Secrets and variables → Actions → **New repository secret**:

### Vercel
| Secret | Value |
|---|---|
| `VERCEL_TOKEN` | Account → Settings → Tokens → Create |
| `VERCEL_ORG_ID` | from `.vercel/project.json` |
| `VERCEL_PROJECT_ID_FRONTEND` | `projectId` of the frontend Vercel project |
| `VERCEL_PROJECT_ID_ADMIN` | `projectId` of the admin Vercel project |

### AWS (GitHub secrets)
| Secret | Value |
|---|---|
| `AWS_ACCESS_KEY_ID` | from IAM user |
| `AWS_SECRET_ACCESS_KEY` | from IAM user |
| `AWS_REGION` | e.g. `ap-south-1` (optional — defaults to ap-south-1) |

### Doppler (GitHub secret + Doppler project)
Runtime env vars live in a Doppler project (`clickandcare-backend`, config `prd`). The workflow pulls them at deploy time, so they never touch GitHub.

**GitHub secret:**
| Secret | Value |
|---|---|
| `DOPPLER_TOKEN` | Doppler → `clickandcare-backend` → **Access → Service Tokens** → create one scoped to the `prd` config (read-only) |

**Doppler `clickandcare-backend` / prd config should contain:**

- `MONGODB_URI` (Mongo Atlas conn string, **no trailing `/dbname`** — code appends `/Click&Care`)
- `JWT_SECRET` (long random string)
- `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_SECRET_KEY`
- `STRIPE_SECRET_KEY` (`sk_live_…` or `sk_test_…`)
- `EMAIL_USER`, `EMAIL_PASSWORD`
- `FRONTEND_URL` (prod frontend, for CORS + Stripe return URLs)
- `ADMIN_URL` (prod admin, for CORS)

---

## Running a release

Everything is manual — there's no auto-deploy on push. Each app has its own workflow so you can ship them independently.

### Frontend (patient site)
GitHub → **Actions** → **Build & Release — frontend (Vercel)** → **Run workflow**
- **environment**: `production` or `preview`
- Runs `vercel pull` → `vercel build` → `vercel deploy` inside `frontend/`.

### Admin (doctor/admin panel)
GitHub → **Actions** → **Build & Release — admin (Vercel)** → **Run workflow**
- **environment**: `production` or `preview`
- Runs the same steps inside `admin/`.

### Backend (REST API on Lambda)
GitHub → **Actions** → **Build & Release — backend (AWS Lambda)** → **Run workflow**
- **stage**: `production` or `staging`
- **confirm**: type `release` (guard against accidental clicks)
- Runs `npm ci --omit=dev` → `serverless deploy --stage <stage>` — packages + uploads to S3, updates Lambda and API Gateway.

Cold start is ~500–900 ms (Mongo connection cached across warm invocations).

---

## Caveats

- **API Gateway payload limit**: 10 MB. Cloudinary uploads cap at 5 MB (already enforced), safe.
- **Lambda timeout**: 29 s (API Gateway hard cap 30 s).
- **File uploads on Lambda**: `multer` uses `/tmp`. Lambda `/tmp` is 512 MB by default — fine for chat images.
- **Mongo connection timeouts**: `serverSelectionTimeoutMS: 5000`, `bufferCommands: false`. If Mongo is down the request fails fast (5s) instead of hitting Lambda's 29s timeout.
- **Dev-only routes** (`/api/debug/*`, `/api/user/reset-unread-counts`) are gated behind `NODE_ENV !== 'production'` and are not mounted in Lambda.
- **Socket CORS**: because the socket host is on a different origin from the Vercel-served frontend/admin, the Socket.IO server's CORS allow-list (`backend/config/cors.js`) must include the prod frontend + admin URLs. Already does.
