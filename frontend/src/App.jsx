import { useCallback, useEffect, useState } from 'react';
import { Files, RefreshCw } from 'lucide-react';
import DocumentList from './components/DocumentList';
import UploadComponent from './components/UploadComponent';
import { listDocuments } from './services/documentApi';
import './App.css';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setDocuments(await listDocuments());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-mark" aria-hidden="true"><Files size={20} /></div>
        <div className="brand-name">DMS <span> / </span> Documentos</div>
        <span className="topbar-label">GESTÃO DE DOCUMENTOS</span>
      </header>

      <main className="workspace">
        <div className="page-heading">
          <div>
            <p className="eyebrow">ÁREA DE TRABALHO <span>/</span> ARQUIVOS</p>
            <h1>Documentos</h1>
            <p className="page-description">Seus arquivos, organizados em um só lugar.</p>
          </div>
          <div className="document-count"><span className="status-dot" /> {documents.length} {documents.length === 1 ? 'documento' : 'documentos'}</div>
        </div>

        <div className="workspace-grid">
          <aside className="upload-panel">
            <div className="section-label"><span>01</span> ADICIONAR DOCUMENTO</div>
            <h2>Novo upload</h2>
            <p className="section-description">Arquivo e responsável</p>
            <UploadComponent onUploaded={loadDocuments} />
          </aside>

          <section className="documents-panel" aria-labelledby="documents-heading">
            <div className="list-heading">
              <div>
                <div className="section-label"><span>02</span> ARQUIVOS</div>
                <h2 id="documents-heading">Todos os documentos</h2>
              </div>
              <button className="icon-button" type="button" title="Atualizar lista" aria-label="Atualizar lista" onClick={loadDocuments} disabled={loading}>
                <RefreshCw size={17} />
              </button>
            </div>
            <DocumentList documents={documents} loading={loading} error={error} onRetry={loadDocuments} />
          </section>
        </div>
      </main>
      <footer className="footer"><span>DMS <span className="footer-separator">/</span> GESTÃO DE DOCUMENTOS</span><span>ARMAZENAMENTO LOCAL</span></footer>
    </div>
  );
}
