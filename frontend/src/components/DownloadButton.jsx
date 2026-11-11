import { useState } from 'react';
import { Download, LoaderCircle } from 'lucide-react';
import { downloadDocument } from '../services/documentApi';

export default function DownloadButton({ document }) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  async function handleDownload() {
    setDownloading(true);
    setError('');
    try {
      const blob = await downloadDocument(document.id);
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.originalName;
      window.document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="download-control">
      <button className="icon-button" type="button" onClick={handleDownload} disabled={downloading} title={`Baixar ${document.originalName}`} aria-label={`Baixar ${document.originalName}`}>
        {downloading ? <LoaderCircle className="spin" size={17} /> : <Download size={17} />}
      </button>
      {error && <span className="download-error" role="alert">{error}</span>}
    </div>
  );
}