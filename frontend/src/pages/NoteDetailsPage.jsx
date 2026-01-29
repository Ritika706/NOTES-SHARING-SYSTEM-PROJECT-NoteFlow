import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { isLoggedIn } from '../lib/auth';
import { toastError, toastInfo, toastSuccess } from '../lib/toast';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Avatar } from '../components/Avatar';

export default function NoteDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/api/notes/${id}`);
        setNote(res.data.note);
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load note');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const previewUrl = useMemo(() => {
    if (!note?.filePath) return null;
    const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${base}/uploads/${note.filePath}`;
  }, [note]);

  async function download() {
    if (!isLoggedIn()) {
      toastInfo('Login required to download.');
      navigate('/auth?mode=login');
      return;
    }

    try {
      const res = await api.get(`/api/notes/${id}/download`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: res.headers['content-type'] || 'application/octet-stream' });

      const disposition = res.headers['content-disposition'] || '';
      const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(disposition);
      const fileName = decodeURIComponent(match?.[1] || match?.[2] || note?.originalName || 'note');

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toastSuccess('Download started!');
    } catch (e) {
      toastError(e?.response?.data?.message || 'Download failed');
    }
  }

  if (loading) return <div>Loading…</div>;
  if (error) return <div className="rounded-xl border border-destructive/20 bg-white/70 p-3 text-sm text-destructive">{error}</div>;
  if (!note) return null;

  const mime = note.mimeType || '';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-primary/10"
        >
          ← Back
        </Link>
      </div>

      <Card className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-primary">{note.title}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="primary">{note.subject}</Badge>
              <Badge>{`Semester ${note.semester}`}</Badge>
            </div>
            <div className="mt-4 flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
              <Avatar name={note?.uploadedBy?.name || 'User'} />
              <div>
                <div className="font-medium text-slate-800 dark:text-slate-100">Uploaded by {note?.uploadedBy?.name || 'Unknown'}</div>
                <div className="text-xs">{note?.uploadedBy?.email || ''}</div>
              </div>
            </div>
            {note.description ? (
              <p className="mt-4 text-sm text-slate-700 dark:text-slate-200">{note.description}</p>
            ) : null}
          </div>

          <div className="w-full md:w-72">
            <Button
              className="w-full bg-gradient-to-r from-accent to-accent/80"
              onClick={download}
            >
              Download
            </Button>
            {!isLoggedIn() ? (
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Login required for download tracking.
              </div>
            ) : null}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="font-display text-lg font-semibold">Preview</div>
        {!previewUrl ? (
          <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">No preview available.</div>
        ) : mime.includes('pdf') ? (
          <iframe title="pdf" src={previewUrl} className="mt-4 h-[72vh] w-full rounded-xl border border-slate-200/70 dark:border-white/10" />
        ) : mime.startsWith('image/') ? (
          <a href={previewUrl} target="_blank" rel="noreferrer" className="block mt-4">
            <img
              alt="preview"
              src={previewUrl}
              className="max-h-[72vh] w-full rounded-xl border border-slate-200/70 dark:border-white/10 object-contain hover:opacity-95 transition"
            />
          </a>
        ) : (
          <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            This file type can’t be previewed in the browser ({mime}). Please download.
          </div>
        )}
      </Card>
    </div>
  );
}
