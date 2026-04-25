// Thin wrapper around the fileweaver report-generation microservice.
// Configured via env vars:
//   FILEWEAVER_URL      — base URL of the API (e.g. https://...execute-api.../  or http://localhost:8080)
//   FILEWEAVER_API_KEY  — app-scoped key minted from /admin/api-keys
//
// We use the global `fetch` (Node 18+ / Lambda Java21 runtime ships it).

const baseUrl = () => (process.env.FILEWEAVER_URL || '').replace(/\/$/, '');
const apiKey = () => process.env.FILEWEAVER_API_KEY || '';

const ensureConfigured = () => {
  if (!baseUrl() || !apiKey()) {
    throw new Error('Fileweaver not configured (set FILEWEAVER_URL and FILEWEAVER_API_KEY)');
  }
};

const headers = () => ({
  'Content-Type': 'application/json',
  'X-Api-Key': apiKey(),
});

/**
 * Submit a report job. Returns whatever fileweaver returns:
 *   - 202 Accepted: { jobId, status: "QUEUED" }
 *   - 200 OK + duplicate: true: { jobId, status: "COMPLETED", downloadUrl, ... }
 */
export const submitReport = async ({ type, format, payload, forceRegenerate = false }) => {
  ensureConfigured();
  const res = await fetch(`${baseUrl()}/reports`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ type, format, forceRegenerate, payload }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = body?.message || `Fileweaver POST /reports failed (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
};

/** Poll a job by id. Returns full job object incl. status + (when COMPLETED) downloadUrl. */
export const getReportJob = async (jobId) => {
  ensureConfigured();
  const res = await fetch(`${baseUrl()}/reports/${encodeURIComponent(jobId)}`, {
    headers: headers(),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = body?.message || `Fileweaver GET /reports/${jobId} failed (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
};
