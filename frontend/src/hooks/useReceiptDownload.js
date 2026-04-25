import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { requestReceipt, getReceiptStatus } from '../services/appointmentApi';

const POLL_MS = 5000;

/**
 * Per-appointment receipt download state machine.
 *
 *   idle      ← nothing happening yet
 *   loading   ← we asked the backend, waiting for fileweaver
 *   ready     ← downloadUrl in hand, click to download
 *   error     ← failure, retry by clicking again
 */
export const useReceiptDownload = (appointmentId) => {
  const { token } = useContext(AppContext);
  const [state, setState] = useState('idle');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const pollTimer = useRef(null);

  const stopPolling = useCallback(() => {
    if (pollTimer.current) {
      clearInterval(pollTimer.current);
      pollTimer.current = null;
    }
  }, []);

  useEffect(() => () => stopPolling(), [stopPolling]);

  const startPolling = useCallback(
    (jobId) => {
      stopPolling();
      pollTimer.current = setInterval(async () => {
        try {
          const data = await getReceiptStatus(token, appointmentId, jobId);
          if (data.ready && data.downloadUrl) {
            setDownloadUrl(data.downloadUrl);
            setState('ready');
            stopPolling();
          } else if (data.status === 'FAILED') {
            setState('error');
            stopPolling();
            toast.error('Receipt generation failed. Try again.');
          }
        } catch (err) {
          // Transient errors during polling — keep going up to a couple retries.
          console.warn('Receipt poll error:', err?.message);
        }
      }, POLL_MS);
    },
    [appointmentId, token, stopPolling],
  );

  const start = useCallback(async () => {
    if (state === 'loading') return;
    setState('loading');
    setDownloadUrl(null);
    try {
      const data = await requestReceipt(token, appointmentId);
      if (data.ready && data.downloadUrl) {
        setDownloadUrl(data.downloadUrl);
        setState('ready');
      } else if (data.jobId) {
        startPolling(data.jobId);
      } else {
        setState('error');
        toast.error(data.message || 'Could not start receipt generation.');
      }
    } catch (err) {
      setState('error');
      toast.error(err?.response?.data?.message || err.message || 'Failed to request receipt.');
    }
  }, [appointmentId, token, state, startPolling]);

  const download = useCallback(() => {
    if (!downloadUrl) return;
    // Direct navigation — fileweaver's presigned URL includes
    // Content-Disposition: attachment, so the browser downloads instead of
    // rendering inline. This also avoids the cross-origin fetch path that
    // hit CORS errors against LocalStack S3.
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [downloadUrl]);

  return { state, start, download, downloadUrl };
};
