# Deployment

Three targets, all automated on push to `main`:

| Target | Where | Deploy workflow |
|---|---|---|
| `frontend/` | Vercel | `.github/workflows/deploy-frontend.yml` |
| `admin/` | Vercel (separate project) | same workflow (matrix) |
| `backend/` REST API | AWS Lambda + API Gateway (Serverless Framework) | `.github/workflows/deploy-backend.yml` |
| `backend/` Socket.IO | **Stays on an always-on host** (Render/Fly/EC2) | not in this repo's CI |

## Why the Socket.IO split

AWS Lambda cannot hold persistent WebSocket connections. The REST API ships to Lambda; the Socket.IO server has to run somewhere always-on. The frontend and admin connect to the two origins via two env vars:

- `VITE_BACKEND_URL` — the Lambda API Gateway URL (for `/api/*`)
- `VITE_SOCKET_URL` — the Socket.IO host (for `/socket.io/*`)

Both are empty in dev (Vite proxy handles everything).

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

### AWS / Serverless
| Secret | Value |
|---|---|
| `AWS_ACCESS_KEY_ID` | from IAM user |
| `AWS_SECRET_ACCESS_KEY` | from IAM user |
| `AWS_REGION` | e.g. `ap-south-1` (optional — defaults to ap-south-1) |
| `MONGODB_URI` | your Mongo Atlas connection string (**no trailing `/dbname`** — the code appends `/Click&Care`) |
| `JWT_SECRET` | strong random string |
| `CLOUDINARY_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | |
| `CLOUDINARY_SECRET_KEY` | |
| `STRIPE_SECRET_KEY` | `sk_live_…` or `sk_test_…` |
| `EMAIL_USER` | SMTP sender |
| `EMAIL_PASSWORD` | SMTP app password |
| `FRONTEND_URL` | prod frontend URL (for CORS + Stripe return URLs) |
| `ADMIN_URL` | prod admin URL (for CORS) |

---

## Manual deploy (no push)

- Frontend + admin → GitHub → **Actions** → **Deploy frontends (Vercel)** → Run workflow
- Backend → GitHub → **Actions** → **Deploy backend (AWS Lambda)** → Run workflow (optionally pick a stage other than `production`)

---

## What happens on push to `main`

### Frontend (`frontend/**` or `admin/**` changed)
1. Checkout + Node 20 + `npm ci` per app (matrix)
2. `vercel pull` → `vercel build --prod` → `vercel deploy --prebuilt --prod`
3. Both apps deploy in parallel

### Backend (`backend/**` changed)
1. Checkout + Node 20 + `npm ci --omit=dev`
2. Install `serverless@3`
3. `serverless deploy --stage production` — packages + uploads to S3, updates the Lambda and API Gateway

Cold start is ~500–900 ms (Mongo connection cached across warm invocations).

---

## Caveats

- **API Gateway payload limit**: 10 MB. Cloudinary uploads cap at 5 MB (already enforced), safe.
- **Lambda timeout**: 29 s (API Gateway hard cap 30 s).
- **File uploads on Lambda**: `multer` uses `/tmp`. Lambda `/tmp` is 512 MB by default — fine for chat images.
- **Mongo connection timeouts**: `serverSelectionTimeoutMS: 5000`, `bufferCommands: false`. If Mongo is down the request fails fast (5s) instead of hitting Lambda's 29s timeout.
- **Dev-only routes** (`/api/debug/*`, `/api/user/reset-unread-counts`) are gated behind `NODE_ENV !== 'production'` and are not mounted in Lambda.
- **Socket CORS**: because the socket host is on a different origin from the Vercel-served frontend/admin, the Socket.IO server's CORS allow-list (`backend/config/cors.js`) must include the prod frontend + admin URLs. Already does.
